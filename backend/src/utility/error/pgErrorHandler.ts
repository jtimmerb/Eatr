import {DatabaseError} from 'pg';
export default class PgErrorHandler {
  private errorStack: DatabaseError[];
  private sqlStack: string[];

  constructor() {
    this.errorStack = [];
    this.sqlStack = [];
  }

  public handleError(err: DatabaseError, sql: string) {
    console.log(err.code);
    console.log(err.detail);
    console.log(sql);
    this.errorStack.push(err);
    this.sqlStack.push(sql);
  }

  public printStacks() {
    this.errorStack.forEach(err => {
      console.log(err.code);
      console.log(err.detail);
    });
    this.sqlStack.forEach(que => {
      console.log(que);
    });
  }
}
