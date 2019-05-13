import { BaseModel } from "./BaseModel";
import { ITable } from "./Table";

export interface IPhoDb {
  table<T>(name: string): ITable<T & BaseModel>;
}
