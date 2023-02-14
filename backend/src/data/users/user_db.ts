import {Response} from 'express';
import EatrService from '../../service/service';

export async function createUser(name: Request, res: Response, service: EatrService) {
  let user = await service.userRepo.create(name);
  res.send(JSON.stringify(user) + '\n');
  service.userRepo.getUsersTable();
}

export async function updateUser(name: Request, user_id: Request, res: Response, service: EatrService) {
  let user = await service.userRepo.update(name, user_id);
  res.send(JSON.stringify(user) + '\n');
  service.userRepo.getUsersTable();
}

export async function getUser(user_id: Request, res: Response, service: EatrService) {
  let user = await service.userRepo.getUserByID(user_id).catch(err => {
    throw err;
  });
  res.send(JSON.stringify(user) + '\n');
}

export async function deleteUser(user_id: Request, res: Response, service: EatrService) {
  service.userRepo.delete(user_id).catch(err => {
    throw err;
  });
  res.send('Deleted User #' + user_id + '\n');
}
