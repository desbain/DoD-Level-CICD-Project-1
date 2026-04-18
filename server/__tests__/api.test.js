const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return operational status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('operational');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/missions', () => {
    it('should return all missions', async () => {
      const res = await request(app).get('/api/missions');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('missions');
      expect(Array.isArray(res.body.missions)).toBe(true);
      expect(res.body.count).toBeGreaterThan(0);
    });

    it('should filter missions by status', async () => {
      const res = await request(app).get('/api/missions?status=Active');
      expect(res.statusCode).toBe(200);
      res.body.missions.forEach(mission => {
        expect(mission.status).toBe('Active');
      });
    });

    it('should filter missions by priority', async () => {
      const res = await request(app).get('/api/missions?priority=Critical');
      expect(res.statusCode).toBe(200);
      res.body.missions.forEach(mission => {
        expect(mission.priority).toBe('Critical');
      });
    });
  });

  describe('GET /api/personnel', () => {
    it('should return personnel data', async () => {
      const res = await request(app).get('/api/personnel');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('deployed');
      expect(res.body).toHaveProperty('available');
      expect(res.body).toHaveProperty('breakdown');
      expect(res.body.total).toBeGreaterThan(0);
    });
  });

  describe('GET /api/equipment', () => {
    it('should return equipment readiness data', async () => {
      const res = await request(app).get('/api/equipment');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('categories');
      expect(res.body).toHaveProperty('overallReadiness');
      expect(Array.isArray(res.body.categories)).toBe(true);
    });

    it('should have valid readiness percentages', async () => {
      const res = await request(app).get('/api/equipment');
      res.body.categories.forEach(cat => {
        expect(cat.readiness).toBeGreaterThanOrEqual(0);
        expect(cat.readiness).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('GET /api/alerts', () => {
    it('should return alerts sorted by timestamp', async () => {
      const res = await request(app).get('/api/alerts');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('alerts');
      const timestamps = res.body.alerts.map(a => new Date(a.timestamp).getTime());
      for (let i = 1; i < timestamps.length; i++) {
        expect(timestamps[i - 1]).toBeGreaterThanOrEqual(timestamps[i]);
      }
    });

    it('should filter alerts by severity', async () => {
      const res = await request(app).get('/api/alerts?severity=critical');
      expect(res.statusCode).toBe(200);
      res.body.alerts.forEach(alert => {
        expect(alert.severity).toBe('critical');
      });
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers).toHaveProperty('x-content-type-options');
      expect(res.headers).toHaveProperty('x-frame-options');
    });
  });
});
