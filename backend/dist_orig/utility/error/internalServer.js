"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpError_1 = __importDefault(require("./httpError"));
class InteralServer extends httpError_1.default {
    constructor() {
        super(500, 'Internal Server Error');
        Object.setPrototypeOf(this, InteralServer.prototype);
    }
}
exports.default = InteralServer;
