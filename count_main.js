const fs = require('fs');
const lines = fs.readFileSync('app/(admin)/admin/users/[userId]/profile/page.tsx', 'utf8').split('\n');

const componentLines = lines.slice(995); // line 996 to end
const content = componentLines.join('\n');

const divs = content.match(/<div/g) || [];
const closeDivs = content.match(/<\/div>/g) || [];

console.log('MAIN USER PROFILE REVIEW DIVS:', { open: divs.length, close: closeDivs.length, diff: divs.length - closeDivs.length });
