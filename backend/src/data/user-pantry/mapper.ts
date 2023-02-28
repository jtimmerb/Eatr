import {UserPantry, UserPantryEntity} from './entity';
import {Mapper} from '..';

export const UserPantryMapper: Mapper<UserPantry, UserPantryEntity> = class {
  public static toDB(t: UserPantry): UserPantryEntity {
    return {
      upMembershipId: t.upMembershipId,
      userId: t.userId,
      ingredientId: t.ingredientId,
      ingredientAmount: t.ingredientAmount,
    };
  }

  public static fromDB(d: UserPantryEntity): UserPantry {
    return {
      upMembershipId: d.upMembershipId,
      userId: d.userId,
      ingredientId: d.ingredientId,
      ingredientAmount: d.ingredientAmount,
    };
  }
};
