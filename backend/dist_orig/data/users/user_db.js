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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserExists = exports.deleteUser = exports.getUser = exports.updateUser = exports.createUser = void 0;
function createUser(name, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield service.userRepo.create(name);
        res.send(JSON.stringify(user) + '\n');
        service.userRepo.getUsersTable();
    });
}
exports.createUser = createUser;
function updateUser(name, user_id, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield service.userRepo.update(name, user_id);
        res.send(JSON.stringify(user) + '\n');
        service.userRepo.getUsersTable();
    });
}
exports.updateUser = updateUser;
function getUser(user_id, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield service.userRepo.getUserByID(user_id).catch(err => {
            throw err;
        });
        res.send(JSON.stringify(user) + '\n');
    });
}
exports.getUser = getUser;
function deleteUser(user_id, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        service.userRepo.delete(user_id).catch(err => {
            throw err;
        });
        res.send('Deleted User #' + user_id + '\n');
    });
}
exports.deleteUser = deleteUser;
function getUserExists(name, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield service.userRepo.exists(name).catch(err => {
            throw err;
        });
        res.send(result + '\n');
    });
}
exports.getUserExists = getUserExists;
