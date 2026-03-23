/**
 * @jest-environment node
 */
/**
 * CREDDA-ULPGL — API Integration Tests
 * Run against a live dev server: npm run dev → npm run test:integration
 */

const BASE = 'http://localhost:3000'

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`)
  return { status: res.status, data: await res.json().catch(() => null) }
}

async function post(path: string, body: object) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: res.status, data: await res.json().catch(() => null) }
}

jest.setTimeout(60000);

describe('CREDDA API Routes', () => {

  // ── HEALTH ──────────────────────────────────────────────────────────────
  test('GET /api/health → 200 + db connected', async () => {
    const { status, data } = await get('/api/health')
    expect(status).toBe(200)
    expect(data.status).toBe('ok')
    expect(data.db).toBe('connected')
  })

  // ── PUBLIC ROUTES ────────────────────────────────────────────────────────
  test('GET /api/articles → 200 + array', async () => {
    const { status, data } = await get('/api/articles?locale=fr')
    expect(status).toBe(200)
    // articles returns { items: [...], pagination: {...} }
    expect(Array.isArray(data.items ?? data.data ?? data)).toBe(true)
  })

  test('GET /api/events → 200 + array', async () => {
    const { status, data } = await get('/api/events?locale=fr')
    expect(status).toBe(200)
    // events returns { items: [...] }
    expect(Array.isArray(data.items ?? data.data ?? data)).toBe(true)
  })

  test('GET /api/gallery → 200 + array', async () => {
    const { status, data } = await get('/api/gallery?locale=fr')
    expect(status).toBe(200)
    // gallery returns { items: [...] }
    expect(Array.isArray(data.items ?? data.data ?? data)).toBe(true)
  })

  test('GET /api/testimonials → 200 + array', async () => {
    const { status, data } = await get('/api/testimonials?locale=fr')
    expect(status).toBe(200)
    // testimonials returns { items: [...] }
    expect(Array.isArray(data.items ?? data.data ?? data)).toBe(true)
  })

  test('GET /api/team → 200 + array', async () => {
    const { status, data } = await get('/api/team?locale=fr')
    expect(status).toBe(200)
    // team returns { items: [...] }
    expect(Array.isArray(data.items ?? data.data ?? data)).toBe(true)
  })

  // ── ADMIN ROUTES — must return 401 without session ───────────────────────
  test('GET /api/admin/articles → 401 without auth', async () => {
    const { status } = await get('/api/admin/articles')
    expect(status).toBe(401)
  })

  test('POST /api/admin/articles → 401 without auth', async () => {
    const { status } = await post('/api/admin/articles', { title: 'test' })
    expect(status).toBe(401)
  })

  test('GET /api/admin/events → 401 without auth', async () => {
    const { status } = await get('/api/admin/events')
    expect(status).toBe(401)
  })

  test('GET /api/admin/gallery → 401 without auth', async () => {
    const { status } = await get('/api/admin/gallery')
    expect(status).toBe(401)
  })

  test('GET /api/admin/team → 401 without auth', async () => {
    const { status } = await get('/api/admin/team')
    expect(status).toBe(401)
  })

  test('GET /api/admin/testimonials → 401 without auth', async () => {
    const { status } = await get('/api/admin/testimonials')
    expect(status).toBe(401)
  })

  test('GET /api/admin/messages/stats → 401 without auth', async () => {
    const { status } = await get('/api/admin/messages/stats')
    expect(status).toBe(401)
  })

  test('GET /api/admin/messages/some-id → 401 without auth', async () => {
    // This route only supports PATCH/DELETE, so check DELETE for 401
    const res = await fetch(`${BASE}/api/admin/messages/test-id-123`, { method: 'DELETE' })
    expect(res.status).toBe(401)
  })

  test('POST /api/admin/messages/some-id/reply → 401 without auth', async () => {
    const { status } = await post('/api/admin/messages/test-id-123/reply', { content: 'test' })
    expect(status).toBe(401)
  })

  // ── CONTACT ──────────────────────────────────────────────────────────────
  test('POST /api/contact → 200 or 400 (not 500)', async () => {
    const { status } = await post('/api/contact', {
      name: 'Test User',
      email: 'test@test.com',
      subject: 'Test',
      message: 'Test message from automated test',
    })
    expect(status).not.toBe(500)
    expect([200, 201, 400]).toContain(status)
  })

  // ── 404 ──────────────────────────────────────────────────────────────────
  test('GET /fr/page-inexistante → 404 not redirect loop', async () => {
    const res = await fetch(`${BASE}/fr/cette-page-nexiste-pas`, { redirect: 'manual' })
    // Must be 404, not 307 redirect loop
    expect(res.status).toBe(404)
  })

})
