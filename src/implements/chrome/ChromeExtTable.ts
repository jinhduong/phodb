import { ITable } from "../../interfaces/Table";
import { BaseModel } from "../../interfaces/BaseModel";
import { uuid } from "../../utils/helpers";

export class ChromeExtTable<T extends BaseModel> implements ITable<T> {
  // Locals
  _name: string;
  _storage: chrome.storage.LocalStorageArea;
  _localData: T[];

  // Get from db instance
  _setFunc: (localData: any) => void;
  _getFunc: (res: any) => void;

  constructor(
    name: string,
    setFunc: (localData: any) => void,
    getFunc: (res: any) => void
  ) {
    this._name = name;

    // Set from db instance
    this._setFunc = setFunc;
    this._getFunc = getFunc;

    // Load default values
    this._getFunc((res: any) => {
      this._localData = res[this._name] || [];
    });
  }

  /* IMPLEMENTS */

  add(model: T): Promise<T> {
    const now = new Date();
    const newModel = <T>{
      id: uuid(),
      createdAt: now.getTime(),
      updateAt: now.getTime(),
      ...model
    };
    this._localData.push(newModel);
    this._commit();

    return Promise.resolve(newModel);
  }

  remove(id: string): Promise<boolean> {
    const index = this._localData.findIndex(x => x.id == id);

    if (index < 0) {
      return Promise.resolve(false);
    }

    this._localData.splice(index, 1);
    this._commit();

    return Promise.resolve(true);
  }

  update(id: string, model: T): Promise<T> {
    const now = new Date();
    const index = this._localData.findIndex(x => x.id == id);

    if (index < 0) {
      return Promise.resolve(null);
    }

    model.updateAt = now.getTime();
    this._localData[index] = {
      ...this._localData[index],
      ...model
    };
    this._commit();

    return Promise.resolve(this._localData[index]);
  }

  findOne(pre: (model: T) => boolean): Promise<T> {
    const model = this._localData.find(pre);
    return Promise.resolve(model);
  }

  where(pre: (model: T) => boolean): Promise<T[]> {
    const models = this._localData.filter(pre);
    return Promise.resolve(models);
  }

  list(): T[] {
    return this._localData;
  }

  getName(): string {
    return this._name;
  }

  private _commit() {
    this._setFunc({ [this._name]: this._localData });
  }
}
