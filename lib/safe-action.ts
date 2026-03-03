import * as Sentry from "@sentry/nextjs";

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
        // Only capture unexpected/internal errors to Sentry
        if (!(error instanceof Error) || !error.message.includes("NEXT_REDIRECT")) {
            Sentry.captureException(error, {
                tags: { action: actionName },
            });
            console.error(`[ACTION_ERROR - ${actionName}]:`, error);
        }

        // Never leak raw database errors or stack traces to the frontend
        return {
            success: false,
            error: customErrorMessage
        };
    }
}
