# Скрипт для деплоя AIFitWorld на Vercel

Write-Host "🚀 AIFitWorld Deployment Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Проверяем, что мы в правильной папке
if (!(Test-Path "package.json")) {
    Write-Error "❌ package.json не найден. Запустите скрипт из корня проекта."
    exit 1
}

Write-Host "✅ Найден package.json" -ForegroundColor Green

# Проверяем Git
if (!(Test-Path ".git")) {
    Write-Host "📁 Инициализируем Git репозиторий..." -ForegroundColor Yellow
    git init
}

# Проверяем статус Git
Write-Host "📊 Проверяем статус Git..." -ForegroundColor Yellow
git status --porcelain

# Добавляем только нужные файлы
Write-Host "📝 Добавляем файлы в Git..." -ForegroundColor Yellow
git add app/ components/ lib/ prisma/ public/ types/ *.json *.ts *.js *.md .gitignore

# Коммитим изменения
Write-Host "💾 Коммитим изменения..." -ForegroundColor Yellow
git commit -m "feat: remove Stripe integration and fix linting errors

- Removed all Stripe-related code and dependencies
- Fixed TypeScript linting errors
- Simplified token top-up logic
- Added flexible payment system architecture
- Fixed policy page 404 errors
- Updated documentation"

# Настраиваем remote origin
Write-Host "🔗 Настраиваем remote origin..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/aifitworld5/aifitworld.git

# Пушим на GitHub
Write-Host "🚀 Пушим на GitHub..." -ForegroundColor Yellow
git push -u origin main --force

Write-Host "✅ Деплой завершен!" -ForegroundColor Green
Write-Host "🌐 Проверьте статус деплоя в Vercel Dashboard" -ForegroundColor Cyan
Write-Host "📋 Не забудьте настроить переменные окружения:" -ForegroundColor Yellow
Write-Host "   - DATABASE_URL" -ForegroundColor White
Write-Host "   - NEXTAUTH_URL" -ForegroundColor White
Write-Host "   - NEXTAUTH_SECRET" -ForegroundColor White
Write-Host "   - OPENAI_API_KEY" -ForegroundColor White