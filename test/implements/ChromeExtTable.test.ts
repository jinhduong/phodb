import { ChromeExtDb } from "../../src/implements/chrome/ChromeExtDb";

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
const tb1 = db.table("test");

test("Table list", () => {
  expect(tb1.list()).not.toBeUndefined;
  expect(Array.isArray(tb1.list())).toBe(true);
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
  expect(tb1.list().length).toBeGreaterThan(0);
});

it("Table findOne", () => {
  expect.assertions(2);
  const promise = tb1.findOne((x: any) => x.age == 22);
  return promise.then(res => {
    id = res.id;
    expect(res).toBeDefined();
    expect(res.createdAt).toBeDefined();
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
