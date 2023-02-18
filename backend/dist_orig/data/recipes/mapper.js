"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeMapper = void 0;
/** Mapper method that maps User Entity to User DB entity and vice versa */
const RecipeMapper = class {
    /** Mapping from User DB Entity to User Entity  */
    static fromDB(d) {
        return {
            recipeID: d[0].recipe_id,
            name: d[0].name,
        };
    }
    static toDB(recipe_id, name) {
        return {
            recipeID: recipe_id,
            name: name,
        };
    }
};
exports.RecipeMapper = RecipeMapper;
