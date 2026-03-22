export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function withSafeAction<T>(
  actionName: string,
  action: () => Promise<T>,
  customErrorMessage: string = "Une erreur serveur est survenue."
): Promise<ActionResponse<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error: any) {
    if (!(error instanceof Error) || !error.message.includes("NEXT_REDIRECT")) {
      console.error(`[ACTION_ERROR - ${actionName}]:`, error);
    }

    return {
      success: false,
      error: customErrorMessage
    };
  }
}
