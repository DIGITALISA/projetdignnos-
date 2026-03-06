const fs = require('fs');
const lines = fs.readFileSync('app/(admin)/admin/users/[userId]/profile/page.tsx', 'utf8').split('\n');

const componentLines = lines.slice(285, 687); // lines 286 to 687
const content = componentLines.join('\n');

const divs = content.match(/<div/g) || [];
const closeDivs = content.match(/<\/div>/g) || [];

console.log('PROFESSIONAL REVIEW BOARD DIVS:', { open: divs.length, close: closeDivs.length, diff: divs.length - closeDivs.length });
