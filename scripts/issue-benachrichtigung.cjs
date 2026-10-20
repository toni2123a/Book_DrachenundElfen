'use strict';

const repository = 'toni2123a/Book_DrachenundElfen';
const recipient = 'toni2123a';

function notificationFor(event) {
  const issue = event?.issue;
  if (event?.action !== 'opened' || !issue || issue.pull_request || !Number.isSafeInteger(issue.number)) return null;
  const protocol = String(issue.body || '').startsWith('<!-- buchwerkstatt:protokoll-');
  if (protocol) {
    if (!/^<!-- buchwerkstatt:protokoll-[a-zA-Z0-9-]+ -->\s+<!-- buchwerkstatt:kapitel-freigegeben -->/.test(String(issue.body || '')) ||
        !['OWNER', 'COLLABORATOR', 'MEMBER'].includes(issue.author_association)) return null;
    return { marker: '<!-- buchwerkstatt-mail:kapitelabnahme -->',
      body: `@${recipient} Eine Kapitelabnahme wurde übermittelt. Das vollständige Protokoll steht in diesem Issue. Bitte vor dem nächsten Kapitel in den Projektstatus übernehmen.\n\n[Kapitel und Freigaben](https://toni2123a.github.io/Book_DrachenundElfen/#freigaben)` };
  }
  return { marker: '<!-- buchwerkstatt-mail:eingang -->',
    body: `@${recipient} Ein neues Issue ist eingegangen. In der Verwaltung kannst du es prüfen und zur Bearbeitung vormerken.\n\n[Issue-Verwaltung öffnen](https://toni2123a.github.io/Book_DrachenundElfen/verwaltung.html)` };
}

async function notify(event, { token, fetch: request = globalThis.fetch } = {}) {
  if (event?.repository?.full_name !== repository) throw new Error('Unerwartetes Repository.');
  const notification = notificationFor(event);
  if (!notification) return { sent: false, reason: 'Kein passendes Ereignis.' };
  if (!token) throw new Error('GitHub-Workflow-Zugang fehlt.');
  const path = `/repos/${repository}/issues/${event.issue.number}/comments`;
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  for (let page = 1; ; page++) {
    const response = await request(`https://api.github.com${path}?per_page=100&page=${page}`, { headers, redirect: 'error', signal: AbortSignal.timeout(25000) });
    if (!response.ok) throw new Error(`Benachrichtigungsprüfung fehlgeschlagen: HTTP ${response.status}`);
    const comments = await response.json();
    if (!Array.isArray(comments)) throw new Error('Ungültige Kommentarliste.');
    if (comments.some(comment => comment.user?.login === 'github-actions[bot]' && String(comment.body || '').includes(notification.marker))) {
      return { sent: false, reason: 'Bereits benachrichtigt.' };
    }
    if (comments.length < 100) break;
  }
  const response = await request(`https://api.github.com${path}`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, redirect: 'error',
    signal: AbortSignal.timeout(25000), body: JSON.stringify({ body: `${notification.marker}\n\n${notification.body}` }) });
  if (response.status !== 201) throw new Error(`Benachrichtigung fehlgeschlagen: HTTP ${response.status}`);
  return { sent: true, reason: 'GitHub-Erwähnung erstellt. E-Mail-Zustellung folgt den persönlichen Kontoeinstellungen.' };
}

module.exports = { notificationFor, notify };

if (require.main === module) {
  const fs = require('node:fs');
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  notify(event, { token: process.env.GITHUB_TOKEN })
    .then(result => console.log(result.reason))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
