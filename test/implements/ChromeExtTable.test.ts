import { ChromeExtDb } from "../../src/implements/chrome/ChromeExtDb";

interface Person {
  age: number;
  name: string;
}

let mock = {};
let id;

const db = new ChromeExtDb({
  setFunc: ld => {
    mock = Object.assign(mock, ld);
  },
  getFunc: cb => {
    cb(mock);
  }
});
const tb1 = db.table<Person>("test");

it("Table list", () => {
  expect.assertions(1);
  const promise = tb1.list();
  return promise.then(res => {
    expect(res).not.toBeUndefined;
    expect(Array.isArray(res)).toBe(true);
  });
});

it("Table add", () => {
  expect.assertions(1);
  const promise = tb1.add({ name: "Dinh", age: 22 } as any);
  return promise.then(
    res =>
      expect(res["createdAt"]).toBeGreaterThan(0) &&
      expect(res["updateAt"]).toBeGreaterThan(0)
  );
});

test("Check list after added", () => {
  expect.assertions(1);
  const promise = tb1.list();
  return promise.then(res => {
    expect(res.length).toBeGreaterThan(0);
  });
});

it("Table findOne", () => {
  expect.assertions(2);
  const promise = tb1.findOne(x => !!x && x.age == 22);
  return promise.then(res => {
    console.log(res);
    if (res) {
      id = res.id;
      expect(res).toBeDefined();
      expect(res.createdAt).toBeDefined();
    } else {
      expect(res).toBeNull();
      expect(res).not.toBeUndefined();
    }
  });
});

it("Table update", () => {
  expect.assertions(2);
  const promise = tb1.update(id, {
    name: "Hnid"
  } as any);
  return promise.then((res: any) => {
    expect(res.name).toEqual("Hnid");
    expect(res.age).toBeDefined();
  });
});
