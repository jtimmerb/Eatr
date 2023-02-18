"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repo_1 = __importDefault(require("../data/users/repo"));
const repo_2 = __importDefault(require("../data/recipes/repo"));
class EatrService {
    constructor(app, psql) {
        this.app = app;
        this.userRepo = new repo_1.default(psql);
        this.recipeRepo = new repo_2.default(psql);
    }
    listen(port) {
        this.app.listen(port, () => console.log('Server running'));
    }
}
exports.default = EatrService;
