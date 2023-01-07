"use strict";
const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
    members: {
        type: [String],
    },
}, { timestamps: true });
module.exports = mongoose.model("chat", chatSchema);
//# sourceMappingURL=chat_model.js.map