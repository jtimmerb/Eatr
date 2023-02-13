export interface Repo<T> {
  exists(t: T): Promise<boolean>;
  delete(t: any): Promise<void>;
  create(t: any): Promise<T>;
}

export interface Mapper<T> {
  fromDB(d: string): T;
}
