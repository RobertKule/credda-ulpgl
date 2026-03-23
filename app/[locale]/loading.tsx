import { getTranslations } from "next-intl/server";
import PageLoadingSpinner from "@/components/shared/PageLoadingSpinner";

export default async function Loading() {
  const t = await getTranslations("loading");
  return <PageLoadingSpinner label={t("label")} />;
}
