const chapterTitles = [
  'Das Kind ohne Vorleben',
  'Der Krieg, den es nie gab',
  'Ein Drache fällt nach oben',
  'Die Schuppe über Merea',
  'Der erste falsche Tote',
  'Markt der ungelebten Tode',
  'Orrs Gewicht',
  'Das Tor nach Asra',
  'Stadt aus dem Satz davor',
  'Sieben Stimmen in einem Körper',
  'Die weißen Motten',
  'Karte eines Ortes, der Nein sagt',
  'Zeuge Nummer eins',
  'Der Fluss bergauf',
  'Sereths Angebot',
  'Ein besseres Gestern',
  'Was die Elfen erben',
  'Die erste Naht',
  'Neun Gesetze, zehn Schatten',
  'Das Haus, das Neyra kennt',
  'Der Mann mit nur einer Zukunft',
  'Orrs erster Name',
  'Das Begräbnis einer Möglichkeit',
  'Phaes Verrat',
  'Die Stadt wählt zurück',
  'Schwester im weißen Regen',
  'Der Chor lügt',
  'Neyras wahre Leere',
  'Zwei Wahrheiten',
  'Unter der neunten Schuppe',
  'Markt ohne Namen',
  'Die erste Zeugin widerruft',
  'Sereth öffnet die Welt',
  'Der Drache bricht sein Gesetz',
  'Eine Stadt darf ankommen',
  'Die zehnte Häutung'
];

const chapterAssessments = {
  1: {
    score: '9,6 / 10',
    verdict: 'Sehr starker, eigenständiger Auftakt mit einem sofortigen Rätsel, einer emotional greifbaren Hauptfigur und einem Schlussbild, das die zentrale Serienfrage persönlich macht.',
    strengths: 'Der erste Satz setzt unmittelbar Spannung. Neyras trockene Stimme trägt, die drei Szenen eskalieren durch ihre Entscheidungen, und sechs rote Fäden sind sichtbar vorbereitet, ohne die späteren Auflösungen vorwegzunehmen.',
    risks: 'Die Archivpassage ist stellenweise dichter als der übrige Text. Die freiwillige Bindung zwischen Neyra und Phae könnte noch einen Hauch mehr Wärme vertragen. Elfenalter (D-03) und Mutter-Paradox (D-04) bleiben bewusst entscheidungspflichtig.',
    recommendation: 'Rohentwurf v1 ist bereit für die Koautorenprüfung. Endgültig freigeben erst, wenn D-03 und D-04 bewusst entschieden oder als beabsichtigt offen protokolliert und die Rückmeldungen des Koautors eingearbeitet wurden.'
  }
};

function chapterAssessment(chapter) {
  return chapterAssessments[Number(chapter)] || null;
}

function chapterAssessmentText(chapter) {
  const assessment = chapterAssessment(chapter);
  if (!assessment) return 'Für dieses Kapitel liegt noch keine KI-Einschätzung vor.';
  return `Bewertung: ${assessment.score}\nKurzurteil: ${assessment.verdict}\nStärken: ${assessment.strengths}\nOffene Risiken: ${assessment.risks}\nFreigabeempfehlung: ${assessment.recommendation}`;
}

function assessmentRow(label, text) {
  const row = document.createElement('div');
  row.className = 'assessment-row';
  const heading = document.createElement('strong');
  heading.textContent = label;
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  row.append(heading, paragraph);
  return row;
}

function renderChapterAssessment(container, chapter) {
  const assessment = chapterAssessment(chapter);
  container.replaceChildren();

  const head = document.createElement('div');
  head.className = 'assessment-head';
  const label = document.createElement('span');
  label.textContent = 'Meine Einschätzung';
  const score = document.createElement('b');
  score.textContent = assessment ? assessment.score : 'noch offen';
  head.append(label, score);
  container.appendChild(head);

  if (!assessment) {
    container.appendChild(assessmentRow('Status', 'Für dieses Kapitel liegt noch kein geprüfter Rohentwurf und deshalb keine belastbare Einschätzung vor.'));
    return;
  }

  container.append(
    assessmentRow('Kurzurteil', assessment.verdict),
    assessmentRow('Stärken', assessment.strengths),
    assessmentRow('Offene Risiken', assessment.risks),
    assessmentRow('Freigabeempfehlung', assessment.recommendation)
  );
}

function today() {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
}

function safeFilename(value) {
  return String(value || 'protokoll')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 55) || 'protokoll';
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function protocolId(form) {
  if (!form.dataset.protocolId) {
    const suffix = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().split('-')[0].toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();
    form.dataset.protocolId = `${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${suffix}`;
    form.dataset.protocolDate = today();
  }
  return form.dataset.protocolId;
}

function approvalValues(form) {
  const data = new FormData(form);
  return {
    reviewer: String(data.get('reviewer') || '').trim(),
    chapter: String(data.get('chapter') || '').trim(),
    chapterTitle: String(data.get('chapterTitle') || '').trim(),
    version: String(data.get('version') || '').trim(),
    decision: String(data.get('decision') || '').trim(),
    checks: data.getAll('check').map(String),
    notes: String(data.get('notes') || '').trim(),
    declaration: data.get('declaration') === 'on'
  };
}

function approvalText(form) {
  const values = approvalValues(form);
  const isWritingApproval = form.dataset.kind === 'schreibfreigabe';
  const label = isWritingApproval ? 'SCHREIBFREIGABE' : 'KAPITELABNAHME';
  const chapterReview = isWritingApproval ? '' : `
KI-EINSCHÄTZUNG ZUM KAPITEL
${chapterAssessmentText(values.chapter)}

SZENENFREIGABEN
${sceneApprovalText()}
`;

  return `${label} · DIE HÄUTUNG DER WELT

Protokoll-ID: ${protocolId(form)}
Erstellt: ${form.dataset.protocolDate}
Koautor / geprüft von: ${values.reviewer}
Kapitel: ${values.chapter} · ${values.chapterTitle}
Geprüfte Version: ${values.version}
${chapterReview}

ENTSCHEIDUNG
${values.decision}

BESTÄTIGTE PRÜFPUNKTE
${values.checks.map((item) => `- ${item}`).join('\n')}

VERMERK
${values.notes}

GELTUNG
Diese Entscheidung gilt ausschließlich für die oben genannte Version. Sie wird verbindlich, sobald das Protokoll an den anderen Autor übermittelt und im Projekt dokumentiert wurde.`;
}

function approvalStorageKey(form) {
  return `haeutung-der-welt-${form.dataset.kind}-v2`;
}

function saveApprovalDraft(form) {
  const status = form.querySelector('.form-status');
  delete form.dataset.protocolId;
  delete form.dataset.protocolDate;
  try {
    localStorage.setItem(approvalStorageKey(form), JSON.stringify(approvalValues(form)));
    status.textContent = 'Entwurf auf diesem Gerät gespeichert.';
  } catch {
    status.textContent = 'Der Entwurf konnte nicht lokal gespeichert werden.';
  }
}

function restoreApprovalDraft(form) {
  try {
    const saved = JSON.parse(localStorage.getItem(approvalStorageKey(form)));
    if (!saved) return;
    for (const name of ['reviewer', 'chapter', 'chapterTitle', 'version', 'decision', 'notes']) {
      const field = form.elements.namedItem(name);
      if (field && saved[name] !== undefined) field.value = saved[name];
    }
    form.querySelectorAll('input[name="check"]').forEach((field) => {
      field.checked = Array.isArray(saved.checks) && saved.checks.includes(field.value);
    });
    form.elements.namedItem('declaration').checked = Boolean(saved.declaration);
    form.querySelector('.form-status').textContent = 'Gespeicherten Entwurf wiederhergestellt.';
  } catch {
    localStorage.removeItem(approvalStorageKey(form));
  }
}

async function copyApproval(form) {
  if (form.dataset.kind === 'kapitelabnahme' && !allScenesApproved()) {
    form.querySelector('.form-status').textContent = 'Kapitelabnahme gesperrt: Erst alle Szenen freigeben.';
    return;
  }
  if (!form.reportValidity()) return;
  const status = form.querySelector('.form-status');
  try {
    await navigator.clipboard.writeText(approvalText(form));
    status.textContent = `Protokoll ${form.dataset.protocolId} kopiert.`;
  } catch {
    status.textContent = 'Kopieren war nicht möglich. Bitte das Protokoll herunterladen.';
  }
}

function downloadApproval(form) {
  if (form.dataset.kind === 'kapitelabnahme' && !allScenesApproved()) {
    form.querySelector('.form-status').textContent = 'Kapitelabnahme gesperrt: Erst alle Szenen freigeben.';
    return;
  }
  if (!form.reportValidity()) return;
  const values = approvalValues(form);
  const id = protocolId(form);
  downloadText(
    approvalText(form),
    `${form.dataset.kind}-kapitel-${String(values.chapter).padStart(2, '0')}-${safeFilename(values.version)}-${id}.txt`
  );
  form.querySelector('.form-status').textContent = `Protokoll ${id} heruntergeladen.`;
}

document.querySelectorAll('.approval-form').forEach((approvalForm) => {
  restoreApprovalDraft(approvalForm);
  const assessmentContainer = approvalForm.querySelector('[data-chapter-assessment]');
  if (assessmentContainer) renderChapterAssessment(assessmentContainer, approvalForm.elements.namedItem('chapter').value);
  approvalForm.addEventListener('submit', (event) => event.preventDefault());
  approvalForm.addEventListener('input', () => saveApprovalDraft(approvalForm));

  const chapterField = approvalForm.elements.namedItem('chapter');
  chapterField.addEventListener('change', () => {
    const index = Number(chapterField.value) - 1;
    if (chapterTitles[index]) approvalForm.elements.namedItem('chapterTitle').value = chapterTitles[index];
    if (assessmentContainer) renderChapterAssessment(assessmentContainer, chapterField.value);
    saveApprovalDraft(approvalForm);
  });

  approvalForm.querySelector('[data-action="copy"]').addEventListener('click', () => copyApproval(approvalForm));
  approvalForm.querySelector('[data-action="download"]').addEventListener('click', () => downloadApproval(approvalForm));
});

document.querySelectorAll('.chapter-assessment[data-chapter-assessment]').forEach((container) => {
  renderChapterAssessment(container, container.dataset.chapterAssessment);
});

const sceneTitles = [
  'Das gestohlene Gestern',
  'Das Fest der benannten Türen',
  'Der Name, den es nicht gibt'
];

const sceneApprovalStorageKey = 'haeutung-der-welt-kapitel-01-szenenfreigaben-v1';
let sceneApprovals = {};

function loadSceneApprovals() {
  try {
    const saved = JSON.parse(localStorage.getItem(sceneApprovalStorageKey));
    sceneApprovals = saved && typeof saved === 'object' ? saved : {};
  } catch {
    sceneApprovals = {};
    localStorage.removeItem(sceneApprovalStorageKey);
  }
}

function persistSceneApprovals() {
  localStorage.setItem(sceneApprovalStorageKey, JSON.stringify(sceneApprovals));
  updateChapterGate();
}

function sceneChangeCount(sceneNumber) {
  const prefix = `Kapitel 1 · Szene ${sceneNumber} ·`;
  return changeNotes.filter((note) => note.target.startsWith(prefix)).length;
}

function allScenesApproved() {
  return sceneTitles.every((_, index) => sceneApprovals[index + 1]?.decision === 'approved' && sceneChangeCount(index + 1) === 0);
}

function sceneApprovalText() {
  return sceneTitles.map((title, index) => {
    const number = index + 1;
    const approval = sceneApprovals[number];
    if (!approval || approval.decision !== 'approved') return `- Szene ${number}: ${title} · NICHT FREIGEGEBEN`;
    return `- Szene ${number}: ${title} · FREIGEGEBEN von ${approval.reviewer} am ${approval.approvedAt}${approval.note ? ` · ${approval.note}` : ''}`;
  }).join('\n');
}

function updateChapterGate() {
  const approvedCount = sceneTitles.filter((_, index) => sceneApprovals[index + 1]?.decision === 'approved' && sceneChangeCount(index + 1) === 0).length;
  const ready = approvedCount === sceneTitles.length;
  const progress = document.querySelector('#sceneApprovalProgress');
  const panel = document.querySelector('#chapterApprovalPanel');
  const form = document.querySelector('#chapterApprovalForm');

  if (progress) {
    progress.querySelector('strong').textContent = `${approvedCount} von ${sceneTitles.length} Szenen freigegeben`;
    progress.querySelector('span').textContent = ready ? 'Kapitelabnahme entsperrt' : 'Kapitelabnahme gesperrt';
    progress.classList.toggle('is-ready', ready);
  }
  panel?.classList.toggle('is-locked', !ready);
  form?.querySelectorAll('[data-scene-gated]').forEach((control) => {
    control.disabled = !ready;
  });
  if (form && !ready) form.querySelector('.form-status').textContent = 'Kapitelabnahme gesperrt: Noch sind nicht alle Szenen freigegeben.';
  if (form && ready && form.querySelector('.form-status').textContent.startsWith('Kapitelabnahme gesperrt')) {
    form.querySelector('.form-status').textContent = 'Alle Szenen sind freigegeben. Die Kapitelabnahme ist jetzt möglich.';
  }
}

function sceneField(labelText, control) {
  const label = document.createElement('label');
  label.textContent = labelText;
  label.appendChild(control);
  return label;
}

function renderSceneApproval(article, index) {
  article.querySelector(':scope > .scene-approval')?.remove();
  const number = index + 1;
  const saved = sceneApprovals[number] || {};
  const openChanges = sceneChangeCount(number);
  const panel = document.createElement('section');
  panel.className = `scene-approval ${saved.decision === 'approved' && openChanges === 0 ? 'is-approved' : saved.decision === 'changes' || openChanges ? 'needs-changes' : ''}`;
  panel.setAttribute('aria-label', `Freigabe für Szene ${number}`);

  const head = document.createElement('div');
  head.className = 'scene-approval-head';
  const title = document.createElement('strong');
  title.textContent = `Szenenfreigabe · ${String(number).padStart(2, '0')}`;
  const badge = document.createElement('span');
  badge.textContent = saved.decision === 'approved' && openChanges === 0 ? 'Freigegeben' : saved.decision === 'changes' || openChanges ? 'Änderung nötig' : 'Prüfung offen';
  head.append(title, badge);

  const hint = document.createElement('p');
  hint.textContent = openChanges
    ? `${openChanges} offener Änderungswunsch. Nach der Überarbeitung muss diese Szene erneut freigegeben werden.`
    : 'Text prüfen, Änderungswünsche direkt an der Szene erfassen und anschließend die Szene freigeben.';

  const form = document.createElement('form');
  form.className = 'scene-approval-form';
  const reviewer = document.createElement('input');
  reviewer.required = true;
  reviewer.placeholder = 'Kürzel';
  reviewer.value = saved.reviewer || authorField?.value || '';
  const decision = document.createElement('select');
  decision.required = true;
  [['', 'Bitte auswählen'], ['approved', 'Szene freigeben'], ['changes', 'Überarbeitung erforderlich']].forEach(([value, text]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    option.selected = saved.decision === value;
    decision.appendChild(option);
  });
  const note = document.createElement('textarea');
  note.rows = 2;
  note.placeholder = 'Kurzer Vermerk; bei Überarbeitung bitte den Grund nennen.';
  note.value = saved.note || '';
  const save = document.createElement('button');
  save.type = 'submit';
  save.className = 'button button-primary';
  save.textContent = 'Szenenentscheidung speichern';
  const status = document.createElement('p');
  status.className = 'scene-approval-status';
  status.setAttribute('role', 'status');
  status.textContent = saved.approvedAt ? `Gespeichert: ${saved.approvedAt}` : 'Noch keine Szenenentscheidung gespeichert.';

  form.append(sceneField('Koautor', reviewer), sceneField('Entscheidung', decision), sceneField('Vermerk', note), save, status);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (decision.value === 'approved' && sceneChangeCount(number) > 0) {
      status.textContent = 'Freigabe nicht möglich: Zuerst die offenen Änderungswünsche abarbeiten und aus der Ablage entfernen.';
      return;
    }
    if (decision.value === 'changes' && !note.value.trim()) {
      status.textContent = 'Bitte den Überarbeitungsgrund im Vermerk festhalten.';
      note.focus();
      return;
    }
    sceneApprovals[number] = {
      decision: decision.value,
      reviewer: reviewer.value.trim(),
      note: note.value.trim(),
      version: 'Rohentwurf v1 · 20.10.2026',
      approvedAt: decision.value === 'approved' ? today() : ''
    };
    persistSceneApprovals();
    renderSceneApproval(article, index);
  });

  panel.append(head, hint, form);
  article.appendChild(panel);
}

function refreshSceneApprovalPanels() {
  document.querySelectorAll('#chapterDraft .draft-scene').forEach((article, index) => renderSceneApproval(article, index));
}

function revokeSceneApprovalForTarget(target) {
  const match = target.match(/^Kapitel 1 · Szene (\d+)/);
  if (!match) return;
  const number = Number(match[1]);
  const current = sceneApprovals[number] || {};
  sceneApprovals[number] = { ...current, decision: 'changes', approvedAt: '', note: current.note || 'Neuer Änderungswunsch erfasst.' };
  persistSceneApprovals();
}

function appendInlineFormatting(element, text) {
  const fragments = text.split(/(\*\*[^*]+\*\*)/g);
  for (const fragment of fragments) {
    if (fragment.startsWith('**') && fragment.endsWith('**')) {
      const strong = document.createElement('strong');
      strong.textContent = fragment.slice(2, -2);
      element.appendChild(strong);
    } else {
      element.appendChild(document.createTextNode(fragment.replaceAll('`', '')));
    }
  }
}

async function renderChapterDraft() {
  const reader = document.querySelector('#chapterDraft');
  try {
    const response = await fetch('manuskript/KAPITEL_01_ROHENTWURF.md', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    const body = markdown
      .replace(/^#.*\r?\n+/, '')
      .replace(/^\*\*Status:\*\*.*\r?\n+/, '')
      .replace(/<!--[^]*?-->\s*/, '')
      .trim();
    const scenes = body.split(/\r?\n\* \* \*\r?\n/);

    reader.replaceChildren();
    scenes.forEach((scene, index) => {
      const article = document.createElement('article');
      article.className = 'draft-scene';
      article.dataset.changeTarget = `Kapitel 1 · Szene ${index + 1} · ${sceneTitles[index] || 'Fortsetzung'}`;

      const header = document.createElement('div');
      header.className = 'draft-scene-header';
      const label = document.createElement('span');
      label.textContent = `Szene ${String(index + 1).padStart(2, '0')}`;
      const title = document.createElement('h3');
      title.textContent = sceneTitles[index] || `Szene ${index + 1}`;
      header.append(label, title);

      const prose = document.createElement('div');
      prose.className = 'draft-prose';
      scene.split(/\r?\n\r?\n/).map((paragraph) => paragraph.trim()).filter(Boolean).forEach((paragraph) => {
        const p = document.createElement('p');
        appendInlineFormatting(p, paragraph);
        prose.appendChild(p);
      });

      article.append(header, prose);
      reader.appendChild(article);
    });

    setupChangeTargets(reader);
    refreshSceneApprovalPanels();
    updateChapterGate();
  } catch {
    reader.innerHTML = '<p class="reader-error">Der Kapiteltext konnte nicht geladen werden. Bitte die Seite neu laden.</p>';
  }
}

const changeStorageKey = 'haeutung-der-welt-kontextaenderungen-v2';
const authorStorageKey = 'haeutung-der-welt-koautor-kuerzel-v1';
const tray = document.querySelector('#changeTray');
const trayPanel = document.querySelector('#changeTrayPanel');
const trayToggle = document.querySelector('#changeTrayToggle');
const trayCount = document.querySelector('#changeCount');
const trayList = document.querySelector('#changeList');
const trayStatus = document.querySelector('#changeTrayStatus');
const authorField = document.querySelector('#changeAuthor');
let changeNotes = [];

function loadChangeNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(changeStorageKey));
    changeNotes = Array.isArray(saved) ? saved : [];
    authorField.value = localStorage.getItem(authorStorageKey) || '';
  } catch {
    changeNotes = [];
    localStorage.removeItem(changeStorageKey);
  }
}

function persistChangeNotes() {
  localStorage.setItem(changeStorageKey, JSON.stringify(changeNotes));
  renderChangeTray();
  refreshSceneApprovalPanels();
  updateChapterGate();
}

function openTray() {
  trayPanel.hidden = false;
  trayToggle.hidden = true;
  trayToggle.setAttribute('aria-expanded', 'true');
}

function closeTray() {
  trayPanel.hidden = true;
  trayToggle.hidden = false;
  trayToggle.setAttribute('aria-expanded', 'false');
}

function renderChangeTray() {
  trayCount.textContent = String(changeNotes.length);
  trayList.replaceChildren();

  if (!changeNotes.length) {
    const empty = document.createElement('p');
    empty.className = 'tray-empty';
    empty.textContent = 'Noch keine Änderungswünsche erfasst.';
    trayList.appendChild(empty);
    return;
  }

  changeNotes.forEach((note) => {
    const item = document.createElement('article');
    item.className = 'tray-item';
    const head = document.createElement('div');
    head.className = 'tray-item-head';
    const target = document.createElement('strong');
    target.textContent = note.target;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'tray-remove';
    remove.setAttribute('aria-label', `Änderungswunsch zu ${note.target} entfernen`);
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      changeNotes = changeNotes.filter((entry) => entry.id !== note.id);
      persistChangeNotes();
    });
    head.append(target, remove);
    item.appendChild(head);

    if (note.quote) {
      const quote = document.createElement('blockquote');
      quote.textContent = `„${note.quote}“`;
      item.appendChild(quote);
    }

    const request = document.createElement('p');
    request.textContent = note.request;
    item.appendChild(request);
    trayList.appendChild(item);
  });
}

function targetLabel(card) {
  if (card.dataset.changeTarget) return card.dataset.changeTarget;
  const section = card.closest('section');
  const sectionTitle = section?.querySelector(':scope > .section-shell .section-intro h2, :scope > .section-intro h2, h2')?.textContent.trim();
  const cardTitle = card.querySelector('h3, h4')?.textContent.trim();
  const number = card.querySelector(':scope > b')?.textContent.trim();
  return [sectionTitle, number ? `Kapitel ${number}` : '', cardTitle].filter(Boolean).join(' · ') || 'Sichtbare Inhaltskachel';
}

function selectedQuoteWithin(card) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.anchorNode || !card.contains(selection.anchorNode)) return '';
  return selection.toString().replace(/\s+/g, ' ').trim().slice(0, 500);
}

function closeInlineEditors(except) {
  document.querySelectorAll('.inline-change').forEach((panel) => {
    if (panel !== except) panel.remove();
  });
}

function openInlineEditor(card) {
  const existing = card.querySelector(':scope > .inline-change');
  if (existing) {
    existing.remove();
    return;
  }

  const quote = selectedQuoteWithin(card);
  closeInlineEditors();
  const panel = document.createElement('div');
  panel.className = 'inline-change';
  const label = document.createElement('span');
  label.className = 'inline-change-label';
  label.textContent = `Änderung zu: ${targetLabel(card)}`;
  panel.appendChild(label);

  if (quote) {
    const quoteBox = document.createElement('blockquote');
    quoteBox.className = 'inline-change-quote';
    quoteBox.textContent = `Markiert: „${quote}“`;
    panel.appendChild(quoteBox);
  }

  const textarea = document.createElement('textarea');
  textarea.placeholder = quote ? 'Wie soll diese Textstelle geändert werden?' : 'Was soll an dieser Kachel geändert werden?';
  textarea.setAttribute('aria-label', 'Gewünschte Änderung');
  const actions = document.createElement('div');
  actions.className = 'inline-change-actions';
  const save = document.createElement('button');
  save.type = 'button';
  save.className = 'save-context-change';
  save.textContent = 'In Ablage übernehmen';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'Abbrechen';
  actions.append(save, cancel);
  panel.append(textarea, actions);
  card.appendChild(panel);
  textarea.focus();

  cancel.addEventListener('click', () => panel.remove());
  save.addEventListener('click', () => {
    const request = textarea.value.trim();
    if (!request) {
      textarea.focus();
      return;
    }
    const target = targetLabel(card);
    changeNotes.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      target,
      quote,
      request,
      createdAt: today()
    });
    revokeSceneApprovalForTarget(target);
    persistChangeNotes();
    panel.remove();
    openTray();
    trayStatus.textContent = 'Änderungswunsch in die Ablage übernommen.';
  });
}

function setupChangeTargets(root = document) {
  const selectors = [
    '.book-card',
    '.world-grid article',
    '.magic-system',
    '.character-card',
    '.acts article',
    '.chapter-grid article',
    '.blueprint-grid article',
    '.thread-grid article',
    '.quality-gate',
    '.draft-scene',
    '.spoiler-content > div'
  ];

  root.querySelectorAll(selectors.join(',')).forEach((card) => {
    if (card.querySelector(':scope > .context-change-trigger')) return;
    card.classList.add('changeable-card');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'context-change-trigger';
    button.textContent = 'Änderung wünschen';
    button.addEventListener('click', () => openInlineEditor(card));
    card.appendChild(button);
  });
}

function changesDocument() {
  const author = authorField.value.trim() || 'OFFEN';
  const entries = changeNotes.map((note, index) => `${index + 1}. ${note.target}
${note.quote ? `Markierte Textstelle: „${note.quote}“\n` : ''}Wunsch: ${note.request}
Erfasst: ${note.createdAt}`).join('\n\n');
  return `ÄNDERUNGSWÜNSCHE · KAPITEL-1-DRAFT UND SERIENPLAN

Koautor: ${author}
Exportiert: ${today()}
Status: Zur gemeinsamen Prüfung; keine automatische Kanonänderung

${entries}

Vor Annahme sind Figuren, Weltregeln, spätere Kapitel, Foreshadowing und Folgebände zu prüfen.`;
}

trayToggle.addEventListener('click', openTray);
document.querySelector('#closeChangeTray').addEventListener('click', closeTray);
authorField.addEventListener('input', () => localStorage.setItem(authorStorageKey, authorField.value));

document.querySelector('#copyAllChanges').addEventListener('click', async () => {
  if (!changeNotes.length) {
    trayStatus.textContent = 'Noch keine Änderungswünsche vorhanden.';
    return;
  }
  try {
    await navigator.clipboard.writeText(changesDocument());
    trayStatus.textContent = 'Alle Änderungswünsche kopiert.';
  } catch {
    trayStatus.textContent = 'Kopieren war nicht möglich. Bitte herunterladen.';
  }
});

document.querySelector('#downloadAllChanges').addEventListener('click', () => {
  if (!changeNotes.length) {
    trayStatus.textContent = 'Noch keine Änderungswünsche vorhanden.';
    return;
  }
  downloadText(changesDocument(), `aenderungswuensche-kapitel-01-${new Date().toISOString().slice(0, 10)}.txt`);
  trayStatus.textContent = 'Änderungswünsche heruntergeladen.';
});

document.querySelector('#clearAllChanges').addEventListener('click', () => {
  if (!changeNotes.length) return;
  if (!window.confirm('Alle lokal gespeicherten Änderungswünsche wirklich löschen?')) return;
  changeNotes = [];
  persistChangeNotes();
  trayStatus.textContent = 'Änderungsablage geleert.';
});

loadSceneApprovals();
loadChangeNotes();
renderChangeTray();
setupChangeTargets();
updateChapterGate();
renderChapterDraft();
