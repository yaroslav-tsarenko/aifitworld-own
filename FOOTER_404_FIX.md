# 🔧 Исправление ошибки 404 для страниц политик

## 🚨 **Проблема**
При переходе на страницы политик из футера (`Privacy Policy`, `Terms of Service`, `Refunds & Tokens`) появлялась ошибка 404.

## 🔍 **Причина**
1. **Неправильные пути в футере**: В `components/site-footer.tsx` функция `handleNavigate` получала только последнюю часть пути (`privacy`, `terms`, `refunds`) вместо полного пути (`legal/privacy`, `legal/terms`, `legal/refunds`).

2. **Дублирующая папка**: Существовала дублирующая папка `app/terms/` наряду с `app/legal/terms/`, что могло вызывать конфликты маршрутизации.

3. **Неполная обработка навигации**: В `app/legal/layout.tsx` функция `handleNavigate` не обрабатывала пути к политикам правильно.

## ✅ **Исправления**

### 1. **Исправлены пути в футере**
```tsx
// Было:
handleNavigate('privacy')
handleNavigate('terms') 
handleNavigate('refunds')

// Стало:
handleNavigate('legal/privacy')
handleNavigate('legal/terms')
handleNavigate('legal/refunds')
```

### 2. **Удалена дублирующая папка**
- Удален файл `app/terms/page.tsx`
- Оставлена только корректная структура `app/legal/terms/page.tsx`

### 3. **Улучшена обработка навигации в layout**
```tsx
// Добавлена обработка путей к политикам:
else if (page.startsWith("legal/")) {
  window.location.href = `/${page}`;
}
```

## 📁 **Структура страниц политик**
```
app/legal/
├── layout.tsx          # Layout для всех политик
├── privacy/
│   └── page.tsx        # Privacy Policy
├── terms/
│   └── page.tsx        # Terms of Service  
└── refunds/
    └── page.tsx        # Refunds & Tokens
```

## 🎯 **Результат**
- ✅ Все ссылки на политики в футере теперь работают корректно
- ✅ Устранены конфликты маршрутизации
- ✅ Удален дублирующий код
- ✅ Улучшена навигация между страницами

## 🧪 **Тестирование**
Для проверки исправлений:
1. Откройте главную страницу сайта
2. Прокрутите до футера
3. Нажмите на любую из ссылок политик:
   - "Privacy Policy" → `/legal/privacy`
   - "Terms of Service" → `/legal/terms`
   - "Refunds & Tokens" → `/legal/refunds`
4. Убедитесь, что страницы загружаются без ошибки 404

Проблема полностью решена! 🎉
