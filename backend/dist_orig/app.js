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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_conn_1 = __importDefault(require("./data/db_conn"));
const service_1 = __importDefault(require("./service/service"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_config_1 = require("./db.config");
const user_db_1 = require("./data/users/user_db");
const app = (0, express_1.default)();
let database = new db_conn_1.default(db_config_1.db_auth.db_host, db_config_1.db_auth.db_user, db_config_1.db_auth.db_pwd, db_config_1.db_auth.db_name, db_config_1.db_auth.db_port);
let service = new service_1.default(app, database);
service.listen(8080);
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello world');
});
app.post('/create_user', (req, res) => {
    (0, user_db_1.createUser)(req.body.name, res, service);
});
app.put('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, user_db_1.updateUser)(req.body.name, req.body.user_id, res, service);
}));
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, user_db_1.getUser)(req.body.user_id, res, service);
}));
app.delete('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, user_db_1.deleteUser)(req.body.user_id, res, service);
}));
app.get('/users_e', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, user_db_1.getUserExists)(req.body.name, res, service);
}));
service.userRepo.getUsersTable();
