# OpenAI API Integration Setup

## 🚀 Настройка OpenAI API

### 1. Получение API ключа
1. Перейдите на [OpenAI Platform](https://platform.openai.com/)
2. Войдите в аккаунт или создайте новый
3. Перейдите в раздел "API Keys"
4. Создайте новый API ключ
5. Скопируйте ключ (он начинается с `sk-`)

### 2. Настройка переменных окружения
Создайте файл `.env.local` в корне проекта:

```bash
# OpenAI API
OPENAI_API_KEY=sk-your_actual_api_key_here

# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Проверка интеграции
После настройки API ключа:
1. Перезапустите сервер разработки
2. Попробуйте сгенерировать превью или полный курс
3. Проверьте консоль на наличие ошибок

## 🎯 Возможности интеграции

### Генерация текста:
- **Планы тренировок** - детальные программы с упражнениями
- **Советы по питанию** - персонализированные рекомендации
- **Безопасность** - модификации для травмобезопасности

### Генерация изображений (DALL-E 3):
- **HERO/ACTION (16:9)** - кинематографические снимки для главных изображений
- **TECHNIQUE CARD (4:3)** - демонстрация правильной техники упражнений
- **MACRO/DETAIL (3:2)** - детальные снимки рук, оборудования, текстуры
- **Персонализация** - по полу, типу тренировок, целевым мышцам
- **Качество** - 1024x1024, стандартное качество

## 💰 Стоимость API

### GPT-4o-mini (текст):
- ~$0.15 за 1M токенов входных данных
- ~$0.60 за 1M токенов выходных данных

### DALL-E 3 (изображения):
- $0.040 за изображение 1024x1024
- $0.080 за изображение 1024x1024 (HD качество)

## 🔧 Новая система промптов DALL-E 3

### HERO/ACTION (16:9) - Главные изображения:
```
Cinematic editorial photo of a {gender} athlete performing {workout_type} — specifically {exercise_for_target_muscle}.
Location: {home minimal setup|commercial gym}, equipment visible: {equipment_list}.
Lighting: warm yellow accent rim/edge light (#FFD60A), overall matte black background (#0E0E10) with soft gradients.
Mood: premium, focused, natural skin, shallow depth of field (50mm look), crisp details, subtle chalk particles.
Leave wide negative space on the left for headline.
Injury-safe mechanics emphasized: {safety_notes if enabled}.
Wardrobe: black/charcoal with small yellow accents.
No brand logos, no text, no watermarks, generic devices only.
```

### TECHNIQUE CARD (4:3) - Демонстрация техники:
```
Studio technique photo: {gender} athlete demonstrating {exercise} with perfect form, step-1 mid-range position.
Clear view of {target_muscle} engagement.
Background: matte black #0E0E10, yellow #FFD60A edge light outlining the body, premium editorial lighting, minimal clutter, clean floor.
Composition: centered subject, extra margin at the bottom for captions.
Wardrobe: black/charcoal with small yellow accents.
No logos, no on-frame text, no watermark.
```

### MACRO/DETAIL (3:2) - Детальные снимки:
```
Macro close-up of hands gripping {equipment}, sharp chalk particles, fine skin texture.
Yellow #FFD60A accent wrist wrap, #0E0E10 background, high micro-contrast, shallow DOF.
Negative space in corner for overlay.
No logos, no text.
```

## 🏋️ Мэппинг мышц → упражнения

### Chest:
- **Upper chest** → Incline dumbbell press
- **Mid chest** → Flat barbell bench press
- **Lower chest** → Decline push-ups on handles

### Back:
- **Lats** → Pull-up / Lat pulldown
- **Upper traps** → Barbell shrug
- **Mid traps** → Chest-supported row

### Shoulders:
- **Anterior deltoid** → Barbell overhead press
- **Lateral deltoid** → Dumbbell lateral raise
- **Posterior deltoid** → Reverse fly

### Arms:
- **Biceps** → Incline DB curl / EZ-bar curl
- **Triceps** → Overhead extension / Cable pushdown
- **Forearms** → Wrist curls / Reverse wrist curls

### Core:
- **Upper abs** → Crunch on mat
- **Lower abs** → Reverse crunch / Hanging knee raise
- **Obliques** → Side plank / Pallof press

### Legs:
- **Quads** → Back squat / Bulgarian split squat
- **Hamstrings** → Romanian deadlift / Nordic curl
- **Calves** → Standing calf raise / Seated calf raise

## 🎨 Цветовая схема и стиль

### Основные цвета:
- **Желтый акцент**: #FFD60A (теплый, мотивирующий)
- **Черный фон**: #0E0E10 (премиум, современный)

### Стиль изображений:
- **Cinematic** - кинематографическое качество
- **Editorial** - редакционный стиль фитнес-журналов
- **Premium** - премиум-качество для коммерческого использования
- **Professional** - профессиональная фотография

## 🚨 Обработка ошибок

### Частые проблемы:
1. **Неверный API ключ** - проверьте правильность ключа
2. **Превышение лимитов** - проверьте баланс аккаунта
3. **Неправильный формат запроса** - проверьте структуру данных
4. **Таймаут** - увеличьте время ожидания для длинных запросов

### Логирование:
Все ошибки логируются в консоль сервера для отладки.

## 🔒 Безопасность

- **Никогда не коммитьте** `.env.local` файл
- **Используйте переменные окружения** для всех секретов
- **Ограничьте доступ** к API ключу
- **Мониторьте использование** API для предотвращения злоупотреблений

## 📚 Дополнительные ресурсы

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [DALL-E 3 Guide](https://platform.openai.com/docs/guides/images)
- [GPT-4o-mini Guide](https://platform.openai.com/docs/models/gpt-4o-mini)
