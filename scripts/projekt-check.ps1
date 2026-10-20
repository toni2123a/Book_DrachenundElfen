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
    'produktion/AENDERUNGSPROTOKOLL.md',
    'produktion/FREIGABESTATUS.json'
)

$problems = [System.Collections.Generic.List[string]]::new()

foreach ($relativePath in $requiredFiles) {
    $fullPath = Join-Path $projectRoot $relativePath
    if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $problems.Add("Pflichtdatei fehlt: $relativePath")
    }
}

$manuscriptDirectory = Join-Path $projectRoot 'manuskript'
$approvalPath = Join-Path $projectRoot 'produktion/FREIGABESTATUS.json'
if (Test-Path -LiteralPath $approvalPath -PathType Leaf) {
    try {
        $approval = Get-Content -LiteralPath $approvalPath -Raw | ConvertFrom-Json
        if ($approval.kapitel1Abgenommen -isnot [bool]) {
            $problems.Add('Freigabestatus: kapitel1Abgenommen muss true oder false sein.')
        } elseif (-not $approval.kapitel1Abgenommen) {
            $versionDirectory = Join-Path $manuscriptDirectory 'fassungen'
            $archives = @(Get-ChildItem -LiteralPath $versionDirectory -Filter 'KAPITEL_*_SZENE_*_v*.md' -File -ErrorAction SilentlyContinue)
            if ($archives.Count -gt 0) {
                $problems.Add('Vor Abnahme von Kapitel 1 dürfen keine archivierten Szenenfassungen vorhanden sein.')
            }
            foreach ($manifestFile in @(Get-ChildItem -LiteralPath $versionDirectory -Filter 'KAPITEL_*_FASSUNGEN.json' -File -ErrorAction SilentlyContinue)) {
                $manifest = Get-Content -LiteralPath $manifestFile.FullName -Raw | ConvertFrom-Json
                if (@($manifest.szenen).Count -gt 0) {
                    $problems.Add("Fassungsindex vor Kapitelabnahme nicht leer: $($manifestFile.Name)")
                }
            }
        }
    } catch {
        $problems.Add("Freigabestatus oder Fassungsindex unlesbar: $($_.Exception.Message)")
    }
}

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
