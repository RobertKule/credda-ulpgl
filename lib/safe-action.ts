import { ApiResponse } from "@/types/api";

export async function withSafeAction<T>(
  actionName: string,
  action: () => Promise<T>,
  customErrorMessage: string = "Une erreur serveur est survenue."
): Promise<ApiResponse<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    // Handling Next.js redirect errors which are not actual errors to log
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error(`[ACTION_ERROR - ${actionName}]:`, error);

    return {
      success: false,
      error: customErrorMessage
    };
  }
}
