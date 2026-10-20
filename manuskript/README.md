# Manuskript

Kapitel werden nach Freigabe des Grundkonzepts mit dem Hilfsskript angelegt:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\neues-kapitel.ps1 -Nummer 1 -Titel "Arbeitstitel"
```

Je Kapitel entstehen:

- `KAPITEL_NN_PLAN.md` – verbindlicher Schreibauftrag
- `KAPITEL_NN_ROHENTWURF.md` – eigentlicher Text
- `KAPITEL_NN_DELTA.md` – neue Erkenntnisse, Widersprüche und Folgen

Frühere Szenenfassungen liegen in `fassungen/` und werden mit `scripts/szenenfassung.ps1` gesichert oder wiederhergestellt.

Das Manuskript ist derzeit noch leer, weil Prämisse, Figuren und Weltregeln gemeinsam festgelegt werden müssen.
