import { SITE_URL } from "./site";
import type { CalculatorFaqEntry, CalculatorSearchEntry, LocalizedText } from "./calculator-types";

export type EnglishCalculatorRoute = {
    category: "health-calculator" | "time-calculator" | "math-calculator";
    slug: "bmi-calculator" | "age-calculator" | "percentage-calculator";
    categoryLabel: string;
    sourceCategory: "yasam-hesaplama" | "zaman-hesaplama" | "matematik-hesaplama";
    sourceSlug: "vucut-kitle-indeksi-hesaplama" | "yas-hesaplama" | "yuzde-hesaplama";
    name: string;
    h1: string;
    shortDescription: string;
    seo: {
        title: string;
        description: string;
        content: string;
        faq: Array<{
            q: string;
            a: string;
        }>;
    };
    relatedRoutes: Array<{
        category: EnglishCalculatorRoute["category"];
        slug: EnglishCalculatorRoute["slug"];
    }>;
};

const ENGLISH_CATEGORY_SOURCE_MAP = {
    "health-calculator": "yasam-hesaplama",
    "time-calculator": "zaman-hesaplama",
    "math-calculator": "matematik-hesaplama",
} as const;

const englishCalculatorRouteEntries: EnglishCalculatorRoute[] = [
    {
        category: "health-calculator",
        slug: "bmi-calculator",
        categoryLabel: "Health Calculator",
        sourceCategory: "yasam-hesaplama",
        sourceSlug: "vucut-kitle-indeksi-hesaplama",
        name: "BMI Calculator",
        h1: "BMI Calculator - Check Your Body Mass Index and Weight Category",
        shortDescription:
            "Enter height and weight to calculate BMI, review the WHO weight category, and understand how to interpret the result in context.",
        seo: {
            title: "BMI Calculator 2026 - Check Body Mass Index and Healthy Weight Range | HesapMod",
            description:
                "Free BMI calculator for adults. Enter height and weight to calculate Body Mass Index, review WHO weight classes, and understand what the result can and cannot tell you.",
            content: `<h2>What the BMI Calculator Measures</h2><p>Body Mass Index, usually shortened to BMI, is a screening formula that compares weight with height. The calculation divides body weight in kilograms by height in meters squared, then places the result into a practical weight category such as underweight, normal weight, overweight, or obesity. Because the method is fast and easy to standardize, BMI remains one of the most widely used first-step screening tools in public health, workplace wellness programs, and primary care settings.</p><p>This does not mean BMI is a diagnosis. A BMI result is best understood as a structured starting point. It helps users estimate whether their current weight may deserve a closer look, but it does not directly measure body fat percentage, fitness level, muscle mass, hydration, or metabolic health. A muscular person can have a high BMI without carrying excess body fat, while another person can have a BMI inside the normal range and still face health risks due to low muscle mass or central fat distribution.</p><h2>How to Interpret BMI Responsibly</h2><p>In adults, the World Health Organization reference bands are commonly used as a planning framework. A BMI below 18.5 is generally interpreted as underweight, 18.5 to 24.9 as normal weight, 25 to 29.9 as overweight, and 30 or above as obesity classes. These thresholds are useful because they create a shared language for early risk screening. Even so, they should be read together with waist circumference, medical history, blood pressure, lifestyle habits, and professional judgment when health decisions matter.</p><p>Age, sex, pregnancy, athletic background, and body composition can all change how meaningful the number is. That is why this page is designed as an educational calculator rather than a medical verdict. If your result feels unexpectedly high or low, the next reasonable step is to review the number alongside diet quality, activity pattern, sleep, and a broader clinical picture instead of reacting to the BMI value alone.</p><h2>The Formula Behind the Result</h2><h3>BMI Formula</h3><p><strong>BMI = weight (kg) / height (m)^2</strong></p><p>For example, a person who weighs 70 kg and is 1.75 m tall has a BMI of 22.9. That sits inside the standard adult normal-weight range. The math itself is simple, but the interpretation is where context matters. BMI works best as a repeatable population-level and self-screening reference, not as a substitute for individualized care.</p><h3>When BMI Is Most Useful</h3><p>BMI is especially practical when you want a quick checkpoint before setting nutrition, weight management, or exercise goals. It can also be used to track whether broad weight changes are moving in the expected direction over time. For a fuller picture, it is best to combine BMI with other tools, lifestyle review, and professional assessment when necessary.</p>`,
            faq: [
                {
                    q: "What is a normal BMI?",
                    a: "For adults, a BMI from 18.5 to 24.9 is generally considered the standard normal-weight range under WHO thresholds.",
                },
                {
                    q: "Can BMI be wrong for athletes or muscular people?",
                    a: "Yes. BMI does not distinguish fat from muscle, so athletic or highly muscular individuals can appear overweight even when body-fat level is healthy.",
                },
                {
                    q: "Should BMI be used as a diagnosis?",
                    a: "No. BMI is a screening indicator, not a diagnosis. It should be interpreted with body composition, waist size, symptoms, and medical history.",
                },
            ],
        },
        relatedRoutes: [
            { category: "time-calculator", slug: "age-calculator" },
            { category: "math-calculator", slug: "percentage-calculator" },
        ],
    },
    {
        category: "time-calculator",
        slug: "age-calculator",
        categoryLabel: "Time Calculator",
        sourceCategory: "zaman-hesaplama",
        sourceSlug: "yas-hesaplama",
        name: "Age Calculator",
        h1: "Age Calculator - Calculate Exact Age in Years, Months, and Days",
        shortDescription:
            "Calculate current age from a birth date and understand the exact difference in years, months, and days.",
        seo: {
            title: "Age Calculator 2026 - Calculate Exact Age by Birth Date | HesapMod",
            description:
                "Free age calculator that measures exact age in years, months, and days from a birth date. Useful for personal planning, records, and date-based checks.",
            content: `<h2>Why an Age Calculator Is More Than a Birthday Counter</h2><p>An age calculator compares a birth date with a target date, usually today, and expresses the difference as a structured time span. The result is often shown in completed years, then refined into months and days. That sounds simple, but exact age is not just a matter of subtracting one year from another. Real calendar math must respect leap years, different month lengths, and whether the birthday has already passed in the current year.</p><p>This is why a good age calculator is useful for more than curiosity. People commonly use it when checking school eligibility windows, insurance thresholds, retirement planning, job applications, sports age bands, or medical forms that ask for an exact age on a given date. In each of those cases, the difference between an approximate age and an exact calendar age can matter.</p><h2>How Exact Age Is Calculated</h2><p>The core logic is calendar-based rather than purely arithmetic. First, the tool determines how many full years have passed between the birth date and the target date. Then it evaluates the remaining calendar difference in months and days. This prevents common mistakes such as treating every year as 365 days or every month as a fixed 30-day block. February, leap-day birthdays, and month-end edge cases are all part of the correct calculation process.</p><p>For example, someone born on June 15, 1990 is not simply today's year minus 1990. The calculator must check whether June 15 has already occurred this year. If it has not, one full year has not yet been completed. The same logic applies again when turning the remainder into months and days. That is what makes an exact age result more reliable than a quick mental estimate.</p><h2>Where Age Calculation Becomes Important</h2><h3>Administrative and Legal Use</h3><p>Age thresholds are often defined by completed age, not approximate age. Admission periods, benefit eligibility, and age-limited registrations can all depend on a precise reading of the calendar. In these situations, even a one-day difference can change the outcome.</p><h3>Medical and Personal Planning</h3><p>Age also plays a role in health interpretation, energy needs, and milestone planning. Pediatric growth assessments, adult screening recommendations, and some nutrition formulas all rely on age as an input. While this page does not replace professional review, it gives a reliable time reference that can be reused across many planning tasks.</p><h2>Understanding the Result</h2><p>An exact age result should be read as a practical calendar difference between two dates. It is most helpful when accuracy matters and when you want a result that reflects real-world month and day boundaries rather than a rough estimate. That makes the calculator useful for both everyday planning and more formal record-keeping.</p>`,
            faq: [
                {
                    q: "Does the age calculator account for leap years?",
                    a: "Yes. A correct age calculation respects leap years, including February 29 and the changing length of calendar years.",
                },
                {
                    q: "Why does exact age differ from a rough year subtraction?",
                    a: "Because exact age depends on whether the birthday has already occurred in the target year and on the real number of months and days that have passed.",
                },
                {
                    q: "Can I calculate age for a future or past date?",
                    a: "Yes. The same logic can be used against another target date when you need age at a future milestone or a past event.",
                },
            ],
        },
        relatedRoutes: [
            { category: "health-calculator", slug: "bmi-calculator" },
            { category: "math-calculator", slug: "percentage-calculator" },
        ],
    },
    {
        category: "math-calculator",
        slug: "percentage-calculator",
        categoryLabel: "Math Calculator",
        sourceCategory: "matematik-hesaplama",
        sourceSlug: "yuzde-hesaplama",
        name: "Percentage Calculator",
        h1: "Percentage Calculator - Find Percentage, Increase, Decrease, and Ratio",
        shortDescription:
            "Calculate percentage values, percentage increase, percentage decrease, and one-number-as-a-percent-of-another scenarios.",
        seo: {
            title: "Percentage Calculator 2026 - Percentage, Increase, Decrease, and Ratio | HesapMod",
            description:
                "Free percentage calculator for common percentage problems. Work out a percentage of a number, percent change, discount math, and ratio percentages in one place.",
            content: `<h2>What a Percentage Calculator Helps You Solve</h2><p>Percentages appear everywhere: discounts, salary changes, tax calculations, exam scores, conversion rates, inflation, and business margins. A percentage calculator is useful because it removes the most common errors from these repetitive calculations. Instead of switching formulas mentally each time, you can choose the problem type and let the tool handle the math consistently.</p><p>Most real-world percentage questions fall into a small set of patterns. You may want to know what percentage of a number equals a certain result, how much a value increased or decreased, what the discounted price becomes after a percentage cut, or how one value compares with another as a percentage. Although these tasks look different at first glance, they all rely on the same underlying ratio logic.</p><h2>The Core Percentage Formulas</h2><h3>Percentage of a Number</h3><p><strong>Result = Base Number x (Percentage / 100)</strong></p><p>If you want 20% of 250, the result is 250 x 0.20 = 50.</p><h3>Percentage Increase</h3><p><strong>Increase % = ((New - Old) / Old) x 100</strong></p><p>If a value rises from 1,000 to 1,200, the increase is 20%.</p><h3>Percentage Decrease</h3><p><strong>Decrease % = ((Old - New) / Old) x 100</strong></p><p>If a price falls from 500 to 400, the decrease is 20%.</p><h3>One Number as a Percentage of Another</h3><p><strong>Ratio % = (Part / Whole) x 100</strong></p><p>If 30 is compared with 150, then 30 / 150 x 100 = 20%.</p><h2>Where Users Usually Make Mistakes</h2><p>The most common error is using the wrong base value. A 20% increase followed by a 20% decrease does not bring a number back to the starting point because the second percentage is applied to a different base. Another frequent mistake is confusing margin, markup, and discount percentages in pricing problems. The safest approach is to identify the original reference number first, then apply the correct formula.</p><p>This is also why percentage calculators are practical in shopping, personal finance, and business planning. When a product is discounted, when salary changes are announced, or when a performance metric moves month over month, the result only makes sense if the correct base is clear. A structured calculator helps keep that base visible and consistent.</p><h2>Using the Result Correctly</h2><p>A percentage result is easiest to trust when you can explain what the base number represents. Once that is clear, the tool becomes a quick and reliable way to solve daily math questions without re-deriving formulas each time. It is simple math, but getting the context right is what turns the result into something useful.</p>`,
            faq: [
                {
                    q: "How do I find 15% of a number?",
                    a: "Multiply the number by 0.15. For example, 15% of 200 is 30.",
                },
                {
                    q: "What is the formula for percentage increase?",
                    a: "Subtract the old value from the new value, divide the difference by the old value, and multiply by 100.",
                },
                {
                    q: "Why does a discount and a later increase not cancel out?",
                    a: "Because the two percentages are applied to different base values. Once the base changes, the reverse percentage does not mirror the first one exactly.",
                },
            ],
        },
        relatedRoutes: [
            { category: "health-calculator", slug: "bmi-calculator" },
            { category: "time-calculator", slug: "age-calculator" },
        ],
    },
];

function buildLocalizedText(en: string, trFallback?: string): LocalizedText {
    return {
        tr: trFallback ?? en,
        en,
    };
}

function buildRouteKey(category: string, slug: string) {
    return `${category}::${slug}`;
}

function buildSourceKey(category: string, slug: string) {
    return `${category}::${slug}`;
}

const englishCalculatorRouteMap = new Map(
    englishCalculatorRouteEntries.map((route) => [
        buildRouteKey(route.category, route.slug),
        route,
    ])
);

const englishRouteBySourceMap = new Map(
    englishCalculatorRouteEntries.map((route) => [
        buildSourceKey(route.sourceCategory, route.sourceSlug),
        route,
    ])
);

export const englishCalculatorRoutes = englishCalculatorRouteEntries;

export const englishCalculatorSearchIndex: CalculatorSearchEntry[] = englishCalculatorRouteEntries.map((route) => ({
    id: `en-${route.slug}`,
    slug: route.slug,
    category: route.category,
    name: buildLocalizedText(route.name),
    shortDescription: buildLocalizedText(route.shortDescription),
}));

export const englishNavigationLinks = [
    { href: "/en", label: "Home" },
    ...englishCalculatorRouteEntries.map((route) => ({
        href: `/en/${route.category}/${route.slug}`,
        label: route.name,
    })),
];

export function findEnglishCalculatorRoute(category: string, slug: string) {
    return englishCalculatorRouteMap.get(buildRouteKey(category, slug));
}

export function findEnglishCalculatorRouteBySource(sourceCategory: string, sourceSlug: string) {
    return englishRouteBySourceMap.get(buildSourceKey(sourceCategory, sourceSlug));
}

export function getEnglishCalculatorPath(route: Pick<EnglishCalculatorRoute, "category" | "slug">) {
    return `/en/${route.category}/${route.slug}`;
}

export function getEnglishHomeAlternates() {
    return {
        canonical: "/en",
        languages: {
            "tr-TR": `${SITE_URL}/`,
            "en-US": `${SITE_URL}/en`,
            en: `${SITE_URL}/en`,
            "x-default": `${SITE_URL}/`,
        },
    };
}

export function getEnglishCategoryAlternates(category: EnglishCalculatorRoute["category"]) {
    const sourceCategory = ENGLISH_CATEGORY_SOURCE_MAP[category];
    const englishPath = `/en/${category}`;

    return {
        canonical: englishPath,
        languages: {
            "tr-TR": `${SITE_URL}/${sourceCategory}`,
            "en-US": `${SITE_URL}${englishPath}`,
            en: `${SITE_URL}${englishPath}`,
            "x-default": `${SITE_URL}/${sourceCategory}`,
        },
    };
}

export function getSourceCalculatorPath(route: Pick<EnglishCalculatorRoute, "sourceCategory" | "sourceSlug">) {
    return `/${route.sourceCategory}/${route.sourceSlug}`;
}

export function getEnglishCategoryLabel(category: string) {
    return englishCalculatorRouteEntries.find((route) => route.category === category)?.categoryLabel
        ?? category.replace(/-/g, " ");
}

export function getEnglishCalculatorAlternates(route: EnglishCalculatorRoute) {
    const turkishPath = getSourceCalculatorPath(route);
    const englishPath = getEnglishCalculatorPath(route);

    return {
        canonical: englishPath,
        languages: {
            "tr-TR": `${SITE_URL}${turkishPath}`,
            "en-US": `${SITE_URL}${englishPath}`,
            en: `${SITE_URL}${englishPath}`,
            "x-default": `${SITE_URL}${turkishPath}`,
        },
    };
}

export function getSourceCalculatorAlternates(sourceCategory: string, sourceSlug: string) {
    const route = findEnglishCalculatorRouteBySource(sourceCategory, sourceSlug);

    if (!route) {
        return null;
    }

    return {
        canonical: `/${sourceCategory}/${sourceSlug}`,
        languages: {
            "tr-TR": `${SITE_URL}/${sourceCategory}/${sourceSlug}`,
            "en-US": `${SITE_URL}${getEnglishCalculatorPath(route)}`,
            en: `${SITE_URL}${getEnglishCalculatorPath(route)}`,
            "x-default": `${SITE_URL}/${sourceCategory}/${sourceSlug}`,
        },
    };
}

export function getEnglishRouteFaqEntries(route: EnglishCalculatorRoute): CalculatorFaqEntry[] {
    return route.seo.faq.map((item) => ({
        q: buildLocalizedText(item.q),
        a: buildLocalizedText(item.a),
    }));
}
