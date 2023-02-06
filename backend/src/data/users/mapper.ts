import {User} from './entity';
import {Mapper} from '..';
import {int} from 'aws-sdk/clients/datapipeline';

/** Mapper method that maps Player Entity to Player DB entity and vice versa */
export const UserMapper: Mapper<User> = class {
  /** Mapping from Player DB Entity to Player Entity  */
  public static fromDB(d: string): User {
    let data = JSON.parse(JSON.stringify(d));
    return {
      userID: data[0].user_id as int,
      name: data[0].name as string,
    };
  }
};
