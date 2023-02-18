"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const httpError_1 = __importDefault(require("./httpError"));
const internalServer_1 = __importDefault(require("./internalServer"));
class ErrorHandler {
}
exports.default = ErrorHandler;
_a = ErrorHandler;
ErrorHandler.errorHandler = (error, req, res, next) => {
    console.log(error);
    if (error instanceof httpError_1.default) {
        res.status(error.getCode()).send(error.serialize());
    }
    else if (error.name === 'UnauthorizedError') {
        res.status(401).send(error);
    }
    else {
        const serverError = new internalServer_1.default();
        res.status(serverError.getCode()).send(serverError.serialize());
    }
};
ErrorHandler.errorWrapper = (handler) => {
    const wrapped = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield handler(req, res, next);
        }
        catch (error) {
            next(error);
        }
    });
    return wrapped;
};
