// Đóng gói thư mục dist/ thành file zip để upload lên itch.io
// index.html phải nằm ở GỐC file zip (không nằm trong thư mục con)
import AdmZip from 'adm-zip';
import { existsSync, mkdirSync } from 'node:fs';

if (!existsSync('dist/index.html')) {
  console.error('Không tìm thấy dist/index.html — hãy chạy "npm run build" trước.');
  process.exit(1);
}

mkdirSync('release', { recursive: true });
const zip = new AdmZip();
zip.addLocalFolder('dist');
const out = 'release/tank-vs-alien-web.zip';
zip.writeZip(out);
console.log(`Đã tạo ${out} — upload file này lên itch.io (Kind of project: HTML).`);
