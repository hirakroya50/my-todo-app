/**
 * dev_todo is not a Web3 app. Wallet extensions inject scripts that throw on unrelated sites.
 */
(function () {
  "use strict";

  var EXTENSION_RE =
    /metamask|failed to connect to metamask|extension not found|chrome-extension:\/\/nkbihfbeogaeaoehlefnkodbefgpgknn|moz-extension:/i;

  function isWalletNoise(value) {
    try {
      return EXTENSION_RE.test(String(value));
    } catch (e) {
      return false;
    }
  }

  function isWalletNoiseEvent(event) {
    return (
      isWalletNoise(event.reason) ||
      isWalletNoise(event.error) ||
      isWalletNoise(event.message) ||
      EXTENSION_RE.test(event.filename || "")
    );
  }

  function swallowEvent(event) {
    if (isWalletNoiseEvent(event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return true;
    }
    return false;
  }

  window.addEventListener("unhandledrejection", swallowEvent, true);
  window.addEventListener("error", swallowEvent, true);

  function filterConsoleArgs(args) {
    var combined = "";
    for (var i = 0; i < args.length; i++) {
      combined += String(args[i]) + " ";
    }
    return EXTENSION_RE.test(combined);
  }

  ["error", "warn"].forEach(function (level) {
    var original = console[level];
    if (typeof original !== "function") return;
    console[level] = function () {
      if (filterConsoleArgs(arguments)) return;
      original.apply(console, arguments);
    };
  });

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
    if (!provider || provider.__devTodoNeutralized) return provider;
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
      if (window.ethereum) patchProvider(window.ethereum);
      var providers = window.ethereum && window.ethereum.providers;
      if (Array.isArray(providers)) {
        for (var i = 0; i < providers.length; i++) patchProvider(providers[i]);
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
    if (ticks > 40) clearInterval(interval);
  }, 250);
})();
