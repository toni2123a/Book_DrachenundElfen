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
    verdict: 'Rohentwurf v1 erreicht intern 96 von 100 Punkten. Neyras Ziel steht im Einstieg, ihre Freundschaft mit Phae wird durch Hilfe, Verletzung und ein gebrochenes Versprechen greifbar. Die Tal-Linie bleibt als Rätsel vorbereitet.',
    strengths: 'Ziel und erste Abweichung liegen in den ersten 150 Wörtern. Leiterhilfe und Schlussgriff verbinden die drei Szenen emotional. Zwischen den Türbenennungen halten Kapsel, Fluchtweg und Tals Blick die Spannung. Linke Fugenhand, vier zusätzliche Atemzüge und Sprecherrollen sind konsistent; alle sieben roten Fäden bleiben erhalten.',
    risks: 'Die Wirkung der Freundschaft und einige Bildwiederholungen brauchen Leserfeedback. Türprüfung, Elfenalter (D-03), Mutter-Paradox (D-04) und Tals Wiederkehrmechanik bleiben offen. „Nicht schon wieder“ bleibt bewusst doppeldeutig (D-06). Fugenfreie Hände bei der Wiederkehr sind ein ungeklärter Bildvorschlag, keine bestätigte Magieregel.',
    recommendation: 'Rohentwurf v1 liegt über der internen Schwelle von 95 Punkten und bleibt im Draft-Modus. Alle drei Szenen im aktuellen Stand prüfen. Die Versionierung beginnt erst nach dokumentierter Abnahme von Kapitel 1. Kapitelabnahme erst nach Koautorenprüfung der Tal-Linie (E-010) sowie Entscheidung oder bewusster Offenhaltung der Deltas. 9,6/10 ist eine Selbsteinschätzung und keine unabhängige Qualitätsgarantie.'
  }
};

// Maßgeblich ist die übermittelte und im Projekt protokollierte Kapitelabnahme.
let firstChapterApprovalRecorded = false;

async function loadProjectApproval() {
  firstChapterApprovalRecorded = false;
  try {
    const response = await fetch('produktion/FREIGABESTATUS.json', { cache: 'no-store' });
    if (!response.ok) return;
    const status = await response.json();
    firstChapterApprovalRecorded = status.kapitel1Abgenommen === true;
  } catch {
    // Ohne bestätigten Projektstatus bleiben Fundamentänderungen möglich und die Versionierung aus.
  }
}

const editPolicyDefinitions = {
  foundation: {
    label: 'Flexibel bis Kapitel 1',
    help: 'Bis zur dokumentierten Abnahme von Kapitel 1 sind hier direkte Änderungswünsche möglich. Danach wird dieses Fundament gesperrt; Änderungen benötigen dann eine begründete Kanonentscheidung mit Folgenprüfung.'
  },
  draft: {
    label: 'Kapitel-Draft',
    help: 'Dieser Inhalt gehört zur aktuellen Textfassung. Wünsche sind bis zur Szenen- beziehungsweise Kapitelabnahme möglich. Ein neuer Wunsch hebt die Freigabe der betroffenen Szene auf.'
  },
  fixed: {
    label: 'Verbindlicher Rahmen',
    help: 'Dieser Bereich hält die Identität des Projekts oder den Prüf- und Freigaberahmen stabil. Er wird nicht über beiläufige Änderungswünsche verändert, sondern nur durch eine ausdrückliche Projektentscheidung.'
  },
  lockedFoundation: {
    label: 'Fundament fixiert',
    help: 'Kapitel 1 ist abgenommen. Dieses Fundament ist deshalb für direkte Wünsche gesperrt. Eine Änderung erfordert eine neue Kanonentscheidung und eine Prüfung aller betroffenen Kapitel.'
  }
};

function addEditPolicyMarker(element, policyName) {
  if (element.querySelector(':scope > .edit-policy-marker')) return;
  const definition = editPolicyDefinitions[policyName];
  const marker = document.createElement('span');
  marker.className = `edit-policy-marker ${policyName}`;
  marker.tabIndex = 0;
  marker.setAttribute('role', 'note');
  marker.setAttribute('aria-label', `${definition.label}: ${definition.help}`);
  marker.title = definition.help;

  const label = document.createElement('span');
  label.textContent = definition.label;
  const info = document.createElement('b');
  info.setAttribute('aria-hidden', 'true');
  info.textContent = 'i';
  const tooltip = document.createElement('span');
  tooltip.className = 'edit-policy-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.textContent = definition.help;
  marker.append(label, info, tooltip);
  const alignTooltip = () => {
    const markerBox = marker.getBoundingClientRect();
    const tooltipWidth = Math.min(330, window.innerWidth * 0.78);
    tooltip.classList.toggle('align-right', markerBox.left + tooltipWidth > window.innerWidth - 16);
  };
  marker.addEventListener('mouseenter', alignTooltip);
  marker.addEventListener('focus', alignTooltip);
  element.appendChild(marker);
}

function applyEditPolicies(root = document) {
  const foundationPolicy = firstChapterApprovalRecorded ? 'lockedFoundation' : 'foundation';
  const groups = [
    {
      selector: '.quick-facts > div, .book-card, #welt .world-grid article, #welt .magic-system, #figuren .character-card, #band1 .acts article, #band1 .chapter-grid article, .secrets .spoiler-content > div',
      policy: foundationPolicy
    },
    {
      selector: '#kapitel1 .blueprint-grid article, #kapitel1 .thread-grid article, #kapitel1 .quality-gate, #kapitel1 .chapter-assessment, #kapitel1 .draft-scene',
      policy: 'draft'
    },
    {
      selector: '.manifest, .quality-section > .section-shell',
      policy: 'fixed'
    }
  ];

  groups.forEach(({ selector, policy }) => {
    root.querySelectorAll(selector).forEach((element) => {
      element.dataset.editPolicy = policy;
      addEditPolicyMarker(element, policy);
    });
  });
}

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
  return `haeutung-der-welt-${form.dataset.kind}-neustart-20261020`;
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
    for (const name of ['chapter', 'chapterTitle', 'version', 'decision', 'notes']) {
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

async function sendApproval(form) {
  const status = form.querySelector('.form-status');
  if (form.dataset.kind === 'kapitelabnahme' && !allScenesApproved()) {
    status.textContent = 'Kapitelabnahme gesperrt: Erst alle Szenen freigeben.';
    return;
  }
  if (!form.reportValidity()) return;
  if (!githubClient) {
    status.textContent = 'Bitte zuerst mit GitHub verbinden. Das Protokoll bleibt hier erhalten.';
    document.querySelector('#githubConnection').open = true;
    document.querySelector('#githubToken').focus();
    return;
  }
  const button = form.querySelector('[data-action="send"]');
  if (button.disabled) return;
  button.disabled = true;
  const values = approvalValues(form);
  const text = approvalText(form);
  try {
    status.textContent = 'Freigabe wird an GitHub übermittelt …';
    const issue = await githubClient.createApproval({ id: `protokoll-${protocolId(form)}`, kind: form.dataset.kind,
      chapter: Number(values.chapter), decision: values.decision, text });
    status.replaceChildren(document.createTextNode('Freigabeprotokoll übermittelt. '));
    const link = document.createElement('a');
    link.href = issue.url;
    link.textContent = `Issue #${issue.number} öffnen`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    status.appendChild(link);
  } catch (error) {
    status.textContent = error.message;
  } finally {
    button.disabled = form.dataset.kind === 'kapitelabnahme' && !allScenesApproved();
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
  approvalForm.querySelector('[data-action="send"]').addEventListener('click', () => sendApproval(approvalForm));
});

document.querySelectorAll('.chapter-assessment[data-chapter-assessment]').forEach((container) => {
  renderChapterAssessment(container, container.dataset.chapterAssessment);
});

const sceneTitles = [
  'Das gestohlene Gestern',
  'Das Fest der benannten Türen',
  'Der Name, den es nicht gibt'
];

const sceneApprovalStorageKey = 'haeutung-der-welt-kapitel-01-szenenfreigaben-neustart-20261020';
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

// Frühere Szenenfassungen werden mit scripts/szenenfassung.ps1 abgelegt und hier zum Vergleich angeboten.
const sceneVersionDirectory = 'manuskript/fassungen';
const sceneVersionManifestPath = `${sceneVersionDirectory}/KAPITEL_01_FASSUNGEN.json`;
let sceneVersions = {};
const sceneVersionTexts = new Map();

async function loadSceneVersions() {
  sceneVersions = {};
  if (!firstChapterApprovalRecorded) return;
  try {
    const response = await fetch(sceneVersionManifestPath, { cache: 'no-store' });
    if (!response.ok) return;
    const manifest = await response.json();
    (manifest.szenen || []).forEach((entry) => {
      sceneVersions[Number(entry.szene)] = entry;
    });
  } catch {
    sceneVersions = {};
  }
}

function currentSceneVersion(number) {
  return sceneVersions[number]?.aktuell || 'v1';
}

function approvedSceneVersion(number) {
  const approval = sceneApprovals[number];
  return approval?.decision === 'approved' ? approval.fassung || 'v1' : '';
}

function sceneApproved(number) {
  return approvedSceneVersion(number) === currentSceneVersion(number) && sceneChangeCount(number) === 0;
}

function allScenesApproved() {
  return sceneTitles.every((_, index) => sceneApproved(index + 1));
}

function sceneApprovalText() {
  return sceneTitles.map((title, index) => {
    const number = index + 1;
    const approval = sceneApprovals[number];
    if (!approval || approval.decision !== 'approved') return `- Szene ${number}: ${title} · NICHT FREIGEGEBEN`;
    const version = approvedSceneVersion(number);
    const restoreHint = version === currentSceneVersion(number) ? '' : ' · Vorfassung, noch nicht im Manuskript wiederhergestellt';
    return `- Szene ${number}: ${title} · Fassung ${version} FREIGEGEBEN am ${approval.approvedAt}${restoreHint}${approval.note ? ` · ${approval.note}` : ''}`;
  }).join('\n');
}

function updateChapterGate() {
  const approvedCount = sceneTitles.filter((_, index) => sceneApproved(index + 1)).length;
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
  const currentVersion = currentSceneVersion(number);
  const shownVersion = article.dataset.fassung || currentVersion;
  const approvedVersion = approvedSceneVersion(number);
  const olderApproved = approvedVersion && approvedVersion !== currentVersion && openChanges === 0;
  const state = sceneApproved(number) ? 'is-approved' : olderApproved ? 'is-older' : saved.decision === 'changes' || openChanges ? 'needs-changes' : '';
  const panel = document.createElement('section');
  panel.className = `scene-approval ${state}`;
  panel.setAttribute('aria-label', `Freigabe für Szene ${number}`);

  const head = document.createElement('div');
  head.className = 'scene-approval-head';
  const title = document.createElement('strong');
  title.textContent = `Szenenfreigabe · ${String(number).padStart(2, '0')}`;
  const badge = document.createElement('span');
  badge.textContent = {
    'is-approved': 'Freigegeben',
    'is-older': `Vorfassung ${approvedVersion} gewählt`,
    'needs-changes': 'Änderung nötig'
  }[state] || 'Prüfung offen';
  head.append(title, badge);

  const hint = document.createElement('p');
  if (openChanges) {
    hint.textContent = `${openChanges} offener Änderungswunsch. Nach der Überarbeitung muss diese Szene erneut freigegeben werden.`;
  } else if (olderApproved) {
    hint.textContent = `Freigegeben wurde die Vorfassung ${approvedVersion}. Sie wird im Manuskript wiederhergestellt; erst dann zählt die Freigabe für die Kapitelabnahme.`;
  } else if (shownVersion !== currentVersion) {
    hint.textContent = `Angezeigt wird die Vorfassung ${shownVersion}. Eine Freigabe hier bedeutet: Diese Fassung soll statt ${currentVersion} zurück ins Manuskript.`;
  } else {
    hint.textContent = 'Text prüfen und die Szene freigeben oder Überarbeitung anfordern. Für eine bestimmte Stelle diese vorher im Text markieren.';
  }

  const form = document.createElement('form');
  form.className = 'scene-approval-form';
  const decision = document.createElement('select');
  decision.required = true;
  const approveText = shownVersion === currentVersion ? 'Szene freigeben' : `Vorfassung ${shownVersion} freigeben`;
  [['', 'Bitte auswählen'], ['approved', approveText], ['changes', 'Überarbeitung erforderlich']].forEach(([value, text]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    option.selected = saved.decision === value && (value !== 'approved' || approvedVersion === shownVersion);
    decision.appendChild(option);
  });
  const note = document.createElement('textarea');
  note.rows = 2;
  note.placeholder = 'Bei Überarbeitung: Was soll sich ändern? Bei Freigabe optional.';
  note.value = saved.decision === 'approved' ? saved.note || '' : '';
  const quoteBox = document.createElement('blockquote');
  quoteBox.className = 'scene-approval-quote';
  quoteBox.hidden = true;
  const save = document.createElement('button');
  save.type = 'submit';
  save.className = 'button button-primary';
  save.textContent = 'Szenenentscheidung speichern';
  const status = document.createElement('p');
  status.className = 'scene-approval-status';
  status.setAttribute('role', 'status');
  status.textContent = saved.approvedAt ? `Gespeichert: ${saved.approvedAt} · Fassung ${approvedVersion}` : 'Noch keine Szenenentscheidung gespeichert.';

  const showQuote = () => {
    quoteBox.hidden = !article.dataset.quote || decision.value !== 'changes';
    quoteBox.textContent = `Markierte Textstelle: „${article.dataset.quote || ''}“`;
  };
  decision.addEventListener('change', showQuote);
  article.showSceneQuote = showQuote;

  form.append(sceneField('Entscheidung', decision), sceneField('Vermerk', note), quoteBox, save, status);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (decision.value === 'approved' && sceneChangeCount(number) > 0) {
      status.textContent = 'Freigabe nicht möglich: Zuerst die offenen Änderungswünsche abarbeiten und aus der Ablage entfernen.';
      return;
    }
    if (decision.value === 'changes' && !note.value.trim()) {
      status.textContent = 'Bitte festhalten, was überarbeitet werden soll.';
      note.focus();
      return;
    }
    sceneApprovals[number] = {
      decision: decision.value,
      note: decision.value === 'approved' ? note.value.trim() : '',
      fassung: shownVersion,
      approvedAt: decision.value === 'approved' ? today() : ''
    };
    persistSceneApprovals();
    if (decision.value === 'changes') {
      // Der Überarbeitungswunsch landet in der Ablage und blockiert die Freigabe, bis er erledigt ist.
      addChangeNote({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        target: article.dataset.changeTarget,
        quote: article.dataset.quote || '',
        request: note.value.trim(),
        createdAt: today()
      });
      delete article.dataset.quote;
      return;
    }
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

function sceneParagraphs(text) {
  return text.split(/\r?\n\r?\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function renderSceneProse(prose, text, compareText = '') {
  const known = new Set(sceneParagraphs(compareText));
  prose.replaceChildren();
  sceneParagraphs(text).forEach((paragraph) => {
    const p = document.createElement('p');
    if (compareText && !known.has(paragraph)) p.className = 'is-changed';
    appendInlineFormatting(p, paragraph);
    prose.appendChild(p);
  });
}

async function sceneVersionText(file) {
  if (!sceneVersionTexts.has(file)) {
    const response = await fetch(`${sceneVersionDirectory}/${file}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    sceneVersionTexts.set(file, (await response.text()).trim());
  }
  return sceneVersionTexts.get(file);
}

function renderSceneVersionSwitch(article, index, currentText, prose) {
  const number = index + 1;
  const entry = sceneVersions[number];
  if (!entry?.vorher?.length) return;

  const baseTarget = article.dataset.changeTarget;
  const current = { fassung: entry.aktuell || 'v1', label: `${entry.aktuell || 'v1'} · aktuell` };
  const earlier = entry.vorher.slice().reverse().map((version) => ({ ...version, label: `${version.fassung} · vorher` }));
  const versions = [current, ...earlier];
  let shown = current;

  const bar = document.createElement('div');
  bar.className = 'scene-versions';
  const group = document.createElement('div');
  group.className = 'scene-version-buttons';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', `Fassungen von Szene ${number}`);
  const compareLabel = document.createElement('label');
  compareLabel.className = 'scene-version-compare';
  const compare = document.createElement('input');
  compare.type = 'checkbox';
  compareLabel.append(compare, document.createTextNode(' Änderungen hervorheben'));
  const info = document.createElement('p');
  info.className = 'scene-version-info';
  info.setAttribute('role', 'status');

  const show = async (version) => {
    try {
      const text = version === current ? currentText : await sceneVersionText(version.datei);
      // Aktuelle Fassung wird mit der jüngsten Vorfassung verglichen, jede Vorfassung mit der aktuellen.
      const other = version === current ? earlier[0] : current;
      let otherText = '';
      if (compare.checked) otherText = other === current ? currentText : await sceneVersionText(other.datei);
      shown = version;
      renderSceneProse(prose, text, otherText);
      article.dataset.fassung = version.fassung;
      article.dataset.changeTarget = version === current ? baseTarget : `${baseTarget} · Fassung ${version.fassung}`;
      article.classList.toggle('shows-older-version', version !== current);
      group.querySelectorAll('button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.fassung === version.fassung)));
      info.textContent = version === current
        ? `Aktuelle Fassung im Manuskript${entry.aktuellSeit ? ` seit ${entry.aktuellSeit}` : ''}.${compare.checked ? ` Markiert: neu gegenüber ${other.fassung}.` : ''}`
        : `Vorfassung ${version.fassung}, ersetzt am ${version.datum}${version.anlass ? ` · Anlass: ${version.anlass}` : ''}.${compare.checked ? ` Markiert: später geändert in ${current.fassung}.` : ''}`;
      renderSceneApproval(article, index);
    } catch {
      info.textContent = `Fassung ${version.fassung} konnte nicht geladen werden.`;
    }
  };

  versions.forEach((version) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.fassung = version.fassung;
    button.textContent = version.label;
    button.addEventListener('click', () => show(version));
    group.appendChild(button);
  });
  compare.addEventListener('change', () => show(shown));

  bar.append(group, compareLabel, info);
  article.querySelector('.draft-scene-header').after(bar);
  show(current);
}

async function renderChapterDraft() {
  const reader = document.querySelector('#chapterDraft');
  try {
    await loadSceneVersions();
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
      renderSceneProse(prose, scene);
      article.dataset.fassung = currentSceneVersion(index + 1);

      article.append(header, prose);
      reader.appendChild(article);
      renderSceneVersionSwitch(article, index, scene, prose);
    });

    applyEditPolicies();
    setupChangeTargets(reader);
    refreshSceneApprovalPanels();
    updateChapterGate();
  } catch {
    reader.innerHTML = '<p class="reader-error">Der Kapiteltext konnte nicht geladen werden. Bitte die Seite neu laden.</p>';
  }
}

const changeStorageKey = 'haeutung-der-welt-kontextaenderungen-v3';
const tray = document.querySelector('#changeTray');
const trayPanel = document.querySelector('#changeTrayPanel');
const trayToggle = document.querySelector('#changeTrayToggle');
const trayCount = document.querySelector('#changeCount');
const trayList = document.querySelector('#changeList');
const trayStatus = document.querySelector('#changeTrayStatus');
let changeNotes = [];
let githubClient = null;
let syncRun = null;
const syncingIds = new Set();

function addChangeNote(note) {
  changeNotes.push(note);
  revokeSceneApprovalForTarget(note.target);
  persistChangeNotes();
  openTray();
  trayStatus.textContent = githubClient ? 'Änderungswunsch gespeichert. Issue wird übermittelt …' : 'Änderungswunsch gespeichert. Für automatische Issues bitte mit GitHub verbinden.';
  void sendPendingChanges();
}

async function sendPendingChanges() {
  if (!githubClient || syncRun) return syncRun;
  syncRun = (async () => {
    while (githubClient) {
      const note = changeNotes.find(entry => !entry.githubIssue);
      if (!note) break;
      syncingIds.add(note.id);
      delete note.syncError;
      renderChangeTray();
      try {
        note.githubIssue = await githubClient.createChange(note);
        trayStatus.textContent = `Issue #${note.githubIssue.number} wurde erstellt. Weitere Wünsche werden automatisch gesendet.`;
      } catch (error) {
        note.syncError = error.message;
        trayStatus.textContent = `Noch nicht übermittelt: ${error.message}`;
        if (error.status === 401) disconnectGitHub();
        break;
      } finally {
        syncingIds.delete(note.id);
        persistChangeNotes();
      }
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
  })();
  try { await syncRun; } finally { syncRun = null; renderChangeTray(); }
}

function disconnectGitHub() {
  githubClient?.disconnect();
  githubClient = null;
  document.querySelector('#githubDisconnect').hidden = true;
  document.querySelector('#githubToken').disabled = false;
  document.querySelector('#githubConnectForm button[type="submit"]').disabled = false;
  document.querySelector('#githubConnectionStatus').textContent = 'Verbindung getrennt. Nicht übermittelte Wünsche bleiben auf diesem Gerät.';
}

document.querySelector('#githubConnectForm').addEventListener('submit', async event => {
  event.preventDefault();
  const field = document.querySelector('#githubToken');
  const button = event.currentTarget.querySelector('button[type="submit"]');
  const status = document.querySelector('#githubConnectionStatus');
  if (!field.value.trim() || button.disabled) return;
  button.disabled = true;
  let candidate;
  try {
    candidate = BookIssues.createClient({ token: field.value });
    field.value = '';
    const user = await candidate.connect();
    githubClient = candidate;
    field.disabled = true;
    document.querySelector('#githubDisconnect').hidden = false;
    status.textContent = `Verbunden als ${user.login}. Vorhandene und neue Änderungswünsche werden automatisch an GitHub gesendet.`;
    await sendPendingChanges();
  } catch (error) {
    candidate?.disconnect();
    field.value = '';
    button.disabled = false;
    status.textContent = error.message;
  }
});
document.querySelector('#githubDisconnect').addEventListener('click', disconnectGitHub);
document.querySelector('#sendPendingChanges').addEventListener('click', () => {
  if (!githubClient) {
    document.querySelector('#githubConnection').open = true;
    document.querySelector('#githubToken').focus();
    trayStatus.textContent = 'Bitte zuerst mit GitHub verbinden.';
    return;
  }
  void sendPendingChanges();
});
window.addEventListener('online', () => { if (githubClient) void sendPendingChanges(); });

function loadChangeNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(changeStorageKey));
    changeNotes = Array.isArray(saved) ? saved : [];
  } catch {
    changeNotes = [];
    localStorage.removeItem(changeStorageKey);
  }
}

function persistChangeNotes() {
  try { localStorage.setItem(changeStorageKey, JSON.stringify(changeNotes)); }
  catch { trayStatus.textContent = 'Lokales Speichern ist nicht möglich. Bitte Wünsche übermitteln oder herunterladen, bevor du diese Seite schließt.'; }
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
  document.querySelector('#clearAllChanges').disabled = syncingIds.size > 0;
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
    remove.disabled = syncingIds.has(note.id);
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
    const sync = document.createElement('p');
    sync.className = 'issue-sync-status';
    if (note.githubIssue?.number) {
      const link = document.createElement('a');
      link.href = `${BookIssues.repositoryUrl}/issues/${Number(note.githubIssue.number)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `Issue #${note.githubIssue.number} auf GitHub`;
      sync.appendChild(link);
    } else {
      sync.textContent = syncingIds.has(note.id) ? 'Wird an GitHub gesendet …' : note.syncError || 'Noch nicht an GitHub übermittelt.';
    }
    item.appendChild(sync);
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
    addChangeNote({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      target,
      quote,
      request,
      createdAt: today()
    });
    panel.remove();
  });
}

function setupChangeTargets(root = document) {
  const selectors = [
    '.quick-facts > div',
    '.book-card',
    '.world-grid article',
    '.magic-system',
    '.character-card',
    '.acts article',
    '.chapter-grid article',
    '.blueprint-grid article',
    '.thread-grid article',
    '.quality-gate',
    '.chapter-assessment',
    '.spoiler-content > div'
  ];

  root.querySelectorAll(selectors.join(',')).forEach((card) => {
    if (card.dataset.editPolicy === 'fixed' || card.dataset.editPolicy === 'lockedFoundation') {
      card.querySelector(':scope > .context-change-trigger')?.remove();
      return;
    }
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
  const entries = changeNotes.map((note, index) => `${index + 1}. ${note.target}
${note.quote ? `Markierte Textstelle: „${note.quote}“\n` : ''}Wunsch: ${note.request}
Erfasst: ${note.createdAt}${note.githubIssue ? `\nGitHub: ${note.githubIssue.url}` : '\nGitHub: noch nicht übermittelt'}`).join('\n\n');
  return `ÄNDERUNGSWÜNSCHE · KAPITEL-1-DRAFT UND SERIENPLAN

Exportiert: ${today()}
Status: Zur gemeinsamen Prüfung; keine automatische Kanonänderung

${entries}

Vor Annahme sind Figuren, Weltregeln, spätere Kapitel, Foreshadowing und Folgebände zu prüfen.`;
}

trayToggle.addEventListener('click', openTray);
document.querySelector('#closeChangeTray').addEventListener('click', closeTray);
// Markierter Text in einer Szene wird bei „Überarbeitung erforderlich“ als Zitat mitgenommen.
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  const article = selection?.anchorNode?.parentElement?.closest('#chapterDraft .draft-scene');
  if (!article || selection.isCollapsed || !article.querySelector('.draft-prose').contains(selection.anchorNode)) return;
  article.dataset.quote = selection.toString().replace(/\s+/g, ' ').trim().slice(0, 500);
  article.showSceneQuote?.();
});

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
  if (syncingIds.size) return;
  if (!changeNotes.length) return;
  if (!window.confirm('Alle lokal gespeicherten Änderungswünsche wirklich löschen?')) return;
  changeNotes = [];
  persistChangeNotes();
  trayStatus.textContent = 'Änderungsablage geleert.';
});

const navToggle = document.querySelector('#navToggle');
const mainNav = document.querySelector('#mainNav');

function closeMainNav() {
  mainNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Menü öffnen');
}

navToggle.addEventListener('click', () => {
  const shouldOpen = !mainNav.classList.contains('is-open');
  mainNav.classList.toggle('is-open', shouldOpen);
  navToggle.setAttribute('aria-expanded', String(shouldOpen));
  navToggle.setAttribute('aria-label', shouldOpen ? 'Menü schließen' : 'Menü öffnen');
});

mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMainNav));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMainNav();
});
document.addEventListener('click', (event) => {
  if (!mainNav.classList.contains('is-open')) return;
  if (mainNav.contains(event.target) || navToggle.contains(event.target)) return;
  closeMainNav();
});

async function initializeProject() {
  await loadProjectApproval();
  loadSceneApprovals();
  loadChangeNotes();
  renderChangeTray();
  applyEditPolicies();
  setupChangeTargets();
  updateChapterGate();
  await renderChapterDraft();
}

initializeProject();
