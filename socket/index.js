const dotenv = require('dotenv');
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const mongoose = require('mongoose');
const Message = require('./models/messageSchema.js');
const { Server } = require("socket.io");

dotenv.config({ path: '../config/config.env' });
const mongoDB = process.env.MONGO_URI;

// mongoDB connection established
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('database connected');
}).catch(err => console.log(err))

app.use(cors());
app.set('port', 8900);
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on("join_room", async (data) => {
        socket.join(data);
        try {
            const messages = await Message.find({ roomId: data });
            socket.emit('history', messages);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("send_message", async (data) => {
        const message = new Message(data);
        await message.save();
        socket.to(data.roomId).emit('receive_message', message);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(8900, async () => {
    console.log(`Socket server is running at 8900`);
});