import {int} from 'aws-sdk/clients/datapipeline';

export interface User {
  userID: int;
  name: string;
}
