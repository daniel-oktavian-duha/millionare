// ==========================================
// KONFIGURASI GLOBAL GAME & DATA
// ==========================================
const daftarHadiah = [
    "Rp 50.000", "Rp 100.000", "Rp 300.000", "Rp 500.000", "Rp 1.000.000", 
    "Rp 2.000.000", "Rp 4.000.000", "Rp 8.000.000", "Rp 16.000.000", "Rp 32.000.000", 
    "Rp 64.000.000", "Rp 125.000.000", "Rp 250.000.000", "Rp 500.000.000", "Rp 1 MILYAR" 
];

const labelAbjad = ["A:", "B:", "C:", "D:"];

let bankSoal = { mudah: [], sedang: [], sulit: [] }; 
let nomorPertanyaanSekarang = 1; 
let soalAktif = null;
let bantan5050Digunakan = false;
let tombolTerpilihSementara = null;
let intervalAyat = null;

// Menyimpan indeks antrean soal aktif per kategori agar tidak duplikat
let indeksSoalKategori = { mudah: 0, sedang: 0, sulit: 0 };

// Fungsi Bantuan untuk mengacak Array (Algoritma Fisher-Yates)
function acakArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ==========================================
// KONTROL AUDIO UTAMA
// ==========================================
let musikLatarAktif = null;

function putarSuara(namaFile, loop = false, volume = 1.0) {
    let audio = new Audio(`sound/${namaFile}`);
    audio.loop = loop;
    audio.volume = volume;
    audio.play().catch(e => console.log("Audio play dicegah oleh browser."));
    return audio;
}

function gantiMusikLatar(namaFile, loop = true, volume = 0.6) {
    if (musikLatarAktif) {
        let audioLama = musikLatarAktif;
        let sisaVolume = audioLama.volume;
        let fadeInterval = setInterval(() => {
            if (sisaVolume > 0.1) {
                sisaVolume -= 0.1;
                audioLama.volume = sisaVolume;
            } else {
                clearInterval(fadeInterval);
                audioLama.pause();
            }
        }, 50);
    }
    musikLatarAktif = putarSuara(namaFile, loop, volume);
}

function sesuaikanMusikLatarKategori(nomor) {
    if (nomor <= 5) {
        gantiMusikLatar("100-1000.mp3", true, 0.6);
    } else if (nomor <= 10) {
        gantiMusikLatar("2000-32000.mp3", true, 0.6);
    } else {
        gantiMusikLatar("64000.mp3", true, 0.6);
    }
}

// ==========================================
// SISTEM AYAT BERGANTI (SETIAP 15 MENIT)
// ==========================================
function gantiAyatAcak() {
    const areaAyat = document.getElementById("area-ayat");
    if (!areaAyat || typeof daftarAyat === 'undefined' || daftarAyat.length === 0) return;

    areaAyat.style.opacity = "0"; 

    setTimeout(() => {
        const acak = daftarAyat[Math.floor(Math.random() * daftarAyat.length)];
        areaAyat.innerHTML = `"${acak.teks}" <span class="ayat-referensi">— ${acak.ref}</span>`;
        areaAyat.style.opacity = "1";
    }, 500);
}

function mulaiSistemAyat() {
    gantiAyatAcak();
    if (intervalAyat) clearInterval(intervalAyat);
    intervalAyat = setInterval(gantiAyatAcak, 900000);
}

// ==========================================
// ENGINE KEMBANG API (CANVAS PARTICLE)
// ==========================================
const canvas = document.getElementById("canvas-kembang-api");
const ctx = canvas.getContext("2d");
let partikelKembangApi = [];
let animasiKembangApiAktif = false;

function aturUkuranCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", aturUkuranCanvas);
aturUkuranCanvas();

class Partikel {
    constructor(x, y, warna) {
        this.x = x; this.y = y; this.warna = warna;
        this.radius = Math.random() * 3 + 1;
        const sudut = Math.random() * Math.PI * 2;
        const kecepatan = Math.random() * 6 + 2;
        this.vx = Math.cos(sudut) * kecepatan;
        this.vy = Math.sin(sudut) * kecepatan;
        this.alpha = 1; this.gravitasi = 0.06;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += this.gravitasi; this.alpha -= 0.015; }
    draw() {
        ctx.save(); ctx.globalAlpha = this.alpha; ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.warna; ctx.fill(); ctx.restore();
    }
}

function buatLedakan(x, y) {
    const daftarWarna = ["#ff0055", "#00ffcc", "#ffcc00", "#ff6600", "#cc00ff", "#00ff00"];
    const warnaTerpilih = daftarWarna[Math.floor(Math.random() * daftarWarna.length)];
    for (let i = 0; i < 60; i++) partikelKembangApi.push(new Partikel(x, y, warnaTerpilih));
}

function jalankanLoopKembangApi() {
    if (!animasiKembangApiAktif) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.05) buatLedakan(Math.random() * canvas.width, Math.random() * (canvas.height * 0.5));
    for (let i = partikelKembangApi.length - 1; i >= 0; i--) {
        let p = partikelKembangApi[i]; p.update();
        if (p.alpha <= 0) partikelKembangApi.splice(i, 1); else p.draw();
    }
    requestAnimationFrame(jalankanLoopKembangApi);
}

function nyalakanKembangApi(durasiMiliDetik) {
    animasiKembangApiAktif = true; partikelKembangApi = []; jalankanLoopKembangApi();
    setTimeout(() => { animasiKembangApiAktif = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }, durasiMiliDetik);
}

// ==========================================
// NOTIFIKASI POP-UP AUTO-CLOSE
// ==========================================
function tampilkanNotifikasiAutoclose(pesan, jenis = "netral", durasi = 3000) {
    const container = document.getElementById("container-notifikasi");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${jenis}`;
    toast.innerText = pesan;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => { toast.remove(); }, 500); }, durasi - 500);
}

// ==========================================
// ENGINE SINKRONISASI DATABASE (BACKGROUND LOAD)
// ==========================================
async function ambilDataSoal() {
    try {
        // Otomatis download pecahan di background awal web dibuka
        const [m1, m2, s1, s2, sl1, sl2] = await Promise.all([
            fetch('database/mudah_part1.json').then(res => res.json()),
            fetch('database/mudah_part2.json').then(res => res.json()),
            fetch('database/sedang_part1.json').then(res => res.json()),
            fetch('database/sedang_part2.json').then(res => res.json()),
            fetch('database/sulit_part1.json').then(res => res.json()),
            fetch('database/sulit_part2.json').then(res => res.json())
        ]);

        bankSoal.mudah = acakArray([...m1, ...m2]);
        bankSoal.sedang = acakArray([...s1, ...s2]);
        bankSoal.sulit = acakArray([...sl1, ...sl2]);

        indeksSoalKategori = { mudah: 0, sedang: 0, sulit: 0 };
        buatTanggaHadiah();

    } catch (error) {
        console.error("Error loading database folders:", error);
        document.getElementById("teks-pertanyaan").innerText = "Gagal memuat pecahan database.";
    }
}

// ==========================================
// SISTEM INTERAKSI AWAL (BYPASS BLOCK AUDIO)
// ==========================================
function mulaiPermainanPertamaKali() {
    // Hilangkan overlay start screen setelah interaksi
    const layarMulai = document.getElementById("layar-mulai");
    if (layarMulai) layarMulai.style.display = "none";

    // Suara intro sukses diputar karena dipicu event click manual user
    putarSuara("begin.mp3", false, 0.8); 
    mulaiSistemAyat(); 
    
    // Beri jeda 4 detik agar lagu intro selesai baru kuis dimulai
    setTimeout(() => {
        muatSoalBaru();
    }, 4000);
}

function dapatkanKategoriKesulitan(nomor) {
    if (nomor <= 5) return "mudah";
    if (nomor <= 10) return "sedang";
    return "sulit";
}

function muatSoalBaru() {
    perbaruiHighlightHadiah();
    perbaruiTeksHadiahAtas();
    sesuaikanMusikLatarKategori(nomorPertanyaanSekarang); 

    let kategori = dapatkanKategoriKesulitan(nomorPertanyaanSekarang);
    let kumpulanSoal = bankSoal[kategori];
    
    let indeksSekarang = indeksSoalKategori[kategori];
    let soalTerpilih = kumpulanSoal[indeksSekarang];
    
    indeksSoalKategori[kategori]++; 
    
    let pilihanDiacak = acakArray([...soalTerpilih.pilihan]);

    soalAktif = { pertanyaan: soalTerpilih.pertanyaan, pilihan: pilihanDiacak, jawabanBenar: soalTerpilih.jawabanBenar };
    document.getElementById("teks-pertanyaan").innerText = `${nomorPertanyaanSekarang}. ${soalAktif.pertanyaan}`;
    
    const tombolPilihan = document.querySelectorAll(".btn-pilihan");
    tombolPilihan.forEach((tombol, indeks) => {
        tombol.innerHTML = `<span class="label-huruf">${labelAbjad[indeks]}</span> <span class="teks-opsi">${soalAktif.pilihan[indeks]}</span>`;
        tombol.disabled = false;
        tombol.className = "btn-pilihan"; 
    });
}

function cekJawaban(tombolDiklik) {
    if (tombolDiklik.classList.contains("terhapus-5050")) return;

    tombolTerpilihSementara = tombolDiklik;
    tombolTerpilihSementara.classList.add("terpilih");
    
    gantiMusikLatar("final.mp3", true, 0.7); 
    document.getElementById("modal-konfirmasi").style.display = "flex";
}

document.getElementById("btn-yakin-ya").addEventListener("click", () => {
    document.getElementById("modal-konfirmasi").style.display = "none";
    prosesEksekusiJawaban();
});

document.getElementById("btn-yakin-tidak").addEventListener("click", () => {
    document.getElementById("modal-konfirmasi").style.display = "none";
    if (tombolTerpilihSementara) tombolTerpilihSementara.classList.remove("terpilih");
    sesuaikanMusikLatarKategori(nomorPertanyaanSekarang); 
});

function prosesEksekusiJawaban() {
    let jawabanPemain = tombolTerpilihSementara.querySelector(".teks-opsi").innerText;
    const semuaTombol = document.querySelectorAll(".btn-pilihan");
    semuaTombol.forEach(btn => btn.disabled = true);
    tombolTerpilihSementara.classList.remove("terpilih");

    if (jawabanPemain === soalAktif.jawabanBenar) {
        if (musikLatarAktif) musikLatarAktif.pause(); 
        putarSuara("correct.mp3", false, 0.9); 
        
        tombolTerpilihSementara.classList.add("benar-kedip");
        let levelSelesai = nomorPertanyaanSekarang;

        if (levelSelesai === 5 || levelSelesai === 10 || levelSelesai === 15) {
            setTimeout(() => {
                nyalakanKembangApi(5000);
                let pesanMilestone = levelSelesai === 15 
                    ? "SELAMAT! ANDA BERHASIL MENJAWAB SEMUA SOAL DAN MEMBAWA PULANG Rp 1 MILYAR!" 
                    : `LUAR BIASA AMAN! Anda melewati Titik Aman dan mengunci ${daftarHadiah[levelSelesai-1]}!`;
                
                tampilkanNotifikasiAutoclose(pesanMilestone, "milestone", 5000);
                setTimeout(() => { if(levelSelesai === 15) { resetGame(); } else { nomorPertanyaanSekarang++; muatSoalBaru(); } }, 5100);
            }, 3000);
        } else {
            tampilkanNotifikasiAutoclose(`Jawaban BENAR! Hadiah Anda meningkat ke ${daftarHadiah[levelSelesai-1]}!`, "sukses", 2800);
            setTimeout(() => { tombolTerpilihSementara.classList.remove("benar-kedip"); nomorPertanyaanSekarang++; muatSoalBaru(); }, 3000);
        }
    } else {
        if (musikLatarAktif) musikLatarAktif.pause();
        putarSuara("wrong.mp3", false, 0.9); 

        tombolTerpilihSementara.classList.add("salah-kedip");
        semuaTombol.forEach(btn => {
            if (btn.querySelector(".teks-opsi").innerText === soalAktif.jawabanBenar) {
                btn.style.background = "#2ec4b6"; btn.style.color = "#000";
                btn.querySelector(".label-huruf").style.color = "#000";
            }
        });
        tampilkanNotifikasiAutoclose(`Jawaban SALAH! Game Over. Terhenti di level ${nomorPertanyaanSekarang}.`, "gagal", 3800);
        setTimeout(() => { 
            tombolTerpilihSementara.classList.remove("salah-kedip"); 
            semuaTombol.forEach(btn => { btn.style.background = ""; btn.style.color = ""; }); 
            resetGame(); 
        }, 4000);
    }
}

// ==========================================
// FITUR BANTUAN & PANEL HADIAH
// ==========================================
function gunakan5050() {
    if (bantan5050Digunakan) return;
    let tombolPilihan = Array.from(document.querySelectorAll(".btn-pilihan"));
    
    for (let i = tombolPilihan.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tombolPilihan[i], tombolPilihan[j]] = [tombolPilihan[j], tombolPilihan[i]];
    }

    let jawabanSalahDihapus = 0;
    for (let tombol of tombolPilihan) {
        let teksOpsi = tombol.querySelector(".teks-opsi").innerText;
        if (teksOpsi !== soalAktif.jawabanBenar && jawabanSalahDihapus < 2) {
            tombol.classList.add("terhapus-5050");
            jawabanSalahDihapus++;
        }
    }
    bantan5050Digunakan = true;
    const btn5050 = document.getElementById("btn-5050");
    btn5050.disabled = true; btn5050.style.opacity = "0.4"; btn5050.innerText = "Used";
    tampilkanNotifikasiAutoclose("Bantuan 50:50 Diaktifkan!", "netral", 2500);
}

function buatTanggaHadiah() {
    const moneyTreeEl = document.getElementById("money-tree");
    if (!moneyTreeEl) return;
    moneyTreeEl.innerHTML = "";
    for (let i = daftarHadiah.length - 1; i >= 0; i--) {
        let div = document.createElement("div");
        div.id = `level-${i + 1}`;
        div.className = "hadiah-item";
        if (i === 4 || i === 9 || i === 14) div.classList.add("aman");
        div.innerHTML = `<span>${String(i + 1).padStart(2, '0')}</span> <span>${daftarHadiah[i]}</span>`;
        moneyTreeEl.appendChild(div);
    }
}

function perbaruiHighlightHadiah() {
    document.querySelectorAll(".hadiah-item").forEach(el => el.classList.remove("aktif"));
    const elAktif = document.getElementById(`level-${nomorPertanyaanSekarang}`);
    if (elAktif) elAktif.classList.add("aktif");
}

function perbaruiTeksHadiahAtas() {
    const hadiahEl = document.getElementById("hadiah-sekarang");
    if (!hadiahEl) return;
    if (nomorPertanyaanSekarang === 1) {
        hadiahEl.innerText = "Hadiah: Rp 0";
    } else {
        hadiahEl.innerText = `Hadiah: ${daftarHadiah[nomorPertanyaanSekarang - 2]}`;
    }
}

function resetGame() {
    nomorPertanyaanSekarang = 1;
    bantan5050Digunakan = false;
    const btn5050 = document.getElementById("btn-5050");
    if (btn5050) {
        btn5050.disabled = false; btn5050.style.opacity = "1"; btn5050.innerText = "50 : 50";
    }
    
    if (bankSoal.mudah.length > 0) {
        bankSoal.mudah = acakArray([...bankSoal.mudah]);
        bankSoal.sedang = acakArray([...bankSoal.sedang]);
        bankSoal.sulit = acakArray([...bankSoal.sulit]);
    }
    indeksSoalKategori = { mudah: 0, sedang: 0, sulit: 0 };

    putarSuara("begin.mp3", false, 0.8);
    setTimeout(() => {
        muatSoalBaru();
    }, 4000);
}

// Jalankan loading database di background dari awal
ambilDataSoal();