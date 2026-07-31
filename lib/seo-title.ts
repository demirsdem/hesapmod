import { SITE_NAME } from "./site";

const SITE_NAME_SUFFIX = new RegExp(`\\s*\\|\\s*${SITE_NAME}\\s*$`, "i");

export function withSingleSiteName(title: string) {
    const cleanTitle = title.replace(SITE_NAME_SUFFIX, "").trim();
    return `${cleanTitle} | ${SITE_NAME}`;
}
