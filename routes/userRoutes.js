const { Router } = require('express');
const userRouter = Router();
const userController = require('../controllers/userController');
const { passport } = require('../config/passport');
const multer = require('multer');
const path = require('node:path');
const fs = require('fs');
const uploadPath = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads'); 
        cb(null, uploadPath); 
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
      }
});

const upload = multer({ storage });

userRouter.get('/', passport.authenticate('jwt', { session: false }), userController.getUsers);
userRouter.get('/:id', userController.getUser);
userRouter.get('/username/:username', 
    userController.getUserByUsername);
userRouter.put('/', 
    passport.authenticate('jwt', {session: false}),
    upload.single('profilePicture'),
    userController.updateUser)

module.exports = userRouter;
