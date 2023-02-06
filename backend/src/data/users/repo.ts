import {User} from './entity';
import {Repo} from '..';
import {ID_LENGTH, ID_GENERATION_ATTEMPTS} from '../../config';
import {int} from 'aws-sdk/clients/datapipeline';
import {UserMapper} from './mapper';

/** This Interface extends the base Repo and implement new methods uniqe to Player Entity */
interface InterfaceUserRepo extends Repo<User> {
  getRandomID(): Promise<int>;
  getUserByID(userID: string): Promise<User>;
}

/** The Player Repo persists and fetches object from DB */
export default class UserRepo implements InterfaceUserRepo {
  public mysqldb: any;

  constructor(mysqldb: any) {
    this.mysqldb = mysqldb;
  }

  /** UTILITY */
  /** Generate a random ID for user */
  public async getRandomID(): Promise<int> {
    let key = Math.floor(Math.random() * ID_LENGTH);
    for (let i = 0; i <= ID_GENERATION_ATTEMPTS; i++) {
      if (i === ID_GENERATION_ATTEMPTS) {
        throw new Error('Failed to create player try again');
      }
      if (await this.exists({userID: key, name: ''})) {
        key = Math.floor(Math.random() * ID_LENGTH);
      } else {
        break;
      }
    }
    return key;
  }

  /** DB INTERACTIONS */
  /** Checks if player exists in DB */
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

  /** Deletes player in DB */
  public async delete(t: User): Promise<void> {
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
  }

  /** Updates player in DB, but if player does not exist Creates new Player Entity */
  public async save(t: User): Promise<void> {
    /*const player = PlayerMapper.toDB(t);
    const params = {
      TableName: DYNAMO_TABLE,
      Item: player,
    };

    await this.dynamodb.send(new PutItemCommand(params));
    */
    let query = `INSERT INTO users (user_id, name) VALUES (${t.userID}, '${t.name}')`;
    this.mysqldb.query(query, function (err: any, result: any) {
      if (err) throw err;
      console.log('1 record inserted');
    });
  }

  /** Get player by userID */
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
