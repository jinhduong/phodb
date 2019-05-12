import { BaseModel } from "./BaseModel";

export interface ITable<T extends BaseModel> {
  add(model: T): Promise<T>;
  remove(id: string): Promise<boolean>;
  update(id: string, model: T): Promise<T>;

  findOne(pre: (model: T) => boolean): Promise<T>;
  where(pre: (model: T) => boolean): Promise<T[]>;
  list(): T[];

  getName(): string;
}
