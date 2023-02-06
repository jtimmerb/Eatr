import {Application} from 'express';
import UserRepo from '../data/users/repo';

const mysql = require('mysql');

interface Service {
  listen(port: number): void;
}

export default class EatrService implements Service {
  private app: Application;
  private mysqldb: any;
  public userRepo: UserRepo;

  constructor(app: Application, mysqldb: any) {
    this.app = app;
    this.mysqldb = mysqldb;
    this.userRepo = new UserRepo(mysqldb);
  }

  public listen(port: number): void {
    this.app.listen(port, () => console.log('Server running'));
  }
}
