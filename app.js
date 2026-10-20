const form = document.querySelector('#changeForm');
const statusMessage = document.querySelector('#formStatus');
const copyButton = document.querySelector('#copyChange');
const downloadButton = document.querySelector('#downloadChange');
const storageKey = 'haeutung-der-welt-aenderungswunsch-v1';

function formValues() {
  const data = new FormData(form);
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
  const date = new Intl.DateTimeFormat('de-DE').format(new Date());
  const impacts = values.impacts.length ? values.impacts.join(', ') : 'noch gemeinsam prüfen';

  return `ÄNDERUNGSWUNSCH · DIE HÄUTUNG DER WELT

Eingebracht von: ${values.author || 'OFFEN'}
Datum: ${date}
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

function saveDraft() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(formValues()));
    statusMessage.textContent = 'Entwurf auf diesem Gerät gespeichert.';
  } catch {
    statusMessage.textContent = 'Der Entwurf konnte nicht lokal gespeichert werden.';
  }
}

function restoreDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return;

    for (const name of ['author', 'area', 'target', 'request', 'reason', 'preserve']) {
      const field = form.elements.namedItem(name);
      if (field && saved[name] !== undefined) field.value = saved[name];
    }

    const selectedImpacts = Array.isArray(saved.impacts) ? saved.impacts : [];
    form.querySelectorAll('input[name="impact"]').forEach((field) => {
      field.checked = selectedImpacts.includes(field.value);
    });

    const acknowledgement = form.elements.namedItem('acknowledge');
    if (acknowledgement) acknowledgement.checked = Boolean(saved.acknowledge);
    statusMessage.textContent = 'Gespeicherten Entwurf wiederhergestellt.';
  } catch {
    localStorage.removeItem(storageKey);
  }
}

async function copyChange() {
  if (!form.reportValidity()) return;

  try {
    await navigator.clipboard.writeText(changeText(formValues()));
    statusMessage.textContent = 'Änderungswunsch in die Zwischenablage kopiert.';
  } catch {
    statusMessage.textContent = 'Kopieren war nicht möglich. Bitte als Textdatei herunterladen.';
  }
}

function downloadChange() {
  if (!form.reportValidity()) return;

  const values = formValues();
  const safeTarget = (values.target || 'aenderungswunsch')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
  const blob = new Blob([changeText(values)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aenderungswunsch-${safeTarget || 'entwurf'}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  statusMessage.textContent = 'Textdatei heruntergeladen.';
}

form.addEventListener('input', saveDraft);
copyButton.addEventListener('click', copyChange);
downloadButton.addEventListener('click', downloadChange);

restoreDraft();
