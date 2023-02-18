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
const mapper_1 = require("./mapper");
/** The User Repo persists and fetches object from DB */
class UserRepo {
    constructor(psql) {
        this.psql = psql;
    }
    /** DB INTERACTIONS */
    /** Checks if user exists in DB */
    exists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT EXISTS (SELECT 1 FROM users WHERE name='${name}')`;
            let conn = this.psql;
            return new Promise(resolve => {
                conn.query(query, function (err, result) {
                    if (err)
                        console.log(err);
                    resolve(result.rows[0].exists);
                });
            });
        });
    }
    /** Deletes user in DB */
    delete(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `DELETE FROM users WHERE user_id=${userID}`;
            yield this.psql.query(query, function (err) {
                if (err)
                    throw err;
            });
        });
    }
    /** Creates user in DB*/
    create(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = this.psql;
            let query = `INSERT INTO users (name) VALUES ('${name}')`;
            return new Promise(resolve => {
                conn.query(query, function (err, result) {
                    if (err)
                        throw err;
                    resolve({
                        userID: JSON.parse(JSON.stringify(result)).insertId,
                        name: JSON.stringify(name),
                    });
                });
            });
        });
    }
    update(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = this.psql;
            let query = `UPDATE users SET name='${name}' WHERE user_id='${id}'`;
            conn.query(query);
            return yield this.getUserByID(id);
        });
    }
    /** Get user by userID */
    getUserByID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = this.psql;
            return new Promise(function (resolve, reject) {
                let query = `SELECT * FROM users WHERE user_id=${userID}`;
                conn.query(query, (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(mapper_1.UserMapper.fromDB(results.rows));
                });
            });
        });
    }
    getUsersTable() {
        return __awaiter(this, void 0, void 0, function* () {
            this.psql.query('SELECT * FROM users', function (err, result) {
                if (err)
                    throw err;
                console.log(result.rows);
            });
        });
    }
}
exports.default = UserRepo;
