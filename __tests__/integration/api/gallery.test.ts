/** @jest-environment node */
// __tests__/integration/api/gallery.test.ts
import { GET } from "@/app/api/admin/gallery/route";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

jest.mock("@/lib/db", () => ({
  db: {
    galleryImage: {
      findMany: jest.fn()
    }
  }
}));

jest.mock("@/lib/auth", () => ({
  auth: jest.fn()
}));

describe("GET /api/admin/gallery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({
      user: { email: "admin@test.com" }
    });
  });

  it("should return list of images with titles from translations", async () => {
    const mockImages = [
      {
        id: "1",
        src: "test.jpg",
        order: 0,
        category: "Test",
        featured: false,
        eventId: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        translations: [
          {
            id: "t1",
            language: "fr",
            title: "Test Image",
            description: null,
            galleryImageId: "1"
          }
        ]
      }
    ];

    (db.galleryImage.findMany as jest.Mock).mockResolvedValue(mockImages);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveLength(1);
    expect(json[0].title).toBe("Test Image");
    expect(json[0].translations).toEqual(mockImages[0].translations);
    expect(db.galleryImage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: { translations: true }
      })
    );
  });

  it("should return 401 if not authenticated", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("should handle database errors gracefully (Resilience Layer)", async () => {
    (db.galleryImage.findMany as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([]);
  });
});
