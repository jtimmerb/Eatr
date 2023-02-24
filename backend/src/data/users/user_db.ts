import {User} from './entity';
import EatrService from '../../service/service';

export default class userCmnds {
  async create(user: User, service: EatrService): Promise<User> {
    const userDB = await service.userRepo.create(user);
    //res.send(JSON.stringify(user) + '\n');
    service.userRepo.getUsersTable();
    return userDB;
  }

  async update(user: User, service: EatrService): Promise<User> {
    const userDB = await service.userRepo.update(user);
    //res.send(JSON.stringify(user) + '\n');
    service.userRepo.getUsersTable();
    return userDB;
  }

  async get(user: User, service: EatrService): Promise<User> {
    const userDB = await service.userRepo.get(user).catch(err => {
      throw err;
    });
    //res.send(JSON.stringify(user) + '\n');
    return userDB;
  }

  async delete(user: User, service: EatrService) {
    service.userRepo.delete(user).catch(err => {
      throw err;
    });
    //res.send('Deleted User #' + user.userID + '\n');
    service.userRepo.getUsersTable();
  }

  async exists(user: User, service: EatrService): Promise<boolean> {
    return await service.userRepo.exists(user).catch(err => {
      throw err;
    });
    //res.send(result + '\n');
  }
}
