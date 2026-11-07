// Fetch a user and greet them.
import { readFile } from "node:fs/promises";

const RETRIES = 3;
let count = 0;

export class Greeter extends EventTarget {
  #name;
  static defaults = { loud: false, times: 1.5e2 };

  constructor(name = "world") {
    super();
    this.#name = name;
  }

  async greet({ loud } = Greeter.defaults) {
    const text = `Hello, ${this.#name}!`;
    if (loud && count++ < RETRIES) return text.toUpperCase();
    return /^hello/i.test(text) ? text : null;
  }
}

const greeter = new Greeter(undefined);
greeter.greet().then((msg) => console.log(msg ?? "nothing", true, 0x1f));
