const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables. The main Nebulo wrapper uses the repo-root
// .env.local, so load it here too when running chat-git-main directly.
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local'), override: false });
dotenv.config({ path: path.resolve(__dirname, '.env'), override: false });
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Expose io globally for routes
globalThis.__nebuloChatIo = io;

// Configuration
const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  appDebug: process.env.APP_DEBUG === 'true'
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
if (!fs.existsSync(config.uploadPath)) {
  fs.mkdirSync(config.uploadPath, { recursive: true });
}

// Start automation agent
try {
  if (process.env.ENABLE_AUTOMATION === 'true') {
    const automation = require('./services/agents/automation');
    automation.startAllJobs()
      .then(result => console.log('Automation agents started:', result.message))
      .catch(err => console.error('Error starting automation agents:', err));
  }
} catch (error) {
  console.warn('Automation not configured:', error.message);
}

// API routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/tlk', require('./routes/tlk'));
app.use('/api/network', require('./routes/network'));
app.use('/api/ai', require('./routes/ai'));

function mountOptionalRoute(basePath, modulePath) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    app.use(basePath, require(modulePath));
  } catch (error) {
    console.warn(`Optional route disabled (${basePath}): ${error.message}`);
  }
}

mountOptionalRoute('/api/shop', './routes/shop');
mountOptionalRoute('/api/marketplace', './routes/marketplace');
mountOptionalRoute('/api/openbullet', './routes/openbullet');

// Serve uploaded files with authentication middleware
const auth = require('./middleware/auth');
app.use('/api/uploads', auth, express.static(config.uploadPath));

// Serve static frontend (vanilla HTML/CSS/JS)
const clientPublicDir = path.resolve(__dirname, 'client', 'public');
app.use(express.static(clientPublicDir));
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(clientPublicDir, 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a chat room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });
  
  // Leave a chat room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });
  
  // Send message to a room
  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });
  
  // User typing indicator
  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user_typing', data);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Debug mode logging
if (config.appDebug) {
  console.log('Debug mode enabled');
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Start server
server.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});
