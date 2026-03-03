// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

// ✅ FORCER nodejs runtime (TRÈS IMPORTANT)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    console.log(`🔐 Tentative de connexion: ${email}`);

    // ✅ Vérifier que le secret JWT est défini
    const jwtSecret = process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      console.error("❌ NEXTAUTH_SECRET non défini");
      return NextResponse.json(
        { message: "Erreur de configuration serveur" },
        { status: 500 }
      );
    }

    // ✅ Admin par défaut (seed)
    const adminFromSeed = [
      { email: "admin@credda-ulpgl.org", password: "Admin123!", role: "ADMIN" },
      { email: "editor@credda-ulpgl.org", password: "Editor123!", role: "EDITOR" },
      { email: "researcher@credda-ulpgl.org", password: "Researcher123!", role: "RESEARCHER" },
      { email: "kulewakangitsirobert@gmail.com", password: "credda@2026", role: "ADMIN" }
    ].find(a => a.email === email && a.password === password);

    if (adminFromSeed) {
      const token = jwt.sign(
        { 
          id: email, 
          email: adminFromSeed.email, 
          role: adminFromSeed.role 
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      console.log(`✅ Token généré pour ${email} (seed)`);
      
      return NextResponse.json({ 
        success: true,
        token,
        user: { 
          id: email, 
          email, 
          role: adminFromSeed.role 
        }
      });
    }

    // ✅ Recherche en base
    const user = await db.user.findUnique({ 
      where: { email } 
    });
    
    if (!user) {
      console.log(`❌ Utilisateur non trouvé: ${email}`);
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(`❌ Mot de passe incorrect pour: ${email}`);
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    console.log(`✅ Token généré pour: ${email}`);
    
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
    console.error("❌ Erreur serveur:", error);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}