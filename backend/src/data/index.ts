import {Request} from 'express';
import PG from 'pg';
export interface Repo<T> {
  exists(t: Request): Promise<boolean>;
  delete(t: Request): Promise<void>;
  create(t: Request): Promise<T>;
}

export interface Mapper<T> {
  fromDB(d: PG.QueryResultRow): T;
  toDB(id: number, name: string): T;
}
