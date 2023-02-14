import PG from 'pg';

export default class db_conn {
  db_connection: any;

  constructor(db_host: string, db_user: string, db_pwd: string, db_name: string, db_port: number) {
    this.db_connection = new PG.Pool({
      host: db_host,
      user: db_user,
      password: db_pwd,
      port: db_port,
      database: db_name,
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
}
