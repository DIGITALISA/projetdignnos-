const fs = require('fs');
const lines = fs.readFileSync('app/(admin)/admin/users/[userId]/profile/page.tsx', 'utf8').split('\n');

let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  if (opens !== 0 || closes !== 0) {
    depth += opens - closes;
    if (opens !== closes) {
      // console.log(`L${i + 1}: depth ${depth} (fixed ${opens - closes})`);
    }
    if (depth < 0) {
       console.log(`CRITICAL: Depth below zero at Line ${i + 1}`);
       depth = 0;
    }
  }
}
console.log('Final Depth:', depth);
