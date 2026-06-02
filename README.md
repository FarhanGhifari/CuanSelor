# CuanSelor - Retirement Planning Platform

Platform perencanaan pensiun berbasis web dengan kalkulasi aktuaria menggunakan Monte Carlo simulation, dilengkapi AI advisor dan proyeksi finansial komprehensif.

## � Daftar Isi

- [Tentang CuanSelor](#tentang-cuanselor)
- [Tech Stack](#tech-stack)
- [Struktur Project](#struktur-project)
- [Prerequisites](#prerequisites)
- [Panduan Setup Lengkap](#panduan-setup-lengkap)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Setup Database (Supabase)](#2-setup-database-supabase)
  - [3. Setup Google OAuth](#3-setup-google-oauth-opsional)
  - [4. Setup Google Gemini API](#4-setup-google-gemini-api)
  - [5. Setup Environment Variables](#5-setup-environment-variables)
  - [6. Install Dependencies](#6-install-dependencies)
  - [7. Jalankan Aplikasi](#7-jalankan-aplikasi)
- [Deployment](#deployment)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

---

## 🎯 Tentang CuanSelor

CuanSelor adalah platform perencanaan pensiun yang membantu pengguna:
- ✅ Merencanakan dana pensiun dengan simulasi Monte Carlo (10.000 iterasi)
- ✅ Menghitung profil risiko finansial secara otomatis
- ✅ Mendapatkan proyeksi pensiun dengan 3 skenario (Pessimistic, Median, Optimistic)
- ✅ Konsultasi dengan AI Advisor (FindSor) powered by Google Gemini
- ✅ Visualisasi proyeksi dana pensiun hingga usia harapan hidup
- ✅ Analisis sensitivitas dan ruin probability

**Live Demo**: [https://cuanselor.my.id](https://cuanselor.my.id)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Better Auth
- **State Management**: React Hooks
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Supabase Client
- **Cache**: node-cache (in-memory)
- **AI**: Google Gemini 1.5 Flash
- **Email**: Resend

### Calculator Service
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Libraries**: NumPy, SciPy, Pandas
- **Simulation**: Monte Carlo (10.000 iterations)
- **Mortality Table**: TMPI 2023 (Indonesia)

---

## 📁 Struktur Project

```
CuanSelor/
├── frontend/              # Next.js frontend (Port 3000)
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # Reusable components
│   │   ├── features/     # Feature-based modules
│   │   └── lib/          # Utilities & configs
│   ├── public/           # Static assets
│   └── package.json
│
├── backend/               # Express.js backend (Port 8000)
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── middlewares/  # Express middlewares
│   │   ├── modules/      # Feature modules
│   │   │   ├── auth/     # Authentication
│   │   │   ├── profile/  # User profiles
│   │   │   ├── projection/ # Projection calculations
│   │   │   ├── advisor/  # AI Advisor
│   │   │   └── risk/     # Risk profiling
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utilities
│   └── package.json
│
├── streamlit-ds/          # Python calculator + FastAPI (Port 8001)
│   ├── src/
│   │   └── calculator.py # Monte Carlo simulation
│   ├── api_server.py     # FastAPI server
│   └── requirements.txt  # Python dependencies
│
└── ai-service/            # Future AI features
```

---

## 🔧 Prerequisites

Sebelum memulai, pastikan sudah menginstall:

### Required
- **Node.js** v18+ dan npm ([Download](https://nodejs.org/))
- **Python** 3.10+ dan pip ([Download](https://www.python.org/))
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** ([Sign Up](https://supabase.com/))
- **Google Gemini API Key** ([Get API Key](https://ai.google.dev/))

### Optional
- **Google Cloud Account** (untuk Google OAuth)
- **Domain & DNS** (untuk production deployment)

### Cek Versi
```bash
node --version   # v18.0.0 atau lebih tinggi
npm --version    # 9.0.0 atau lebih tinggi
python --version # Python 3.10.0 atau lebih tinggi
git --version    # Versi terbaru
```

---

## 🚀 Panduan Setup Lengkap

### 1. Clone Repository

```bash
# Clone repository
git clone https://github.com/your-username/CuanSelor.git
cd CuanSelor

# Atau jika menggunakan GitHub CLI
gh repo clone your-username/CuanSelor
cd CuanSelor
```

---

### 2. Setup Database (Supabase)

#### A. Buat Project Baru di Supabase

1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Klik **"New Project"**
3. Isi informasi project:
   - **Name**: CuanSelor (atau nama lain)
   - **Database Password**: Buat password kuat (simpan ini!)
   - **Region**: Pilih yang terdekat (Southeast Asia)
4. Klik **"Create new project"**
5. Tunggu 2-3 menit hingga project selesai dibuat

#### B. Dapatkan Database Credentials

Setelah project dibuat, catat informasi berikut:

1. **Project URL**:
   - Buka tab **"Settings"** → **"API"**
   - Copy **"Project URL"**: `https://xxxxx.supabase.co`

2. **Service Role Key**:
   - Masih di tab **"API"**
   - Copy **"service_role"** key (bukan anon key!)
   - ⚠️ **JANGAN EXPOSE KE FRONTEND!**

3. **Database URL**:
   - Buka tab **"Settings"** → **"Database"**
   - Scroll ke **"Connection string"** → pilih **"URI"**
   - Copy connection string, contoh:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres
   ```
   - Replace `[YOUR-PASSWORD]` dengan password yang kamu buat tadi

#### C. Download SSL Certificate (untuk production)

1. Masih di tab **"Database"**
2. Scroll ke **"SSL Certificate"**
3. Download certificate dan save sebagai `backend/src/config/certs/supabase-ca.crt`

```bash
# Buat folder certs jika belum ada
mkdir -p backend/src/config/certs

# Copy certificate ke folder ini
```

#### D. Jalankan Database Migrations

CuanSelor menggunakan Better Auth untuk authentication. Run migrations:

```bash
# 1. Copy environment variables dulu (langkah 5)
# 2. Install dependencies dulu (langkah 6)

# 3. Jalankan Better Auth migrations
cd frontend
npx @better-auth/cli migrate

# Migrations akan membuat tables:
# - user
# - session
# - account
# - verification
```

Manual migration files ada di:
- `frontend/better-auth_migrations/` - Auth tables
- `backend/migrations/` - Custom tables (jika ada)

#### E. Verifikasi Database

1. Buka **Supabase Dashboard** → **"Table Editor"**
2. Pastikan tables berikut sudah dibuat:
   - `user` - User accounts
   - `session` - Active sessions
   - `account` - OAuth accounts
   - `verification` - Email verification tokens

---

### 3. Setup Google OAuth (Opsional)

Jika ingin mengaktifkan login dengan Google:

#### A. Buat Google Cloud Project

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik **"Select a project"** → **"New Project"**
3. Nama project: **"CuanSelor"** (atau nama lain)
4. Klik **"Create"**


#### B. Aktifkan Google+ API

1. Di sidebar, klik **"APIs & Services"** → **"Library"**
2. Search **"Google+ API"**
3. Klik **"Enable"**

#### C. Buat OAuth Credentials

1. Klik **"APIs & Services"** → **"Credentials"**
2. Klik **"Create Credentials"** → **"OAuth client ID"**
3. Pilih **"Configure consent screen"** (jika diminta):
   - User Type: **External**
   - App name: **CuanSelor**
   - User support email: Email kamu
   - Developer contact: Email kamu
   - Klik **"Save and Continue"**
   - Skip "Scopes" dan "Test users"
4. Kembali ke **"Create Credentials"** → **"OAuth client ID"**:
   - Application type: **Web application**
   - Name: **CuanSelor Web Client**
   
5. **Authorized redirect URIs** (tambahkan semua):
   ```
   # Development
   http://localhost:8000/api/auth/callback/google
   
   # Production (ganti dengan domain kamu)
   https://api.cuanselor.my.id/api/auth/callback/google
   ```

6. Klik **"Create"**
7. Copy **Client ID** dan **Client Secret**

⚠️ **PENTING**: 
- Backend endpoint: `[YOUR_BACKEND_URL]/api/auth/callback/google`
- Bukan frontend URL!

---

### 4. Setup Google Gemini API

AI Advisor (FindSor) menggunakan Google Gemini 1.5 Flash.

#### A. Dapatkan API Key


1. Buka [Google AI Studio](https://ai.google.dev/)
2. Klik **"Get API Key"**
3. Pilih atau buat Google Cloud project
4. Copy API Key yang digenerate
5. Simpan API key ini untuk environment variables

#### B. Verifikasi API Key

```bash
# Test API key dengan curl
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

Jika berhasil, akan mengembalikan response dengan text generated.

---

### 5. Setup Environment Variables

#### A. Backend Environment Variables

```bash
cd backend
cp .env.example .env.local     # Development
cp .env.example .env.production # Production (optional)
```

Edit `backend/.env.local`:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database (Supabase)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_URL=postgresql://postgres.your-project-ref:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres
PGSSL=false

# Better Auth (Generate random 32+ character string)
BETTER_AUTH_SECRET=your_random_secret_min_32_characters_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# FastAPI Calculator Service
FASTAPI_URL=http://localhost:8001

# CORS (Frontend URLs)
FRONTEND_URL=http://localhost:3000

```

**Generate BETTER_AUTH_SECRET**:
```bash
# Node.js method
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL method
openssl rand -hex 32

# Online generator (jangan untuk production!)
# https://generate-secret.vercel.app/32
```

#### B. Frontend Environment Variables

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ML_API_URL=http://localhost:8000

# Better Auth (HARUS SAMA dengan backend!)
BETTER_AUTH_SECRET=your_random_secret_min_32_characters_here
BETTER_AUTH_URL=http://localhost:3000

# Database (sama dengan backend)
SUPABASE_DB_URL=postgresql://postgres.your-project-ref:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres

# Google OAuth (Optional, sama dengan backend)
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here
```

⚠️ **PENTING**:
- `BETTER_AUTH_SECRET` **HARUS SAMA** di backend dan frontend!
- Jangan commit file `.env.local` ke Git!

#### C. Calculator Environment Variables

```bash
cd streamlit-ds
cp .env.example .env
```

Edit `streamlit-ds/.env`:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8001

# Monte Carlo Simulation
N_SIMULATIONS=10000

# CORS (Frontend & Backend URLs)
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

**N_SIMULATIONS Tuning**:
- `2000` - Fast (0.5-0.8s) untuk development
- `5000` - Balanced (1.1-1.3s)
- `10000` - Accurate (2.5-3.5s) untuk production

---

### 6. Install Dependencies

#### A. Install Node.js Dependencies

```bash
# Dari root folder, install semua sekaligus
npm run install:all

# Atau manual satu per satu
npm install           # Root dependencies (concurrently)
cd frontend && npm install
cd ../backend && npm install
```

#### B. Install Python Dependencies

```bash
cd streamlit-ds
pip install -r requirements.txt

# Atau gunakan virtual environment (recommended)
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Python Packages** yang akan diinstall:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `numpy` - Numerical computing
- `scipy` - Scientific computing
- `pandas` - Data manipulation
- `python-dotenv` - Environment variables
- `pydantic` - Data validation

---

### 7. Jalankan Aplikasi

Ada 2 cara menjalankan aplikasi:

#### A. Manual (Recommended untuk Development)

Lebih mudah untuk debugging. Buka **3 terminal** terpisah:

**Terminal 1 - Calculator Service**:
```bash
cd streamlit-ds
python api_server.py

# Tunggu hingga muncul:
# ✅ Ready to accept requests
# 🚀 Running on http://0.0.0.0:8001
```

**Terminal 2 - Backend API**:
```bash
cd backend
npm run dev

# Tunggu hingga muncul:
# ✅ Server running on http://localhost:8000
# ✅ Database connected
```

**Terminal 3 - Frontend**:
```bash
cd frontend
npm run dev

# Tunggu hingga muncul:
# ✅ Ready on http://localhost:3000
```

#### B. All at Once (1 Terminal)

Jalankan semua services sekaligus (logs akan tercampur):

```bash
# Dari root folder
npm run dev

# Atau tanpa calculator
npm run dev:no-calculator
```

#### C. Verifikasi Services

Buka browser dan test:

1. **Frontend**: [http://localhost:3000](http://localhost:3000)
2. **Backend Health**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
3. **Calculator Health**: [http://localhost:8001/health](http://localhost:8001/health)

Expected responses:
```json
// Backend
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}

// Calculator
{"status":"healthy","n_simulations":10000,"message":"Ready to accept requests"}
```

---

## 🌐 Deployment

### A. Frontend (Vercel)

1. Push code ke GitHub
2. Buka [Vercel](https://vercel.com/) → **"Import Project"**
3. Pilih repository CuanSelor
4. **Framework Preset**: Next.js
5. **Root Directory**: `frontend`
6. **Build Command**: `npm run build`
7. **Environment Variables**: Copy semua dari `.env.local` (kecuali yang NEXT_PUBLIC)
8. Ganti `NEXT_PUBLIC_` variables dengan URL production
9. Deploy!

### B. Backend (Railway)

1. Buka [Railway](https://railway.app/) → **"New Project"** → **"Deploy from GitHub repo"**
2. Pilih repository
3. **Root Directory**: `backend`
4. **Start Command**: `npm start`
5. **Environment Variables**: Copy semua dari `.env.production`
6. Generate domain atau gunakan custom domain
7. Deploy!

### C. Calculator (Railway/Render)

**Railway**:
1. New Project → Deploy from GitHub
2. **Root Directory**: `streamlit-ds`
3. **Start Command**: `python api_server.py`
4. **Environment Variables**: Copy dari `.env`
5. Deploy!

**Render**:
1. New Web Service → Connect repository
2. **Root Directory**: `streamlit-ds`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `python api_server.py`
5. **Environment Variables**: Copy dari `.env`
6. Deploy!

### D. Custom Domain

#### Vercel (Frontend)
1. Dashboard → Settings → Domains
2. Add domain: `cuanselor.my.id`
3. Update DNS:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

#### Railway (Backend)
1. Settings → Networking → Custom Domain
2. Add domain: `api.cuanselor.my.id`
3. Update DNS:
   ```
   Type: CNAME
   Name: api
   Value: your-app.up.railway.app
   ```

---

## ✨ Features

### User Flow
1. **Landing Page** - Marketing page dengan problem-solution sections
2. **Register/Login** - Email/password atau Google OAuth
3. **Email Verification** - Verifikasi email dengan token
4. **Onboarding Wizard** - 12 steps input data:
   - Personal (nama, usia, jenis kelamin)
   - Finansial (gaji, bonus, tabungan)
   - Goals (usia pensiun, target dana)
   - Risk profiling (10 pertanyaan)
   - Sektor pekerjaan
   - Assumptions (bunga deposito, inflasi, dll)
5. **Dashboard** - Lihat proyeksi dengan visualisasi
6. **Tanya FindSor!** - Chat dengan AI advisor
7. **Profile** - Update data personal dan finansial

### Projection Features
- **Monte Carlo Simulation**: 10.000 iterasi untuk akurasi tinggi
- **3 Skenarios**: Pessimistic (P10), Median (P50), Optimistic (P90)
- **Actuarial Calculations**: Mortality table TMPI 2023 (Indonesia)
- **Portfolio Optimization**: Dynamic asset allocation dengan glide path
- **Ruin Probability**: Kemungkinan dana habis sebelum akhir periode
- **Sensitivity Analysis**: Analisis sensitivitas terhadap berbagai parameter
- **Cache System**: In-memory cache 1 jam, auto-invalidate saat update

### AI Advisor Features
- **Context-Aware**: Memahami data finansial user
- **Personalized Advice**: Rekomendasi berdasarkan profil risiko
- **Multi-Topic**: Dana darurat, investasi, pensiun, budgeting
- **Powered by**: Google Gemini 1.5 Flash

---

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/signup/email
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "callbackURL": "http://localhost:3000/auth/verify-email"
}
```

#### Login
```http
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Google OAuth
```http
GET /api/auth/sign-in/google
```

### Profile Endpoints

#### Get Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
POST /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "age": 30,
  "gender": "male",
  "monthly_income": 10000000,
  "annual_bonus_months": 2,
  "savings_percentage": 20,
  "current_savings": 50000000,
  "retirement_age": 55,
  "planning_age": 85,
  "lifestyle_percent": 70,
  "risk_profile": "moderate",
  "sector": "Aktivitas Keuangan dan Asuransi",
  "has_health_insurance": true,
  "deposit_rate": 5.5,
  "include_pandemic_risk": false
}
```

### Projection Endpoints

#### Get Projection
```http
GET /api/projection
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "cached": false,
  "data": {
    "age_range": [30, 31, ..., 85],
    "median": [50000000, 52000000, ...],
    "p10": [45000000, ...],
    "p90": [55000000, ...],
    "monthly_withdrawal": 7000000,
    "ruin_probability": 0.05,
    "metadata": {
      "n_simulations": 10000,
      "calculation_time": 2.5
    }
  }
}
```

#### Clear Cache
```http
DELETE /api/projection/cache
Authorization: Bearer <token>
```

### AI Advisor Endpoints

#### Chat with FindSor
```http
POST /api/advisor/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Bagaimana cara memulai investasi untuk pemula?"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "response": "Berdasarkan profil finansial kamu...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Calculator Endpoints

#### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "n_simulations": 10000,
  "message": "Ready to accept requests"
}
```

#### Calculate Projection
```http
POST /calculate
Content-Type: application/json

{
  "age": 30,
  "gender": "male",
  "retirement_age": 55,
  "planning_age": 85,
  "monthly_income": 10000000,
  "annual_bonus": 24000000,
  "savings_percentage": 0.20,
  "current_savings": 50000000,
  "lifestyle_percent": 0.70,
  "sector": "finance",
  "has_health_insurance": true,
  "deposit_rate": 0.055,
  "include_pandemic_risk": false
}
```

---

## 🐛 Troubleshooting

### 1. Calculator Service Not Running

**Error**: `Gagal terhubung ke AI service` atau `ECONNREFUSED localhost:8001`

**Solution**:
```bash
# Check calculator service
curl http://localhost:8001/health

# Jika tidak running, start manual
cd streamlit-ds
python api_server.py

# Check logs untuk error
```

**Common Causes**:
- Python dependencies belum diinstall
- Port 8001 sudah digunakan aplikasi lain
- Virtual environment belum diaktifkan

### 2. Timeout Error

**Error**: `timeout of 30000ms exceeded`

**Causes**:
1. Calculator service tidak running
2. N_SIMULATIONS terlalu tinggi (>10000)
3. Server overload

**Solutions**:
```bash
# 1. Check services health
curl http://localhost:8001/health
curl http://localhost:8000/api/health

# 2. Reduce N_SIMULATIONS untuk development
# Edit streamlit-ds/.env
N_SIMULATIONS=2000

# 3. Restart calculator service
cd streamlit-ds
python api_server.py
```

### 3. Database Connection Error

**Error**: `Connection terminated unexpectedly` atau `SASL authentication failed`

**Solutions**:
1. Check `SUPABASE_DB_URL` format:
   ```env
   postgresql://postgres.xxxxx:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres
   ```
2. Pastikan password sudah benar (tidak ada karakter special yang perlu di-encode)
3. Check SSL certificate sudah di download
4. Verifikasi `PGSSL=false` di development, `PGSSL=true` di production

### 4. Better Auth Error

**Error**: `Secret is not set` atau `Invalid session`

**Solutions**:
```bash
# 1. Check BETTER_AUTH_SECRET ada dan sama
# Backend .env.local
BETTER_AUTH_SECRET=your_secret_here

# Frontend .env.local
BETTER_AUTH_SECRET=your_secret_here  # HARUS SAMA!

# 2. Generate baru jika perlu
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Restart backend dan frontend
```

### 5. Google OAuth Not Working

**Error**: `redirect_uri_mismatch`

**Solutions**:
1. Check authorized redirect URIs di Google Cloud Console:
   ```
   # Development
   http://localhost:8000/api/auth/callback/google
   
   # Production
   https://api.your-domain.com/api/auth/callback/google
   ```
2. Pastikan menggunakan **backend URL**, bukan frontend!
3. Check `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` sama di backend & frontend

### 6. Port Already in Use

**Windows**:
```bash
# Find process using port
netstat -ano | findstr :8001

# Kill process
taskkill /PID <PID> /F
```

**Linux/Mac**:
```bash
# Find and kill process
lsof -ti:8001 | xargs kill -9
```

### 7. Python Module Not Found

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
cd streamlit-ds

# Activate virtual environment
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### 8. Build Error di Vercel

**Error**: `Module not found` atau `Build failed`

**Solutions**:
1. Check **Root Directory** di Vercel settings = `frontend`
2. Check **Build Command** = `npm run build`
3. Pastikan semua environment variables sudah di-set
4. Clear cache dan redeploy

### 9. Gemini API Error

**Error**: `API key not valid` atau `429 Too Many Requests`

**Solutions**:
1. Verify API key di [https://ai.google.dev/](https://ai.google.dev/)
2. Check quota usage
3. Wait beberapa menit jika hit rate limit
4. Pastikan billing enabled di Google Cloud (free tier ada limit)

---

## 📮 API Testing with Postman

### Import Postman Collection

CuanSelor menyediakan Postman Collection lengkap dengan 26 endpoints untuk testing API.

#### Cara Import:
1. Buka Postman
2. Klik **"Import"** button
3. Pilih file `postman_collection.json` dari root folder
4. Klik **"Import"**

#### Setup Environment Variables:
Setelah import, set variables di Collection:
- **Development**:
  ```
  base_url: http://localhost:8000
  calculator_url: http://localhost:8001
  ```
- **Production**:
  ```
  base_url: https://api.cuanselor.my.id
  calculator_url: https://calculator-api-url
  ```

Variables `auth_token` dan `user_id` akan otomatis di-set setelah login.

### Quick Start Testing Flow

**1. Check Services Health**
```
GET {{base_url}}/api/health
GET {{calculator_url}}/health
```

**2. Register & Login**
```http
POST {{base_url}}/api/auth/signup/email
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!",
  "callbackURL": "http://localhost:3000/auth/verify-email"
}

POST {{base_url}}/api/auth/sign-in/email
{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

✅ Auth token akan otomatis disimpan dan digunakan untuk request selanjutnya!

**3. Complete Onboarding**
```http
POST {{base_url}}/api/profile
Authorization: Bearer {{auth_token}}

{
  "full_name": "Test User",
  "age": 30,
  "gender": "male",
  "monthly_income": 10000000,
  "annual_bonus_months": 2,
  "savings_percentage": 20,
  "current_savings": 50000000,
  "retirement_age": 55,
  "planning_age": 85,
  "lifestyle_percent": 70,
  "risk_profile": "moderate",
  "sector": "Aktivitas Keuangan dan Asuransi",
  "has_health_insurance": true,
  "deposit_rate": 5.5,
  "include_pandemic_risk": false
}
```

**4. Get Projection**
```http
GET {{base_url}}/api/projection
Authorization: Bearer {{auth_token}}

Response:
{
  "success": true,
  "cached": false,
  "data": {
    "age_range": [30, 31, ..., 85],
    "median": [50000000, 52500000, ...],
    "p10": [45000000, ...],
    "p90": [55000000, ...],
    "monthly_withdrawal": 7000000,
    "ruin_probability": 0.05
  }
}
```

**5. Chat with AI**
```http
POST {{base_url}}/api/advisor/chat
Authorization: Bearer {{auth_token}}

{
  "message": "Bagaimana cara mengatur dana darurat?"
}
```

### Collection Endpoints Overview

**🏥 Health Checks** (2)
- Backend Health
- Calculator Health

**🔐 Authentication** (8)
- Register, Login, Verify Email
- Resend Verification, Forgot/Reset Password
- Google OAuth, Logout

**👤 Profile Management** (4)
- Get Profile
- Create/Update Profile
- Update Profile (Partial)
- Delete Profile

**📊 Retirement Projection** (4)
- Get Projection (Cached)
- Clear Cache
- Get Cache Stats
- Clear All Cache

**⚠️ Risk Assessment** (2)
- Calculate Risk Profile
- Get Risk Profile

**🤖 AI Advisor** (3)
- Chat with FindSor
- Get Chat History
- Clear History

**🧮 Calculator Direct** (3)
- Health Check
- Calculate Projection
- Test Payload

### Common Testing Errors

**1. Error 401 Unauthorized**
- **Cause**: Auth token tidak valid/expired
- **Fix**: Login ulang, token akan auto-saved

**2. Error "Gagal terhubung ke AI service"**
- **Cause**: Calculator service tidak running
- **Fix**: `cd streamlit-ds && python api_server.py`

**3. Error "timeout exceeded"**
- **Cause**: N_SIMULATIONS terlalu tinggi
- **Fix**: Edit `streamlit-ds/.env` → `N_SIMULATIONS=2000`

**4. Error "Profile not found"**
- **Cause**: Belum complete onboarding
- **Fix**: Run `POST /api/profile` dengan complete data

### Expected Response Times

| Endpoint | Time | Notes |
|----------|------|-------|
| Login | 100-300ms | |
| Get Profile | 50-150ms | |
| Get Projection (cached) | <100ms | In-memory cache |
| Get Projection (fresh) | 2500-3500ms | Monte Carlo 10k |
| Calculate Risk | 100-200ms | |
| Chat AI | 2000-5000ms | Gemini API |

---

## ❓ FAQ

### Q: Apakah bisa menggunakan database selain Supabase?
**A**: Ya, tapi perlu modifikasi kode. CuanSelor menggunakan Supabase client, jika mau pakai PostgreSQL langsung perlu ganti dengan library seperti `pg` atau `prisma`.

### Q: Berapa biaya untuk menjalankan CuanSelor?
**A**: 
- Supabase: Free tier (500MB database, 1GB bandwidth)
- Vercel: Free tier (100GB bandwidth)
- Railway: Free tier ($5 credit/month, cukup untuk backend)
- Google Gemini: Free tier (60 requests/minute)
- **Total**: Bisa gratis jika traffic rendah

### Q: Apakah Monte Carlo simulation akurat?
**A**: Ya, dengan 10.000 iterasi hasil sangat akurat. Menggunakan mortality table TMPI 2023 dari Indonesia.

### Q: Bisa ganti AI model selain Gemini?
**A**: Ya, edit `backend/src/modules/advisor/advisor.service.js`. Bisa pakai OpenAI, Claude, atau model lain.

### Q: Bagaimana cara menambah fitur baru?
**A**: 
1. Frontend: Buat component di `frontend/src/features/[feature-name]`
2. Backend: Buat module di `backend/src/modules/[module-name]`
3. Follow struktur yang ada (controller, service, routes)

### Q: Database schema ada dimana?
**A**: Better Auth auto-generate schema. Custom tables bisa dibuat manual di Supabase Table Editor atau via migrations.

### Q: Kenapa pakai 3 services terpisah?
**A**:
- **Frontend**: Next.js untuk SSR & optimal UX
- **Backend**: Express untuk API & business logic  
- **Calculator**: Python untuk scientific computing (NumPy, SciPy)

Separation of concerns membuat maintenance lebih mudah.

### Q: Apakah data user aman?
**A**:
- Password di-hash dengan bcrypt
- Session management dengan Better Auth
- Database di-host di Supabase (secure by default)
- Service role key tidak exposed ke frontend
- HTTPS di production

### Q: Bisa deploy di server sendiri?
**A**: Ya! Deploy di VPS/dedicated server:
```bash
# Install PM2
npm install -g pm2

# Run backend
cd backend
pm2 start npm --name "cuanselor-backend" -- start

# Run frontend
cd frontend
pm2 start npm --name "cuanselor-frontend" -- start

# Run calculator
cd streamlit-ds
pm2 start python --name "cuanselor-calculator" -- api_server.py
```

---

## 📞 Support & Contact

- **Website**: [https://cuanselor.my.id](https://cuanselor.my.id)
- **GitHub**: [https://github.com/your-username/CuanSelor](https://github.com/your-username/CuanSelor)
- **Email**: support@cuanselor.my.id

---

## 📝 License

MIT License - Free to use for personal and commercial projects.

---

## 🙏 Credits

- **Mortality Table**: TMPI 2023 (Indonesia)
- **Icons**: Lucide React
- **UI Components**: TailwindCSS
- **AI**: Google Gemini 1.5 Flash
- **Database**: Supabase
- **Deployment**: Vercel, Railway

---

**CuanSelor** - Retirement Planning Made Simple 🚀

Dibuat dengan ❤️ untuk membantu masyarakat Indonesia merencanakan masa pensiun yang lebih baik.
