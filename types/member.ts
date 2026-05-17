import { Member, MemberTranslation } from "@prisma/client";

export interface MemberWithTranslations extends Member {
  translations: MemberTranslation[];
}
