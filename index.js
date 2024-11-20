const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/User')
const Painting = require('./models/Paintings')

const multer = require('multer');


const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/artists")
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

    const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created');
}


    // Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// POST Route to Upload Image and Save Data
app.post('/upload', upload.single('image'), async (req, res) => {
    const { imageName, imagePrice } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; // Image path in the server

    const newPainting = new Painting({
        name: imageName,
        price: imagePrice,
        imageUrl
    });

    try {
        await newPainting.save();
        res.status(200).json({ message: 'Painting uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading painting.', error });
    }
});

// Serve Static Files (images in uploads folder)
app.use('/uploads', express.static('uploads'));




// GET Route to Retrieve All Paintings
// Route to fetch all uploaded paintings
app.get('/paintings', async (req, res) => {
    try {
        const paintings = await Painting.find(); // Get all paintings from MongoDB
        res.status(200).json(paintings); // Return paintings as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching paintings', error });
    }
});




//   login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("success")
                } else {
                    res.json("Password incorrect")
                }
            } else {
                res.json("User not found")
            }
        })
})

//   register

app.post('/register', (req, res) => {
    UserModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: Registration failed'))
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});