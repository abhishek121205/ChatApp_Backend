import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jsonServer from 'json-server';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import { setupSocketIO } from './controllers/socketController.js';

const __filename = fileURLToPath(import.meta.url);
// console.log(__filename);

const __dirname = dirname(__filename);
// console.log(__dirname);

const dbPath = join(__dirname, 'db', 'db.json');
// console.log(dbPath);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: 'http://localhost:5173',
    origin: 'https://chatapp-frontend-rtfn.onrender.com',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// JSON Server setup
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();
app.use(middlewares);
app.use(router);
app.set('db', router.db);
// Socket.IO setup
setupSocketIO(io, router.db);

// Start server
const PORT = 8080;
httpServer.listen(PORT, (err) => {
  if(!err){
    console.log(`Server running on port: http://localhost:${PORT}`);
  }
});
