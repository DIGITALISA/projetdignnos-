const fs = require('fs');
const lines = fs.readFileSync('app/(admin)/admin/users/[userId]/profile/page.tsx', 'utf8').split('\n');

let depth = 0;
let log = "";
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Match <div but NOT if it ends with />
  const opens = (line.match(/<div(?![^>]*\/>)/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  
  if (opens !== closes) {
      depth += opens - closes;
      log += `L${i + 1}: ${depth} (${opens > closes ? '+' : ''}${opens - closes})\n`;
  }
}
fs.writeFileSync('depth_log_v2.txt', log);
console.log('Depth scan complete. Check depth_log_v2.txt');
