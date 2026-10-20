# Produktionsregeln

## Ziel

Das Buch wird kapitelweise entwickelt, ohne dass spontane Einfälle unbemerkt den gemeinsamen Kanon verändern. Jede Phase erzeugt einen überprüfbaren Stand.

## Ablauf pro Idee

1. Idee in der Inbox erfassen.
2. Folgen für Plot, Figuren, Welt, Stil und spätere Kapitel prüfen.
3. Gemeinsam annehmen, vertagen oder verwerfen.
4. Entscheidung protokollieren.
5. Alle betroffenen Planungsdateien im selben Schritt synchronisieren.

## Ablauf pro Kapitel

1. **Plan:** Ziel, Konflikt, Ergebnis, Kanon und Grenzen festlegen.
2. **Schreibfreigabe:** Der Koautor prüft den Plan und erteilt für eine exakt bezeichnete Planversion sein Go. Ohne übermitteltes und protokolliertes Go beginnt keine Rohfassung.
3. **Rohentwurf:** Szene schreiben, ohne neue Annahmen stillschweigend zum Kanon zu machen.
4. **Delta:** Neue Erkenntnisse als Grün, Gelb oder Rot erfassen.
5. **Stilprüfung:** Perspektive, Stimme, Rhythmus und Verständlichkeit prüfen.
6. **Logikprüfung:** Zeitlinie, Motivation, Welt- und Magieregeln prüfen.
7. **KI-Einschätzung:** Bewertung, Kurzurteil, Stärken, offene Risiken und Freigabeempfehlung versionsbezogen dokumentieren und auf der Webseite beim Kapitel sowie bei Tor 2 anzeigen.
8. **Szenenprüfung:** Der Koautor liest jede Szene, erfasst Änderungswünsche direkt am betroffenen Inhalt und gibt die Szene einzeln frei oder fordert Überarbeitung.
9. **Überarbeitung:** Bis zur dokumentierten Abnahme von Kapitel 1 direkt am aktuellen v1-Stand arbeiten, ohne Szenenarchiv oder höhere Versionsnummer. Erst nach dieser Abnahme vor jeder Änderung die bisherige Szene mit `scripts/szenenfassung.ps1 -Aktion Sichern` als Vorfassung ablegen. Szenenhinweise umsetzen und Folgekapitel synchronisieren. Ein neuer Änderungswunsch hebt eine vorhandene Szenenfreigabe auf.
10. **Szenenfreigabe:** Jede überarbeitete Szene erhält eine neue, versionsbezogene Freigabe.
11. **Kapitelabnahme:** Erst wenn alle Szenen freigegeben sind, kann der Koautor das gesamte Kapitel unter Berücksichtigung der KI-Einschätzung freigeben.
12. **Abschluss:** Kapitelstatus erst nach übermitteltem und protokolliertem Abnahmeprotokoll ändern.

## Verbindliche Freigabeebenen

### Tor 1 · Schreibfreigabe

- nennt Kapitelnummer, Kapiteltitel und exakte Planversion,
- bestätigt Ziel, Konflikt, Ergebnis und Perspektive,
- bestätigt Weltregeln, Setups, Payoffs und Folgen für spätere Kapitel,
- lautet entweder `Schreibfreigabe erteilt` oder `Noch nicht freigegeben – Änderungen erforderlich`,
- verliert bei jeder inhaltlichen Änderung des Plans ihre Gültigkeit.

### Szenenfreigabe

- steht direkt unter der jeweiligen Szene,
- nennt Entscheidung, Vermerk, Szenenfassung und Zeitpunkt,
- legt bei `Überarbeitung erforderlich` den Vermerk samt markierter Textstelle als Änderungswunsch in die Ablage,
- kann nach Beginn der Versionierung auch für eine angezeigte Vorfassung erteilt werden; diese wird dann mit `scripts/szenenfassung.ps1 -Aktion Wiederherstellen` zurück ins Manuskript geholt und zählt erst danach für die Kapitelabnahme,
- ist nur möglich, wenn für die Szene kein offener Änderungswunsch in der Ablage liegt,
- wird durch einen neuen Änderungswunsch an der Szene automatisch aufgehoben,
- lautet entweder `Szene freigegeben` oder `Überarbeitung erforderlich`.

### Tor 2 · Kapitelabnahme

- nennt Kapitelnummer, Kapiteltitel und exakte Textversion,
- enthält die Freigabe jeder einzelnen Szene,
- bleibt technisch gesperrt, solange nicht alle Szenen freigegeben sind,
- bestätigt Deltas und spätere Auswirkungen auf Kapitel- und Reihenebene,
- enthält dieselbe versionsbezogene KI-Einschätzung wie der Kapitelbereich und bestätigt, dass Risiken und Empfehlung berücksichtigt wurden,
- lautet entweder `Kapitel freigegeben` oder `Nicht freigegeben – Überarbeitung erforderlich`,
- verliert bei jeder nachträglichen Textänderung ihre Gültigkeit.

Die Webseite erzeugt für Tor 1 und Tor 2 datierte Protokolle mit Kennung. Szenenfreigaben und Änderungswünsche werden auf dem jeweiligen Gerät gespeichert. Die öffentliche GitHub-Pages-Seite besitzt keinen sicheren Schreibzugriff auf GitHub und erzeugt deshalb keine Issues. Entscheidungen und Änderungslisten müssen heruntergeladen oder kopiert, übermittelt und anschließend im Projekt dokumentiert werden.

## Szenenfassungen

Die Szenenversionierung beginnt erst nach übermittelter und im Projekt dokumentierter Abnahme von Kapitel 1. Bis dahin bleibt der aktuelle Entwurf v1; Änderungen werden direkt eingearbeitet. Es werden keine Vorfassungen archiviert, hochgezählt oder auf der Webseite angeboten.

Der bestätigte Projektstatus steht in `produktion/FREIGABESTATUS.json`. Erst nach protokollierter Kapitelabnahme wird `kapitel1Abgenommen` auf `true` gesetzt. Webseite und Sicherungsskript verwenden denselben Status. Lokal ausgefüllte Freigabeformulare ändern ihn nicht. Solange er `false` ist, sperrt das Skript sowohl Sichern als auch Wiederherstellen.

Die abgenommene v1 bildet den Ausgangsstand. Bei der ersten anschließenden Überarbeitung wird sie gesichert; der neue Text erhält v2. Ab dann bleibt bei jeder Überarbeitung die vorherige Fassung erhalten:

```powershell
# vor der Überarbeitung: aktuelle Szene als Vorfassung sichern
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\szenenfassung.ps1 -Aktion Sichern -Kapitel 1 -Szene 2 -Anlass "Änderungswunsch: mehr Wärme"

# falls die Vorfassung doch besser war: zurückholen, die verdrängte Fassung bleibt archiviert
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\szenenfassung.ps1 -Aktion Wiederherstellen -Kapitel 1 -Szene 2 -Fassung v1 -Anlass "Koautor bevorzugt v1"
```

Die Fassungen liegen unter `manuskript/fassungen/`, verzeichnet in `KAPITEL_NN_FASSUNGEN.json`. Die Webseite zeigt an jeder Szene mit Vorfassungen einen Umschalter und markiert auf Wunsch die geänderten Absätze.

## Änderungsfenster auf der Webseite

- **Flexibel bis Kapitel 1:** Reihenstruktur, Weltbausteine, Figurenfundament, Band- und Kapitelplan können bis zur dokumentierten Abnahme von Kapitel 1 direkt kommentiert werden. Danach werden diese Kacheln gesperrt; Änderungen benötigen eine ausdrückliche Kanonentscheidung und Folgenprüfung.
- **Kapitel-Draft:** Szenen, rote Fäden und Kapiteleinschätzung bleiben bis zur Freigabe der jeweiligen Szene beziehungsweise des Kapitels direkt kommentierbar. Ein neuer Wunsch hebt die Szenenfreigabe auf.
- **Verbindlicher Rahmen:** Kernidentität, Qualitätsmaßstab und Freigabelogik werden nicht über beiläufige Kachelwünsche verändert. Änderungen daran benötigen eine bewusste Projektentscheidung.

Die Webseite kennzeichnet die Klassen mit Statusmarken und Erläuterung bei Mausover oder Tastaturfokus. Der Wechsel von `Flexibel bis Kapitel 1` zu `Fundament fixiert` erfolgt erst, nachdem die Kapitelabnahme im Projekt protokolliert wurde, nicht allein durch einen lokal ausgefüllten Browserentwurf.

## Delta-Klassen

- **Grün:** Konkretisierung ohne Widerspruch oder Folgen für andere Kapitel.
- **Gelb:** sinnvolle Änderung mit überschaubaren Folgen; Entscheidung nötig.
- **Rot:** Widerspruch zum Kanon oder große Auswirkung; vor weiterer Kapitelarbeit klären.

## Definition „freigegeben“

Ein Kapitel ist erst freigegeben, wenn:

- jede Szene der aktuellen Textversion einzeln freigegeben wurde,
- Ziel, Konflikt und Ergebnis erkennbar sind,
- Figurenmotivationen nachvollziehbar sind,
- Welt- und Magieregeln eingehalten werden,
- Setups und Payoffs dokumentiert sind,
- offene Koautorenhinweise entschieden oder bewusst vertagt sind,
- alle gelben und roten Deltas entschieden sind,
- betroffene Planungsdateien und spätere Kapitelkarten synchronisiert sind,
- Rechtschreibung und Format geprüft wurden.
- das Abnahmeprotokoll die freigegebene Textversion eindeutig nennt.

## Zusammenarbeit

- Beiträge werden nicht kommentarlos gelöscht.
- Bei unterschiedlichen Varianten bleiben beide Vorschläge sichtbar, bis eine Entscheidung getroffen ist.
- Größere Änderungen nennen im Änderungsprotokoll Grund und Auswirkungen.
- Pro Kapitel gibt es zu einem Zeitpunkt genau einen vereinbarten Arbeitsstand.
