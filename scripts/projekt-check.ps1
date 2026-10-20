$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot

$requiredFiles = @(
    'readme.md',
    'PROJEKTSTATUS.md',
    'ideen/IDEEN_INBOX.md',
    'planung/STORY_BIBLE.md',
    'planung/FIGUREN.md',
    'planung/WELT_UND_MAGIE.md',
    'planung/PLOT_BAUPLAN.md',
    'planung/SCHREIBSTIL.md',
    'planung/ENTSCHEIDUNGEN.md',
    'produktion/PRODUKTIONSREGELN.md',
    'produktion/AENDERUNGSPROTOKOLL.md'
)

$problems = [System.Collections.Generic.List[string]]::new()

foreach ($relativePath in $requiredFiles) {
    $fullPath = Join-Path $projectRoot $relativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $problems.Add("Pflichtdatei fehlt: $relativePath")
    }
}

$manuscriptDirectory = Join-Path $projectRoot 'manuskript'
$chapterFiles = @(Get-ChildItem -LiteralPath $manuscriptDirectory -Filter 'KAPITEL_*.md' -File -ErrorAction SilentlyContinue)
$chapterCodes = @(
    $chapterFiles |
        ForEach-Object {
            if ($_.Name -match '^KAPITEL_(\d{2,3})_') { $Matches[1] }
        } |
        Sort-Object -Unique
)

foreach ($chapterCode in $chapterCodes) {
    foreach ($suffix in @('PLAN', 'ROHENTWURF', 'DELTA')) {
        $relativePath = "manuskript/KAPITEL_${chapterCode}_${suffix}.md"
        if (-not (Test-Path -LiteralPath (Join-Path $projectRoot $relativePath) -PathType Leaf)) {
            $problems.Add("Kapitel $chapterCode ist unvollständig: $relativePath fehlt")
        }
    }
}

if ($problems.Count -gt 0) {
    Write-Host 'Projektcheck fehlgeschlagen:' -ForegroundColor Red
    $problems | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
    exit 1
}

Write-Host "Projektcheck erfolgreich. Pflichtdateien vollständig; $($chapterCodes.Count) Kapitelgruppe(n) geprüft." -ForegroundColor Green
