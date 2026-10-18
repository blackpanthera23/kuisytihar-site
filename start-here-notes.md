# Start Here: nota penjelasan (BM-rojak)

Dokumen ini menerangkan sistem kerja **brainaline** untuk manusia: apa yang sudah dibina, apa yang masih contoh, dan apa yang belum ada. Ia sumber teks untuk halaman `start-here.html` dan nota rujukan bebas.

Tarikh disusun: 17 Oktober 2026.
Sumber utama: repo `brainaline`, branch `omp/creative-brain-20261016` (https://github.com/blackpanthera23/brainaline/tree/omp/creative-brain-20261016). Repo itu peribadi; pautan ini provenance, bukan aset awam.

---

## 0. Tiga label yang dipakai sepanjang dokumen ini

| Label | Maksud |
|---|---|
| **Dah dibina** | Fail atau arahan itu benar-benar ada dalam repo dan boleh dibaca sekarang. |
| **Contoh** | Demonstrasi kaedah. Tiada campaign dijalankan, tiada database dicipta, tiada publish berlaku. |
| **Belum ada** | Capability belum dipasang, belum disahkan, atau kosnya belum diketahui. |

Nama bisnes yang muncul dalam contoh dilabel sebagai contoh perancangan am. Tiada data pesakit, tiada angka prestasi, tiada isu dalaman dan tiada kos sebenar didedahkan.

---

## 1. Apa yang dah dibina

Repo brainaline ialah "operating layer", bukan zip kursus. Komponen yang benar-benar wujud:

- **Entry point** `CREATIVE.md`: urutan mula tanpa briefing semula, senarai gate keselamatan, dan penjelasan tiga lapisan.
- **Lapisan taste bersumber**: setiap entri ada skop, medium, verdict, autoriti dan jenis bukti. Autoriti membezakan kata saya, pemerhatian reviewer, dan output tool.
- **Lima profil surface**: website, app, poster, static-ad, video-ad. Setiap satu menetapkan goal, brief yang perlu ada, apa yang kena disemak, dan apa yang patut dielak. Satu surface per sesi.
- **Prosedur creative director** `layer-2-skills/creative-director/SKILL.md`: langkah brief, retrieve, reference, direct, compile, execute, cost gate, review, correct, persist.
- **Fail peranan** `agents.md`: director/integrator, researcher, designer/maker, reviewer/QA, curator. Satu agent boleh memakai semua topi; fail ini tidak mendaftarkan bot, plugin atau izin tool baru.
- **Peta pemetaan** `ryan-map.md`: konsep sumber dipetakan ke pelaksanaan, termasuk apa yang sengaja tidak dipindah.
- **Loop feedback on-demand** `layer-3-automation/creative-feedback.md`: capture, extract, compare, persist, checkpoint, read-back, reuse. Tiada cron, tiada daemon.
- **Script packet read-only**: Python standard library, dua subcommand (check dan packet). Read-only, tiada network, tiada penjanaan berbayar.

Tiga perkara yang selalu disalah faham:

1. **Model berbeza tidak automatik jadi sama pintar**, dan hasil tidak automatik cantik. Yang buat hasil konsisten ialah konteks betul ditambah loop review yang benar-benar dijalankan.
2. **Packet ialah snapshot, bukan task authority baru.** Ia perlu di-refresh bila source revision berubah.
3. **Tiada host yang auto-sync.** Model tidak ikut fail semata-mata sebab fail itu wujud. Project perlu attach atau baca entry point, connector perlu retrieve, dan repo peribadi masih perlu auth.

---

## 2. Taste evidence lawan teknik yang diwarisi

Benda yang saya suka atau tolak ialah **bukti taste**. Benda dari library orang lain ialah **teknik**. Dua benda ini tidak sama.

- Teknik yang diimport boleh dipilih, tetapi ia bukan kelulusan taste saya.
- Kalau tiada bukti pengguna langsung untuk sesuatu skop dan medium, sistem akan cakap begitu dan melarang kita teka.
- "Sebahagian variant suka" bukan bermakna seluruh galeri diluluskan. Winner individu masih belum dipilih.
- Prompt yang menghasilkan output generik ialah input diagnostik, bukan bukti semua serif dan krim itu buruk.

Lima tabiat masa menulis prompt: satu outcome satu sesi; fakta dan konteks dulu; dua arah struktur bukan enam recolour; review pakai mata bukan log; cukup bermakna berhenti.

---

## 3. Ryan: apa yang diambil, apa yang tidak

Ryan mengajar tiga lapisan: context, skills, automation. Yang diambil ialah cara pikir.

| Konsep sumber | Pelaksanaan di brainaline |
|---|---|
| Layer 1 context + schema | Schema canonical dikekalkan; taste ditambah sebagai evidence berskop |
| Primary / secondary / deep | Entry point, kemudian profil dan taste, kemudian hanya source terpilih |
| Pod per client | Konteks client diasingkan; client lain kena bawa konteks sendiri |
| Departmental craft | Kaedah image, video, copy, layout dikongsi merentas client |
| Layer 3 engine (trigger, lock, idempotency, run log) | Loop on-demand sahaja; tiada scheduler dipasang |
| Safety (autonomy matrix, approval, fail loud) | Gate repo menang: tiada generate, spend atau publish tanpa izin |

**Primary, secondary, deep** ialah cara muat konteks berperingkat: primary mesti betul dahulu (identity, batasan, larangan), secondary ialah prosedur dan peranan, deep ialah source panjang yang hanya dibaca bila kerja memerlukannya.

**Pod lawan craft**: konteks client diasingkan, kaedah kerja dikongsi. Resepi komposisi boleh dikongsi; taste, larangan dan fakta client tidak pernah berpindah antara satu sama lain.

Yang sengaja tidak dipindah: install script, template credential, config runtime akaun, roster client lama, harga, angka prestasi, contoh peribadi, email engine dan schedule. Fail yang diimport kekal inert, bukan permission untuk jalankan kod atau akses akaun.

---

## 4. Peranan, delegasi dan model

**Satu integration owner.** Director memegang niat asal, spec dan keputusan akhir. Dia tidak delegate top-level intent dan tidak tukar brief secara senyap. Dua agent tidak menulis fail yang sama.

**Fan-out yang benar-benar independent.** Dependency sebenar kekal bersiri: brief, execution, review artifact sebenar, keputusan taste pengguna. Fan-out hanya untuk dua atau lebih slice yang tidak berkongsi fail. Kontrak minimum sebelum spawn: task ID, branch atau revision, scope, source paths, acceptance, larangan, owner output, lokasi tulis.

**Kelas model: cadangan, bukan rekod.** Kerja mekanikal (listing, fetch, reformat, translate, ekstrak) sesuai untuk tier murah dan laju, dan syor saya di situ ialah kelas laju seperti tier flash; research dan copy pada tier pertengahan; taste judgement dan kritik visual pada tier tertinggi yang ada mata; kerja yang perlu runtime pada host yang ada tools. Sesi yang menyusun dokumen ini **tidak ada pemilih model**, jadi tiada dakwaan bahawa mana-mana kelas tertentu benar-benar dipakai, termasuk flash. Jangan tulis "dijalankan dengan model X" kalau tiada bukti. Harga model tidak disenaraikan di sini.

**Kuasa kelulusan.** Hanya saya menaikkan status ke peringkat tertinggi. Agent paling tinggi "claimed done". Feedback saya yang eksplisit sahaja boleh jadi personal preference; inferens reviewer kekal calon. Tool output "done" bukan bukti artifact telah disemak. Hantar keluar (post, emel, upload, bayar) sentiasa perlukan kelulusan saya.

---

## 5. Anatomi prompt

Enam blok: context, task, non-goals, facts dan constraints, acceptance, deliverable.

Prompt yang gagal biasanya hyper-prescriptive pada layout tetapi kosong pada tujuan. Contoh diagnosis: prompt 300 baris yang mengunci setiap section, setiap rule dan setiap nombor akan menghasilkan output generik, sebab agent tiada ruang composition.

Contoh copy-paste ada dalam halaman `start-here.html` (tiga contoh: kerja website, brief static ad, tugasan data).

---

## 6. Contoh aliran: perancangan strategik

Perancangan strategik **bukan** senarai cawangan. Ia rantaian lima langkah:

1. **Inventori data.** Senaraikan apa yang benar-benar ada sebelum bercakap tentang dashboard. Tandakan apa yang belum disahkan. Jangan reka sel kosong yang nampak lengkap.
2. **Soalan dan definisi KPI.** Tulis soalan yang papan perlu jawab, kemudian definisikan setiap ukuran sebelum nombor masuk. Definisi mesti ada unit, tempoh dan sumber. Kalau definisi belum dipersetujui, KPI itu belum wujud walaupun nombornya ada.
3. **Provenance, as-of dan owner.** Setiap fakta membawa sumber, tarikh as-of dan owner. Rating awam berubah setiap minggu, jadi tarikh as-of wajib ada.
4. **Skema relasional yang disanitasi.** Empat jadual asas: Initiatives, KPI observations, Decisions, Source register. Cawangan dan perkhidmatan masuk sebagai fakta sokongan yang dirujuk, bukan sistem utama.
5. **Staging, readback, sync idempotent.** Siapkan data, tunjuk semula untuk kelulusan, barulah sync. Sync mesti idempotent. Papan pemantauan bukan task authority kedua; jangan cipta board kedua yang boleh bercanggah dengan ledger kerja sedia ada.

Had: tiada data pesakit, tiada data pelanggan tanpa izin, tiada claim tanpa sumber. Kalau connector belum dipasang, langkah sync kekal cadangan, bukan kejayaan.

---

## 7. Contoh aliran: lead generation

Empat peringkat:

1. **Offer, audiens, bukti.** Satu audiens utama. Offer jujur. Bukti dari sumber. Kalau tiada bukti, tulis tiada bukti. Jangan reka testimoni, angka atau logo.
2. **Laman dan cara hubungi.** Satu tindakan utama per halaman, dan laluan hubungi yang benar-benar dipantau. Laluan yang disahkan sekarang ialah emel. Laluan lain belum hidup, jadi ia tidak boleh ditulis seolah-olah sudah berfungsi.
3. **Kualifikasi dan follow-up.** Satu opener spesifik yang merujuk dari mana lead datang, satu atau dua soalan kualifikasi sebelum pitch, kemudian jadual follow-up pendek dengan konteks baru setiap kali.
4. **Ukur dan belajar.** Rekod berapa yang bertanya, berapa yang layak, berapa yang sampai ke perbualan serius. Bandingkan satu perubahan pada satu masa, simpan pembelajaran sebagai satu entri.

Yang tidak boleh dibuat tanpa kelulusan eksplisit: mencipta offer percuma yang baru, menulis komitmen bajet, atau menyambung ke saluran yang belum disediakan. Kalau saluran belum ada, gate pertama belum lulus dan kerja berhenti di situ.

---

## 8. Gate, anti-overbuild dan bajet

Gate sebelum deploy:

- Laman boleh dimuatkan dan tindakan utama berfungsi.
- Boleh dibaca pada telefon tanpa scroll mendatar.
- Fakta betul dan tiada dakwaan tanpa sumber.
- Tiada regresi berbanding versi langsung.
- Ada satu manusia yang telah melihat hasilnya pada skrin sebenar.

Gate yang bergantung pada kelulusan orang lain (privasi, konteks kesihatan) mesti **tersekat** sehingga kelulusan itu ada. Deploy tanpa kelulusan bukan keputusan kreatif, ia pelanggaran.

Tanda overbuild yang dielak: sesi panjang tanpa artifact yang boleh dilihat; variasi keempat sesuatu yang tiada siapa minta; dashboard atau kerangka A/B test sebelum pelawat pertama.

Bajet: tiada penjanaan berbayar tanpa model, jumlah, output, anggaran kos, ceiling dan had cubaan semula yang diketahui. Eksperimen berbayar kecil dan berperingkat, hanya dengan kelulusan jelas untuk jumlah dan tempoh. Subscription tidak membuktikan tool itu percuma. Kos yang belum diketahui bermakna **berhenti**, bukan cuba dan lihat.

---

## 9. Apa yang belum ada

- Tiada connector dipasang; penyegerakan ke papan pemantauan masih cadangan.
- Tiada scheduler atau cron baru diaktifkan; loop berjalan on-demand.
- Tiada kalibrasi visual dijalankan dalam sesi yang menyusun dokumen ini: tiada screenshot dibuka dan tiada design dinilai secara visual.
- Tiada penjanaan aset berbayar dibuat; tool penjanaan visual tidak dipasang.
- Tiada pemilih model dalam tugasan sesi; sebarang kelas model ialah cadangan routing.
- Kos langganan dan API yang terlibat belum disahkan di sini.

**Status dokumen:** belum diverifikasi semula terhadap repo selepas disusun. Anggap ia sebagai draf penjelasan, bukan bukti akhir.
