(function() {
  // Utilitaires pour accéder aux fonctions du module properties.js
  const sanitizeHTML = window.sanitizeHTML;
  const validateProperty = window.validateProperty;
  const loadProperties = window.loadProperties;

  function logResult(test, passed, details) {
    const msg = passed ? `TEST ${test} PASSED` : `TEST ${test} FAILED`;
    if (details) {
      console.log(msg, details);
    } else {
      console.log(msg);
    }
  }

  function test1_XSS() {
    const input = "<script>alert('XSS')</script>";
    const sanitized = sanitizeHTML(input);
    const expected = "&lt;script&gt;alert(&#39;XSS&#39;)&lt;&#47;script&gt;";
    const scriptExecuted = (() => {
      let executed = false;
      try {
        // Simule l'insertion dans innerHTML
        const div = document.createElement('div');
        div.innerHTML = sanitized;
        // Si le script s'exécute, il modifie executed
        window.alert = () => { executed = true; };
        document.body.appendChild(div);
        setTimeout(() => { div.remove(); }, 10);
      } catch(e) {}
      return executed;
    })();
    const pass = sanitized === expected && !scriptExecuted;
    logResult(1, pass, { sanitized });
  }

  function test2_Backtick() {
    const input = "`alert(1)`";
    const sanitized = sanitizeHTML(input);
    const expected = "&#96;alert(1)&#96;";
    const pass = sanitized === expected;
    logResult(2, pass, { sanitized });
  }

  function test3_ImageMalicieuse() {
    const prop = {
      id: "1",
      title: "Test",
      price: 100000,
      status: "for-sale",
      images: ["javascript:alert(1)"],
      location: "Test",
      description: "Test"
    };
    const pass = validateProperty(prop) === false;
    logResult(3, pass);
  }

  function test4_FeaturesCorrompu() {
    const prop = {
      id: "2",
      title: "Test",
      price: 100000,
      status: "for-sale",
      images: ["/img.jpg"],
      location: "Test",
      description: "Test",
      features: "garage"
    };
    const pass = validateProperty(prop) === false;
    logResult(4, pass);
  }

  function test5_LocalStorageCorrompu() {
    let errorCaught = false;
    try {
      localStorage.setItem("propty_properties_v1", "{broken json");
      loadProperties().then(() => {
        logResult(5, true);
      }).catch(() => {
        errorCaught = true;
        logResult(5, false);
      });
    } catch(e) {
      errorCaught = true;
      logResult(5, false);
    }
  }

  function test6_JSONNonArray() {
    // Mock fetch pour retourner un objet au lieu d’un array
    const originalFetch = window.fetch;
    window.fetch = function() {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ not: "an array" })
      });
    };
    loadProperties().then(result => {
      const pass = Array.isArray(result) && result.length === 0;
      logResult(6, pass, { result });
      window.fetch = originalFetch;
    }).catch(() => {
      logResult(6, false);
      window.fetch = originalFetch;
    });
  }

  window.runSecurityTests = function() {
    test1_XSS();
    test2_Backtick();
    test3_ImageMalicieuse();
    test4_FeaturesCorrompu();
    test5_LocalStorageCorrompu();
    test6_JSONNonArray();
    setTimeout(function() {
      console.log("ALL SECURITY TESTS COMPLETED");
    }, 500);
  };
})();
