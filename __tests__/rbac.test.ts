import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClinicalCases, generateSecureDocumentUrl } from "../app/[locale]/(dashboard)/admin/clinique/actions";
import * as authLib from "@/lib/auth";

// Mock de la base de données
vi.mock("@/lib/db", () => ({
  db: {
    clinicalCase: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

// Mock de Supabase
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    storage: {
      from: vi.fn().mockReturnThis(),
      createSignedUrl: vi.fn(),
    },
  },
}));

// Mock de Next.js cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Validation RBAC - Module Clinique", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doit refuser l'accès aux cas cliniques pour un simple chercheur (RESEARCHER)", async () => {
    // Simuler un chercheur
    vi.spyOn(authLib, "auth").mockResolvedValue({
      user: { id: "u1", role: "RESEARCHER", name: "Chercheur Alpha" },
      expires: "1"
    });

    await expect(getClinicalCases()).rejects.toThrow("Acces non autorisé");
  });

  it("doit autoriser l'accès aux cas cliniques pour un Administrateur (ADMIN)", async () => {
    // Simuler un admin
    vi.spyOn(authLib, "auth").mockResolvedValue({
      user: { id: "u2", role: "ADMIN", name: "Admin Beta" },
      expires: "1"
    });

    const { db } = await import("@/lib/db");
    (db.clinicalCase.findMany as any).mockResolvedValue([
      { id: "c1", title: "Cas Test" }
    ]);

    const result = await getClinicalCases();
    expect(result).toHaveLength(1);
    expect(db.auditLog.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: "READ_ALL_CASES" })
    }));
  });

  it("doit refuser la génération d'URL signée pour un rôle non autorisé", async () => {
    vi.spyOn(authLib, "auth").mockResolvedValue({
      user: { id: "u1", role: "RESEARCHER" },
      expires: "1"
    });

    await expect(generateSecureDocumentUrl("c1", "file.pdf")).rejects.toThrow("Acces non autorisé");
  });

  it("doit générer une URL signée et logger l'action pour un SuperAdmin", async () => {
    vi.spyOn(authLib, "auth").mockResolvedValue({
      user: { id: "u3", role: "SUPERADMIN" },
      expires: "1"
    });

    const { db } = await import("@/lib/db");
    const { supabaseAdmin } = await import("@/lib/supabase");

    (db.clinicalCase.findUnique as any).mockResolvedValue({ title: "Affaire Sensible" });
    (supabaseAdmin.storage.from("").createSignedUrl as any).mockResolvedValue({
      data: { signedUrl: "https://secure.link" },
      error: null
    });

    const result = await generateSecureDocumentUrl("c1", "secret.pdf");
    expect(result.url).toBe("https://secure.link");
    expect(db.auditLog.create).toHaveBeenCalled();
  });
});
