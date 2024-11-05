const fs = require('fs');
const path = require('path');

// htmlposts 디렉토리에서 HTML 파일 목록 읽기
const htmlPostsDir = './htmlposts';
const indexPath = './index.html';

// htmlposts 디렉토리 내의 HTML 파일 목록 읽기
let htmlFiles;
try {
  htmlFiles = fs.readdirSync(htmlPostsDir).filter(file => path.extname(file) === '.html');
} catch (error) {
  console.error('Error reading HTML files from htmlposts directory:', error);
  process.exit(1); // 파일 목록을 읽을 수 없으면 종료
}

// index.html 파일 내용 업데이트
let indexContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Blog</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Welcome to My Blog</h1>
  </header>

  <main>
    <h2>Latest Posts</h2>
    <ul>
`;

// 최신 포스트 목록 추가
htmlFiles.forEach(file => {
  const postTitle = file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());  // 파일 이름을 포스트 제목으로 사용
  const postUrl = `htmlposts/${file}`;
  
  // 포스트 날짜 추출 (파일 이름에서 'YYYY-MM-DD' 형식으로 추출)
  const postDate = file.split('-').slice(0, 3).join('-'); 

  // 파일의 수정 시간을 체크해서 최신 파일만 반영 (옵션)
  try {
    const htmlStat = fs.statSync(path.join(htmlPostsDir, file));
    const htmlModifiedDate = htmlStat.mtime;
    indexContent += `<li><a href="${postUrl}">${postTitle} <span class="date">(${postDate})</span></a></li>`;
  } catch (error) {
    console.error(`Error reading file stat for ${file}:`, error.message);
  }
});

indexContent += `
    </ul>
  </main>
</body>
</html>
`;

// index.html 파일로 저장
try {
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('index.html updated.');
} catch (error) {
  console.error('Error writing index.html:', error);
}
