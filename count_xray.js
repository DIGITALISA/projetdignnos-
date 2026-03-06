const fs = require('fs');
const lines = fs.readFileSync('app/(admin)/admin/users/[userId]/profile/page.tsx', 'utf8').split('\n');

const componentLines = lines.slice(825, 994); // lines 826 to 994
const content = componentLines.join('\n');

const divs = content.match(/<div/g) || [];
const closeDivs = content.match(/<\/div>/g) || [];

console.log('AI STRATEGIC XRAY DIVS:', { open: divs.length, close: closeDivs.length, diff: divs.length - closeDivs.length });
