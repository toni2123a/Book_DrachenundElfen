'use strict';

const stageNames = { new: 'Neu', approved: 'Freigegeben', working: 'In Arbeit', deferred: 'Zurückgestellt', done: 'Erledigt', rejected: 'Abgelehnt' };
const loginForm = document.querySelector('#adminConnectForm');
const loginStatus = document.querySelector('#adminConnectionStatus');
const workspace = document.querySelector('#adminWorkspace');
const issueList = document.querySelector('#adminIssues');
const actionStatus = document.querySelector('#adminActionStatus');
let client = null;
let issues = [];
let busy = false;

function disconnect() {
  client?.disconnect();
  client = null;
  issues = [];
  issueList.replaceChildren();
  workspace.hidden = true;
  document.querySelector('#adminDisconnect').hidden = true;
  document.querySelector('#adminToken').disabled = false;
  loginForm.querySelector('button[type="submit"]').disabled = false;
  loginStatus.textContent = 'Abgemeldet. Der Zugangsschlüssel wurde aus dieser Sitzung entfernt.';
}

function renderIssues() {
  const stage = document.querySelector('#issueFilter').value;
  const search = document.querySelector('#issueSearch').value.trim().toLocaleLowerCase('de');
  const shown = issues.filter(issue => (stage === 'all' || (stage === 'open' ? issue.state === 'open' : BookIssues.issueStage(issue) === stage)) &&
    (!search || `${issue.title}\n${issue.body || ''}`.toLocaleLowerCase('de').includes(search)));
  issueList.replaceChildren();
  const approved = issues.filter(issue => ['approved', 'working'].includes(BookIssues.issueStage(issue))).length;
  document.querySelector('#issueSummary').textContent = `${shown.length} angezeigt · ${issues.filter(issue => issue.state === 'open').length} offen · ${approved} zur Bearbeitung vorgemerkt`;
  if (!shown.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Keine Issues für diese Auswahl.';
    issueList.appendChild(empty);
  }
  for (const issue of shown) {
    const article = document.createElement('article');
    article.className = 'admin-issue';
    const head = document.createElement('div');
    head.className = 'admin-issue-heading';
    const title = document.createElement('h3');
    const link = document.createElement('a');
    link.href = BookIssues.issueReference(issue).url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `#${issue.number} ${issue.title}`;
    title.appendChild(link);
    const badge = document.createElement('span');
    badge.className = 'issue-stage';
    const isProtocol = String(issue.body || '').startsWith('<!-- buchwerkstatt:protokoll-');
    badge.textContent = isProtocol ? 'Freigabeprotokoll' : stageNames[BookIssues.issueStage(issue)];
    head.append(title, badge);
    const author = document.createElement('p');
    author.textContent = `Von ${issue.user?.login || 'GitHub'} · ${new Date(issue.created_at).toLocaleDateString('de-DE')}`;
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Bezug und vollständigen Wunsch lesen';
    const body = document.createElement('pre');
    body.textContent = String(issue.body || 'Kein weiterer Text.').replace(/<!-- buchwerkstatt:[\s\S]*?-->/g, '').trim();
    details.append(summary, body);
    const form = document.createElement('form');
    form.className = 'admin-stage-form';
    const label = document.createElement('label');
    label.textContent = `Bearbeitungsstatus für Issue #${issue.number}`;
    const select = document.createElement('select');
    for (const [key, name] of Object.entries(stageNames)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = name;
      option.selected = BookIssues.issueStage(issue) === key;
      select.appendChild(option);
    }
    const save = document.createElement('button');
    save.type = 'submit';
    save.className = 'button button-primary';
    save.textContent = 'Status speichern';
    label.appendChild(select);
    form.append(label, save);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy || !client) return;
      busy = true;
      workspace.setAttribute('aria-busy', 'true');
      workspace.querySelectorAll('button, select').forEach(control => { control.disabled = true; });
      try {
        const updated = await client.setStage(issue.number, select.value);
        if (!client) return;
        issues = issues.map(item => item.number === updated.number ? updated : item);
        actionStatus.textContent = `Issue #${issue.number}: ${stageNames[BookIssues.issueStage(updated)]}. Eine vorgemerkte Änderung wird anschließend gesondert umgesetzt.`;
      } catch (error) {
        actionStatus.textContent = error.message;
        if (error.status === 401) disconnect();
      } finally {
        busy = false;
        workspace.setAttribute('aria-busy', 'false');
        workspace.querySelectorAll('button, select').forEach(control => { control.disabled = false; });
        if (client) renderIssues();
      }
    });
    article.append(head, author, details);
    if (!isProtocol) article.appendChild(form);
    issueList.appendChild(article);
  }
}

async function refreshIssues() {
  if (!client || busy) return;
  busy = true;
  document.querySelector('#refreshIssues').disabled = true;
  actionStatus.textContent = 'Issues werden geladen …';
  try {
    const loaded = await client.listIssues();
    if (!client) return;
    issues = loaded;
    renderIssues();
    actionStatus.textContent = 'Issue-Liste ist aktuell.';
  } catch (error) {
    actionStatus.textContent = error.message;
    if (error.status === 401) disconnect();
  } finally {
    busy = false;
    document.querySelector('#refreshIssues').disabled = false;
  }
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const field = document.querySelector('#adminToken');
  const button = loginForm.querySelector('button[type="submit"]');
  if (!field.value.trim() || button.disabled) return;
  button.disabled = true;
  let candidate;
  try {
    candidate = BookIssues.createClient({ token: field.value });
    field.value = '';
    loginStatus.textContent = 'GitHub-Zugang wird geprüft …';
    const user = await candidate.connect({ manage: true });
    client = candidate;
    field.disabled = true;
    document.querySelector('#adminDisconnect').hidden = false;
    workspace.hidden = false;
    loginStatus.textContent = `Verbunden als ${user.login}. Du kannst Issues prüfen und zur Bearbeitung freigeben.`;
    await refreshIssues();
  } catch (error) {
    candidate?.disconnect();
    field.value = '';
    button.disabled = false;
    loginStatus.textContent = error.message;
  }
});

document.querySelector('#adminDisconnect').addEventListener('click', disconnect);
document.querySelector('#refreshIssues').addEventListener('click', refreshIssues);
document.querySelector('#issueFilter').addEventListener('change', renderIssues);
document.querySelector('#issueSearch').addEventListener('input', renderIssues);
document.querySelector('#exportApproved').addEventListener('click', () => {
  const approved = issues.filter(issue => ['approved', 'working'].includes(BookIssues.issueStage(issue)));
  if (!approved.length) { actionStatus.textContent = 'Noch keine Änderungen zur Bearbeitung freigegeben.'; return; }
  const text = ['# Freigegebene Arbeitsliste', 'Zur Bearbeitung vorgemerkt. Vor Umsetzung Kanon und Folgekapitel prüfen.',
    ...approved.map(issue => `## #${issue.number} ${issue.title}\n\nStatus: ${stageNames[BookIssues.issueStage(issue)]}\n\n${BookIssues.issueReference(issue).url}\n\n${issue.body || ''}`)].join('\n\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `buchwerkstatt-arbeitsliste-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});
