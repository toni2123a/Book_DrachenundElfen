# Drachen und Elfen

Gemeinsamer Arbeitsbereich für ein neues Buchprojekt. Der Arbeitstitel ist vorläufig.

**Buchwerkstatt:** [toni2123a.github.io/Book_DrachenundElfen](https://toni2123a.github.io/Book_DrachenundElfen/)

Dieses Repository übernimmt das bewährte Grundprinzip aus `TheBookV2`: Ideen werden erst gesammelt, dann entschieden und anschließend kontrolliert in Story-Bibel, Plot und Manuskript überführt. Der Inhalt des früheren Buchprojekts wird nicht übernommen.

## Schnellstart

1. Neue Einfälle kommen nach [`ideen/IDEEN_INBOX.md`](ideen/IDEEN_INBOX.md).
2. Beide Autoren prüfen die Idee und dokumentieren die Entscheidung in [`planung/ENTSCHEIDUNGEN.md`](planung/ENTSCHEIDUNGEN.md).
3. Angenommene Ideen werden in die passende Projektdatei eingearbeitet:
   - [`planung/STORY_BIBLE.md`](planung/STORY_BIBLE.md) für Prämisse, Kanon und offene Fragen
   - [`planung/FIGUREN.md`](planung/FIGUREN.md) für Figuren und Beziehungen
   - [`planung/WELT_UND_MAGIE.md`](planung/WELT_UND_MAGIE.md) für Welt-, Drachen-, Elfen- und Magieregeln
   - [`planung/PLOT_BAUPLAN.md`](planung/PLOT_BAUPLAN.md) für Dramaturgie, Kapitel und Handlungsfäden
   - [`planung/SCHREIBSTIL.md`](planung/SCHREIBSTIL.md) für Erzählweise und Sprachregeln
4. Ein neues Kapitel wird mit `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\neues-kapitel.ps1 -Nummer 1 -Titel "Arbeitstitel"` angelegt.
5. Nach Änderungen läuft `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\projekt-check.ps1` als schneller Strukturcheck.

## Ordner

| Pfad | Zweck |
| --- | --- |
| `ideen/` | ungeprüfte Vorschläge und später verworfene/vertagte Ideen |
| `planung/` | verbindlicher Projektstand und Bauplan |
| `manuskript/` | Kapitelplan, Rohentwurf und Erkenntnisse je Kapitel |
| `produktion/` | Arbeitsregeln, Status und Änderungsverlauf |
| `recherche/` | Quellen, Faktenprüfung und offene Recherchen |
| `vorlagen/` | wiederverwendbare Formulare |
| `scripts/` | kleine Hilfen für Kapitelanlage und Projektprüfung |
| `index.html`, `styles.css`, `app.js`, `assets/` | öffentliche GitHub-Pages-Buchwerkstatt für den Koautor |

## Wichtiges Arbeitsprinzip

Die Inbox ist kein Kanon. Eine Idee gilt erst dann als verbindlich, wenn sie gemeinsam entschieden, im Entscheidungsprotokoll erfasst und in den betroffenen Planungsdateien synchronisiert wurde. Ein Rohentwurf verändert den Kanon ebenfalls nicht automatisch.

## Zusammenarbeit über GitHub

- Kleine Ergänzungen können direkt in `ideen/IDEEN_INBOX.md` eingetragen werden.
- Alternativ kann unter **Issues → Neue Buchidee** eine strukturierte Ideenkarte eröffnet werden.
- Für größere Änderungen empfiehlt sich ein eigener Branch mit Pull Request, damit der zweite Autor Inhalt und Folgen vor dem Zusammenführen prüfen kann.
- Im Pull Request kurz angeben, welche Entscheidung und welche Planungsdateien betroffen sind.

## Nächster gemeinsamer Schritt

Beide Autoren füllen zuerst die Projektfragen in [`ideen/IDEEN_INBOX.md`](ideen/IDEEN_INBOX.md) aus. Danach werden Logline, Zielgruppe, Perspektive, Umfang sowie die Grundregeln für Drachen, Elfen und Magie festgelegt.
