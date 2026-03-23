import { redirect } from "next/navigation";

/** Non-localized shortcut → default locale login (next-intl). */
export default function AdminLoginRedirectPage() {
  redirect("/fr/login");
}
