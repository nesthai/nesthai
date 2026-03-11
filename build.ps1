# ============================================
# BEAULIEU PROPERTY - Build System
# Script PowerShell de generation des pages
# ============================================

param(
    [switch]$Watch = $false,
    [string]$Page = "",
    [switch]$Help = $false
)

# Afficher l'aide
if ($Help) {
    Write-Host ""
    Write-Host "BEAULIEU PROPERTY - Build System" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "USAGE:" -ForegroundColor Yellow
    Write-Host "    .\build.ps1              # Build toutes les pages"
    Write-Host "    .\build.ps1 -Watch       # Mode watch (rebuild auto)"
    Write-Host "    .\build.ps1 -Page index  # Build une page specifique"
    Write-Host "    .\build.ps1 -Help        # Affiche cette aide"
    Write-Host ""
    Write-Host "STRUCTURE:" -ForegroundColor Yellow
    Write-Host "    _partials/      # Composants HTML reutilisables"
    Write-Host "    _sources/       # Pages sources (contenu uniquement)"
    Write-Host "    [fichiers .html generes a la racine]"
    Write-Host ""
    exit 0
}

# Configuration
$Config = @{
    partialsDir = "_partials"
    sourcesDir = "_sources"
    outputDir = "."
}

# Fonction pour logger
function Write-Status($Message, $Type = "Info") {
    $color = switch ($Type) {
        "Success" { "Green" }
        "Error" { "Red" }
        "Warning" { "Yellow" }
        default { "Cyan" }
    }
    $prefix = switch ($Type) {
        "Success" { "[OK]" }
        "Error" { "[ER]" }
        "Warning" { "[AV]" }
        default { "[--]" }
    }
    Write-Host "$prefix $Message" -ForegroundColor $color
}

# Charger les partials
function Get-Partials {
    $partials = @{}
    
    if (-not (Test-Path $Config.partialsDir)) {
        Write-Status "Dossier partials non trouve: $($Config.partialsDir)" "Error"
        exit 1
    }
    
    Get-ChildItem -Path $Config.partialsDir -Filter "*.html" | ForEach-Object {
        $name = $_.BaseName
        $content = Get-Content $_.FullName -Raw -Encoding UTF8
        $partials[$name] = $content
    }
    
    return $partials
}

# Parser les meta donnees d'un fichier source
function Parse-SourceFile($filepath) {
    $content = Get-Content $filepath -Raw -Encoding UTF8
    
    # Extraire les meta donnees (entre <!--META et -->)
    $meta = @{}
    if ($content -match '<!--META\s*([\s\S]*?)-->') {
        $metaBlock = $matches[1]
        
        # Parser chaque ligne key: value
        $metaBlock -split "`n" | ForEach-Object {
            if ($_ -match '^\s*(\w+):\s*(.+)$') {
                $meta[$matches[1].Trim()] = $matches[2].Trim()
            }
        }
        
        # Retirer le bloc META du contenu
        $content = $content -replace '<!--META\s*[\s\S]*?-->', ''
    }
    
    return @{
        meta = $meta
        content = $content.Trim()
    }
}

# Generer une page
function Build-Page($sourceFile, $partials) {
    $filename = $sourceFile.Name
    $outputFile = Join-Path $Config.outputDir $filename
    
    Write-Status "Build $filename..."
    
    # Parser le fichier source
    $parsed = Parse-SourceFile $sourceFile.FullName
    $meta = $parsed.meta
    $content = $parsed.content
    
    # Recuperer les valeurs
    $title = if ($meta.title) { $meta.title } else { "Beaulieu Property Management" }
    $description = if ($meta.description) { $meta.description } else { "Agence immobiliere de luxe a Pattaya" }
    $keywords = if ($meta.keywords) { $meta.keywords } else { "immobilier pattaya, condo thailande" }
    $canonical = "https://www.beaulieu-pattaya.com/$filename"
    $ogImage = if ($meta.image) { $meta.image } else { "https://www.beaulieu-pattaya.com/images/og-image.jpg" }
    
    # Construire le HTML final
    $htmlLines = @()
    
    # 1. Debut du head
    $htmlLines += $partials["head-start"]
    
    # 2. Meta tags specifiques
    $htmlLines += "    <title>$title</title>"
    $htmlLines += "    <meta name=`"description`" content=`"$description`">"
    $htmlLines += "    <meta name=`"keywords`" content=`"$keywords`">"
    $htmlLines += "    <link rel=`"canonical`" href=`"$canonical`">"
    $htmlLines += "    <meta property=`"og:title`" content=`"$title`">"
    $htmlLines += "    <meta property=`"og:description`" content=`"$description`">"
    $htmlLines += "    <meta property=`"og:url`" content=`"$canonical`">"
    $htmlLines += "    <meta property=`"og:image`" content=`"$ogImage`">"
    
    # 3. Meta communs
    $htmlLines += $partials["head-meta"]
    
    # 4. CSS specifique si present
    if ($meta.css) {
        $htmlLines += "    <link rel=`"stylesheet`" href=`"css/$($meta.css)`">"
    }
    
    # 5. Fin du head
    $htmlLines += $partials["head-end"]
    
    # 6. Header
    $header = $partials["header"]
    
    # Activer le bon lien de navigation
    $nav = $meta.nav
    if ($nav) {
        $header = $header -replace "data-nav=`"$nav`">", "data-nav=`"$nav`" class=`"active`" aria-current=`"page`">"
        # Desactiver les autres
        $header = $header -replace 'data-nav="[^"]+">(?!\s*ACCUEIL)', '>'
    }
    
    $htmlLines += $header
    
    # 7. Contenu principal
    $htmlLines += $content
    
    # 8. Footer
    $footer = $partials["footer"]
    
    # Scripts specifiques si presents
    if ($meta.scripts) {
        $scripts = $meta.scripts -split "," | ForEach-Object { $_.Trim() }
        $scriptLines = $scripts | ForEach-Object { "    <script src=`"js/$_.js`"></script>" }
        $footer = $footer -replace "(<!-- Scripts -->)", "`$1`n$($scriptLines -join "`n")"
    }
    
    $htmlLines += $footer
    
    # Ecrire le fichier
    $htmlLines | Out-File -FilePath $outputFile -Encoding UTF8
    
    Write-Status "Genere: $filename" "Success"
}

# Build toutes les pages
function Build-All {
    Write-Host ""
    Write-Host "BEAULIEU PROPERTY - BUILD SYSTEM" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Verifier les dossiers
    if (-not (Test-Path $Config.sourcesDir)) {
        Write-Status "Dossier sources non trouve: $($Config.sourcesDir)" "Error"
        Write-Status "Creez le dossier '_sources' et ajoutez vos pages"
        exit 1
    }
    
    # Charger les partials
    Write-Status "Chargement des partials..."
    $partials = Get-Partials
    $partialCount = ($partials.Keys).Count
    Write-Status "$partialCount partials charges"
    Write-Host ""
    
    # Compter les pages
    $sourceFiles = Get-ChildItem -Path $Config.sourcesDir -Filter "*.html"
    Write-Status "$($sourceFiles.Count) pages a generer"
    Write-Host ""
    
    # Build chaque page
    $success = 0
    $failed = 0
    
    foreach ($file in $sourceFiles) {
        try {
            Build-Page $file $partials
            $success++
        }
        catch {
            Write-Status "Erreur sur $($file.Name): $_" "Error"
            $failed++
        }
    }
    
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Status "Termine: $success succes, $failed echecs" $(if ($failed -eq 0) { "Success" } else { "Warning" })
    Write-Host ""
}

# Build une page specifique
function Build-Single($pageName) {
    $sourceFile = Join-Path $Config.sourcesDir "$pageName.html"
    
    if (-not (Test-Path $sourceFile)) {
        Write-Status "Page non trouvee: $sourceFile" "Error"
        exit 1
    }
    
    $partials = Get-Partials
    Build-Page (Get-ChildItem $sourceFile) $partials
}

# Mode Watch
function Watch-Files {
    Write-Host ""
    Write-Host "MODE WATCH ACTIF" -ForegroundColor Cyan
    Write-Host "Surveillance de: $($Config.sourcesDir) et $($Config.partialsDir)"
    Write-Host "Appuyez sur Ctrl+C pour arreter"
    Write-Host ""
    
    # Build initial
    Build-All
    
    Write-Host "En attente de modifications..."
    Write-Host ""
    
    # Creer les watchers
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = (Resolve-Path $Config.sourcesDir).Path
    $watcher.Filter = "*.html"
    $watcher.IncludeSubdirectories = $false
    $watcher.EnableRaisingEvents = $true
    
    $watcherPartials = New-Object System.IO.FileSystemWatcher
    $watcherPartials.Path = (Resolve-Path $Config.partialsDir).Path
    $watcherPartials.Filter = "*.html"
    $watcherPartials.IncludeSubdirectories = $false
    $watcherPartials.EnableRaisingEvents = $true
    
    $action = {
        $path = $Event.SourceEventArgs.FullPath
        $name = $Event.SourceEventArgs.Name
        Write-Host ""
        Write-Status "Fichier modifie: $name" "Warning"
        Start-Sleep -Milliseconds 500
        & $PSScriptRoot/build.ps1
        Write-Host ""
        Write-Host "En attente de modifications... (Ctrl+C pour arreter)"
    }
    
    Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
    Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
    Register-ObjectEvent $watcherPartials "Changed" -Action $action | Out-Null
    Register-ObjectEvent $watcherPartials "Created" -Action $action | Out-Null
    
    # Boucle infinie
    while ($true) {
        Start-Sleep -Seconds 1
    }
}

# === EXECUTION PRINCIPALE ===

if ($Watch) {
    Watch-Files
}
elseif ($Page) {
    Build-Single $Page
}
else {
    Build-All
}
