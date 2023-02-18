import PG from 'pg';

export default class db_conn {
  db_connection: any;

  constructor(dbHost: string, dbUser: string, dbPwd: string, dbName: string, dbPort: number) {
    this.db_connection = new PG.Pool({
      host: dbHost,
      user: dbUser,
      password: dbPwd,
      port: dbPort,
      database: dbName,
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
