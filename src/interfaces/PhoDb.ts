import { BaseModel } from "./BaseModel";
import { ITable } from "./Table";

export interface IPhoDb {
  table<T extends BaseModel>(name: string): ITable<T>;
}
