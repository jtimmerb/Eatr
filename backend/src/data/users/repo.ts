import {User} from './entity';
import {Repo} from '..';
import {UserMapper} from './mapper';
import PG from 'pg';
import db_conn from '../db_conn';

/** This Interface extends the base Repo and implement new methods uniqe to User Entity */
interface InterfaceUserRepo extends Repo<User> {}

/** The User Repo persists and fetches object from DB */
export default class UserRepo implements InterfaceUserRepo {
  public psql: db_conn;

  constructor(psql: db_conn) {
    this.psql = psql;
  }
  /** DB INTERACTIONS */
  /** Checks if user exists in DB */
  public async exists(user: User): Promise<boolean> {
    let query = `SELECT EXISTS (SELECT 1 FROM users WHERE name='${user.name}')`;
    let conn = this.psql;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) console.log(err);
        resolve(result.rows[0].exists);
      });
    });
  }

  /** Deletes user in DB */
  public async delete(user: User): Promise<void> {
    let query = `DELETE FROM users WHERE user_id=${user.userID}`;
    await this.psql.query(query, function (err: Error) {
      if (err) throw err;
    });
  }

  /** Creates user in DB*/
  public async create(user: User): Promise<User> {
    let conn = this.psql;
    let query = `INSERT INTO users (name) VALUES ('${user.name}')`;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) throw err;
        resolve({
          userID: JSON.parse(JSON.stringify(result)).insertId,
          name: user.name,
        });
      });
    });
  }

  public async update(user: User): Promise<User> {
    let conn = this.psql;
    let query = `UPDATE users SET name='${user.name}' WHERE user_id='${user.userID}'`;
    conn.query(query, null);
    return user;
  }

  /** Get user by userID */
  public async get(user: User): Promise<User> {
    let conn = this.psql;
    return new Promise(function (resolve, reject) {
      let query = `SELECT * FROM users WHERE user_id=${user.userID}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(UserMapper.fromDB(results.rows[0]));
      });
    });
  }

  async getUsersTable() {
    this.psql.query('SELECT * FROM users', function (err: Error, result: PG.QueryResult) {
      if (err) throw err;
      console.log(result.rows);
    });
  }
}
