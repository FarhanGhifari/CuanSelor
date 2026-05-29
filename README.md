# CuanSelor - Retirement Planning Platform

Platform perencanaan pensiun berbasis web dengan kalkulasi aktuaria menggunakan Monte Carlo simulation.

## 📁 Struktur Project

```
CuanSelor/
├── frontend/              # Next.js frontend (Port 3000)
├── backend/               # Express.js backend (Port 8000)
├── streamlit-ds/          # Python calculator + FastAPI service (Port 8001)
└── ai-service/            # AI/LLM features (future)
```

### Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS, Better Auth
- **Backend**: Express.js, Node.js, Supabase (PostgreSQL)
- **Calculator**: Python, FastAPI, NumPy, SciPy, Pandas
- **Database**: Supabase (PostgreSQL)
- **Cache**: In-memory cache (node-cache)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install semua dependencies
npm run install:all

# Install Python dependencies
cd streamlit-ds
pip install -r requirements.txt
cd ..
```

### 2. Setup Environment Variables

#### Backend `.env`
```bash
cd backend
cp .env.example .env
# Edit .env dengan Supabase credentials
```

Required variables:
```env
PORT=8000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
BETTER_AUTH_SECRET=your_secret_key_here_min_32_chars
SUPABASE_DB_URL=postgresql://postgres.your-project-ref:your-password@host:6543/postgres
PGSSL=false
```

#### Frontend `.env.local`
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local dengan credentials
```

Required variables:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your_secret_key_here_min_32_chars
SUPABASE_DB_URL=postgresql://postgres.your-project-ref:your-password@host:6543/postgres
GOOGLE_CLIENT_ID=your_google_client_id (optional)
GOOGLE_CLIENT_SECRET=your_google_client_secret (optional)
```

#### Calculator `.env` (streamlit-ds)
```bash
cd streamlit-ds
cp .env.example .env
# Edit jika perlu (default values sudah OK)
```

Configuration:
```env
HOST=0.0.0.0
PORT=8001
N_SIMULATIONS=10000
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
```

**IMPORTANT**: 
- `BETTER_AUTH_SECRET` harus sama di backend dan frontend
- `N_SIMULATIONS` harus 10000 untuk match dengan Streamlit
- Generate secure random string untuk `BETTER_AUTH_SECRET` (min 32 chars)

### 3. Run Application

#### Recommended: Manual (3 Terminals)

Lebih mudah untuk debugging dan melihat error messages:

```bash
# Terminal 1 - Calculator Service
cd streamlit-ds
python api_server.py
# Wait until you see: "Ready to accept requests"

# Terminal 2 - Backend API
cd backend
npm run dev
# Wait until you see: "Server running on port 8000"

# Terminal 3 - Frontend
cd frontend
npm run dev
# Wait until you see: "Ready on http://localhost:3000"
```

#### Alternative: All at Once (1 Terminal)

Jika ingin run semua sekaligus (log akan tercampur):

```bash
# Dari root folder
npm run dev
```

Services akan berjalan di:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Calculator: http://localhost:8001

## 📊 Database Setup

1. Create Supabase project
2. Run migrations:
   - `backend/supabase/` - Backend migrations
   - `frontend/better-auth_migrations/` - Auth migrations
3. Update `.env` dengan credentials

### Database Schema
- `user` - User accounts (Better Auth)
- `profiles` - User personal data
- `financial_records` - Financial data
- `retirement_plans` - Retirement goals
- `risk_profiles` - Risk assessment

## 🎯 Features

### User Flow
1. **Register/Login** - Email/password atau Google OAuth
2. **Onboarding** - 12 steps untuk input data personal, finansial, dan goals
3. **Dashboard** - Lihat proyeksi pensiun dengan visualisasi
4. **Tanya FindSor!** - Chat dengan AI advisor (coming soon)

### Projection Features
- Monte Carlo simulation dengan 10,000 iterasi
- 3 skenario: Pessimistic (P10), Median (P50), Optimistic (P90)
- Actuarial calculations dengan mortality table TMPI 2023
- Portfolio optimization dengan glide path
- Ruin probability calculation
- Sensitivity analysis

## ⚡ Performance

### Calculator Service
- **Speed**: 1-2 detik per calculation
- **Cache**: <100ms untuk cached results
- **TTL**: 1 jam
- **Auto-invalidation**: Saat update profile

### N_SIMULATIONS Tuning
Edit `streamlit-ds/.env`:
```env
N_SIMULATIONS=2000   # Fast (dev) - 0.5-0.8s
N_SIMULATIONS=5000   # Balanced - 1.1-1.3s
N_SIMULATIONS=10000  # Accurate (prod) - 2.5-3.5s
```

**PENTING**: Setelah edit `.env`, restart calculator service:
```bash
cd streamlit-ds
python api_server.py
```

## 🔧 Available Scripts

### Root
```bash
npm run dev                 # Run all services
npm run dev:no-calculator   # Run frontend + backend only
npm run install:all         # Install all dependencies
```

### Individual Services
```bash
# Calculator
cd streamlit-ds
python api_server.py

# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 🧪 Testing

### Health Checks
```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:8000/api/health

# Calculator
curl http://localhost:8001/health
```

### Test Calculation
```bash
curl -X POST http://localhost:8001/calculate \
  -H "Content-Type: application/json" \
  -d @streamlit-ds/test_payload.json
```

## 🐛 Troubleshooting

### Calculator Service Not Running
**Error**: `Gagal terhubung ke AI service`

**Solution**:
```bash
cd streamlit-ds
python api_server.py
```

### Timeout Error
**Error**: `timeout of 30000ms exceeded`

**Causes**:
1. Calculator service tidak running
2. N_SIMULATIONS terlalu tinggi

**Solutions**:
```bash
# Check services
curl http://localhost:8001/health
curl http://localhost:8000/api/health

# Reduce N_SIMULATIONS untuk dev
# Edit streamlit-ds/.env
N_SIMULATIONS=2000

# Restart calculator
cd streamlit-ds
python api_server.py
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8001 | xargs kill -9
```

### Python Dependencies Missing
```bash
cd streamlit-ds
pip install -r requirements.txt
```

## 📝 Important Notes

1. **N_SIMULATIONS**: Harus sama antara Streamlit dan FastAPI (default: 10000)
2. **Calculator Logic**: Jangan ubah logika di `streamlit-ds/src/calculator.py`
3. **Cache**: Auto-invalidate saat update profile
4. **Security**: Service role key hanya di backend, never expose to frontend

## 🎨 Recent Updates

### UI/UX Improvements
- ✅ Removed AI-focused marketing cards from all forms
- ✅ Changed "Tanya FindSor!" icon to chat icon (MessageCircle)
- ✅ Simplified loading animation with custom SVG
- ✅ Moved projection display to main dashboard
- ✅ Improved data display consistency (monthly withdrawal, proper duration)

### Performance Improvements
- ✅ FastAPI service: 12-27x faster than before
- ✅ In-memory cache with 1-hour TTL
- ✅ Auto-invalidation on profile update

### Bug Fixes
- ✅ Fixed N_SIMULATIONS mismatch between Streamlit and website
- ✅ Fixed React hydration error in loading component
- ✅ Fixed data display inconsistencies

## 📚 API Documentation

### Backend Endpoints
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update profile
- `GET /api/projection` - Get projection (cached)
- `DELETE /api/projection/cache` - Clear cache

### Calculator Endpoints
- `GET /health` - Health check + config info
- `POST /calculate` - Calculate projection

## 🚀 Deployment

### Environment Variables
Set semua environment variables di platform deployment:
- Frontend: Vercel
- Backend: Railway/Render
- Calculator: Railway/Render (Python buildpack)

### Build Commands
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start

# Calculator
cd streamlit-ds && python api_server.py
```

## 📞 Support

Jika ada masalah:
1. Check semua services running (health checks)
2. Check logs di terminal
3. Verify `.env` configuration
4. Restart services
5. Check N_SIMULATIONS value

---

**CuanSelor** - Retirement Planning Made Simple 🚀

