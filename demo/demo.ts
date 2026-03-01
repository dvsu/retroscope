// TypeScript theme fixture: primitives, arrays, objects, functions, control flow
let num: number = 42;
let neg: number = -3.14;
let str: string = "hello";
let bool: boolean = true;
let nul: null = null;
let und: undefined = undefined;
let sym: symbol = Symbol("id");
let big: bigint = 9007199254740991n;
let arr: number[] = [1, 2, 3];
let obj: { x: number; y: string } = { x: 1, y: "z" };
let tuple: [string, number, boolean] = ["a", 1, true];
let func: (a: number, b: string) => number = (a, b) => a + parseInt(b);

// Enums (const/numeric/string)
enum Color { Red, Green, Blue = "blue" }
enum Status { Pending = 1, Success, Failed }
const color: Color = Color.Green;

// Interfaces & type aliases
interface User { name: string; id: number; readonly email?: string; }
type ID = string | number;
type Point = { x: number; y: number };
type PartialUser = Partial<User>;
type RequiredName = Required<Pick<User, "name">>;
type UnionStrNum = string | number;
type Intersection = User & { age: number };

// Generics & mapped/indexed/conditional types
function identity<T>(arg: T): T { return arg; }
type Mapped<T> = { [K in keyof T]: T[K] };
type Indexed<T> = { [key: string]: T };
type Conditional<T extends any[]> = T extends [infer Head, ...infer Tail] ? Head | Conditional<Tail> : never;
const generic = identity<string>("typed");
type MappedUser = Mapped<User>;
type StrDict = Indexed<string>;
type FirstOrLast = Conditional<[1, 2, "last"]>; // "last" | 1 | 2 (recursive-ish demo)

// Classes, inheritance, accessors, statics
abstract class Animal {
  static count = 0;
  protected name: string;
  constructor(name: string) { this.name = name; Animal.count++; }
  abstract move(): void;
  get info() { return this.name; }
  set updateName(n: string) { this.name = n; }
}
class Dog extends Animal {
  breed: string;
  constructor(name: string, breed: string) {
    super(name); this.breed = breed;
  }
  bark() { return "Woof!"; }
  move() { console.log("Dog walks"); }
}
const dog = new Dog("Rex", "Lab");
dog.info = "Fido"; // setter test
console.log(dog.bark(), Animal.count, dog.info);

// Union/discriminated union
type Shape = Circle | Square;
interface Circle { kind: "circle"; r: number; }
interface Square { kind: "square"; side: number; }
function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.r ** 2;
    case "square": return s.side ** 2;
    default: const exhaustive: never = s; return exhaustive;
  }
}

// Control flow: if/else, switch, for/of/in, while, try/catch
if (bool) { console.log("true branch"); } else { console.log("false"); }
switch (color) {
  case Color.Red: console.log("red"); break;
  default: console.log("other");
}
for (const n of arr) { console.log(n); }
for (const k in obj) { console.log(k, obj[k as keyof typeof obj]); }
while (num > 0) { num--; }
label: while (true) { break label; }
try { throw new Error("test"); } catch (e) { console.error(e); } finally { console.log("finally"); }

// Template literals, regex, arrow functions
const tmpl = `Hello ${str} ${num}`;
const regex = /test/giuys;

// Async/await, promises
async function fetchData(): Promise<string> {
  try {
    const res = await Promise.resolve("data");
    return res.toUpperCase();
  } catch (err) { return "error"; }
}

// Decorators (enable "experimentalDecorators" in tsconfig.json for full tokenization)
function logged(target: any, propertyKey: string, descriptor: PropertyDescriptor) {}
function sealed(constructor: Function) { Object.seal(constructor.prototype); }
@sealed
class SealedClass { @logged prop = 42; }

// Namespaces/modules
namespace Utils {
  export interface Logger { log(msg: string): void; }
  export const log: Logger = { log: console.log };
}
Utils.log.log("namespace");

// JSX (for React/TSX-like tokenization)
const element = <div className="test" onClick={() => {}}>Hello</div>;

// Assertions & satisfies (TS 4.9+)
const anyVal = 42 as any;
const numVal = anyVal as number;
const satisfiesVal = { x: 1 } satisfies Point;

// Utility types demo
const pickUser: Pick<User, "name"> = { name: "Alice" };
const omitUser: Omit<User, "id"> = { name: "Bob" };
const record: Record<"a" | "b", number> = { a: 1, b: 2 };

// Never/void/unknown
function fail(msg: string): never { throw new Error(msg); }
function noop(): void { }
declare const unk: unknown;
if (typeof unk === "string") { unk.toUpperCase(); }

// Export everything for module testing
export { User, Color, Dog, area, fetchData, Utils };
// Export default
export default dog;