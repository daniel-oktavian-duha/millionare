# 🎮 Kuis Alkitab Millionaire

Aplikasi kuis interaktif berbasis web yang mengadaptasi gaya permainan populer *Who Wants to Be a Millionaire*, dikemas khusus dengan konten pertanyaan rohani Alkitab. Aplikasi ini dirancang sepenuhnya menggunakan **Vanilla JavaScript (Front-End murni)** dengan performa yang dioptimalkan untuk performa audio instan dan manajemen database dinamis.

---

## ✨ Fitur Unggulan

* **Bypass Kebijakan Autoplay Browser:** Menyediakan *Start Screen* (Layar Pembuka) interaktif untuk memastikan semua efek suara berputar lancar sejak detik pertama tanpa diblokir oleh browser.
* **Manajemen Database Dinamis (`index.json`):** Struktur data kuis menggunakan konsep pecahan JSON terpisah per tingkat kesulitan (`mudah`, `sedang`, `sulit`). Penambahan bank soal baru dapat dilakukan langsung via konfigurasi indeks tanpa perlu mengubah kode sumber JavaScript.
* **Preloaded Audio Engine:** Semua aset musik latar belakang (*suspense music*) dan efek suara (*SFX*) dimuat langsung ke memori RAM saat aplikasi pertama kali dibuka. Menghilangkan jeda (*delay*) perpindahan suara saat tombol diklik.
* **Smart Transition Loading Screen:** Layar loading dinamis yang sinkron dengan pemutaran lagu pembuka kuis, memberikan transisi yang mulus sebelum soal kuis ditampilkan.
* **Fitur Kuis Autentik:** * Tangga hadiah interaktif dari Rp 50.000 hingga Rp 1 Milyar.
  * Titik aman otomatis di level 5 (Rp 1 Juta) dan level 10 (Rp 32 Juta).
  * Efek visual partikel kembang api (*Canvas Particle Engine*) di layar depan saat berhasil melewati titik aman atau memenangkan kuis.
  * Fitur bantuan tunggal `50:50` yang berfungsi memotong dua pilihan salah secara acak.
  * Kotak ayat penyemangat Alkitab yang berganti otomatis setiap 15 menit.

---

## 📂 Struktur Direktori Proyek

```text
├── database/
│   ├── index.json            # File indeks utama peta database kuis
│   ├── mudah_part1.json      # Pecahan database level mudah bagian 1
│   ├── mudah_part2.json      # Pecahan database level mudah bagian 2
│   ├── sedang_part1.json     # Pecahan database level sedang bagian 1
│   ├── sedang_part2.json     # Pecahan database level sedang bagian 2
│   ├── sulit_part1.json      # Pecahan database level sulit bagian 1
│   └── sulit_part2.json      # Pecahan database level sulit bagian 2
├── sound/
│   ├── begin.mp3             # Lagu intro pembuka game (durasi 4 detik)
│   ├── 100-1000.mp3          # Musik latar kuis level 1 s.d 5
│   ├── 2000-32000.mp3        # Musik latar kuis level 6 s.d 10
│   ├── 64000.mp3             # Musik latar kuis level 11 s.d 15
│   ├── final.mp3             # Musik ketegangan saat memicu modal konfirmasi
│   ├── correct.mp3           # Efek suara saat jawaban benar
│   └── wrong.mp3             # Efek suara saat jawaban salah / game over
├── index.html                # Struktur layout UI & Layar Pembuka
├── style.css                 # Desain tema gelap futuristik & animasi kedip
├── ayat.js                   # Koleksi array data ayat Alkitab berkala
└── app.js                    # Core Engine, Sistem Audio, & Logika Permainan
