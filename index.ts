function collatzTransform(x: number): number {
  if (x % 2 === 0) {
      return x / 2;
  } else {
      return 3 * x + 1;
  }
}

function findNumbers(lastDigitX: number, lastDigitY: number): [number,number][] {
  const results: [number,number][] = [];

  // Loop through numbers up to 10,000
  for (let i = 0; i < 100000; i++) {
      if (i % 10 === lastDigitX) { // Check if the number ends with lastDigitX
          const transformed = collatzTransform(i);
          if (transformed % 10 === lastDigitY) { // Check if the transformed number ends with lastDigitY
              results.push([i, transformed]);
          }
      }
  }

  return results;
}

function condenseNumbers(pairs: [number, number][]): [number, number][] {
  const parityMap = new Map<string, [number, number]>();

  pairs.forEach(([num, transformed]) => {
      const transformedTens = Math.floor((transformed % 100) / 10);

      // Create a key based on the parity of tens digits for both original and transformed numbers
      // I'm pretty sure they're all that matter for figuring out what the parity of the final digit will be at the next step.
      // const key = `${tens % 2}_${hundreds % 2}_${thousands % 2}:${transformedTens % 2}_${transformedHundreds % 2}_${transformedThousands % 2}`;
      const key = `${transformedTens}`;

      if (!parityMap.has(key)) {
          parityMap.set(key, [num, transformed]);
      }
  });

  return Array.from(parityMap.values());
}

let condensedMap = new Map<number, number>();
for(let i=0;i<10;++i){
  for(let j=0;j<10;++j){
    const numbers = findNumbers(i, j);
    const condensedNumbers = condenseNumbers(numbers);
    if(condensedNumbers.length){
      // find all of the number combos.
      Bun.write(`${i}-${j}.json`, JSON.stringify(condensedNumbers));
      for(let [start, end] of condensedNumbers){
        condensedMap.set(start % 1000, end);
      }
    }
  }
}

function tally(){
  let output = []
  for(let start of condensedMap.keys()){
    let memo = new Map<number, number>();
    // console.log(start);
    let dirs = [1];
    let current = start;
    let count = 0;
    while(true){
      // console.log("current", current);
      if(current % 2 === 0) dirs.push(dirs.at(-1)! / 2);
      else dirs.push(dirs.at(-1)! * 3);
      let next = condensedMap.get(current);
      let modVal = 100;
      while(next === undefined){
        // the largest value that matches dicatates the next one.
        next = condensedMap.get(current % modVal);
        modVal /= 10;
      }
      // break check, if we've seen the next number already AND the last number of dirs is lower than before we can break out, it will only get lower.
      count++;
      // if(memo.has(next)){
      let previousDir = memo.get(start)!;
      if(start === next){
        // console.log("cycle hit")
        if(previousDir > dirs.at(-1)!){
          console.log("cycle hit, lower", {start, current, next, previousDir: previousDir, currentDir: dirs.at(-1), highestDir: Math.max(...dirs)});
          break;
        }
        memo.set(start, dirs.at(-1)!);
      }
      if(next < start) break;
      current = next;
    }
    // console.log('dirs', dirs);
    output.push([start, dirs]);
  }
  return output;
}

console.log("tally", tally());