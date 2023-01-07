const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        members: {
            type: [String],
        },
    },
    { timestamps: true }
);

export = mongoose.model("chat", chatSchema);