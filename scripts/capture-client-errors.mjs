import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { WebSocket } from "undici";

const DEFAULT_BROWSER_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.error("Usage: node scripts/capture-client-errors.mjs <url> [url...]");
  process.exit(1);
}

const browserPath = DEFAULT_BROWSER_PATHS.find((path) => existsSync(path));

if (!browserPath) {
  console.error("Chrome or Edge executable was not found.");
  process.exit(1);
}

const debugPort = 9223 + Math.floor(Math.random() * 500);
const userDataDir = join(tmpdir(), `hesapmod-cdp-${Date.now()}`);
await mkdir(userDataDir, { recursive: true });

const browser = spawn(
  browserPath,
  [
    "--headless=new",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-gpu",
    "--disable-popup-blocking",
    "--disable-sync",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ],
  { stdio: ["ignore", "pipe", "pipe"] },
);

const browserOutput = [];
browser.stderr.on("data", (chunk) => browserOutput.push(chunk.toString()));
browser.stdout.on("data", (chunk) => browserOutput.push(chunk.toString()));

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForBrowser() {
  const endpoint = `http://127.0.0.1:${debugPort}/json/version`;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        return response.json();
      }
    } catch {
      await delay(100);
    }
  }

  throw new Error(`Browser CDP endpoint did not become ready on port ${debugPort}.`);
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  const listeners = new Map();

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);

    if (payload.id && pending.has(payload.id)) {
      const { resolve, reject } = pending.get(payload.id);
      pending.delete(payload.id);
      if (payload.error) {
        reject(new Error(`${payload.error.message}: ${payload.error.data ?? ""}`));
      } else {
        resolve(payload.result ?? {});
      }
      return;
    }

    if (payload.method && listeners.has(payload.method)) {
      for (const listener of listeners.get(payload.method)) {
        listener(payload.params ?? {});
      }
    }
  });

  const opened = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  return {
    async send(method, params = {}) {
      await opened;
      const id = nextId;
      nextId += 1;
      const response = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
      socket.send(JSON.stringify({ id, method, params }));
      return response;
    },
    on(method, listener) {
      if (!listeners.has(method)) {
        listeners.set(method, new Set());
      }
      listeners.get(method).add(listener);
    },
    async close() {
      await opened;
      socket.close();
    },
  };
}

function serializeRemoteObject(remoteObject) {
  if (!remoteObject) return "";
  if ("value" in remoteObject) return String(remoteObject.value);
  if (remoteObject.description) return remoteObject.description;
  if (remoteObject.unserializableValue) return String(remoteObject.unserializableValue);
  return JSON.stringify(remoteObject);
}

async function createPageTarget(url) {
  const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error(`Failed to create browser tab for ${url}: ${response.status}`);
  }

  return response.json();
}

async function captureUrl(url) {
  const target = await createPageTarget("about:blank");
  const cdp = createCdpClient(target.webSocketDebuggerUrl);
  const consoleEntries = [];
  const pageErrors = [];
  const networkFailures = [];

  cdp.on("Runtime.consoleAPICalled", (event) => {
    const message = event.args?.map(serializeRemoteObject).join(" ") ?? "";
    consoleEntries.push({
      type: event.type,
      message,
      stack: event.stackTrace,
    });
  });

  cdp.on("Runtime.exceptionThrown", (event) => {
    pageErrors.push({
      text: event.exceptionDetails?.text,
      description: event.exceptionDetails?.exception?.description,
      url: event.exceptionDetails?.url,
      lineNumber: event.exceptionDetails?.lineNumber,
      columnNumber: event.exceptionDetails?.columnNumber,
      stack: event.exceptionDetails?.stackTrace,
    });
  });

  cdp.on("Log.entryAdded", (event) => {
    consoleEntries.push({
      type: event.entry?.level,
      message: event.entry?.text,
      source: event.entry?.source,
      url: event.entry?.url,
      lineNumber: event.entry?.lineNumber,
    });
  });

  cdp.on("Network.loadingFailed", (event) => {
    networkFailures.push({
      requestId: event.requestId,
      type: event.type,
      errorText: event.errorText,
      blockedReason: event.blockedReason,
      canceled: event.canceled,
    });
  });

  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");
  await cdp.send("Network.enable");
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.addEventListener("error", function(event) {
        console.error("[window.error]", event.message, event.filename, event.lineno, event.colno, event.error && event.error.stack);
      });
      window.addEventListener("unhandledrejection", function(event) {
        var reason = event.reason;
        console.error("[window.unhandledrejection]", reason && reason.stack ? reason.stack : String(reason));
      });
    `,
  });

  await cdp.send("Page.navigate", { url });
  await delay(5000);

  const bodyText = await cdp.send("Runtime.evaluate", {
    expression: "document.body ? document.body.innerText.slice(0, 1000) : ''",
    returnByValue: true,
  });
  const title = await cdp.send("Runtime.evaluate", {
    expression: "document.title",
    returnByValue: true,
  });
  const location = await cdp.send("Runtime.evaluate", {
    expression: "location.href",
    returnByValue: true,
  });
  const interactionChecks = await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      (async function() {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const buttons = Array.from(document.querySelectorAll("button"));
        const getButtonText = (button) => [
          button.getAttribute("aria-label") || "",
          button.getAttribute("title") || "",
          button.textContent || ""
        ].join(" ").trim();

        const searchButton = buttons.find((button) => /arama yap|search calculators|cmd\\+k/i.test(getButtonText(button)));
        let searchOpened = false;
        let searchInputFocused = false;

        if (searchButton) {
          searchButton.click();
          await delay(300);
          const searchInput = document.querySelector('input[aria-label="Arama Sorgusu"], input[aria-label="Search query"]');
          searchOpened = Boolean(searchInput);
          searchInputFocused = document.activeElement === searchInput;
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
          await delay(150);
        }

        const moreButton = Array.from(document.querySelectorAll('button[aria-haspopup="menu"]'))
          .find((button) => /diğer|more/i.test(getButtonText(button)) || button.getAttribute("aria-expanded") !== null);
        let dropdownOpened = false;

        if (moreButton) {
          const moreHost = moreButton.closest("div.relative") || moreButton.parentElement || moreButton;
          moreHost.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true }));
          moreHost.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false, cancelable: true }));
          moreButton.focus();
          moreButton.dispatchEvent(new FocusEvent("focus", { bubbles: true, cancelable: true }));
          await delay(500);
          const menus = Array.from(document.querySelectorAll('[role="menu"]'));
          dropdownOpened = menus.some((menu) => {
            const style = window.getComputedStyle(menu);
            const rect = menu.getBoundingClientRect();
            return style.visibility !== "hidden" && style.opacity !== "0" && rect.width > 0 && rect.height > 0;
          }) || moreButton.getAttribute("aria-expanded") === "true";
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        }

        return {
          searchButtonFound: Boolean(searchButton),
          searchOpened,
          searchInputFocused,
          dropdownButtonFound: Boolean(moreButton),
          dropdownOpened,
        };
      })()
    `,
  });

  await cdp.close();

  return {
    url,
    finalUrl: location.result?.value ?? url,
    title: title.result?.value ?? "",
    hasApplicationError: String(bodyText.result?.value ?? "").includes("Application error"),
    bodyExcerpt: bodyText.result?.value ?? "",
    interactionChecks: interactionChecks.result?.value ?? null,
    consoleEntries,
    pageErrors,
    networkFailures,
  };
}

try {
  await waitForBrowser();
  const results = [];

  for (const url of urls) {
    results.push(await captureUrl(url));
  }

  console.log(JSON.stringify({ browserPath, results }, null, 2));
} finally {
  browser.kill();
  await Promise.race([
    new Promise((resolve) => browser.once("exit", resolve)),
    delay(3000),
  ]);
  try {
    await rm(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
  } catch {
    // Chrome can keep profile lock files alive briefly after exit; they are in the OS temp dir.
  }
}
