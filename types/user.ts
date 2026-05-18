// types/user.ts
import { User, Role, AccountStatus } from "@prisma/client";

export type SafeUser = Omit<User, "password">;

export { Role, AccountStatus };
