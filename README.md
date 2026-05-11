Panduan Setup & Workflow Git CuanSelor

Dokumen ini berisi panduan ringkas untuk struktur folder, cara menjalankan aplikasi, dan alur kerja Git harian untuk tim. Karena semua sudah diundang sebagai kolaborator, kalian bisa langsung melakukan clone dari repository utama.

1. Struktur Folder Utama
Repository CuanSelor dibagi menjadi 4 bagian utama:
- frontend/ : Berisi antarmuka web (Next.js, React, Tailwind).
- backend/ : Berisi server REST API (Express.js) yang terhubung ke database Supabase.
- ai-service/ : Layanan khusus untuk fitur AI Advisor (LLM).
- financial_advisor_dist/ : Aplikasi untuk analisis portofolio menggunakan Python dan Streamlit.

2. Setup Awal (Hanya Sekali)
Karena kalian sudah jadi kolaborator, langkah awalnya sangat mudah. Ikuti urutan instalasi berikut agar aplikasi bisa dijalankan dari root:

Pertama, clone repository ke laptop masing-masing dengan perintah: 
git clone [LINK_REPOSITORY_CUANSELOR]

Kedua, masuk ke folder proyek: 
cd CuanSelor

Ketiga, install dependensi root (untuk tools runner): 
npm install

Keempat, install dependensi frontend: 
cd frontend
npm install
cd ..

Kelima, install dependensi backend: 
cd backend
npm install
cd ..

Catatan: Jangan lupa buat dan atur file .env di dalam folder backend/ sesuai kredensial Supabase proyek kita.

3. Cara Menjalankan Aplikasi (Daily Dev)
Setelah setup awal di atas selesai, untuk ke depannya menjalankan Frontend dan Backend secara bersamaan sangat mudah. Tidak perlu membuka dua terminal, cukup jalankan perintah ini dari folder root (CuanSelor):
npm run dev

Perintah ini akan langsung menyalakan server backend dan menjalankan web frontend-nya secara paralel.

4. Alur Kerja Git (Wajib Dibaca)
Agar kode kita tidak bentrok (conflict), selalu ikuti alur ini setiap kali mau mulai mengoding atau menyimpan perubahan:

A. Sebelum Mulai Ngoding (Penting!)
Selalu tarik kode paling baru dari repository sebelum menulis kode apa pun:
git checkout main
git pull origin main

B. Saat Mau Bikin Fitur Baru
Bikin branch baru agar pekerjaan masing-masing tidak saling ganggu:
git checkout -b nama-fitur
(Contoh: git checkout -b feat-dashboard-pengunjung atau git checkout -b fix-login-seller)

C. Menyimpan Pekerjaan
Kalau kodenya sudah selesai atau mau disimpan:
1. Cek file apa saja yang berubah: git status
2. Masukkan perubahan ke staging: git add .
3. Beri pesan commit yang jelas: git commit -m "feat: [penjelasan singkat fitur/perbaikan]"
4. Kirim kode ke GitHub: git push origin nama-fitur