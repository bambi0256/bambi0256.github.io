const fs = require('fs');
const path = require('path');

// htmlposts 디렉토리에서 HTML 파일 목록 읽기
const htmlPostsDir = './htmlposts';
const indexPath = './index.html';

// HTML 파일 목록 읽기
const htmlFiles = fs.readdirSync(htmlPostsDir).filter(file => path.extname(file) === '.html');

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
  const postTitle = file.replace('.html', '');  // 파일 이름을 포스트 제목으로 사용
  indexContent += `<li><a href="htmlposts/${file}">${postTitle}</a></li>`;
});

indexContent += `
    </ul>
  </main>
</body>
</html>
`;

// index.html 파일로 저장
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('index.html updated.');
