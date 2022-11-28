"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../controllers/post"));
const auth_1 = __importDefault(require("../controllers/auth"));
router.get('/', auth_1.default.authenticateMiddleware, post_1.default.getAllPosts);
router.get('/:id', auth_1.default.authenticateMiddleware, post_1.default.getPostById);
router.post('/', auth_1.default.authenticateMiddleware, post_1.default.addNewPost);
router.put('/:id', auth_1.default.authenticateMiddleware, post_1.default.updatePostById);
module.exports = router;
//# sourceMappingURL=post_route.js.map