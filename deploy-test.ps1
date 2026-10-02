<#
.SYNOPSIS
    Публикует ТЕСТОВУЮ версию журнала в sonofvibedev/student-journal-test (GitHub Pages).

.DESCRIPTION
    Отличия от deploy-fix.ps1 (рабочая версия):
      * работает в папке student-journal-test;
      * перед отправкой проверяет, что origin указывает именно на тестовый репозиторий —
        если это рабочий репозиторий, скрипт останавливается и ничего не пушит;
      * публикует ещё env.js (окружение тестового стенда) и robots.txt (noindex).

    Что делает:
      1. Переходит в папку тестового репозитория.
      2. Проверяет origin (защита от публикации в рабочий репозиторий).
      3. Подтягивает актуальную версию (git pull).
      4. Проставляет дату и время этого деплоя в changelog.js (APP_VERSION_DATE), а если
         его ещё нет — в index.html и cabinet.html (старая константа WHATS_NEW_DATE).
      5. Добавляет изменённые файлы, коммитит и отправляет на GitHub.
    Сайт обновляется через 1-2 минуты: https://sonofvibedev.github.io/student-journal-test/

.PARAMETER RepoPath
    Папка с тестовым репозиторием. По умолчанию — та, где лежит этот скрипт.

.EXAMPLE
    .\deploy-test.ps1
    .\deploy-test.ps1 -CommitMessage "Проверка тёмной темы"
#>

param(
    [string]$RepoPath = $PSScriptRoot,
    [string]$CommitMessage = "Тестовый стенд: обновление"
)

if ([string]::IsNullOrWhiteSpace($RepoPath)) { $RepoPath = (Get-Location).Path }

if (-not (Test-Path $RepoPath)) {
    Write-Error "Папка не найдена: $RepoPath"
    exit 1
}

Set-Location $RepoPath
Write-Host "Тестовый репозиторий: $RepoPath" -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $RepoPath "index.html"))) {
    Write-Error "В этой папке нет index.html."
    exit 1
}

# --- Защита: публикуем только в тестовый репозиторий ---
$origin = (git remote get-url origin) 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($origin)) {
    Write-Error "У репозитория нет origin. Публикация отменена."
    exit 1
}
if ($origin -notmatch "student-journal-test") {
    Write-Error "origin = $origin. Это НЕ тестовый репозиторий — публикация отменена. Для рабочей версии есть deploy-fix.ps1."
    exit 1
}
Write-Host "origin: $origin" -ForegroundColor DarkGray

git pull --no-edit --no-rebase
if ($LASTEXITCODE -ne 0) {
    Write-Error "git pull не смог обновить локальную копию (см. ошибку выше). Push отменён, чтобы не потерять изменения."
    exit 1
}

# Дату деплоя пишем через .NET, чтобы гарантированно сохранить UTF-8 с BOM и не сломать кириллицу.
$deployTimestamp = Get-Date -Format "dd.MM.yyyy, HH:mm"
$utf8WithBom = New-Object System.Text.UTF8Encoding($true)

function Set-DeployDate {
    param([string]$FileName, [string]$Pattern, [string]$Replacement)
    $p = Join-Path $RepoPath $FileName
    if (-not (Test-Path $p)) { return }
    $content = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    $updated = [System.Text.RegularExpressions.Regex]::Replace($content, $Pattern, $Replacement)
    if ($updated -ne $content) {
        [System.IO.File]::WriteAllText($p, $updated, $utf8WithBom)
        Write-Host "Дата обновления в $FileName проставлена: $deployTimestamp" -ForegroundColor Cyan
    }
}

Set-DeployDate -FileName "changelog.js" -Pattern "const APP_VERSION_DATE = '[^']*';" -Replacement "const APP_VERSION_DATE = '$deployTimestamp';"
foreach ($htmlName in @("index.html", "cabinet.html")) {
    Set-DeployDate -FileName $htmlName -Pattern "const WHATS_NEW_DATE = '[^']*';" -Replacement "const WHATS_NEW_DATE = '$deployTimestamp';"
}

# Добавляем файлы (каждый — только если реально есть в папке)
$files = @(
    "index.html", "cabinet.html", "pass.html",
    "app.css", "profile.css",
    "env.js", "theme.js", "changelog.js", "shared.js", "profile.js", "studak.js", "schedule.js", "notify.js",
    "data.json", "manifest.json", "sw.js", "robots.txt", "icons", "fonts"
)
foreach ($name in $files) {
    if (Test-Path (Join-Path $RepoPath $name)) { git add $name }
}

git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "Изменений нет — файлы в репозитории уже совпадают с локальными." -ForegroundColor Yellow
    exit 0
}

git commit -m $CommitMessage

git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push отклонён — на GitHub появились изменения после pull. Пробую ещё раз..." -ForegroundColor Yellow
    git pull --no-edit --no-rebase
    git push
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Push всё ещё не проходит. Пришлите текст ошибки выше."
        exit 1
    }
}

Write-Host "Готово. Через 1-2 минуты обновится https://sonofvibedev.github.io/student-journal-test/" -ForegroundColor Green
