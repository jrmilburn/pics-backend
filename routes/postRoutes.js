const { Router } = require('express');
const postRouter = Router();
const postController = require('../controllers/postController');    
const { passport } = require('../config/passport');
const multer = require('multer');
const path = require('node:path');
const fs = require('fs');
const uploadPath = path.join(__dirname, '../uploads');

// Create the uploads directory if it doesn't exist
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

postRouter.get('/', postController.getAllPosts);
postRouter.post('/', 
    passport.authenticate('jwt', {session: false}), 
    upload.single('image'),
    postController.createPost);

postRouter.post('/:postId/like', passport.authenticate('jwt', {session: false}), postController.likePost);
postRouter.delete('/:postId/like', passport.authenticate('jwt', {session: false}), postController.unlikePost);

module.exports = postRouter;