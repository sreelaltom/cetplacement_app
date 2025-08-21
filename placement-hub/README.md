# CET Placement Hub

A comprehensive placement preparation platform exclusively for CET college students. This web application facilitates crowd-sourced learning, interview experience sharing, and collaborative preparation for placements.

## 🔹 Features

- **College Email Authentication**: Secure login restricted to @cet.ac.in emails
- **Branch-Specific Content**: Tailored resources for each engineering branch
- **Crowd-Sourced Materials**: Students can share notes, videos, and preparation tips
- **Interview Experiences**: Company-wise interview insights and experiences
- **Gamification**: Point-based system with community leaderboard
- **Daily Challenges**: Practice questions for consistent preparation
- **Company Insights**: Detailed company information and hiring patterns

## 🔹 Tech Stack

### Frontend

- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Supabase** for authentication

### Backend

- **Django 4.2** with Django REST Framework
- **PostgreSQL** (via Supabase)
- **JWT Authentication** with Supabase integration
- **CORS** handling for frontend integration

### Database & Auth

- **Supabase** for PostgreSQL database and authentication
- **Google OAuth** restricted to college domain

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Supabase account

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

5. **Database setup**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## 📊 API Endpoints

### Authentication

- Uses Supabase JWT tokens
- Automatic user profile creation/retrieval

### Core Endpoints

- `GET/POST /api/subjects/` - Subject management
- `GET/POST /api/posts/` - Study material posts
- `GET/POST /api/companies/` - Company information
- `GET/POST /api/experiences/` - Interview experiences
- `GET /api/challenges/` - Daily challenges
- `GET /api/users/leaderboard/` - Community leaderboard

### Voting System

- `POST /api/posts/{id}/vote/` - Vote on posts
- `POST /api/experiences/{id}/vote/` - Vote on experiences

## 🗃️ Database Schema

### Core Models

- **UserProfile**: Extended user information linked to Supabase UID
- **Subject**: Academic subjects (branch-specific or common)
- **Post**: Study materials and notes
- **Company**: Company information for placement preparation
- **InterviewExperience**: Shared interview experiences
- **DailyChallenge**: Practice questions and challenges

### Relationships

- Posts belong to Subjects
- Experiences belong to Companies
- Voting system for content quality
- Point system for gamification

## 🎨 Design Principles

### User Experience

- **Mobile-first responsive design**
- **Intuitive navigation** with clear categorization
- **Fast loading** with optimized API calls
- **Accessibility** following WCAG guidelines

### Security

- **Domain-restricted authentication** (@cet.ac.in only)
- **JWT token validation** on every API call
- **Input sanitization** and validation
- **CORS configuration** for secure cross-origin requests

## 🚀 Deployment

### Backend (Railway/Render)

1. Connect GitHub repository
2. Set environment variables
3. Configure build command: `pip install -r requirements.txt`
4. Configure start command: `gunicorn hub.wsgi:application`

### Frontend (Vercel)

1. Connect GitHub repository
2. Set environment variables
3. Auto-deploy on main branch

### Database

- **Supabase** provides managed PostgreSQL
- Automatic backups and scaling
- Built-in authentication integration

## 📝 Environment Variables

### Backend (.env)

```bash
DJANGO_SECRET_KEY=your-secret-key
DEBUG=False
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-password
SUPABASE_DB_HOST=db.xxxx.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Frontend (.env)

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=https://your-api.railway.app/api
```

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration
- **Commits**: Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Developed for CET college students by CET students.

## 📞 Support

For support or questions:

- Create an issue on GitHub
- Contact through college email

---

**Note**: This platform is exclusively for CET college students and requires a valid @cet.ac.in email address for access.
