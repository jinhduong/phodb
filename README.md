# phodb

![](https://api.travis-ci.org/jinhduong/phodb.svg?branch=dev)

## Simplest database interface for chrome extension storage

- Simple built-in methods
- Faster with storage cached of table
- Support UUID
- Support @types
- Can extend for other simple storages

## Usage

```ts
import { ChromeExtDb } from "phodb";

const db = new ChromeExtDb();
const peopleTable = db.table("people");

peopleTable.where(x => !!x).then(res => console.log(res));
peopleTable
  .findOne(x => new Date(x.createdAt) < new Date())
  .then(res => console.log(res));
```

## Documents

```ts
class ChromeExtDb implements IPhoDb {
  constructor(options?: {
    setFunc: (localData: any) => void;
    getFunc: (callback: (data: any) => void) => void;
  });
  table<T>(name: string): ITable<T>;
}

class ChromeExtTable<T> implements ITable<T> {
  constructor(
    name: string,
    setFunc: (localData: any) => void,
    getFunc: (res: any) => void
  );
  add(model: T): Promise<T & BaseModel>;
  remove(id: string): Promise<boolean>;
  update(id: string, model: T & BaseModel): Promise<T & BaseModel | null>;
  findOne(pre: (model: T & BaseModel) => boolean): Promise<T & BaseModel>;
  where(pre: (model: T & BaseModel) => boolean): Promise<(T & BaseModel)[]>;
  list(): Promise<(T & BaseModel)[]>;
  getName(): string;
}

interface BaseModel {
    id: string;
    createdAt: number;
    updateAt: number;
}
```

## Browser & js built file
https://github.com/jinhduong/phodb/blob/master/build/release/phodb.chrome.js
```js
var peopleTable = ChromeExt.table("people");
```
