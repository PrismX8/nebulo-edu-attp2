# Mobile proxy layout repair

The default about:blank cloaking wrapper had no viewport meta tag. Its nested proxy shell therefore inherited a desktop-sized layout on phones. The wrapper now uses `width=device-width, initial-scale=1, viewport-fit=cover`, fills dynamic viewport height, and keeps pinch zoom available. This fixes the outer dimensions for every proxy engine without overwriting third-party CSS or scaling pages artificially. [MDN viewport documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport) describes why mobile browsers otherwise use a wider virtual viewport.

Argon's document/API pipeline and direct-asset path also replaced every visitor's User-Agent with Windows Chrome and advertised `sec-ch-ua-mobile: ?0`. They now preserve the visitor's User-Agent, language, and corresponding client hints. Safari does not receive fabricated Chromium hints. Site-specific mobile interfaces can be selected by their own servers again.

The mobile shell adds Hide toolbar and Show toolbar controls, remembers the choice locally, releases the hidden header's space to the page, and restores desktop controls at the desktop breakpoint. Controls support touch, keyboard focus, ARIA, and safe-area insets. Touch devices retain the controls in landscape up to 1100px; normal-pointer desktop behavior is unchanged.

## Checks

```sh
node --test scripts/proxyMobile.test.mjs scripts/proxyMobileIntegration.test.mjs
```

Five regression tests pass. Integration coverage exercises Argon's actual request pipeline with only the final upstream fetch mocked, for Android and iPhone documents and APIs.

Browser emulation verified the real cloaking popup's outer and inner widths at 390px (iPhone13), 412px (Pixel7), and 834px (iPad Pro11), plus toolbar interaction, persistence, keyboard restore, homepage resizing, 915x412 touch landscape and 915/1440px normal-pointer desktop layouts. These are controlled layout tests, not a claim that every external site's unrelated proxy compatibility issues have been resolved.

Deploy the changed source, including `argon/device-headers.cjs`, then restart the Node/PM2 application. Reload or reopen existing cloaked tabs: an already-created about:blank wrapper keeps its old document until reopened. The shell and homepage reference a versioned cloak script to avoid using the stale cached wrapper code. No VPS deployment or running app restart was performed during this change.
