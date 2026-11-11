// Đưa bản build (dist/) lên nhánh gh-pages để chạy GitHub Pages
// Dùng: npm run deploy
import { execSync } from 'node:child_process';
import { existsSync, writeFileSync, rmSync } from 'node:fs';

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });
const remote = execSync('git remote get-url origin').toString().trim();

if (!existsSync('dist/index.html')) {
  console.error('Không tìm thấy dist/index.html — build thất bại?');
  process.exit(1);
}

// .nojekyll: để GitHub Pages không bỏ qua các file/thư mục bắt đầu bằng "_"
writeFileSync('dist/.nojekyll', '');

rmSync('dist/.git', { recursive: true, force: true });
run('git init -q -b gh-pages', 'dist');
run('git add -A', 'dist');
run('git commit -q -m "Deploy game"', 'dist');
run(`git push -f "${remote}" gh-pages`, 'dist');
rmSync('dist/.git', { recursive: true, force: true });

console.log('\nĐã đưa lên nhánh gh-pages. Link: https://vivi123-ou.github.io/CNLTHD_TurnBasedGame/');
