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
    
    /* Other room effects (shortened for brevity, include them as before) */
    .room-effect-scramble { background: transparent; }
    .main:has(.room-effect-scramble.active) #chat-messages { animation: scrambleScreenShake 0.08s infinite; }
    .main:has(.room-effect-scramble.active) .msg { animation: scrambleMsgGlitch 0.05s infinite; }
    .main:has(.room-effect-scramble.active) .msg-bubble { animation: scrambleTextGlitch 0.1s infinite; filter: blur(0.5px); }
    @keyframes scrambleScreenShake {
      0% { transform: translate(0,0); }
      10% { transform: translate(-2px,1px); }
      20% { transform: translate(2px,-1px); }
      30% { transform: translate(-1px,2px); }
      40% { transform: translate(1px,-2px); }
      50% { transform: translate(-3px,1px); }
      60% { transform: translate(3px,-1px); }
      70% { transform: translate(-1px,3px); }
      80% { transform: translate(1px,-3px); }
      100% { transform: translate(0,0); }
    }
    @keyframes scrambleMsgGlitch {
      0% { transform: translate(0,0); text-shadow: 2px 0 red, -2px 0 blue; }
      50% { transform: translate(1px,-1px); text-shadow: -1px 0 cyan, 1px 0 magenta; }
      100% { transform: translate(0,0); text-shadow: none; }
    }
    @keyframes scrambleTextGlitch {
      0% { letter-spacing: 0; }
      33% { letter-spacing: 1px; }
      66% { letter-spacing: -1px; }
      100% { letter-spacing: 0; }
    }
    .room-effect-embers { background: transparent; }
    .room-effect-embers .room-effect-layer-a {
      background: radial-gradient(circle at 10% 90%, rgba(255,80,20,0.9) 0px, transparent 4px),
                  radial-gradient(circle at 25% 75%, rgba(255,120,30,0.8) 0px, transparent 5px),
                  radial-gradient(circle at 60% 85%, rgba(255,60,10,0.9) 0px, transparent 3px),
                  radial-gradient(circle at 85% 70%, rgba(255,100,20,0.8) 0px, transparent 6px);
      background-size: 250px 250px;
      animation: embersRise 1.2s linear infinite;
      filter: blur(1px);
    }
    .main:has(.room-effect-embers.active) .msg-bubble { color: #ffcc88; text-shadow: 0 0 6px rgba(255,80,0,0.7); }
    @keyframes embersRise {
      0% { background-position: 0% 100%, 10% 100%, 20% 100%, 30% 100%; }
      100% { background-position: 0% -20%, 10% -20%, 20% -20%, 30% -20%; }
    }
    .room-effect-frostbyte { background: transparent; }
    .room-effect-frostbyte .room-effect-layer-a {
      background: linear-gradient(135deg, transparent 0%, rgba(160,220,255,0.5) 30%, transparent 60%),
                  repeating-linear-gradient(45deg, rgba(200,240,255,0.2) 0px, rgba(200,240,255,0.2) 2px, transparent 2px, transparent 8px);
      background-size: 200% 200%, 16px 16px;
      animation: frostSweep 2.5s ease-in-out infinite, frostShimmer 1.5s linear infinite;
    }
    .room-effect-frostbyte .room-effect-layer-b {
      background: radial-gradient(2px 2px at 15% 30%, white 100%, transparent),
                  radial-gradient(3px 3px at 75% 45%, rgba(220,245,255,0.9) 100%, transparent),
                  radial-gradient(2px 2px at 45% 70%, white 100%, transparent),
                  radial-gradient(4px 4px at 85% 85%, rgba(200,235,255,0.8) 100%, transparent);
      background-size: 200px 200px;
      animation: frostSparkle 1.8s ease-in-out infinite;
      opacity: 0.9;
      mix-blend-mode: overlay;
    }
    .main:has(.room-effect-frostbyte.active) .msg-bubble { color: #d0f0ff; text-shadow: 0 0 4px #8ccfff; }
    @keyframes frostSweep {
      0% { background-position: -100% 0, 0 0; }
      100% { background-position: 200% 0, 0 0; }
    }
    @keyframes frostShimmer { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
    @keyframes frostSparkle {
      0% { background-position: 0% 0%; opacity: 0.5; transform: scale(1); }
      50% { background-position: 20% 20%; opacity: 1; transform: scale(1.02); }
      100% { background-position: 0% 0%; opacity: 0.5; transform: scale(1); }
    }
    .room-effect-matrix { background: transparent; }
    .room-effect-matrix .room-effect-layer-a {
      content: "";
      position: absolute;
      top: -50%;
      left: 10%;
      width: 3px;
      height: 200%;
      background: repeating-linear-gradient(180deg, #0f0 0px, #0f0 2px, transparent 2px, transparent 12px);
      box-shadow: 0 0 8px #0f0;
      animation: matrixRain 1.2s linear infinite;
    }
    .room-effect-matrix .room-effect-layer-a::before {
      content: "";
      position: absolute;
      left: 20vw;
      width: 2px;
      height: 100%;
      background: repeating-linear-gradient(180deg, #0f0 0px, #0f0 1px, transparent 1px, transparent 8px);
      animation: matrixRain 0.9s linear infinite reverse;
    }
    .room-effect-matrix .room-effect-layer-a::after {
      content: "";
      position: absolute;
      left: 40vw;
      width: 4px;
      height: 150%;
      background: repeating-linear-gradient(180deg, #0f0 0px, #0f0 3px, transparent 3px, transparent 18px);
      animation: matrixRain 1.5s linear infinite;
    }
    .room-effect-matrix .room-effect-layer-b {
      background: repeating-linear-gradient(0deg, transparent 0px, rgba(0,255,0,0.08) 1px, transparent 2px);
      background-size: 100% 8px;
      animation: matrixScan 1s linear infinite;
    }
    .main:has(.room-effect-matrix.active) .msg-bubble { color: #8eff8e; text-shadow: 0 0 5px #00ff00; font-family: var(--font-mono); }
    @keyframes matrixRain { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
    @keyframes matrixScan { 0% { background-position: 0% 0%; } 100% { background-position: 0% 100%; } }
    .room-effect-starlight { background: transparent; }
    .room-effect-starlight .room-effect-layer-a {
      background: radial-gradient(2px 2px at 15% 25%, white 100%, transparent),
                  radial-gradient(1px 1px at 85% 40%, rgba(255,255,200,0.9) 100%, transparent),
                  radial-gradient(3px 3px at 45% 75%, white 100%, transparent),
                  radial-gradient(2px 2px at 70% 15%, rgba(210,230,255,0.8) 100%, transparent),
                  radial-gradient(1px 1px at 92% 88%, white 100%, transparent);
      background-size: 300px 300px;
      animation: starsTwinkle 2.5s ease-in-out infinite alternate;
    }
    .room-effect-starlight .room-effect-layer-b {
      background: radial-gradient(circle at 50% 50%, rgba(255,255,200,0.1) 0%, transparent 60%);
      animation: starGlow 4s infinite alternate;
    }
    .main:has(.room-effect-starlight.active) .msg-bubble { color: #f2f2ff; text-shadow: 0 0 8px rgba(200,200,255,0.6); }
    @keyframes starsTwinkle {
      0% { opacity: 0.3; background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%; }
      100% { opacity: 1; background-position: 10% 5%, 5% 10%, 8% -2%, -5% 8%, 12% -3%; }
    }
    @keyframes starGlow { 0% { opacity: 0.2; transform: scale(1); } 100% { opacity: 0.6; transform: scale(1.2); } }
    
    /* ===== MODERN CHAT MESSAGES ===== */
    #chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
    }
    .msg {
      display: flex;
      gap: 12px;
      padding: 8px 24px;
      position: relative;
      transition: background 0.15s;
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
    .msg:hover { background: var(--bg-hover); }
    .msg:hover .msg-actions { opacity: 1; }
    .msg-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      background: linear-gradient(135deg, var(--accent), var(--accent-hi));
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }
    .msg.deleted { opacity: 0.5; }
    .msg-body {
      flex: 1;
      min-width: 0;
      padding: 2px 0;
      max-width: min(100%, 920px);
    }
    .msg-head {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 4px;
      flex-wrap: wrap;
    }
    .msg-head strong { font-size: 16px; font-weight: 600; color: var(--text-1); }
    .msg-head > span:last-of-type { font-size: 12px; color: var(--text-3); }
    .msg-bubble {
      font-size: 15px;
      line-height: 1.45;
      color: var(--text-1);
      word-break: break-word;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 8px 14px;
      display: inline-block;
      max-width: 90%;
      box-shadow: var(--shadow-sm);
      transition: all 0.1s;
    }
    .msg:hover .msg-bubble { background: var(--bg-raised); }
    .msg-bubble[class*="effect-"], .effect-preview[class*="effect-"] {
      padding: 8px 14px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-md);
    }
    .msg.system-note {
      gap: 0;
      padding: 4px 24px;
      background: none;
    }
    .msg.system-note .msg-avatar { display: none; }
    .msg.system-note .msg-bubble {
      background: var(--gold-lo);
      border: 1px solid rgba(245,158,11,0.3);
      color: var(--gold);
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      box-shadow: none;
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
    
    /* Responsive */
    @media (max-width: 720px) {
      .sidebar { width: 72px; }
      .sidebar-header { justify-content: center; padding: 0; }
      .sidebar-title, .sidebar-section-label, .channel-item span:not(.channel-hash), .online-pill, .footer-user span:first-child { display: none; }
      .channel-item { justify-content: center; padding: 12px; }
      .channel-hash { font-size: 24px; }
      .main-header { padding: 0 16px; }
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
