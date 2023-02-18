import {User} from './entity';
import {Mapper} from '..';
import PG from 'pg';

/** Mapper method that maps User Entity to User DB entity and vice versa */
export const UserMapper: Mapper<User> = class {
  /** Mapping from User DB Entity to User Entity  */
  public static fromDB(d: PG.QueryResultRow): User {
    return {
      userId: d[0].user_id,
      name: d[0].name,
    };
  }
};
