import {Application} from 'express';
const mysql = require('mysql');

interface Service {
  listen(port: number): void;
}

export default class EatrService implements Service {
  private app: Application;
  private mysqldb: any;

  constructor(app: Application, mysqldb: any) {
    this.app = app;
    this.mysqldb = mysqldb;
  }

  public listen(port: number): void {
    this.app.listen(port, () => console.log('Server running'));
  }
}
