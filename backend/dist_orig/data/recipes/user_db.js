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
exports.getUserExists = exports.deleteUser = exports.getUser = exports.updateRecipe = exports.createRecipe = void 0;
function createRecipe(name, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        let recipe = yield service.recipeRepo.create(name);
        res.send(JSON.stringify(recipe) + '\n');
        service.userRepo.getUsersTable();
    });
}
exports.createRecipe = createRecipe;
function updateRecipe(name, recipe_id, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        let recipe = yield service.userRepo.update(name, recipe_id);
        res.send(JSON.stringify(recipe) + '\n');
        service.userRepo.getUsersTable();
    });
}
exports.updateRecipe = updateRecipe;
function getUser(recipe_id, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        let recipe = yield service.recipeRepo.getRecipeByID(recipe_id).catch(err => {
            throw err;
        });
        res.send(JSON.stringify(recipe) + '\n');
    });
}
exports.getUser = getUser;
function deleteUser(recipe_id, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        service.recipeRepo.delete(recipe_id).catch(err => {
            throw err;
        });
        res.send('Deleted User #' + recipe_id + '\n');
    });
}
exports.deleteUser = deleteUser;
function getUserExists(name, res, service) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield service.recipeRepo.exists(name).catch(err => {
            throw err;
        });
        res.send(result + '\n');
    });
}
exports.getUserExists = getUserExists;
