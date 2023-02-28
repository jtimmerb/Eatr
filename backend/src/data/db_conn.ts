import PG from 'pg';

export default class db_conn {
  db_connection: any;

  constructor(host: string, user: string, password: string, database: string, port: number) {
    this.db_connection = new PG.Pool({
      host: host,
      user: user,
      password: password,
      database: database,
      port: port,
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
