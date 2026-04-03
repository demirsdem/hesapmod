"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackEvent, type AnalyticsPayload } from "@/lib/analytics";

type TrackedLinkProps = LinkProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
        eventName?: string;
        analytics?: AnalyticsPayload;
    };

function stringifyHref(href: LinkProps["href"]) {
    if (typeof href === "string") {
        return href;
    }

    return href.pathname?.toString() ?? "";
}

export default function TrackedLink({
    eventName = "internal_link_click",
    analytics,
    href,
    onClick,
    ...props
}: TrackedLinkProps) {
    const hrefValue = stringifyHref(href);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        trackEvent(eventName, {
            link_href: hrefValue,
            ...analytics,
        });
    };

    return <Link href={href} onClick={handleClick} {...props} />;
}
