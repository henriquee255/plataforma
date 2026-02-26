const http = require('http');
const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data),
            headers: res.headers
          });
        } catch {
          resolve({
            status: res.statusCode,
            body: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const testAPI = async () => {
  try {
    console.log('\n🌐 TESTE DE API HTTP\n');

    // 1. Login
    console.log('1️⃣  Fazendo login...');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: 'eu.henriquee2501@gmail.com',
      password: 'admin@2026'
    });

    if (loginRes.status === 200) {
      console.log('✅ Login bem-sucedido!');
      console.log('   Token:', loginRes.body.token.substring(0, 30) + '...');
    } else {
      console.log('❌ Login falhou!', loginRes.body.message);
      process.exit(1);
    }

    const adminToken = loginRes.body.token;

    // 2. Buscar todos os usuários
    console.log('\n2️⃣  Buscando todos os usuários (/api/users)...');
    const usersRes = await makeRequest('GET', '/api/users', null, adminToken);

    if (usersRes.status === 200) {
      console.log('✅ Requisição bem-sucedida!');
      console.log('   Total de usuários:', usersRes.body.total);
      console.log('   Usuários:');
      usersRes.body.users.forEach((user, i) => {
        console.log(`      ${i + 1}. ${user.nome} (${user.email}) - ${user.role}`);
      });
    } else {
      console.log('❌ Erro:', usersRes.status, usersRes.body.message);
    }

    // 3. Testar sem token (deve falhar)
    console.log('\n3️⃣  Testando sem autenticação (deve falhar)...');
    const noAuthRes = await makeRequest('GET', '/api/users');
    if (noAuthRes.status !== 200) {
      console.log('✅ Corretamente bloqueado (Status:', noAuthRes.status + ')');
    } else {
      console.log('❌ ERRO: Deveria rejeitar sem token!');
    }

    console.log('\n✨ Testes de API concluídos!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n💡 Dica: Certifique-se que o servidor está rodando em localhost:5000');
    process.exit(1);
  }
};

// Dar tempo para servidor iniciar
setTimeout(testAPI, 1000);
