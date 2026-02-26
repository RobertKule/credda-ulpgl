import React from "react";

export type FormattedHTMLProps = {
    html: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
    className?: string;
};

/**
 * Safely renders raw HTML string or a translated string with HTML formatting.
 * Use this component when translations contain simple HTML like <span>, <strong>, etc.
 * 
 * @example
 * <FormattedHTML html={t.raw("Gallery.title")} as="h1" className="text-4xl" />
 */
export function FormattedHTML({
    html,
    as: Component = "span",
    className,
}: FormattedHTMLProps) {
    if (!html) return null;

    return (
        <Component
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
