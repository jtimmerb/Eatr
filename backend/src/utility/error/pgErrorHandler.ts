import {DatabaseError} from 'pg';
export default class PgErrorHandler {
  public handleError(err: DatabaseError) {
    if (err.code === '01000') {
      console.log('Warning');
    } else if (err.code === '02000') {
      console.log('No Data');
    } else if (err.code === '03000') {
      console.log('SQL Incomplete');
    } else if (err.code === '08000') {
      console.log('Connection Exception');
    }
  }
}
