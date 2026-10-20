# Änderungsprotokoll

Dieses Protokoll erfasst Änderungen, die den vereinbarten Projektstand, mehrere Dateien oder spätere Kapitel beeinflussen.

## Änderungen

### 2026-10-20 · Kapitel 1 als v2 überarbeitet und Tal-Linie abgeglichen

- **Art:** Kapitel, Stil, Logik und Planungsabgleich
- **Grund:** Der Projektgründer beauftragte die gezielte Verbesserung in Richtung 10/10 und die erneute Prüfung seines Grundgerüstwunsches zu Intrige, Liebe, Opfer, Wiederkehr, Befreiung und Drachenrettung.
- **Änderung:** Idee 013 und E-011 dokumentiert. Alle drei Szenen vor der Änderung mit `szenenfassung.ps1 -Aktion Sichern` als v1 archiviert. Rohentwurf v2 mit 2.992 Wörtern, früherem Ziel, konkreter Nähe zu Phae, gebrochenem Rückkehrversprechen und gestrafftem Ritual erstellt. Fugenhand, vier zusätzliche Atemzüge und Sprecherrollen korrigiert. Kapitelplan, Delta, Status und Webseite auf v2 mit 96/100 synchronisiert.
- **Grundgerüstprüfung:** Alle gewünschten Stationen sind durch E-010 verankert. Figurenakte korrigiert: Sereth versucht Tal zu kaufen, er lehnt ab. Tals Opferpreis gehört ihm allein. W-009 und fugenfreie Hände als ungeklärte Mechanik gekennzeichnet, ohne die Wiederkehr zu streichen. Die frühere Geliebte bleibt Neyras Vorgängerin. Der vollständige Abgleich mit Kapitel- und Bandzuordnung steht im Kapitel-Delta.
- **Auswirkung:** Keine neue Weltregel angenommen. Kapitel 2 prüft die stadtweite Wirkung und Spuren der zerbrochenen Kapsel. Spätere Phae-, Herkunfts- und Tal-Payoffs bleiben erhalten. Alte Szenenfreigaben ersetzen keine Prüfung von v2; die Kapitelabnahme bleibt ausstehend.
- **Betroffene Dateien/Kapitel:** Kapitel-1-Trio und Szenenarchiv, Tal-bezogene Planungsdateien, Inbox und Entscheidungen, Projektstatus, README und Webseite; Folgen für Kapitel 2, 5/7, 10/17/24/34, 14/35, 16/20/28 und die Tal-Linie bis Band 3 geprüft.
- **Offen:** Bestehende gelbe und rote Deltas, Wiederkehrmechanik, konkrete Tal-Handlung in Band 2/3 und Koautorenabnahme.

### 2026-10-20 · Grundgerüst um die Tal-Linie erweitert, Kapitel 1 neu geschrieben

- **Art:** Kanon, Plot, Figur und Kapitel
- **Grund:** Der Projektgründer wünschte eine Spur Intrigen und Liebe. Der verhasste Gegenspieler soll zum Zwangsverbündeten und zur Liebe aus einem früheren Weltabschnitt werden, trotzdem geopfert werden und in einer fremden Jahreszeit als Befreier des Volkes und Retter der Drachen zurückkehren.
- **Änderung:** Entscheidung E-010 angelegt. Tal als Figur ausgearbeitet. Kapitel 1, 5, 7, 19, 21, 22, 23, 28, 29, 33, 35 und 36 im Bauplan angepasst. Setups S-013 bis S-017, Handlungsfäden H-008 und H-009 und Weltregeln W-008 und W-009 ergänzt. Kapitel 1 neu geplant und neu geschrieben. Der neue Text trägt den Namen Rohentwurf v1 und ersetzt den bisherigen Entwurf vollständig. Die alte Fassung bleibt in der Git-Historie erhalten und wurde nicht als Vorfassung in `manuskript/fassungen/` abgelegt.
- **Auswirkung:** Die Szenenfreigaben und die Kapitelabnahme von Kapitel 1 beginnen neu. Frühere Selbstprüfung (96 von 100) gilt nicht mehr.
- **Betroffene Dateien/Kapitel:** `planung/*`, `ideen/IDEEN_INBOX.md`, `manuskript/KAPITEL_01_*`, `index.html`, `app.js`, `PROJEKTSTATUS.md`, `readme.md`
- **Offen:** Wiederkehr-Mechanik, Rollenverteilung in Band 2 und 3, Koautorenprüfung.

### 2026-10-20 · Mobile Leseansicht für Kapitel und Freigaben optimiert

- **Art:** Gestaltung und Bedienbarkeit
- **Grund:** Der Koautor soll Kapitel bequem auf Smartphone und Tablet lesen, kommentieren und Szene für Szene freigeben können.
- **Änderung:** Responsive Navigation, einspaltige Handy-Kacheln, ruhigere Lesebreite, skalierende Kapiteltypografie, größere Touchflächen, mobil stapelnde Formulare und Safe-Area-Abstände ergänzt. Überbreite Statusmarkierungen wurden begrenzt.
- **Auswirkung:** Kapiteltext, Änderungswünsche, Szenenfreigaben und die abschließende Kapitelabnahme funktionieren ohne seitliches Scrollen auf typischen Handy- und Tabletbreiten.
- **Betroffene Dateien:** `index.html`, `styles.css`, `app.js`, `PROJEKTSTATUS.md`
- **Offen:** keines

### 2026-10-20 · Änderungsfenster sichtbar gekennzeichnet

- **Art:** Organisation und Gestaltung
- **Grund:** Der Koautor soll sofort erkennen, welche Kacheln nur bis zur ersten Kapitelabnahme flexibel sind, welche zum aktuellen Draft gehören und welche Regeln bewusst fest bleiben.
- **Änderung:** Drei sichtbare Klassen mit Mausover- und Tastaturhinweisen eingeführt: `Flexibel bis Kapitel 1`, `Kapitel-Draft` und `Verbindlicher Rahmen`. Reihen-, Welt-, Figuren- und Plotkacheln schließen nach der dokumentierten Abnahme von Kapitel 1; Kapitelinhalte folgen ihrer eigenen Szenen- und Kapitelabnahme.
- **Auswirkung:** Änderungswünsche werden zeitlich und inhaltlich klar eingeordnet. Grundlegende Eingriffe nach Kapitel 1 benötigen eine Kanonentscheidung samt Folgenprüfung statt eines beiläufigen Kachelwunsches.
- **Betroffene Dateien:** `index.html`, `styles.css`, `app.js`, `PROJEKTSTATUS.md`, `produktion/PRODUKTIONSREGELN.md`
- **Offen:** Kennzeichnung nach der offiziellen Abnahme von Kapitel 1 auf `Fundament fixiert` umstellen.

### 2026-10-20 · Szenenfreigaben vor Kapitelabnahme eingeführt

- **Art:** Kapitel und Organisation
- **Grund:** Direkte Änderungswünsche an einzelnen Szenen benötigen eine ebenso genaue Freigabe statt eines losgelösten allgemeinen Formularblocks.
- **Änderung:** Jede Szene erhält eine eigene Entscheidung mit Koautor, Vermerk und Status. Offene oder neu erfasste Änderungswünsche sperren beziehungsweise widerrufen die Szenenfreigabe. Die Kapitelabnahme steht nun direkt unter dem Kapitel und wird erst nach Freigabe aller Szenen entsperrt. Der alte untere Doppelbereich wurde entfernt; Tor 1 ist als aufklappbare Planfreigabe in das Kapitel integriert.
- **Auswirkung:** Der Koautor arbeitet Szene für Szene. Das abschließende Protokoll enthält alle Szenenfreigaben und die KI-Einschätzung. Die statische Webseite erzeugt aus Sicherheitsgründen keine GitHub-Issues; Exporte bleiben erforderlich.
- **Betroffene Dateien:** `index.html`, `styles.css`, `app.js`, `README.md`, `PROJEKTSTATUS.md`, `vorlagen/SZENENKARTE.md`, `vorlagen/KAPITELABNAHME.md`, `produktion/PRODUKTIONSREGELN.md`
- **Offen:** Entscheidung, ob später ein authentifizierter Dienst für automatische GitHub-Issues eingerichtet werden soll.

### 2026-10-20 · KI-Einschätzung in Kapitel und Abnahme verankert

- **Art:** Kapitel und Organisation
- **Grund:** Der Koautor soll meine Einschätzung nicht nur als Punktzahl, sondern als begründete Entscheidungshilfe direkt beim Lesen und bei der Freigabe sehen.
- **Änderung:** Versionsbezogene Einschätzung mit Bewertung, Kurzurteil, Stärken, offenen Risiken und Freigabeempfehlung ergänzt. Dieselbe Einschätzung wird im Kapitelbereich, in Tor 2 und im erzeugten Abnahmeprotokoll ausgegeben.
- **Auswirkung:** Die Kapitelabnahme zeigt künftig transparent, warum eine Fassung stark ist und welche Restpunkte vor der endgültigen Freigabe zu entscheiden sind. Die unabhängige Entscheidung bleibt beim Koautor.
- **Betroffene Dateien:** `index.html`, `styles.css`, `app.js`, `vorlagen/KAPITELABNAHME.md`, `produktion/PRODUKTIONSREGELN.md`
- **Offen:** Koautorenentscheidung zu D-03 und D-04 sowie Feedback zu Rohentwurf v1.

### 2026-10-20 · Kapitel 1 geschrieben und Webseite in Draft-Modus versetzt

- **Art:** Kapitel, Plot und Organisation
- **Grund:** Kapitel 1 soll als vollständiger Entwurf lesbar und direkt an den sichtbaren Inhalten kommentierbar sein.
- **Änderung:** Szenenplan, 2.778 Wörter Rohentwurf und Delta für „Das Kind ohne Vorleben“ erstellt. Sechs rote Fäden, Folgekapitel und eine gewichtete 100-Punkte-Prüfung dokumentiert. Das separate Änderungsformular wurde durch kontextbezogene Änderungsfelder an Karten und Textszenen plus lokale Änderungsablage ersetzt.
- **Auswirkung:** Der Koautor kann beim Lesen genau an der betroffenen Kachel oder markierten Textstelle reagieren. Gelbe und rote Manuskriptannahmen bleiben außerhalb des Kanons, bis sie entschieden sind.
- **Betroffene Dateien:** `manuskript/KAPITEL_01_PLAN.md`, `manuskript/KAPITEL_01_ROHENTWURF.md`, `manuskript/KAPITEL_01_DELTA.md`, `PROJEKTSTATUS.md`, `index.html`, `styles.css`, `app.js`
- **Offen:** Koautorenfeedback, Deltaentscheidungen, Rohentwurf v2 und Abnahme.

### 2026-10-20 · Titelmotiv an „Die Häutung der Welt“ angepasst

- **Art:** Gestaltung
- **Grund:** Das alte Bild enthielt den früheren Titel als feste Bildschrift und überlagerte sich mit dem neuen Webseitentitel.
- **Änderung:** Neues schriftfreies Titelmotiv mit zwei Wirklichkeitsschichten, einer gewaltigen Drachenschuppe, weißen Motten und dem kleinen Drachen Orr erstellt. Die linke Bildhälfte bleibt als ruhiger Raum für den Webseitentitel frei.
- **Auswirkung:** Der Titel ist auf großen und kleinen Bildschirmen klar lesbar; Bild und Konzept erzählen nun dieselbe Weltidee.
- **Betroffene Dateien:** `assets/hero-worldskin.webp`, `index.html`, `styles.css`
- **Offen:** keines

### 2026-10-20 · Zwei Freigabetore für jedes Kapitel ergänzt

- **Art:** Organisation und Kapitelworkflow
- **Grund:** Der Koautor soll vor der Rohfassung ein ausdrückliches Go und nach der Prüfung eine ausdrückliche Kapitelabnahme geben.
- **Änderung:** Schreibfreigabe und Kapitelabnahme als versionierte, datierte Protokolle in Produktionsregeln, Vorlagen und Webseite ergänzt.
- **Auswirkung:** Ohne protokolliertes Go wird nicht geschrieben; ohne protokollierte Abnahme wird kein Kapitel abgeschlossen. Plan- oder Textänderungen benötigen eine neue Freigabe der neuen Version.
- **Betroffene Dateien:** `produktion/PRODUKTIONSREGELN.md`, `planung/ENTSCHEIDUNGEN.md`, `PROJEKTSTATUS.md`, `vorlagen/`, `index.html`, `styles.css`, `app.js`
- **Offen:** kein automatischer Versand; Protokolle werden kopiert oder heruntergeladen und anschließend übermittelt.

### 2026-10-20 · Serien- und Band-1-Grundgerüst festgelegt

- **Art:** Kanon, Plot, Figur, Welt, Stil und Organisation
- **Grund:** Die Reihe soll ein eigenständiges, ausgefallenes Fundament erhalten und auf der öffentlichen Seite vollständig prüfbar sein.
- **Änderung:** Trilogie „Die Häutung der Welt“, Welt- und Magieregeln, Figurenensemble, 36-Kapitel-Bauplan, Enthüllungsleiter, Setups/Payoffs und Bandende ausgearbeitet. Die Webseite zeigt nun den Plan selbst und erfasst ausschließlich lokale Änderungswünsche.
- **Auswirkung:** Die Konzeptphase ist abgeschlossen. Neue Vorschläge verändern den Kanon erst nach gemeinsamer Entscheidung; Auswirkungen auf Figuren, Weltregeln, spätere Kapitel, Foreshadowing und Folgebände werden ausdrücklich erfasst.
- **Betroffene Dateien:** `PROJEKTSTATUS.md`, `ideen/IDEEN_INBOX.md`, alle Planungsdateien, Recherchedateien, `index.html`, `styles.css`, `app.js`
- **Offen:** Autorennamen, finale Titelprüfung, Inhaltsgrenzen und Freigabe vor Beginn von Kapitel 1.

### 2026-10-20 · GitHub-Pages-Buchwerkstatt ergänzt

- **Art:** Organisation
- **Grund:** Der Koautor soll den Projektstand über eine Webseite lesen und neue Ideen strukturiert einreichen können.
- **Änderung:** Öffentliche Projektseite mit Arbeitsablauf, Status, Links zu den Planungsdateien und Ideenformular angelegt.
- **Auswirkung:** Das Formular erzeugt ein vorbefülltes GitHub-Issue; dadurch bleibt jede Einreichung prüfbar und verändert den Kanon nicht automatisch.
- **Betroffene Dateien:** `index.html`, `styles.css`, `app.js`, `assets/`, `README.md`
- **Offen:** Inhaltliche Projektideen der Autoren einreichen und gemeinsam entscheiden.

### 2026-10-20 · Projektgrundstruktur angelegt

- **Art:** Organisation
- **Grund:** Neues gemeinsames Buchprojekt nach dem Arbeitsprinzip von `TheBookV2` starten.
- **Änderung:** Ideen-Inbox, Projektbibel, Welten-, Figuren- und Plotplanung, Produktionsregeln, Vorlagen und Hilfsskripte angelegt.
- **Auswirkung:** Inhaltliche Entscheidungen können nun nachvollziehbar gesammelt und synchronisiert werden.
- **Offen:** Ideen der beiden Autoren eintragen und Grundkonzept entscheiden.

## Vorlage

### JJJJ-MM-TT · Kurztitel

- **Art:** Kanon | Plot | Figur | Welt | Stil | Kapitel | Organisation
- **Grund:**
- **Änderung:**
- **Auswirkung:**
- **Betroffene Dateien/Kapitel:**
- **Offen:**
