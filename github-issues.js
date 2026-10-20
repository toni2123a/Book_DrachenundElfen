(function (root) {
  'use strict';

  const repository = 'toni2123a/Book_DrachenundElfen';
  const repositoryPath = `/repos/${repository}`;
  const repositoryUrl = `https://github.com/${repository}`;
  const stages = {
    approved: { label: 'buchwerkstatt:freigegeben', name: 'Freigegeben', color: '2e7d32' },
    working: { label: 'buchwerkstatt:in-arbeit', name: 'In Arbeit', color: '0969da' },
    deferred: { label: 'buchwerkstatt:zurueckgestellt', name: 'Zurückgestellt', color: '9a6700' }
  };

  class GitHubError extends Error {
    constructor(message, status = 0) { super(message); this.status = status; }
  }

  function marker(id) {
    if (typeof id !== 'string' || !/^[a-zA-Z0-9-]{1,120}$/.test(id)) throw new GitHubError('Die Kennung des Änderungswunsches ist ungültig.');
    return `<!-- buchwerkstatt:${id} -->`;
  }

  function issueReference(issue) {
    if (!Number.isSafeInteger(issue?.number) || issue.number < 1) throw new GitHubError('GitHub hat keine gültige Issue-Nummer bestätigt.');
    return { number: issue.number, url: `${repositoryUrl}/issues/${issue.number}` };
  }

  function changePayload(note) {
    if (!note || typeof note.target !== 'string' || !note.target.trim() || note.target.length > 1000 ||
        typeof note.request !== 'string' || !note.request.trim() || note.request.length > 20000 ||
        (note.quote && (typeof note.quote !== 'string' || note.quote.length > 2000))) {
      throw new GitHubError('Bitte einen Bezug und einen Änderungswunsch mit höchstens 20.000 Zeichen angeben.');
    }
    return {
      title: `Änderungswunsch: ${note.target}`.slice(0, 220),
      body: [marker(note.id), '## Bezug', note.target, note.quote ? `## Markierte Textstelle\n\n${note.quote}` : '',
        '## Gewünschte Änderung', note.request, '## Erfasst', String(note.createdAt || ''),
        '## Arbeitsstatus', 'Eingegangen. Zur gemeinsamen Prüfung, noch keine Kanonentscheidung.',
        'Vor Umsetzung Figuren, Weltregeln, spätere Kapitel, Foreshadowing und Folgebände prüfen.'].filter(Boolean).join('\n\n')
    };
  }

  function approvalPayload(protocol) {
    if (!protocol || !['schreibfreigabe', 'kapitelabnahme'].includes(protocol.kind) ||
        typeof protocol.text !== 'string' || !protocol.text.trim() || protocol.text.length > 50000 ||
        !Number.isInteger(protocol.chapter) || protocol.chapter < 1 || protocol.chapter > 36) {
      throw new GitHubError('Das Freigabeprotokoll ist unvollständig.');
    }
    const approved = protocol.decision === 'Kapitel freigegeben' && protocol.kind === 'kapitelabnahme';
    return {
      title: `${approved ? 'Kapitel freigegeben' : 'Freigabeprotokoll'}: Kapitel ${protocol.chapter}`,
      body: [marker(protocol.id), approved ? '<!-- buchwerkstatt:kapitel-freigegeben -->' : '', protocol.text].filter(Boolean).join('\n\n')
    };
  }

  function issueStage(issue) {
    if (issue.state === 'closed') return issue.state_reason === 'not_planned' ? 'rejected' : 'done';
    const labels = (issue.labels || []).map(label => typeof label === 'string' ? label : label.name);
    return Object.keys(stages).find(key => labels.includes(stages[key].label)) || 'new';
  }

  function createClient({ fetch: request = root.fetch.bind(root), token }) {
    let secret = String(token || '').trim();
    let identity = null;
    const pending = new Map();
    if (!secret || /\s/.test(secret)) throw new GitHubError('Bitte einen gültigen GitHub-Zugangsschlüssel eingeben.');

    async function api(path, options = {}) {
      if (!secret) throw new GitHubError('Bitte erneut mit GitHub verbinden.', 401);
      let response;
      try {
        response = await request(`https://api.github.com${path}`, {
          ...options, credentials: 'omit', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(25000),
          headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${secret}`,
            'X-GitHub-Api-Version': '2022-11-28', ...(options.body ? { 'Content-Type': 'application/json' } : {}) }
        });
      } catch {
        throw new GitHubError('GitHub ist gerade nicht erreichbar. Bitte erneut senden. Ein möglicherweise bereits erstelltes Issue wird vor dem nächsten Versuch gesucht.');
      }
      if (!response.ok) {
        const messages = {
          401: 'GitHub hat den Schlüssel abgelehnt. Bitte erneut verbinden.',
          403: 'GitHub verweigert die Aktion. Bitte Berechtigung „Issues: Lesen und Schreiben“ und mögliche GitHub-Limits prüfen.',
          404: 'Repository oder Issue ist mit diesem Zugang nicht erreichbar.',
          410: 'Issues sind für dieses Repository deaktiviert.',
          422: 'GitHub hat die Eingabe abgelehnt. Bitte Inhalt und Berechtigungen prüfen.',
          429: 'GitHub begrenzt gerade die Anfragen. Bitte später erneut versuchen.'
        };
        throw new GitHubError(messages[response.status] || 'GitHub konnte die Aktion nicht bestätigen. Bitte erneut versuchen.', response.status);
      }
      try { return await response.json(); } catch { throw new GitHubError('Die GitHub-Antwort konnte nicht gelesen werden. Bitte erneut versuchen.'); }
    }

    async function connect({ manage = false } = {}) {
      const user = await api('/user');
      const repo = await api(repositoryPath);
      if (repo.has_issues === false) throw new GitHubError('Issues sind für dieses Repository deaktiviert.', 410);
      const permissions = repo.permissions || {};
      const canManage = Boolean(permissions.admin || permissions.maintain || permissions.push);
      if (manage && !canManage) throw new GitHubError('Für die Verwaltung ist Schreibzugriff auf das Buchprojekt erforderlich.', 403);
      identity = { login: user.login, canManage };
      return identity;
    }

    async function listIssues() {
      const issues = [];
      for (let page = 1; ; page++) {
        const batch = await api(`${repositoryPath}/issues?state=all&sort=created&direction=desc&per_page=100&page=${page}`);
        if (!Array.isArray(batch)) throw new GitHubError('Die Issue-Liste ist unvollständig. Bitte erneut laden.');
        issues.push(...batch.filter(issue => !issue.pull_request));
        if (batch.length < 100) return issues;
      }
    }

    async function createOnce(id, payload) {
      if (!identity) throw new GitHubError('Bitte zuerst mit GitHub verbinden.');
      if (pending.has(id)) return pending.get(id);
      const operation = (async () => {
        const existing = (await listIssues()).find(issue => String(issue.body || '').startsWith(marker(id)));
        if (existing) return issueReference(existing);
        return issueReference(await api(`${repositoryPath}/issues`, { method: 'POST', body: JSON.stringify(payload) }));
      })();
      pending.set(id, operation);
      try { return await operation; } finally { pending.delete(id); }
    }

    async function setStage(number, stage) {
      if (!identity?.canManage) throw new GitHubError('Bitte mit Schreibzugriff verbinden.', 403);
      if (!Number.isSafeInteger(number) || number < 1 || !['new', 'approved', 'working', 'deferred', 'done', 'rejected'].includes(stage)) {
        throw new GitHubError('Ungültiger Bearbeitungsstatus.');
      }
      const issue = await api(`${repositoryPath}/issues/${number}`);
      if (issue.pull_request) throw new GitHubError('Diese Verwaltung bearbeitet keine Pull Requests.');
      if (String(issue.body || '').startsWith('<!-- buchwerkstatt:protokoll-')) throw new GitHubError('Ein Freigabeprotokoll wird im Kapitelbereich übermittelt und hier nicht als Änderungswunsch bearbeitet.');
      const currentStage = issueStage(issue);
      if (['working', 'done'].includes(stage) && !['approved', 'working', 'done'].includes(currentStage)) {
        throw new GitHubError('Bitte den Änderungswunsch zuerst zur Bearbeitung freigeben.');
      }
      const stageLabels = Object.values(stages).map(value => value.label);
      const labels = (issue.labels || []).map(label => typeof label === 'string' ? label : label.name).filter(label => !stageLabels.includes(label));
      if (stages[stage]) {
        const definition = stages[stage];
        try { await api(`${repositoryPath}/labels/${encodeURIComponent(definition.label)}`); } catch (error) {
          if (error.status !== 404) throw error;
          try { await api(`${repositoryPath}/labels`, { method: 'POST', body: JSON.stringify({ name: definition.label, color: definition.color, description: `Buchwerkstatt: ${definition.name}` }) }); }
          catch (createError) { if (createError.status !== 422) throw createError; await api(`${repositoryPath}/labels/${encodeURIComponent(definition.label)}`); }
        }
        labels.push(definition.label);
      }
      const closed = stage === 'done' || stage === 'rejected';
      return api(`${repositoryPath}/issues/${number}`, {
        method: 'PATCH', body: JSON.stringify({ labels, state: closed ? 'closed' : 'open',
          state_reason: closed ? (stage === 'rejected' ? 'not_planned' : 'completed') : 'reopened' })
      });
    }

    return {
      connect, listIssues, setStage,
      createChange: note => createOnce(note.id, changePayload(note)),
      createApproval: protocol => {
        if (!identity?.canManage) return Promise.reject(new GitHubError('Freigaben können nur mit Schreibzugriff übermittelt werden.', 403));
        return createOnce(protocol.id, approvalPayload(protocol));
      },
      disconnect: () => { secret = ''; identity = null; }
    };
  }

  const exported = { createClient, changePayload, approvalPayload, issueStage, issueReference, repository, repositoryUrl, stages, GitHubError };
  if (typeof module !== 'undefined' && module.exports) module.exports = exported;
  else root.BookIssues = exported;
})(typeof globalThis === 'undefined' ? this : globalThis);
