# Скрипт для деплоя на Vercel
Write-Host "Starting deployment process..."

# Проверяем, что мы в правильной папке
if (!(Test-Path "package.json")) {
    Write-Error "package.json not found. Please run this script from the project root."
    exit 1
}

# Инициализируем Git если нужно
if (!(Test-Path ".git")) {
    Write-Host "Initializing Git repository..."
    git init
}

# Добавляем файлы в Git
Write-Host "Adding files to Git..."
git add .

# Коммитим изменения
Write-Host "Committing changes..."
git commit -m "feat: remove Stripe integration and fix linting errors"

# Добавляем remote origin если нужно
Write-Host "Setting up remote origin..."
git remote add origin https://github.com/aifitworld5/aifitworld.git 2>$null

# Пушим на GitHub
Write-Host "Pushing to GitHub..."
git push -u origin main --force

Write-Host "Deployment completed! Check Vercel dashboard for build status."
