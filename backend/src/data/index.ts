export interface Repo<T> {
  exists(t: T): Promise<boolean>;
  delete(t: T): Promise<void>;
  create(t: T): Promise<T>;
  update(t: T): Promise<T>;
  get(t: T): Promise<T>;
}

export interface Mapper<T, I> {
  fromDB(d: I): T;
  toDB(d: T): I;
}
