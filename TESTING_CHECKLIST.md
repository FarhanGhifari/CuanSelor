# Testing Checklist — Dashboard Proyeksi Pensiun

## 🧪 Backend Testing

### 1. Python Calculator (Standalone)
```bash
cd streamlit-ds

# Test dengan sample input
echo '{
  "name": "Test User",
  "age": 30,
  "gender": "male",
  "monthly_salary": 10000000,
  "savings_rate": 0.2,
  "retirement_age": 55,
  "risk_profile": "moderate",
  "sector": "Rata-rata",
  "include_pandemic_risk": false,
  "custom_deposit_rate": null,
  "custom_planning_age": null,
  "current_assets": 0,
  "annual_bonus_months": 1,
  "replacement_ratio": 0.7,
  "has_health_insurance": false,
  "monthly_expense": null
}' | python run_calculator.py
```

**Expected Output:**
- JSON object dengan keys: `user_profile`, `actuarial_summary`, `projection`, `recommendations`, `sensitivity`, `ab_test_result`, `actionable_insights`, `metadata`
- No Python errors di stderr
- Exit code 0

**Checklist:**
- [ ] Script berjalan tanpa error
- [ ] Output JSON valid
- [ ] Semua field ada dan tidak null
- [ ] Angka-angka masuk akal (tidak negatif, tidak infinity)

---

### 2. Express Backend Endpoint

```bash
# Start backend
cd backend
npm start

# Test endpoint (ganti <TOKEN> dengan auth token valid)
curl -X GET http://localhost:8000/api/projection \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "user_profile": { ... },
    "actuarial_summary": { ... },
    "projection": { ... },
    ...
  }
}
```

**Checklist:**
- [ ] Endpoint merespons dengan status 200
- [ ] Data user berhasil diambil dari Supabase
- [ ] Python child process berhasil dijalankan
- [ ] Output JSON valid dan lengkap
- [ ] Tidak ada timeout (< 30 detik)

**Error Cases:**
- [ ] 401 jika tidak ada auth token
- [ ] 400 jika data user belum lengkap (onboarding belum selesai)
- [ ] 500 jika Python error atau timeout

---

## 🎨 Frontend Testing

### 3. Development Server

```bash
cd frontend
npm run dev
# Navigate to http://localhost:3000/dashboard/projection
```

**Checklist:**

#### Loading State
- [ ] Spinner muncul saat fetch data
- [ ] Text "Menghitung proyeksi pensiun..." tampil
- [ ] Tidak ada error di console

#### Success State (Data Lengkap)
- [ ] Hero banner tampil dengan nama user
- [ ] Status badge (On Track / Perlu Perhatian) sesuai dengan `is_on_track`
- [ ] 4 kartu metrik tampil dengan angka yang benar
- [ ] Ruin gauge tampil dengan warna sesuai threshold:
  - Hijau: < 15%
  - Kuning: 15-40%
  - Merah: > 40%
- [ ] Scenario tabs berfungsi (P10/P50/P90)
- [ ] Chart proyeksi dana tampil dengan 3 garis
- [ ] Donut chart alokasi portofolio tampil
- [ ] 3 kartu sensitivity analysis tampil
- [ ] Daftar insights tampil dengan numbering

#### Error State (Data Belum Lengkap)
- [ ] Icon error tampil
- [ ] Pesan error jelas
- [ ] Button "Lengkapi Data Onboarding" muncul
- [ ] Button redirect ke `/auth/onboarding`

#### Error State (Network Error)
- [ ] Icon error tampil
- [ ] Pesan error network tampil
- [ ] Tidak crash

---

### 4. Responsive Design

**Desktop (> 1024px):**
- [ ] Layout 2-3 kolom
- [ ] Sidebar tidak collapse
- [ ] Chart readable
- [ ] Spacing proporsional

**Tablet (768px - 1024px):**
- [ ] Layout 2 kolom
- [ ] Sidebar collapse dengan hamburger menu
- [ ] Chart masih readable

**Mobile (< 768px):**
- [ ] Layout stacked vertical
- [ ] Sidebar drawer dari kiri
- [ ] Chart responsive (scroll horizontal jika perlu)
- [ ] Touch-friendly button size

---

### 5. Animations & Interactions

**Framer Motion:**
- [ ] Hero banner fade in dari atas
- [ ] Kartu metrik stagger animation
- [ ] Ruin gauge fill animation (1.5 detik)
- [ ] Number counter animation di gauge
- [ ] Tab switch smooth transition

**Hover Effects:**
- [ ] Kartu metrik lift + shadow on hover
- [ ] Button hover state jelas
- [ ] Chart tooltip muncul on hover

---

### 6. Data Accuracy

**Bandingkan dengan Streamlit Output:**
- [ ] Dana saat pensiun (P50) sama
- [ ] Ruin probability sama
- [ ] Kapasitas tarik/tahun sama
- [ ] Alokasi portofolio sama
- [ ] Sensitivity analysis sama
- [ ] Actionable insights sama

**Cara test:**
1. Jalankan Streamlit app dengan user profile yang sama
2. Catat semua angka output
3. Jalankan dashboard Next.js dengan user yang sama
4. Bandingkan angka-angka

---

## 🔒 Security Testing

### 7. Authentication & Authorization

**Checklist:**
- [ ] Endpoint `/api/projection` memerlukan auth token
- [ ] Token invalid → 401 Unauthorized
- [ ] Token expired → 401 Unauthorized
- [ ] User hanya bisa akses data sendiri (tidak bisa akses data user lain)

**Test:**
```bash
# No token
curl http://localhost:8000/api/projection
# Expected: 401

# Invalid token
curl -H "Authorization: Bearer invalid_token" http://localhost:8000/api/projection
# Expected: 401
```

---

## 🚀 Performance Testing

### 8. Load Time

**Checklist:**
- [ ] Initial page load < 2 detik (tanpa kalkulasi)
- [ ] Kalkulasi Python < 30 detik
- [ ] Total time to interactive < 35 detik
- [ ] Chart render smooth (60fps)

**Tools:**
- Chrome DevTools → Performance tab
- Lighthouse audit

---

### 9. Caching

**React Query Caching:**
- [ ] Data di-cache selama 5 menit (staleTime)
- [ ] Refresh page tidak fetch ulang jika < 5 menit
- [ ] Setelah 5 menit, fetch ulang otomatis

**Test:**
1. Load page pertama kali → fetch data
2. Refresh page dalam 5 menit → tidak fetch (ambil dari cache)
3. Tunggu > 5 menit → fetch ulang

---

## 🐛 Edge Cases

### 10. Unusual Data

**Checklist:**
- [ ] User dengan usia sangat muda (20 tahun)
- [ ] User dengan usia mendekati pensiun (54 tahun)
- [ ] User dengan gaji sangat tinggi (> 100 juta/bulan)
- [ ] User dengan gaji sangat rendah (< 5 juta/bulan)
- [ ] User dengan savings rate 0%
- [ ] User dengan savings rate 50%
- [ ] User dengan retirement age = current age (edge case)

**Expected:**
- Tidak crash
- Pesan error jelas jika input invalid
- Angka output masuk akal

---

### 11. Network Issues

**Checklist:**
- [ ] Backend down → error message jelas
- [ ] Slow network (3G) → loading state tampil
- [ ] Timeout (> 30 detik) → error message
- [ ] Retry mechanism berfungsi (max 2 retry)

**Test:**
- Chrome DevTools → Network tab → Throttling → Slow 3G

---

## ✅ Final Checklist

**Before Production:**
- [ ] All backend tests passed
- [ ] All frontend tests passed
- [ ] Responsive design verified
- [ ] Data accuracy verified
- [ ] Security tests passed
- [ ] Performance acceptable
- [ ] Edge cases handled
- [ ] Error messages user-friendly
- [ ] Loading states smooth
- [ ] Animations not janky
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build success
- [ ] Documentation complete

---

## 📝 Bug Report Template

Jika menemukan bug, gunakan template ini:

```markdown
### Bug: [Judul singkat]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected Behavior:**
...

**Actual Behavior:**
...

**Screenshots:**
[Attach if applicable]

**Environment:**
- Browser: Chrome 120 / Firefox 121 / Safari 17
- OS: Windows 11 / macOS 14 / Ubuntu 22.04
- Screen size: 1920x1080 / 1366x768 / 375x667

**Console Errors:**
```
[Paste console errors here]
```

**Additional Context:**
...
```

---

**Last Updated:** 2026-05-22
