class response {
    body: any = {};
    userId = null;
    err = null;
    constructor(body, userId, err) {
        this.body = body;
        this.userId = userId;
        this.err = err;
    }
    sendRestResponse(res) {
        if (this.err == null) {
            res.status(200).send({
                status: "OK",
                post: this.body,
            });
        } else {
            res.status(this.err.code).send({
                status: "fail",
                message: this.err.message,
            });
        }
    }
}
export = response;