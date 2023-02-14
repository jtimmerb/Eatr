import {User} from './entity';
import {Repo} from '..';
import {UserMapper} from './mapper';

/** This Interface extends the base Repo and implement new methods uniqe to User Entity */
interface InterfaceUserRepo extends Repo<User> {
  getUserByID(userID: string): Promise<User>;
}

/** The User Repo persists and fetches object from DB */
export default class UserRepo implements InterfaceUserRepo {
  public mysqldb: any;

  constructor(mysqldb: any) {
    this.mysqldb = mysqldb;
  }

  /** DB INTERACTIONS */
  /** Checks if user exists in DB */
  public async exists(t: User): Promise<boolean> {
    return false;
  }

  /** Deletes user in DB */
  public async delete(userID: number): Promise<void> {
    let query = `DELETE FROM users WHERE user_id=${userID}`;
    await this.mysqldb.query(query, function (err: any) {
      if (err) throw err;
    });
  }

  /** Creates user in DB*/
  public async create(name: string): Promise<User> {
    let conn = this.mysqldb;
    let query = `INSERT INTO users (name) VALUES ('${name}')`;
    return new Promise(resolve => {
      conn.query(query, function (err: any, result: any) {
        if (err) throw err;
        //console.log(JSON.parse(JSON.stringify(result)));
        resolve({
          userID: JSON.parse(JSON.stringify(result)).insertId,
          name: name,
        });
      });
    });
  }

  public async update(name: string, id: number): Promise<User> {
    let conn = this.mysqldb;
    let query = `UPDATE users SET name='${name}' WHERE user_id='${id}'`;
    return new Promise(resolve => {
      conn.query(query, function (err: any, result: any) {
        if (err) throw err;
        //console.log(JSON.parse(JSON.stringify(result)));
        resolve({
          userID: id,
          name: name,
        });
      });
    });
  }

  /** Get user by userID */
  public async getUserByID(userID: string): Promise<User> {
    let conn = this.mysqldb;
    return new Promise(function (resolve, reject) {
      let query = `SELECT * FROM users WHERE user_id=${userID}`;
      conn.query(query, (err: any, results: any) => {
        if (err) {
          return reject(err);
        }
        //console.log(results);
        resolve(UserMapper.fromDB(results.rows));
      });
    });
  }
}
