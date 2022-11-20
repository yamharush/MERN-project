"use strict";
const getAllMessages = (req, res, next) => {
    res.send('get all messages');
};
const addNewMessage = (req, res, next) => {
    res.send('add new message');
};
module.exports = { getAllMessages, addNewMessage };
//# sourceMappingURL=message.js.map