/* style.css is imported first on purpose. CSS layer order is fixed by the
   first declaration of each layer name, so pulling the shared sheet in here
   means the sh-* layers are always declared after reset/base/components/
   responsive no matter which module the browser evaluates first. It is the
   same module main.js imports, so it is still fetched once. */
import './style.css';
import './start-here.css';

/* Start Here guide behaviour. Page-scoped: this file is only imported by
   start-here.html, so nothing here runs on the other pages.

   Three things live here, and each one degrades to plain HTML on its own:
   1. Reading depth (Penuh / Ringkas).
   2. The loop diagram: play/pause, stage stepping, live status.
   3. The two tools: prompt builder and the pre-deploy checklist.

   Nothing in this file is the only copy of any guidance. Every gate, prompt
   block and prompt example also exists as text in the page itself, which is
   why the controls that need scripting start hidden and reveal themselves
   here (the .sh-js flag below) rather than the other way round. */

// Controls are gated on this flag in CSS. Setting it here means the reveal
// only happens once this module has actually run.
document.documentElement.classList.add('sh-js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------------------------------------------------------------- depth -- */

const modeRadios = document.querySelectorAll('input[name="guide-mode"]');
const MODE_KEY = 'kuisytihar-guide-mode';

function applyMode(mode) {
  // "ringkas" hides the technical-depth section. Anything else shows the full
  // guide, which is also what a reader without JavaScript gets.
  if (mode === 'ringkas') {
    document.body.dataset.guideMode = 'ringkas';
  } else {
    delete document.body.dataset.guideMode;
  }
}

if (modeRadios.length) {
  let stored = null;
  try {
    stored = window.localStorage.getItem(MODE_KEY);
  } catch (error) {
    // Private mode or storage disabled: the switch still works for this visit.
    stored = null;
  }

  if (stored === 'ringkas' || stored === 'penuh') {
    modeRadios.forEach((radio) => {
      radio.checked = radio.value === stored;
    });
    applyMode(stored);
  }

  modeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      applyMode(radio.value);
      try {
        window.localStorage.setItem(MODE_KEY, radio.value);
      } catch (error) {
        // Not worth interrupting the reader over.
      }
    });
  });
}

/* ----------------------------------------------------------- loop diagram -- */

const loop = document.querySelector('.sh-loop');

if (loop) {
  const STAGES = [
    { name: 'Context', note: 'apa yang sudah diketahui' },
    { name: 'Skill', note: 'prosedur ikut medium' },
    { name: 'Output', note: 'artifact versi sebenar' },
    { name: 'Review', note: 'keputusan dan bukti' },
  ];
  const STAGE_MS = 3000;

  const playButton = loop.querySelector('.sh-loop-play');
  const stepButtons = [...loop.querySelectorAll('[data-loop-step]')];
  const status = loop.querySelector('.sh-loop-status');

  let current = 1;
  let timer = null;
  // Tracks whether the loop has ever been played, so the first status line
  // does not tell a reader who has not pressed anything that it has stopped.
  let started = false;

  function say(text) {
    if (status) status.textContent = text;
  }

  function renderStep() {
    loop.dataset.step = String(current);
    stepButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.loopStep) === current));
    });
  }

  function isPlaying() {
    return loop.classList.contains('is-playing');
  }

  function stop() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    loop.classList.remove('is-playing');
    if (playButton) {
      playButton.setAttribute('aria-pressed', 'false');
      playButton.textContent = 'Main gelung';
    }
  }

  function announce() {
    const stage = STAGES[current - 1];
    const prefix = isPlaying() ? 'Gelung berjalan. ' : started ? 'Berhenti. ' : '';
    say(`${prefix}Peringkat ${current}: ${stage.name}, ${stage.note}.`);
  }

  function goTo(step, { fromPlayback = false } = {}) {
    current = step;
    renderStep();
    if (!fromPlayback && isPlaying()) {
      // Stepping while it runs is also how a reader pauses it.
      started = true;
      stop();
    }
    announce();
  }

  function advance() {
    current = current === STAGES.length ? 1 : current + 1;
    renderStep();
    announce();
  }

  function play() {
    // Reduced motion is handled in CSS, but a paused-forever button would be
    // worse than no button, so the control is not wired up at all here.
    if (reduceMotion.matches) return;
    started = true;
    loop.classList.add('is-playing');
    if (playButton) {
      playButton.setAttribute('aria-pressed', 'true');
      playButton.textContent = 'Henti gelung';
    }
    announce();
    timer = window.setInterval(advance, STAGE_MS);
  }

  if (playButton) {
    playButton.addEventListener('click', () => {
      if (isPlaying()) {
        stop();
        announce();
      } else {
        play();
      }
    });
  }

  stepButtons.forEach((button) => {
    button.addEventListener('click', () => goTo(Number(button.dataset.loopStep)));
  });

  // Losing the tab should not leave an animation running unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying()) {
      stop();
      announce();
    }
  });

  // A reader can turn reduced motion on while the page is open. When that
  // happens the running animation must stop, otherwise the setting the
  // diagram claims to honour is being ignored. Older Safari only has the
  // deprecated addListener, so both are tried.
  const onMotionChange = (event) => {
    if (event.matches && isPlaying()) {
      stop();
      announce();
    }
  };
  if (typeof reduceMotion.addEventListener === 'function') {
    reduceMotion.addEventListener('change', onMotionChange);
  } else if (typeof reduceMotion.addListener === 'function') {
    reduceMotion.addListener(onMotionChange);
  }

  renderStep();
  announce();
}

/* --------------------------------------------------------------- shared -- */

function setFeedback(node, text, tone) {
  if (!node) return;
  node.textContent = text;
  node.classList.toggle('is-ok', tone === 'ok');
  node.classList.toggle('is-warn', tone === 'warn');
}

/* Copy with an honest fallback. The clipboard API is unavailable on
   insecure origins and can be rejected by permissions, so a failure there
   selects the text instead of pretending the copy worked. */
function copyFrom(targetId, label) {
  const source = document.getElementById(targetId);
  if (!source) return { ok: false, message: 'Tiada teks untuk disalin.' };

  const text = 'value' in source ? source.value : source.textContent;
  if (!text || !text.trim()) {
    return { ok: false, message: 'Tiada teks untuk disalin lagi.' };
  }

  const selectText = () => {
    source.focus();
    if (typeof source.select === 'function') source.select();
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => ({ ok: true, message: `${label}: teks sudah masuk clipboard.` }))
      .catch(() => {
        selectText();
        return { ok: false, message: `Clipboard ditolak browser. Teks sudah dipilih, tekan Ctrl atau Cmd + C.` };
      });
  }

  selectText();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (error) {
    copied = false;
  }
  return Promise.resolve(
    copied
      ? { ok: true, message: `${label}: teks sudah masuk clipboard.` }
      : { ok: false, message: 'Browser ni tak benarkan salin automatik. Teks sudah dipilih, tekan Ctrl atau Cmd + C.' },
  );
}

/* -------------------------------------------------------- prompt builder -- */

// Acceptance and non-goals are taken from the surface profiles, so a
// generated prompt carries the same review criteria the work will be judged
// against. Wording is condensed, not invented.
const SURFACES = {
  website: {
    acceptance: [
      'desktop dan telefon benar-benar diperiksa, bukan screenshot',
      'pautan, keyboard, fokus dan laluan ralat diuji',
      'tiada overflow mendatar, kontras dan kebolehbacaan disemak',
      'motion menerangkan kerja tanpa menyekat tindakan utama',
    ],
    avoid: 'jangan guna komponen yang sama untuk setiap section, dan jangan tukar palette brand untuk betulkan masalah komposisi',
    deliverable: 'satu fail HTML, satu fail CSS, satu fail JS',
  },
  app: {
    acceptance: [
      'tugasan utama selesai dalam app yang benar-benar berjalan',
      'transisi state dan laluan pemulihan diperiksa',
      'density pada skrin kecil dan fokus keyboard disemak',
      'tiada metrik rekaan dan tiada data langsung yang palsu',
    ],
    avoid: 'jangan jadikan hero salespage sebagai dashboard, dan jangan berhenti pada state cantik tanpa laluan pemulihan',
    deliverable: 'satu app yang boleh dijalankan, dengan state transitions yang boleh dilihat',
  },
  poster: {
    acceptance: [
      'export sebenar diperiksa pada saiz sasaran',
      'hierarki, ketepatan teks dan crop disemak',
      'kontras dan hak penggunaan imej disahkan',
      'syarat bleed, resolusi dan warna disemak kalau ia untuk cetak',
    ],
    avoid: 'jangan susun section website atas poster, dan jangan terima teks hasil model tanpa proofread',
    deliverable: 'satu fail export pada saiz sasaran',
  },
  'static-ad': {
    acceptance: [
      'output pada saiz placement sebenar dan crop-nya diperiksa',
      'hook dan CTA boleh dibaca tanpa zoom',
      'bukti, dakwaan dan fidelity produk disemak',
      'tiada testimoni, hasil atau data pesakit yang direka',
    ],
    avoid: 'jangan anggap kelulusan estetik sebagai bukti conversion, dan jangan guna layout website sebagai setiap iklan',
    deliverable: 'satu brief iklan: hook, arah visual, satu CTA dan satu saiz placement',
  },
  'video-ad': {
    acceptance: [
      'video yang dirender ditonton habis dengan bunyi',
      'continuity frame, identiti subjek dan timing disemak',
      'caption dan safe area disemak pada saiz sasaran',
      'audio sync, hak penggunaan, CTA dan bukti dakwaan disemak',
    ],
    avoid: 'jangan panggil storyboard sebagai video siap, dan jangan luluskan still frame tanpa mainkan motion',
    deliverable: 'satu brief video: hook, beat atau shot, audio plan dan satu storyboard',
  },
};

const PROJECTS = {
  umum: {
    context: [
      'baca entry point sistem, safety dan konteks brand yang berkaitan',
      'satu surface per sesi, jangan campur dua medium dalam satu brief',
    ],
    task: 'buat kerja yang diminta pada satu surface, kemudian berhenti untuk review',
  },
  strategik: {
    context: [
      'baca fail fakta sumber untuk projek ini',
      'ini contoh perancangan strategik dengan data yang sudah disanitasi: tiada data pesakit, tiada data pelanggan sebenar',
    ],
    task: 'susun satu rantaian perancangan: inventori data, soalan dan definisi KPI, provenance setiap fakta, kemudian barulah struktur simpanan',
  },
  leadgen: {
    context: [
      'baca prosedur creative director dan brand lock yang berkaitan',
      'ini contoh aliran lead generation: tiada campaign dijalankan dan tiada saluran baharu disambung',
    ],
    task: 'susun satu aliran akuisisi lengkap pada kertas: offer dan audiens, cara hubungi, kualifikasi dan follow-up, kemudian cara ukur',
  },
};

const CONSTRAINTS = [
  'satu operator, pasaran Malaysia, tiada angka prestasi yang boleh didakwa tanpa sumber',
  'kalau tiada bukti, tulis "tiada bukti lagi", jangan reka testimoni, angka atau logo',
  'tiada publish, tiada auto-spend, tiada upload data pelanggan',
  'tiada penjanaan berbayar tanpa kelulusan kos; kalau kos belum diketahui, berhenti',
];

const promptForm = document.querySelector('.sh-prompt-form');

if (promptForm) {
  const projectField = promptForm.querySelector('#sh-project');
  const surfaceField = promptForm.querySelector('#sh-surface');
  const outcomeField = promptForm.querySelector('#sh-outcome');
  const nongoalsField = promptForm.querySelector('#sh-nongoals');
  const acceptanceField = promptForm.querySelector('#sh-acceptance');
  const output = promptForm.querySelector('#sh-prompt-out');
  const feedback = document.querySelector('[data-feedback-for="prompt"]');

  const OPEN = '[isi sendiri: ';
  const CLOSE = ']';

  function line(label, values) {
    const body = values.filter(Boolean);
    return body.length === 1 ? `${label}: ${body[0]}` : `${label}:\n  - ${body.join('\n  - ')}`;
  }

  function optional(value, what) {
    return value && value.trim() ? value.trim() : `${OPEN}${what}${CLOSE}`;
  }

  function build() {
    const project = PROJECTS[projectField.value] || PROJECTS.umum;
    const surface = SURFACES[surfaceField.value] || SURFACES.website;
    const surfaceName = surfaceField.value;

    const acceptance = [optional(acceptanceField.value, 'cara kita tahu ia siap'), ...surface.acceptance];
    const nongoals = [optional(nongoalsField.value, 'apa yang tidak boleh disentuh'), surface.avoid, 'jangan sentuh fail atau halaman yang tiada kaitan dengan kerja ini'];

    const blocks = [
      line('Context', project.context),
      `Surface: ${surfaceName}`,
      line('Task', [optional(outcomeField.value, 'outcome yang kau mahu'), project.task]),
      line('Non-goals', nongoals),
      line('Facts dan constraints', CONSTRAINTS),
      line('Acceptance', acceptance),
      `Deliverable: ${surface.deliverable}`,
      'Nota: ini brief kaedah. Sebelum apa-apa dihantar keluar atau dibayar, ia balik kepada saya untuk kelulusan.',
    ];

    return blocks.join('\n\n');
  }

  function missingCount() {
    return [outcomeField, nongoalsField, acceptanceField].filter((field) => !field.value.trim()).length;
  }

  promptForm.addEventListener('submit', (event) => {
    event.preventDefault();
    output.value = build();
    const missing = missingCount();
    if (missing === 0) {
      setFeedback(feedback, 'Prompt dijana daripada enam blok. Semak sekali, kemudian salin.', 'ok');
    } else {
      setFeedback(
        feedback,
        `Prompt dijana, tetapi ${missing} ruang masih kosong dan ditanda dalam prompt. Isi ruang itu kalau kau mahu ia khusus.`,
        'warn',
      );
    }
  });

  promptForm.addEventListener('input', (event) => {
    if (event.target === output) return;
    if (output.value) {
      setFeedback(feedback, 'Ada perubahan pada ruang di atas. Jana semula untuk kemas kini prompt.', 'warn');
    }
  });
}

document.querySelectorAll('[data-copy-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const label = button.dataset.copyLabel || 'Salin';
    const feedback = document.querySelector(`[data-feedback-for="${button.dataset.feedbackFor || 'prompt'}"]`);
    const result = copyFrom(button.dataset.copyTarget, label);
    Promise.resolve(result).then(({ ok, message }) => {
      setFeedback(feedback, message, ok ? 'ok' : 'warn');
    });
  });
});

/* ------------------------------------------------------------- checklist -- */

const gateForm = document.querySelector('.sh-gate-form');

if (gateForm) {
  const gates = [...gateForm.querySelectorAll('input[data-gate]')];
  const critical = gates.filter((gate) => gate.dataset.gate === 'critical');
  const optional = gates.filter((gate) => gate.dataset.gate === 'optional');
  const sensitive = gateForm.querySelector('#sh-gate-sensitive');
  const approval = gateForm.querySelector('#sh-gate-approval');
  const approvalRow = gateForm.querySelector('[data-gate-row="approval"]');
  const approvalNote = gateForm.querySelector('[data-gate-note="approval"]');
  const resetButton = gateForm.querySelector('[data-gate-reset]');

  const statusBox = document.querySelector('.sh-status');
  const statusTag = document.querySelector('[data-gate-tag]');
  const statusMessage = document.querySelector('[data-gate-message]');
  const statusList = document.querySelector('[data-gate-list]');

  const APPROVAL_ON = 'Konteks ini perlukan kelulusan bertulis. Status kekal tersekat sehingga gate ini ditanda.';
  const APPROVAL_OFF = 'Gate ini hanya terpakai bila kotak konteks di atas ditanda.';

  function update() {
    const relevant = Boolean(sensitive && sensitive.checked);

    if (approval) {
      approval.disabled = !relevant;
      if (!relevant) approval.checked = false;
    }
    if (approvalRow) approvalRow.classList.toggle('sh-gate-row-off', !relevant);
    if (approvalNote) approvalNote.textContent = relevant ? APPROVAL_ON : APPROVAL_OFF;

    const done = critical.filter((gate) => gate.checked);
    const missing = critical.filter((gate) => !gate.checked);
    const blocked = relevant && approval && !approval.checked;
    const ready = !blocked && missing.length === 0;
    const optionalDone = optional.filter((gate) => gate.checked).length;

    statusBox.classList.toggle('is-ready', ready);
    statusBox.classList.toggle('is-blocked', blocked);

    if (statusTag) {
      statusTag.textContent = blocked ? 'Tersekat' : ready ? 'Sedia untuk semakan manusia' : 'Belum sedia';
    }

    const parts = [];
    if (blocked) {
      const approvalMissing = Boolean(approval && !approval.checked);
      const reasons = [];
      if (missing.length) reasons.push(`${missing.length} gate kritikal belum ditanda`);
      if (approvalMissing) reasons.push('kelulusan privasi atau kesihatan belum ada secara bertulis');
      parts.push(
        `Tersekat: ${reasons.join(' dan ')}. Kerja berhenti di sini. Deploy tanpa kelulusan bukan keputusan kreatif, ia pelanggaran.`,
      );
    } else if (ready) {
      parts.push(`Semua ${critical.length} gate kritikal sudah lulus. Langkah seterusnya ialah semakan manusia pada skrin sebenar, bukan deploy automatik.`);
    } else {
      parts.push(`${missing.length} daripada ${critical.length} gate kritikal belum ditanda.`);
    }
    if (optional.length) {
      parts.push(`${optionalDone} daripada ${optional.length} gate pilihan ditanda. Gate pilihan tidak menaikkan status ini.`);
    }
    if (statusMessage) statusMessage.textContent = parts.join(' ');

    if (statusList) {
      statusList.textContent = '';
      const outstanding = blocked && approval ? [...missing, approval] : missing;
      outstanding.forEach((gate) => {
        const text = gate.closest('.sh-gate-label').querySelector('span').textContent.trim();
        const item = document.createElement('li');
        item.textContent = text;
        statusList.append(item);
      });
    }
  }

  gates.forEach((gate) => gate.addEventListener('change', update));

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      gates.forEach((gate) => {
        gate.checked = false;
      });
      update();
    });
  }

  update();
}
