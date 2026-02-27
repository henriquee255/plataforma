const http = require('http');

console.log('🧪 Testando login no backend...\n');

const data = JSON.stringify({
  email: 'eu.henriquee2501@gmail.com',
  password: 'admin@2026'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Response:', responseData);

    try {
      const json = JSON.parse(responseData);
      if (res.statusCode === 200) {
        console.log('\n✅ LOGIN BEM-SUCEDIDO!');
        console.log(`Token: ${json.token.substring(0, 50)}...`);
      } else {
        console.log('\n❌ Login falhou');
      }
    } catch (e) {
      console.log('\n⚠️ Resposta não é JSON válida');
    }

    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('❌ ERRO DE CONEXÃO:', error.message);
  console.log('\n💡 Dica: Certifique-se que o backend está rodando:');
  console.log('   cd backend');
  console.log('   node server.js\n');
  process.exit(1);
});

req.write(data);
req.end();
