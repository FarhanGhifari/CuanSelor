import type { BlogArticle } from "../types/blog.types";

export const ARTICLES: BlogArticle[] = [
    {
        slug: "berapa-dana-pensiun-yang-kamu-butuhkan",
        title: "Berapa Dana Pensiun yang Kamu Butuhkan? Panduan Lengkap Berbasis Aktuaria",
        excerpt: "Kalkulator konvensional pakai asumsi meninggal usia 80. Tapi bagaimana kalau kamu hidup sampai 90? Pelajari cara menghitung yang benar berdasarkan ilmu aktuaria.",
        category: "Dana Pensiun",
        readTime: 8,
        publishedAt: "2026-01-12",
        author: "Tim CuanSelor",
        content: [
            {
                type: "paragraph",
                text: "Kalkulator pensiun konvensional punya satu asumsi fatal — mereka mematok usia meninggal pada angka arbitrer, biasanya 80 tahun. Jika kamu ternyata hidup sampai 90, dana pensiunmu bisa habis 10 tahun lebih cepat dari rencana.",
            },
            {
                type: "callout",
                text: "Longevity risk — risiko hidup lebih lama dari ketersediaan dana — adalah ancaman finansial terbesar yang paling sering diabaikan oleh perencanaan keuangan konvensional.",
            },
            {
                type: "heading",
                text: "Apa itu pendekatan aktuaria?",
            },
            {
                type: "paragraph",
                text: "Ilmu aktuaria menggunakan data statistik populasi untuk menghitung probabilitas seseorang masih hidup di usia tertentu. CuanSelor menggunakan Tabel Mortalitas dan Morbiditas Penduduk Indonesia 2023 sebagai baseline — bukan asumsi sembarangan. Hasilnya jauh lebih akurat dan personal.",
            },
            {
                type: "heading",
                text: "Rumus dasar kebutuhan dana pensiun",
            },
            {
                type: "paragraph",
                text: "Kebutuhan dana pensiun = pengeluaran bulanan saat pensiun × 12 × estimasi lama pensiun, disesuaikan dengan tingkat inflasi dan return investasi. Angka ini kemudian di-adjust dengan Hazard Multiplier berdasarkan gaya hidupmu — apakah kamu merokok, berolahraga rutin, pola makan sehat, dan sebagainya.",
            },
            {
                type: "heading",
                text: "Tiga skenario yang perlu kamu siapkan",
            },
            {
                type: "list",
                items: [
                    "Skenario optimis: inflasi rendah, return investasi tinggi, pensiun tepat waktu",
                    "Skenario moderat: asumsi rata-rata berdasarkan data historis Indonesia",
                    "Skenario pesimis: inflasi tinggi, return rendah, atau harus pensiun lebih awal",
                ],
            },
            {
                type: "paragraph",
                text: "CuanSelor menghitung ketiga skenario ini secara otomatis dan menampilkannya dalam satu dashboard yang mudah dipahami. Kamu tidak perlu jadi ahli matematika untuk merencanakan pensiunmu.",
            },
        ],
    },
    {
        slug: "reksa-dana-vs-saham-untuk-pemula",
        title: "Reksa Dana vs Saham: Mana yang Cocok untuk Pemula?",
        excerpt: "Perbandingan risiko, return, dan likuiditas — lengkap dengan rekomendasi untuk tiap profil risiko investasi.",
        category: "Investasi",
        readTime: 5,
        publishedAt: "2026-01-08",
        author: "Tim CuanSelor",
        content: [
            {
                type: "paragraph",
                text: "Banyak pemula bingung harus mulai dari mana saat ingin berinvestasi. Dua pilihan yang paling sering muncul adalah reksa dana dan saham. Keduanya punya kelebihan dan kekurangan masing-masing yang perlu kamu pahami sebelum memutuskan.",
            },
            {
                type: "callout",
                text: "Tidak ada pilihan yang universally 'lebih baik'. Pilihan terbaik adalah yang sesuai dengan profil risiko, horizon waktu, dan pengetahuanmu saat ini.",
            },
            {
                type: "heading",
                text: "Reksa dana: delegasikan ke manajer investasi",
            },
            {
                type: "paragraph",
                text: "Reksa dana adalah produk investasi di mana uangmu dikelola oleh manajer investasi profesional. Kamu membeli unit penyertaan, dan manajer investasi yang menentukan aset apa yang dibeli. Ini cocok untuk pemula karena tidak perlu analisis mendalam.",
            },
            {
                type: "heading",
                text: "Saham: kamu yang jadi bos",
            },
            {
                type: "paragraph",
                text: "Dengan saham, kamu membeli kepemilikan langsung di sebuah perusahaan. Potensi return lebih tinggi, tapi kamu perlu memahami laporan keuangan, kondisi industri, dan timing yang tepat. Volatilitasnya jauh lebih tinggi dari reksa dana.",
            },
            {
                type: "heading",
                text: "Rekomendasi berdasarkan profil risiko",
            },
            {
                type: "list",
                items: [
                    "Konservatif: Reksa dana pasar uang atau pendapatan tetap",
                    "Moderat: Reksa dana campuran atau ETF",
                    "Agresif: Reksa dana saham + saham individual (setelah belajar lebih dalam)",
                ],
            },
        ],
    },
    {
        slug: "metode-50-30-20-atur-gaji",
        title: "Metode 50/30/20: Cara Atur Gaji Pertama agar Tidak Habis Sebelum Tanggal",
        excerpt: "Bukan soal berhemat ekstrem — tapi soal sistem yang bikin uangmu bekerja lebih keras untuk masa depanmu.",
        category: "Budgeting",
        readTime: 4,
        publishedAt: "2026-01-05",
        author: "Tim CuanSelor",
        content: [
            {
                type: "paragraph",
                text: "Gaji pertama terasa seperti kebebasan — sampai tiba-tiba tanggal 20 dan saldo tinggal receh. Bukan karena gajimu kecil, tapi karena tidak ada sistem yang mengatur ke mana uangmu pergi.",
            },
            {
                type: "heading",
                text: "Apa itu metode 50/30/20?",
            },
            {
                type: "paragraph",
                text: "Metode 50/30/20 adalah framework budgeting sederhana yang membagi pendapatanmu menjadi tiga kategori besar: 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan dan investasi.",
            },
            {
                type: "callout",
                text: "20% untuk tabungan dan investasi bukan pilihan — ini adalah 'gaji' yang kamu bayarkan untuk dirimu di masa depan. Bayar dirimu sendiri terlebih dahulu.",
            },
            {
                type: "heading",
                text: "Breakdown kategori",
            },
            {
                type: "list",
                items: [
                    "50% kebutuhan: sewa kos, makan, transport, tagihan — hal-hal yang tidak bisa ditunda",
                    "30% keinginan: makan di restoran, hiburan, belanja non-esensial — boleh, tapi dalam batas",
                    "20% masa depan: dana darurat dulu (3-6 bulan pengeluaran), baru investasi untuk pensiun",
                ],
            },
            {
                type: "heading",
                text: "Adaptasi untuk kondisi Indonesia",
            },
            {
                type: "paragraph",
                text: "Jika biaya hidup di kotamu sangat tinggi (Jakarta, misalnya), 50% mungkin tidak cukup untuk kebutuhan. Tidak apa-apa untuk menyesuaikan menjadi 60/20/20. Yang penting, jangan kurangi porsi tabungan dan investasi.",
            },
        ],
    },
    {
        slug: "longevity-risk-risiko-yang-diabaikan",
        title: "Longevity Risk: Risiko yang Tidak Pernah Diajarkan di Sekolah",
        excerpt: "55% orang Indonesia tidak punya rencana keuangan jangka panjang. Ini penjelasan mengapa itu sangat berbahaya.",
        category: "Literasi Finansial",
        readTime: 6,
        publishedAt: "2026-01-01",
        author: "Tim CuanSelor",
        content: [
            {
                type: "paragraph",
                text: "Di sekolah, kita diajarkan cara menghitung bunga, cara membaca neraca keuangan, bahkan cara menghitung luas trapesium. Tapi tidak ada yang mengajarkan tentang longevity risk — risiko yang bisa menghancurkan rencana pensiun jutaan orang.",
            },
            {
                type: "heading",
                text: "Apa itu longevity risk?",
            },
            {
                type: "paragraph",
                text: "Longevity risk adalah risiko seseorang hidup lebih lama dari ketersediaan dana yang dimilikinya. Dengan meningkatnya kualitas kesehatan, harapan hidup rata-rata Indonesia terus meningkat. Ini kabar baik — kecuali kamu tidak punya cukup dana untuk membiayai masa tua yang lebih panjang.",
            },
            {
                type: "callout",
                text: "Data 2025: hanya 6% pekerja Indonesia yang dilindungi dana pensiun formal. Diprediksi pada 2038, 100 juta penduduk Indonesia berisiko jatuh ke dalam kemiskinan di hari tua.",
            },
            {
                type: "heading",
                text: "Mengapa ini relevan untuk Gen Z?",
            },
            {
                type: "paragraph",
                text: "Generasi Z saat ini berusia 18–27 tahun. Pensiun terasa jauh — tapi justru itulah masalahnya. Waktu adalah aset paling berharga dalam investasi karena compound interest membutuhkan waktu untuk bekerja. Setiap tahun yang terlewat tanpa investasi adalah biaya opportunity yang sangat besar.",
            },
            {
                type: "heading",
                text: "Tiga langkah mitigasi longevity risk",
            },
            {
                type: "list",
                items: [
                    "Mulai investasi sesegera mungkin — bahkan Rp 100.000 per bulan lebih baik dari tidak sama sekali",
                    "Hitung proyeksi pensiun dengan asumsi harapan hidup yang realistis, bukan 80 tahun flat",
                    "Diversifikasi portofolio untuk memastikan ada sumber pendapatan pasif saat pensiun",
                ],
            },
        ],
    },
    {
        slug: "apa-itu-tabel-mortalitas",
        title: "Apa itu Tabel Mortalitas dan Kenapa Penting untuk Rencanamu?",
        excerpt: "Ilmu yang dipakai perusahaan asuransi kini bisa kamu pakai sendiri untuk merencanakan pensiun dengan lebih akurat.",
        category: "Aktuaria",
        readTime: 7,
        publishedAt: "2025-12-28",
        author: "Tim CuanSelor",
        content: [
            {
                type: "paragraph",
                text: "Perusahaan asuransi jiwa sudah lama menggunakan tabel mortalitas untuk menghitung premi dan manfaat polis. Tapi kini, data yang sama bisa kamu gunakan untuk membuat rencana pensiun yang jauh lebih akurat.",
            },
            {
                type: "heading",
                text: "Definisi tabel mortalitas",
            },
            {
                type: "paragraph",
                text: "Tabel mortalitas adalah kumpulan data statistik yang menunjukkan probabilitas kematian dan kelangsungan hidup untuk setiap kelompok usia dalam suatu populasi. CuanSelor menggunakan Tabel Mortalitas dan Morbiditas Penduduk Indonesia 2023 — versi terbaru yang merepresentasikan populasi Indonesia tanpa bias seleksi dari asuransi komersial.",
            },
            {
                type: "callout",
                text: "Bias seleksi asuransi: tabel mortalitas yang dipakai perusahaan asuransi cenderung hanya mencakup orang yang 'cukup sehat untuk diasuransikan', sehingga tidak mewakili seluruh populasi. Tabel kependudukan lebih akurat untuk perencanaan pribadi.",
            },
            {
                type: "heading",
                text: "Bagaimana CuanSelor menggunakannya?",
            },
            {
                type: "list",
                items: [
                    "Menghitung harapan hidup personal berdasarkan usia dan jenis kelamin",
                    "Menyesuaikan proyeksi dengan Hazard Multiplier berdasarkan gaya hidup",
                    "Menghasilkan rentang probabilistik (bukan satu angka pasti) untuk durasi pensiun",
                ],
            },
        ],
    },
    {
        slug: "gen-z-dan-dana-pensiun-mulai-kapan",
        title: "Gen Z dan Dana Pensiun: Mulai Usia Berapa dan Berapa Banyak?",
        excerpt: "Semakin muda mulai, semakin ringan bebannya. Simulasi nyata dengan angka yang masuk akal untuk gaji entry-level.",
        category: "Dana Pensiun",
        readTime: 5,
        publishedAt: "2025-12-24",
        author: "Tim CuanSelor",
        content: [
            {
                type: "paragraph",
                text: "Pertanyaan paling umum dari Gen Z soal pensiun adalah: 'Kan masih lama, kenapa harus mulai sekarang?' Jawabannya satu kata: compound interest.",
            },
            {
                type: "heading",
                text: "Kekuatan compound interest",
            },
            {
                type: "paragraph",
                text: "Jika kamu mulai investasi Rp 500.000 per bulan di usia 22 dengan return rata-rata 10% per tahun, di usia 55 kamu akan punya sekitar Rp 1,8 miliar. Tapi jika kamu mulai di usia 32 dengan jumlah yang sama, totalnya hanya sekitar Rp 680 juta. Selisih 10 tahun = selisih lebih dari Rp 1 miliar.",
            },
            {
                type: "callout",
                text: "Waktu adalah variabel paling kuat dalam persamaan investasi — jauh lebih kuat dari besaran setoran bulanan.",
            },
            {
                type: "heading",
                text: "Berapa yang harus ditabung?",
            },
            {
                type: "list",
                items: [
                    "Minimal 10–15% dari pendapatan bersih untuk investasi jangka panjang",
                    "Sisihkan dulu sebelum bayar kebutuhan lain (pay yourself first)",
                    "Naikkan persentase setiap kali gaji naik — minimal tambah 1% per tahun",
                ],
            },
            {
                type: "paragraph",
                text: "Gunakan fitur simulasi CuanSelor untuk melihat proyeksi pensiunmu secara real-time. Coba ubah usia mulai investasi dan lihat dampaknya — hasilnya akan mengejutkan kamu.",
            },
        ],
    },
];

export const getFeaturedArticle = (): BlogArticle =>
    ARTICLES[0];

export const getArticleBySlug = (slug: string): BlogArticle | undefined =>
    ARTICLES.find((a) => a.slug === slug);

export const getRelatedArticles = (slug: string, limit = 3): BlogArticle[] =>
    ARTICLES.filter((a) => a.slug !== slug).slice(0, limit);

export const getArticlesByCategory = (category: string): BlogArticle[] =>
    category === "Semua"
        ? ARTICLES
        : ARTICLES.filter((a) => a.category === category);