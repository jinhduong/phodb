import { ITable } from "../../interfaces/Table";
import { BaseModel } from "../../interfaces/BaseModel";
import { uuid } from "../../utils/helpers";

export class ChromeExtTable<T> implements ITable<T> {
  // Locals
  private _name: string;
  private _localData: (T & BaseModel)[] = [];

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
      if (!this._localData) this._localData = res[this._name] || [];
      else {
        this._localData = [...this._localData, ...res[this._name]];
      }
    });
  }

  /* IMPLEMENTS */

  add(model: T): Promise<T & BaseModel> {
    return this._fetch().then(res => {
      const now = new Date();
      const newModel = <T & BaseModel>{
        id: uuid(),
        createdAt: now.getTime(),
        updateAt: now.getTime(),
        ...model
      };
      this._localData.push(newModel);
      this._commit();

      return newModel;
    });
  }

  remove(id: string): Promise<boolean> {
    return this._fetch().then(res => {
      const index = res.findIndex(x => x.id == id);

      if (index < 0) {
        return false;
      }

      this._localData.splice(index, 1);
      this._commit();

      return true;
    });
  }

  update(id: string, model: T & BaseModel): Promise<T & BaseModel | null> {
    return this._fetch().then(res => {
      const now = new Date();
      const index = res.findIndex(x => !!x && x.id == id);

      if (index < 0) {
        return null;
      }

      model.updateAt = now.getTime();
      this._localData[index] = {
        ...this._localData[index],
        ...model
      };
      this._commit();

      return this._localData[index];
    });
  }

  findOne(
    pre: (model: T & BaseModel) => boolean
  ): Promise<T & BaseModel | null> {
    return this._fetch().then(res => {
      const model = res.find(pre);
      return model || null;
    });
  }

  where(pre: (model: T & BaseModel) => boolean): Promise<(T & BaseModel)[]> {
    return this._fetch().then(res => {
      const models = res.filter(pre);
      return models;
    });
  }

  list(): Promise<(T & BaseModel)[]> {
    return this._fetch();
  }

  getName(): string {
    return this._name;
  }

  private _fetch(): Promise<(T & BaseModel)[]> {
    if (this._localData) {
      return Promise.resolve(this._localData);
    } else {
      return new Promise((resolve, reject) => {
        this._getFunc((res: any) => {
          resolve(res[this._name] || []);
        });
      });
    }
  }

  private _commit() {
    this._setFunc({ [this._name]: this._localData });
  }
}
