import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

// ✅ FORCER nodejs runtime (TRÈS IMPORTANT)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 });
    }

    // ✅ Rate Limiting
    const limit = await rateLimit(email);
    if (!limit.success) {
      return NextResponse.json(
        { message: "Trop de tentatives. Veuillez réessayer dans 15 minutes." },
        { status: 429 }
      );
    }

    // ✅ Vérifier que le secret JWT est défini
    const jwtSecret = process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      logger.error("❌ NEXTAUTH_SECRET non défini");
      return NextResponse.json(
        { message: "Erreur de configuration serveur" },
        { status: 500 }
      );
    }

    // ✅ Recherche en base uniquement
    const user = await db.user.findUnique({ 
      where: { email } 
    });
    
    if (!user) {
      logger.warn({ email }, "❌ Auth failure: Utilisateur non trouvé");
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      logger.warn({ email }, "❌ Auth failure: Mot de passe incorrect");
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    if (user.status !== "APPROVED") {
      logger.warn({ email, status: user.status }, "❌ Auth failure: Compte non approuvé");
      return NextResponse.json(
        { message: "Votre compte est en attente d'approbation ou a été désactivé." },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    logger.info({ email }, "✅ Token généré: Connexion admin réussie");
    
    // Reset rate limit on success
    resetRateLimit(email);

    return NextResponse.json({ 
      success: true,
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      }
    });

  } catch (error) {
    logger.error({ err: error }, "❌ Erreur serveur lors du login admin");
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}