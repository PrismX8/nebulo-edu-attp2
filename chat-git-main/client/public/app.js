(() => {
  /* ═══════════════════════════════════════════════════════════════
     INJECT GLOBAL STYLES
  ═══════════════════════════════════════════════════════════════ */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&family=Exo+2:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg-void:       #0a0a0c;
      --bg-base:       #0d0d10;
      --bg-panel:      rgba(16,16,20,0.93);
      --bg-card:       rgba(20,20,26,0.95);
      --bg-raised:     rgba(28,28,36,0.9);
      --bg-hover:      rgba(255,255,255,0.04);
      --bg-input:      rgba(10,10,14,0.98);
      --accent:        #8b8fa8;
      --accent-hi:     #b0b4cc;
      --accent-lo:     rgba(139,143,168,0.1);
      --accent-border: rgba(139,143,168,0.2);
      --blue:          #5b7fa6;
      --blue-lo:       rgba(91,127,166,0.12);
      --blue-border:   rgba(91,127,166,0.22);
      --blue-glow:     rgba(91,127,166,0.3);
      --teal:          #4a8f8a;
      --teal-lo:       rgba(74,143,138,0.1);
      --teal-glow:     rgba(74,143,138,0.3);
      --gold:          #b8955a;
      --gold-lo:       rgba(184,149,90,0.12);
      --gold-glow:     rgba(184,149,90,0.35);
      --danger:        #a05060;
      --danger-lo:     rgba(160,80,96,0.12);
      --danger-glow:   rgba(160,80,96,0.3);
      --success:       #4a9970;
      --success-lo:    rgba(74,153,112,0.1);
      --text-1:        #d8d8e8;
      --text-2:        #7878a0;
      --text-3:        #3e3e58;
      --border:        rgba(255,255,255,0.05);
      --border-md:     rgba(255,255,255,0.08);
      --border-lg:     rgba(255,255,255,0.13);
      --grid-color:    rgba(255,255,255,0.025);
      --radius-sm:4px; --radius-md:8px; --radius-lg:12px; --radius-xl:16px;
      --font-ui:'Exo 2','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;
      --font-head:'Rajdhani','Apple Color Emoji','Segoe UI Emoji',sans-serif;
      --font-mono:'Share Tech Mono','Apple Color Emoji','Segoe UI Emoji',monospace;
    }
    html,body{height:100%;overflow:hidden;font-family:var(--font-ui);background:var(--bg-void);color:var(--text-1);-webkit-font-smoothing:antialiased;}
    #app{height:100%;}
    body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(var(--grid-color) 1px,transparent 1px),linear-gradient(90deg,var(--grid-color) 1px,transparent 1px);background-size:48px 48px;}
    body::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 70% 50% at 20% 100%,rgba(50,50,80,0.1) 0%,transparent 65%),radial-gradient(ellipse 50% 40% at 80% 0%,rgba(40,50,70,0.08) 0%,transparent 60%);}
    #app{position:relative;z-index:1;}
    ::-webkit-scrollbar{width:3px;height:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--border-lg);border-radius:99px;}::-webkit-scrollbar-thumb:hover{background:var(--accent);}
    .shell{display:flex;height:100vh;overflow:hidden;}
    .sidebar{width:232px;background:var(--bg-panel);border-right:1px solid var(--border-md);display:flex;flex-direction:column;flex-shrink:0;backdrop-filter:blur(20px);box-shadow:1px 0 16px rgba(0,0,0,0.4);}
    .sidebar-header{height:52px;padding:0 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border-md);flex-shrink:0;}
    .sidebar-logo{width:28px;height:28px;background:linear-gradient(135deg,#2e3250,#424870);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-size:14px;font-weight:700;color:var(--text-1);flex-shrink:0;border:1px solid var(--border-lg);}
    .sidebar-title{font-family:var(--font-head);font-size:17px;font-weight:700;color:var(--text-1);letter-spacing:0.1em;}
    .sidebar-section-label{font-family:var(--font-mono);font-size:9.5px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-3);padding:14px 16px 6px;}
    .channel-item{margin:1px 8px;padding:7px 10px;border-radius:var(--radius-md);display:flex;align-items:center;gap:8px;cursor:pointer;transition:background 0.12s,color 0.12s,border-color 0.12s;color:var(--text-3);font-size:13.5px;position:relative;user-select:none;border:1px solid transparent;}
    .channel-item:hover{background:var(--bg-hover);color:var(--text-2);border-color:var(--border);}
    .channel-item.active{background:rgba(255,255,255,0.05);color:var(--text-1);border-color:var(--border-lg);}
    .channel-item.active .channel-hash{color:var(--accent-hi);}
    .channel-hash{font-family:var(--font-mono);font-size:13px;color:var(--text-3);flex-shrink:0;}
    .online-pill{display:inline-flex;align-items:center;gap:4px;font-family:var(--font-mono);font-size:9.5px;color:var(--text-3);flex-shrink:0;white-space:nowrap;}
    .online-pill-dot{width:5px;height:5px;border-radius:50%;background:var(--text-3);flex-shrink:0;}
    .online-pill.has-users{color:var(--teal);}
    .online-pill.has-users .online-pill-dot{background:var(--teal);box-shadow:0 0 5px var(--teal-glow);}
    .sidebar-footer{background:rgba(10,10,13,0.9);border-top:1px solid var(--border-md);padding:8px;display:flex;align-items:center;gap:6px;flex-shrink:0;}
    .footer-user{flex:1;min-width:0;display:flex;align-items:center;gap:9px;padding:5px 6px;border-radius:var(--radius-md);cursor:pointer;transition:background 0.12s;border:1px solid transparent;}
    .footer-user:hover{background:var(--bg-hover);border-color:var(--border);}
    .footer-actions{display:flex;gap:1px;flex-shrink:0;}
    .icon-btn{width:30px;height:30px;border-radius:var(--radius-sm);border:none;background:transparent;color:var(--text-3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.12s,color 0.12s;}
    .icon-btn:hover{background:var(--bg-hover);color:var(--text-1);}
    .icon-btn.danger:hover{background:var(--danger-lo);color:var(--danger);}
    .avatar{width:32px;height:32px;border-radius:var(--radius-md);background:linear-gradient(135deg,#2e3250,#424870);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--text-1);flex-shrink:0;text-transform:uppercase;font-family:var(--font-head);border:1px solid var(--border-lg);}
    .avatar.sm{width:26px;height:26px;font-size:11px;border-radius:var(--radius-sm);}
    .status-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .status-online{background:var(--success);box-shadow:0 0 6px var(--teal-glow);}
    .main{flex:1;min-width:0;display:flex;flex-direction:column;background:var(--bg-base);position:relative;}
    .main-header{min-height:64px;padding:12px 20px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border-md);flex-shrink:0;background:linear-gradient(180deg,rgba(18,18,24,0.98),rgba(12,12,16,0.92));backdrop-filter:blur(20px);z-index:10;box-shadow:0 1px 0 var(--border-md),0 10px 32px rgba(0,0,0,0.35);}
    .main-header-hash{font-family:var(--font-mono);font-size:15px;color:var(--accent);}
    .main-header h2{font-family:var(--font-head);font-size:16px;font-weight:600;color:var(--text-1);letter-spacing:0.06em;}
    .header-online{font-family:var(--font-mono);font-size:10.5px;color:var(--text-3);display:flex;align-items:center;gap:6px;margin-left:auto;}
    .header-online::before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--text-3);}
    .header-online.has-users{color:var(--teal);}
    .header-online.has-users::before{background:var(--teal);box-shadow:0 0 5px var(--teal-glow);}
    .main-header-meta{display:flex;flex-direction:column;gap:3px;min-width:0;}
    .main-header-sub{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-family:var(--font-mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-3);}
    .room-effect-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid var(--border-md);color:var(--text-2);}
    .room-effect-chip strong{font-family:var(--font-head);font-size:12px;letter-spacing:0.08em;color:var(--text-1);}
    #chat-messages{flex:1;overflow-y:auto;padding:18px 14px 10px;display:flex;flex-direction:column;gap:8px;}
    .msg{display:flex;gap:12px;padding:10px 12px;position:relative;transition:background 0.12s,border-color 0.12s,transform 0.12s;animation:msgIn 0.18s ease;border:1px solid transparent;border-radius:18px;}
    @keyframes msgIn{from{opacity:0;transform:translateY(3px);}to{opacity:1;transform:translateY(0);}}
    .msg:hover{background:rgba(255,255,255,0.018);border-color:rgba(255,255,255,0.05);transform:translateY(-1px);}
    .msg:hover .msg-actions{opacity:1;}
    .msg-avatar{width:36px;height:36px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-size:15px;font-weight:700;color:var(--text-1);flex-shrink:0;margin-top:2px;text-transform:uppercase;background:linear-gradient(135deg,#252840,#363c60);border:1px solid var(--border-lg);}
    .msg.deleted{opacity:0.35;}
    .msg.system-note{gap:0;padding:0;background:none;border:none;transform:none;}
    .msg.system-note:hover{background:none;border:none;transform:none;}
    .msg.system-note .msg-avatar{display:none;}
    .msg-body{flex:1;min-width:0;padding:2px 0;}
    .msg-head{display:flex;align-items:center;gap:8px;margin-bottom:3px;}
    .msg-head strong{font-family:var(--font-head);font-size:14px;font-weight:600;color:var(--text-1);letter-spacing:0.04em;}
    .msg.mine .msg-head strong{color:var(--accent-hi);}
    .msg-head > span:last-of-type{font-family:var(--font-mono);font-size:10px;color:var(--text-3);}
    .msg-bubble{font-size:14px;line-height:1.6;color:var(--text-2);word-break:break-word;font-family:var(--font-ui),'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.04);border-radius:16px;padding:10px 12px;}
    .msg:hover .msg-bubble{color:var(--text-1);}
    .msg-bubble[class*="effect-"],.effect-preview[class*="effect-"]{display:inline-block;max-width:min(100%,920px);padding:6px 11px;border-radius:12px;border:1px solid transparent;position:relative;overflow:hidden;}
    .msg.system-note .msg-body{width:100%;}
    .msg.system-note .msg-head{margin:0;}
    .msg.system-note .msg-name{color:var(--gold);}
    .msg.system-note .msg-bubble{display:block;background:linear-gradient(135deg,rgba(184,149,90,0.1),rgba(88,116,174,0.06));border:1px solid rgba(184,149,90,0.16);font-family:var(--font-mono);font-size:12px;letter-spacing:0.03em;color:var(--text-1);}
    .msg-bubble.effect-flashbands,.effect-preview.effect-flashbands{background:linear-gradient(135deg,rgba(105,145,205,0.14),rgba(130,215,255,0.08));border-color:rgba(130,215,255,0.18);box-shadow:0 0 0 1px rgba(130,215,255,0.05),0 0 18px rgba(91,127,166,0.12);}
    .msg-bubble.effect-flashbands::after,.effect-preview.effect-flashbands::after{content:'';position:absolute;inset:-20% -60%;background:repeating-linear-gradient(180deg,transparent 0 11px,rgba(170,220,255,0.14) 11px 15px,transparent 15px 26px);transform:translateX(-28%);mix-blend-mode:screen;animation:flashbandsSweep 2.8s linear infinite;}
    .msg-bubble.effect-scramble,.effect-preview.effect-scramble{background:linear-gradient(135deg,rgba(120,72,160,0.14),rgba(52,85,170,0.08));border-color:rgba(160,120,255,0.18);text-shadow:1px 0 rgba(255,60,160,0.28),-1px 0 rgba(80,200,255,0.24);animation:scrambleShift 0.18s steps(2,end) infinite;}
    .msg-bubble.effect-embers,.effect-preview.effect-embers{background:linear-gradient(135deg,rgba(176,83,38,0.18),rgba(255,186,82,0.08));border-color:rgba(255,168,73,0.22);box-shadow:0 0 18px rgba(255,120,60,0.08);animation:embersPulse 2.2s ease-in-out infinite;}
    .msg-bubble.effect-frostbyte,.effect-preview.effect-frostbyte{background:linear-gradient(135deg,rgba(110,160,210,0.16),rgba(215,240,255,0.08));border-color:rgba(170,220,255,0.24);box-shadow:0 0 20px rgba(140,205,255,0.09);}
    .msg-bubble.effect-frostbyte::after,.effect-preview.effect-frostbyte::after{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent);transform:translateX(-120%);animation:frostbyteSweep 3.1s ease-in-out infinite;}
    .msg-bubble.effect-matrix,.effect-preview.effect-matrix{background:linear-gradient(135deg,rgba(42,110,76,0.2),rgba(15,40,22,0.16));border-color:rgba(92,210,132,0.2);color:#b9ffd2;box-shadow:0 0 18px rgba(84,255,138,0.08);animation:matrixFlicker 2.6s linear infinite;}
    .msg-bubble.effect-starlight,.effect-preview.effect-starlight{background:linear-gradient(135deg,rgba(84,96,168,0.16),rgba(210,220,255,0.08));border-color:rgba(200,216,255,0.22);box-shadow:0 0 18px rgba(180,195,255,0.1);animation:starlightGlow 2.8s ease-in-out infinite;}
    .msg-name.effect-flashbands,.msg-name.effect-frostbyte,.msg-name.effect-starlight{color:#e8f4ff;}
    .msg-name.effect-scramble{color:#f0d6ff;text-shadow:1px 0 rgba(255,60,160,0.3),-1px 0 rgba(80,200,255,0.28);}
    .msg-name.effect-embers{color:#ffd2a2;}
    .msg-name.effect-matrix{color:#86ffab;}
    @keyframes flashbandsSweep{from{transform:translateX(-30%);}to{transform:translateX(30%);}}
    @keyframes scrambleShift{0%{transform:translate(0,0);}33%{transform:translate(0.4px,-0.4px);}66%{transform:translate(-0.4px,0.4px);}100%{transform:translate(0,0);}}
    @keyframes embersPulse{0%,100%{box-shadow:0 0 14px rgba(255,120,60,0.08);}50%{box-shadow:0 0 24px rgba(255,120,60,0.18);}}
    @keyframes frostbyteSweep{0%,15%{transform:translateX(-120%);}50%{transform:translateX(120%);}100%{transform:translateX(120%);}}
    @keyframes matrixFlicker{0%,100%{opacity:0.94;}10%{opacity:0.88;}12%{opacity:1;}54%{opacity:0.9;}56%{opacity:0.98;}}
    @keyframes starlightGlow{0%,100%{box-shadow:0 0 12px rgba(180,195,255,0.08);}50%{box-shadow:0 0 24px rgba(180,195,255,0.18);}}
    .msg-actions{display:flex;align-items:center;gap:6px;margin-top:4px;opacity:0;transition:opacity 0.15s;}
    .rank-chip{display:inline-flex;align-items:center;font-family:var(--font-mono);font-size:9px;letter-spacing:0.14em;text-transform:uppercase;padding:2px 7px;border-radius:3px;line-height:1;position:relative;top:-1px;}
    .rank-owner{background:var(--gold-lo);color:var(--gold);border:1px solid rgba(184,149,90,0.28);}
    .rank-owner::before{content:'◈ ';}
    .rank-admin{background:var(--blue-lo);color:var(--blue);border:1px solid var(--blue-border);}
    .rank-admin::before{content:'◆ ';}
    .delete-btn{background:transparent;border:none;cursor:pointer;font-family:var(--font-mono);font-size:10.5px;color:var(--text-3);padding:2px 8px;border-radius:var(--radius-sm);transition:background 0.12s,color 0.12s;}
    .delete-btn:hover{background:var(--danger-lo);color:var(--danger);}
    .composer{border-top:1px solid var(--border-md);padding:12px 16px 16px;flex-shrink:0;background:linear-gradient(180deg,rgba(14,14,18,0.94),rgba(10,10,14,0.98));backdrop-filter:blur(20px);}
    .composer-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 2px 10px;}
    .composer-toolbar-copy{display:flex;flex-direction:column;gap:3px;min-width:0;}
    .composer-toolbar-title{font-family:var(--font-head);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-1);}
    .composer-toolbar-meta{font-family:var(--font-mono);font-size:10px;color:var(--text-3);}
    .composer-room-effect{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,0.04);border:1px solid var(--border-md);font-family:var(--font-mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-2);}
    #command-panel{background:var(--bg-card);border:1px solid var(--border-md);border-radius:var(--radius-lg);margin-bottom:8px;padding:4px;box-shadow:0 -4px 24px rgba(0,0,0,0.5);backdrop-filter:blur(16px);}
    .cmd-item{width:100%;text-align:left;padding:7px 10px;border-radius:var(--radius-sm);display:flex;align-items:baseline;gap:10px;cursor:pointer;background:transparent;border:none;transition:background 0.1s;}
    .cmd-item:hover{background:var(--bg-hover);}
    .cmd-usage{font-family:var(--font-mono);font-size:12px;color:var(--accent-hi);flex-shrink:0;}
    .cmd-desc{font-size:12px;color:var(--text-3);}
    #composer-notice{font-size:12px;padding:0 2px 6px;animation:noticeIn 0.15s ease;}
    @keyframes noticeIn{from{opacity:0;}to{opacity:1;}}
    .notice-success{color:var(--success);}
    .notice-error{color:var(--danger);}
    .hidden{display:none!important;}
    .composer-box{background:var(--bg-card);border:1px solid var(--border-md);border-radius:var(--radius-lg);transition:border-color 0.2s;overflow:visible;position:relative;z-index:5;}
    .composer-box:focus-within{border-color:var(--border-lg);}
    .composer-form{display:flex;align-items:flex-end;padding:12px 12px 12px 16px;gap:8px;}
    .composer-textarea{flex:1;background:transparent;border:none;outline:none;resize:none;font-family:var(--font-ui),'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;font-size:14px;color:var(--text-1);line-height:1.55;max-height:180px;overflow-y:auto;padding:2px 0;unicode-bidi:plaintext;caret-color:var(--accent-hi);}
    .composer-textarea::placeholder{color:var(--text-3);}
    .composer-send{width:30px;height:30px;border-radius:var(--radius-sm);background:transparent;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text-3);transition:color 0.15s,background 0.15s;margin-bottom:1px;}
    .composer-send:hover{color:var(--text-1);background:var(--bg-hover);}
    .composer-send:active{transform:scale(0.94);}
    .composer-emoji-btn,.composer-effect-btn{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;line-height:1;transition:background 0.15s,transform 0.1s,border-color 0.15s,color 0.15s;margin-bottom:1px;position:relative;color:var(--text-2);}
    .composer-emoji-btn:hover,.composer-effect-btn:hover{background:var(--bg-hover);transform:translateY(-1px);border-color:var(--border-md);color:var(--text-1);}
    .emoji-picker-popover{position:absolute;bottom:calc(100% + 8px);right:0;background:var(--bg-card);border:1px solid var(--border-md);border-radius:var(--radius-lg);padding:10px;box-shadow:0 -4px 32px rgba(0,0,0,0.7);z-index:50;width:300px;max-height:260px;overflow-y:auto;backdrop-filter:blur(20px);}
    .effects-picker-popover{position:absolute;bottom:calc(100% + 8px);right:0;background:var(--bg-card);border:1px solid var(--border-md);border-radius:16px;padding:12px;box-shadow:0 -8px 36px rgba(0,0,0,0.7);z-index:60;width:min(360px,calc(100vw - 32px));max-height:340px;overflow-y:auto;backdrop-filter:blur(20px);}
    .effects-picker-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;}
    .effects-picker-head strong{font-family:var(--font-head);font-size:15px;letter-spacing:0.08em;color:var(--text-1);}
    .effects-picker-head span{display:block;font-family:var(--font-mono);font-size:10px;color:var(--text-3);margin-top:4px;}
    .effects-picker-grid{display:flex;flex-direction:column;gap:10px;}
    .effects-picker-card{background:rgba(255,255,255,0.02);border:1px solid var(--border-md);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:9px;}
    .effects-picker-card.active{border-color:var(--accent-border);box-shadow:0 0 0 1px rgba(176,180,204,0.05);}
    .effects-picker-line{display:flex;align-items:center;justify-content:space-between;gap:12px;}
    .effects-picker-name{font-family:var(--font-head);font-size:14px;letter-spacing:0.05em;color:var(--text-1);}
    .effects-picker-price{font-family:var(--font-mono);font-size:10px;letter-spacing:0.08em;color:var(--gold);}
    .effects-picker-desc{font-size:12px;line-height:1.5;color:var(--text-2);}
    .effects-picker-trigger{font-family:var(--font-mono);font-size:10px;color:var(--text-3);}
    .emoji-picker-search{width:100%;background:var(--bg-raised);border:1px solid var(--border-md);border-radius:var(--radius-md);padding:7px 10px;font-size:13px;color:var(--text-1);outline:none;margin-bottom:8px;font-family:var(--font-mono);}
    .emoji-picker-search:focus{border-color:var(--border-lg);}
    .emoji-picker-search::placeholder{color:var(--text-3);}
    .emoji-section-label{font-family:var(--font-mono);font-size:9.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-3);padding:4px 2px 6px;}
    .emoji-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:1px;margin-bottom:6px;}
    .emoji-btn{width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:19px;background:transparent;border:none;border-radius:var(--radius-sm);cursor:pointer;transition:background 0.1s,transform 0.1s;line-height:1;}
    .emoji-btn:hover{background:var(--bg-hover);transform:scale(1.15);}
    .composer-hint{padding:0 16px 8px;font-size:10.5px;color:var(--text-3);font-family:var(--font-mono);letter-spacing:0.04em;}
    #jump-to-latest{position:absolute;bottom:90px;right:20px;background:var(--bg-raised);color:var(--text-1);border:1px solid var(--border-lg);border-radius:99px;padding:7px 14px;font-family:var(--font-head);font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 4px 16px rgba(0,0,0,0.5);transition:transform 0.15s,background 0.15s;z-index:20;}
    #jump-to-latest:hover{transform:translateY(-2px);background:var(--bg-card);}
    .auth-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden;}
    .auth-card{background:var(--bg-card);border:1px solid var(--border-md);border-radius:var(--radius-xl);width:100%;max-width:380px;padding:36px 32px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,0.7),0 0 0 1px var(--border);backdrop-filter:blur(24px);animation:authIn 0.4s cubic-bezier(0.16,1,0.3,1);}
    @keyframes authIn{from{opacity:0;transform:translateY(20px) scale(0.97);}to{opacity:1;transform:translateY(0) scale(1);}}
    .auth-logo{width:46px;height:46px;background:linear-gradient(135deg,#2e3250,#424870);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-family:var(--font-head);font-size:22px;font-weight:700;color:var(--text-1);margin:0 auto 22px;border:1px solid var(--border-lg);}
    .auth-card h2{font-family:var(--font-head);font-size:24px;font-weight:700;text-align:center;color:var(--text-1);margin-bottom:6px;letter-spacing:0.08em;}
    .auth-subtitle{font-size:13px;text-align:center;color:var(--text-3);margin-bottom:28px;font-family:var(--font-mono);}
    .auth-link{color:var(--accent-hi);text-decoration:none;}
    .auth-link:hover{text-decoration:underline;}
    .field{display:flex;flex-direction:column;gap:6px;}
    .field label{font-family:var(--font-mono);font-size:10.5px;color:var(--text-3);letter-spacing:0.12em;text-transform:uppercase;}
    .inp{background:var(--bg-input);border:1px solid var(--border-md);border-radius:var(--radius-md);color:var(--text-1);padding:10px 14px;font-family:var(--font-ui);font-size:14px;outline:none;transition:border-color 0.2s;width:100%;caret-color:var(--accent-hi);}
    .inp:focus{border-color:var(--border-lg);}
    .inp::placeholder{color:var(--text-3);}
    textarea.inp{resize:none;}
    .btn{font-family:var(--font-head);font-size:13.5px;font-weight:700;letter-spacing:0.1em;border:none;border-radius:var(--radius-md);padding:10px 18px;cursor:pointer;transition:all 0.15s;display:inline-flex;align-items:center;justify-content:center;gap:6px;text-transform:uppercase;}
    .btn:active{transform:scale(0.97);}
    .btn:disabled{opacity:0.4;cursor:not-allowed;}
    .btn-primary{background:var(--bg-raised);color:var(--text-1);border:1px solid var(--border-lg);}
    .btn-primary:hover:not(:disabled){background:rgba(255,255,255,0.07);border-color:var(--accent-border);color:var(--accent-hi);}
    .btn-danger{background:var(--danger-lo);color:var(--danger);border:1px solid rgba(160,80,96,0.22);}
    .btn-danger:hover:not(:disabled){background:rgba(160,80,96,0.2);}
    .btn-ghost{background:transparent;color:var(--text-2);border:1px solid var(--border-md);}
    .btn-ghost:hover:not(:disabled){background:var(--bg-hover);color:var(--text-1);border-color:var(--border-lg);}
    .btn-full{width:100%;}
    .btn-sm{padding:6px 12px;font-size:11.5px;border-radius:var(--radius-sm);}
    .banner{padding:10px 14px;border-radius:var(--radius-md);font-size:13px;}
    .banner-error{background:var(--danger-lo);color:var(--danger);border:1px solid rgba(160,80,96,0.2);}
    .banner-success{background:var(--success-lo);color:var(--success);border:1px solid rgba(74,153,112,0.2);}
    .page-scroll{flex:1;overflow-y:auto;padding:28px;}
    .page-inner{max-width:680px;margin:0 auto;display:flex;flex-direction:column;gap:16px;}
    .card{background:var(--bg-card);border:1px solid var(--border-md);border-radius:var(--radius-xl);padding:24px;backdrop-filter:blur(12px);}
    .card-title{font-family:var(--font-head);font-size:15px;font-weight:700;color:var(--text-1);margin-bottom:16px;letter-spacing:0.08em;text-transform:uppercase;}
    .form-stack{display:flex;flex-direction:column;gap:12px;}
    .data-table{width:100%;border-collapse:collapse;font-size:13.5px;}
    .data-table thead tr{border-bottom:1px solid var(--border-md);}
    .data-table th{text-align:left;padding:0 12px 10px 0;font-family:var(--font-mono);font-size:10px;color:var(--text-3);letter-spacing:0.12em;text-transform:uppercase;}
    .data-table td{padding:10px 12px 10px 0;color:var(--text-2);border-bottom:1px solid var(--border);vertical-align:middle;}
    .data-table tr:last-child td{border-bottom:none;}
    .role-badge{display:inline-block;font-family:var(--font-mono);font-size:9.5px;letter-spacing:0.1em;text-transform:uppercase;padding:3px 8px;border-radius:3px;}
    .role-owner{background:var(--gold-lo);color:var(--gold);border:1px solid rgba(184,149,90,0.25);}
    .role-admin{background:var(--blue-lo);color:var(--blue);border:1px solid var(--blue-border);}
    .role-user{background:var(--bg-raised);color:var(--text-3);border:1px solid var(--border-md);}
    .code-block{background:rgba(5,5,8,0.9);border:1px solid var(--border-md);border-radius:var(--radius-md);padding:14px 16px;font-family:var(--font-mono);font-size:11.5px;color:var(--text-2);overflow-x:auto;white-space:pre-wrap;word-break:break-word;line-height:1.6;}
    .status-line{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:11.5px;color:var(--text-2);padding:6px 12px;background:var(--bg-raised);border-radius:var(--radius-md);border:1px solid var(--border-md);}
    .btn-bar{display:flex;gap:8px;flex-wrap:wrap;}
    .msg-state{display:flex;align-items:center;justify-content:center;flex:1;color:var(--text-3);font-family:var(--font-mono);font-size:13px;padding:40px;gap:10px;letter-spacing:0.04em;}
    .coin-chip{display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border-radius:999px;background:var(--gold-lo);border:1px solid rgba(184,149,90,0.22);color:var(--gold);font-family:var(--font-mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;}
    .settings-balance{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;background:var(--bg-raised);border-radius:var(--radius-lg);border:1px solid var(--border-md);}
    .settings-balance strong{font-family:var(--font-head);font-size:18px;letter-spacing:0.08em;color:var(--text-1);}
    .effect-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;}
    .effect-card{background:rgba(14,14,18,0.94);border:1px solid var(--border-md);border-radius:var(--radius-lg);padding:14px;display:flex;flex-direction:column;gap:10px;min-height:180px;}
    .effect-card.owned{border-color:rgba(184,149,90,0.16);}
    .effect-card.active{border-color:var(--accent-border);box-shadow:0 0 0 1px rgba(176,180,204,0.06);}
    .effect-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}
    .effect-card-title{font-family:var(--font-head);font-size:16px;letter-spacing:0.06em;color:var(--text-1);}
    .effect-price{font-family:var(--font-mono);font-size:11px;color:var(--gold);}
    .effect-desc{font-size:12.5px;color:var(--text-2);line-height:1.5;}
    .effect-preview{display:block;font-size:13px;line-height:1.55;color:var(--text-1);padding:10px 12px;border-radius:12px;border:1px solid var(--border-md);background:rgba(255,255,255,0.02);}
    .effect-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-family:var(--font-mono);font-size:10px;color:var(--text-3);letter-spacing:0.08em;text-transform:uppercase;}
    #toast-host{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;}
    .toast-anim{background:var(--bg-card);border:1px solid var(--border-lg);color:var(--text-1);padding:12px 18px;border-radius:var(--radius-lg);font-size:13px;font-family:var(--font-ui);box-shadow:0 4px 20px rgba(0,0,0,0.6);animation:toastIn 0.3s cubic-bezier(0.16,1,0.3,1),toastOut 0.3s 2.3s ease forwards;pointer-events:auto;backdrop-filter:blur(16px);}
    @keyframes toastIn{from{opacity:0;transform:translateX(16px) scale(0.95);}to{opacity:1;transform:translateX(0) scale(1);}}
    @keyframes toastOut{from{opacity:1;}to{opacity:0;transform:translateX(12px);}}
    .mention{color:var(--blue);font-weight:600;}
    #mention-notification{position:fixed;top:12px;left:50%;transform:translateX(-50%);background:var(--bg-card);border:1px solid var(--border-lg);border-radius:var(--radius-lg);padding:10px 18px;z-index:10000;display:flex;align-items:center;gap:12px;cursor:pointer;box-shadow:0 8px 32px rgba(0,0,0,0.6);max-width:90%;width:fit-content;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13.5px;}
    #mention-notification:hover{background:var(--bg-raised);border-color:var(--accent-border);}
    #mention-notification-close{cursor:pointer;padding:4px;color:var(--text-3);font-size:12px;transition:color 0.15s;}
    #mention-notification-close:hover{color:var(--text-1);}
    @media (max-width: 720px){
      .main-header{padding:12px 14px;align-items:flex-start;flex-direction:column;}
      .header-online{margin-left:0;}
      #chat-messages{padding:14px 10px 8px;}
      .msg{padding:9px 10px;}
      .composer-toolbar{flex-direction:column;align-items:flex-start;}
      .composer-form{padding:10px 10px 10px 12px;}
    }
  `;
  document.head.appendChild(styleEl);

  /* ═══════════════════════════════════════════════════════════════
     TOAST HOST
  ═══════════════════════════════════════════════════════════════ */
  const toastHost = document.createElement('div');
  toastHost.id = 'toast-host';
  document.body.appendChild(toastHost);

  /* ═══════════════════════════════════════════════════════════════
     STATE
  ═══════════════════════════════════════════════════════════════ */
  const app = document.getElementById('app');

  const state = {
    token: localStorage.getItem('token') || '',
    user: null,
    channels: [],
    currentChannel: null,
    messages: [],
    pollTimer: null,
    metaTimer: null,
    bannedMessage: '',
    autoFollow: true,
    showJumpToLatest: false,
    lastMessagesSignature: '',
    composerNoticeTimer: null,
    joinPromise: null,
    joinRoomKey: '',
    messagesPromise: null,
    messagesRoomKey: '',
    presencePromise: null,
    alertsPromise: null,
    roomEffect: null,
    routeNonce: 0
  };

  const slashCommands = [
    { cmd: '/help',       usage: '/help',                         desc: 'Show available commands',           roles: ['user', 'admin', 'owner'] },
    { cmd: '/ai',         usage: '/ai <siteId> <prompt>',         desc: 'Ask site AI to generate a reply',   roles: ['user', 'admin', 'owner'] },
    { cmd: '/warn',       usage: '/warn <target> <reason>',       desc: 'Warn a user',                       roles: ['admin', 'owner'] },
    { cmd: '/ban',        usage: '/ban <target> <reason>',        desc: 'Ban a user from this server',       roles: ['admin', 'owner'] },
    { cmd: '/banfromall', usage: '/banfromall <target> <reason>', desc: 'Global ban across all servers',     roles: ['owner'] },
    { cmd: '/unban',      usage: '/unban <target>',               desc: 'Unban a user',                      roles: ['admin', 'owner'] },
    { cmd: '/clearwarns', usage: '/clearwarns <target>',          desc: 'Reset warning count',               roles: ['admin', 'owner'] },
    { cmd: '/clearchat',  usage: '/clearchat [reason]',           desc: 'Clear room messages',               roles: ['owner'] }
  ];

  const fallbackEffects = [
    { id: 'none',       name: 'None',       price: 0,  description: 'No message effect.' },
    { id: 'flashbands', name: 'Flashbands', price: 6,  description: 'Cold scan-lines sweep across your messages.' },
    { id: 'scramble',   name: 'Scramble',   price: 8,  description: 'Glitchy jitter with broken neon shadows.' },
    { id: 'embers',     name: 'Embers',     price: 9,  description: 'A hot orange glow with pulsing heat.' },
    { id: 'frostbyte',  name: 'Frostbyte',  price: 10, description: 'Icy highlights and a pale blue shimmer.' },
    { id: 'matrix',     name: 'Matrix',     price: 12, description: 'Green terminal glow with digital flicker.' },
    { id: 'starlight',  name: 'Starlight',  price: 14, description: 'Soft cosmic shimmer with a brighter edge.' }
  ];

  /* ═══════════════════════════════════════════════════════════════
     UTILITIES
  ═══════════════════════════════════════════════════════════════ */
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(v);
    return div.innerHTML;
  };

  const normalizeEffectId = (value) => {
    const clean = String(value || 'none').trim().toLowerCase();
    return fallbackEffects.some((effect) => effect.id === clean) ? clean : 'none';
  };

  const getEffectMeta = (effectId) =>
    fallbackEffects.find((effect) => effect.id === normalizeEffectId(effectId)) || fallbackEffects[0];

  const getRoomEffectMeta = () => {
    const effectId = normalizeEffectId(state.roomEffect?.effectId);
    return getEffectMeta(effectId);
  };

  const getActiveRoomEffectId = () => normalizeEffectId(state.roomEffect?.effectId);

  const getMessageEffect = (message) => {
    const roomEffectId = normalizeEffectId(message?.roomEffect?.effectId || state.roomEffect?.effectId);
    if (roomEffectId !== 'none') return roomEffectId;
    return normalizeEffectId(message?.equippedEffect || message?.sender?.equippedEffect || 'none');
  };

  const setRoomEffectState = (roomEffect) => {
    const normalizedId = normalizeEffectId(roomEffect?.effectId);
    state.roomEffect = normalizedId === 'none'
      ? null
      : { ...roomEffect, effectId: normalizedId };
    updateCoinDisplays();
    return state.roomEffect;
  };

  const applyUserSnapshot = (user) => {
    state.user = user || null;
    updateCoinDisplays();
    return state.user;
  };

  const updateCoinDisplays = () => {
    const coins = Math.max(0, Number(state.user?.coins || 0));
    const label = `${coins} coin${coins === 1 ? '' : 's'}`;
    const sidebarCoins = document.getElementById('sidebar-coins');
    if (sidebarCoins) sidebarCoins.textContent = label;
    const settingsCoins = document.getElementById('settings-coins-balance');
    if (settingsCoins) settingsCoins.textContent = label;
    const settingsEffect = document.getElementById('settings-equipped-effect');
    if (settingsEffect) settingsEffect.textContent = getEffectMeta(state.user?.equippedEffect).name;
    const roomCoins = document.getElementById('room-effects-balance');
    if (roomCoins) roomCoins.textContent = label;
    const headerRoomEffect = document.getElementById('header-room-effect');
    if (headerRoomEffect) {
      headerRoomEffect.textContent = getActiveRoomEffectId() === 'none' ? 'No room effect' : `${getRoomEffectMeta().name} live`;
    }
    const composerRoomEffect = document.getElementById('composer-room-effect');
    if (composerRoomEffect) {
      composerRoomEffect.textContent = getActiveRoomEffectId() === 'none'
        ? 'No room effect active'
        : `${getRoomEffectMeta().name} active for this room`;
    }
  };

  const getHashPath  = () => (window.location.hash || '#/').replace(/^#/, '') || '/';
  const isPublicRoute = (path) => path.startsWith('/login') || path.startsWith('/register');

  const setToken = (token) => {
    state.token = token || '';
    if (state.token) localStorage.setItem('token', state.token);
    else localStorage.removeItem('token');
  };

  const getTlkClientId = () => {
    let id = localStorage.getItem('tlkClientId');
    if (!id) { id = `client_${Math.random().toString(36).slice(2)}_${Date.now()}`; localStorage.setItem('tlkClientId', id); }
    return id;
  };

  const getChatDeviceId = () => {
    let id = localStorage.getItem('chatDeviceId');
    if (!id) { id = `dev_${Math.random().toString(36).slice(2)}_${Date.now()}`; localStorage.setItem('chatDeviceId', id); }
    return id;
  };

  const parseError = async (res, fallback) => {
    try {
      const data = await res.json();
      if (data?.msg) return data.msg;
      if (Array.isArray(data?.errors) && data.errors.length) return data.errors.map((e) => e?.msg).filter(Boolean).join(', ');
      return fallback;
    } catch { return fallback; }
  };

  const api = async (url, options = {}) => {
    const headers = Object.assign({}, options.headers || {});
    if (state.token) headers['x-auth-token'] = state.token;
    const isFormData = options.body instanceof FormData;
    if (!isFormData && !headers['Content-Type'] && options.body && typeof options.body === 'object') headers['Content-Type'] = 'application/json';

    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: isFormData
        ? options.body
        : (headers['Content-Type'] === 'application/json' && options.body && typeof options.body === 'object')
          ? JSON.stringify(options.body)
          : options.body
    });

    if (!res.ok) {
      const err = new Error(await parseError(res, `Request failed (${res.status})`));
      err.status = res.status;
      throw err;
    }

    const text = await res.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return text; }
  };

  const getMessagesSignature = (messages) => {
    const list = Array.isArray(messages) ? messages : [];
    return list.map((m) => [
      String(m?.id || m?._id || ''), String(m?.date || ''), String(m?.timestamp || ''),
      String(m?.body || m?.content || ''), m?.deleted ? '1' : '0', String(m?.roomEffect?.effectId || '')
    ].join('|')).join('||');
  };

  const navigate = (path) => { window.location.hash = `#${path}`; };

  const getAllowedSlashCommands = () => {
    const role = String(state.user?.role || 'user').toLowerCase();
    return slashCommands.filter((item) => item.roles.includes(role || 'user'));
  };

  /* ═══════════════════════════════════════════════════════════════
     UI HELPERS
  ═══════════════════════════════════════════════════════════════ */
  const renderCommandPanel = (rawValue) => {
    const panel = document.getElementById('command-panel');
    const input = document.getElementById('chat-input');
    if (!panel || !input) return;

    const value = String(rawValue || '').trimStart();
    if (!value.startsWith('/')) { panel.classList.add('hidden'); panel.innerHTML = ''; return; }

    const token = String(value.split(/\s+/)[0] || '/').toLowerCase();
    const items = getAllowedSlashCommands()
      .filter((item) => token === '/' || item.cmd.startsWith(token))
      .slice(0, 8);

    if (!items.length) { panel.classList.add('hidden'); panel.innerHTML = ''; return; }

    panel.innerHTML = items.map((item) => `
      <button class="cmd-item" type="button" data-cmd="${esc(item.cmd)}" data-usage="${esc(item.usage)}">
        <span class="cmd-usage">${esc(item.usage)}</span>
        <span class="cmd-desc">${esc(item.desc)}</span>
      </button>
    `).join('');
    panel.classList.remove('hidden');

    panel.querySelectorAll('[data-cmd]').forEach((el) => {
      el.addEventListener('click', () => {
        const usage = String(el.getAttribute('data-usage') || '').trim();
        if (!usage) return;
        const bareCmd = usage.split(/\s+/)[0] || usage;
        input.value = usage.includes('<') || usage.includes('[') ? `${bareCmd} ` : `${usage} `;
        input.focus();
        renderCommandPanel(input.value);
      });
    });
  };

  const getChatRoot       = () => document.getElementById('chat-messages');
  const isNearBottom      = (el, threshold = 24) => !el || (el.scrollHeight - el.scrollTop - el.clientHeight) <= threshold;

  const setJumpToLatestVisible = (visible) => {
    state.showJumpToLatest = !!visible;
    const btn = document.getElementById('jump-to-latest');
    if (!btn) return;
    btn.classList.toggle('hidden', !state.showJumpToLatest);
  };

  const showComposerNotice = (message, kind = 'success', durationMs = 3200) => {
    const box = document.getElementById('composer-notice');
    if (!box) return;
    box.textContent = String(message || '');
    box.classList.remove('hidden', 'notice-error', 'notice-success');
    box.classList.add(kind === 'error' ? 'notice-error' : 'notice-success');
    if (state.composerNoticeTimer) { clearTimeout(state.composerNoticeTimer); state.composerNoticeTimer = null; }
    if (durationMs > 0) state.composerNoticeTimer = setTimeout(() => { box.classList.add('hidden'); }, Number(durationMs));
  };

  const scrollChatToBottom = (behavior = 'auto') => {
    const root = getChatRoot();
    if (!root) return;
    root.scrollTo({ top: root.scrollHeight, behavior });
  };

  const syncAutoFollowFromScroll = () => {
    const root = getChatRoot();
    if (!root) return;
    state.autoFollow = isNearBottom(root);
    setJumpToLatestVisible(!state.autoFollow);
  };

  const cleanupChatTimers = () => {
    if (state.pollTimer)           { clearInterval(state.pollTimer);          state.pollTimer = null; }
    if (state.metaTimer)           { clearInterval(state.metaTimer);          state.metaTimer = null; }
    if (state.composerNoticeTimer) { clearTimeout(state.composerNoticeTimer); state.composerNoticeTimer = null; }
  };

  const showToast = (message) => {
    const div = document.createElement('div');
    div.className = 'toast-anim';
    div.textContent = message;
    toastHost.appendChild(div);
    setTimeout(() => div.remove(), 2800);
  };

  /* ═══════════════════════════════════════════════════════════════
     DATA
  ═══════════════════════════════════════════════════════════════ */
  const loadUser = async () => {
    if (!state.token) { applyUserSnapshot(null); return null; }
    try { return applyUserSnapshot(await api('/api/auth')); }
    catch { setToken(''); applyUserSnapshot(null); return null; }
  };

  const mapChannels = (networkData) => {
    const sites      = networkData?.sites || [];
    const globalRoom = networkData?.globalRoom || 'nebulo5_4';
    return [
      { _id: 'global', room: globalRoom, name: '#global', type: 'public', isGlobal: true, onlineCount: 0 },
      ...sites.map((site) => ({
        _id: site.id, room: site.room, name: `#${site.name}`, site,
        type: 'group', isGlobal: false, onlineCount: 0
      }))
    ];
  };

  const refreshPresence = async () => {
    if (state.presencePromise) return state.presencePromise;
    state.presencePromise = (async () => {
      try {
        const data   = await api('/api/network/presence');
        const counts = data?.rooms || {};
        state.channels = state.channels.map((c) => ({ ...c, onlineCount: Number(counts[c.room] || 0) }));
        const current  = state.currentChannel;
        if (current) state.currentChannel = state.channels.find((c) => c._id === current._id) || current;
        
        // Update online count in header if we're in a channel
        const headerCount = document.getElementById('header-online-count');
        if (headerCount && state.currentChannel) {
          const count = Number(state.currentChannel.onlineCount || 0);
          headerCount.textContent = `${count} online`;
          headerCount.className = count > 0 ? 'header-online has-users' : 'header-online';
        }
        
        renderSidebar();
      } catch {}
    })();
    try {
      await state.presencePromise;
    } finally {
      state.presencePromise = null;
    }
  };

  const loadChannels = async () => {
    const networkData  = await api('/api/network/sites');
    state.channels = mapChannels(networkData);
    await refreshPresence();
    return state.channels;
  };

  const getCurrentChannel = (channelId) =>
    state.channels.find((c) => c._id === channelId) || state.channels[0] || null;

  const joinRoom = async (channel) => {
    if (!channel) return;
    const roomKey = String(channel.room || '').trim();
    if (state.joinPromise && state.joinRoomKey === roomKey) return state.joinPromise;
    let nickname = String(localStorage.getItem('tlkNickname') || state.user?.name || state.user?.username || '').trim();
    if (!nickname) nickname = 'guest';
    state.joinRoomKey = roomKey;
    state.joinPromise = api(`/api/tlk/rooms/${encodeURIComponent(channel.room)}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() },
      body: { nickname }
    });
    const data = await state.joinPromise.finally(() => {
      if (state.joinRoomKey === roomKey) {
        state.joinPromise = null;
        state.joinRoomKey = '';
      }
    });
    if (data?.nickname) localStorage.setItem('tlkNickname', String(data.nickname));
    if (data?.token)    localStorage.setItem('tlkParticipantToken', String(data.token));
    return data;
  };

  const fetchRoomEffect = async (channel) => {
    if (!channel?.room) {
      setRoomEffectState(null);
      return null;
    }
    try {
      const data = await api(`/api/chat-effects/rooms/${encodeURIComponent(channel.room)}`);
      if (data?.user) applyUserSnapshot(data.user);
      return setRoomEffectState(data?.roomEffect || null);
    } catch {
      return state.roomEffect;
    }
  };

  const notifyMentions = (msg, channel) => {
    const mentions = detectMentions(String(msg?.body || msg?.content || ''));
    const currentUsername = String(state.user?.name || state.user?.username || '').trim().toLowerCase();
    
    // Case-insensitive check for mention
    const isMentioned = mentions.some(m => m.toLowerCase() === currentUsername);

    if (currentUsername && isMentioned) {
      const notification = document.getElementById('mention-notification');
      if (notification && channel) {
        // Clear any existing timeout
        if (state.mentionTimeout) clearTimeout(state.mentionTimeout);

        notification.innerHTML = `
          <span>New mention in <strong>${channel.name}</strong> by <strong>${getUsername(msg)}</strong>: ${highlightMention(renderBody(msg.body || msg.content), currentUsername)}</span>
          <span id="mention-notification-close" title="Dismiss">✖</span>
        `;
        notification.classList.remove('hidden');
        
        notification.onclick = () => {
          navigate(`/channels/${channel._id}`);
          notification.classList.add('hidden');
        };

        document.getElementById('mention-notification-close').onclick = (e) => {
          e.stopPropagation();
          notification.classList.add('hidden');
        };

        // Auto-close after 3 seconds
        state.mentionTimeout = setTimeout(() => {
          notification.classList.add('hidden');
        }, 3000);
      }
    }
  };

  const getMessages = async (channel) => {
    if (!channel) return [];
    const roomKey = String(channel.room || '').trim();
    if (state.messagesPromise && state.messagesRoomKey === roomKey) return state.messagesPromise;
    state.messagesRoomKey = roomKey;
    state.messagesPromise = (async () => {
      const headers   = { 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() };
      const messages  = await api(`/api/tlk/rooms/${encodeURIComponent(channel.room)}/messages?limit=250`, { headers });
      if (state.currentChannel?._id !== channel._id) return [];
      const nextMessages  = Array.isArray(messages) ? messages : [];
      const nextSignature = getMessagesSignature(nextMessages);
      const changed       = nextSignature !== state.lastMessagesSignature;
      const inferredRoomEffect = nextMessages.find((msg) => msg?.roomEffect)?.roomEffect || null;
      if (inferredRoomEffect || state.roomEffect) {
        setRoomEffectState(inferredRoomEffect || state.roomEffect);
      }
      
      if (changed && nextMessages.length > 0) {
        const oldIds = new Set(state.messages.map(m => String(m.id || m._id || '')));
        const isInitialLoad = state.messages.length === 0;

        if (!isInitialLoad) {
          const newMessages = nextMessages.filter(m => {
            const id = String(m.id || m._id || '');
            return id && !oldIds.has(id);
          });

          for (const msg of newMessages) {
            notifyMentions(msg, channel);
          }
        }
      }
      
      state.messages = nextMessages;
      state.lastMessagesSignature = nextSignature;
      state.bannedMessage = '';
      if (changed) renderMessages();
      return state.messages;
    })();
    try {
      return await state.messagesPromise;
    } finally {
      if (state.messagesRoomKey === roomKey) {
        state.messagesPromise = null;
        state.messagesRoomKey = '';
      }
    }
  };

  const fetchAlerts = async () => {
    if (state.alertsPromise) return state.alertsPromise;
    state.alertsPromise = (async () => {
      try {
        const alerts = await api('/api/network/alerts', {
          headers: { 'x-chat-device-id': getChatDeviceId(), 'x-tlk-participant-token': String(localStorage.getItem('tlkParticipantToken') || '') }
        });
        const list = alerts?.alerts;
        if (Array.isArray(list) && list.length > 0) showToast(list[list.length - 1]?.message || 'Moderation notice');
      } catch {}
    })();
    try {
      await state.alertsPromise;
    } finally {
      state.alertsPromise = null;
    }
  };

  const isMine = (msg) => {
    const senderUserId  = String(msg?.userId || msg?.senderUserId || msg?.sender?.userId || '').trim();
    const currentUserId = String(state.user?._id || '').trim();
    const senderToken   = String(msg?.user_token || msg?.senderId || msg?.sender?._id || '').trim();
    const localToken    = String(localStorage.getItem('tlkParticipantToken') || '').trim();
    return !!((senderUserId && currentUserId && senderUserId === currentUserId) ||
              (senderToken  && localToken    && senderToken  === localToken));
  };

  const canDelete = (msg) => {
    const role = String(state.user?.role || '').toLowerCase();
    return !msg?.deleted && (isMine(msg) || role === 'owner');
  };

  const getRank = (msg) => {
    const mine    = isMine(msg);
    const msgRole = String(msg?.role || '').toLowerCase();
    const myRole  = String(state.user?.role || '').toLowerCase();
    const role    = mine ? (myRole || msgRole) : msgRole;
    if (role === 'owner') return { key: 'owner', label: 'Owner' };
    if (role === 'admin') return { key: 'admin', label: 'Admin' };
    return null;
  };

  const fmtTime = (msg) => {
    if (msg?.date)      return new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (msg?.timestamp) return new Date(Number(msg.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return '';
  };

  // Safely render message body: escapes HTML injection but preserves all unicode,
  // emoji, special characters, and renders actual line breaks.
  const renderBody = (text) => {
    if (!text) return '';
    // esc() only touches & < > " ' — all unicode/emoji pass through untouched
    return esc(text).replace(/\n/g, '<br>');
  };

  const avatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg,#7c69fa,#b29fff)',
      'linear-gradient(135deg,#4be8a0,#3ab8d0)',
      'linear-gradient(135deg,#e8b84b,#e87a4b)',
      'linear-gradient(135deg,#e84b9a,#9a4be8)',
      'linear-gradient(135deg,#4b9ee8,#4be8e8)',
      'linear-gradient(135deg,#e8724b,#e84b6a)',
    ];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
    return colors[Math.abs(h) % colors.length];
  };

  const getUserId = (msg) => {
    return String(msg?.userId || msg?.senderUserId || msg?.sender?.userId || '').trim();
  };

  const getUsername = (msg) => {
    return String(msg?.nickname || msg?.sender?.name || msg?.sender?.username || '').trim();
  };

  const isSameServer = (msg) => {
    const msgSiteId = String(msg?.siteId || msg?.sender?.siteId || '').trim();
    const currentSiteId = String(state.currentChannel?.site?.id || '').trim();
    return msgSiteId === currentSiteId;
  };

  const formatMention = (username) => {
    return `@${username}`;
  };

  const escapeRegex = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const highlightMention = (text, username) => {
    return text.replace(new RegExp(`@${escapeRegex(username)}\\b`, 'gi'), `<span class="mention">@${username}</span>`);
  };

  const detectMentions = (text) => {
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.slice(1)) : [];
  };

  const isMentioned = (msg, username) => {
    const mentions = detectMentions(String(msg?.body || msg?.content || ''));
    const target = String(username || '').toLowerCase();
    return mentions.some(m => m.toLowerCase() === target);
  };

  const addMentionListener = (msgEl, msg) => {
    const username = getUsername(msg);
    const userId = getUserId(msg);
    
    if (!username || !userId) return;

    const avatarEl = msgEl.querySelector('.msg-avatar');
    if (!avatarEl) return;

    avatarEl.addEventListener('mouseenter', () => {
      avatarEl.style.position = 'relative';
      const mentionTip = document.createElement('div');
      mentionTip.className = 'mention-tip';
      mentionTip.textContent = formatMention(username);
      mentionTip.style.cssText = `
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        color: var(--text-1);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        border: 1px solid var(--border-md);
        z-index: 100;
      `;
      avatarEl.appendChild(mentionTip);
    });

    avatarEl.addEventListener('mouseleave', () => {
      const tip = avatarEl.querySelector('.mention-tip');
      if (tip) tip.remove();
    });;

    avatarEl.addEventListener('click', () => {
      const input = document.getElementById('chat-input');
      if (!input) return;
      
      const pos = input.selectionStart ?? input.value.length;
      const mentionText = formatMention(username);
      input.value = input.value.slice(0, pos) + mentionText + input.value.slice(pos);
      input.selectionStart = input.selectionEnd = pos + mentionText.length;
      input.focus();
      renderCommandPanel(input.value);
    });
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: AUTH
  ═══════════════════════════════════════════════════════════════ */
  const renderLogin = () => {
    cleanupChatTimers();
    app.innerHTML = `
      <div class="auth-screen">
        <div class="auth-card">
          <div class="auth-logo">K</div>
          <h2>Welcome back</h2>
          <p class="auth-subtitle">Sign in to continue to K-Chat</p>
          <div id="auth-error" class="banner banner-error hidden" style="margin-bottom:16px"></div>
          <form id="login-form" class="form-stack">
            <div class="field">
              <label>Username</label>
              <input name="username" placeholder="Enter your username" required class="inp" autocomplete="username" />
            </div>
            <div class="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="Enter your password" required class="inp" autocomplete="current-password" />
            </div>
            <button class="btn btn-primary btn-full" style="margin-top:4px" type="submit">Sign In</button>
          </form>
          <p style="text-align:center;font-size:13px;color:var(--text-3);margin-top:20px">
            No account? <a href="#/register" class="auth-link">Create one</a>
          </p>
        </div>
      </div>
    `;

    const form  = document.getElementById('login-form');
    const errEl = document.getElementById('auth-error');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errEl.classList.add('hidden');
      const fd = new FormData(form);
      const payload = { username: String(fd.get('username') || '').trim(), password: String(fd.get('password') || '') };
      try {
        const data = await api('/api/auth', { method: 'POST', body: payload });
        setToken(data?.token || '');
        if (data?.user?.name) localStorage.setItem('tlkNickname', String(data.user.name));
        localStorage.removeItem('tlkParticipantToken');
        await loadUser();
        navigate('/channels/global');
      } catch (err) { errEl.textContent = err.message; errEl.classList.remove('hidden'); }
    });
  };

  const renderRegister = () => {
    cleanupChatTimers();
    app.innerHTML = `
      <div class="auth-screen">
        <div class="auth-card">
          <div class="auth-logo">K</div>
          <h2>Create account</h2>
          <p class="auth-subtitle">Join K-Chat today</p>
          <div id="auth-error" class="banner banner-error hidden" style="margin-bottom:16px"></div>
          <form id="register-form" class="form-stack">
            <div class="field">
              <label>Username</label>
              <input name="username" placeholder="Choose a username" required minlength="3" class="inp" autocomplete="username" />
            </div>
            <div class="field">
              <label>Display name <span style="color:var(--text-3);font-weight:400">(optional)</span></label>
              <input name="name" placeholder="How should we call you?" class="inp" />
            </div>
            <div class="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="At least 6 characters" required minlength="6" class="inp" autocomplete="new-password" />
            </div>
            <div class="field">
              <label>Confirm password</label>
              <input name="password2" type="password" placeholder="Repeat your password" required minlength="6" class="inp" autocomplete="new-password" />
            </div>
            <button class="btn btn-primary btn-full" style="margin-top:4px" type="submit">Create Account</button>
          </form>
          <p style="text-align:center;font-size:13px;color:var(--text-3);margin-top:20px">
            Already have an account? <a href="#/login" class="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    `;

    const form  = document.getElementById('register-form');
    const errEl = document.getElementById('auth-error');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errEl.classList.add('hidden');
      const fd = new FormData(form);
      const password  = String(fd.get('password')  || '');
      const password2 = String(fd.get('password2') || '');
      if (password !== password2) { errEl.textContent = 'Passwords do not match'; errEl.classList.remove('hidden'); return; }
      const payload = { username: String(fd.get('username') || '').trim(), name: String(fd.get('name') || '').trim(), password };
      try {
        const data = await api('/api/users', { method: 'POST', body: payload });
        setToken(data?.token || '');
        if (data?.user?.name) localStorage.setItem('tlkNickname', String(data.user.name));
        localStorage.removeItem('tlkParticipantToken');
        await loadUser();
        navigate('/channels/global');
      } catch (err) { errEl.textContent = err.message; errEl.classList.remove('hidden'); }
    });
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: SHELL + SIDEBAR
  ═══════════════════════════════════════════════════════════════ */
  const layoutShell = (contentHtml, footerHtml = '') => {
    const isStaff     = ['owner', 'admin'].includes(String(state.user?.role || '').toLowerCase());
    const displayName = esc(state.user?.name || state.user?.username || 'Guest');
    const avatarLetter = String(state.user?.name || state.user?.username || 'U').trim().charAt(0).toUpperCase();
    const channelName = esc(state.currentChannel?.name?.replace(/^#/, '') || 'general');
    const roomEffectMeta = getRoomEffectMeta();
    const roomEffectLabel = getActiveRoomEffectId() === 'none'
      ? 'No room effect'
      : `${roomEffectMeta.name} live`;

    app.innerHTML = `
      <div id="mention-notification" class="hidden"></div>
      <div class="shell">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-logo">K</div>
            <span class="sidebar-title">K-Chat</span>
          </div>
          <div class="sidebar-section-label">Channels</div>
          <div id="sidebar-channels" style="flex:1;overflow-y:auto;padding-bottom:8px"></div>
          <div class="sidebar-footer">
            <div class="footer-user">
              <div class="avatar sm" style="background:${avatarColor(displayName)}">${esc(avatarLetter)}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${displayName}</div>
                <div style="font-size:11px;color:var(--text-3);display:flex;align-items:center;gap:5px">
                  <span class="status-dot status-online"></span>Online
                  <span id="sidebar-coins" class="coin-chip">${Math.max(0, Number(state.user?.coins || 0))} coin${Number(state.user?.coins || 0) === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>
            <div class="footer-actions">
              <button id="btn-settings" class="icon-btn" title="Settings">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>
              </button>
              ${isStaff ? `<button id="btn-admin" class="icon-btn" title="Admin Panel">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"/></svg>
              </button>` : ''}
              <button id="btn-logout" class="icon-btn danger" title="Sign out">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>
              </button>
            </div>
          </div>
        </aside>

        <section class="main">
          <header class="main-header">
            <span class="main-header-hash">#</span>
            <div class="main-header-meta">
              <h2>${channelName}</h2>
              <div class="main-header-sub">
                <span class="room-effect-chip">
                  <span>Room FX</span>
                  <strong id="header-room-effect">${esc(roomEffectLabel)}</strong>
                </span>
              </div>
            </div>
            <span id="header-online-count" class="header-online">0 online</span>
          </header>
          <div id="main-content" style="flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative">
            ${contentHtml}
          </div>
          ${footerHtml}
        </section>
      </div>
    `;

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      cleanupChatTimers(); setToken(''); applyUserSnapshot(null); navigate('/login');
    });
    document.getElementById('btn-settings')?.addEventListener('click', () => navigate('/settings'));
    document.getElementById('btn-admin')?.addEventListener('click',    () => navigate('/admin'));
    renderSidebar();
  };

  const renderSidebar = () => {
    const root = document.getElementById('sidebar-channels');
    if (!root) return;
    root.innerHTML = state.channels.map((c) => {
      const active  = state.currentChannel?._id === c._id;
      const name    = c.name?.replace(/^#/, '') || c._id;
      const count   = Number(c.onlineCount || 0);
      const hasUsers = count > 0;
      return `
        <div class="channel-item ${active ? 'active' : ''}" data-channel-id="${esc(c._id)}">
          <span class="channel-hash">#</span>
          <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(name)}</span>
          <span class="online-pill ${hasUsers ? 'has-users' : ''}">
            <span class="online-pill-dot"></span>${count} online
          </span>
        </div>
      `;
    }).join('');
    root.querySelectorAll('[data-channel-id]').forEach((el) => {
      el.addEventListener('click', () => navigate(`/channels/${el.getAttribute('data-channel-id')}`));
    });

    // Also update the header online count if we're in a channel
    const headerCount = document.getElementById('header-online-count');
    if (headerCount && state.currentChannel) {
      const count = Number(state.currentChannel.onlineCount || 0);
      headerCount.textContent = `${count} online`;
      headerCount.className = count > 0 ? 'header-online has-users' : 'header-online';
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: MESSAGES
  ═══════════════════════════════════════════════════════════════ */
  const renderMessages = () => {
    const root = document.getElementById('chat-messages');
    if (!root) return;

    const wasNearBottom    = isNearBottom(root);
    const prevScrollTop    = root.scrollTop;
    const prevScrollHeight = root.scrollHeight;

    if (state.bannedMessage) {
      root.innerHTML = `<div class="msg-state" style="color:var(--danger)">${esc(state.bannedMessage)}</div>`;
      setJumpToLatestVisible(false);
      return;
    }

    if (!state.messages.length) {
      root.innerHTML = `<div class="msg-state">No messages yet — say something!</div>`;
      return;
    }

    root.innerHTML = state.messages.map((m) => {
      const rank      = getRank(m);
      const name      = m?.nickname || m?.sender?.name || 'Unknown';
      const body      = String(m?.body || m?.content || '');
      const avatarL   = String(name || 'U').trim().charAt(0).toUpperCase() || 'U';
      const id        = String(m?.id || m?._id || '').trim();
      const token     = String(m?.user_token || m?.senderId || '').trim();
      const isDeleted = !!m?.deleted;
      const mine      = isMine(m);
      const isSystem  = !!m?.system || String(name).trim().toLowerCase() === 'system';
      const bgStyle   = `background:${avatarColor(name)}`;
      const effectId  = isDeleted ? 'none' : getMessageEffect(m);
      const effectCls = effectId === 'none' ? '' : `effect-${effectId}`;

      const deleteBtn = canDelete(m)
        ? `<button data-delete-id="${esc(id)}" data-delete-token="${esc(token)}" class="delete-btn">Delete</button>`
        : '';

      const rankHtml = rank
        ? `<span class="rank-chip rank-${rank.key}">${esc(rank.label)}</span>`
        : '';

      let formattedBody = renderBody(body);
      if (!isDeleted) {
        const myUsername = String(state.user?.name || state.user?.username || '').trim();
        if (myUsername && isMentioned(m, myUsername)) {
          formattedBody = highlightMention(renderBody(body), myUsername);
        }
      }

      return `
        <div class="msg ${mine ? 'mine' : ''} ${isDeleted ? 'deleted' : ''} ${isSystem ? 'system-note' : ''}">
          <div class="msg-avatar" style="${bgStyle}">${esc(avatarL)}</div>
          <div class="msg-body">
            <div class="msg-head">
              <strong class="msg-name ${effectCls}">${esc(isSystem ? 'System' : name)}</strong>
              ${rankHtml}
              <span>${esc(fmtTime(m))}</span>
            </div>
            <div class="msg-bubble ${effectCls}">${isDeleted ? '<em>Message deleted</em>' : formattedBody}</div>
            ${deleteBtn ? `<div class="msg-actions">${deleteBtn}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    root.querySelectorAll('.msg').forEach((msgEl, index) => {
      if (index < state.messages.length) {
        addMentionListener(msgEl, state.messages[index]);
      }
    });

    root.querySelectorAll('[data-delete-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id          = String(btn.getAttribute('data-delete-id')    || '').trim();
        const senderToken = String(btn.getAttribute('data-delete-token') || '').trim();
        if (!id || !state.currentChannel) return;
        try {
          await api(`/api/tlk/rooms/${encodeURIComponent(state.currentChannel.room)}/messages/${encodeURIComponent(id)}/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() },
            body: { senderToken }
          });
        } catch {
          await api(`/api/network/messages/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: { senderToken, callerToken: String(localStorage.getItem('tlkParticipantToken') || '') }
          }).catch(() => {});
        }
        if (state.currentChannel) await getMessages(state.currentChannel).catch(() => {});
      });
    });

    if (state.autoFollow || wasNearBottom) {
      state.autoFollow = true;
      setJumpToLatestVisible(false);
      scrollChatToBottom('auto');
      return;
    }
    root.scrollTop = prevScrollTop + Math.max(0, root.scrollHeight - prevScrollHeight);
    setJumpToLatestVisible(true);
  };

  /* ═══════════════════════════════════════════════════════════════
     MESSAGING LOGIC
  ═══════════════════════════════════════════════════════════════ */
  const sendMessage = async (text) => {
    if (!state.currentChannel) return;
    const trimmed = String(text || '').trim();
    if (!trimmed) return;

    const channel = state.currentChannel;
    const body = trimmed;

    // Optimistic UI update
    const optimisticMsg = {
      _id: 'temp-' + Date.now(),
      nickname: String(localStorage.getItem('tlkNickname') || state.user?.name || state.user?.username || 'You').trim(),
      body: body,
      date: new Date().toISOString(),
      userId: state.user?._id || '',
      role: state.user?.role || 'user',
      equippedEffect: normalizeEffectId(state.user?.equippedEffect)
    };
    state.messages.push(optimisticMsg);
    renderMessages();

    const postMsg = () => api(`/api/tlk/rooms/${encodeURIComponent(channel.room)}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tlk-client-id': getTlkClientId(), 'x-chat-device-id': getChatDeviceId() },
      body: { body }
    });

    try {
      const sent = await postMsg();
      if (sent?.reward?.balance !== undefined && state.user) {
        state.user = {
          ...state.user,
          coins: Math.max(0, Number(sent.reward.balance || 0))
        };
        updateCoinDisplays();
      }
      if (state.currentChannel?._id === channel._id) await getMessages(channel);
    } catch (err) {
      // Remove optimistic message on error
      state.messages = state.messages.filter(m => m._id !== optimisticMsg._id);
      renderMessages();

      if (err.status === 401) {
        await joinRoom(channel);
        await postMsg();
        if (state.currentChannel?._id === channel._id) await getMessages(channel);
        return;
      }
      throw err;
    }
  };



  const postModerationNote = async (room, text) => {
    if (!room || !text) return;
    try { await api(`/api/tlk/rooms/${encodeURIComponent(room)}/moderation-note`, { method: 'POST', body: { text } }); } catch {}
  };

  const runSlashCommand = async (rawText) => {
    const text = String(rawText || '').trim();
    if (!text.startsWith('/')) return false;

    const [command, ...parts] = text.split(/\s+/);
    const cmd        = String(command || '').toLowerCase();
    const room       = String(state.currentChannel?.room || '').trim();
    const role       = String(state.user?.role || '').toLowerCase();
    const hasModRole = role === 'owner' || role === 'admin';

    if (cmd === '/help') { showComposerNotice('Commands: /ai /warn /ban /banfromall /unban /clearwarns /clearchat', 'success', 4000); return true; }

    if (cmd === '/ai') {
      const siteId = String(parts[0] || '').toLowerCase();
      const prompt = String(parts.slice(1).join(' ') || '').trim();
      if (!siteId || !prompt) { showComposerNotice('Usage: /ai <siteId> <prompt>', 'error', 3500); return true; }
      const ai     = await api('/api/network/ai/summon', { method: 'POST', body: { siteId, prompt } });
      const aiText = String(ai?.response || '').trim();
      if (!aiText) { showComposerNotice('AI returned empty response', 'error', 3200); return true; }
      await sendMessage(`[${siteId} AI] ${aiText}`);
      return true;
    }

    const modActions = new Set(['/warn', '/ban', '/banfromall', '/unban', '/clearwarns', '/clearchat']);
    if (!modActions.has(cmd)) { showComposerNotice(`Unknown command: ${cmd}`, 'error', 3200); return true; }
    if (!hasModRole) { showComposerNotice('Only owner/admin can use moderation commands', 'error', 3500); return true; }
    if (cmd === '/clearchat' && role !== 'owner') { showComposerNotice('Only owner can use /clearchat', 'error', 3500); return true; }
    if (!room) { showComposerNotice('No active room selected', 'error', 3200); return true; }

    if (cmd === '/clearchat') {
      const reason = String(parts.join(' ') || 'Owner cleared room').trim();
      await api('/api/network/mod/actions', { method: 'POST', body: { action: 'clearchat', target: '__room__', reason, room } });
      await postModerationNote(room, `Moderation: ${state.user?.name || state.user?.username || 'Owner'} cleared this room.`);
      if (state.currentChannel?.room === room) await getMessages(state.currentChannel);
      showComposerNotice('Chat cleared', 'success', 3000);
      return true;
    }

    const target = String(parts[0] || '').trim();
    const reason = String(parts.slice(1).join(' ') || 'Moderator action').trim();
    if (!target) { showComposerNotice(`Usage: ${cmd} <target> ${cmd === '/unban' || cmd === '/clearwarns' ? '' : '<reason>'}`.trim(), 'error', 3800); return true; }

    const action       = cmd.slice(1);
    const actionResult = await api('/api/network/mod/actions', { method: 'POST', body: { action, target, reason, room } });
    const targetDisplay = String(actionResult?.targetDisplay || target);

    const noteMap = {
      warn:       `Moderation: ${targetDisplay} was warned.`,
      ban:        `Moderation: ${targetDisplay} was banned from this server.`,
      banfromall: `Moderation: ${targetDisplay} was globally banned.`,
      unban:      `Moderation: ${targetDisplay} was unbanned.`,
      clearwarns: `Moderation: warnings were cleared for ${targetDisplay}.`
    };
    if (noteMap[action]) await postModerationNote(room, noteMap[action]);

    showComposerNotice(`${cmd} applied`, 'success', 3000);
    if (state.currentChannel?.room === room) await getMessages(state.currentChannel).catch(() => {});
    return true;
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: CHAT PAGE
  ═══════════════════════════════════════════════════════════════ */
  const renderChatPage = async (channelId) => {
    if (!state.channels.length) await loadChannels();
    state.currentChannel        = getCurrentChannel(channelId);
    state.lastMessagesSignature = '';
    state.routeNonce += 1;
    const routeNonce = state.routeNonce;
    await fetchRoomEffect(state.currentChannel);

    const channelName = esc(state.currentChannel?.name?.replace(/^#/, '') || 'general');

    layoutShell(
      `<div id="chat-messages"></div>
       <button id="jump-to-latest" class="hidden" type="button">
         <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
         Jump to latest
       </button>`,
      `<div class="composer">
        <div class="composer-toolbar">
          <div class="composer-toolbar-copy">
            <div class="composer-toolbar-title">Room Chat</div>
            <div id="composer-room-effect" class="composer-room-effect">${esc(getActiveRoomEffectId() === 'none' ? 'No room effect active' : `${getRoomEffectMeta().name} active for this room`)}</div>
          </div>
          <div id="room-effects-balance" class="coin-chip">${Math.max(0, Number(state.user?.coins || 0))} coin${Number(state.user?.coins || 0) === 1 ? '' : 's'}</div>
        </div>
        <div id="command-panel" class="hidden"></div>
        <div id="composer-notice" class="hidden"></div>
        <div class="composer-box">
          <form id="chat-form" class="composer-form">
            <textarea id="chat-input" rows="1" placeholder="Message #${channelName}" class="composer-textarea" spellcheck="true" autocomplete="off"></textarea>
            <div style="display:flex;gap:2px;align-items:flex-end;flex-shrink:0">
              <div style="position:relative">
                <button type="button" id="effects-btn" class="composer-effect-btn" title="Room effects" aria-label="Open room effects">✦</button>
              </div>
              <div style="position:relative">
                <button type="button" id="emoji-btn" class="composer-emoji-btn" title="Emoji & special characters" aria-label="Open emoji picker">😊</button>
              </div>
              <button type="submit" class="composer-send" aria-label="Send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </form>
          <div class="composer-hint">Enter to send &nbsp;·&nbsp; Shift+Enter for new line &nbsp;·&nbsp; / for commands</div>
        </div>
      </div>`
    );

    state.autoFollow = true;
    setJumpToLatestVisible(false);

    document.getElementById('chat-messages')?.addEventListener('scroll', syncAutoFollowFromScroll, { passive: true });
    document.getElementById('jump-to-latest')?.addEventListener('click', () => {
      state.autoFollow = true;
      setJumpToLatestVisible(false);
      scrollChatToBottom('smooth');
    });

    if (!state.currentChannel) {
      document.getElementById('chat-messages').innerHTML =
        '<div class="msg-state" style="color:var(--danger)">No channels available.</div>';
      return;
    }
    document.getElementById('chat-messages').innerHTML = '<div class="msg-state">Loading messages…</div>';

    document.getElementById('chat-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-input');
      const text  = input.value;
      input.value = '';
      input.style.height = '';
      renderCommandPanel('');
      try {
        const handled = await runSlashCommand(text);
        if (handled) return;
        await sendMessage(text);
      } catch (err) { showComposerNotice(err.message || 'Failed to send', 'error', 4200); }
    });

    document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('chat-form')?.requestSubmit(); }
    });
    document.getElementById('chat-input')?.addEventListener('input', (e) => { renderCommandPanel(e.target?.value || ''); });

    // ── Emoji picker ──────────────────────────────────────────────
    const EMOJI_DATA = [
      { label: 'Smileys', emojis: ['😀','😁','😂','🤣','😃','😄','😅','😆','😇','😉','😊','😋','😌','😍','🥰','😘','😗','😙','😚','😜','😝','😛','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿'] },
      { label: 'Gestures', emojis: ['👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦶','👂','🦻','👃','🫀','🫁','🧠','🦷','🦴','👀','👁','👅','👄'] },
      { label: 'People', emojis: ['👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵','🙍','🙎','🙅','🙆','💁','🙋','🧏','🙇','🤦','🤷','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤰','��','🧑‍🍼','🎅','🤶','🧙','🧝','🧛','🧟','🧞','🧜','🧚','👼','🤺','🏇','⛷️','🏂','🏋️','🤼','🤸','🤺','🏊','🏄','🚴','🧘'] },
      { label: 'Animals', emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪲','🦟','🦗','🕷','🦂','🐢','🦎','🐍','🐲','🦕','🦖','🦦','🦈','🐬','🐳','🐋','🦭','🐟','🐠','🐡','🦐','🦞','🦀','🦑','🐙','🦪','🐚','🐌','🦔','🌸','🌺','🌼','🌻','🌹','🌷'] },
      { label: 'Food', emojis: ['🍎','🍊','🍋','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🫒','🥑','🍆','🥦','🥬','🌶️','🫑','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🌮','🌯','🥙','🧆','🥚','🍜','🍱','🍣','🍛','🍲','🥘','🫕','🍝','🍢','🦪','🍦','🎂','🍰','🧁','🍩','🍪','🍫','🍬','🍭','🧃','🥤','☕','🫖','🍵','🧋','🍺','🍸','🍹','🥂'] },
      { label: 'Travel', emojis: ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🛵','🏍️','🛺','🚲','🛴','🛹','🚏','🚦','🛣️','⛽','✈️','🛫','🛬','🛩️','💺','🚁','🚟','🚠','🚡','🛰️','🚀','🛸','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','🗺️','🗼','🗽','🗾','🌋','⛰️','🏕️','🏖️','🏜️','🏝️','🏞️','🌅','🌄','🌠','🎇','🎆'] },
      { label: 'Objects', emojis: ['⌚','📱','💻','⌨️','🖥️','🖨️','🖱️','🖲️','🕹️','💾','💿','📀','📷','📸','📹','📽️','🎥','📞','📟','📺','📻','🧭','⏱️','⏰','🕰️','⌛','⏳','📡','🔋','🪫','🔌','💡','🔦','🕯️','🔍','🔬','🔭','📡','💊','🩺','🩸','🩹','🩼','🦽','🦯','🪄','🎩','🪣','🔑','🗝️','🔓','🔒','🔨','🪓','⛏️','⚒️','🛠️','🗡️','⚔️','🛡️','🪚','🔧','🪛','🔩','⚙️','🗜️','🪤','🧲','🪝'] },
      { label: 'Symbols', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯','💹','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛗','🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','⚧️','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣','▶️','⏸️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↩️','↪️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','♾️','💲','💱','™️','©️','®️','〰️','➰','➿','🔚','🔙','🔛','🔝','🔜','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔷','🔶','🔹','🔸','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🔈','🔇','🔉','🔊','🔔','🔕','📣','📢','👁️‍🗨️','💬','💭','🗯️','♠️','♣️','♥️','♦️','🃏','🀄','🎴'] },
      { label: 'Flags', emojis: ['🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️','🇺🇸','🇬🇧','🇨🇦','🇦🇺','🇩🇪','🇫🇷','🇯🇵','🇨🇳','🇰🇷','🇷🇺','🇧🇷','🇮🇳','🇮🇹','🇪🇸','🇲🇽','🇳🇱','🇸🇦','🇸🇪','🇳🇴','🇩🇰','🇵🇱','🇺🇦'] },
    ];

    const setupEmojiPicker = () => {
      const btn   = document.getElementById('emoji-btn');
      const input = document.getElementById('chat-input');
      if (!btn || !input) return;

      let pickerEl = null;
      let open     = false;

      const closePicker = () => {
        if (pickerEl) { pickerEl.remove(); pickerEl = null; }
        open = false;
      };

      const buildPicker = () => {
        const el = document.createElement('div');
        el.className = 'emoji-picker-popover';

        const search = document.createElement('input');
        search.className    = 'emoji-picker-search';
        search.placeholder  = 'Search emoji…';
        search.setAttribute('spellcheck', 'false');
        el.appendChild(search);

        const gridContainer = document.createElement('div');
        el.appendChild(gridContainer);

        const renderEmojis = (query) => {
          gridContainer.innerHTML = '';
          const q = query.toLowerCase().trim();
          for (const section of EMOJI_DATA) {
            const filtered = section.emojis.filter(e => !q || e.includes(q) || section.label.toLowerCase().includes(q));
            if (!filtered.length) continue;
            const label = document.createElement('div');
            label.className = 'emoji-section-label';
            label.textContent = section.label;
            gridContainer.appendChild(label);
            const grid = document.createElement('div');
            grid.className = 'emoji-grid';
            for (const emoji of filtered) {
              const b = document.createElement('button');
              b.type      = 'button';
              b.className = 'emoji-btn';
              b.textContent = emoji;
              b.title     = emoji;
              b.addEventListener('click', () => {
                const pos = input.selectionStart ?? input.value.length;
                input.value = input.value.slice(0, pos) + emoji + input.value.slice(pos);
                input.selectionStart = input.selectionEnd = pos + [...emoji].length;
                input.focus();
                renderCommandPanel(input.value);
              });
              grid.appendChild(b);
            }
            gridContainer.appendChild(grid);
          }
        };

        renderEmojis('');
        search.addEventListener('input', () => renderEmojis(search.value));
        // Stop clicks inside picker from closing it
        el.addEventListener('mousedown', (e) => e.stopPropagation());
        return el;
      };

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (open) { closePicker(); return; }
        open = true;
        pickerEl = buildPicker();
        // Position: attach to the parent relative wrapper
        btn.parentElement.appendChild(pickerEl);
        pickerEl.style.bottom = 'calc(100% + 8px)';
        pickerEl.style.right = '0';
        pickerEl.style.zIndex = '5000';
      });

      document.addEventListener('mousedown', () => { if (open) closePicker(); }, { capture: true });
    };

    setupEmojiPicker();

    const setupEffectsPicker = () => {
      const btn = document.getElementById('effects-btn');
      if (!btn) return;
      let popoverEl = null;
      let open = false;

      const closePicker = () => {
        if (popoverEl && popoverEl.parentNode) popoverEl.parentNode.removeChild(popoverEl);
        popoverEl = null;
        open = false;
      };

      const activateRoomEffect = async (effectId) => {
        if (!state.currentChannel?.room) return;
        const data = await api(`/api/chat-effects/rooms/${encodeURIComponent(state.currentChannel.room)}/activate`, {
          method: 'POST',
          body: { effectId }
        });
        if (data?.user) applyUserSnapshot(data.user);
        setRoomEffectState(data?.roomEffect || null);
        renderMessages();
        showComposerNotice(data?.msg || 'Room effect activated', 'success', 3600);
        closePicker();
        await getMessages(state.currentChannel).catch(() => {});
      };

      const buildPicker = () => {
        const el = document.createElement('div');
        el.className = 'effects-picker-popover';
        const activeRoomEffectId = getActiveRoomEffectId();
        const activeMeta = getRoomEffectMeta();
        const activeTrigger = state.roomEffect?.triggeredByName
          ? `Triggered by ${state.roomEffect.triggeredByName}`
          : 'No room effect is active right now';
        el.innerHTML = `
          <div class="effects-picker-head">
            <div>
              <strong>Room Effects</strong>
              <span>Everyone in #${channelName} sees the active effect.</span>
            </div>
            <div class="coin-chip" id="effects-picker-balance">${esc(`${Math.max(0, Number(state.user?.coins || 0))} coin${Number(state.user?.coins || 0) === 1 ? '' : 's'}`)}</div>
          </div>
          <div class="effects-picker-card ${activeRoomEffectId !== 'none' ? 'active' : ''}" style="margin-bottom:10px">
            <div class="effects-picker-line">
              <div class="effects-picker-name">Live Now</div>
              <div class="effects-picker-price">${esc(activeRoomEffectId === 'none' ? 'NONE' : activeMeta.name.toUpperCase())}</div>
            </div>
            <div class="effects-picker-trigger">${esc(activeTrigger)}</div>
          </div>
          <div class="effects-picker-grid">
            ${fallbackEffects
              .filter((effect) => effect.id !== 'none')
              .map((effect) => {
                const effectId = normalizeEffectId(effect.id);
                const active = effectId === activeRoomEffectId;
                const canAfford = Math.max(0, Number(state.user?.coins || 0)) >= Math.max(0, Number(effect.price || 0));
                return `
                  <div class="effects-picker-card ${active ? 'active' : ''}">
                    <div class="effects-picker-line">
                      <div class="effects-picker-name">${esc(effect.name)}</div>
                      <div class="effects-picker-price">${esc(`${Math.max(0, Number(effect.price || 0))} COINS`)}</div>
                    </div>
                    <div class="effects-picker-desc">${esc(effect.description)}</div>
                    <div class="effect-preview effect-${effectId}">Room-wide preview for ${esc(effect.name)}</div>
                    <button type="button" class="btn btn-primary btn-sm" data-room-effect-id="${esc(effectId)}" ${active || !canAfford ? 'disabled' : ''}>
                      ${esc(active ? 'Active now' : canAfford ? `Activate for ${effect.price}c` : 'Need more coins')}
                    </button>
                  </div>
                `;
              }).join('')}
          </div>
        `;

        el.querySelectorAll('[data-room-effect-id]').forEach((actionBtn) => {
          actionBtn.addEventListener('click', async () => {
            const effectId = normalizeEffectId(actionBtn.getAttribute('data-room-effect-id'));
            try {
              actionBtn.disabled = true;
              await activateRoomEffect(effectId);
            } catch (err) {
              actionBtn.disabled = false;
              showComposerNotice(err.message || 'Failed to activate room effect', 'error', 4200);
            }
          });
        });

        el.addEventListener('mousedown', (e) => e.stopPropagation());
        return el;
      };

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (open) {
          closePicker();
          return;
        }
        open = true;
        popoverEl = buildPicker();
        btn.parentElement.appendChild(popoverEl);
      });

      document.addEventListener('mousedown', () => { if (open) closePicker(); }, { capture: true });
    };

    setupEffectsPicker();
    updateCoinDisplays();

    (async () => {
      try {
        await joinRoom(state.currentChannel);
        if (routeNonce !== state.routeNonce) return;
        await getMessages(state.currentChannel);
      } catch (err) {
        if (routeNonce !== state.routeNonce) return;
        if (err.status === 403) { state.bannedMessage = err.message; renderMessages(); }
        else {
          document.getElementById('chat-messages').innerHTML =
            `<div class="msg-state" style="color:var(--danger)">${esc(err.message)}</div>`;
        }
      }
    })();

    cleanupChatTimers();
    state.pollTimer = setInterval(async () => {
      if (!state.currentChannel) return;
      try { await getMessages(state.currentChannel); }
      catch (err) { if (err.status === 403) { state.bannedMessage = err.message; renderMessages(); } }
    }, 4000);

    state.metaTimer = setInterval(async () => {
      await refreshPresence();
      await fetchAlerts();
    }, 10000);
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: SETTINGS
  ═══════════════════════════════════════════════════════════════ */
  const renderSettingsPage = async () => {
    let effectsPayload = null;
    try {
      effectsPayload = await api('/api/chat-effects');
      if (effectsPayload?.user) applyUserSnapshot(effectsPayload.user);
    } catch {}

    layoutShell(`
      <div class="page-scroll">
        <div class="page-inner" style="max-width:760px">
          <div style="margin-bottom:4px">
            <h1 style="font-size:20px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em">Settings</h1>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px">Manage your account preferences</p>
          </div>

          <div class="card">
            <div class="card-title">Profile</div>
            <div id="settings-msg" class="banner banner-success hidden" style="margin-bottom:14px"></div>
            <div id="settings-err" class="banner banner-error hidden" style="margin-bottom:14px"></div>
            <form id="profile-form" class="form-stack">
              <div class="field">
                <label>Display name</label>
                <input name="name" placeholder="How should others see you?" value="${esc(state.user?.name || '')}" class="inp" />
              </div>
              <div class="field">
                <label>Avatar image</label>
                <input id="avatar-file" type="file" accept="image/*" style="font-size:13px;color:var(--text-2)" />
              </div>
              <div class="settings-balance">
                <div>
                  <div style="font-size:12px;color:var(--text-3);margin-bottom:4px">Current balance</div>
                  <strong>${Math.max(0, Number(state.user?.coins || 0))} coin${Number(state.user?.coins || 0) === 1 ? '' : 's'}</strong>
                </div>
                <div style="text-align:right;font-size:12px;color:var(--text-3)">Coins come from sending chat messages and can be gifted below.</div>
              </div>
              <div>
                <button class="btn btn-primary" type="submit">Save Profile</button>
              </div>
            </form>
          </div>

          <div class="card">
            <div class="card-title">Give Coins</div>
            <p style="font-size:12.5px;color:var(--text-3);margin-bottom:14px">Send coins directly to another account by username.</p>
            <form id="coin-transfer-form" class="form-stack">
              <div class="field">
                <label>Recipient username</label>
                <input name="username" placeholder="Who should receive coins?" class="inp" autocomplete="off" />
              </div>
              <div class="field">
                <label>Amount</label>
                <input name="amount" type="number" min="1" step="1" placeholder="How many coins?" class="inp" />
              </div>
              <div>
                <button class="btn btn-primary" type="submit">Send Coins</button>
              </div>
            </form>
          </div>

          <div class="card">
            <div class="card-title">Chat Effects</div>
            <div class="settings-balance" style="margin-bottom:14px">
              <div>
                <div style="font-size:12px;color:var(--text-3);margin-bottom:4px">Balance</div>
                <strong id="settings-coins-balance">${Math.max(0, Number(state.user?.coins || 0))} coin${Number(state.user?.coins || 0) === 1 ? '' : 's'}</strong>
              </div>
              <div style="text-align:right">
                <div style="font-size:12px;color:var(--text-3);margin-bottom:4px">Equipped</div>
                <div id="settings-equipped-effect" style="font-family:var(--font-head);font-size:16px;letter-spacing:0.06em;color:var(--text-1)">${esc(getEffectMeta(state.user?.equippedEffect).name)}</div>
              </div>
            </div>
            <p style="font-size:12.5px;color:var(--text-3);margin-bottom:14px">You earn 1 coin per sent chat message. Prices stay low so effects are easy to unlock.</p>
            <div id="effects-grid" class="effect-grid"></div>
          </div>

          <div class="card">
            <div class="card-title">Change Password</div>
            <form id="password-form" class="form-stack">
              <div class="field">
                <label>Current password</label>
                <input name="currentPassword" type="password" placeholder="Your current password" required class="inp" />
              </div>
              <div class="field">
                <label>New password</label>
                <input name="newPassword" type="password" placeholder="At least 6 characters" required minlength="6" class="inp" />
              </div>
              <div class="field">
                <label>Confirm new password</label>
                <input name="confirmPassword" type="password" placeholder="Repeat new password" required minlength="6" class="inp" />
              </div>
              <div>
                <button class="btn btn-primary" type="submit">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `);

    const msgEl   = document.getElementById('settings-msg');
    const errEl   = document.getElementById('settings-err');
    const showErr = (m) => { errEl.textContent = m; errEl.classList.remove('hidden'); msgEl.classList.add('hidden'); };
    const showMsg = (m) => { msgEl.textContent = m; msgEl.classList.remove('hidden'); errEl.classList.add('hidden'); };
    const effectsGrid = document.getElementById('effects-grid');
    const effectState = {
      effects: Array.isArray(effectsPayload?.effects) && effectsPayload.effects.length ? effectsPayload.effects : fallbackEffects
    };

    const renderEffectsGrid = () => {
      if (!effectsGrid) return;
      const owned = new Set((state.user?.ownedEffects || ['none']).map((effectId) => normalizeEffectId(effectId)));
      const equipped = normalizeEffectId(state.user?.equippedEffect);
      const coins = Math.max(0, Number(state.user?.coins || 0));

      effectsGrid.innerHTML = effectState.effects.map((effect) => {
        const effectId = normalizeEffectId(effect.id);
        const price = Math.max(0, Number(effect.price || 0));
        const ownedEffect = owned.has(effectId);
        const active = equipped === effectId;
        const locked = !ownedEffect;
        const canAfford = coins >= price;
        const action = ownedEffect ? 'equip' : 'buy';
        const disabled = active || (locked && !canAfford);
        const buttonText = active ? 'Equipped' : ownedEffect ? 'Use' : `Buy ${price}c`;
        const metaText = active ? 'Active' : ownedEffect ? 'Owned' : canAfford ? 'Cheap unlock' : 'Need more coins';
        const previewClass = effectId === 'none' ? '' : `effect-${effectId}`;

        return `
          <div class="effect-card ${ownedEffect ? 'owned' : ''} ${active ? 'active' : ''}">
            <div class="effect-card-head">
              <div class="effect-card-title">${esc(effect.name || getEffectMeta(effectId).name)}</div>
              <div class="effect-price">${price === 0 ? 'FREE' : `${price} COINS`}</div>
            </div>
            <div class="effect-desc">${esc(effect.description || getEffectMeta(effectId).description)}</div>
            <div class="effect-preview ${previewClass}">Preview text for ${esc(effect.name || effectId)}</div>
            <div class="effect-meta">
              <span>${esc(metaText)}</span>
              ${locked ? '<span>Locked</span>' : '<span>Unlocked</span>'}
            </div>
            <div>
              <button class="btn btn-primary btn-sm" data-effect-action="${esc(action)}" data-effect-id="${esc(effectId)}" ${disabled ? 'disabled' : ''}>
                ${esc(buttonText)}
              </button>
            </div>
          </div>
        `;
      }).join('');

      effectsGrid.querySelectorAll('[data-effect-action]').forEach((button) => {
        button.addEventListener('click', async () => {
          const effectId = normalizeEffectId(button.getAttribute('data-effect-id'));
          const action = String(button.getAttribute('data-effect-action') || '');
          try {
            const data = action === 'buy'
              ? await api(`/api/chat-effects/${encodeURIComponent(effectId)}/purchase`, { method: 'POST' })
              : await api('/api/chat-effects/equip', { method: 'POST', body: { effectId } });
            if (data?.user) applyUserSnapshot(data.user);
            renderEffectsGrid();
            renderMessages();
            showMsg(data?.msg || (action === 'buy' ? 'Effect unlocked' : 'Effect equipped'));
          } catch (err) {
            showErr(err.message);
          }
        });
      });

      updateCoinDisplays();
    };

    renderEffectsGrid();

    document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd   = new FormData(e.currentTarget);
      const name = String(fd.get('name') || '').trim();
      const file = document.getElementById('avatar-file')?.files?.[0] || null;
      let avatar = null;
      if (file) {
        avatar = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload  = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(new Error('Failed to read avatar file'));
          reader.readAsDataURL(file);
        });
      }
      try {
        const data = await api('/api/users/profile', { method: 'PUT', body: { name, avatar } });
        if (name) localStorage.setItem('tlkNickname', name);
        localStorage.removeItem('tlkParticipantToken');
        if (data?.user) applyUserSnapshot(data.user);
        else await loadUser();
        renderEffectsGrid();
        showMsg('Profile updated successfully');
      } catch (err) { showErr(err.message); }
    });

    document.getElementById('coin-transfer-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const username = String(fd.get('username') || '').trim();
      const amount = Math.max(0, Number(fd.get('amount') || 0));
      if (!username) { showErr('Recipient username is required'); return; }
      if (!Number.isFinite(amount) || amount <= 0) { showErr('Amount must be greater than 0'); return; }
      try {
        const data = await api('/api/users/transfer-coins', {
          method: 'POST',
          body: { username, amount }
        });
        if (data?.user) applyUserSnapshot(data.user);
        renderEffectsGrid();
        e.currentTarget.reset();
        showMsg(data?.msg || 'Coins sent successfully');
      } catch (err) {
        showErr(err.message);
      }
    });

    document.getElementById('password-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd              = new FormData(e.currentTarget);
      const currentPassword = String(fd.get('currentPassword') || '');
      const newPassword     = String(fd.get('newPassword')     || '');
      const confirmPassword = String(fd.get('confirmPassword') || '');
      if (newPassword !== confirmPassword) { showErr('New passwords do not match'); return; }
      try {
        const data = await api('/api/users/password', { method: 'PUT', body: { currentPassword, newPassword } });
        showMsg(data?.msg || 'Password updated successfully');
        e.currentTarget.reset();
      } catch (err) { showErr(err.message); }
    });
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: ADMIN
  ═══════════════════════════════════════════════════════════════ */
  const renderAdminPage = async () => {
    const role = String(state.user?.role || '').toLowerCase();
    if (!['owner', 'admin'].includes(role)) { navigate('/channels/global'); return; }

    layoutShell(`
      <div class="page-scroll">
        <div class="page-inner" style="max-width:760px">
          <div style="margin-bottom:4px">
            <h1 style="font-size:20px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em">Admin Panel</h1>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px">Server management and moderation tools</p>
          </div>

          <div id="admin-error" class="banner banner-error hidden"></div>

          <div class="card">
            <div class="card-title">System Status</div>
            <div id="ob-status" class="status-line" style="margin-bottom:14px">
              <span class="status-dot" style="background:var(--text-3)"></span>
              <span>Loading status…</span>
            </div>
            <div class="btn-bar" style="margin-bottom:14px">
              <button id="btn-auto-refresh" class="btn btn-ghost btn-sm">Refresh Status</button>
              <button id="btn-auto-start"   class="btn btn-primary btn-sm">Start Automation</button>
              <button id="btn-auto-stop"    class="btn btn-danger btn-sm">Stop Automation</button>
            </div>
            <pre id="auto-active" class="code-block" style="font-size:11.5px;max-height:160px;overflow-y:auto"></pre>
          </div>

          <div class="card">
            <div class="card-title">Moderation Lists</div>
            <p style="font-size:12.5px;color:var(--text-3);margin-bottom:16px">One item per line or comma-separated</p>
            <div class="form-stack">
              <div class="field">
                <label>Banned User Tokens</label>
                <textarea id="mod-users" rows="4" class="inp" style="font-family:var(--font-mono);font-size:12px"></textarea>
              </div>
              <div class="field">
                <label>Banned Accounts (User IDs)</label>
                <textarea id="mod-accounts" rows="4" class="inp" style="font-family:var(--font-mono);font-size:12px"></textarea>
              </div>
              <div class="field">
                <label>Banned Devices</label>
                <textarea id="mod-devices" rows="4" class="inp" style="font-family:var(--font-mono);font-size:12px"></textarea>
              </div>
              <div>
                <button id="btn-mod-save" class="btn btn-primary">Save Moderation Lists</button>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-title">User Management</div>
            <div class="overflow-x-auto">
              <table class="data-table" id="admin-users">
                <thead>
                  <tr>
                    <th>Display Name</th>
                    <th>Username</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colspan="3" style="color:var(--text-3);padding:16px 0">Loading users…</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `);

    const errEl   = document.getElementById('admin-error');
    const setError = (msg) => { if (!msg) { errEl.classList.add('hidden'); return; } errEl.textContent = msg; errEl.classList.remove('hidden'); };
    const parseList = (v) => String(v || '').split(/[\n,]/).map((s) => s.trim()).filter(Boolean);

    const refreshAutomation = async () => {
      try {
        const [status, active] = await Promise.all([api('/api/openbullet/status'), api('/api/openbullet/automation/status')]);
        const online = status?.ok || status?.online;
        document.getElementById('ob-status').innerHTML = `
          <span class="status-dot ${online ? 'status-online' : ''}" style="${!online ? 'background:var(--danger)' : ''}"></span>
          <span>OpenBullet: ${online ? 'online' : (status?.msg || 'offline')}</span>
        `;
        document.getElementById('auto-active').textContent = JSON.stringify(active || {}, null, 2);
      } catch (err) {
        document.getElementById('ob-status').innerHTML =
          `<span class="status-dot" style="background:var(--danger)"></span><span>OpenBullet unavailable: ${esc(err.message)}</span>`;
      }
    };

    try {
      setError('');
      const [users, moderation] = await Promise.all([api('/api/users'), api('/api/network/moderation')]);
      document.getElementById('admin-users').querySelector('tbody').innerHTML =
        (users || []).length === 0
          ? '<tr><td colspan="3" style="color:var(--text-3);padding:16px 0">No users found</td></tr>'
          : (users || []).map((u) => {
              const r = String(u.role || 'user').toLowerCase();
              const roleClass = r === 'owner' ? 'role-owner' : r === 'admin' ? 'role-admin' : 'role-user';
              return `
                <tr>
                  <td>${esc(u.name || '—')}</td>
                  <td style="font-family:var(--font-mono);font-size:12.5px">${esc(u.username || '')}</td>
                  <td><span class="role-badge ${roleClass}">${esc(r)}</span></td>
                </tr>
              `;
            }).join('');

      document.getElementById('mod-users').value    = (moderation?.bannedUsers    || []).join('\n');
      document.getElementById('mod-accounts').value = (moderation?.bannedAccounts || []).join('\n');
      document.getElementById('mod-devices').value  = (moderation?.bannedDevices  || []).join('\n');
    } catch (err) { setError(err.message); }

    await refreshAutomation();

    document.getElementById('btn-auto-refresh')?.addEventListener('click', async () => { await refreshAutomation(); showToast('Status refreshed'); });
    document.getElementById('btn-auto-start')?.addEventListener('click', async () => {
      try { await api('/api/openbullet/automation/start', { method: 'POST' }); await refreshAutomation(); showToast('Automation started'); }
      catch (err) { setError(err.message); }
    });
    document.getElementById('btn-auto-stop')?.addEventListener('click', async () => {
      try { await api('/api/openbullet/automation/stop', { method: 'POST' }); await refreshAutomation(); showToast('Automation stopped'); }
      catch (err) { setError(err.message); }
    });
    document.getElementById('btn-mod-save')?.addEventListener('click', async () => {
      try {
        await api('/api/network/moderation', {
          method: 'PUT',
          body: {
            bannedUsers:    parseList(document.getElementById('mod-users')?.value),
            bannedAccounts: parseList(document.getElementById('mod-accounts')?.value),
            bannedDevices:  parseList(document.getElementById('mod-devices')?.value)
          }
        });
        showToast('Moderation lists saved');
      } catch (err) { setError(err.message); }
    });
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: SHOP
  ═══════════════════════════════════════════════════════════════ */
  const renderShopPage = async () => {
    layoutShell(`
      <div class="page-scroll">
        <div class="page-inner" style="max-width:720px">
          <div style="margin-bottom:4px">
            <h1 style="font-size:20px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em">Shop</h1>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px">Browse and purchase available products</p>
          </div>

          <div id="shop-error" class="banner banner-error hidden"></div>

          <div class="card">
            <div class="card-title">Products</div>
            <table class="data-table" id="shop-products">
              <tbody><tr><td colspan="4" style="color:var(--text-3);padding:16px 0">Loading…</td></tr></tbody>
            </table>
          </div>

          <div class="card">
            <div class="card-title">Purchase History</div>
            <table class="data-table" id="shop-history">
              <tbody><tr><td colspan="3" style="color:var(--text-3);padding:16px 0">Loading…</td></tr></tbody>
            </table>
          </div>

          <div class="card">
            <div class="card-title">Latest Credentials</div>
            <pre id="shop-creds" class="code-block">No credentials yet</pre>
          </div>
        </div>
      </div>
    `);

    const errorEl  = document.getElementById('shop-error');
    const setError = (msg) => { if (!msg) { errorEl.classList.add('hidden'); return; } errorEl.textContent = msg; errorEl.classList.remove('hidden'); };

    try {
      const [products, history] = await Promise.all([api('/api/shop/products'), api('/api/shop/purchases').catch(() => [])]);

      const table = document.getElementById('shop-products');
      if ((products || []).length === 0) {
        table.innerHTML = '<tbody><tr><td colspan="4" style="color:var(--text-3);padding:16px 0">No products available</td></tr></tbody>';
      } else {
        table.innerHTML = `
          <thead>
            <tr><th>Name</th><th>Price</th><th>Type</th><th></th></tr>
          </thead>
          <tbody>
            ${(products || []).map((p) => `
              <tr>
                <td style="color:var(--text-1);font-weight:500">${esc(p.name)}</td>
                <td style="font-family:var(--font-mono);color:var(--gold)">$${Number(p.price || 0).toFixed(2)}</td>
                <td style="font-family:var(--font-mono);font-size:11.5px;color:var(--text-3)">${esc(p.type || '')}</td>
                <td>
                  <button data-buy-id="${esc(p._id)}" ${p.stock === 0 ? 'disabled' : ''}
                          class="btn btn-primary btn-sm" style="${p.stock === 0 ? 'opacity:0.4;cursor:not-allowed' : ''}">
                    ${p.stock === 0 ? 'Out of Stock' : 'Buy'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>`;
      }

      table.querySelectorAll('[data-buy-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          setError('');
          try {
            const data = await api(`/api/shop/purchase/${encodeURIComponent(btn.getAttribute('data-buy-id'))}`, { method: 'POST' });
            document.getElementById('shop-creds').textContent = String(data?.credentials || 'No credentials returned');
            showToast('Purchase complete!');
          } catch (err) { setError(err.message); }
        });
      });

      const hist = document.getElementById('shop-history');
      if (!Array.isArray(history) || history.length === 0) {
        hist.innerHTML = '<tbody><tr><td colspan="3" style="color:var(--text-3);padding:16px 0">No purchases yet</td></tr></tbody>';
      } else {
        hist.innerHTML = `
          <thead><tr><th>Product</th><th>Date</th><th>Price</th></tr></thead>
          <tbody>${history.map((h) => `
            <tr>
              <td style="color:var(--text-1);font-weight:500">${esc(h?.productId?.name || 'Product')}</td>
              <td style="font-family:var(--font-mono);font-size:12px">${esc(new Date(h?.date || Date.now()).toLocaleString())}</td>
              <td style="font-family:var(--font-mono);color:var(--gold)">$${Number(h?.price || 0).toFixed(2)}</td>
            </tr>`).join('')}
          </tbody>`;
      }
    } catch (err) { setError(err.message); }
  };

  /* ═══════════════════════════════════════════════════════════════
     RENDER: MARKETPLACE
  ═══════════════════════════════════════════════════════════════ */
  const renderMarketplacePage = async () => {
    layoutShell(`
      <div class="page-scroll">
        <div class="page-inner" style="max-width:720px">
          <div style="margin-bottom:4px">
            <h1 style="font-size:20px;font-weight:700;color:var(--text-1);letter-spacing:-0.02em">Marketplace</h1>
            <p style="font-size:13px;color:var(--text-3);margin-top:4px">Order products from verified sellers</p>
          </div>

          <div class="field">
            <input id="market-search" placeholder="Search products…" class="inp" />
          </div>

          <div id="market-error" class="banner banner-error hidden"></div>

          <div class="card" style="padding:0;overflow:hidden">
            <table class="data-table" id="market-table" style="margin:0">
              <tbody><tr><td style="color:var(--text-3);padding:24px">Loading…</td></tr></tbody>
            </table>
          </div>

          <div class="card">
            <div class="card-title">Delivery Content</div>
            <pre id="market-delivery" class="code-block">No order placed yet</pre>
          </div>
        </div>
      </div>
    `);

    const errorEl  = document.getElementById('market-error');
    const table    = document.getElementById('market-table');
    const search   = document.getElementById('market-search');
    let   products = [];

    const setError = (msg) => { if (!msg) { errorEl.classList.add('hidden'); return; } errorEl.textContent = msg; errorEl.classList.remove('hidden'); };

    const render = () => {
      const q        = String(search.value || '').trim().toLowerCase();
      const filtered = products.filter((p) => !q ||
        String(p.name || '').toLowerCase().includes(q) || String(p.description || '').toLowerCase().includes(q));

      if (filtered.length === 0) {
        table.innerHTML = '<tbody><tr><td style="color:var(--text-3);padding:24px">No products found</td></tr></tbody>';
        return;
      }

      table.innerHTML = `
        <thead>
          <tr style="border-bottom:1px solid var(--border-md)">
            <th style="padding:14px 16px">Name</th>
            <th style="padding:14px 16px">Category</th>
            <th style="padding:14px 16px">Price</th>
            <th style="padding:14px 16px"></th>
          </tr>
        </thead>
        <tbody>${filtered.map((p) => `
          <tr>
            <td style="padding:12px 16px;color:var(--text-1);font-weight:500;border-bottom:1px solid var(--border)">${esc(p.name)}</td>
            <td style="padding:12px 16px;border-bottom:1px solid var(--border)">
              ${p.category ? `<span style="background:var(--bg-raised);border:1px solid var(--border-md);border-radius:4px;padding:2px 8px;font-family:var(--font-mono);font-size:11px;color:var(--text-3)">${esc(p.category)}</span>` : '—'}
            </td>
            <td style="padding:12px 16px;font-family:var(--font-mono);color:var(--gold);border-bottom:1px solid var(--border)">$${Number(p.price || 0).toFixed(2)}</td>
            <td style="padding:12px 16px;border-bottom:1px solid var(--border)">
              <button data-order-id="${esc(p._id)}" class="btn btn-primary btn-sm">Order</button>
            </td>
          </tr>
        `).join('')}</tbody>`;

      table.querySelectorAll('[data-order-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          setError('');
          const id = btn.getAttribute('data-order-id');
          try {
            const order = await api(`/api/marketplace/order/${encodeURIComponent(id)}`, { method: 'POST', body: { quantity: 1 } });
            await api(`/api/marketplace/orders/${encodeURIComponent(order._id)}/status`, { method: 'PUT', body: { status: 'completed' } });
            const done = await api(`/api/marketplace/orders/${encodeURIComponent(order._id)}`);
            document.getElementById('market-delivery').textContent = String(done?.deliveryData?.content || 'No delivery content');
            showToast('Order completed!');
          } catch (err) { setError(err.message); }
        });
      });
    };

    search.addEventListener('input', render);

    try {
      const data = await api('/api/marketplace/products');
      products = Array.isArray(data?.products) ? data.products : [];
      render();
    } catch (err) { setError(err.message); }
  };

  /* ═══════════════════════════════════════════════════════════════
     ROUTER
  ═══════════════════════════════════════════════════════════════ */
  const ensureAuthAndData = async () => {
    if (!state.user) await loadUser();
    if (!state.user) { navigate('/login'); return false; }
    if (!state.channels.length) await loadChannels().catch(() => { state.channels = []; });
    return true;
  };

  const router = async () => {
    const path = getHashPath();
    if (!state.user && state.token) await loadUser();
    if (!state.user && !isPublicRoute(path)) { navigate('/login'); return; }
    if ( state.user &&  isPublicRoute(path)) { navigate('/channels/global'); return; }

    if (path.startsWith('/login'))    { renderLogin();    return; }
    if (path.startsWith('/register')) { renderRegister(); return; }

    if (!(await ensureAuthAndData())) return;

    if (path.startsWith('/channels/')) { await renderChatPage(decodeURIComponent(path.split('/')[2] || 'global')); return; }
    if (path === '/' || path === '/channels' || path === '/dashboard') { navigate('/channels/global'); return; }
    if (path.startsWith('/settings'))    { cleanupChatTimers(); await renderSettingsPage();    return; }
    if (path.startsWith('/admin'))       { cleanupChatTimers(); await renderAdminPage();       return; }
    if (path.startsWith('/shop'))        { cleanupChatTimers(); await renderShopPage();        return; }
    if (path.startsWith('/marketplace')) { cleanupChatTimers(); await renderMarketplacePage(); return; }

    navigate('/channels/global');
  };

  const onRouteError = (err) => {
    app.innerHTML = `
      <div style="min-height:100vh;background:var(--bg-void);display:flex;align-items:center;justify-content:center">
        <div style="background:var(--bg-card);border:1px solid var(--border-md);border-radius:var(--radius-xl);padding:32px;color:var(--danger);font-size:13.5px;max-width:420px;text-align:center">
          <div style="font-size:32px;margin-bottom:12px">⚠️</div>
          ${esc(err.message || 'Unexpected error')}
        </div>
      </div>`;
  };

  window.addEventListener('hashchange', () => router().catch(onRouteError));
  window.addEventListener('error', (event) => {
    console.error(event.error || event.message || event);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error(event.reason || event);
  });
  router().catch(onRouteError);
})();
