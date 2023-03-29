import {User, UserEntity} from './entity';
import {Mapper} from '..';

/** Mapper method that maps User Entity to User DB entity and vice versa */
export const UserMapper: Mapper<User, UserEntity> = class {
  /** Mapping from User DB Entity to User Entity  */
  public static fromDB(d: UserEntity): User {
    return {
      userId: d.user_id,
      name: d.name,
    };
  }
  public static toDB(d: User): UserEntity {
    return {
      user_id: d.userId,
      name: d.name,
    };
  }
};
