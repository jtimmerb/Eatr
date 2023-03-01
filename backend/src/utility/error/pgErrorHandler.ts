import {DatabaseError} from 'pg';
export default class PgErrorHandler {
  public handleError(err: DatabaseError) {
    console.log(err.code);
  }
}
