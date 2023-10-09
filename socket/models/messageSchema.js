const mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
    },
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    messageBody: {
        type: String,
    },
    time: {
        type: String,
    }
});

const Message = mongoose.model("message", messageSchema);
module.exports = { Message };