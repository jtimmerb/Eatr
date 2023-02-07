import {User} from './entity';
import {Repo} from '..';
import {int} from 'aws-sdk/clients/datapipeline';
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
    /*
    const params = {
      TableName: DYNAMO_TABLE,
      ExpressionAttributeValues: {
        ':id': {S: `player-${t.playerID}`},
      },
      KeyConditionExpression: 'pk = :id',
      Limit: 1,
    };

    const data = await this.dynamodb.send(new QueryCommand(params));

    return data.Count !== 0;
    */
    return false;
  }

  /** Deletes user in DB */
  public async delete(userID: int): Promise<void> {
    /*
    const params = {
      TableName: DYNAMO_TABLE,
      Key: {
        pk: {S: `player-${t.playerID}`},
        sk: {S: t.name},
      },
    };

    await this.dynamodb.send(new DeleteItemCommand(params));
    */
    let query = `DELETE FROM users WHERE user_id=${userID}`;
    this.mysqldb.query(query, function (err: any, result: any) {
      if (err) throw err;
      //console.log(result);
    });
  }

  /** Updates user in DB, but if player does not exist Creates new User Entity */
  public async save(name: string): Promise<User> {
    /*const player = PlayerMapper.toDB(t);
    const params = {
      TableName: DYNAMO_TABLE,
      Item: player,
    };

    await this.dynamodb.send(new PutItemCommand(params));
    */
    //let id = await this.getRandomID();
    let query = `INSERT INTO users (name) VALUES ('${name}')`;
    return new Promise(resolve => {
      let tempUser = {userID: 0 as int, name: name as string} as User;
      this.mysqldb.query(query, function (err: any) {
        if (err) throw err;
        //console.log(result);
      });
      resolve(tempUser);
    });
  }

  /** Get user by userID */
  public async getUserByID(userID: string): Promise<User> {
    let conn = this.mysqldb;
    return new Promise(function (resolve, reject) {
      let query = `SELECT * FROM users WHERE user_id=${userID}`;
      conn.query(query, function (err: any, rows: string) {
        if (err) {
          return reject(err);
        }
        resolve(UserMapper.fromDB(rows));
      });
    });
  }
}
