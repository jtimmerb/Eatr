import {UserPantry, UserPantryEntity} from './entity';
import {Mapper} from '..';

export const UserPantryMapper: Mapper<UserPantry, UserPantryEntity> = class {
  public static toDB(t: UserPantry): UserPantryEntity {
    return {
      up_membership_id: t.upMembershipId,
      user_id: t.userId,
      ingredient_id: t.ingredientId,
      ingredient_amount: t.ingredientAmount,
    };
  }

  public static fromDB(d: UserPantryEntity): UserPantry {
    return {
      upMembershipId: d.up_membership_id,
      userId: d.user_id,
      ingredientId: d.ingredient_id,
      ingredientAmount: d.ingredient_amount,
    };
  }
};
