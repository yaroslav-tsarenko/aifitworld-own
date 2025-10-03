# 🚀 Deployment Guide - AIFitWorld

## 📋 Prerequisites

- ✅ GitHub account with `aifit` repository
- ✅ Vercel account (free tier available)
- ✅ OpenAI API key
- ✅ Production database (PostgreSQL recommended)

## 🔄 Step-by-Step Deployment

### 1. **Prepare Local Repository**

```bash
# Убедитесь, что вы в корневой папке проекта
cd fitnessai

# Проверьте статус git
git status

# Добавьте все файлы
git add .

# Сделайте коммит
git commit -m "Prepare for Vercel deployment"

# Отправьте в GitHub
git push origin main
```

### 2. **Connect Vercel to GitHub**

1. **Откройте [vercel.com](https://vercel.com)**
2. **Войдите через GitHub**
3. **Нажмите "New Project"**
4. **Выберите репозиторий `aifit`**
5. **Нажмите "Import"**

### 3. **Configure Project Settings**

#### **Project Name**
- Название: `aifit` (или любое другое)
- Framework Preset: `Next.js` (должен определиться автоматически)

#### **Root Directory**
- Оставьте пустым (если проект в корне репозитория)

#### **Build Settings**
- Build Command: `npm run build` (по умолчанию)
- Output Directory: `.next` (по умолчанию)
- Install Command: `npm install` (по умолчанию)

### 4. **Environment Variables**

В разделе "Environment Variables" добавьте:

```bash
# Database
DATABASE_URL=your_production_postgresql_url

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://your-domain.vercel.app

# OpenAI
OPENAI_API_KEY=sk-...

# Optional: Blob Storage
BLOB_READ_WRITE_TOKEN=your_blob_token
```

### 5. **Deploy**

1. **Нажмите "Deploy"**
2. **Дождитесь завершения сборки** (обычно 2-5 минут)
3. **Скопируйте URL** вашего сайта (например: `https://aifit-abc123.vercel.app`)

### 6. **Test Deployment**

1. **Откройте ваш сайт** по URL от Vercel
2. **Проверьте основные функции:**
   - Регистрация/вход
   - Генерация preview
   - Пополнение токенов

## 🔧 Troubleshooting

### **Build Errors**

```bash
# Локально проверьте сборку
npm run build

# Если есть ошибки, исправьте их перед деплоем
```

### **Environment Variables**

- Убедитесь, что все переменные добавлены в Vercel
- Проверьте правильность значений
- Перезапустите деплой после изменения переменных

### **Database Connection**

- Проверьте `DATABASE_URL` в Vercel
- Убедитесь, что база данных доступна из интернета
- Проверьте firewall настройки

## 📱 Post-Deployment

### **Custom Domain (Optional)**

1. **В Vercel Dashboard** перейдите в Settings → Domains
2. **Добавьте ваш домен**
3. **Обновите DNS записи** у провайдера
4. **Обновите `NEXTAUTH_URL`** в переменных окружения

### **Monitoring**

- **Vercel Analytics** - для отслеживания производительности
- **Vercel Functions Logs** - для отладки API

### **Updates**

```bash
# Для обновления сайта
git add .
git commit -m "Update description"
git push origin main

# Vercel автоматически задеплоит изменения
```

## 🎯 Success Checklist

- ✅ Сайт доступен по URL от Vercel
- ✅ Регистрация и вход работают
- ✅ Пополнение токенов работает
- ✅ Генерация курсов работает

## 🆘 Support

Если возникли проблемы:

1. **Проверьте логи** в Vercel Dashboard
2. **Проверьте переменные окружения**
3. **Создайте issue** в GitHub репозитории

---

**🎉 Поздравляем! Ваш AIFitWorld теперь доступен в интернете!**
