import {User} from '../../data/users/entity';
import UserRepo from '../../data/users/repo';
import RepoController from '../repoController';

export default class UserController extends RepoController<UserRepo> {
  public createUser = async (newUser: User): Promise<User> => {
    const user = await this.getRepo().create(newUser);
    return user;
  };

  public deleteUser = async (user: User): Promise<void> => {
    const res = await this.getRepo().delete(user);
  };
}
