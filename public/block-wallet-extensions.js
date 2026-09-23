/**
 * dev_todo is not a Web3 app. Wallet extensions (MetaMask, etc.) inject scripts that
 * can throw on unrelated sites. This runs before React and neutralizes that noise.
 */
(function () {
  "use strict";

  var EXTENSION_RE =
    /metamask|chrome-extension:\/\/nkbihfbeogaeaoehlefnkodbefgpgknn|moz-extension:/i;

  function isWalletNoise(reason) {
    try {
      var s = String(
        reason && (reason.stack || reason.message || reason),
      );
      return EXTENSION_RE.test(s);
    } catch (e) {
      return false;
    }
  }

  function swallowEvent(event) {
    if (
      isWalletNoise(event.reason || event.error) ||
      EXTENSION_RE.test(event.filename || "")
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
    return false;
  }

  window.addEventListener("unhandledrejection", swallowEvent, true);
  window.addEventListener("error", swallowEvent, true);

  var noopProvider = {
    isMetaMask: false,
    request: function () {
      return Promise.resolve(null);
    },
    connect: function () {
      return Promise.resolve(null);
    },
    enable: function () {
      return Promise.resolve([]);
    },
    on: function () {},
    removeListener: function () {},
    removeAllListeners: function () {},
  };

  function patchProvider(provider) {
    if (!provider || provider.__devTodoNeutralized) {
      return provider;
    }
    try {
      provider.request = function () {
        return Promise.resolve(null);
      };
      provider.connect = function () {
        return Promise.resolve(null);
      };
      provider.enable = function () {
        return Promise.resolve([]);
      };
      provider.__devTodoNeutralized = true;
    } catch (e) {
      /* ignore */
    }
    return provider;
  }

  function neutralizeEthereum() {
    try {
      if (window.ethereum) {
        patchProvider(window.ethereum);
      }
    } catch (e) {
      /* ignore */
    }

    try {
      var providers = window.ethereum && window.ethereum.providers;
      if (Array.isArray(providers)) {
        for (var i = 0; i < providers.length; i++) {
          patchProvider(providers[i]);
        }
      }
    } catch (e) {
      /* ignore */
    }
  }

  neutralizeEthereum();
  document.addEventListener("DOMContentLoaded", neutralizeEthereum);
  window.addEventListener("load", neutralizeEthereum);

  var ticks = 0;
  var interval = setInterval(function () {
    neutralizeEthereum();
    ticks += 1;
    if (ticks > 40) {
      clearInterval(interval);
    }
  }, 250);
})();
