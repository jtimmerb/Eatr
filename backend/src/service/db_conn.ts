const mysql = require('mysql');

export default class db_conn {
  db_connection: any;

  constructor(db_host: string, db_user: string, db_pwd: string, db_name: string, db_port: string) {
    this.db_connection = mysql.createPool({
      connectionLimit: 10,
      host: db_host,
      user: db_user,
      password: db_pwd,
      port: db_port,
      database: 'sys',
    });
  }

  query(sql: string, args: any) {
    return new Promise((resolve, reject) => {
      this.db_connection.query(sql, args, (err: any, rows: any) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async getUsersTable() {
    this.db_connection.query('SELECT * FROM users', function (err: {stack: string}, result: any, fields: any) {
      if (err) throw err;
      console.log(result);
    });
  }
}
