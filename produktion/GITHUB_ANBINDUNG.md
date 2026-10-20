# GitHub-Arbeitsliste und Benachrichtigungen

Die Buchseite bleibt auf GitHub Pages. Die Autoren verbinden sich pro geöffnetem Tab mit ihrem eigenen GitHub-Zugang. Der Zugangsschlüssel bleibt im Arbeitsspeicher, wird nicht lokal gespeichert und nicht in den öffentlichen Seitencode eingebaut. Ein Neuladen oder Abmelden beendet die Verbindung.

## Zugang einrichten

1. Der Projektinhaber erstellt in [GitHub einen Fine-grained personal access token](https://github.com/settings/personal-access-tokens/new). Als Eigentümer `toni2123a`, nur das Repository `Book_DrachenundElfen`, eine begrenzte Laufzeit und unter Repository permissions `Issues: Read and write` wählen. Keine Schreibrechte für Dateien oder Workflows erteilen.
2. Auf der Buchseite „GitHub verbinden und Änderungswünsche übermitteln“ öffnen. Den Schlüssel ausschließlich in das Passwortfeld eingeben. Nach erfolgreicher Verbindung wird das Feld geleert. Bereits lokal erfasste Wünsche werden dabei ebenfalls übermittelt.
3. Für die [Verwaltung](../verwaltung.html) erneut verbinden. GitHub muss für dieses Konto Schreibzugriff auf das Projekt bestätigen. Die Verwaltung ist eine eigene Seite, kein eigener Benutzeraccount.

Für einen Mitautor mit Zugriff auf das persönliche Repository eines anderen Nutzers unterstützt GitHub derzeit keine passenden Fine-grained Tokens. Hier ist ein persönlicher Classic Token mit `public_repo` möglich. Er ist weiter gefasst und nicht auf ein einzelnes öffentliches Repository beschränkt. Jeder Autor verwendet seinen eigenen Schlüssel. Ohne API-Verbindung bleiben die lokalen Wünsche und Exporte nutzbar. Die aktuellen Einschränkungen beschreibt [GitHub in der Token-Dokumentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

Die Issues dieses Repositories sind öffentlich. Die Passwortabfrage schützt Schreibaktionen über GitHub-Berechtigungen; sie macht öffentliche Issue-Inhalte nicht vertraulich.

## Änderungswünsche und Freigaben

- Beide Eingabewege, sichtbare Kacheln und „Überarbeitung erforderlich“ an Szenen, legen Wünsche zuerst lokal ab. Bei bestehender GitHub-Verbindung wird für jeden Wunsch automatisch ein Issue erstellt. Bezug, markierte Stelle, Wunsch und Zeitpunkt werden übertragen.
- Nach bestätigter Übertragung zeigt die Ablage den Issue-Link. Ohne Netz oder bei fehlenden Rechten bleibt der Wunsch erhalten. „Offene Wünsche senden“ versucht die Übertragung erneut. Vor einem erneuten Erstellen sucht die Anwendung nach der gespeicherten Wunschkennung, auch in geschlossenen Issues.
- Wünsche werden nacheinander übermittelt. Entfernen aus der lokalen Ablage schließt oder löscht kein GitHub-Issue. Ein übertragenes Issue bleibt in der Verwaltung bearbeitbar.
- Die Verwaltung bietet `Neu`, `Freigegeben`, `In Arbeit`, `Zurückgestellt`, `Erledigt` und `Abgelehnt`. Erst freigegebene Wünsche können auf `In Arbeit` oder `Erledigt` gesetzt werden. Fremde GitHub-Labels bleiben erhalten.
- Freigeben merkt eine Änderung vor. Es startet keine KI und ändert weder Manuskript noch Kanon. Die Arbeitsliste kann heruntergeladen und anschließend gemeinsam abgearbeitet werden.
- „Freigabe übermitteln“ im Kapitelbereich legt das vollständige Schreibfreigabe- oder Kapitelabnahmeprotokoll auf GitHub ab. Eine Kapitelabnahme ist weiterhin erst nach allen drei Szenenfreigaben möglich. Dafür ist Schreibzugriff erforderlich.
- Ein übermitteltes Protokoll wird in der Verwaltung als Protokoll angezeigt und nicht mit dem Bearbeitungsstatus eines Änderungswunsches verwechselt. Seine Übernahme in Planungsdateien und `FREIGABESTATUS.json` bleibt ein eigener Projektschritt.

## E-Mail-Benachrichtigungen

Der Workflow `Buchwerkstatt-Benachrichtigung` läuft beim Eingang eines neuen Issues. Er erwähnt `toni2123a` in einem Kommentar. Für eine gültige, von einem Projektbeteiligten übermittelte Kapitelabnahme verwendet er einen gesonderten Hinweis. Eine bloße Freigabe eines Änderungswunsches löst keine Kapitelbenachrichtigung aus. Schreibfreigabeprotokolle und abgelehnte Kapitelabnahmen lösen diesen Hinweis ebenfalls nicht aus.

In den [persönlichen GitHub-Benachrichtigungseinstellungen](https://github.com/settings/notifications) muss die Zustellung für `Participating, @mentions and custom` per E-Mail aktiviert sein. Die Nachricht geht an die dort konfigurierte E-Mail-Adresse. Diese persönliche Einstellung kann die Buchseite nicht lesen oder ändern. Weitere Benachrichtigungen können aus bereits bestehenden GitHub-Abonnements stammen. [GitHub beschreibt die E-Mail-Arten hier](https://docs.github.com/en/subscriptions-and-notifications/reference/types-of-emails-github-sends).

Der Workflow verwendet das kurzlebige `GITHUB_TOKEN` von GitHub Actions mit `issues: write` und `contents: read`. Ein eigener Maildienst oder ein zusätzlicher Repository-Schlüssel ist dafür nicht nötig. Wiederholte Workflow-Ausführungen prüfen den bereits vorhandenen Bot-Kommentar. Der Laufstatus steht unter [GitHub Actions](https://github.com/toni2123a/Book_DrachenundElfen/actions/workflows/issue-benachrichtigung.yml).

## Technische Prüfung

`node --test scripts/github-issues.test.cjs` prüft Berechtigungen, Fehler- und Wiederholungsfälle, Statusübergänge und beide Benachrichtigungsarten. `scripts/projekt-check.ps1` prüft weiterhin die Projektstruktur und den gesperrten Beginn der Szenenversionierung.

Die Anbindung nutzt die offiziellen GitHub-Endpunkte für [Issues](https://docs.github.com/en/rest/issues/issues) und deren [CORS-Unterstützung](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests).
