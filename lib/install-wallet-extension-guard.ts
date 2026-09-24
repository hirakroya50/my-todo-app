/**
 * Builder is not a Web3 app. Wallet extensions inject scripts that throw on unrelated sites.
 * Loaded from instrumentation-client.ts before React hydration (no <script> in the tree).
 */

const EXTENSION_RE =
  /metamask|failed to connect to metamask|extension not found|chrome-extension:\/\/nkbihfbeogaeaoehlefnkodbefgpgknn|moz-extension:/i;

function isWalletNoise(value: unknown): boolean {
  try {
    return EXTENSION_RE.test(String(value));
  } catch {
    return false;
  }
}

function isWalletNoiseEvent(event: PromiseRejectionEvent | ErrorEvent): boolean {
  if (event instanceof PromiseRejectionEvent) {
    return (
      isWalletNoise(event.reason) ||
      EXTENSION_RE.test(
        event.reason instanceof Error ? event.reason.message : String(event.reason),
      )
    );
  }
  return (
    isWalletNoise(event.error) ||
    isWalletNoise(event.message) ||
    EXTENSION_RE.test(event.filename || "")
  );
}

function swallowEvent(event: Event): boolean {
  if (
    event instanceof PromiseRejectionEvent ||
    event instanceof ErrorEvent
  ) {
    if (isWalletNoiseEvent(event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
  }
  return false;
}

function filterConsoleArgs(args: IArguments | unknown[]): boolean {
  let combined = "";
  const list = args as unknown[];
  for (let i = 0; i < list.length; i++) {
    combined += String(list[i]) + " ";
  }
  return EXTENSION_RE.test(combined);
}

type EthereumLike = {
  isMetaMask?: boolean;
  request?: () => Promise<unknown>;
  connect?: () => Promise<unknown>;
  enable?: () => Promise<unknown[]>;
  on?: () => void;
  removeListener?: () => void;
  removeAllListeners?: () => void;
  providers?: EthereumLike[];
  __builderNeutralized?: boolean;
};

function patchProvider(provider: EthereumLike): EthereumLike {
  if (!provider || provider.__builderNeutralized) return provider;
  try {
    provider.request = () => Promise.resolve(null);
    provider.connect = () => Promise.resolve(null);
    provider.enable = () => Promise.resolve([]);
    provider.__builderNeutralized = true;
  } catch {
    /* ignore */
  }
  return provider;
}

function neutralizeEthereum(): void {
  try {
    const w = window as Window & { ethereum?: EthereumLike };
    if (w.ethereum) patchProvider(w.ethereum);
    const providers = w.ethereum?.providers;
    if (Array.isArray(providers)) {
      for (const p of providers) patchProvider(p);
    }
  } catch {
    /* ignore */
  }
}

let installed = false;

export function installWalletExtensionGuard(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("unhandledrejection", swallowEvent, true);
  window.addEventListener("error", swallowEvent, true);

  for (const level of ["error", "warn"] as const) {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      if (filterConsoleArgs(args)) return;
      original(...args);
    };
  }

  neutralizeEthereum();
  document.addEventListener("DOMContentLoaded", neutralizeEthereum);
  window.addEventListener("load", neutralizeEthereum);

  let ticks = 0;
  const interval = setInterval(() => {
    neutralizeEthereum();
    ticks += 1;
    if (ticks > 40) clearInterval(interval);
  }, 250);
}
