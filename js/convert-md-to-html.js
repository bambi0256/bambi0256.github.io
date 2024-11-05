const fs = require('fs');
const path = require('path');
const marked = require('marked');

// 디렉토리 경로
const markdownDir = './mdposts';
const outputDir = './htmlposts';

// 디렉토리가 존재하지 않으면 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// mdposts 디렉토리 내의 모든 파일을 변환
fs.readdirSync(markdownDir).forEach(file => {
  // .md 파일만 처리
  if (path.extname(file) === '.md') {
    const markdownPath = path.join(markdownDir, file);
    const htmlPath = path.join(outputDir, file.replace('.md', '.html'));

    try {
      // 마크다운 파일 읽기
      const markdownContent = fs.readFileSync(markdownPath, 'utf8');

      // HTML로 변환
      const htmlContent = marked(markdownContent);

      // HTML 파일이 이미 존재하면 수정일 체크
      if (fs.existsSync(htmlPath)) {
        const markdownStat = fs.statSync(markdownPath);
        const htmlStat = fs.statSync(htmlPath);

        // 마크다운 파일이 수정되었을 경우에만 변환
        if (markdownStat.mtime > htmlStat.mtime) {
          fs.writeFileSync(htmlPath, htmlContent, 'utf8');
          console.log(`Updated HTML for ${file}`);
        } else {
          console.log(`No changes for ${file}, skipping conversion.`);
        }
      } else {
        // HTML 파일이 존재하지 않으면 새로 생성
        fs.writeFileSync(htmlPath, htmlContent, 'utf8');
        console.log(`Converted ${file} to HTML.`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
});
