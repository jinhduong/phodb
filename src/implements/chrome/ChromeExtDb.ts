import { IPhoDb } from "../../interfaces/PhoDb";
import { BaseModel } from "../../interfaces/BaseModel";
import { ITable } from "../../interfaces/Table";
import { ChromeExtTable } from "./ChromeExtTable";

export class ChromeExtDb implements IPhoDb {
  private _tables: ITable<any>[] = [];
  private _setFunc: (localData: any) => void;
  private _getFunc: (callback: (data: any) => void) => void;

  constructor(options?: {
    setFunc: (localData: any) => void;
    getFunc: (callback: (data: any) => void) => void;
  }) {
    if (options) {
      this._getFunc = options.getFunc;
      this._setFunc = options.setFunc;
      return;
    }

    this._getFunc = cb => {
      chrome.storage.local.get(null, data => {
        cb(data);
      });
    };

    this._setFunc = (localData: any) => {
      chrome.storage.local.set(localData);
    };
  }

  table<T>(name: string): ITable<T> {
    if (this.exist(name)) {
      throw Error("This table name already created.");
    }

    const instance = new ChromeExtTable<T>(name, this._setFunc, this._getFunc);
    this._tables.push(instance);
    return instance;
  }

  private exist(name: string): boolean {
    this._tables.forEach(tb => {
      if (tb.getName() == name) true;
    });
    return false;
  }
}
