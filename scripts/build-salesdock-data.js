const fs = require('fs');
const path = require('path');

function getFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const relPath = base ? base + '/' + file : file;
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, relPath));
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Extract title from first # heading or filename
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : file;
      
      const folder = base || '.';
      const id = relPath.replace(/[\/\.]/g, '-');
      const slugName = file.endsWith('.md') ? file.slice(0, -3) : file;
      
      results.push({
        id,
        filename: file,
        title,
        path: relPath,
        folder,
        slug: file,
        slugWithoutExt: slugName,
        content
      });
    }
  });
  return results;
}

const rawFiles = getFiles('public/docs');

// Detect duplicate filenames
const filenameCounts = {};
rawFiles.forEach((f) => {
  filenameCounts[f.filename] = (filenameCounts[f.filename] || 0) + 1;
});

const docs = rawFiles.map((doc) => {
  // If filename is shared across folders, routeSlug incorporates folder prefix
  const isDuplicateFilename = filenameCounts[doc.filename] > 1;
  const folderSlug = doc.folder !== '.' ? doc.folder.replace(/\//g, '-') : '';
  
  const routeSlug = isDuplicateFilename
    ? `${folderSlug}-${doc.filename}`
    : doc.filename;
    
  const routeSlugWithoutExt = routeSlug.endsWith('.md')
    ? routeSlug.slice(0, -3)
    : routeSlug;

  return {
    ...doc,
    routeSlug,
    routeSlugWithoutExt,
  };
});

const code = `// Auto-generated Salesdock Documentation Content
// Do not edit manually - content embedded from Salesdock markdown source files

export interface SalesdockDoc {
  id: string;
  filename: string;
  title: string;
  path: string;
  folder: string;
  slug: string;
  slugWithoutExt: string;
  routeSlug: string;
  routeSlugWithoutExt: string;
  content: string;
}

export const SALESDOCK_DOCS: SalesdockDoc[] = ${JSON.stringify(docs, null, 2)};

export function getSalesdockDocs(): SalesdockDoc[] {
  return SALESDOCK_DOCS;
}

export function getSalesdockDocBySlug(rawSlug: string): SalesdockDoc | undefined {
  if (!rawSlug) return undefined;
  let decoded = rawSlug;
  try {
    decoded = decodeURIComponent(rawSlug).trim();
  } catch (e) {
    decoded = rawSlug.trim();
  }
  const lower = decoded.toLowerCase();

  return SALESDOCK_DOCS.find((doc) => {
    if (doc.routeSlug.toLowerCase() === lower) return true;
    if (doc.routeSlugWithoutExt.toLowerCase() === lower) return true;
    if (doc.filename.toLowerCase() === lower) return true;
    if (doc.slugWithoutExt.toLowerCase() === lower) return true;
    if (doc.path.toLowerCase() === lower) return true;
    if (doc.id.toLowerCase() === lower) return true;
    if (doc.filename.toLowerCase() === (lower + '.md')) return true;
    return false;
  });
}
`;

fs.writeFileSync('src/data/salesdock-docs.ts', code, 'utf8');
console.log('Successfully wrote src/data/salesdock-docs.ts with ' + docs.length + ' documents.');
