export interface Repo<T> {
  exists(t: T): Promise<boolean>;
  delete(t: T): Promise<void>;
  create(t: T): Promise<void>;
  getItemByID(id: number): Promise<T>;
}

export interface Mapper<T, D> {
  toDB(t: T): D;
  fromDB(d: D): T;
}