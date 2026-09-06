export const APP_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --bg-void:       #0f0f12;
      --bg-base:       #1a1a1f;
      --bg-panel:      #141417;
      --bg-card:       #1e1e24;
      --bg-raised:     #25252d;
      --bg-hover:      rgba(255,255,255,0.05);
      --bg-input:      #1c1c22;
      --accent:        #7c3aed;
      --accent-hi:     #8b5cf6;
      --accent-lo:     rgba(124,58,237,0.12);
      --accent-border: rgba(124,58,237,0.25);
      --blue:          #3b82f6;
      --blue-lo:       rgba(59,130,246,0.1);
      --blue-border:   rgba(59,130,246,0.2);
      --teal:          #10b981;
      --teal-lo:       rgba(16,185,129,0.1);
      --gold:          #f59e0b;
      --gold-lo:       rgba(245,158,11,0.1);
      --danger:        #ef4444;
      --danger-lo:     rgba(239,68,68,0.1);
      --success:       #22c55e;
      --success-lo:    rgba(34,197,94,0.1);
      --text-1:        #ededee;
      --text-2:        #a1a1aa;
      --text-3:        #71717a;
      --border:        rgba(255,255,255,0.06);
      --border-md:     rgba(255,255,255,0.08);
      --border-lg:     rgba(255,255,255,0.12);
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 16px;
      --radius-xl: 20px;
      --font-ui: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --font-head: 'Inter', system-ui, sans-serif;
      --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
      --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
      --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
      --glass-bg: rgba(20,20,23,0.75);
      --glass-border: rgba(255,255,255,0.08);
    }
    
    html, body {
      height: 100%;
      overflow: hidden;
      font-family: var(--font-ui);
      background: var(--bg-void);
      color: var(--text-1);
      -webkit-font-smoothing: antialiased;
    }
    
    #app { height: 100%; position: relative; z-index: 1; }
    
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-lg); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-3); }
    
    .shell { display: flex; height: 100vh; overflow: hidden; background: var(--bg-void); }
    
    /* Sidebar – glassmorphic */
    .sidebar {
      width: 280px;
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.2s ease;
      overflow-x: hidden;
    }
    
    .sidebar-header {
      height: 60px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
      background: transparent;
    }
    
    .sidebar-logo {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--accent), var(--accent-hi));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }
    
    .sidebar-title {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #fff, var(--text-2));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .sidebar-section-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-3);
      padding: 20px 20px 8px;
    }
    
    .channel-item {
      margin: 2px 12px;
      padding: 8px 12px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.15s;
      color: var(--text-2);
      font-size: 14px;
      font-weight: 500;
      border: none;
      background: transparent;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .channel-item:hover { background: var(--bg-hover); color: var(--text-1); transform: translateX(2px); }
    .channel-item.active { background: var(--accent-lo); color: var(--accent-hi); border-left: 2px solid var(--accent); }
    .channel-hash { font-size: 18px; font-weight: 400; opacity: 0.7; flex-shrink: 0; }
    
    .online-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-3);
      white-space: nowrap;
      font-weight: 500;
      flex-shrink: 0;
    }
    .online-pill-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-3); }
    .online-pill.has-users { color: var(--teal); }
    .online-pill.has-users .online-pill-dot { background: var(--teal); box-shadow: 0 0 6px var(--teal); }

    .notification-toggle {
      min-height: 30px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--bg-card);
      color: var(--text-2);
      padding: 0 10px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
    }
    .notification-toggle:hover,
    .notification-toggle.active {
      color: var(--text-1);
      border-color: var(--accent-border);
      background: var(--accent-lo);
    }
    
    /* ===== SIDEBAR FOOTER – FIXED CUTOFF ===== */
    .sidebar-footer {
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(12px);
      border-top: 1px solid var(--glass-border);
      padding: 12px 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: auto;
    }
    .footer-user {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 8px;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.12s;
      background: rgba(255,255,255,0.03);
      overflow: hidden;
    }
    .footer-user:hover { background: var(--bg-hover); transform: translateX(2px); }
    .footer-user .avatar.sm { flex-shrink: 0; }
    .footer-user div { min-width: 0; overflow: hidden; }
    .footer-user div div:first-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .footer-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }
    .icon-btn {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      border: none;
      background: rgba(255,255,255,0.08);
      color: var(--text-2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.12s;
      flex-shrink: 0;
    }
    .icon-btn:hover {
      background: var(--bg-hover);
      color: var(--text-1);
      transform: scale(1.05);
    }
    .icon-btn.danger {
      background: rgba(239,68,68,0.2);
      color: var(--danger);
    }
    .icon-btn.danger:hover {
      background: var(--danger);
      color: white;
      transform: scale(1.05);
    }
    
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent-hi));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      box-shadow: var(--shadow-sm);
    }
    .avatar.sm { width: 28px; height: 28px; font-size: 11px; }
    
    /* Main chat area */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg-base);
      position: relative;
      min-width: 0;
    }
    
    .main-header {
      min-height: 60px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid var(--border);
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      z-index: 10;
      flex-wrap: wrap;
    }
    .main-header-hash { font-size: 20px; color: var(--text-3); }
    .main-header h2 { font-size: 18px; font-weight: 600; color: var(--text-1); }
    .header-online {
      font-size: 12px;
      color: var(--text-3);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }
    .header-online::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-3);
    }
    .header-online.has-users::before { background: var(--teal); box-shadow: 0 0 8px var(--teal); }
    
    /* Room effect stage */
    .room-effect-stage { position: absolute; inset: 0; pointer-events: none; z-index: 25; overflow: hidden; }
    .room-effect-layer { position: absolute; inset: -12%; pointer-events: none; }
    
    /* Flashbang (improved) – kept from previous */
    .flashbang-overlay {
      position: fixed; inset: 0; z-index: 9999; background: white; pointer-events: none;
      opacity: 0; backdrop-filter: blur(12px); overflow: hidden;
    }
    .flashbang-overlay.active { opacity: 1; animation: flashbangBgFade var(--flashbang-duration) ease-out forwards; }
    .flashbang-overlay::before {
      content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0;
      background: radial-gradient(circle, white 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0) 80%);
      border-radius: 50%; transform: translate(-50%, -50%); z-index: 10001; opacity: 0;
    }
    .flashbang-overlay.active::before { animation: flashbangExplode 0.45s cubic-bezier(0.2,0.9,0.3,1.2) forwards; }
    body.flashbang-active { animation: flashbangShake 0.3s cubic-bezier(0.36,0.07,0.19,0.97) both; }
    @keyframes flashbangExplode {
      0% { width: 0; height: 0; opacity: 1; }
      40% { width: 150vw; height: 150vw; opacity: 1; }
      100% { width: 250vw; height: 250vw; opacity: 0; }
    }
    @keyframes flashbangBgFade {
      0% { backdrop-filter: blur(12px); background: white; opacity: 1; }
      20% { background: white; opacity: 1; }
      45% { backdrop-filter: blur(4px); background: white; opacity: 1; }
      100% { backdrop-filter: blur(0); background: transparent; opacity: 0; }
    }
    @keyframes flashbangShake {
      0%,100% { transform: translate(0,0); }
      10% { transform: translate(-3px,2px); }
      20% { transform: translate(4px,-2px); }
      30% { transform: translate(-2px,3px); }
      40% { transform: translate(5px,-1px); }
      50% { transform: translate(-4px,2px); }
      60% { transform: translate(3px,-3px); }
      70% { transform: translate(-5px,1px); }
      80% { transform: translate(2px,-2px); }
    }
    .flashbang-overlay-text {
      position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
      width: min(78vw, 760px); text-align: center; font-family: var(--font-head);
      display: flex; flex-direction: column; align-items: center; gap: 0;
      z-index: 10002; color: #0a0a0f; opacity: 0;
      animation: flashbangTextFade 0.3s ease-out 0.2s forwards;
    }
    .flashbang-overlay-kicker {
      font-size: clamp(13px,1.6vw,18px); font-weight: 700; letter-spacing: 0.34em;
      text-transform: uppercase; color: #1a1a2e; text-shadow: 0 0 8px rgba(255,255,255,0.9);
    }
    .flashbang-overlay-name {
      font-size: clamp(30px,6vw,72px); font-weight: 800; line-height: 1;
      letter-spacing: 0.03em; color: #05050f; text-shadow: 0 0 12px rgba(255,255,255,0.9);
    }
    @keyframes flashbangTextFade {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
      100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    body.flashbang-active #app {
      animation: flashbangVision var(--flashbang-duration) cubic-bezier(0.25,0.46,0.45,0.94) forwards;
    }
    @keyframes flashbangVision {
      0% { filter: blur(20px) brightness(3) saturate(0.4) contrast(1.5); }
      30% { filter: blur(12px) brightness(2.2) saturate(0.55) contrast(1.3); }
      60% { filter: blur(6px) brightness(1.4) saturate(0.75) contrast(1.1); }
      100% { filter: blur(0) brightness(1) saturate(1) contrast(1); }
    }
    
    /* Distinct room effects */
    .room-effect-scramble {
      background:
        linear-gradient(90deg, rgba(255,0,91,0.06), transparent 18%, rgba(0,229,255,0.07) 52%, transparent),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 5px);
      mix-blend-mode: screen;
    }
    .room-effect-scramble .room-effect-layer-a {
      background:
        linear-gradient(90deg, transparent 0 10%, rgba(255,0,91,0.26) 11% 12%, transparent 13% 32%, rgba(0,229,255,0.18) 33% 36%, transparent 37%),
        repeating-linear-gradient(90deg, transparent 0 28px, rgba(255,255,255,0.12) 29px 30px, transparent 31px 64px);
      background-size: 180% 100%, 120px 100%;
      animation: scrambleTear 0.62s steps(2, end) infinite;
      opacity: 0.8;
    }
    .room-effect-scramble .room-effect-layer-b {
      background: repeating-linear-gradient(0deg, transparent 0 12px, rgba(0,229,255,0.08) 13px, transparent 16px);
      animation: scrambleScan 1.3s linear infinite;
      opacity: 0.72;
    }
    .main:has(.room-effect-scramble.active) #chat-messages { animation: scrambleScreenShake 0.16s steps(2, end) infinite; }
    .main:has(.room-effect-scramble.active) .msg-bubble { animation: scrambleTextGlitch 0.44s steps(2, end) infinite; }
    @keyframes scrambleScreenShake {
      0%, 100% { transform: translate(0,0); }
      25% { transform: translate(-1px,1px); }
      50% { transform: translate(2px,-1px); }
      75% { transform: translate(-1px,-1px); }
    }
    @keyframes scrambleTear {
      0% { transform: translateX(-7%) skewX(-8deg); filter: hue-rotate(0deg); }
      50% { transform: translateX(7%) skewX(6deg); filter: hue-rotate(90deg); }
      100% { transform: translateX(-3%) skewX(-4deg); filter: hue-rotate(0deg); }
    }
    @keyframes scrambleScan { 0% { background-position: 0 -80px; } 100% { background-position: 0 80px; } }
    @keyframes scrambleTextGlitch {
      0%, 100% { text-shadow: 1px 0 #ff005b, -1px 0 #00e5ff; }
      50% { text-shadow: -2px 0 #00e5ff, 2px 0 #ff005b; }
    }

    .room-effect-embers {
      background:
        radial-gradient(circle at 50% 100%, rgba(255,103,24,0.17), transparent 52%),
        linear-gradient(180deg, transparent, rgba(100,30,8,0.18));
    }
    .room-effect-embers .room-effect-layer-a {
      background:
        radial-gradient(circle at 10% 96%, rgba(255,184,77,0.95) 0 2px, transparent 4px),
        radial-gradient(circle at 24% 88%, rgba(255,103,24,0.8) 0 3px, transparent 6px),
        radial-gradient(circle at 48% 94%, rgba(255,69,20,0.75) 0 2px, transparent 5px),
        radial-gradient(circle at 78% 90%, rgba(255,214,128,0.86) 0 2px, transparent 5px);
      background-size: 190px 190px;
      animation: embersRise 3s linear infinite;
      filter: blur(0.4px);
    }
    .room-effect-embers .room-effect-layer-b {
      background: radial-gradient(ellipse at 50% 112%, rgba(255,82,18,0.36), transparent 54%);
      animation: emberHeat 2.4s ease-in-out infinite alternate;
    }
    .main:has(.room-effect-embers.active) .msg-bubble { border-color: rgba(255,127,45,0.22); box-shadow: 0 0 18px rgba(255,92,28,0.14); }
    @keyframes embersRise {
      0% { background-position: 0 170px, 60px 180px, 120px 165px, 160px 190px; opacity: 0; }
      12% { opacity: 1; }
      100% { background-position: -20px -80px, 80px -120px, 110px -90px, 190px -130px; opacity: 0.15; }
    }
    @keyframes emberHeat { 0% { opacity: 0.35; transform: scaleY(0.96); } 100% { opacity: 0.75; transform: scaleY(1.06); } }

    .room-effect-frostbyte {
      background:
        linear-gradient(135deg, rgba(180,236,255,0.09), transparent 35%, rgba(89,175,255,0.08)),
        radial-gradient(circle at 20% 0%, rgba(220,250,255,0.13), transparent 40%);
    }
    .room-effect-frostbyte .room-effect-layer-a {
      background:
        linear-gradient(115deg, transparent 0 34%, rgba(224,250,255,0.34) 38%, transparent 46%),
        repeating-linear-gradient(135deg, rgba(220,245,255,0.16) 0 1px, transparent 1px 14px);
      background-size: 240% 100%, 34px 34px;
      animation: frostSweep 3.6s ease-in-out infinite;
      opacity: 0.78;
    }
    .room-effect-frostbyte .room-effect-layer-b {
      background:
        radial-gradient(2px 2px at 15% 30%, white 100%, transparent),
        radial-gradient(3px 3px at 75% 45%, rgba(220,245,255,0.9) 100%, transparent),
        radial-gradient(2px 2px at 45% 70%, white 100%, transparent),
        radial-gradient(4px 4px at 85% 85%, rgba(200,235,255,0.8) 100%, transparent);
      background-size: 220px 220px;
      animation: frostSparkle 2.2s ease-in-out infinite;
      opacity: 0.9;
      mix-blend-mode: screen;
    }
    .main:has(.room-effect-frostbyte.active) .msg-bubble { border-color: rgba(165,232,255,0.25); box-shadow: inset 0 0 18px rgba(160,220,255,0.08), 0 0 16px rgba(102,204,255,0.08); }
    @keyframes frostSweep { 0% { background-position: -140% 0, 0 0; } 100% { background-position: 180% 0, 34px 34px; } }
    @keyframes frostSparkle {
      0%, 100% { opacity: 0.45; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.025); }
    }

        .room-effect-matrix {
      background:
        radial-gradient(ellipse at 50% 30%, rgba(0,255,65,0.16), rgba(0,15,0,0.36) 65%, rgba(0,0,0,0.58)),
        repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.22) 2px 4px);
    }
    .room-effect-matrix .room-effect-layer-a {
      background:
        repeating-linear-gradient(90deg, transparent 0 38px, rgba(32,255,118,0.18) 40px, transparent 42px 68px),
        repeating-linear-gradient(180deg, rgba(49,255,139,0.48) 0 2px, transparent 2px 14px);
      background-size: 190px 100%, 190px 160px;
      animation: matrixRainA 1.4s linear infinite;
      filter: drop-shadow(0 0 8px rgba(0,255,96,0.85));
      opacity: 0.54;
      mix-blend-mode: screen;
    }
    .room-effect-matrix .room-effect-layer-b {
      background: linear-gradient(180deg, transparent 0, rgba(0,255,65,0.06) 46%, rgba(0,255,65,0.18) 50%, rgba(0,255,65,0.06) 54%, transparent 100%);
      background-size: 100% 70px;
      animation: matrixScanB 3.6s linear infinite;
      mix-blend-mode: screen;
      opacity: 0.72;
    }
    .main:has(.room-effect-matrix.active) .msg-bubble {
      font-family: var(--font-mono);
      border-color: rgba(31,255,111,0.28);
      box-shadow: inset 0 0 0 1px rgba(31,255,111,0.12), 0 0 14px rgba(31,255,111,0.18);
      color: #9cffba;
    }
    @keyframes matrixRainA { 0% { background-position: 0 -240px, 0 -400px; } 100% { background-position: 0 240px, 0 400px; } }
    @keyframes matrixScanB { 0% { background-position: 0 -112%; } 100% { background-position: 0 112%; } }

    .room-effect-starlight {
      background:
        radial-gradient(circle at 72% 18%, rgba(192,215,255,0.17), transparent 34%),
        radial-gradient(circle at 24% 78%, rgba(255,230,166,0.10), transparent 32%),
        linear-gradient(135deg, rgba(117,91,255,0.08), rgba(47,181,255,0.06));
    }
    .room-effect-starlight .room-effect-layer-a {
      background:
        radial-gradient(2px 2px at 15% 25%, white 100%, transparent),
        radial-gradient(1px 1px at 85% 40%, rgba(255,255,200,0.9) 100%, transparent),
        radial-gradient(3px 3px at 45% 75%, white 100%, transparent),
        radial-gradient(2px 2px at 70% 15%, rgba(210,230,255,0.8) 100%, transparent),
        radial-gradient(1px 1px at 92% 88%, white 100%, transparent);
      background-size: 320px 320px;
      animation: starsTwinkle 2.8s ease-in-out infinite alternate;
    }
    .room-effect-starlight .room-effect-layer-b {
      background: conic-gradient(from 120deg at 50% 50%, transparent, rgba(145,119,255,0.13), transparent, rgba(95,207,255,0.1), transparent);
      animation: starAurora 7s linear infinite;
      filter: blur(10px);
      opacity: 0.9;
    }
    .main:has(.room-effect-starlight.active) .msg-bubble { border-color: rgba(180,196,255,0.2); box-shadow: 0 0 20px rgba(147,170,255,0.12); }
    @keyframes starsTwinkle {
      0% { opacity: 0.38; background-position: 0 0; }
      100% { opacity: 1; background-position: 24px -18px; }
    }
    @keyframes starAurora { 0% { transform: rotate(0deg) scale(1.1); } 100% { transform: rotate(360deg) scale(1.1); } }

    .room-effect-duck {
      background:
        radial-gradient(circle at 16% 20%, rgba(255,223,77,0.18), transparent 24%),
        radial-gradient(circle at 82% 78%, rgba(255,170,33,0.12), transparent 25%);
    }
    .room-effect-duck .room-effect-layer-a {
      background:
        radial-gradient(ellipse at 20% 30%, rgba(255,221,64,0.95) 0 10px, transparent 11px),
        radial-gradient(ellipse at 20% 30%, rgba(255,139,23,0.95) 13px 18px, transparent 19px),
        radial-gradient(circle at 24% 27%, rgba(24,24,24,0.9) 0 1px, transparent 2px);
      background-size: 150px 110px;
      animation: duckFloat 4.2s ease-in-out infinite;
      opacity: 0.58;
    }
    .room-effect-duck .room-effect-layer-b {
      background: repeating-radial-gradient(circle at 50% 100%, rgba(255,236,126,0.15) 0 2px, transparent 3px 24px);
      animation: duckRipples 2.8s ease-out infinite;
      opacity: 0.55;
    }
    .main:has(.room-effect-duck.active) .msg-bubble { border-color: rgba(255,210,63,0.24); box-shadow: 0 0 14px rgba(255,199,31,0.12); }
    @keyframes duckFloat {
      0%, 100% { background-position: 0 70%, 0 70%, 0 70%; transform: translateY(0); }
      50% { background-position: 120px 64%, 120px 64%, 120px 64%; transform: translateY(-8px); }
    }
    @keyframes duckRipples { 0% { background-size: 80px 80px; opacity: 0.2; } 50% { opacity: 0.65; } 100% { background-size: 130px 130px; opacity: 0.2; } }

    .effect-flashbang {
      color: #111827 !important;
      background: linear-gradient(135deg, #ffffff, #fff7b8 48%, #dbeafe) !important;
      border: 1px solid rgba(255,255,255,0.9) !important;
      box-shadow: 0 0 24px rgba(255,255,255,0.38), inset 0 0 20px rgba(255,255,255,0.52) !important;
      text-shadow: none !important;
    }
    .effect-scramble {
      color: #e6fbff !important;
      background:
        linear-gradient(90deg, rgba(255,0,91,0.22), rgba(0,229,255,0.16)),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 5px) !important;
      border: 1px solid rgba(0,229,255,0.28) !important;
      box-shadow: -2px 0 0 rgba(255,0,91,0.5), 2px 0 0 rgba(0,229,255,0.5) !important;
      text-shadow: 1px 0 #ff005b, -1px 0 #00e5ff !important;
    }
    .effect-embers {
      color: #ffe4b8 !important;
      background: linear-gradient(135deg, rgba(90,28,10,0.95), rgba(180,58,18,0.54), rgba(25,18,15,0.96)) !important;
      border: 1px solid rgba(255,130,54,0.42) !important;
      box-shadow: 0 0 22px rgba(255,91,31,0.22), inset 0 -10px 22px rgba(255,91,31,0.12) !important;
      text-shadow: 0 0 8px rgba(255,119,40,0.65) !important;
    }
    .effect-frostbyte {
      color: #e9fbff !important;
      background: linear-gradient(135deg, rgba(218,248,255,0.2), rgba(27,92,140,0.48), rgba(13,20,31,0.9)) !important;
      border: 1px solid rgba(174,235,255,0.44) !important;
      box-shadow: inset 0 0 24px rgba(181,239,255,0.12), 0 0 18px rgba(120,216,255,0.16) !important;
      text-shadow: 0 0 8px rgba(166,235,255,0.65) !important;
    }
    .effect-matrix {
      color: #bcffd2 !important;
      background:
        radial-gradient(ellipse at 0% 100%, rgba(0,255,90,0.28), transparent 42%),
        linear-gradient(180deg, rgba(1,24,10,0.97), rgba(0,58,26,0.65), rgba(1,24,10,0.95)),
        repeating-linear-gradient(0deg, transparent 0 5px, rgba(47,255,120,0.08) 6px, transparent 7px) !important;
      border: 1px solid rgba(38,255,109,0.42) !important;
      box-shadow: inset 0 0 0 1px rgba(38,255,109,0.2), 0 0 22px rgba(38,255,109,0.2), 0 0 6px rgba(38,255,109,0.08) !important;
      font-family: var(--font-mono) !important;
      text-shadow: 0 0 8px rgba(74,222,128,0.55) !important;
      animation: matrixMsgPulse 2.8s ease-in-out infinite alternate !important;
    }
    @keyframes matrixMsgPulse {
      0% { box-shadow: inset 0 0 0 1px rgba(38,255,109,0.2), 0 0 22px rgba(38,255,109,0.2), 0 0 6px rgba(38,255,109,0.08); }
      100% { box-shadow: inset 0 0 0 1px rgba(38,255,109,0.35), 0 0 30px rgba(38,255,109,0.32), 0 0 12px rgba(38,255,109,0.18); }
    }
    .effect-starlight {
      color: #f8f7ff !important;
      background:
        radial-gradient(circle at 15% 20%, rgba(255,255,255,0.28), transparent 18%),
        linear-gradient(135deg, rgba(58,45,130,0.82), rgba(47,128,237,0.45), rgba(17,24,39,0.92)) !important;
      border: 1px solid rgba(191,204,255,0.34) !important;
      box-shadow: 0 0 24px rgba(152,172,255,0.2), inset 0 0 24px rgba(255,255,255,0.06) !important;
      text-shadow: 0 0 9px rgba(207,218,255,0.72) !important;
    }
    .effect-duck {
      color: #3b2600 !important;
      background: linear-gradient(135deg, #ffe55c, #ffb02e 52%, #fff1a8) !important;
      border: 1px solid rgba(255,232,105,0.84) !important;
      box-shadow: 0 0 18px rgba(255,210,63,0.28), inset 0 -8px 20px rgba(255,145,31,0.18) !important;
      text-shadow: 0 1px rgba(255,255,255,0.45) !important;
    }
    .effect-public_message {
      color: #fefce8 !important;
      background: linear-gradient(135deg, rgba(124,58,237,0.9), rgba(236,72,153,0.72), rgba(14,165,233,0.72)) !important;
      border: 1px solid rgba(255,255,255,0.28) !important;
      box-shadow: 0 0 22px rgba(236,72,153,0.22), inset 0 0 24px rgba(255,255,255,0.08) !important;
      text-shadow: 0 0 8px rgba(255,255,255,0.42) !important;
    }
    .effect-neon {
      color: #f8fdff !important;
      background:
        repeating-linear-gradient(90deg, transparent 0 18px, rgba(0,229,255,0.05) 19px 20px, transparent 21px 42px),
        radial-gradient(circle at 18% 18%, rgba(0,229,255,0.22), transparent 24%),
        radial-gradient(circle at 86% 78%, rgba(255,35,203,0.24), transparent 28%),
        linear-gradient(135deg, rgba(5,14,35,0.96), rgba(20,8,37,0.92)) !important;
      background-size: 120px 100%, 180% 180%, 180% 180%, 100% 100%;
      border: 1px solid rgba(0,229,255,0.52) !important;
      box-shadow: 0 0 0 1px rgba(255,35,203,0.26), 0 0 18px rgba(0,229,255,0.28), inset 0 0 18px rgba(255,35,203,0.12) !important;
      text-shadow: 0 0 5px #00e5ff, 0 0 12px rgba(255,35,203,0.82) !important;
      animation: neonFlicker 2.8s steps(1, end) infinite, neonDrift 7s linear infinite !important;
    }
    .effect-gold {
      color: #2a1700 !important;
      background:
        linear-gradient(115deg, transparent 0 34%, rgba(255,255,255,0.58) 42%, transparent 50%),
        repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0 2px, transparent 3px 12px),
        linear-gradient(135deg, #fff0a8, #f5b942 45%, #9f620e 52%, #ffe49a) !important;
      background-size: 240% 100%, 38px 38px, 100% 100%;
      border: 1px solid rgba(255,235,161,0.9) !important;
      box-shadow: 0 0 20px rgba(245,185,66,0.24), inset 0 2px 10px rgba(255,255,255,0.34), inset 0 -10px 18px rgba(96,49,0,0.16) !important;
      text-shadow: 0 1px rgba(255,255,255,0.52) !important;
      animation: goldSweep 3.2s ease-in-out infinite !important;
    }
    .effect-bubblegum {
      color: #fff7ff !important;
      background:
        radial-gradient(circle at 18% 20%, rgba(255,255,255,0.42) 0 9px, transparent 10px),
        radial-gradient(circle at 80% 72%, rgba(255,255,255,0.24) 0 7px, transparent 8px),
        radial-gradient(circle at 44% 86%, rgba(255,255,255,0.18) 0 5px, transparent 6px),
        linear-gradient(135deg, #ff6bd6, #7bdcff 52%, #b084ff) !important;
      background-size: 130px 130px, 170px 170px, 100px 100px, 100% 100%;
      border: 1px solid rgba(255,255,255,0.34) !important;
      box-shadow: 0 0 18px rgba(255,107,214,0.22), inset 0 0 20px rgba(255,255,255,0.14) !important;
      text-shadow: 0 1px 5px rgba(112,38,142,0.6) !important;
      animation: bubblePop 5s ease-in-out infinite !important;
    }
    .effect-shadow {
      color: #ede9fe !important;
      background:
        radial-gradient(circle at 8% 18%, rgba(124,58,237,0.3), transparent 26%),
        linear-gradient(135deg, rgba(10,10,15,0.98), rgba(30,22,55,0.95)) !important;
      border: 1px solid rgba(167,139,250,0.34) !important;
      box-shadow: -5px 0 0 rgba(124,58,237,0.55), 0 12px 28px rgba(0,0,0,0.32), inset 0 0 18px rgba(124,58,237,0.1) !important;
      text-shadow: 0 0 8px rgba(167,139,250,0.42) !important;
      animation: shadowBreath 4.4s ease-in-out infinite !important;
    }
    .effect-rainbow {
      color: #ffffff !important;
      background:
        linear-gradient(var(--bg-card), var(--bg-card)) padding-box,
        linear-gradient(90deg, #ff4d6d, #ffd166, #06d6a0, #4cc9f0, #b517ff, #ff4d6d) border-box !important;
      background-size: 100% 100%, 260% 100% !important;
      border: 2px solid transparent !important;
      box-shadow: 0 0 22px rgba(76,201,240,0.14), inset 0 0 18px rgba(255,255,255,0.04) !important;
      text-shadow: 0 0 7px rgba(255,255,255,0.38) !important;
      animation: rainbowBorderFlow 3.4s linear infinite !important;
    }
    .effect-plasma {
      color: #f5f3ff !important;
      background:
        radial-gradient(circle at 20% 20%, rgba(56,189,248,0.55), transparent 28%),
        radial-gradient(circle at 82% 70%, rgba(217,70,239,0.5), transparent 30%),
        linear-gradient(135deg, rgba(30,27,75,0.98), rgba(49,46,129,0.92)) !important;
      background-size: 180% 180%, 170% 170%, 100% 100%;
      border: 1px solid rgba(165,180,252,0.38) !important;
      box-shadow: 0 0 28px rgba(99,102,241,0.28), inset 0 0 24px rgba(56,189,248,0.12) !important;
      text-shadow: 0 0 10px rgba(216,180,254,0.72) !important;
      animation: plasmaDrift 4.8s ease-in-out infinite alternate !important;
    }

    @keyframes neonFlicker {
      0%, 9%, 11%, 39%, 41%, 100% { filter: brightness(1.08); }
      10%, 40% { filter: brightness(0.72); }
    }
    @keyframes neonDrift {
      0% { background-position: 0 0, 0 0, 100% 100%, 0 0; }
      100% { background-position: 120px 0, 100% 20%, 0 80%, 0 0; }
    }
    @keyframes goldSweep {
      0%, 100% { background-position: -140% 0, 0 0, 0 0; }
      50% { background-position: 140% 0, 18px 18px, 0 0; }
    }
    @keyframes bubblePop {
      0%, 100% { background-position: 0 0, 80px 60px, 20px 40px, 0 0; transform: translateY(0); }
      50% { background-position: 10px -18px, 70px 38px, 34px 18px, 0 0; transform: translateY(-1px); }
    }
    @keyframes shadowBreath {
      0%, 100% { box-shadow: -5px 0 0 rgba(124,58,237,0.55), 0 12px 28px rgba(0,0,0,0.32), inset 0 0 18px rgba(124,58,237,0.1); }
      50% { box-shadow: -7px 0 0 rgba(167,139,250,0.76), 0 16px 34px rgba(0,0,0,0.44), inset 0 0 26px rgba(124,58,237,0.18); }
    }
    @keyframes rainbowBorderFlow {
      0% { background-position: 0 0, 0% 0; }
      100% { background-position: 0 0, 260% 0; }
    }
    @keyframes plasmaDrift {
      0% { background-position: 0% 20%, 100% 80%, 0 0; filter: saturate(1); }
      100% { background-position: 80% 70%, 20% 20%, 0 0; filter: saturate(1.32); }
    }

    @media (prefers-reduced-motion: reduce) {
      .room-effect-layer,
      .main:has(.room-effect-scramble.active) #chat-messages,
      .main:has(.room-effect-scramble.active) .msg-bubble,
      .effect-neon,
      .effect-gold,
      .effect-bubblegum,
      .effect-shadow,
      .effect-rainbow,
      .effect-plasma {
        animation: none !important;
      }
    }
    
    /* ===== MODERN CHAT MESSAGES ===== */
    #chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 18px 0 20px;
      display: flex;
      flex-direction: column;
    }
    .msg {
      display: flex;
      gap: 11px;
      padding: 7px 24px;
      position: relative;
      transition: background 0.16s ease;
    }
    .msg.msg-enter {
      opacity: 0;
      transform: translateX(18px);
      animation: msgSlideInRight 0.22s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      animation-delay: var(--msg-enter-delay, 0ms);
      will-change: transform, opacity;
    }
    @keyframes msgSlideInRight {
      0% {
        opacity: 0;
        transform: translateX(18px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    .msg:hover { background: color-mix(in srgb, var(--bg-hover) 72%, transparent); }
    .msg:hover .msg-actions { opacity: 1; }
    .msg-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      background: linear-gradient(135deg, var(--accent), var(--accent-hi));
      flex-shrink: 0;
      box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, var(--shadow-sm);
    }
    .msg.deleted { opacity: 0.5; }
    .msg.pending .msg-avatar,
    .msg.pending .msg-bubble {
      opacity: 0.72;
    }
    .msg.pending .msg-bubble {
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02), var(--shadow-sm);
    }
    .msg-send-state {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--text-3);
      font-size: 11px;
      font-weight: 600;
    }
    .msg-send-state::before {
      content: '';
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: currentColor;
      animation: sendingPulse 0.9s ease-in-out infinite;
    }
    @keyframes sendingPulse {
      0%, 100% { opacity: 0.35; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1); }
    }
    .msg-body {
      flex: 1;
      min-width: 0;
      padding: 2px 0;
      max-width: min(100%, 840px);
    }
    .msg-head {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 5px;
      flex-wrap: wrap;
    }
    .msg-head strong { font-size: 14px; font-weight: 700; color: var(--text-1); }
    .msg-head > span:last-of-type { font-size: 12px; color: var(--text-3); }
    .msg-bubble {
      font-size: 15px;
      line-height: 1.5;
      color: var(--text-1);
      word-break: break-word;
      background: color-mix(in srgb, var(--bg-card) 92%, white 8%);
      border: 1px solid color-mix(in srgb, var(--border) 82%, transparent);
      border-radius: 8px;
      padding: 9px 13px;
      display: inline-block;
      max-width: min(92%, 760px);
      box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, var(--shadow-sm);
      transition: background 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease, transform 0.14s ease;
    }
    .msg:hover .msg-bubble {
      background: var(--bg-raised);
      border-color: color-mix(in srgb, var(--border-md) 72%, var(--accent) 28%);
      box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, var(--shadow-md);
    }
    .msg.mine .msg-bubble {
      background: linear-gradient(180deg, color-mix(in srgb, var(--accent-lo) 42%, var(--bg-card)), var(--bg-card));
      border-color: color-mix(in srgb, var(--accent-border) 56%, var(--border));
    }
    .msg-bubble[class*="effect-"], .effect-preview[class*="effect-"] {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--border-md);
    }
    .msg.system-note {
      gap: 0;
      padding: 5px 24px;
      background: none;
      justify-content: center;
    }
    .msg.system-note .msg-avatar { display: none; }
    .msg.system-note .msg-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 0 1 auto;
      max-width: min(100%, 720px);
      padding: 0;
    }
    .msg.system-note .msg-head { display: none; }
    .msg.system-note .msg-bubble {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      max-width: 100%;
      padding: 7px 11px;
      background: color-mix(in srgb, var(--bg-raised) 78%, transparent);
      border: 1px solid color-mix(in srgb, var(--border) 72%, transparent);
      color: var(--text-2);
      font-size: 12.5px;
      font-weight: 650;
      border-radius: 999px;
      box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset;
    }
    .msg.system-note:hover { background: none; }
    .msg.system-note:hover .msg-bubble { transform: none; box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset, var(--shadow-sm); }
    .system-note-icon {
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 800;
      line-height: 1;
      background: var(--bg-card);
      color: var(--text-1);
      border: 1px solid var(--border);
      flex: 0 0 auto;
    }
    .system-note-copy {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .msg.system-effect .msg-bubble {
      background: linear-gradient(90deg, rgba(245,158,11,0.12), rgba(66,153,225,0.10));
      border-color: rgba(245,158,11,0.26);
      color: color-mix(in srgb, var(--text-1) 88%, var(--gold));
    }
    .msg.system-effect .system-note-icon {
      background: rgba(245,158,11,0.14);
      color: var(--gold);
      border-color: rgba(245,158,11,0.28);
    }
    .msg.system-call .msg-bubble {
      background: color-mix(in srgb, var(--success) 13%, var(--bg-raised));
      border-color: color-mix(in srgb, var(--success) 32%, var(--border));
    }
    .msg.system-call .system-note-icon {
      background: color-mix(in srgb, var(--success) 16%, var(--bg-card));
      color: var(--success);
      border-color: color-mix(in srgb, var(--success) 32%, var(--border));
    }
    .msg.system-moderation .msg-bubble {
      background: color-mix(in srgb, var(--danger) 11%, var(--bg-raised));
      border-color: color-mix(in srgb, var(--danger) 30%, var(--border));
    }
    .msg.system-moderation .system-note-icon {
      background: color-mix(in srgb, var(--danger) 16%, var(--bg-card));
      color: var(--danger);
      border-color: color-mix(in srgb, var(--danger) 32%, var(--border));
    }
    .msg.system-note .call-invite-join {
      margin-top: 6px;
      align-self: center;
    }
    .report-modal-overlay {
      align-items: center;
      justify-content: center;
      padding: 18px;
      z-index: 100000;
    }
    .report-modal,
    .report-center {
      width: min(560px, 100%);
      max-height: min(760px, calc(100vh - 36px));
      overflow: auto;
      background: var(--bg-main);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 28px 90px rgba(0,0,0,0.5);
      padding: 18px;
      color: var(--text-1);
    }
    .report-center { width: min(820px, 100%); }
    .report-modal-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 14px;
    }
    .report-modal-title {
      font-size: 18px;
      font-weight: 800;
      color: var(--text-1);
    }
    .report-modal-subtitle {
      margin-top: 4px;
      font-size: 12.5px;
      color: var(--text-3);
      line-height: 1.45;
    }
    .report-modal-close {
      width: 32px;
      height: 32px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-card);
      color: var(--text-2);
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
    }
    .report-quote,
    .report-card blockquote {
      border: 1px solid var(--border);
      background: var(--bg-card);
      border-radius: 8px;
      padding: 12px;
      margin: 0;
    }
    .report-quote span {
      display: block;
      margin-bottom: 6px;
      font-size: 11px;
      color: var(--text-3);
      text-transform: uppercase;
      font-weight: 800;
    }
    .report-quote p,
    .report-card blockquote {
      color: var(--text-2);
      font-size: 13px;
      line-height: 1.5;
    }
    .report-category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 8px;
      margin: 14px 0;
    }
    .report-category {
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-2);
      border-radius: 8px;
      padding: 9px 10px;
      cursor: pointer;
      font-weight: 700;
      font-size: 12px;
      text-align: center;
    }
    .report-category.active,
    .report-category:hover {
      border-color: var(--danger);
      color: var(--text-1);
      background: color-mix(in srgb, var(--danger) 12%, var(--bg-card));
    }
    .report-field {
      display: grid;
      gap: 7px;
      color: var(--text-2);
      font-size: 13px;
      font-weight: 700;
    }
    .report-field textarea {
      width: 100%;
      min-height: 118px;
      resize: vertical;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-input);
      color: var(--text-1);
      padding: 11px 12px;
      font: inherit;
      line-height: 1.45;
    }
    .report-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 14px;
    }
    .report-center-list {
      display: grid;
      gap: 10px;
    }
    .report-card {
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-card);
      padding: 13px;
      display: grid;
      gap: 9px;
    }
    .report-card-top,
    .report-card-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      font-size: 12px;
      color: var(--text-3);
    }
    .report-card-actions { justify-content: flex-start; }
    .report-status {
      padding: 3px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--danger) 12%, var(--bg-raised));
      color: var(--danger);
      border: 1px solid color-mix(in srgb, var(--danger) 28%, var(--border));
      font-weight: 800;
      text-transform: uppercase;
      font-size: 10px;
    }
    .report-status-resolved .report-status,
    .report-status-dismissed .report-status {
      background: color-mix(in srgb, var(--success) 10%, var(--bg-raised));
      color: var(--success);
      border-color: color-mix(in srgb, var(--success) 24%, var(--border));
    }
    .report-card-title {
      font-size: 14px;
      font-weight: 800;
      color: var(--text-1);
    }
    .report-card-reason,
    .report-card-note,
    .report-log-line {
      font-size: 12.5px;
      line-height: 1.45;
      color: var(--text-2);
    }
    .report-card-note {
      color: var(--text-3);
      border-left: 2px solid var(--border-md);
      padding-left: 9px;
    }
    .report-empty {
      padding: 18px;
      text-align: center;
      color: var(--text-3);
      border: 1px dashed var(--border);
      border-radius: 8px;
    }
    .report-log-section {
      margin-top: 16px;
      border-top: 1px solid var(--border);
      padding-top: 12px;
      display: grid;
      gap: 6px;
    }
    .report-log-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--text-3);
    }
    .rank-chip {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 20px;
      color: var(--gold);
      background: var(--gold-lo);
      border: 1px solid rgba(245,158,11,0.3);
    }
    .rank-owner::before { content: '👑 '; color: var(--gold); }
    .rank-admin {
      background: var(--accent-lo);
      color: var(--accent-hi);
      border: 1px solid var(--accent-border);
    }
    .rank-admin::before { content: '⚡ '; color: var(--accent-hi); }
    .msg-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
      opacity: 0;
      transition: opacity 0.15s;
    }
    .delete-btn,
    .copy-id-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 12px;
      color: var(--text-3);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      transition: all 0.12s;
    }
    .delete-btn:hover,
    .copy-id-btn:hover { background: var(--danger-lo); color: var(--danger); }
    
    /* ===== COMPOSER – MODERN, CLICK ANYWHERE FOCUS ===== */
    .composer {
      border-top: 1px solid var(--border);
      padding: 12px 20px 20px;
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
    }
    .composer-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 0 10px;
      flex-wrap: wrap;
    }
    .composer-toolbar-copy {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .composer-toolbar-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-1);
    }
    .composer-toolbar-meta {
      font-size: 11px;
      color: var(--text-3);
    }
    .composer-room-effect {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 40px;
      background: var(--bg-hover);
      border: 1px solid var(--border);
      font-size: 12px;
      color: var(--text-2);
    }
    #command-panel {
      background: var(--bg-raised);
      border: 1px solid var(--border-lg);
      border-radius: var(--radius-md);
      margin-bottom: 12px;
      padding: 6px;
      box-shadow: var(--shadow-lg);
      max-height: 200px;
      overflow-y: auto;
    }
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 18px;
      padding: 10px 16px 0 18px;
      font-size: 12px;
      color: var(--text-3);
      letter-spacing: 0.01em;
    }
    .typing-indicator::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-hi);
      box-shadow: 0 0 10px rgba(139,92,246,0.45);
      animation: typingPulse 0.9s ease-in-out infinite;
      flex-shrink: 0;
    }
    @keyframes typingPulse {
      0%, 100% { opacity: 0.35; transform: scale(0.92); }
      50% { opacity: 1; transform: scale(1.08); }
    }
    .cmd-item {
      width: 100%;
      text-align: left;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: baseline;
      gap: 12px;
      cursor: pointer;
      background: transparent;
      border: none;
      transition: background 0.1s;
    }
    .cmd-item:hover { background: var(--bg-hover); }
    .cmd-usage {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--accent-hi);
    }
    .cmd-desc {
      font-size: 13px;
      color: var(--text-2);
    }
    .composer-box {
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      transition: border-color 0.2s, box-shadow 0.2s;
      cursor: text;
    }
    .composer-box:focus-within {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-lo);
    }
    .composer-box.slowmode-active {
      border-color: var(--danger);
      box-shadow: 0 0 0 3px var(--danger-lo);
      background: linear-gradient(180deg, rgba(239,68,68,0.08), rgba(28,28,34,0.96));
    }
    .composer-form {
      display: flex;
      align-items: flex-end;
      padding: 10px 16px 10px 18px;
      gap: 12px;
    }
    .composer-textarea {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      resize: none;
      font-family: var(--font-ui);
      font-size: 14px;
      color: var(--text-1);
      line-height: 1.4;
      max-height: 160px;
      overflow-y: auto;
      padding: 0;
      caret-color: var(--accent);
    }
    .composer-textarea::placeholder { color: var(--text-3); }
    .composer-textarea.slowmode-active {
      color: #fecaca;
      caret-color: var(--danger);
    }
    .composer-send {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--accent), var(--accent-hi));
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.15s;
      box-shadow: var(--shadow-sm);
    }
    .composer-send:hover { transform: scale(1.05); filter: brightness(1.1); }
    .composer-send:active { transform: scale(0.95); }
    .composer-send:disabled {
      cursor: not-allowed;
      opacity: 0.55;
      transform: none;
      filter: none;
      box-shadow: none;
    }
    .composer-send:disabled svg {
      opacity: 0.75;
      transform: translateX(1px);
    }
    .composer-emoji-btn, .composer-effect-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: transparent;
      border: 1px solid var(--border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: var(--text-2);
      transition: all 0.1s;
    }
    .composer-emoji-btn:hover, .composer-effect-btn:hover {
      background: var(--bg-hover);
      color: var(--text-1);
      border-color: var(--border-md);
    }
    /* Composer hint – gold */
    .composer-hint {
      font-size: 11px;
      color: var(--gold);
      padding: 8px 12px 4px;
      border-top: 1px solid var(--border);
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      letter-spacing: 0.02em;
    }
    .composer-hint::before {
      content: "⌨️";
      font-size: 12px;
      opacity: 0.7;
    }
    .composer-hint.slowmode-active {
      color: #fca5a5;
    }
    
    /* Popovers, cards, etc. (unchanged) */
    .emoji-picker-popover, .effects-picker-popover {
      position: absolute;
      bottom: calc(100% + 8px);
      right: 0;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 12px;
      box-shadow: var(--shadow-lg);
      z-index: 50;
      width: 320px;
      max-height: 320px;
      overflow-y: auto;
    }
    .effects-picker-grid { display: flex; flex-direction: column; gap: 10px; }
    .effects-picker-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }
    .effects-picker-tab {
      padding: 8px 12px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-2);
      cursor: pointer;
      transition: all 0.15s;
      font-size: 13px;
      font-weight: 600;
    }
    .effects-picker-tab.active,
    .effects-picker-tab:hover {
      background: var(--bg-raised);
      border-color: var(--border-md);
      color: var(--text-1);
    }
    .effects-picker-message-input {
      width: 100%;
      min-height: 90px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--bg);
      color: var(--text-1);
      padding: 10px;
      margin-top: 10px;
      resize: vertical;
      font-size: 14px;
      line-height: 1.4;
    }
    .global-public-message {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10002;
      max-width: min(92vw, 760px);
      width: auto;
      background: rgba(9, 16, 32, 0.98);
      border: 1px solid rgba(102, 126, 234, 0.25);
      border-radius: 26px;
      padding: 18px 24px;
      color: white;
      box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
      text-align: center;
      pointer-events: none;
      animation: toastIn 0.2s ease, toastOut 0.2s 4.8s ease forwards;
    }
    .global-public-message-text {
      font-size: 18px;
      line-height: 1.4;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .global-public-message-source {
      font-size: 13px;
      opacity: 0.8;
    }
    .effects-picker-card {
      background: var(--bg-hover);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 10px;
      cursor: pointer;
      transition: all 0.1s;
    }
    .effects-picker-card:hover { background: var(--bg-raised); transform: translateX(2px); }
    .effects-picker-card.active { border-color: var(--accent); background: var(--accent-lo); }
    .effects-picker-name { font-size: 14px; font-weight: 600; color: var(--text-1); }
    .effects-picker-price { color: var(--gold); }
    
    /* Auth screen (unchanged) */
    .auth-screen {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: radial-gradient(circle at 20% 30%, #0f0f12, #05050a);
      position: relative;
    }
    .auth-screen::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 70% 20%, rgba(124,58,237,0.15), transparent 60%);
      pointer-events: none;
    }
    .auth-card {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 420px;
      padding: 40px 32px;
      box-shadow: var(--shadow-lg);
      animation: authIn 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
      transition: transform 0.2s;
    }
    .auth-card:hover { transform: translateY(-4px); }
    @keyframes authIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .auth-logo {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--accent), var(--accent-hi));
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0 auto 24px;
      box-shadow: var(--shadow-md);
    }
    .auth-card h2 {
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      background: linear-gradient(135deg, #fff, var(--accent-hi));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 8px;
    }
    .auth-subtitle {
      font-size: 14px;
      text-align: center;
      color: var(--text-3);
      margin-bottom: 32px;
    }
    .auth-link {
      color: var(--accent-hi);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.1s;
    }
    .auth-link:hover { color: var(--accent); text-decoration: underline; }
    .field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
    }
    .field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-2);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .inp {
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      color: var(--text-1);
      padding: 12px 14px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s;
    }
    .inp:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-lo);
    }
    .btn {
      font-size: 14px;
      font-weight: 600;
      border: none;
      border-radius: var(--radius-md);
      padding: 12px 20px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.15s;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent-hi));
      color: white;
      box-shadow: var(--shadow-sm);
      width: 100%;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
    .btn-danger {
      background: var(--danger);
      color: white;
    }
    .btn-danger:hover:not(:disabled) { background: #dc2626; transform: translateY(-1px); }
    .btn-ghost {
      background: transparent;
      color: var(--text-2);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover:not(:disabled) { background: var(--bg-hover); color: var(--text-1); }
    
    /* Other UI (cards, tables, utilities) */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      backdrop-filter: blur(4px);
      transition: transform 0.1s, box-shadow 0.2s;
    }
    .card:hover { box-shadow: var(--shadow-md); }
    .page-scroll { flex: 1; overflow-y: auto; padding: 32px; }
    .page-inner { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
    .coin-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 40px;
      background: var(--gold-lo);
      border: 1px solid rgba(245,158,11,0.3);
      color: var(--gold);
      font-size: 13px;
      font-weight: 600;
    }
    .settings-balance {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px;
      background: var(--bg-hover);
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
    }
    .effect-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    .effect-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 16px;
      transition: all 0.15s;
    }
    .effect-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .effect-preview {
      background: var(--bg-hover);
      padding: 10px;
      border-radius: var(--radius-md);
      margin: 12px 0;
      font-size: 14px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    .data-table th {
      text-align: left;
      padding: 12px 12px 12px 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-3);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .data-table td {
      padding: 12px 12px 12px 0;
      color: var(--text-1);
      border-bottom: 1px solid var(--border);
    }
    .code-block {
      background: #0a0a0f;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-1);
      overflow-x: auto;
    }
    .hidden { display: none !important; }
    .mention {
      color: var(--accent-hi);
      font-weight: 500;
      background: var(--accent-lo);
      padding: 0 4px;
      border-radius: 4px;
    }
    #toast-host {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }
    .toast-anim {
      background: var(--glass-bg);
      backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border);
      color: var(--text-1);
      padding: 12px 20px;
      border-radius: 40px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: var(--shadow-lg);
      pointer-events: auto;
      animation: toastIn 0.2s ease, toastOut 0.2s 2.5s ease forwards;
    }
    .toast-top-anim {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10001;
      max-width: min(92vw, 860px);
      width: auto;
      background: rgba(15, 23, 42, 0.96);
      color: var(--text-1);
      border: 1px solid rgba(148, 163, 184, 0.18);
      backdrop-filter: blur(24px);
      box-shadow: 0 24px 64px rgba(15, 23, 42, 0.45);
      border-radius: 28px;
      padding: 18px 26px;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      letter-spacing: 0.02em;
      pointer-events: none;
      animation: toastIn 0.2s ease, toastOut 0.2s 3.2s ease forwards;
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastOut {
      from { opacity: 1; }
      to { opacity: 0; transform: translateY(-8px); }
    }
    #jump-to-latest {
      position: absolute;
      bottom: 100px;
      right: 24px;
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      color: var(--text-1);
      border: 1px solid var(--glass-border);
      border-radius: 40px;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: var(--shadow-md);
      z-index: 20;
      transition: all 0.15s;
    }
    #jump-to-latest:hover { transform: translateY(-2px); background: var(--bg-card); }
    #mention-notification {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--glass-bg);
      backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border);
      border-radius: 40px;
      padding: 10px 20px;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      box-shadow: var(--shadow-lg);
      font-size: 14px;
      font-weight: 500;
    }
    #mention-notification:hover { background: var(--bg-card); }
    #mention-notification-close { cursor: pointer; padding: 4px; color: var(--text-3); transition: color 0.1s; }
    #mention-notification-close:hover { color: var(--text-1); }

    .member-list-panel {
      width: 236px;
      flex: 0 0 236px;
      border-left: 1px solid var(--border);
      background: color-mix(in srgb, var(--bg-main) 94%, white 6%);
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .member-list-head {
      min-height: 76px;
      padding: 18px 16px 12px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    .member-list-title {
      font-size: 13px;
      font-weight: 800;
      color: var(--text-1);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .member-list-subtitle {
      margin-top: 4px;
      font-size: 12px;
      color: var(--text-3);
    }
    .member-list-body {
      padding: 10px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .member-row {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 42px;
      padding: 7px 8px;
      border-radius: 8px;
    }
    .member-row:hover { background: var(--bg-hover); }
    .member-avatar {
      width: 30px;
      height: 30px;
      flex: 0 0 30px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.12);
    }
    .member-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .member-meta {
      min-width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .member-name {
      color: var(--text-1);
      font-size: 13px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .member-status {
      color: var(--text-3);
      font-size: 11px;
      text-transform: capitalize;
    }
    .member-status.online { color: var(--success); }
    .member-tags {
      display: flex;
      align-items: center;
      gap: 5px;
      min-width: 0;
      flex-wrap: wrap;
    }
    .member-tag {
      display: inline-flex;
      align-items: center;
      min-height: 17px;
      padding: 0 6px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-2);
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      line-height: 1;
    }
    .member-tag.relation-self,
    .member-tag.relation-friend {
      color: var(--success);
      border-color: color-mix(in srgb, var(--success) 30%, var(--border));
      background: color-mix(in srgb, var(--success) 10%, var(--bg-card));
    }
    .member-tag.relation-pending,
    .member-tag.relation-incoming {
      color: var(--gold);
      border-color: rgba(245,158,11,0.28);
      background: rgba(245,158,11,0.10);
    }
    .member-tag.role-owner {
      color: var(--gold);
      border-color: rgba(245,158,11,0.34);
      background: rgba(245,158,11,0.12);
    }
    .member-tag.role-admin {
      color: var(--accent-hi);
      border-color: var(--accent-border);
      background: var(--accent-lo);
    }
    .member-add-friend {
      width: 26px;
      height: 26px;
      flex: 0 0 26px;
      border-radius: 50%;
      border: 1px solid var(--accent-border);
      background: var(--accent-lo);
      color: var(--accent-hi);
      font-size: 18px;
      font-weight: 900;
      line-height: 1;
      cursor: pointer;
    }
    .member-add-friend:hover {
      background: var(--accent);
      color: white;
    }
    .member-add-friend:disabled {
      opacity: 0.5;
      cursor: wait;
    }
    .member-list-empty {
      padding: 14px 8px;
      color: var(--text-3);
      font-size: 12.5px;
      line-height: 1.45;
    }
    
    /* Responsive */
    @media (max-width: 720px) {
      .sidebar { width: 72px; }
      .sidebar-header { justify-content: center; padding: 0; }
      .sidebar-title, .sidebar-section-label, .channel-item span:not(.channel-hash), .online-pill, .footer-user span:first-child { display: none; }
      .channel-item { justify-content: center; padding: 12px; }
      .channel-hash { font-size: 24px; }
      .main-header { padding: 0 16px; }
      .member-list-panel { display: none; }
      .msg { padding: 8px 16px; }
      .composer-toolbar { flex-direction: column; align-items: stretch; }
    }
`;

let injected = false;

export function injectAppStyles() {
  if (injected) return;
  injected = true;
  const styleEl = document.createElement('style');
  styleEl.textContent = APP_STYLES;
  document.head.appendChild(styleEl);
}
