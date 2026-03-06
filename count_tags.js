const fs = require('fs');
const content = fs.readFileSync('app/(admin)/admin/users/[userId]/profile/page.tsx', 'utf8');

let divOpen = 0;
let divClose = 0;
let curlyOpen = 0;
let curlyClose = 0;
let parenOpen = 0;
let parenClose = 0;

const divs = content.match(/<div/g) || [];
const closeDivs = content.match(/<\/div>/g) || [];
divOpen = divs.length;
divClose = closeDivs.length;

console.log('DIVS:', { open: divOpen, close: divClose, diff: divOpen - divClose });

// Count { and } inside the UserProfilePage function (approximate)
const startOfReturn = content.indexOf('return (');
const endOfFunction = content.lastIndexOf('}');
const jsxPart = content.substring(startOfReturn, endOfFunction);

const curlies = jsxPart.match(/\{/g) || [];
const closeCurlies = jsxPart.match(/\}/g) || [];
console.log('CURLIES (JSX):', { open: curlies.length, close: closeCurlies.length, diff: curlies.length - closeCurlies.length });

const parens = jsxPart.match(/\(/g) || [];
const closeParens = jsxPart.match(/\)/g) || [];
console.log('PARENS (JSX):', { open: parens.length, close: closeParens.length, diff: parens.length - closeParens.length });
