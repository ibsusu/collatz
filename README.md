# Playing around with Collatz

## What this does

the collatz function is 
```ts
function collatzTransform(x: number): number {
  if (x % 2 === 0) {
      return x / 2;
  } else {
      return 3 * x + 1;
  }
}
```

It seemed to me no matter what that for every step forwards you take you have to take one or more steps backwards.  Since the direction of travel is dictated by the parity of the last digit for part 1 of this problem we only care whether it's odd or even.  based on that this is the chart I came up with.

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 4 | 1 | 0 | 2 | 6 | 3 | 2 | 4 | 8 |
| 5 |   | 6 |   | 7 |   | 8 |   | 9 |   |

we are twice as likely to take a step backward as we are forward so we should generally trend downwards, leading us to the 4 -> 2 -> 1 cycle.

`(2/3 * 2) > (1/3 * 3)` `3x+1` amortized is just `3x` when considering the distance and direction traveled.


Part two of this deals with cycles.  If you take a look at the `.json` files you'll see every condensed number combination that the final digit relies on.  My thought was that based on certain patterns like `00, 20, 40, etc.` only generating numbers ending in `0` or `16, 36, 56, etc.` only generating numbers that end in `8` it would be possible to find all possible cyles.  One thing I thought is that if a cycle is ever encountered and the direction traveled is negative the cycle checking loop could be broken out of and the result returned since the start of a cycle is the lower number of the cycle.

I have no idea if there's another cycle but finding the sequence of numbers that include something like so:

```
e == even digit
o == odd digit
x == even or odd

x1 -> e4 -> e2
```

Depends on numbers residing in the higher places after each run in the collatz function.  maybe instead of thinking about the number it's easier to think of the parity of the 10s digit?  I dunno, it feels like the possibility of the chain depends heavily on higher place digits landing just right for o0,e2,o4,e6,o8 in order to increase the distance spanned  to make up for the the 4x distance jump that the 421 cycle provides.  How?  I dunno.  I don't even know if it's possible.


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```