import {User} from './entity';
import {Mapper} from '..';

/** Mapper method that maps User Entity to User DB entity and vice versa */
export const UserMapper: Mapper<User> = class {
  /** Mapping from User DB Entity to User Entity  */
  public static fromDB(d: any): User {
    return {
      userID: d[0].user_id as number,
      name: d[0].name as string,
    };
  }
};
