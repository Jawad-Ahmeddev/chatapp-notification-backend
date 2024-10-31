const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const messageRoute = require('./routes/messageRoute');

const server = http.createServer(app);
const allowedOrigins = [
    'https://chatapp-notofication-frontend.vercel.app',
    'https://chatapp-notofication-frontend.vercel.app/login'
];

const io = socketIo(server, {
    cors: {
        origin: allowedOrigins, // Replace with your Angular app URL
        methods: ['GET', 'POST'],
        credentials: true
    }
});
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/chats', require('./routes/chatRoute'));
app.use('/api/messages', messageRoute);

require('./socket/chatSocket')(io);

const connectDb = require('./config/db')
connectDb();
const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log("The server is running on port " + port);
});
