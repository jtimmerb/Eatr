"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
/** Mapper method that maps User Entity to User DB entity and vice versa */
const UserMapper = class {
    /** Mapping from User DB Entity to User Entity  */
    static fromDB(d) {
        return {
            userID: d[0].user_id,
            name: d[0].name,
        };
    }
    static toDB(user_id, name) {
        return {
            userID: user_id,
            name: name,
        };
    }
};
exports.UserMapper = UserMapper;
