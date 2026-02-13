import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 401 });
  }

  // TODO: remplacer par un vrai JWT/session
  return NextResponse.json({ message: "Connexion réussie" });
}
