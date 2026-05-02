@echo off
echo Lancement du Backend...
start cmd /k "cd backend && node index.js"

echo Lancement du Frontend...
start cmd /k "cd frontend && npm run dev"

echo Application Jangatt lancee ! (Les deux terminaux sont ouverts)
