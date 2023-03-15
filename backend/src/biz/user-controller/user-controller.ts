import {User} from '../../data/users/entity';
import UserRepo from '../../data/users/repo';
import RepoController from '../repoController';

export default class UserController extends RepoController<UserRepo> {
  public createUser = async (newUser: User): Promise<User> => {
    const user = await this.getRepo().create(newUser);
    return user;
  };

  public deleteUser = async (userId: number): Promise<void> => {
    const deleteUser: User = {
      userId: userId,
      name: '',
    };
    await this.getRepo().delete(deleteUser);
  };

  public getUser = async (userId: number): Promise<User> => {
    const queryUser: User = {
      userId: userId,
      name: '',
    };
    const user = await this.getRepo().get(queryUser);
    return user;
  };
}
