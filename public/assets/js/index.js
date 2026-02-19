
    // Default transport: epoxy. If an older build saved "libcurl" (currently flaky),
    // migrate once to epoxy but still allow users to switch back manually.
    try {
      const MIGRATION_KEY = "transport_default_migrated_v2";
      const migrated = localStorage.getItem(MIGRATION_KEY) === "1";
      const t = localStorage.getItem("transport");
      if (!t) {
        localStorage.setItem("transport", "epoxy");
      } else if (!migrated && t === "libcurl") {
        localStorage.setItem("transport", "epoxy");
        localStorage.setItem(MIGRATION_KEY, "1");
      }
    } catch {}

    if (!localStorage.getItem("searchEngine")) {
    localStorage.setItem("searchEngine", "duckduckgo");
    }

    // About:Blank cloaking is OFF by default (see /assets/js/cloaking.js).
    if (localStorage.getItem("ab") === null) {
      localStorage.setItem("ab", "false");
    }

    if (input) {
        let placeholderText = "Search the Web Freely..."; 
        function overwritePlaceholder() {
            input.placeholder = placeholderText;
            requestAnimationFrame(overwritePlaceholder);
        }
        requestAnimationFrame(overwritePlaceholder);
    } else {
        console.error("Element with ID 'input' not found.");
    }

