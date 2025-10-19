# WatchMate Frontend

Modern, responsive React frontend for WatchMate - A movie tracking and review platform.

##  Features

- **JWT Authentication** - Secure login/register with token refresh
- **Movie Discovery** - Browse trending, popular, and recent movies
- **Search** - Find movies by title or storyline
- **Movie Details** - View full information, cast, reviews
- **Personal Watchlist** - Track movies you want to watch
- **Reviews & Ratings** - Rate and review movies
- **User Profiles** - View statistics and manage profile
- **Responsive Design** - Works on all devices
- **Dark Theme** - Beautiful dark UI with TailwindCSS

##  Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Lucide React** - Icons

## 📦 Installation

### Prerequisites
- Node.js 18+
- Backend API running on `http://127.0.0.1:8000`

- ### Setup

1. Clone the repository
```bash
git clone https://github.com/Resarex/watchmate-frontend.git
cd watchmate-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open browser at `http://localhost:5173`

## 🔗 Backend

This frontend connects to the WatchMate Django REST API:
- **Backend Repo:** [watchmate-api-drf](https://github.com/Resarex/watchmate-api-drf)
- **API URL:** `http://127.0.0.1:8000/api`

Make sure the backend is running before starting the frontend.

##  Features Breakdown

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Persistent login

### Movie Features
- Browse trending/popular movies
- Search by title or description
- Filter by genre, year, rating
- View detailed information
- Watch trailers

### User Features
- Personal watchlist (want to watch, watching, watched)
- Write and manage reviews
- Rate movies (1-5 stars)
- Profile statistics
- Favorite genres tracking

- ## 👤 Author

**Sidhant** - [GitHub](https://github.com/Resarex)

## 🔗 Links

- **Backend API:** [watchmate-api-drf](https://github.com/Resarex/watchmate-api-drf)
