# Script PowerShell para aplicar correção na API de usuários

Write-Host "🔧 Aplicando correção na API de usuários..." -ForegroundColor Green

# Copiar arquivo corrigido para o servidor
Write-Host "📤 Copiando arquivo corrigido..." -ForegroundColor Yellow
scp users-route-corrected.ts root@72.60.10.222:/var/www/tubemine/src/app/api/admin/users/route.ts

# Conectar ao servidor e reiniciar aplicação
Write-Host "🔄 Reiniciando aplicação..." -ForegroundColor Yellow
ssh root@72.60.10.222 "cd /var/www/tubemine && pm2 restart tubemine-saas"

# Aguardar um pouco
Write-Host "⏳ Aguardando aplicação inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Testar a correção
Write-Host "🧪 Testando correção..." -ForegroundColor Yellow
ssh root@72.60.10.222 "cd /var/www/tubemine && echo 'Obtendo token...' && TOKEN=\$(curl -s -X POST http://localhost:3000/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@tubemine.com\",\"password\":\"b50x20Hi@\"}' | grep -o '\"token\":\"[^\"]*\"' | cut -d'\"' -f4) && echo 'Testando API...' && curl -s -X GET http://localhost:3000/api/admin/users -H \"Authorization: Bearer \$TOKEN\" | grep -A 10 -B 5 'hideki'"

Write-Host "✅ Correção aplicada!" -ForegroundColor Green
Write-Host "🎯 Verifique se o usuário 'hideki' aparece com 'plan_type':'pro'" -ForegroundColor Cyan
