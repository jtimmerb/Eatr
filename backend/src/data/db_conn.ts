import PG from 'pg';
import PgErrorHandler from '../utility/error/postgres_error/pgErrorHandler';

export default class db_conn {
  db_connection: PG.Pool;
  errorHandler: PgErrorHandler;

  constructor(host: string, user: string, password: string, database: string, port: number) {
    this.db_connection = new PG.Pool({
      host: host,
      user: user,
      password: password,
      database: database,
      port: port,
    });
    this.errorHandler = new PgErrorHandler();
  }

  query(sql: string) {
    return new Promise<PG.QueryResult>(resolve => {
      this.db_connection
        .query(sql)
        .then((res: PG.QueryResult) => {
          resolve(res);
        })
        .catch((err: PG.DatabaseError) => {
          this.errorHandler.handleError(err);
        });
    });
  }
}
