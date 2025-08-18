# PDF Generation Setup

## Overview
This project implements PDF generation for fitness courses using `@react-pdf/renderer` and stores files in Vercel Blob storage.

## Prerequisites

### 1. Install Dependencies
```bash
npm install @react-pdf/renderer @vercel/blob
```

### 2. Environment Variables
Create `.env.local` file with:
```env
# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token_here

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Vercel Blob Setup
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Storage → Blob
4. Create a new Blob store
5. Copy the `BLOB_READ_WRITE_TOKEN`
6. Add it to your environment variables

## Features

### PDF Design
- **Header**: FitnessAI logo and course title
- **Program Details**: Duration, sessions, creation date, tokens spent
- **Weekly Program**: Detailed workout plans for each week
- **Session Breakdown**: Warmup, main workout, cooldown for each session
- **Tips & Advice**: Weekly tips and nutrition advice (if enabled)
- **Professional Styling**: Brand colors, typography, and layout

### Technical Implementation
- **Server-side generation**: PDFs generated on-demand via API
- **Blob storage**: Files stored in Vercel Blob for production
- **Local development**: Files can be saved locally for testing
- **Caching**: PDF URLs stored in database to avoid regeneration

## API Endpoints

### Generate PDF
```
POST /api/courses/generate-pdf
Body: { courseId: string }
Response: { success: boolean, pdfUrl: string, filename: string }
```

## Usage

### In Dashboard
1. Navigate to Dashboard
2. Find your course
3. Click "Generate PDF" button
4. Wait for generation (shows "Generating..." state)
5. PDF automatically downloads when ready
6. Button changes to "Download PDF" for future use

### PDF Content
- **Basic info**: Course title, duration, sessions per week
- **Workout plans**: Detailed exercises for each session
- **Progressive structure**: Different focus each week
- **Safety tips**: Form cues and injury prevention
- **Nutrition advice**: If nutrition tips were selected

## Development vs Production

### Development
- PDFs can be saved locally
- Faster generation for testing
- No external storage dependencies

### Production
- PDFs stored in Vercel Blob
- Scalable and reliable storage
- CDN distribution for fast downloads

## Customization

### Styling
- Colors defined in `THEME` constants
- Fonts: Inter (Google Fonts)
- Layout: A4 page size with proper margins

### Content
- Exercise routines in `getWeekContent()` function
- Nutrition tips in `getNutritionTips()` function
- Weekly tips and advice sections

### Branding
- FitnessAI logo and colors
- Professional typography
- Consistent visual hierarchy

## Troubleshooting

### Common Issues
1. **PDF not generating**: Check BLOB_READ_WRITE_TOKEN
2. **Font loading errors**: Verify internet connection for Google Fonts
3. **Memory issues**: Large courses may need optimization
4. **Timeout errors**: Increase function timeout in vercel.json

### Performance Tips
- Generate PDFs on-demand, not automatically
- Cache PDF URLs in database
- Consider lazy loading for large documents
- Optimize images and content for PDF

## Future Enhancements

### Illustrated PDFs
- Add exercise diagrams
- Include form cues with images
- Custom illustrations for different workout types

### Advanced Features
- Multiple language support
- Custom templates per user
- Interactive elements (if supported)
- Progress tracking integration
