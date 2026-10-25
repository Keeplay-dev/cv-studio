/**
 * DocxBuilder — monta um currículo .docx seguindo o molde
 * CV_ESTAGIO_RAFAEL_2026.docx (Calibri, azul #1F4E79, seções sublinhadas).
 */
const DocxBuilder = (() => {
  'use strict';

  // Paleta e tamanhos (meios-pontos) extraídos do modelo original
  const C = { primary: '1F4E79', text: '333333', muted: '595959', meta: '707070' };
  const SZ = { name: 36, contact: 19, section: 23, itemTitle: 21, body: 21, desc: 20, meta: 19 };

  const esc = (s) => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

  const has = (v) => typeof v === 'string' ? v.trim().length > 0 : !!v;

  /** Cria um run de texto; quebras de linha viram <w:br/>. */
  function run(text, { bold, italic, color = C.text, size = SZ.body } = {}) {
    const rPr = `<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>${bold ? '<w:b/>' : ''}${italic ? '<w:i/>' : ''}<w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr>`;
    const lines = String(text ?? '').split(/\r?\n/);
    const body = lines.map((l, i) => `${i ? '<w:br/>' : ''}<w:t xml:space="preserve">${esc(l)}</w:t>`).join('');
    return `<w:r>${rPr}${body}</w:r>`;
  }

  function para(runs, { before, after, indent, center, border, keepNext } = {}) {
    const spacing = (before != null || after != null)
      ? `<w:spacing${before != null ? ` w:before="${before}"` : ''}${after != null ? ` w:after="${after}"` : ''}/>` : '';
    const pPr =
      (keepNext ? '<w:keepNext/>' : '') +
      (border ? `<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="3" w:color="${C.primary}"/></w:pBdr>` : '') +
      spacing +
      (indent ? `<w:ind w:left="${indent}"/>` : '') +
      (center ? '<w:jc w:val="center"/>' : '');
    return `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ''}${runs.join('')}</w:p>`;
  }

  const section = (title) => para(
    [run(title.toUpperCase(), { bold: true, color: C.primary, size: SZ.section })],
    { border: true, before: 280, after: 80, keepNext: true }
  );

  const join = (parts, sep = '  |  ') => parts.filter(has).map((p) => p.trim()).join(sep);

  /** Gera o XML do corpo do documento a partir dos dados do formulário. */
  function bodyXml(d) {
    const out = [];

    // ---- Cabeçalho -------------------------------------------------------
    out.push(para([run((d.nome || 'SEU NOME').toUpperCase(), { bold: true, color: C.primary, size: SZ.name })], { after: 40 }));

    const endereco = join([d.endereco, has(d.cep) ? `CEP: ${d.cep}` : ''], ', ');
    const contato = join([
      has(d.idade) ? `Idade: ${d.idade} anos` : '',
      endereco, d.telefone, d.email, d.linkedin,
    ]);
    if (contato) out.push(para([run(contato, { color: C.muted, size: SZ.contact })], { center: true }));

    // ---- Objetivo --------------------------------------------------------
    if (has(d.objetivo)) {
      out.push(section('Objetivo'));
      out.push(para([run(d.objetivo, { size: SZ.body })], { after: 80 }));
    }

    // ---- Experiências ----------------------------------------------------
    const exps = (d.experiencias || []).filter((e) => has(e.empresa) || has(e.cargo));
    if (exps.length) {
      out.push(section('Experiências'));
      exps.forEach((e) => {
        const titulo = join([has(e.empresa) ? `Empresa: ${e.empresa}` : '', has(e.cargo) ? `Cargo: ${e.cargo}` : '']);
        const periodo = e.atual ? 'Trabalho atualmente' : e.periodo;
        const runs = [run(titulo, { bold: true, color: C.primary, size: SZ.itemTitle })];
        if (has(periodo)) runs.push(run(`  |  Período: ${periodo}`, { italic: true, color: C.meta, size: SZ.meta }));
        out.push(para(runs, { before: 80, after: has(e.funcoes) ? 40 : 120, keepNext: has(e.funcoes) }));
        if (has(e.funcoes)) out.push(para([run(`Funções: ${e.funcoes}`, { size: SZ.desc })], { after: 120, indent: 288 }));
      });
    }

    // ---- Formação --------------------------------------------------------
    const forms = (d.formacoes || []).filter((f) => has(f.curso) || has(f.instituicao));
    if (forms.length) {
      out.push(section('Formação'));
      forms.forEach((f, i) => {
        out.push(para([run(join([f.curso, f.instituicao, f.status], ' | '), { size: SZ.body })], { after: i === forms.length - 1 ? 120 : 60 }));
      });
    }

    // ---- Atividades extracurriculares -----------------------------------
    const cursos = (d.cursos || []).filter((c) => has(c.nome));
    if (cursos.length) {
      out.push(section('Atividades Extracurriculares'));
      cursos.forEach((c, i) => {
        out.push(para([run(`• ${join([c.nome, c.instituicao, c.data], ' | ')}`, { size: SZ.desc })],
          { after: i === cursos.length - 1 ? 120 : 40, indent: 288 }));
      });
    }

    // ---- Habilidades -----------------------------------------------------
    const skills = (d.habilidades || []).filter(has);
    if (skills.length) {
      out.push(section('Habilidades'));
      const txt = skills.join(', ');
      out.push(para([run(/[.!?]$/.test(txt) ? txt : `${txt}.`, { size: SZ.desc })], { after: 120, indent: 288 }));
    }

    // ---- Idiomas (opcional) ---------------------------------------------
    const idiomas = (d.idiomas || []).filter((x) => has(x.idioma));
    if (idiomas.length) {
      out.push(section('Idiomas'));
      idiomas.forEach((x, i) => {
        out.push(para([run(`• ${join([x.idioma, x.nivel], ' | ')}`, { size: SZ.desc })],
          { after: i === idiomas.length - 1 ? 120 : 40, indent: 288 }));
      });
    }

    // ---- Trabalho voluntário --------------------------------------------
    const vols = (d.voluntarios || []).filter((v) => has(v.titulo));
    if (vols.length) {
      out.push(section('Trabalho Voluntário'));
      vols.forEach((v) => {
        const runs = [run(v.titulo, { bold: true, color: C.primary, size: SZ.itemTitle })];
        if (has(v.data)) runs.push(run(` | ${v.data}`, { italic: true, color: C.meta, size: SZ.meta }));
        out.push(para(runs, { before: 80, after: has(v.tarefas) ? 40 : 120, keepNext: has(v.tarefas) }));
        if (has(v.tarefas)) out.push(para([run(`Tarefas: ${v.tarefas}`, { size: SZ.desc })], { after: 120, indent: 288 }));
      });
    }

    return out.join('');
  }

  function documentXml(d) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      `<w:body>${bodyXml(d)}` +
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="720"/><w:docGrid w:linePitch="360"/></w:sectPr>' +
      '</w:body></w:document>';
  }

  const STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:eastAsia="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="pt-BR" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault>' +
    '<w:pPrDefault><w:pPr><w:spacing w:after="200" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
    '</w:styles>';

  const CONTENT_TYPES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
    '</Types>';

  const ROOT_RELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
    '</Relationships>';

  const DOC_RELS = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
    '</Relationships>';

  function coreXml(d) {
    const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      `<dc:title>Currículo - ${esc(d.nome)}</dc:title><dc:creator>${esc(d.nome)}</dc:creator>` +
      `<dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>` +
      '</cp:coreProperties>';
  }

  /** @returns {Blob} arquivo .docx pronto para download */
  function build(data) {
    return MiniZip.create([
      { name: '[Content_Types].xml', data: CONTENT_TYPES },
      { name: '_rels/.rels', data: ROOT_RELS },
      { name: 'word/document.xml', data: documentXml(data) },
      { name: 'word/_rels/document.xml.rels', data: DOC_RELS },
      { name: 'word/styles.xml', data: STYLES },
      { name: 'docProps/core.xml', data: coreXml(data) },
    ], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  }

  const PREPOSITIONS = new Set(['DE', 'DA', 'DO', 'DOS', 'DAS', 'EM', 'E', 'PARA', 'COM']);

  function cleanSlug(str, maxWords = 4) {
    if (!str) return '';
    const words = str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.toUpperCase());

    if (!words.length) return '';

    let chosen = words.slice(0, maxWords);
    if (words.length > maxWords && PREPOSITIONS.has(chosen[chosen.length - 1])) {
      chosen.push(words[maxWords]);
    }
    while (chosen.length > 1 && PREPOSITIONS.has(chosen[chosen.length - 1])) {
      chosen.pop();
    }

    return chosen.join('_');
  }

  /** Nome de arquivo no padrão CV_PESSOA_CARGO.docx */
  function fileName(data) {
    const pessoa = cleanSlug(data?.nome, 4) || 'PESSOA';

    let cargoRaw = '';
    if (data?.objetivo && typeof data.objetivo === 'string') {
      const parts = data.objetivo.split(/[|\/;\n]/);
      cargoRaw = parts[0]?.trim() || '';
    }
    if (!cargoRaw && Array.isArray(data?.experiencias)) {
      const exp = data.experiencias.find((e) => e?.cargo && e.cargo.trim());
      if (exp) cargoRaw = exp.cargo.trim();
    }

    const cargo = cleanSlug(cargoRaw, 4) || 'CARGO';
    return `CV_${pessoa}_${cargo}.docx`;
  }

  return { build, fileName, documentXml };
})();

if (typeof module !== 'undefined') module.exports = DocxBuilder;
