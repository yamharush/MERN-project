"use strict";
class request {
    constructor(body, userId) {
        this.body = {};
        this.userId = null;
        this.body = body;
        this.userId = userId;
    }
    static fromRestRequest(req) {
        return new request(req.body, req.body.userId);
    }
}
module.exports = request;
//# sourceMappingURL=request.js.map