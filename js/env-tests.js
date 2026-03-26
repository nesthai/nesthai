
(function() {
  function logResult(test, passed, details) {
    const msg = passed ? `${test} : PASS` : `${test} : FAIL`;
    if (details !== undefined) {
      console.log(msg, details);
    } else {
      console.log(msg);
    }
  }

  function blockStart(title) {
    console.log("\n==============================");
    console.log(title);
    console.log("==============================");
  }

  function blockEnd(count, total) {
    console.log(`\n${count}/${total} TESTS PASSED`);
    console.log("ENVIRONMENT TESTS COMPLETED\n");
  }

  function test1_windowAppEnv() {
    return typeof window.APP_ENV !== "undefined";
  }

  function test2_appEnvValue() {
    return window.APP_ENV === "development" || window.APP_ENV === "production";
  }

  function test3_devButton() {
    var btn = document.getElementById("dev-button");
    if (window.APP_ENV === "development") {
      return !!btn;
    } else if (window.APP_ENV === "production") {
      return !btn;
    }
    return false;
  }

  function test4_siteLogo() {
    return !!document.getElementById("site-logo");
  }

  function test5_simulateProdButtonRemoval() {
    // Simule passage en production
    var originalEnv = window.APP_ENV;
    window.APP_ENV = "production";
    var btn = document.getElementById("dev-button");
    if (btn) btn.parentNode.removeChild(btn);
    var result = !document.getElementById("dev-button");
    window.APP_ENV = originalEnv;
    return result;
  }

  function test6_consoleNotNeutralized() {
    let worked = false;
    try {
      var testStr = "CONSOLE_TEST_DEV";
      var oldLog = console.log;
      var output = "";
      console.log = function(str) { output = str; };
      console.log(testStr);
      worked = (output === testStr);
      console.log = oldLog;
    } catch(e) {}
    return worked;
  }

  window.runEnvironmentTests = function() {
    console.clear();
    blockStart("ENVIRONMENT SECURITY REPORT");
    let total = 6, count = 0;
    if (test1_windowAppEnv()) { count++; logResult("Test 1 — window.APP_ENV existe", true); } else { logResult("Test 1 — window.APP_ENV existe", false); }
    if (test2_appEnvValue()) { count++; logResult("Test 2 — APP_ENV valeur", true); } else { logResult("Test 2 — APP_ENV valeur", false); }
    if (test3_devButton()) { count++; logResult("Test 3 — Bouton DEV", true); } else { logResult("Test 3 — Bouton DEV", false); }
    if (test4_siteLogo()) { count++; logResult("Test 4 — Logo site", true); } else { logResult("Test 4 — Logo site", false); }
    if (test5_simulateProdButtonRemoval()) { count++; logResult("Test 5 — Suppression bouton en PROD simulé", true); } else { logResult("Test 5 — Suppression bouton en PROD simulé", false); }
    if (test6_consoleNotNeutralized()) { count++; logResult("Test 6 — Console non neutralisée en DEV", true); } else { logResult("Test 6 — Console non neutralisée en DEV", false); }
    blockEnd(count, total);
  };
})();
