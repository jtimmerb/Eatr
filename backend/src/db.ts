import {MySqlParameters} from 'aws-sdk/clients/quicksight';

const mysql = require('mysql');

export class db_conn {
  db_host: string;
  db_user: string;
  db_pwd: string;
  db_name: string;
  db_port: string;
  db_connection: any;

  constructor(db_host: string, db_user: string, db_pwd: string, db_name: string, db_port: string) {
    this.db_host = db_host;
    this.db_user = db_user;
    this.db_pwd = db_pwd;
    this.db_name = db_name;
    this.db_port = db_port;
    this.db_connection = mysql.createConnection({
      host: db_host,
      user: db_user,
      password: db_pwd,
      port: db_port,
      database: 'sys',
    });
    this.initializeCon();
  }

  private initializeCon() {
    this.db_connection.connect(function (err: {stack: string}) {
      if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
      }
      console.log('Connected to database.');
    });
  }

  public createUser(userID: number, name: string, res: any) {
    let query = `INSERT INTO users (user_id, name) VALUES (${userID}, '${name}')`;
    this.db_connection.query(query, function (err: any, result: any) {
      if (err) throw err;
      console.log('1 record inserted');
      res.send(result);
    });
  }

  public getUser(userID: any, res: any) {
    let query = `SELECT * FROM users WHERE user_id=${userID}`;
    this.db_connection.query(query, function (err: any, result: any) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  }

  public getUsersTable() {
    this.db_connection.query('SELECT * FROM users', function (err: {stack: string}, result: any, fields: any) {
      if (err) throw err;
      console.log(result);
    });
  }
}
