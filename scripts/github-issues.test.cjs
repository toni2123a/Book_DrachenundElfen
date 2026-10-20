'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createClient, changePayload, approvalPayload, issueStage, repository } = require('../github-issues.js');
const { notificationFor, notify } = require('./issue-benachrichtigung.cjs');
const base = `/repos/${repository}`;
const note = { id: 'test-123', target: 'Kapitel 1 · Szene 1', quote: 'Tal kam nie zu spät.', request: 'Die Motivation früher zeigen.', createdAt: '20.10.2026' };
const response = (value, status = 200) => new Response(JSON.stringify(value), { status });

function server({ manage = true, failure = null } = {}) {
  const state = { issues: [], comments: [], calls: [], loseNextPost: false };
  state.fetch = async (url, options = {}) => {
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://api.github.com');
    const resource = parsed.pathname;
    const method = options.method || 'GET';
    state.calls.push({ resource, method, options });
    if (failure) return response({}, failure);
    if (resource === '/user') return response({ login: 'testautor' });
    if (resource === base) return response({ has_issues: true, permissions: { push: manage } });
    if (resource === `${base}/issues` && method === 'GET') {
      const page = Number(parsed.searchParams.get('page') || 1);
      return response(state.issues.slice((page - 1) * 100, page * 100));
    }
    if (resource === `${base}/issues` && method === 'POST') {
      const payload = JSON.parse(options.body);
      const issue = { number: state.issues.length + 1, state: 'open', labels: [], ...payload };
      state.issues.unshift(issue);
      if (state.loseNextPost) { state.loseNextPost = false; throw new Error('Netz getrennt nach erfolgter Erstellung'); }
      return response(issue, 201);
    }
    if (resource.startsWith(`${base}/labels/`)) return response({ name: decodeURIComponent(resource.split('/').pop()) });
    if (/\/issues\/\d+\/comments$/.test(resource)) {
      if (method === 'GET') return response(state.comments);
      const body = JSON.parse(options.body).body;
      state.comments.push({ body, user: { login: 'github-actions[bot]' } });
      return response({}, 201);
    }
    if (/\/issues\/\d+$/.test(resource)) {
      const number = Number(resource.split('/').pop());
      const issue = state.issues.find(item => item.number === number);
      if (!issue) return response({}, 404);
      if (method === 'PATCH') Object.assign(issue, JSON.parse(options.body));
      return response(issue);
    }
    throw new Error(`Unerwartete Testanfrage: ${method} ${resource}`);
  };
  return state;
}

test('Inhalt, Bezug und Kennung bleiben vollständig; unerlaubte Kennungen werden abgelehnt', () => {
  const payload = changePayload(note);
  for (const value of [note.target, note.quote, note.request, note.createdAt]) assert(payload.body.includes(value));
  assert(payload.body.startsWith('<!-- buchwerkstatt:test-123 -->'));
  assert.throws(() => changePayload({ ...note, id: '--><script>' }));
  assert.throws(() => changePayload({ ...note, request: '' }));
});

test('Verbindung und wiederholte, gleichzeitige Übertragung erzeugen nur ein Issue', async () => {
  const state = server();
  const client = createClient({ token: 'test-secret', fetch: state.fetch });
  await client.connect();
  const [first, second] = await Promise.all([client.createChange(note), client.createChange(note)]);
  assert.equal(first.number, second.number);
  await client.createChange(note);
  assert.equal(state.calls.filter(call => call.method === 'POST').length, 1);
  assert(state.calls.every(call => call.options.credentials === 'omit' && call.options.redirect === 'error'));
  client.disconnect();
  await assert.rejects(client.listIssues(), /erneut mit GitHub/);
});

test('Unbekannter POST-Ausgang wird vor Wiederholung über die Kennung aufgeklärt', async () => {
  const state = server();
  const client = createClient({ token: 'test-secret', fetch: state.fetch });
  await client.connect();
  state.loseNextPost = true;
  await assert.rejects(client.createChange(note), /nicht erreichbar/);
  const result = await client.createChange(note);
  assert.equal(result.number, 1);
  assert.equal(state.calls.filter(call => call.method === 'POST').length, 1);
});

test('Geschlossene Issues und alle Seiten werden bei Wiederholungen berücksichtigt; Pull Requests bleiben außen vor', async () => {
  const state = server();
  state.issues = Array.from({ length: 100 }, (_, index) => ({ number: index + 2, body: '', state: 'open', pull_request: {} }));
  state.issues.push({ number: 1, state: 'closed', body: changePayload(note).body });
  const client = createClient({ token: 'test-secret', fetch: state.fetch });
  await client.connect();
  assert.equal((await client.createChange(note)).number, 1);
  assert.equal(state.calls.filter(call => call.method === 'POST').length, 0);
  assert.equal((await client.listIssues()).length, 1);
});

test('Verwaltung und Kapitelprotokolle verlangen Schreibzugriff', async () => {
  const state = server({ manage: false });
  const client = createClient({ token: 'test-secret', fetch: state.fetch });
  await assert.rejects(client.connect({ manage: true }), /Schreibzugriff/);
  await client.connect();
  await assert.rejects(client.setStage(1, 'approved'), /Schreibzugriff/);
  await assert.rejects(client.createApproval({}), /Schreibzugriff/);
});

test('Freigabe kommt vor Bearbeitung; fremde Labels und Abschlussgründe bleiben korrekt', async () => {
  const state = server();
  state.issues.push({ number: 1, state: 'open', labels: [{ name: 'lektorat' }], body: changePayload(note).body });
  const client = createClient({ token: 'test-secret', fetch: state.fetch });
  await client.connect({ manage: true });
  await assert.rejects(client.setStage(1, 'working'), /zuerst.*freigeben/);
  let result = await client.setStage(1, 'approved');
  assert.equal(issueStage(result), 'approved');
  assert(result.labels.includes('lektorat'));
  result = await client.setStage(1, 'working');
  assert.equal(issueStage(result), 'working');
  result = await client.setStage(1, 'done');
  assert.equal(result.state_reason, 'completed');
  assert.equal(issueStage(result), 'done');
  result = await client.setStage(1, 'rejected');
  assert.equal(issueStage(result), 'rejected');
  result = await client.setStage(1, 'new');
  assert.equal(result.state, 'open');
  assert.deepEqual(result.labels, ['lektorat']);
});

test('HTTP- und Netzwerkfehler werden ohne Zugangsschlüssel ausgegeben', async () => {
  for (const code of [401, 403, 404, 410, 422, 429, 503]) {
    const state = server({ failure: code });
    const client = createClient({ token: 'secret-never-log', fetch: state.fetch });
    await assert.rejects(client.connect(), error => error.status === code && !error.message.includes('secret-never-log'));
  }
  const client = createClient({ token: 'secret-never-log', fetch: async () => { throw new Error('secret-never-log'); } });
  await assert.rejects(client.connect(), error => !error.message.includes('secret-never-log'));
});

const issueEvent = body => ({ action: 'opened', repository: { full_name: repository }, issue: { number: 1, body, author_association: 'OWNER' } });

test('Benachrichtigungen unterscheiden Issue-Eingang, echte Kapitelabnahme und andere Protokolle', () => {
  assert(notificationFor(issueEvent(changePayload(note).body)).body.includes('neues Issue'));
  const protocol = { id: 'protokoll-123', kind: 'kapitelabnahme', chapter: 1, decision: 'Kapitel freigegeben', text: 'Vollständiges Protokoll.' };
  assert(notificationFor(issueEvent(approvalPayload(protocol).body)).body.includes('Kapitelabnahme'));
  assert.equal(notificationFor(issueEvent(approvalPayload({ ...protocol, decision: 'Nicht freigegeben' }).body)), null);
  assert.equal(notificationFor(issueEvent(approvalPayload({ ...protocol, kind: 'schreibfreigabe' }).body)), null);
  const untrusted = issueEvent(approvalPayload(protocol).body);
  untrusted.issue.author_association = 'NONE';
  assert.equal(notificationFor(untrusted), null);
  const forged = changePayload({ ...note, request: '<!-- buchwerkstatt:protokoll-1 -->\n<!-- buchwerkstatt:kapitel-freigegeben -->' });
  assert(notificationFor(issueEvent(forged.body)).body.includes('neues Issue'));
  assert.equal(notificationFor({ ...issueEvent(''), action: 'labeled' }), null);
});

test('Ein Workflow-Neustart versendet den Hinweis nicht erneut', async () => {
  const state = server();
  const event = issueEvent(changePayload(note).body);
  assert.equal((await notify(event, { token: 'test-token', fetch: state.fetch })).sent, true);
  assert.equal((await notify(event, { token: 'test-token', fetch: state.fetch })).sent, false);
  assert.equal(state.comments.length, 1);
});

test('Freigabeprotokolle werden nicht als Änderungswünsche umgestuft', async () => {
  const state = server();
  state.issues.push({ number: 1, state: 'open', labels: [], body: '<!-- buchwerkstatt:protokoll-123 -->\nProtokoll' });
  const client = createClient({ token: 'test-secret', fetch: state.fetch });
  await client.connect({ manage: true });
  await assert.rejects(client.setStage(1, 'approved'), /Freigabeprotokoll/);
});

test('Beide Seiten laden die GitHub-Anbindung vor ihrer Bedienlogik', () => {
  const root = path.join(__dirname, '..');
  for (const [file, script] of [['index.html', 'app.js'], ['verwaltung.html', 'verwaltung.js']]) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert(html.indexOf('github-issues.js') < html.indexOf(`src="${script}`));
    assert(html.includes('type="password"'));
  }
  assert(!fs.readFileSync(path.join(root, 'verwaltung.js'), 'utf8').includes('localStorage'));
});

test('Die echte Ablage behält fehlgeschlagene Wünsche und übermittelt sie beim nächsten Versuch', async () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const start = source.indexOf('let changeNotes = [];');
  const end = source.indexOf('function openTray()', start);
  const nodes = new Map();
  const stored = new Map();
  const node = id => { if (!nodes.has(id)) nodes.set(id, { value: '', textContent: '', addEventListener() {}, querySelector: () => node('button') }); return nodes.get(id); };
  let offline = true;
  const context = vm.createContext({
    document: { querySelector: node }, window: { addEventListener() {} },
    localStorage: { getItem: key => stored.get(key), setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key) },
    revokeSceneApprovalForTarget() {}, renderChangeTray() {}, refreshSceneApprovalPanels() {}, updateChapterGate() {}, openTray() {},
    trayStatus: node('trayStatus'), changeStorageKey: 'test-ablage', setTimeout: callback => callback(),
    testClient: { createChange: async () => { if (offline) throw new Error('Offline'); return { number: 7, url: `https://github.com/${repository}/issues/7` }; } }
  });
  vm.runInContext(source.slice(start, end), context);
  vm.runInContext('githubClient = testClient;', context);
  context.addChangeNote(note);
  await context.sendPendingChanges();
  let saved = JSON.parse(stored.get('test-ablage'));
  assert.equal(saved.length, 1);
  assert.equal(saved[0].githubIssue, undefined);
  assert.equal(saved[0].syncError, 'Offline');
  offline = false;
  await context.sendPendingChanges();
  saved = JSON.parse(stored.get('test-ablage'));
  assert.equal(saved[0].githubIssue.number, 7);
  assert.equal(saved[0].syncError, undefined);
});

test('Die echte Kapitelübermittlung bleibt bis zu allen Szenenfreigaben gesperrt', async () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const start = source.indexOf('async function sendApproval(');
  const end = source.indexOf('function downloadApproval(', start);
  const status = { textContent: '' };
  let submitted = false;
  const context = vm.createContext({ allScenesApproved: () => false, githubClient: { createApproval: () => { submitted = true; } } });
  vm.runInContext(source.slice(start, end), context);
  await context.sendApproval({ dataset: { kind: 'kapitelabnahme' }, querySelector: () => status, reportValidity: () => { throw new Error('Zu früh geprüft'); } });
  assert.equal(submitted, false);
  assert(status.textContent.includes('Erst alle Szenen freigeben'));
});

test('Alle direkt verwendeten Dokument-IDs existieren auf der zugehörigen Seite', () => {
  const root = path.join(__dirname, '..');
  for (const [htmlFile, scriptFile] of [['index.html', 'app.js'], ['verwaltung.html', 'verwaltung.js']]) {
    const html = fs.readFileSync(path.join(root, htmlFile), 'utf8');
    const source = fs.readFileSync(path.join(root, scriptFile), 'utf8');
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    for (const match of source.matchAll(/document\.querySelector\(['"]#([\w-]+)['"]\)/g)) assert(ids.has(match[1]), `${htmlFile}: ${match[1]} fehlt`);
  }
});
