import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { timingSafeEqual } from 'crypto';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "chineseRemainderTheorem";

  congruencies: { value: number; modulus: number }[] = [];
  calculation: { result: number, modulus: number} | boolean;
  values = [2, 3, 2];
  moduli = [3, 5, 7];

  ngOnInit() {
    this.congruencies.push({ value: null, modulus: null });
    console.log(this.chineseRemainderTheorem(this.values, this.moduli));
  }

  /* Author: Nathan Wichman, Date: 8/10/2019. This function solves the 
  Chinese Remainder theorem for any number of congruency equations. 
  It will return an object with two fields { result, modulus }. If 
  this should be interpereted as X is congruent to result mod modulus as
  the Chniese Remainder theorem hasd infinite answers. 'result' will be 
  the smallest correct answer. */
  chineseRemainderTheorem(values, moduli) {
    if (this.gcd_more_than_two_numbers(moduli) !== 1) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < values.length; i++) {
      let N = [...moduli];
      N.splice(i, 1);
      const R = N.reduce(
        (accumulator, currentValue) => currentValue * accumulator
      );
      result += values[i] * R * this.modInverse(R, moduli[i]);
    }
    const multipliedModuli = moduli.reduce(
      (accumulator, currentValue) => currentValue * accumulator
    );
    result = result % multipliedModuli;
    return { result, modulus: multipliedModuli };
  }

  calculate() {
    const values = this.congruencies.map(c => c.value);
    const moduli = this.congruencies.map(c => c.modulus);
    this.calculation = this.chineseRemainderTheorem(values, moduli);
    console.log(this.calculation);
  }

  // Adds another input line to the DOM
  addCongruency() {
    this.congruencies.push({ value: null, modulus: null });
  }

  removeCongruency(congruency: { value: number; modulus: number }) {
    this.congruencies = this.congruencies.filter(c => c !== congruency);
  }

  // Source https://www.w3resource.com/javascript-exercises/javascript-math-exercise-9.php
  gcd_more_than_two_numbers(input) {
    if (toString.call(input) !== "[object Array]") return false;
    var len, a, b;
    len = input.length;
    if (!len) {
      return null;
    }
    a = input[0];
    for (var i = 1; i < len; i++) {
      b = input[i];
      a = this.gcd_two_numbers(a, b); // Added 'this' keyword, editing the original sourced code.
    }
    return a;
  }

  // Source https://www.w3resource.com/javascript-exercises/javascript-math-exercise-9.php
  gcd_two_numbers(x, y) {
    if (typeof x !== "number" || typeof y !== "number") return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
      var t = y;
      y = x % y;
      x = t;
    }
    return x;
  }

  // Source https://stackoverflow.com/questions/26985808/calculating-the-modular-inverse-in-javascript
  modInverse(a, m) {
    // validate inputs
    [a, m] = [Number(a), Number(m)];
    if (Number.isNaN(a) || Number.isNaN(m)) {
      return NaN; // invalid input
    }
    a = ((a % m) + m) % m;
    if (!a || m < 2) {
      return NaN; // invalid input
    }
    // find the gcd
    const s = [];
    let b = m;
    while (b) {
      [a, b] = [b, a % b];
      s.push({ a, b });
    }
    if (a !== 1) {
      return NaN; // inverse does not exists
    }
    // find the inverse
    let x = 1;
    let y = 0;
    for (let i = s.length - 2; i >= 0; --i) {
      [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
    }
    return ((y % m) + m) % m;
  }
}
