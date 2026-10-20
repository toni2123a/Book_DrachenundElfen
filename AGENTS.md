# Arbeitsanweisung für KI-Unterstützung

## Sprache und Projektziel

- Alle Buch- und Projektexte werden auf Deutsch geführt.
- Der aktuelle Arbeitstitel lautet „Drachen und Elfen“ und ist noch nicht endgültig.
- Keine Figuren, Handlungselemente oder Fakten aus `TheBookV2` übernehmen. Nur dessen Arbeitsprinzip dient als Vorbild.

## Verbindliche Quellen

- `planung/STORY_BIBLE.md` enthält den gültigen Kanon und die offenen Kernfragen.
- `planung/ENTSCHEIDUNGEN.md` belegt, wann und warum eine Idee angenommen, vertagt oder verworfen wurde.
- `planung/WELT_UND_MAGIE.md`, `planung/FIGUREN.md`, `planung/PLOT_BAUPLAN.md` und `planung/SCHREIBSTIL.md` konkretisieren den Kanon.
- `ideen/IDEEN_INBOX.md` enthält Vorschläge, aber keine verbindlichen Tatsachen.

## Änderungsregeln

1. Neue Ideen zuerst in der Inbox erfassen und nicht stillschweigend zum Kanon erklären.
2. Bei Annahme einer Idee das Entscheidungsprotokoll und alle betroffenen Planungsdateien im selben Arbeitsschritt aktualisieren.
3. Widersprüche und fehlende Angaben sichtbar als `OFFEN` markieren, nicht erfinden.
4. Manuskriptänderungen dürfen den Kanon nicht automatisch verändern. Erkenntnisse gehören in die jeweilige `KAPITEL_NN_DELTA.md`.
5. Auswirkungen auf spätere Kapitel, Figuren, Weltregeln und Foreshadowing ausdrücklich prüfen.
6. Keine vorhandenen Ideen eines Koautors überschreiben; Alternativen danebenstellen und zur Entscheidung markieren.

## Kapiteldateien

Für jedes aktive Kapitel gehören drei Dateien zusammen:

- `KAPITEL_NN_PLAN.md`
- `KAPITEL_NN_ROHENTWURF.md`
- `KAPITEL_NN_DELTA.md`

Bis zur dokumentierten Abnahme von Kapitel 1 wird direkt am aktuellen v1-Stand gearbeitet. Keine Szenenfassungen archivieren oder Versionsnummern erhöhen. Erst nach der Abnahme beginnt die Versionierung: `kapitel1Abgenommen` in `produktion/FREIGABESTATUS.json` auf `true` setzen und vor jeder weiteren Szenenüberarbeitung die bisherige Fassung mit `scripts/szenenfassung.ps1 -Aktion Sichern` ablegen. Die abgenommene v1 ist der Ausgangsstand. Kapitel werden möglichst mit `scripts/neues-kapitel.ps1` angelegt. Vor Abschluss größerer Arbeiten `scripts/projekt-check.ps1` ausführen.
