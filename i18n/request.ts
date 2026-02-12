import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    return {
      locale: "fr", // fallback
      messages: (await import("../messages/fr.json")).default
    };
  }

  let messages;

  switch (locale) {
    case "en":
      messages = (await import("../messages/en.json")).default;
      break;
    case "sw":
      messages = (await import("../messages/sw.json")).default;
      break;
    default:
      messages = (await import("../messages/fr.json")).default;
      break;
  }

  return {
    locale, // ✅ OBLIGATOIRE
    messages
  };
});
