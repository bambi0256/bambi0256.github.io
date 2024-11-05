const fs = require('fs');
const path = require('path');
const marked = require('marked');

// mdposts 디렉토리에서 마크다운 파일 읽기
const markdownDir = './mdposts';
const outputDir = './htmlposts';

// mdposts 디렉토리 내의 모든 파일을 변환
fs.readdirSync(markdownDir).forEach(file => {
  if (path.extname(file) === '.md') {
    const markdownPath = path.join(markdownDir, file);
    const htmlPath = path.join(outputDir, file.replace('.md', '.html'));

    const markdownContent = fs.readFileSync(markdownPath, 'utf8');
    const htmlContent = marked(markdownContent);

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`Converted ${file} to HTML.`);
  }
});
