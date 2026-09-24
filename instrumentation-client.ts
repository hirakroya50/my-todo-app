import { installWalletExtensionGuard } from "@/lib/install-wallet-extension-guard";

try {
  installWalletExtensionGuard();
} catch (error) {
  console.warn("Wallet extension guard failed to initialize", error);
}
