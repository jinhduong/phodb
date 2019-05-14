import { BaseModel } from "./BaseModel";

export interface ITable<T> {
  add(model: T): Promise<T & BaseModel>;
  remove(id: string): Promise<boolean>;
  update(id: string, model: T & BaseModel): Promise<T & BaseModel | null>;

  findOne(
    pre: (model: T & BaseModel) => boolean
  ): Promise<T & BaseModel | null>;
  where(pre: (model: T & BaseModel) => boolean): Promise<(T & BaseModel)[]>;
  list(): Promise<(T & BaseModel)[]>;

  // onChange?: (
  //   callback: (newVal: T & BaseModel[], oldVal: T & BaseModel) => void
  // ) => void;

  getName(): string;
}
