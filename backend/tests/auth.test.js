import request from 'supertest';
import app from '../server.js';
import UserModel from '../models/User.js';

describe('Auth API Tests', () => {
  // Limpar dados antes de cada teste
  beforeEach(() => {
    UserModel.clearAll();
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const userData = {
        name: 'Teste Usuario',
        email: 'teste@example.com',
        password: 'senha12345',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('deve retornar erro 409 se email já existe', async () => {
      const userData = {
        name: 'Teste Usuario',
        email: 'teste@example.com',
        password: 'senha12345',
      };

      // Primeiro registro
      await request(app).post('/api/auth/register').send(userData);

      // Segundo registro com mesmo email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toBe('Email já cadastrado');
    });

    it('deve retornar erro 400 com senha curta', async () => {
      const userData = {
        name: 'Teste Usuario',
        email: 'teste@example.com',
        password: '123', // Senha muito curta
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toBe('Dados inválidos');
    });

    it('deve retornar erro 400 com email inválido', async () => {
      const userData = {
        name: 'Teste Usuario',
        email: 'email-invalido',
        password: 'senha12345',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      name: 'Teste Usuario',
      email: 'teste@example.com',
      password: 'senha12345',
    };

    beforeEach(async () => {
      // Criar usuário antes de cada teste de login
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('deve retornar erro 401 com senha incorreta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'senha-errada',
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toBe('Email ou senha inválidos');
    });

    it('deve retornar erro 401 com email inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'inexistente@example.com',
          password: testUser.password,
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;

    beforeEach(async () => {
      // Registrar e pegar refresh token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Teste Usuario',
          email: 'teste@example.com',
          password: 'senha12345',
        });

      refreshToken = response.body.refreshToken;
    });

    it('deve renovar tokens com refresh token válido', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      // Nota: refreshToken pode ser igual se gerado no mesmo segundo
    });

    it('deve retornar erro 401 com refresh token inválido', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'token-invalido' })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken;
    let userId;

    beforeEach(async () => {
      // Registrar e pegar access token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Teste Usuario',
          email: 'teste@example.com',
          password: 'senha12345',
        });

      accessToken = response.body.accessToken;
      userId = response.body.user.id;
    });

    it('deve retornar dados do usuário com token válido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.user).toHaveProperty('id', userId);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('deve retornar erro 401 com token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/logout', () => {
    let refreshToken;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Teste Usuario',
          email: 'teste@example.com',
          password: 'senha12345',
        });

      refreshToken = response.body.refreshToken;
    });

    it('deve fazer logout com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toBe('Logout realizado com sucesso');
    });

    it('deve retornar erro 400 sem refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});
