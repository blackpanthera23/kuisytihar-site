# Start Here: nota penjelasan (BM-rojak)

Dokumen ini nota sumber untuk halaman `start-here.html` dan rujukan bebas. Dua lapis: **cepat** (baca 2 minit, terus tahu apa benda ni) dan **penuh** (detail teknikal, contoh, prompt boleh salin).

Tarikh disusun: 17 Oktober 2026. Tarikh semakan terakhir nota ini: 18 Oktober 2026.
Sumber utama: repo peribadi `brainaline`, branch `omp/creative-brain-20261016` (https://github.com/blackpanthera23/brainaline/tree/omp/creative-brain-20261016). Pautan itu provenance, bukan aset awam; repo masih perlu auth.

---

## 0. Tiga label yang dipakai sepanjang dokumen

Guna label ni setiap kali cakap pasal apa-apa. Kalau tak boleh label, maksudnya kena selidik dulu.

| Label | Maksud |
|---|---|
| **Dah dibina** | Fail, arahan, atau laman tu benar-benar ada sekarang dan boleh dibaca. |
| **Contoh** | Demonstrasi kaedah. Tiada campaign dijalankan, tiada database dicipta, tiada publish berlaku. |
| **Belum ada / belum disahkan** | Belum dipasang, belum diuji, atau kosnya belum diketahui. |

Nama bisnes dalam contoh dilabel sebagai contoh perancangan am. Tiada data pesakit, tiada nama klien, tiada angka prestasi, tiada isu dalaman dan tiada kos sebenar didedahkan. Kalau ada angka dalam contoh, angka itu rekaan ilustrasi untuk tunjuk bentuk jadual, bukan hasil sebenar.

---

# BAHAGIAN CEPAT (baca ni dulu)

## C1. Brainaline ni apa, macam kabinet fail

Brainaline ni **operating layer**, bukan zip kursus dan bukan bot. Fikir macam **kabinet fail + buku resepi + jadual kerja** dalam satu folder:

- **Kabinet fail (context)** — identiti, larangan, fakta, taste tersumber. Orang buka laci ni dulu sebelum buat apa-apa.
- **Buku resepi (skills)** — prosedur langkah demi langkah. Resepi sendiri tak masak apa-apa; ia cuma arahan.
- **Jadual kerja (automation)** — bila kerja patut jalan sendiri. Sekarang jadual ni **manual**: ada senarai langkah, tapi tak ada jam loceng yang berbunyi sendiri.

Semua yang terlibat dalam satu kerja boleh dipecahkan kepada lima benda ni. Analogi dapur, senang ingat:

| Benda | Analogi dapur | Maksud sebenar |
|---|---|---|
| **Host** | Dapur (tempat) | Mesin/runtime yang ada tools dan fail. Contoh: Claude Code dalam repo, OMP dalam terminal, telefon. |
| **Model** | Enjin dapur (api) | Otak yang fikir. Kelas laju untuk kerja mekanikal, kelas pertengahan untuk research, kelas paling ada "mata" untuk taste visual. |
| **Role** | Jawatan dalam syif | Apa yang pekerja tu buat: director, researcher, designer, reviewer, curator. |
| **Tool** | Peralatan dapur | Benda yang boleh capai dunia luar: baca fail, cari web, ambil screenshot, hantar emel. |
| **Skill** | Resepi | Arahan bertulis: langkah, gate, format output. |

Lima benda ni **berbeza**. Kalau kau tukar enjin (model) tapi resepi masih kosong, makanan tetap tak sedap.

**Roles lawan loading tier.** Dua paksi berlainan, bukan satu tangga:

- **Role** = kerja apa (topi apa).
- **Tier pemuatan konteks** (primary / secondary / deep) = berapa banyak bahan dibaca untuk kerja tu.

Keduanya bukan "lapisan", dan bukan ranking siapa lebih tinggi. Tiga lapisan sebenar (context / skills / automation) ialah bab seterusnya.

## C2. Tiga lapisan, dan Ryan

Ryan ajar tiga lapisan. Kita ambil cara pikir dia, bukan fail dia.

1. **Lapisan 1: Context.** Siapa kita, buat apa, larang apa. Kalau ni salah, semua bawah jadi salah.
2. **Lapisan 2: Skills.** Prosedur dan peranan. Cara buat kerja dengan konsisten.
3. **Lapisan 3: Automation.** Bila kerja jalan sendiri: trigger, lock, run log, idempotency.

**Penting:** lapisan 3 dalam brainaline sekarang **cuma manual loop**. Ada dokumen loop on-demand (capture → extract → compare → persist → read-back → reuse), tapi **takde scheduler, takde cron, takde daemon**. Jangan tulis "auto sync" atau "auto update". Bila orang tanya "dah automate ke?", jawapan betul: "loop ada, tapi aku yang tekan."

## C3. Memori tak auto-load

Ini penyebab 90% salah faham:

- Fail memori (memori agent, nota user, entry point) **tak auto masuk** ke dalam sesi baru. Fail wujud ≠ model baca.
- Model **tak sync** ikut fail semata-mata sebab fail tu ada dalam repo.
- Untuk kerja dapat konteks: project kena attach atau buka entry point; connector kena retrieve; repo peribadi kena auth.

Kalau kau nampak hasil generik, kemungkinan besar punca pertama ialah konteks belum dimuat, bukan model bodoh.

## C4. Routing pantas: kerja apa, pergi mana

Nota: baris "runtime disenaraikan" bawah ni adalah **catatan routing**, bukan dakwaan ukuran. Sesi yang tulis nota ini tak ada pemilih model, jadi jangan tulis "dijalankan dengan model X" tanpa bukti.

| Jenis kerja | Host | Beban model | Sebab |
|---|---|---|---|
| Kerja mekanikal: listing, fetch, reformat, translate, ekstrak, tukar format prosa pendek | OMP (terminal) atau host yang ada tools | Kelas laju (contoh nama yang tersenarai dalam runtime semasa: `amanai/deepseek-v4.1-flash`) | Kerja potong-tampal teks. Bayar enjin mahal untuk potong-tampal = buang duit. |
| Script, sync data, audit, semak fail, kira | OMP | Sederhana, atau skim je dengan kelas laju | Perlu filesystem dan run sebenar. |
| Visual: reka laman, nilai screenshot, taste design | Claude Code (role designer) | Kelas paling tinggi yang ada "mata" | Audiens, hierarki, warna, spacing. Tak boleh diukur dengan log. |
| Research dan penulisan panjang | Host yang ada tools carian | Pertengahan | Perlu sumber, bukan hafalan. |
| Perancangan dari telefon | Telefon (chat) | Kelas laju atau sederhana | Ringan, tapi keputusan tetap manusia. |
| Operasi sedia ada: memori, skill, rujukan, cron | Hermes (yang memang ada sekarang) | Ikut kerja | **Bukan** bukti sync hidup. Baca apa yang ada, jangan andaikan ia auto-update. |

**Peraturan kos:** jangan andaikan "mahal = bagus". Cuba yang paling murah yang cukup dulu, dan sahkan ia cukup. Kalau kelas murah boleh buat kerja tu dengan betul, guna dia dan simpan kelas mahal untuk kerja yang betul-betul perlu pertimbangan.

**Tiada dakwaan harga** dalam nota ini. Harga model dan langganan tak disahkan di sini.

## C5. Bila cukup, bila deploy, bila overbuild

Cukup bila: satu keputusan sebenar boleh dijawab, satu manusia dah tengok hasil pada skrin sebenar, dan gerbang keselamatan dah lulus.

Overbuild kelihatan macam ni: sesi panjang tanpa artifact yang boleh dilihat; variasi keempat benda yang tiada siapa minta; dashboard atau rangka A/B test sebelum pelawat pertama; CRM sebelum ada lead pertama.

Deploy **tanpa** kelulusan bukan keputusan kreatif. Itu pelanggaran.

---

# BAHAGIAN PENUH (detail, contoh, prompt)

## 1. Apa yang dah dibina

Repo brainaline bukan bot dan bukan plugin. Komponen yang benar-benar wujud:

- **Entry point** `CREATIVE.md`: urutan mula tanpa briefing semula, senarai gate keselamatan, penjelasan tiga lapisan.
- **Lapisan taste bersumber**: setiap entri ada skop, medium, verdict, autoriti dan jenis bukti.
- **Lima profil surface**: website, app, poster, static-ad, video-ad. Setiap satu tetapkan goal, brief yang wajib ada, apa yang disemak, apa yang dielak. Satu surface per sesi.
- **Prosedur creative director** `layer-2-skills/creative-director/SKILL.md`: brief → retrieve → reference → direct → compile → execute → cost gate → review → correct → persist.
- **Fail peranan** `agents.md`: director/integrator, researcher, designer/maker, reviewer/QA, curator. Satu agent boleh pakai semua topi; fail ini tidak mendaftarkan bot, plugin atau izin tool baru.
- **Peta pemetaan** `ryan-map.md`: konsep sumber dipetakan ke pelaksanaan, termasuk apa yang sengaja tidak dipindah.
- **Loop feedback on-demand** `layer-3-automation/creative-feedback.md`: capture, extract, compare, persist, checkpoint, read-back, reuse. **Tiada cron, tiada daemon.**
- **Script packet read-only**: Python standard library, dua subcommand (`check` dan `packet`). Read-only, tiada network, tiada penjanaan berbayar.

**Autoriti bukti.** Bila simpan taste, catat siapa cakap. Kata user sendiri > pemerhatian reviewer (calon) > output tool. Tool output "done" bukan bukti artifact dah disemak. Hanya user boleh naikkan status ke peringkat tertinggi; agent paling tinggi cuma "claimed done".

Tiga salah faham biasa:

1. **Model berbeza tidak automatik jadi sama pintar**, dan hasil tidak automatik cantik. Yang buat konsisten ialah konteks betul + loop review yang benar-benar dijalankan.
2. **Packet ialah snapshot, bukan task authority baru.** Kena refresh bila source revision berubah.
3. **Tiada host yang auto-sync.** Fail wujud ≠ model baca.

## 2. Contoh lawan fakta: taste evidence vs teknik diwarisi

- Benda yang aku suka atau tolak = **bukti taste**.
- Benda dari library orang lain = **teknik**.

Dua benda ni tak sama:

- Teknik yang diimport boleh dipilih, tapi ia bukan kelulusan taste aku.
- Kalau tiada bukti pengguna langsung untuk sesuatu skop dan medium, sistem kena cakap "tiada bukti" dan larang kita teka.
- "Sebahagian variant suka" bukan bermakna seluruh galeri diluluskan. Winner individu masih belum dipilih.
- Prompt yang keluar output generik ialah **input diagnostik**, bukan bukti semua serif dan krim itu buruk.

Lima tabiat masa tulis prompt: satu outcome satu sesi; fakta dan konteks dulu; dua arah struktur bukan enam recolour; review pakai mata bukan log; cukup makna berhenti.

## 3. Ryan: apa diambil, apa tidak

| Konsep sumber | Pelaksanaan di brainaline |
|---|---|
| Layer 1 context + schema | Schema canonical dikekalkan; taste ditambah sebagai evidence berskop |
| Primary / secondary / deep | Entry point, kemudian profil dan taste, kemudian hanya source terpilih |
| Pod per client | Konteks client diasingkan; client lain kena bawa konteks sendiri |
| Departmental craft | Kaedah image, video, copy, layout dikongsi merentas client |
| Layer 3 engine (trigger, lock, idempotency, run log) | Loop on-demand sahaja; tiada scheduler dipasang |
| Safety (autonomy matrix, approval, fail loud) | Gate repo menang: tiada generate, spend atau publish tanpa izin |

**Primary, secondary, deep** = cara muat konteks berperingkat: primary mesti betul dahulu (identiti, batasan, larangan), secondary ialah prosedur dan peranan, deep ialah source panjang yang dibaca hanya bila kerja memerlukan. Ini paksi **kedalaman konteks**, bukan tangga pangkat. Role (director vs reviewer) pula paksi **kerja apa**. Jangan campur dua paksi ni.

**Pod lawan craft**: konteks client diasingkan, kaedah kerja dikongsi. Resepi komposisi boleh dikongsi; taste, larangan dan fakta client tidak pernah berpindah.

Yang sengaja tidak dipindah: install script, template credential, config runtime akaun, roster client lama, harga, angka prestasi, contoh peribadi, email engine dan schedule. Fail yang diimport kekal **inert** — bukan permission untuk jalankan kod atau akses akaun.

## 4. Satu agent cukup? Bila fan-out?

Default: **satu agent cukup.** Agent tunggal dengan konteks betul hampir selalu lebih baik daripada lima agent yang saling tak tahu apa yang agent lain tulis.

Fan-out hanya untuk kerja yang **benar-benar bebas**: dua atau lebih slice yang tidak berkongsi fail, tidak bergantung antara satu sama lain, dan boleh disemak berasingan.

**Dependency sebenar kekal bersiri:** brief → execution → review artifact sebenar → keputusan taste user. Ini tak boleh dilompat.

**Satu integration owner.** Director pegang niat asal, spec dan keputusan akhir. Dia tidak delegate top-level intent dan tidak tukar brief secara senyap. **Dua agent tidak menulis fail yang sama.**

**Kontrak minimum sebelum spawn subagent** (tanpa semua ini, jangan spawn):

| Field | Maksud |
|---|---|
| Task ID | Nama unik kerja tu |
| Branch / revision | Di atas apa ia bekerja |
| Scope | Fail/folder apa sahaja dibenarkan |
| Input paths | Sumber yang dia patut baca |
| Output owner | Siapa yang tulis hasil akhir |
| Acceptance | Apa maksud "siap", boleh disemak |
| No-go | Larangan eksplisit (fail yang tak boleh sentuh, benda yang tak boleh dibuat) |
| Cost | Kalau ada penjanaan berbayar: model, jumlah, ceiling, had retry |
| Definition of done | Satu ayat, satu manusia boleh sahkan ya/tidak |

**Kuasa kelulusan:** hanya user naikkan status tertinggi. Hantar keluar (post, emel, upload, bayar) sentiasa perlu kelulusan user.

## 5. Anatomi prompt: enam blok

| Blok | Isi |
|---|---|
| 1. **Context** | Siapa aku, projek apa, fakta bersumber, larangan. |
| 2. **Task** | **Satu** outcome, satu sesi. |
| 3. **Non-goals** | Apa yang **jangan** buat (nyahaktifkan overbuild). |
| 4. **Facts & constraints** | Angka, definisi, sumber, tarikh as-of, batasan. |
| 5. **Acceptance** | Boleh disemak: macam mana aku tahu ia betul. |
| 6. **Deliverable** | Bentuk output: fail apa, format apa, di mana. |

Prompt yang gagal biasanya **hyper-prescriptive pada layout tapi kosong pada tujuan**. Prompt 300 baris yang mengunci setiap section, setiap rule dan setiap nombor akan keluar output generik, sebab agent tak ada ruang composition. Sebaliknya prompt pendek yang bagi satu outcome jelas + acceptance yang boleh disemak selalu menang.

**Satu outcome satu sesi.** Kalau kau rasa nak tulis "dan juga..." — itu sesi kedua.

Contoh copy-paste ada dalam halaman `start-here.html` (tiga contoh: kerja website, brief static ad, tugasan data).

## 6. Contoh aliran: perancangan strategik (klinik, anonymous)

**Konteks awam:** contoh ni guna klinik generik tanpa nama. Projek sebenar yang user panggil projek itu **tidak dinamakan** di sini dan tiada data pesakit, data klien, atau angka sebenar didedahkan. Kalau connector belum dipasang, langkah sync kekal **cadangan**, bukan kejayaan.

Perancangan strategik **bukan** senarai cawangan dan bukan dashboard. Ia rantaian lima langkah, dan **soalan bisnes datang dulu** — sebelum data, sebelum tool:

1. **Soalan bisnes dulu.** Apa satu keputusan yang kita nak boleh jawab? Contoh: "Adakah duit iklan bulan lepas sebenarnya jadi pesakit, atau jadi orang tanya sahaja?"
2. **Inventori data.** Senaraikan apa yang benar-benar ada sebelum bercakap tentang dashboard. Tandakan apa yang belum disahkan. Jangan reka sel kosong yang nampak lengkap.
3. **Definisi dan cohort.** Definisi mesti ada unit, tempoh, dan sumber. Turutan funnel: **spend → lead → qualified → booked → attended**. Semua peringkat kena guna **cohort sama** dan **window sama**, dan kena ada **dedupe** orang yang sama bertanya dua kali. Kalau kos tiada, tulis **"denominator unavailable"**, jangan tulis sifar. Kalau definisi belum dipersetujui, KPI tu belum wujud walaupun nombornya ada.
4. **Provenance, as-of, owner.** Setiap fakta bawa sumber, tarikh as-of dan owner. Rating awam berubah setiap minggu, jadi tarikh as-of wajib ada.
5. **Skema relasional yang disanitasi.** Empat jadual asas:
   - **Source register** — setiap sumber: nama, jenis, tarikh as-of, owner, kebolehpercayaan.
   - **KPI observations** — satu baris = satu ukuran pada satu tarikh, dengan unit, cohort dan window.
   - **Decisions** — keputusan apa, tarikh, owner, atas dasar data apa, semakan bila.
   - **Initiatives** — kerja apa sedang jalan, owner, status, KPI mana ia patut gerakkan.

Cawangan dan perkhidmatan masuk sebagai fakta sokongan yang dirujuk, bukan sistem utama.

**Selepas itu baru Notion** — dan Notion ialah **paparan (view)**, bukan source of truth. Source of truth kekal di pangkalannya. Kalau Notion jadi sumber kedua, kau akan ada dua cerita berbeza dan tak tahu mana betul.

**Status jadual-jadual ni: cadangan (Contoh).** Tiada database dicipta dalam mana-mana sesi yang menyusun nota ini. Di bawah ni satu baris **ilustrasi rekaan** untuk tunjuk bentuk jadual — angka dan tarikh semuanya rekaan, tiada klien sebenar:

| Field | Contoh nilai (rekaan) |
|---|---|
| kpi_key | `booked_appointments` |
| unit | count |
| cohort_start | 2026-09-01 |
| cohort_end | 2026-09-30 |
| window_days | 30 |
| value | 12 |
| source_id | src_ads_report_monthly |
| as_of | 2026-10-05 |
| owner | ops_team |
| definition_version | v1 |
| idempotency_key | `booked_appointments\|2026-09-01\|2026-09-30\|30\|v1` |

**Idempotency key**: gabungan field yang buat baris tu unik. Guna dia supaya sync dua kali tidak menghasilkan dua baris.

**Sync yang selamat:** staging dulu → **dry-run dan read-back** (tunjuk semula apa yang akan ditulis, untuk kelulusan) → baru tulis. Kalau ada **konflik** (baris sama diubah di dua tempat), berhenti dan tanya, jangan menang-menang sendiri.

**Tiada sync dua hala automatik.** Ini disengajakan: dua hala automatik cipta konflik senyap, dan tiada satu pun pihak tahu siapa menang. Jadi jangan bina papan kedua yang boleh bercanggah dengan ledger kerja sedia ada.

**Sign-off untuk tulis:** tulis hanya bila user kata ya secara eksplisit, dan hanya untuk scope yang dia sebut. Kalau tidak, kekal di peringkat cadangan.

**Batasan:**
- Tiada data pesakit. Tiada data pelanggan tanpa izin. Tiada claim tanpa sumber.
- Tiada automated two-way sync (keputusan sedar).
- Tiada connector dipasang; langkah sync kekal cadangan.
- Tiada penjanaan berbayar.

### Prompt boleh salin (perancangan strategik)

**Nota penting:** prompt-prompt ni **kerja data**, bukan kerja visual. Ia **tidak** memerlukan surface creative (website/app/poster/static-ad/video-ad) dan tidak patut dipaksa masuk acceptance lima surface tu. Acceptance dia di bawah, spesifik kepada kerja data.

**Prompt S1 — Inventori (jangan sentuh apa-apa, jangan reka apa-apa):**

```
CONTEXT: Kerja perancangan ukuran untuk satu klinik. Sumber data yang mungkin ada: laporan
iklan, buku janji temu, senarai pertanyaan masuk, nota jejak manual. Tiada satu pun disahkan;
yang kau senaraikan mesti datang dari apa yang aku bagi, bukan andaian.

TASK: Senaraikan inventori data. Untuk setiap sumber: nama, apa field yang ada, di mana ia
tinggal sekarang, siapa owner, tarikh as-of terakhir, dan tahap kebolehpercayaan.
Tandakan jelas setiap yang belum disahkan.

NON-GOALS: Jangan cadang dashboard. Jangan cadang tool. Jangan reka nama table. Jangan
 anggar angka apa-apa.

FACTS & CONSTRAINTS: Kalau sesuatu tiada, tulis "tiada data" atau "belum disahkan". Jangan
isi kosong dengan andaian.

ACCEPTANCE: Setiap baris inventori boleh dijejak ke sumber yang aku sebut atau ditanda
"belum disahkan". Zero angka rekaan.

DELIVERABLE: Satu jadual teks. Tiada karangan.
```

**Prompt S2 — Cadang satu priority dan definisi KPI:**

```
CONTEXT: [tampal inventori dari S1]

TASK: Cadang SATU soalan bisnes yang paling berbaloi dijawab dulu, dan definisikan KPI
yang perlu untuk jawab dia. Turutan funnel: spend -> lead -> qualified -> booked -> attended.

NON-GOALS: Jangan bagi senarai sepuluh KPI. Jangan cadang integrasi. Jangan tulis definisi
yang aku tak boleh sahkan.

FACTS & CONSTRAINTS: Setiap definisi mesti ada unit, tempoh/cohort, window, sumber, dan
owner. Kalau kos tiada, tulis "denominator unavailable", JANGAN tulis 0. Cohort mesti sama
merentas semua peringkat funnel. Kena ada dedupe (orang sama tanya dua kali = satu lead).

ACCEPTANCE: Aku boleh jawab soalan tu dengan nombor yang definisi dia dah disetujui.
Kalau ada peringkat funnel tanpa sumber, tulis "belum boleh dijawab" dan berhenti di situ.

DELIVERABLE: Satu soalan bisnes ayat tunggal + satu jadual definisi KPI.
```

**Prompt S3 — Draf skema Notion/CSV (cadangan sahaja):**

```
CONTEXT: [tampal definisi dari S2]

TASK: Draf skema untuk empat database sebagai CADANGAN: Source register, KPI observations,
Decisions, Initiatives. Untuk KPI observations, bagi satu baris contoh rekaan yang
menunjukkan bentuk field termasuk idempotency_key.

NON-GOALS: Jangan cipta apa-apa database. Jangan sambung ke mana-mana API. Jangan hantar
data keluar. Jangan andaikan Notion ialah source of truth.

FACTS & CONSTRAINTS: Notion = paparan sahaja; source of truth kekal di pangkalannya. Tiada
sync dua hala automatik. Baris contoh mesti dilabel "rekaan" dan tiada angka klien sebenar.

ACCEPTANCE: Aku boleh baca skema tu dan tahu field mana yang buat satu baris unik. Tiada
dakwaan bahawa apa-apa telah dicipta.

DELIVERABLE: Skema teks + contoh CSV satu baris untuk KPI observations.
```

**Prompt S4 — Tulis terkawal (HANYA selepas kelulusan user, dan hanya scope yang dia sebut):**

```
CONTEXT: User dah lulus skema dari S3 secara eksplisit. Scope kelulusan: [sebut dengan
tepat database dan bilangan baris].

TASK: Jalankan DRY-RUN dahulu: tunjuk tepat apa yang akan ditulis, baris demi baris,
dengan idempotency_key setiap satu. Berhenti dan tunggu. Jangan tulis apa-apa lagi.

NON-GOALS: Jangan tulis sebelum aku kata go. Jangan tulis di luar scope yang disebut.
Jangan over-write baris yang dah berubah. Jangan setup sync dua hala.

FACTS & CONSTRAINTS: Idempotency key wajib. Kalau ada konflik (baris sama dah berubah di
tempat lain), BERHENTI dan lapor, jangan menang-menang sendiri. Kalau connector belum
dipasang, berhenti di peringkat dry-run dan cakap begitu.

ACCEPTANCE: Dry-run boleh dibaca dan aku boleh sahkan setiap baris. Selepas tulis, ada
read-back menunjukkan hasil sebenar. Kalau ada satu baris tak sepadan, ia gagal.

DELIVERABLE: Dry-run listing, kemudian (selepas go) ringkasan read-back.
```

**Bila berhenti:** cukup bila satu keputusan sebenar boleh dijawab. Dashboard yang sempurna **bukan** prasyarat.

## 7. Contoh aliran: lead generation (KDH — klinik/dental)

Ini aliran untuk Kuisytihar Digital Hub: kerja lead gen untuk **klinik/dental**. **Free funnel review** ialah offer yang **user dah pilih sendiri** — bukan offer baru yang direka dalam nota ini. Laman yang dah ada dalam repo: `consulting.html` dan halaman booking `/book/`.

**Yang belum disahkan:** tindakan hubang/booking dari `/book/` **belum diuji**. Jangan tulis "booking berfungsi". Ia boleh disebut sebagai laluan yang wujud dalam repo, bukan laluan yang sudah disahkan menerima submission.

**Tiada outreach sebenar dijalankan.** Tiada campaign. Tiada blasting. Semua di bawah ini rancangan.

Empat peringkat:

1. **Offer, audiens, bukti.** Satu audiens utama (klinik/dental dengan funnel lemah). Offer jujur: free funnel review. Bukti dari sumber. Kalau tiada bukti, tulis **tiada bukti**. Jangan reka testimoni, angka atau logo.
2. **Laman dan cara hubungi.** Satu tindakan utama per halaman, dan laluan hubung yang **benar-benar dipantau**. Emel ialah laluan yang disahkan cukup untuk dikira hidup. Laluan `/book/` wujud dalam repo, tapi submission belum diuji — jadi jangan bergantung pada dia sebagai bukti. Kalau saluran belum disediakan, **gate pertama belum lulus**.
3. **Kualifikasi dan follow-up.** Satu opener spesifik yang merujuk dari mana lead datang, satu atau dua soalan kualifikasi sebelum pitch, kemudian jadual follow-up pendek dengan konteks baru setiap kali.
4. **Ukur dan belajar.** Funnel yang diukur: **conversation → review → proposal → won**. Rekod berapa yang masuk peringkat pertama, berapa yang sampai review, berapa yang jadi proposal, berapa menang. Bandingkan **satu perubahan pada satu masa**, simpan pembelajaran sebagai satu entri.

**Batch kecil dan manual.** Outreach dibuat dengan tangan, satu per satu, mesej diperibadikan dan benar tentang orang/bisnes tu. Tiada scraping massal, tiada spam. Qualification sebelum pitch. Follow-up hormat: ada laluan berhenti (consent/stop), dan bila orang cakap berhenti, berhenti.

**Stop gate sebelum tambah apa-apa:** satu offer, satu halaman, satu laluan hubung, satu orang yang bertanggungjawab track nombor. Kalau mana-mana satu belum ada, jangan bina CRM, jangan bina automation. CRM sebelum ada lead pertama = overbuild.

### Prompt boleh salin (lead gen KDH)

**Prompt L1 — Offer dan bukti, tanpa reka:**

```
CONTEXT: Kuisytihar Digital Hub. Kerja lead gen untuk klinik/dental. Offer yang user dah
pilih: free funnel review. Laman dalam repo: consulting.html dan /book/. JANGAN cipta offer
baru. JANGAN tulis harga.

TASK: Tulis satu offer statement ayat tunggal untuk audiens klinik/dental, dan senaraikan
bukti yang kita ada sekarang.

NON-GOALS: Jangan reka testimoni, logo klien, angka, certification atau outcome. Jangan
cetuskan offer percuma yang baru selain yang dah dipilih.

FACTS & CONSTRAINTS: Kalau tiada bukti untuk sesuatu claim, tulis "tiada bukti". Jangan
tulis booking submission dah diuji; ia belum.

ACCEPTANCE: Setiap ayat dalam offer boleh dibacking oleh sesuatu yang wujud atau jelas
dilabel sebagai belum ada. Zero dakwaan rekaan.

DELIVERABLE: Satu offer statement + jadual bukti/tiada bukti.
```

**Prompt L2 — Audit laman yang dah ada (audit, BUKAN rebuild):**

```
CONTEXT: consulting.html dan halaman /book/ dah ada dalam repo. Kerja ini audit, bukan reka
semula.

TASK: Bagi satu senarai perubahan minimum supaya satu tindakan utama jelas per halaman.

NON-GOALS: Jangan reka semula laman. Jangan tambah teknologi, dependency atau section baru.
Jangan sentuh identiti design yang ada. Jangan ambil screenshot atau ukur apa-apa tanpa
kebenaran.

FACTS & CONSTRAINTS: Jangan dakwa apa-apa telah diuji. Laluan hubung yang disahkan hanya
emel; /book/ wujud tapi submission belum diuji.

ACCEPTANCE: Setiap cadangan ialah perubahan kecil yang boleh disemak satu-satu, dan tak
pecahkan laman semasa.

DELIVERABLE: Senarai bertulis, satu baris satu cadangan.
```

**Prompt L3 — Draf prospek dan outreach, tanpa research rekaan:**

```
CONTEXT: Sasaran: klinik/dental. Batch kecil, manual, satu-satu.

TASK: Bagi struktur mesej outreach: opener spesifik yang merujuk dari mana kami jumpa dia,
satu atau dua soalan kualifikasi, dan ayat berhenti. Bagi juga medan yang aku kena isi
sendiri dengan harfiah.

NON-GOALS: Jangan reka nama bisnes, alamat, angka atau "research" yang aku tak bagi. Jangan
tulis mesej siap hantar. Jangan cadang automasi blasting.

FACTS & CONSTRAINTS: Tiada scraping massal. Tiada spam. Personalized dan benar. Follow-up
kena ada laluan stop. Aku yang hantar, bukan sistem.

ACCEPTANCE: Kalau aku isi medan tu dengan fakta sebenar, mesej jadi benar. Tiada fakta
fantasi dalam draf.

DELIVERABLE: Template dengan medan kosong, bukan mesej siap.
```

**Prompt L4 — Penambahbaikan mingguan, satu variable sahaja:**

```
CONTEXT: [tampal nombor funnel minggu ni: conversation -> review -> proposal -> won]

TASK: Kenal pasti SATU variable untuk ubah minggu depan, dan nyatakan cara ukur kesannya.

NON-GOALS: Jangan ubah tiga benda serentak. Jangan tambah tool atau CRM. Jangan cadang
A/B test formal sebelum cukup volume.

FACTS & CONSTRAINTS: Tiada angka sebenar dalam contoh. Kalau volume terlalu kecil untuk
kesimpulan, cakap begitu.

ACCEPTANCE: Aku boleh tahu dalam seminggu sama ada variable tu bergerak atau tidak.

DELIVERABLE: Satu variable + satu ukuran + satu tarikh semak.
```

**Stop gate lead gen:** satu offer / satu halaman / satu laluan hubung / satu tracking owner. Semua ada = boleh mula hantar. Mana-mana tiada = berhenti di situ.

## 8. Gerbang, anti-overbuild dan bajet

Senarai gerbang sebelum deploy:

- Laman boleh dimuatkan dan tindakan utama berfungsi.
- Boleh dibaca pada telefon tanpa scroll mendatar.
- Fakta betul dan tiada dakwaan tanpa sumber.
- Tiada regresi berbanding versi langsung.
- Ada **satu manusia** yang telah melihat hasilnya pada skrin sebenar.

**Gerbang yang bergantung pada kelulusan orang lain** (privasi, konteks kesihatan) mesti **tersekat** sehingga kelulusan itu ada. Deploy tanpa kelulusan bukan keputusan kreatif; itu pelanggaran.

**Noindex bukan access control.** Menyembunyikan dari crawler tidak melindungi apa-apa. Kalau data sensitif, jangan letak di halaman web, penuh stop.

**Bajet:** tiada penjanaan berbayar tanpa model, jumlah, output, anggaran kos, ceiling dan had cubaan semula yang diketahui. Eksperimen berbayar kecil dan berperingkat, hanya dengan kelulusan jelas untuk jumlah dan tempoh. **Subscription tidak membuktikan tool itu percuma.** Kos yang belum diketahui maksudnya **berhenti**, bukan cuba dan lihat.

**Anonymization awam:** nama klien tidak masuk ke halaman awam dan tidak masuk ke prompt yang dijana. Dalam contoh, guna perihalan generik sahaja ("klinik/dental").

## 9. Apa yang belum ada / belum disahkan

Semua item di bawah adalah status setakat 18 Oktober 2026. Kalau kerja baru dijalankan, tukar baris ni dengan tarikh dan scope, jangan tulis semula sebagai dakwaan umum.

- Tiada connector dipasang. Sync ke papan pemantauan **masih cadangan**.
- Tiada scheduler atau cron baru diaktifkan. Loop jalan **on-demand** (manual).
- Tiada database atau jadual Notion dicipta. Empat jadual dalam bahagian 6 adalah **cadangan**.
- Tindakan hubang `/book/` **belum diuji**. Laman wujud dalam repo.
- Tiada outreach, tiada campaign, tiada lead sebenar dijana.
- Tiada penjanaan aset berbayar dibuat. Tiada tool penjanaan visual dipasang.
- Kos langganan dan API yang terlibat **belum disahkan** di nota ini. Tiada dakwaan harga.
- Kelas model dalam nota ini ialah **cadangan routing**. Sesi yang menyusun nota ini tiada pemilih model, jadi tiada dakwaan mana-mana kelas benar-benar dipakai.
- Kalibrasi visual (screenshot review, penilaian design secara visual) dijalankan dalam invocation berasingan, bukan dalam sesi penulisan nota ini.

**Status dokumen:** ini draf penjelasan, bukan bukti akhir. Ia bukan laporan ujian dan tidak mengandungi hasil ujian baru.