class request {
    body = {};
    userId = null;

    constructor(body, userId) {
        this.body = body;
        this.userId = userId;
    }
    static fromRestRequest(req) {
        return new request(req.body, req.body.userId);
    }
}

export = request;