# 📖 Kuis Alkitab Millionaire

Kuis Alkitab Millionaire adalah sebuah aplikasi game trivia berbasis web yang mengadaptasi format acara televisi populer *"Who Wants to Be a Millionaire?"*. Game ini dirancang khusus dengan konten edukasi Alkitab yang mendalam, sistem penghargaan bertingkat (*milestone*), serta antarmuka yang modern dan sepenuhnya responsif.

---

## ✨ Fitur Utama

* **200 Bank Soal Terintegrasi (`questions.json`)**:
    * **50 Soal Mudah**: Level 1–5 (Target hadiah s.d Rp 1.000.000).
    * **50 Soal Sedang**: Level 6–10 (Target hadiah s.d Rp 32.000.000).
    * **100 Soal Sulit**: Level 11–15 (Target hadiah s.d Rp 1 MILYAR).
* **Sistem Titik Aman (*Milestone*)**: Mengunci jumlah hadiah secara otomatis saat berhasil melewati Level 5 (Rp 1 Juta), Level 10 (Rp 32 Juta), dan Level 15 (Rp 1 Milyar).
* **Efek Perayaan Kembang Api (HTML5 Canvas)**: Efek visual interaktif yang meriah saat pemain berhasil mencapai titik-titik aman atau memenangkan game.
* **Ayat Penyemangat Otomatis (`ayat.js`)**: Menampilkan ayat-ayat Alkitab inspiratif di atas kotak pertanyaan yang diperbarui secara otomatis setiap **15 menit** sekali menggunakan transisi efek memudar (*fade-in/fade-out*).
* **Bantuan 50:50 yang Konsisten**: Menghilangkan 2 opsi jawaban yang salah secara visual tanpa merusak *layout* tombol ataupun menghapus label abjad (A, B, C, D).
* **Desain Kompatibel & Responsif**: 
    * **Desktop/Laptop**: Dilengkapi dengan panel tangga hadiah (*money tree*) interaktif di sisi kanan.
    * **Tablet & Ponsel**: Panel kanan otomatis disembunyikan untuk efisiensi layar, digantikan dengan indikator nominal hadiah *real-time* yang elegan di panel atas (*header*).

---

## 📂 Struktur Berkas Proyek

```text
├── index.html          # Struktur HTML5 utama dan komponen modal konfirmasi
├── style.css           # Desain visual, animasi kedip, dan Media Queries (Responsif)
├── ayat.js             # Data independen kumpulan ayat penyemangat Alkitab
├── app.js              # Logika game, engine kembang api, and kontrol state permainan
└── questions.json      # Dokumen database berisi total 200 soal kuis