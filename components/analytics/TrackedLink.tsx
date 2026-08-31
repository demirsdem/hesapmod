"use client";

import Link, { type LinkProps } from "next/link";
import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { trackEvent, type AnalyticsPayload } from "@/lib/analytics";
import { trackCorporateEvent, type CorporateEventParams } from "@/lib/corporate-analytics";

type TrackedLinkProps = LinkProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
        eventName?: string;
        analytics?: AnalyticsPayload;
        corporateAnalytics?: CorporateEventParams;
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
    corporateAnalytics,
    href,
    onClick,
    ...props
}: TrackedLinkProps) {
    const hrefValue = stringifyHref(href);
    const isCorporateContactHref = hrefValue.startsWith("/iletisim?konu=kurumsal-yazilim");
    const isCorporateCta = Boolean(corporateAnalytics) || eventName === "solution_cta_click" || isCorporateContactHref;
    const [trackedHref, setTrackedHref] = useState<LinkProps["href"]>(href);

    useEffect(() => {
        if (!isCorporateCta || !hrefValue.startsWith("/iletisim")) {
            setTrackedHref(href);
            return;
        }

        const destination = new URL(hrefValue, window.location.origin);
        const currentSearch = new URLSearchParams(window.location.search);
        destination.searchParams.set("kaynak", window.location.pathname);
        for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
            const value = currentSearch.get(key);
            if (value) destination.searchParams.set(key, value);
        }
        setTrackedHref(`${destination.pathname}${destination.search}`);
    }, [href, hrefValue, isCorporateCta]);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        if (corporateAnalytics) {
            trackCorporateEvent("corporate_cta_click", {
                ...corporateAnalytics,
                source_path: window.location.pathname,
            });
        } else if (eventName === "solution_cta_click") {
            trackCorporateEvent("corporate_cta_click", {
                form_type: "corporate",
                solution_slug: typeof analytics?.solution === "string" ? analytics.solution : "",
                source_path: window.location.pathname,
                cta_location: analytics?.source === "bottom" ? "bottom" : "hero",
            });
        } else if (isCorporateContactHref) {
            trackCorporateEvent("corporate_cta_click", {
                form_type: "corporate",
                source_path: window.location.pathname,
                cta_location: "hero",
            });
        } else {
            trackEvent(eventName, {
                link_href: hrefValue,
                ...analytics,
            });
        }
    };

    return <Link href={trackedHref} onClick={handleClick} {...props} />;
}
