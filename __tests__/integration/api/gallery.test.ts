// __tests__/integration/api/gallery.test.ts
import { GET } from '@/app/api/admin/gallery/route'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

// Mock complet de db
jest.mock('@/lib/db', () => ({
  db: {
    galleryImage: {
      findMany: jest.fn(),
    },
  },
}))

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('GET /api/admin/gallery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getServerSession as jest.Mock).mockResolvedValue({ 
      user: { email: 'admin@test.com' } 
    })
  })

  it('should return list of images', async () => {
    const mockImages = [
      { 
        id: '1', 
        src: 'test.jpg', 
        title: 'Test Image', 
        order: 0, 
        category: 'Test', 
        featured: false, 
        description: null, 
        createdAt: new Date('2024-01-01'), 
        updatedAt: new Date('2024-01-01') 
      }
    ]
    
    ;(db.galleryImage.findMany as jest.Mock).mockResolvedValue(mockImages)

    // ✅ CORRIGÉ: GET ne prend pas de paramètre
    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual(JSON.parse(JSON.stringify(mockImages)))
    expect(db.galleryImage.findMany).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if not authenticated', async () => {
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    const response = await GET()
    expect(response.status).toBe(401)
  })

  it('should handle errors gracefully', async () => {
    ;(db.galleryImage.findMany as jest.Mock).mockRejectedValue(new Error('Database error'))

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json).toEqual({ error: "Erreur serveur" })
  })
})