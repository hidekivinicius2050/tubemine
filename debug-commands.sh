#!/bin/bash

echo "🔍 Debugando banco de dados do servidor..."

echo "1️⃣ Verificando usuário hideki..."
ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite 'SELECT id, name, email FROM users WHERE email = \"hideki@gmail.com\";'"

echo -e "\n2️⃣ Verificando assinaturas do usuário..."
ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite 'SELECT * FROM subscriptions WHERE user_id = 1 ORDER BY created_at DESC;'"

echo -e "\n3️⃣ Testando query da API..."
ssh root@72.60.10.222 "cd /var/www/tubemine && sqlite3 database.sqlite 'SELECT s1.user_id, s1.plan_type, s1.status FROM subscriptions s1 LEFT JOIN subscriptions s2 ON s1.user_id = s2.user_id AND s1.created_at < s2.created_at WHERE s2.user_id IS NULL AND s1.user_id = 1;'"

echo -e "\n✅ Debug concluído!"
