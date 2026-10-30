/* =========================================================
   CV Studio — lógica da aplicação
   ========================================================= */
(() => {
  'use strict';

  const STORAGE_KEY = 'cvstudio:v1';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const has = (v) => typeof v === 'string' ? v.trim().length > 0 : !!v;

  // ---------- Modelo -------------------------------------------------------
  const EMPTY_ITEMS = {
    experiencias: () => ({ empresa: '', cargo: '', periodo: '', atual: false, funcoes: '' }),
    formacoes: () => ({ curso: '', instituicao: '', status: '' }),
    cursos: () => ({ nome: '', instituicao: '', data: '' }),
    idiomas: () => ({ idioma: '', nivel: '' }),
    voluntarios: () => ({ titulo: '', data: '', tarefas: '' }),
  };
  const LIST_EMPTY_MSG = {
    experiencias: 'Nenhuma experiência adicionada ainda.',
    formacoes: 'Nenhuma formação adicionada ainda.',
    cursos: 'Nenhuma atividade adicionada ainda.',
    idiomas: 'Nenhum idioma adicionado.',
    voluntarios: 'Nenhum trabalho voluntário adicionado.',
  };

  const blankState = () => ({
    nome: '', idade: '', telefone: '', email: '', endereco: '', cep: '', linkedin: '',
    objetivo: '',
    experiencias: [EMPTY_ITEMS.experiencias()],
    formacoes: [EMPTY_ITEMS.formacoes()],
    cursos: [], habilidades: [], idiomas: [], voluntarios: [],
  });

  const EXAMPLE = {
    nome: 'Lucas Silva Pereira',
    idade: '23',
    telefone: '(11) 98765-4321',
    email: 'lucas.silva.exemplo@email.com',
    endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    cep: '01310-100',
    linkedin: 'linkedin.com/in/lucas-silva-exemplo',
    objetivo: 'Estágio em Tecnologia da Informação | Suporte Técnico | T.I',
    experiencias: [
      {
        empresa: 'TechSoluções Serviços Digitais',
        cargo: 'Assistente de Suporte de T.I',
        periodo: '',
        atual: true,
        funcoes: 'Atendimento e suporte técnico de primeiro nível aos colaboradores internos e clientes externos (chat e chamados), manutenção preventiva e corretiva de computadores e periféricos, auxílio na configuração de redes locais e controle de inventário de equipamentos.'
      },
      {
        empresa: 'Conecta Contact Center',
        cargo: 'Atendente de Relacionamento',
        periodo: '1 ano e 3 meses',
        atual: false,
        funcoes: 'Atendimento multicanal (telefone, e-mail e WhatsApp), esclarecimento de dúvidas e registro de solicitações em sistema CRM, preenchimento de planilhas de controle e acompanhamento de indicadores de qualidade e satisfação do cliente.'
      },
    ],
    formacoes: [
      {
        curso: 'Análise e Desenvolvimento de Sistemas',
        instituicao: 'Faculdade de Tecnologia de São Paulo (FATEC)',
        status: 'Cursando 4° Semestre'
      }
    ],
    cursos: [
      { nome: 'Pacote Office e Produtividade', instituicao: 'Fundação Bradesco', data: '08.2023' },
      { nome: 'Fundamentos de Redes de Computadores', instituicao: 'SENAI', data: '12.2023' },
      { nome: 'Comunicação Assertiva e Atendimento ao Cliente', instituicao: 'SEBRAE', data: '04.2024' },
    ],
    habilidades: ['Raciocínio lógico', 'Comunicação', 'Proatividade', 'Resolução de problemas', 'Trabalho em equipe'],
    idiomas: [
      { idioma: 'Inglês', nivel: 'Intermediário' }
    ],
    voluntarios: [
      {
        titulo: 'Ação Comunitária e Apoio Social',
        data: '10/2024',
        tarefas: 'Organização e entrega de cestas básicas e agasalhos para famílias em situação de vulnerabilidade, apoio na triagem de doações e logística de distribuição local.'
      }
    ],
  };

  const OBJ_SUGESTOES = [
    'Estágio em Informática | Suporte Técnico | T.I', 'Estágio em Administração', 'Jovem Aprendiz',
    'Assistente Administrativo', 'Atendimento ao Cliente', 'Auxiliar de Logística',
    'Analista de Dados Júnior', 'Desenvolvedor Front-end Júnior',
  ];
  const SKILL_SUGESTOES = [
    'Raciocínio lógico', 'Comunicação', 'Proatividade', 'Agilidade', 'Trabalho em equipe', 'Pacote Office',
    'Excel avançado', 'Organização', 'Resolução de problemas', 'Liderança', 'Atendimento ao cliente',
    'Criatividade', 'Pontualidade', 'Inglês técnico',
  ];

  const ICONS = {
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    cap: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/>',
    spark: '<path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    up: '<path d="M18 15l-6-6-6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  };
  const svg = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

  // Seção da prévia correspondente a cada etapa
  const STEP_SECTION = ['dados', 'objetivo', 'experiencias', 'formacoes', 'cursos', 'habilidades', 'voluntarios', null];

  let state = load();
  let current = 0;

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object') {
        // Se continha o exemplo de demonstração pré-carregado, limpa para iniciar em branco
        if (saved.nome === EXAMPLE.nome || saved.email === EXAMPLE.email) {
          localStorage.removeItem(STORAGE_KEY);
          return blankState();
        }
        return { ...blankState(), ...saved };
      }
    } catch { /* ignora dados corrompidos */ }
    return blankState();
  }

  let saveTimer;
  function save() {
    const el = $('#save-status');
    el.classList.add('saving');
    el.lastChild.textContent = 'Salvando…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage cheio/bloqueado */ }
      el.classList.remove('saving');
      el.lastChild.textContent = 'Salvo automaticamente';
    }, 450);
  }

  // ---------- Máscaras -----------------------------------------------------
  const MASKS = {
    phone(v) {
      const d = v.replace(/\D/g, '').slice(0, 11);
      if (d.length <= 2) return d.length ? `(${d}` : '';
      if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    },
    cep(v) {
      const d = v.replace(/\D/g, '').slice(0, 8);
      return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    },
  };

  // ---------- Stepper ------------------------------------------------------
  const steps = $$('fieldset.step');

  function buildStepper() {
    $('#stepper-list').innerHTML = steps.map((s, i) => `
      <li data-i="${i}"><button type="button" aria-label="Ir para ${esc(s.dataset.title)}">
        <span class="bubble">${svg(s.dataset.icon)}</span><span class="lbl">${esc(s.dataset.title)}</span>
      </button></li>`).join('');
    $('#stepper-list').addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      const i = +li.dataset.i;
      if (i > current && !validateStep(current)) return;
      goTo(i);
    });
  }

  function goTo(i, { focus = true } = {}) {
    const back = i < current;
    current = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, idx) => {
      s.classList.toggle('active', idx === current);
      s.classList.toggle('back', back);
    });
    $$('#stepper-list li').forEach((li, idx) => {
      li.classList.toggle('active', idx === current);
      li.classList.toggle('done', idx < current);
      const b = $('.bubble', li);
      b.innerHTML = svg(idx < current ? 'check' : steps[idx].dataset.icon);
    });
    $('#stepper-fill').style.width = `${(current / (steps.length - 1)) * 100}%`;
    $('#btn-prev').hidden = current === 0;
    $('#btn-next').hidden = current === steps.length - 1;
    if (current === steps.length - 1) updateScore();
    highlightSection(STEP_SECTION[current]);
    if (focus) {
      const first = $('input:not([type=checkbox]), textarea', steps[current]);
      if (first && window.innerWidth > 1100) setTimeout(() => first.focus({ preventScroll: true }), 50);
      $('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ---------- Validação ----------------------------------------------------
  const RULES = {
    nome: (v) => v.trim().split(/\s+/).length >= 2,
    telefone: (v) => v.replace(/\D/g, '').length >= 10,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    objetivo: (v) => v.trim().length >= 3,
  };

  function validateStep(i) {
    let firstBad = null;
    $$('[data-field]', steps[i]).forEach((el) => {
      const rule = RULES[el.dataset.field];
      if (!rule) return;
      const ok = rule(el.value);
      el.closest('.field').classList.toggle('invalid', !ok);
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) {
      firstBad.focus();
      toast('Preencha os campos obrigatórios destacados.', 'error');
      return false;
    }
    return true;
  }

  // ---------- Campos simples ----------------------------------------------
  function fillSimpleFields() {
    $$('[data-field]').forEach((el) => { el.value = state[el.dataset.field] ?? ''; });
    updateCounters();
  }

  function updateCounters() {
    $$('.counter').forEach((c) => {
      const el = document.getElementById(c.dataset.for);
      c.textContent = `${el.value.length}/${el.maxLength}`;
    });
  }

  // ---------- Listas dinâmicas --------------------------------------------
  function renderList(name, { animateIndex = -1 } = {}) {
    const box = $(`[data-list="${name}"]`);
    box.dataset.empty = LIST_EMPTY_MSG[name];
    const tpl = document.getElementById(`tpl-${name}`);
    box.innerHTML = '';
    const items = state[name];
    items.forEach((item, idx) => {
      const node = tpl.content.firstElementChild.cloneNode(true);
      node.dataset.index = idx;
      if (idx !== animateIndex) node.style.animation = 'none';
      $$('[data-key]', node).forEach((el) => {
        const k = el.dataset.key;
        if (el.type === 'checkbox') el.checked = !!item[k]; else el.value = item[k] ?? '';
        el.id = `${name}-${idx}-${k}`;
        const label = el.closest('.field')?.querySelector('label:not(.switch)');
        if (label) label.htmlFor = el.id;
      });
      $('.item-tools', node).innerHTML = `
        <button type="button" class="icon-btn" data-action="up" aria-label="Mover para cima" ${idx === 0 ? 'disabled' : ''}>${svg('up')}</button>
        <button type="button" class="icon-btn" data-action="down" aria-label="Mover para baixo" ${idx === items.length - 1 ? 'disabled' : ''}>${svg('down')}</button>
        <button type="button" class="icon-btn danger" data-action="remove" aria-label="Remover">${svg('trash')}</button>`;
      updateItemTitle(node, item);
      syncPeriodo(node, item);
      box.appendChild(node);
    });
  }

  function updateItemTitle(node, item) {
    const t = $('.item-title', node);
    const val = item[t.dataset.titleFrom];
    t.textContent = has(val) ? val : t.dataset.fallback;
    t.classList.toggle('placeholder', !has(val));
  }

  function syncPeriodo(node, item) {
    const p = $('[data-key="periodo"]', node);
    if (!p) return;
    p.disabled = !!item.atual;
    p.placeholder = item.atual ? 'Trabalho atualmente' : 'Ex.: 1 ano e 2 meses / 03/2022 – 05/2023';
  }

  function addItem(name) {
    state[name].push(EMPTY_ITEMS[name]());
    renderList(name, { animateIndex: state[name].length - 1 });
    const last = $(`[data-list="${name}"] .item:last-child`);
    $('input, textarea', last)?.focus();
    last.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    changed(name);
  }

  function itemAction(name, idx, action, node) {
    const arr = state[name];
    if (action === 'remove') {
      node.style.animation = '';
      node.classList.add('removing');
      node.addEventListener('animationend', function onEnd(e) {
        if (e.target !== node) return;
        node.removeEventListener('animationend', onEnd);
        arr.splice(idx, 1);
        renderList(name);
        changed(name);
      }, { once: true });
      return;
    }
    const to = action === 'up' ? idx - 1 : idx + 1;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    renderList(name, { animateIndex: to });
    changed(name);
  }

  // ---------- Habilidades (tags) ------------------------------------------
  function renderTags() {
    $('#tags').innerHTML = state.habilidades.map((h, i) =>
      `<button type="button" class="tag" data-i="${i}" title="Remover">${esc(h)}</button>`).join('');
    renderChips('#skill-sugestoes', SKILL_SUGESTOES, (s) => state.habilidades.some((h) => h.toLowerCase() === s.toLowerCase()));
  }

  function addSkill(raw) {
    raw.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => {
      if (!state.habilidades.some((h) => h.toLowerCase() === s.toLowerCase())) state.habilidades.push(s);
    });
    renderTags();
    changed('habilidades');
  }

  function renderChips(sel, list, isUsed = () => false) {
    $(sel).innerHTML = list.map((s) =>
      `<button type="button" class="chip ${isUsed(s) ? 'used' : ''}" data-value="${esc(s)}">${esc(s)}</button>`).join('');
  }

  // ---------- Prévia ao vivo ----------------------------------------------
  const joinP = (parts, sep = '  |  ') => parts.filter(has).map((p) => esc(p.trim())).join(sep);

  function renderPreview() {
    const s = state;
    let h = '';

    const hasAnyContent = has(s.nome) || has(s.telefone) || has(s.email) || has(s.endereco) || has(s.objetivo) ||
      s.experiencias.some((e) => has(e.empresa) || has(e.cargo)) ||
      s.formacoes.some((f) => has(f.curso) || has(f.instituicao)) ||
      s.cursos.some((c) => has(c.nome)) ||
      s.habilidades.length > 0 ||
      s.idiomas.some((x) => has(x.idioma)) ||
      s.voluntarios.some((v) => has(v.titulo));

    if (!hasAnyContent) {
      $('#paper').innerHTML = `
        <div class="empty-paper-notice">
          <div class="empty-paper-badge">FOLHA EM BRANCO</div>
          <div class="empty-paper-title">Nenhuma informação preenchida ainda</div>
          <p class="empty-paper-desc">Preencha seus dados reais no formulário ao lado. Conforme você digita, a diagramação do currículo é gerada aqui em tempo real.</p>
        </div>`;
      applyZoom();
      return;
    }

    if (has(s.nome)) {
      h += `<div class="cv-name" data-sec="dados">${esc(s.nome.toUpperCase())}</div>`;
    }

    const endereco = [s.endereco, has(s.cep) ? `CEP: ${s.cep}` : ''].filter(has).join(', ');
    const contato = joinP([has(s.idade) ? `Idade: ${s.idade} anos` : '', endereco, s.telefone, s.email, s.linkedin]);
    if (contato) {
      h += `<div class="cv-contact" data-sec="dados">${contato}</div>`;
    }

    if (has(s.objetivo)) {
      h += `<div data-sec="objetivo"><div class="cv-section">Objetivo</div>
        <p class="cv-p">${esc(s.objetivo)}</p></div>`;
    }

    const exps = s.experiencias.filter((e) => has(e.empresa) || has(e.cargo));
    if (exps.length) {
      h += `<div data-sec="experiencias"><div class="cv-section">Experiências</div>`;
      exps.forEach((e) => {
        const periodo = e.atual ? 'Trabalho atualmente' : e.periodo;
        h += `<div class="cv-item-title">${joinP([has(e.empresa) ? `Empresa: ${e.empresa}` : '', has(e.cargo) ? `Cargo: ${e.cargo}` : ''])}${has(periodo) ? `<span class="meta">  |  Período: ${esc(periodo)}</span>` : ''}</div>`;
        if (has(e.funcoes)) h += `<p class="cv-desc">Funções: ${esc(e.funcoes)}</p>`;
      });
      h += '</div>';
    }

    const forms = s.formacoes.filter((f) => has(f.curso) || has(f.instituicao));
    if (forms.length) {
      h += `<div data-sec="formacoes"><div class="cv-section">Formação</div>`;
      forms.forEach((f) => { h += `<p class="cv-p">${joinP([f.curso, f.instituicao, f.status], ' | ')}</p>`; });
      h += '</div>';
    }

    const cursos = s.cursos.filter((c) => has(c.nome));
    if (cursos.length) {
      h += `<div data-sec="cursos"><div class="cv-section">Atividades Extracurriculares</div>`;
      cursos.forEach((c) => { h += `<div class="cv-bullet">• ${joinP([c.nome, c.instituicao, c.data], ' | ')}</div>`; });
      h += '</div>';
    }

    const idiomas = s.idiomas.filter((x) => has(x.idioma));
    if (s.habilidades.length || idiomas.length) {
      h += '<div data-sec="habilidades">';
      if (s.habilidades.length) {
        const txt = s.habilidades.join(', ');
        h += `<div class="cv-section">Habilidades</div><p class="cv-desc">${esc(/[.!?]$/.test(txt) ? txt : `${txt}.`)}</p>`;
      }
      if (idiomas.length) {
        h += '<div class="cv-section">Idiomas</div>';
        idiomas.forEach((x) => { h += `<div class="cv-bullet">• ${joinP([x.idioma, x.nivel], ' | ')}</div>`; });
      }
      h += '</div>';
    }

    const vols = s.voluntarios.filter((v) => has(v.titulo));
    if (vols.length) {
      h += `<div data-sec="voluntarios"><div class="cv-section">Trabalho Voluntário</div>`;
      vols.forEach((v) => {
        h += `<div class="cv-item-title">${esc(v.titulo)}${has(v.data) ? `<span class="meta"> | ${esc(v.data)}</span>` : ''}</div>`;
        if (has(v.tarefas)) h += `<p class="cv-desc">Tarefas: ${esc(v.tarefas)}</p>`;
      });
      h += '</div>';
    }

    $('#paper').innerHTML = h;
    applyZoom();
  }

  function highlightSection(sec) {
    if (!sec) return;
    const el = $(`#paper [data-sec="${sec}"]`);
    if (!el) return;
    el.classList.remove('flash');
    void el.offsetWidth; // reinicia a animação
    el.classList.add('flash');
    const wrap = $('#paper-wrap');
    const top = el.getBoundingClientRect().top - wrap.getBoundingClientRect().top + wrap.scrollTop - 40;
    wrap.scrollTo({ top, behavior: 'smooth' });
  }

  // ---------- Zoom ---------------------------------------------------------
  let zoom = null; // null = ajustar automaticamente à largura
  function fitZoom() {
    const wrap = $('#paper-wrap');
    if (!wrap) return 1;
    const padding = window.innerWidth <= 640 ? 20 : 48;
    const w = (wrap.clientWidth || window.innerWidth) - padding;
    return Math.max(0.25, Math.min(1, w / 794));
  }
  function applyZoom() {
    const z = zoom ?? fitZoom();
    const paper = $('#paper');
    if (!paper) return;
    paper.style.setProperty('--z', z);
    paper.style.marginBottom = `${(z - 1) * paper.offsetHeight}px`;
    paper.style.marginInline = `${((z - 1) * 794) / 2}px`;
    const label = $('#zoom-label');
    if (label) label.textContent = `${Math.round(z * 100)}%`;
  }

  // ---------- Pontuação ----------------------------------------------------
  function checklist() {
    const s = state;
    return [
      { label: 'Dados pessoais', step: 0, w: 25, ok: RULES.nome(s.nome) && RULES.telefone(s.telefone) && RULES.email(s.email) },
      { label: 'Objetivo', step: 1, w: 15, ok: RULES.objetivo(s.objetivo) },
      { label: 'Experiências', step: 2, w: 15, ok: s.experiencias.some((e) => has(e.empresa)) },
      { label: 'Formação', step: 3, w: 15, ok: s.formacoes.some((f) => has(f.curso)) },
      { label: 'Atividades', step: 4, w: 8, ok: s.cursos.some((c) => has(c.nome)) },
      { label: 'Habilidades (3+)', step: 5, w: 10, ok: s.habilidades.length >= 3 },
      { label: 'Idiomas', step: 5, w: 6, ok: s.idiomas.some((x) => has(x.idioma)) },
      { label: 'Voluntariado', step: 6, w: 6, ok: s.voluntarios.some((v) => has(v.titulo)) },
    ];
  }

  let customFilenameTouched = false;

  function getBaseFilename() {
    const input = $('#custom-filename');
    let name = input ? input.value.trim() : '';
    if (!name) name = DocxBuilder.fileName(state);
    return name.replace(/\.(docx|pdf)$/i, '');
  }

  function getActiveFilename(ext = 'docx') {
    return `${getBaseFilename()}.${ext}`;
  }

  function updateFilenameUI() {
    const defaultBase = DocxBuilder.fileName(state).replace(/\.(docx|pdf)$/i, '');
    const input = $('#custom-filename');
    if (input && !customFilenameTouched) {
      input.value = defaultBase;
    }
    const hint = $('#file-name-hint');
    if (hint) {
      hint.innerHTML = `Padrão: <code>${defaultBase}</code> (.docx / .pdf)`;
    }
  }

  function updateScore() {
    const list = checklist();
    const pct = list.reduce((a, c) => a + (c.ok ? c.w : 0), 0);
    $('#checklist').innerHTML = list.map((c) =>
      `<li class="${c.ok ? 'ok' : ''}" data-step="${c.step}"><span class="ck">${c.ok ? '✓' : ''}</span>${esc(c.label)}</li>`).join('');
    const ring = $('#ring-fg');
    ring.style.strokeDashoffset = 326.7 * (1 - pct / 100);
    ring.style.stroke = pct >= 80 ? 'hsl(152 65% 52%)' : pct >= 50 ? 'hsl(212 95% 62%)' : 'hsl(38 95% 60%)';
    animateNumber($('#score-num'), pct);
    updateFilenameUI();
  }

  function animateNumber(el, to) {
    const from = parseInt(el.textContent, 10) || 0;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 700);
      el.textContent = `${Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)))}%`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------- Download (Word e PDF) ----------------------------------------
  function validateBeforeDownload() {
    for (const i of [0, 1]) {
      const ok = $$('[data-field]', steps[i]).every((el) => !RULES[el.dataset.field] || RULES[el.dataset.field](el.value));
      if (!ok) { goTo(i); validateStep(i); return false; }
    }
    return true;
  }

  function download() {
    if (!validateBeforeDownload()) return;
    try {
      const blob = DocxBuilder.build(state);
      const url = URL.createObjectURL(blob);
      const filename = getActiveFilename('docx');
      const a = Object.assign(document.createElement('a'), { href: url, download: filename });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast(`Currículo baixado com sucesso (${filename})! 🎉`, 'success');
      confetti();
    } catch (err) {
      console.error(err);
      toast('Não foi possível gerar o arquivo Word. Tente novamente.', 'error');
    }
  }

  function downloadPdf() {
    if (!validateBeforeDownload()) return;
    renderPreview();

    const pdfName = getBaseFilename();
    const oldTitle = document.title;
    document.title = pdfName;

    document.body.classList.add('printing-pdf');

    const paper = $('#paper');
    const oldTransform = paper.style.transform;
    const oldMarginBottom = paper.style.marginBottom;
    const oldMarginInline = paper.style.marginInline;

    paper.style.transform = 'none';
    paper.style.marginBottom = '0';
    paper.style.marginInline = 'auto';

    toast('Abrindo diálogo de PDF. Selecione "Salvar como PDF" na impressora.', 'success');
    confetti();

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = oldTitle;
        document.body.classList.remove('printing-pdf');
        paper.style.transform = oldTransform;
        paper.style.marginBottom = oldMarginBottom;
        paper.style.marginInline = oldMarginInline;
      }, 1500);
    }, 180);
  }

  function confetti() {
    const colors = ['#4f9cff', '#9b6bff', '#2fd4e6', '#3ddc97', '#ffd166'];
    const btn = $('#btn-download').getBoundingClientRect();
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('span');
      const size = 6 + Math.random() * 6;
      Object.assign(p.style, {
        position: 'fixed', zIndex: 60, pointerEvents: 'none', width: `${size}px`, height: `${size * 0.6}px`,
        left: `${btn.left + btn.width / 2}px`, top: `${btn.top}px`, background: colors[i % colors.length], borderRadius: '2px',
      });
      document.body.appendChild(p);
      const angle = Math.random() * Math.PI - Math.PI;
      const dist = 120 + Math.random() * 260;
      p.animate([
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 240}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ], { duration: 1200 + Math.random() * 800, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => p.remove();
    }
  }

  // ---------- Toast --------------------------------------------------------
  let toastTimer;
  function toast(msg, type = '') {
    const t = $('#toast');
    t.textContent = msg;
    t.className = `toast show ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  // ---------- Ciclo de mudança --------------------------------------------
  let previewRaf;
  function changed() {
    save();
    cancelAnimationFrame(previewRaf);
    previewRaf = requestAnimationFrame(() => {
      renderPreview();
      if (current === steps.length - 1) updateScore();
    });
  }

  function renderAll() {
    fillSimpleFields();
    Object.keys(EMPTY_ITEMS).forEach((n) => renderList(n));
    renderTags();
    renderChips('#objetivo-sugestoes', OBJ_SUGESTOES);
    renderPreview();
  }

  // ---------- Eventos ------------------------------------------------------
  function bindEvents() {
    const form = $('#cv-form');
    form.addEventListener('submit', (e) => e.preventDefault());

    form.addEventListener('input', (e) => {
      const el = e.target;
      if (el.dataset.field) {
        if (el.dataset.mask) {
          const pos = el.value.length - el.selectionStart;
          el.value = MASKS[el.dataset.mask](el.value);
          el.setSelectionRange(el.value.length - pos, el.value.length - pos);
        }
        state[el.dataset.field] = el.value;
        const f = el.closest('.field');
        if (f.classList.contains('invalid') && RULES[el.dataset.field]?.(el.value)) f.classList.remove('invalid');
        updateCounters();
        changed();
        return;
      }
      const item = el.closest('.item');
      if (item && el.dataset.key) {
        const name = item.parentElement.dataset.list;
        const obj = state[name][+item.dataset.index];
        obj[el.dataset.key] = el.type === 'checkbox' ? el.checked : el.value;
        updateItemTitle(item, obj);
        if (el.dataset.key === 'atual') syncPeriodo(item, obj);
        changed();
      }
    });
    form.addEventListener('change', (e) => {
      if (e.target.tagName === 'SELECT' || e.target.type === 'checkbox') e.target.dispatchEvent(new Event('input', { bubbles: true }));
    });

    form.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      if (add) return addItem(add.dataset.add);
      const act = e.target.closest('[data-action]');
      if (act) {
        const item = act.closest('.item');
        return itemAction(item.parentElement.dataset.list, +item.dataset.index, act.dataset.action, item);
      }
      const chip = e.target.closest('.chip');
      if (chip) {
        if (chip.parentElement.id === 'objetivo-sugestoes') {
          const ta = $('#objetivo');
          ta.value = chip.dataset.value;
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          ta.focus();
        } else addSkill(chip.dataset.value);
        return;
      }
      const tag = e.target.closest('.tag');
      if (tag) {
        state.habilidades.splice(+tag.dataset.i, 1);
        renderTags();
        changed();
        return;
      }
      const ck = e.target.closest('#checklist li');
      if (ck) goTo(+ck.dataset.step);
    });

    // Enter avança nos campos simples (exceto textarea)
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('input[data-field]')) {
        e.preventDefault();
        $('#btn-next').click();
      }
    });

    const skillInput = $('#skill-input');
    skillInput.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ',') && skillInput.value.trim()) {
        e.preventDefault();
        addSkill(skillInput.value);
        skillInput.value = '';
      } else if (e.key === 'Enter') {
        e.preventDefault();
      } else if (e.key === 'Backspace' && !skillInput.value && state.habilidades.length) {
        state.habilidades.pop();
        renderTags();
        changed();
      }
    });
    skillInput.addEventListener('blur', () => {
      if (skillInput.value.trim()) { addSkill(skillInput.value); skillInput.value = ''; }
    });
    $('#tag-box').addEventListener('click', (e) => { if (e.target.id === 'tag-box') skillInput.focus(); });

    $('#btn-next').addEventListener('click', () => { if (validateStep(current)) goTo(current + 1); });
    $('#btn-prev').addEventListener('click', () => goTo(current - 1));
    $('#btn-download').addEventListener('click', download);
    $('#btn-pdf').addEventListener('click', downloadPdf);
    $('#btn-quick-pdf')?.addEventListener('click', downloadPdf);

    $('#custom-filename')?.addEventListener('input', () => {
      customFilenameTouched = true;
    });

    $('#btn-reset-filename')?.addEventListener('click', () => {
      customFilenameTouched = false;
      updateFilenameUI();
      toast('Nome redefinido para o padrão automático', 'success');
    });

    $('#btn-example').addEventListener('click', () => {
      customFilenameTouched = false;
      state = JSON.parse(JSON.stringify(EXAMPLE));
      renderAll();
      $$('.field.invalid').forEach((f) => f.classList.remove('invalid'));
      save();
      toast('Exemplo carregado — edite à vontade!', 'success');
      if (current === steps.length - 1) updateScore();
    });
    $('#btn-clear').addEventListener('click', () => {
      if (!confirm('Apagar todas as informações preenchidas?')) return;
      customFilenameTouched = false;
      state = blankState();
      renderAll();
      save();
      goTo(0);
      toast('Formulário limpo.');
    });

    $('#zoom-in').addEventListener('click', () => { zoom = Math.min(1.5, +((zoom ?? fitZoom()) + 0.1).toFixed(2)); applyZoom(); });
    $('#zoom-out').addEventListener('click', () => { zoom = Math.max(0.3, +((zoom ?? fitZoom()) - 0.1).toFixed(2)); applyZoom(); });
    $('#zoom-label').addEventListener('dblclick', () => { zoom = null; applyZoom(); });
    new ResizeObserver(() => applyZoom()).observe($('#paper-wrap'));

    $('#open-preview').addEventListener('click', () => {
      $('#preview-panel').classList.add('open');
      const wrap = $('#paper-wrap');
      if (wrap) wrap.scrollTop = 0;
      requestAnimationFrame(() => {
        applyZoom();
        setTimeout(applyZoom, 250);
      });
    });
    $('#close-preview').addEventListener('click', () => $('#preview-panel').classList.remove('open'));

    // ---------- Tela de Boas-Vindas ----------
    const welcomeModal = $('#welcome-modal');
    const closeWelcome = () => {
      if (welcomeModal) {
        welcomeModal.classList.remove('active');
        const nomeInput = $('#nome');
        if (nomeInput && !nomeInput.value) {
          setTimeout(() => nomeInput.focus(), 150);
        }
      }
    };
    const openWelcome = () => {
      if (welcomeModal) welcomeModal.classList.add('active');
    };

    $('#btn-enter-site')?.addEventListener('click', closeWelcome);
    $('#welcome-close-btn')?.addEventListener('click', closeWelcome);
    $('#btn-about')?.addEventListener('click', openWelcome);
    welcomeModal?.addEventListener('click', (e) => {
      if (e.target === welcomeModal) closeWelcome();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (welcomeModal?.classList.contains('active')) {
          closeWelcome();
        } else {
          $('#preview-panel').classList.remove('open');
        }
      }
    });
  }

  // ---------- Init ---------------------------------------------------------
  buildStepper();
  renderAll();
  bindEvents();
  goTo(0, { focus: false });
  document.fonts?.ready.then(applyZoom);
})();
