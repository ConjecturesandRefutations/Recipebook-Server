const express = require("express");
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
const router = express.Router();
const User = require("../models/User.model");

const fileUploader = require("../config/cloudinary.config");

const multer = require('multer');

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  next();
});


router.post("/user/upload", fileUploader.single("image"), (req, res, next) => {
  console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.

  res.json({ fileUrl: req.file.path });
});

router.put("/users", (req, res, next) => {
  const { image } = req.body; 
  const userId = req.payload._id;

  User.findByIdAndUpdate(userId, { image }, { new: true})
    .then( ({_id, image}) => res.json({_id, image})) 
    .catch(err => console.error(err))
});

router.get("/users", (req, res, next) => {
  const userId = req.payload._id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        throw new Error("User not found");
      }

      // Set cache control header to cache the response for 10 seconds
      res.set("Cache-Control", "public, max-age=10");

      // Send the user object as a response
      res.json(user);
    })
    .catch(err => next(err));
});

module.exports = router;
