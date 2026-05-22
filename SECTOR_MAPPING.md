# Sector Mapping — Frontend ↔ Python Calculator

## 📊 Mapping Table

Karena frontend menggunakan kategori sektor yang **user-friendly** sedangkan Python calculator menggunakan **kategori BPS (Badan Pusat Statistik)** yang lebih detail, maka diperlukan mapping di backend.

| Frontend Sector | BPS Sector (Python) | Alasan |
|----------------|---------------------|---------|
| **Pemerintahan / PNS** | Administrasi Pemerintahan dan Pertahanan, serta Jaminan Sosial Wajib | Direct match dengan kategori BPS |
| **BUMN / BUMD** | Rata-rata | BUMN bisa di berbagai sektor (perbankan, telkom, energi, dll), pakai rata-rata |
| **Swasta — Keuangan** | Aktivitas Keuangan dan Asuransi | Direct match dengan kategori BPS |
| **Swasta — Teknologi** | Aktivitas Penerbitan dan Telekomunikasi | Teknologi termasuk telekomunikasi & IT |
| **Swasta — Manufaktur** | Industri | Manufaktur = Industri pengolahan |
| **Swasta — Kesehatan** | Aktivitas Kesehatan Manusia dan Aktivitas Sosial | Direct match dengan kategori BPS |
| **Swasta — Pendidikan** | Pendidikan | Direct match dengan kategori BPS |
| **Wiraswasta / Freelance** | Rata-rata | Freelance bisa di berbagai sektor, pakai rata-rata |
| **Profesional (Dokter/Pengacara)** | Aktivitas Profesional, Ilmiah, dan Teknis dan Aktivitas Administratif dan Penunjang Usaha | Profesi liberal masuk kategori ini |
| **Lainnya** | Rata-rata | Fallback untuk sektor yang tidak terdefinisi |

---

## 🔧 Implementation

Mapping dilakukan di **backend** (`routes/projection.js`) sebelum mengirim data ke Python calculator:

```javascript
function mapSectorToBPS(frontendSector) {
  const sectorMapping = {
    "Pemerintahan / PNS": "Administrasi Pemerintahan dan Pertahanan, serta Jaminan Sosial Wajib",
    "BUMN / BUMD": "Rata-rata",
    "Swasta — Keuangan": "Aktivitas Keuangan dan Asuransi",
    "Swasta — Teknologi": "Aktivitas Penerbitan dan Telekomunikasi",
    "Swasta — Manufaktur": "Industri",
    "Swasta — Kesehatan": "Aktivitas Kesehatan Manusia dan Aktivitas Sosial",
    "Swasta — Pendidikan": "Pendidikan",
    "Wiraswasta / Freelance": "Rata-rata",
    "Profesional (Dokter/Pengacara)": "Aktivitas Profesional, Ilmiah, dan Teknis dan Aktivitas Administratif dan Penunjang Usaha",
    "Lainnya": "Rata-rata",
  };

  return sectorMapping[frontendSector] || "Rata-rata";
}
```

---

## 📋 Complete BPS Sector List

Untuk referensi, berikut adalah **semua sektor BPS** yang tersedia di Python calculator:

1. Pertanian, Kehutanan, dan Perikanan
2. Pertambangan dan Penggalian
3. Industri
4. Penyediaan Listrik, Gas, Uap/Air Panas, dan Udara Dingin
5. Penyediaan Air, Pengelolaan Air Limbah, Penanganan Limbah, dan Remediasi
6. Konstruksi
7. Perdagangan Besar dan Eceran
8. Transportasi dan Penyimpanan
9. Penyediaan Akomodasi dan Penyediaan Makan Minum
10. Aktivitas Penerbitan dan Telekomunikasi
11. Aktivitas Keuangan dan Asuransi
12. Aktivitas Real Estat
13. Aktivitas Profesional, Ilmiah, dan Teknis dan Aktivitas Administratif dan Penunjang Usaha
14. Administrasi Pemerintahan dan Pertahanan, serta Jaminan Sosial Wajib
15. Pendidikan
16. Aktivitas Kesehatan Manusia dan Aktivitas Sosial
17. Kesenian, Aktivitas Jasa Lainnya, Aktivitas Rumah Tangga, dan Aktivitas Badan Internasional
18. **Rata-rata** (fallback/default)

---

## 🎯 Impact on Calculation

Sektor mempengaruhi:

1. **Salary Growth Rate** - Setiap sektor punya growth rate berbeda berdasarkan data BPS
2. **Pandemic Risk** - Jika `include_pandemic_risk = true`, growth rate akan disesuaikan dengan dampak COVID per sektor

### Example:
```javascript
// User pilih: "Swasta — Teknologi"
// Backend map ke: "Aktivitas Penerbitan dan Telekomunikasi"
// Python calculator pakai growth rate sektor telekomunikasi dari data BPS
```

---

## 🔄 Future Improvements

Jika ingin lebih akurat, bisa:

1. **Tambah sektor di frontend** untuk match semua 18 sektor BPS
2. **Multi-select sector** untuk user yang kerja di multiple industries
3. **Custom growth rate** untuk user yang tahu persis growth rate industri mereka

---

## 📝 Notes

- Mapping ini **transparent** untuk user - mereka tidak perlu tahu tentang kategori BPS
- Jika sektor tidak ditemukan di mapping, akan fallback ke **"Rata-rata"**
- Data growth rate per sektor berasal dari **BPS (Badan Pusat Statistik Indonesia)**

---

**Last Updated:** 2026-05-22
