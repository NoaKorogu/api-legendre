const request = require('supertest');
const app = require('../app');

const chauffeurData = {
  nom: 'Test',
  prenom: 'Chauffeur',
  email: `test.chauffeur.${Date.now()}@legendre.fr`,
  telephone: '0600000000',
  password: 'password123',
  role: 'chauffeur'
};

let token;

describe('Auth', () => {
  test('POST /api/v1/auth/register - créer un chauffeur', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(chauffeurData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.role).toBe('chauffeur');
  });

  test('POST /api/v1/auth/login - login valide', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: chauffeurData.email,
      password: chauffeurData.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('POST /api/v1/auth/login - mauvais password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: chauffeurData.email,
      password: 'mauvais'
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('Chauffeurs', () => {
  test('GET /api/v1/chauffeurs - sans token → 401', async () => {
    const res = await request(app).get('/api/v1/chauffeurs');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/v1/chauffeurs - avec token → 200', async () => {
    const res = await request(app)
      .get('/api/v1/chauffeurs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Livraisons - restriction de rôle', () => {
  test('PATCH /api/v1/livraisons/1/statut - statut invalide → 400', async () => {
    const res = await request(app)
      .patch('/api/v1/livraisons/1/statut')
      .set('Authorization', `Bearer ${token}`)
      .send({ statut: 'invalide' });
    expect(res.statusCode).toBe(400);
  });
});