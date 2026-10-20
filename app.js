const form = document.querySelector('#ideaForm');
const statusMessage = document.querySelector('#formStatus');
const copyButton = document.querySelector('#copyIdea');
const storageKey = 'drachen-und-elfen-ideenentwurf-v1';
const issueBaseUrl = 'https://github.com/toni2123a/Book_DrachenundElfen/issues/new';

function formValues() {
  const data = new FormData(form);
  return {
    author: String(data.get('author') || '').trim(),
    type: String(data.get('type') || '').trim(),
    title: String(data.get('title') || '').trim(),
    proposal: String(data.get('proposal') || '').trim(),
    reason: String(data.get('reason') || '').trim(),
    consequences: String(data.get('consequences') || '').trim(),
    acknowledge: data.get('acknowledge') === 'on'
  };
}

function ideaMarkdown(values) {
  const date = new Intl.DateTimeFormat('sv-SE').format(new Date());
  return `## Ideenkarte

- **Eingebracht von:** ${values.author || 'OFFEN'}
- **Datum:** ${date}
- **Typ:** ${values.type || 'Sonstiges'}
- **Status:** Neu

### Vorschlag

${values.proposal || 'Noch nicht ausgefüllt.'}

### Warum interessant?

${values.reason || 'Noch nicht ausgefüllt.'}

### Mögliche Folgen und offene Fragen

${values.consequences || 'Noch keine angegeben.'}

---

*Über die GitHub-Pages-Buchwerkstatt eingereicht. Dieser Vorschlag wird erst nach gemeinsamer Entscheidung zum Kanon.*`;
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
    for (const [name, value] of Object.entries(saved)) {
      const field = form.elements.namedItem(name);
      if (!field) continue;
      if (field.type === 'checkbox') field.checked = Boolean(value);
      else field.value = value;
    }
    statusMessage.textContent = 'Gespeicherten Entwurf wiederhergestellt.';
  } catch {
    localStorage.removeItem(storageKey);
  }
}

form.addEventListener('input', saveDraft);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const values = formValues();
  const params = new URLSearchParams({
    title: `Idee: ${values.title}`,
    body: ideaMarkdown(values),
    labels: 'idee'
  });

  statusMessage.textContent = 'GitHub wird in einem neuen Tab geöffnet. Dort die Einreichung bestätigen.';
  window.open(`${issueBaseUrl}?${params.toString()}`, '_blank', 'noopener,noreferrer');
});

copyButton.addEventListener('click', async () => {
  const text = `Idee: ${formValues().title || 'Ohne Titel'}\n\n${ideaMarkdown(formValues())}`;
  try {
    await navigator.clipboard.writeText(text);
    statusMessage.textContent = 'Ideenkarte in die Zwischenablage kopiert.';
  } catch {
    statusMessage.textContent = 'Kopieren war nicht möglich. Bitte den GitHub-Weg verwenden.';
  }
});

restoreDraft();
