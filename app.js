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

  return `${label} · DIE HÄUTUNG DER WELT

Protokoll-ID: ${protocolId(form)}
Erstellt: ${form.dataset.protocolDate}
Koautor / geprüft von: ${values.reviewer}
Kapitel: ${values.chapter} · ${values.chapterTitle}
Geprüfte Version: ${values.version}

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
  return `haeutung-der-welt-${form.dataset.kind}-v1`;
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
  approvalForm.addEventListener('submit', (event) => event.preventDefault());
  approvalForm.addEventListener('input', () => saveApprovalDraft(approvalForm));

  const chapterField = approvalForm.elements.namedItem('chapter');
  chapterField.addEventListener('change', () => {
    const index = Number(chapterField.value) - 1;
    if (chapterTitles[index]) approvalForm.elements.namedItem('chapterTitle').value = chapterTitles[index];
    saveApprovalDraft(approvalForm);
  });

  approvalForm.querySelector('[data-action="copy"]').addEventListener('click', () => copyApproval(approvalForm));
  approvalForm.querySelector('[data-action="download"]').addEventListener('click', () => downloadApproval(approvalForm));
});

const changeForm = document.querySelector('#changeForm');
const changeStatus = document.querySelector('#formStatus');
const changeStorageKey = 'haeutung-der-welt-aenderungswunsch-v1';

function changeValues() {
  const data = new FormData(changeForm);
  return {
    author: String(data.get('author') || '').trim(),
    area: String(data.get('area') || '').trim(),
    target: String(data.get('target') || '').trim(),
    request: String(data.get('request') || '').trim(),
    reason: String(data.get('reason') || '').trim(),
    preserve: String(data.get('preserve') || '').trim(),
    impacts: data.getAll('impact').map(String),
    acknowledge: data.get('acknowledge') === 'on'
  };
}

function changeText(values) {
  const impacts = values.impacts.length ? values.impacts.join(', ') : 'noch gemeinsam prüfen';
  return `ÄNDERUNGSWUNSCH · DIE HÄUTUNG DER WELT

Eingebracht von: ${values.author || 'OFFEN'}
Datum: ${today()}
Bereich: ${values.area || 'OFFEN'}
Betroffene Stelle: ${values.target || 'OFFEN'}
Status: Zur gemeinsamen Prüfung

GEWÜNSCHTE ÄNDERUNG
${values.request || 'Noch nicht ausgefüllt.'}

WARUM VERBESSERT DAS DIE GESCHICHTE?
${values.reason || 'Noch nicht ausgefüllt.'}

WAS MUSS ERHALTEN BLEIBEN?
${values.preserve || 'Keine Vorgabe angegeben.'}

AUSWIRKUNGEN PRÜFEN
${impacts}

Hinweis: Dieser Wunsch verändert das Grundgerüst erst nach gemeinsamer Entscheidung.`;
}

function saveChangeDraft() {
  try {
    localStorage.setItem(changeStorageKey, JSON.stringify(changeValues()));
    changeStatus.textContent = 'Entwurf auf diesem Gerät gespeichert.';
  } catch {
    changeStatus.textContent = 'Der Entwurf konnte nicht lokal gespeichert werden.';
  }
}

function restoreChangeDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(changeStorageKey));
    if (!saved) return;
    for (const name of ['author', 'area', 'target', 'request', 'reason', 'preserve']) {
      const field = changeForm.elements.namedItem(name);
      if (field && saved[name] !== undefined) field.value = saved[name];
    }
    changeForm.querySelectorAll('input[name="impact"]').forEach((field) => {
      field.checked = Array.isArray(saved.impacts) && saved.impacts.includes(field.value);
    });
    changeForm.elements.namedItem('acknowledge').checked = Boolean(saved.acknowledge);
    changeStatus.textContent = 'Gespeicherten Entwurf wiederhergestellt.';
  } catch {
    localStorage.removeItem(changeStorageKey);
  }
}

changeForm.addEventListener('input', saveChangeDraft);
changeForm.addEventListener('submit', (event) => event.preventDefault());

document.querySelector('#copyChange').addEventListener('click', async () => {
  if (!changeForm.reportValidity()) return;
  try {
    await navigator.clipboard.writeText(changeText(changeValues()));
    changeStatus.textContent = 'Änderungswunsch in die Zwischenablage kopiert.';
  } catch {
    changeStatus.textContent = 'Kopieren war nicht möglich. Bitte als Textdatei herunterladen.';
  }
});

document.querySelector('#downloadChange').addEventListener('click', () => {
  if (!changeForm.reportValidity()) return;
  const values = changeValues();
  downloadText(changeText(values), `aenderungswunsch-${safeFilename(values.target)}.txt`);
  changeStatus.textContent = 'Textdatei heruntergeladen.';
});

restoreChangeDraft();
