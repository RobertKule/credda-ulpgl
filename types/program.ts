import { Program, ProgramTranslation } from "@prisma/client";

export interface ProgramWithTranslations extends Program {
  translations: ProgramTranslation[];
}
