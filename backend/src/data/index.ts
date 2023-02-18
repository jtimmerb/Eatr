import PG from 'pg';
export interface Repo<T> {
  exists(t: T): Promise<boolean>;
  delete(t: T): Promise<void>;
  create(t: T): Promise<T>;
  update(t: T): Promise<T>;
}

export interface Mapper<T> {
  fromDB(d: PG.QueryResultRow): T;
}
