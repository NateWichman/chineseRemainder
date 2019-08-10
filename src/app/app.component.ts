import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  errorMessages: string[] = [];
  congruencies: { value: number; modulus: number }[] = [];
  calculation: { result: number; modulus: number } | boolean;

  ngOnInit() {
    this.congruencies.push({ value: null, modulus: null });
    console.log(this.gcd_more_than_two_numbers([4, 7, 5, 12]));
  }

  /* Author: Nathan Wichman, Date: 8/10/2019. This function solves the 
  Chinese Remainder theorem for any number of congruency equations. 
  It will return an object with two fields { result, modulus }. If 
  this should be interpereted as X is congruent to result mod modulus as
  the Chniese Remainder theorem hasd infinite answers. 'result' will be 
  the smallest correct answer. */
  chineseRemainderTheorem(values, moduli) {
    console.log("ran");
    let valid = true;
    for (let i = 0; i < moduli.length; i++) {
      for (let j = i; j < moduli.length; j++) {
        if (moduli[i] !== moduli[j]) {
          if (this.gcd_two_numbers(moduli[i], moduli[j]) !== 1) {
            console.log("RAN");
            this.errorMessages.push(
              `the GCD between ${moduli[i]} and ${moduli[j]} is not 1`
            );
            return false;
          }
        }
      }
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
    this.errorMessages = [];
    return { result, modulus: multipliedModuli };
  }

  calculate() {
    this.errorMessages = [];
    const values = this.congruencies.map(c => c.value);
    const moduli = this.congruencies.map(c => c.modulus);
    console.log("start");
    let isValid = true;
    values.forEach((v, i) => {
      console.log(v);
      if (v === null) {
        this.errorMessages.push("empty value at line " + i);
        isValid = false;
      }
    });
    moduli.forEach((m, i) => {
      if (m === null) {
        this.errorMessages.push("empty moduli at line " + i);
        isValid = false;
      }
    });

    if (!isValid) {
      this.calculation = false;
    } else {
      this.calculation = this.chineseRemainderTheorem(values, moduli);
    }
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
