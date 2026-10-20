param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('Sichern', 'Wiederherstellen')]
    [string]$Aktion,

    [Parameter(Mandatory = $true)]
    [ValidateRange(1, 999)]
    [int]$Kapitel,

    [Parameter(Mandatory = $true)]
    [ValidateRange(1, 99)]
    [int]$Szene,

    # Nur bei Wiederherstellen: die Vorfassung, die zurück ins Manuskript soll, z. B. v1.
    [ValidatePattern('^v\d+$')]
    [string]$Fassung,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$Anlass
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$chapterCode = '{0:D2}' -f $Kapitel
$sceneCode = '{0:D2}' -f $Szene
$draftPath = Join-Path $projectRoot "manuskript/KAPITEL_${chapterCode}_ROHENTWURF.md"
$versionDirectory = Join-Path $projectRoot 'manuskript/fassungen'
$manifestPath = Join-Path $versionDirectory "KAPITEL_${chapterCode}_FASSUNGEN.json"
$utf8 = New-Object System.Text.UTF8Encoding($false)
$today = (Get-Date).ToString('dd.MM.yyyy')

if ($Aktion -eq 'Wiederherstellen' -and -not $Fassung) {
    throw 'Zum Wiederherstellen bitte -Fassung angeben, z. B. -Fassung v1.'
}
if (-not (Test-Path -LiteralPath $draftPath -PathType Leaf)) {
    throw "Rohentwurf fehlt: $draftPath"
}

# Gleiche Zerlegung wie auf der Webseite: Kopf entfernen, Szenen an „* * *“ trennen.
$draft = [System.IO.File]::ReadAllText($draftPath, $utf8)
$headerMatch = [regex]::Match($draft, '^#[^\n]*\n+(?:\*\*Status:\*\*[^\n]*\n+)?(?:<!--[\s\S]*?-->\s*)?')
$header = $headerMatch.Value
$parts = [regex]::Split($draft.Substring($header.Length), '(\r?\n\* \* \*\r?\n)')
$sceneCount = [math]::Ceiling($parts.Count / 2)
if ($Szene -gt $sceneCount) {
    throw "Kapitel $chapterCode hat nur $sceneCount Szene(n)."
}
$sceneIndex = 2 * ($Szene - 1)
$currentText = $parts[$sceneIndex].Trim()

if (Test-Path -LiteralPath $manifestPath -PathType Leaf) {
    $manifest = [System.IO.File]::ReadAllText($manifestPath, $utf8) | ConvertFrom-Json
} else {
    New-Item -ItemType Directory -Force -Path $versionDirectory | Out-Null
    $manifest = [pscustomobject]@{ kapitel = $Kapitel; szenen = @() }
}

$entry = @($manifest.szenen | Where-Object { $_.szene -eq $Szene }) | Select-Object -First 1
$current = if ($entry -and $entry.aktuell) { $entry.aktuell } else { 'v1' }
$previous = @(if ($entry) { $entry.vorher | Where-Object { $_ } })

function Get-VersionFileName([string]$version) {
    "KAPITEL_${chapterCode}_SZENE_${sceneCode}_${version}.md"
}

function Save-SceneVersion([string]$version, [string]$text) {
    $fileName = Get-VersionFileName $version
    $path = Join-Path $versionDirectory $fileName
    if (Test-Path -LiteralPath $path -PathType Leaf) {
        $existing = [System.IO.File]::ReadAllText($path, $utf8).Trim()
        if ($existing -ne $text) {
            throw "$fileName existiert bereits mit anderem Inhalt. Bitte prüfen, bevor etwas überschrieben wird."
        }
    } else {
        [System.IO.File]::WriteAllText($path, "$text`n", $utf8)
    }
    $fileName
}

# Die aktuelle Szene wandert in beiden Fällen als Vorfassung ins Archiv.
$archivedFile = Save-SceneVersion $current $currentText
$archived = [pscustomobject]@{ fassung = $current; datum = $today; datei = $archivedFile; anlass = $Anlass }

if ($Aktion -eq 'Sichern') {
    $numbers = @($current) + @($previous | ForEach-Object { $_.fassung }) | ForEach-Object { [int]($_ -replace '^v', '') }
    $newCurrent = 'v' + (($numbers | Measure-Object -Maximum).Maximum + 1)
    $previous = @($previous | Where-Object { $_.fassung -ne $current }) + $archived
} else {
    $target = $previous | Where-Object { $_.fassung -eq $Fassung } | Select-Object -First 1
    if (-not $target) {
        throw "Szene $Szene besitzt keine Vorfassung $Fassung."
    }
    $targetText = [System.IO.File]::ReadAllText((Join-Path $versionDirectory $target.datei), $utf8).Trim()
    # Jede Szene steht mit genau einer Leerzeile zwischen den Trennern.
    $leading = if ($sceneIndex -gt 0) { "`n" } else { '' }
    $parts[$sceneIndex] = "$leading$targetText`n"
    [System.IO.File]::WriteAllText($draftPath, $header + ($parts -join ''), $utf8)
    $newCurrent = $Fassung
    $previous = @($previous | Where-Object { $_.fassung -ne $Fassung -and $_.fassung -ne $current }) + $archived
}

$newEntry = [pscustomobject]@{
    szene = $Szene
    aktuell = $newCurrent
    aktuellSeit = $today
    vorher = @($previous | Sort-Object { [int]($_.fassung -replace '^v', '') })
}
$manifest.szenen = @(@($manifest.szenen | Where-Object { $_ -and $_.szene -ne $Szene }) + $newEntry | Sort-Object szene)
[System.IO.File]::WriteAllText($manifestPath, (ConvertTo-Json -InputObject $manifest -Depth 6) + "`n", $utf8)

if ($Aktion -eq 'Sichern') {
    Write-Host "Szene $Szene ($current) gesichert: manuskript/fassungen/$archivedFile" -ForegroundColor Green
    Write-Host "Jetzt Szene $Szene im Rohentwurf überarbeiten; der neue Text gilt als $newCurrent."
} else {
    Write-Host "Szene $Szene auf $Fassung zurückgesetzt. Die verdrängte Fassung $current bleibt unter manuskript/fassungen/$archivedFile erhalten." -ForegroundColor Green
}
