const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const docsDir = path.join(__dirname, '../docs');
const outputDir = path.join(__dirname, '../playground/dist/docs');
const templatePath = path.join(__dirname, 'docs-template.html');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read template
const template = fs.readFileSync(templatePath, 'utf-8');

// Get all markdown files
const markdownFiles = fs.readdirSync(docsDir)
  .filter(file => file.endsWith('.md'))
  .sort();

// Generate navigation links
const navigationLinks = markdownFiles.map(file => {
  const name = file.replace('.md', '');
  const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return `            <li><a href="${name}.html">${displayName}</a></li>`;
}).join('\n');

// Process each markdown file
markdownFiles.forEach(file => {
  const filePath = path.join(docsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Convert markdown to HTML
  const htmlContent = marked(content);
  
  // Get title from first heading or filename
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
  
  // Generate navigation with active state
  const currentName = file.replace('.md', '');
  const navigation = markdownFiles.map(f => {
    const name = f.replace('.md', '');
    const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const activeClass = name === currentName ? ' class="active"' : '';
    return `            <li><a href="${name}.html"${activeClass}>${displayName}</a></li>`;
  }).join('\n');
  
  // Replace placeholders in template
  let finalHtml = template
    .replace('{{TITLE}}', title)
    .replace('{{CONTENT}}', htmlContent)
    .replace('{{NAVIGATION}}', navigation);
  
  // Write output file
  const outputFile = path.join(outputDir, file.replace('.md', '.html'));
  fs.writeFileSync(outputFile, finalHtml);
  
  console.log(`✓ Generated ${outputFile}`);
});

console.log(`\n✓ Documentation built successfully!`);
console.log(`  Output: ${outputDir}`);
console.log(`  Files: ${markdownFiles.length}`);
