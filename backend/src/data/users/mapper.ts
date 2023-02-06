import {User} from './entity';
import {Mapper} from '..';
import {int} from 'aws-sdk/clients/datapipeline';

/** Mapper method that maps User Entity to User DB entity and vice versa */
export const UserMapper: Mapper<User> = class {
  /** Mapping from User DB Entity to User Entity  */
  public static fromDB(d: string): User {
    let data = JSON.parse(JSON.stringify(d));
    return {
      userID: data[0].user_id as int,
      name: data[0].name as string,
    };
  }
};
