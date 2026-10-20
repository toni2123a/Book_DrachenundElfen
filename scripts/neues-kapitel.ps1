param(
    [Parameter(Mandatory = $true)]
    [ValidateRange(1, 999)]
    [int]$Nummer,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Titel
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$manuscriptDirectory = Join-Path $projectRoot 'manuskript'
$chapterCode = '{0:D2}' -f $Nummer

$planPath = Join-Path $manuscriptDirectory "KAPITEL_${chapterCode}_PLAN.md"
$draftPath = Join-Path $manuscriptDirectory "KAPITEL_${chapterCode}_ROHENTWURF.md"
$deltaPath = Join-Path $manuscriptDirectory "KAPITEL_${chapterCode}_DELTA.md"

$targets = @($planPath, $draftPath, $deltaPath)
$existing = @($targets | Where-Object { Test-Path -LiteralPath $_ })
if ($existing.Count -gt 0) {
    throw "Kapitel $chapterCode wurde nicht angelegt. Bereits vorhanden: $($existing -join ', ')"
}

$plan = @"
# Kapitel $chapterCode · $Titel

- **Status:** geplant
- **Perspektive:** OFFEN
- **Ort und Zeit:** OFFEN
- **Zielwortzahl:** OFFEN
- **Akt/Abschnitt:** OFFEN

## Aufgabe im Gesamtplot

OFFEN

## Ziel, Konflikt, Ergebnis

- **Ziel der Perspektivfigur:** OFFEN
- **Konflikt/Widerstand:** OFFEN
- **Ergebnis/Veränderung:** OFFEN
- **Kapitelhaken:** OFFEN

## Szenen

1. OFFEN

## Verbindlicher Kanon

- OFFEN

## Setups und Payoffs

- **Einführen:** OFFEN
- **Aufgreifen:** OFFEN
- **Auflösen:** OFFEN

## Nicht vorwegnehmen

- OFFEN
"@

$draft = @"
# Kapitel $Nummer · $Titel

<!-- Rohentwurf. Neue Kanonannahmen zusätzlich in KAPITEL_${chapterCode}_DELTA.md erfassen. -->

"@

$delta = @"
# Delta · Kapitel $chapterCode · $Titel

## Grün · Konkretisierungen ohne Folgeänderung

- Noch keine.

## Gelb · Entscheidung und begrenzte Synchronisierung nötig

- Noch keine.

## Rot · Widerspruch oder große Folgeänderung

- Noch keine.

## Folgenprüfung

- **Story-Bibel:** keine
- **Figuren:** keine
- **Welt und Magie:** keine
- **Plot-Bauplan:** keine
- **Spätere Kapitel:** keine

## Entscheidung/Synchronisierung

Noch offen.
"@

New-Item -ItemType Directory -Force -Path $manuscriptDirectory | Out-Null
Set-Content -LiteralPath $planPath -Value $plan -Encoding utf8
Set-Content -LiteralPath $draftPath -Value $draft -Encoding utf8
Set-Content -LiteralPath $deltaPath -Value $delta -Encoding utf8

Write-Host "Kapitel $chapterCode angelegt:"
$targets | ForEach-Object { Write-Host "- $_" }
