const fs = require('fs');
const lines = fs.readFileSync('app/(admin)/admin/users/[userId]/profile/page.tsx', 'utf8').split('\n');

let depth = 0;
for (let i = 995; i < lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  depth += opens - closes;
  if (opens !== closes) {
      console.log(`L${i + 1}: depth ${depth} (+${opens} -${closes}) | ${line.trim().substring(0, 50)}`);
  }
}
