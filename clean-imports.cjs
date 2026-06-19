const fs = require('fs');

const file = 'src/components/dashboard-shell.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find all occurrences of the imports
const dbImport = 'import { db } from "@/lib/firebase";';
const firestoreImport1 = 'import { collection, query, where, onSnapshot } from "firebase/firestore";';
const firestoreImport2 = 'import { collection, onSnapshot, query, where } from "firebase/firestore";';

function removeDuplicates(text, searchStr) {
  const parts = text.split(searchStr);
  if (parts.length <= 2) return text; // 0 or 1 occurrence
  // Keep the first one, join the rest without the search string
  return parts[0] + searchStr + parts.slice(1).join('');
}

content = removeDuplicates(content, dbImport);
content = removeDuplicates(content, firestoreImport1);
content = removeDuplicates(content, firestoreImport2);

// Also just manually delete lines that look like duplicates if the above fails
const lines = content.split('\n');
const seen = new Set();
const newLines = lines.filter(line => {
  if (line.includes('from "firebase/firestore"')) {
    if (seen.has('firestore')) return false;
    seen.add('firestore');
    return true;
  }
  if (line.includes('from "@/lib/firebase"')) {
    if (seen.has('db')) return false;
    seen.add('db');
    return true;
  }
  return true;
});

fs.writeFileSync(file, newLines.join('\n'));
console.log('Cleaned duplicate imports');
