const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { passport, prisma } = require('./config/passport');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');
const messageRouter = require('./routes/messageRoutes');
const followerRouter = require('./routes/followerRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());

// Static file serving
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from /public
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from /uploads

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/follower', passport.authenticate('jwt', { session: false }), followerRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);

// Inject io into request and use it in routes that need real-time events
app.use('/message', (req, res, next) => {
  req.io = io; // Attach Socket.IO instance to the request
  next();
}, passport.authenticate('jwt', { session: false }), messageRouter);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Error handling
app.use((req, res, next) => {
  next(createError(404));
});

const PORT = proccess.env.PORT || 3000;

// Server listening
server.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;