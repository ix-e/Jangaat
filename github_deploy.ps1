# Nettoyage des sous-depots git (pour eviter les submodules non voulus)
if (Test-Path "Main/frontend/.git") {
    Remove-Item -Recurse -Force "Main/frontend/.git"
    Write-Host "Sous-depot .git supprime dans frontend."
}

# Re-initialisation propre si necessaire
if (Test-Path ".git") {
    Remove-Item -Recurse -Force ".git"
}
git init
git branch -M main

# Commit du Frontend (les fichiers seront maintenant inclus)
git add Main/frontend
git commit -m "feat(frontend): initialisation de l'application Next.js et de l'UI"

# Commit du Backend
git add Main/backend
git commit -m "feat(backend): initialisation de l'API Node.js, Prisma et logique IA"

# Commit de la configuration globale et documentation
git add .
git commit -m "chore: ajout du README, des scripts de lancement et configuration Git"

# Ajout du Tag
git tag v1.0.0

Write-Host "Historique Git local cree avec succes !"
Write-Host "Verification de l'authentification GitHub CLI..."

# Essai de creation du depot public et push
gh repo create ix-e/Jangaat --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "Depot Jangaat cree sur GitHub et code pousse !"
    Write-Host "Poussee du tag..."
    git push origin v1.0.0
    
    Write-Host "Activation des discussions (si possible via API)..."
    gh api graphql -f query='mutation { createDiscussionCategory(input: {repositoryId: (gh api repos/ix-e/Jangaat --jq .node_id), name: \"General\", format: DISCUSSION}) { category { id } } }' -q .data
} else {
    Write-Host "Attention : La creation du depot a echoue. Il est possible que 'gh' ne soit pas authentifie."
    Write-Host "Veuillez executer 'gh auth login' puis reessayer de pousser avec :"
    Write-Host "gh repo create ix-e/Jangaat --public --source=. --remote=origin --push"
    Write-Host "git push origin v1.0.0"
}
