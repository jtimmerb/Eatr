"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
class db_conn {
    constructor(db_host, db_user, db_pwd, db_name, db_port) {
        this.db_connection = new pg_1.default.Pool({
            host: db_host,
            user: db_user,
            password: db_pwd,
            port: db_port,
            database: db_name,
        });
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.db_connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
}
exports.default = db_conn;
