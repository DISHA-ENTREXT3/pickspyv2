# 🚀 PickSpy - AI-Powered Trending Product Discovery

**A platform to discover trending products on Amazon using AI analysis, Reddit sentiment tracking, and real-time market signals.**

## 🎯 Quick Links

- **🚀 [QUICK DEPLOY GUIDE](QUICK_DEPLOY.md)** - Deploy in 30 minutes
- **📋 [PROJECT STATUS](PROJECT_STATUS.md)** - Current status and checklist
- **📚 [DEPLOYMENT GUIDE](DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- **🗄️ [DATABASE SETUP](SUPABASE_SETUP_FINAL.sql)** - Supabase configuration

---

## ✨ Features

- 🔍 **Smart Product Discovery** - Find trending products before they blow up
- 🤖 **AI Analysis** - Powered by Claude AI for intelligent insights
- 📊 **Market Signals** - Real-time demand tracking, velocity scores, saturation analysis
- 💬 **Reddit Integration** - Track sentiment and discussions on Reddit
- 📈 **Trend Analysis** - See what's trending on different platforms
- 🛒 **Product Comparison** - Compare multiple products side-by-side
- ⭐ **Watchlist** - Save products and track them over time
- 👥 **Community Insights** - See what others are discussing

---

## 🏗️ Architecture

**Frontend**: React + Vite + TypeScript (deployed on Vercel)
**Backend**: Python + FastAPI (deployed on Render)
**Database**: PostgreSQL + Supabase (managed cloud database)
**APIs**: ScrapingDog (web scraping), Claude AI (analysis)

---

## 🚀 Getting Started

### For Development

1. **Clone the repository**:
   ```sh
   git clone https://github.com/DISHA-ENTREXT3/pickspyv2.git
   cd pickspyv2
   ```

2. **Install frontend dependencies**:
   ```sh
   npm i
   npm run dev
   ```

3. **Install backend dependencies**:
   ```sh
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --reload
   ```

4. **Set up environment variables** (see `.env.example`)

### For Production

**⚠️ See [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for step-by-step deployment instructions**

In summary:
1. Deploy frontend to Vercel
2. Deploy backend to Render
3. Configure Supabase database
4. Set environment variables
5. Done! 🎉

---

## 📁 Project Structure

```
pickspyv2/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── contexts/          # Context providers
│   ├── lib/               # Utility functions
│   └── App.tsx            # Main app component
├── backend/               # Python backend
│   ├── main.py            # FastAPI app
│   ├── scrapers/          # Scraping logic
│   ├── requirements.txt    # Python dependencies
│   └── supabase_utils.py  # Database utilities
├── supabase_schema.sql    # Database schema
├── package.json           # Frontend dependencies
└── README.md              # This file
```

---

## 🔧 How can I edit this code?

**Use your preferred IDE**:

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository
git clone https://github.com/DISHA-ENTREXT3/pickspyv2.git

# Step 2: Navigate to the project directory
cd pickspyv2

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

**Edit directly in GitHub**:

- Navigate to any file
- Click the "Edit" button (pencil icon) at the top right
- Make your changes and commit

**Use GitHub Codespaces**:

- Click "Code" → "Codespaces" → "New codespace"
- Edit files and commit changes

---

## 🛠 Tech Stack

This project uses:

## 🛠 Tech Stack

This project uses:

**Frontend**:
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn UI components

**Backend**:
- Python 3
- FastAPI
- PostgreSQL (via Supabase)
- BeautifulSoup4 (scraping)
- Pydantic (validation)

**External Services**:
- Supabase (database & auth)
- Claude AI (analysis)
- ScrapingDog (web scraping)

---

## 📦 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/trends` - Get trending products

### Authenticated Endpoints
- `POST /api/save-product` - Save product to watchlist
- `POST /api/compare` - Compare products
- `GET /api/user/activity` - Get user activity
- `GET /api/user/watchlist` - Get saved products

---

## 🔐 Environment Variables

Create a `.env.local` file with these variables:

```env
# Frontend (Vite)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_BACKEND_API_URL=https://pickspy-backend.onrender.com

# Backend (Python)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key
SCRAPINGDOG_API_KEY=your_api_key
```

**For production (Vercel/Render/Supabase):**
- Use production Supabase URL (not localhost)
- Set VITE_BACKEND_API_URL to your Render backend URL
- Store all keys in environment variables, never commit `.env` files

See `.env.example` for the full list.

---

## 📊 Database Schema

The project uses Supabase PostgreSQL with these tables:

- `products` - Product catalog
- `user_activity` - User interactions
- `saved_products` - Watchlisted products
- `comparisons` - Product comparisons

Run [SUPABASE_SETUP_FINAL.sql](SUPABASE_SETUP_FINAL.sql) to initialize the database.

---

## 🧪 Testing

```sh
# Run tests
npm run test

# Watch mode
npm run test:watch

# Lint
npm run lint
```

---

## 🚀 Deployment

### Quick Deploy (Recommended)
Follow [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - deploy in 30 minutes!

### Detailed Instructions
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive steps.

### Status & Checklist
Check [PROJECT_STATUS.md](PROJECT_STATUS.md) for current status and verification checklists.

---

## 📈 Performance

- Frontend: Served globally via Vercel CDN
- Backend: Serverless Python on Render
- Database: Managed PostgreSQL on Supabase
- Caching: Optimized indexes and queries

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/DISHA-ENTREXT3/pickspyv2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/DISHA-ENTREXT3/pickspyv2/discussions)

---

**Made with ❤️ by DISHA-ENTREXT3**
- React
- shadcn-ui
- Tailwind CSS

