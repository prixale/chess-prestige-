const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
let balance = 0;
let stack = [];
let lines = content.split('\n');

for (let r = 0; r < lines.length; r++) {
    let line = lines[r];
    for (let c = 0; c < line.length; c++) {
        if (line[c] === '{') {
            balance++;
            stack.push({ char: '{', line: r + 1, col: c + 1 });
        } else if (line[c] === '}') {
            balance--;
            stack.pop();
            if (balance < 0) {
                console.log(`Extra } found at line ${r + 1}, col ${c + 1}`);
                process.exit(1);
            }
        }
    }
}
if (balance > 0) {
    console.log(`Unclosed { found at line ${stack[stack.length-1].line}, col ${stack[stack.length-1].col}`);
    process.exit(1);
}
console.log("Brackets are balanced");
