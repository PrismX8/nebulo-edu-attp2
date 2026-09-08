// Native Nebulo community/account UI. Wallet mutations are authoritative on the server.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => Number(value || 0).toLocaleString();
const tabs = {
  community: ['Rewards', 'Casino', 'Leaderboard', 'Support'],
  account: ['Info', 'Profile', 'Appearance', 'Premium', 'DMs', 'Password', 'Recovery', 'Blocked', 'Sounds'],
};
const defaults = { theme:'nebulo', font:'default', size:13, cursor:'default', volume:35, messageSound:'off', mentionSound:'chime' };
const preferenceKey = 'nebuloCommunityPreferencesV1';
function createRequestId() {
  if(typeof globalThis.crypto?.randomUUID==='function')return globalThis.crypto.randomUUID();
  if(typeof globalThis.crypto?.getRandomValues!=='function')throw new Error('This browser cannot securely identify this action. Open Nebulo over HTTPS and try again.');
  const bytes=globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
const soundboard = [{id:'soft',name:'Soft ping',notes:[440,660]},{id:'chime',name:'Chime',notes:[880,1174]},{id:'levelup',name:'Level up',notes:[523,659,784,1046]},{id:'orbit',name:'Orbit',notes:[392,523,659,523]},{id:'arcade',name:'Arcade',notes:[740,554,830,1108]},{id:'calm',name:'Calm',notes:[294,370,440,587]}];
function readPreferences() { try { return { ...defaults, ...JSON.parse(localStorage.getItem(preferenceKey) || '{}') }; } catch { return {...defaults}; } }
const field = (label, name, value = '', extra = '') => `<label class="ch-field">${esc(label)}<input name="${esc(name)}" value="${esc(value)}" ${extra}></label>`;
const select = (label, name, value, options) => `<label class="ch-field">${esc(label)}<select name="${esc(name)}">${options.map(([id, text]) => `<option value="${esc(id)}" ${String(value)===String(id)?'selected':''}>${esc(text)}</option>`).join('')}</select></label>`;
const button = (text, action, extra='') => `<button type="button" class="ch-button" data-ch-action="${esc(action)}" ${extra}>${esc(text)}</button>`;
const date = value => value ? new Date(value).toLocaleString() : '—';

export function initCommunityHub(deps) {
  const { api, getUser, setUser, openModal, closeModal, toast, openProfileEditor, openCosmetics, applyAccountUpdate } = deps;
  let state = null, mode = 'community', tab = 'Rewards', prefs = readPreferences(), pending = null;
  let busy = false, loadVersion = 0, accountVersion = 0, error = '', result = '', recoveryCodes = [], board = null, staffTickets = null;
  let audio = null, lastSound = 0, returnFocus = null;
  let casinoView = '', held = new Set(), heldRound = '', wager = 10;
  let storeCategory = 'all';
  // New game states
  let minesState = { grid: [], revealed: [], mines: [], multiplier: 1, bet: 10, active: false, crashed: false };
  let crashState = { multiplier: 1, bet: 10, active: false, crashed: false, cashedOut: false, crashPoint: 0 };
  let hlState = { current: null, bet: 10, streak: 0, active: false };
  let guessState = { target: 0, guess: null, attempts: 0, bet: 10, active: false, hint: '' };
  let triviaState = { question: null, options: [], answered: false, bet: 10, active: false };
  const activeSounds = new Set();
  const stopSounds = () => { for(const item of activeSounds){try{item.osc.stop();item.gain.disconnect();}catch{}}activeSounds.clear(); };
  const root = () => document.getElementById('community-hub');
  const premium = () => !!state?.premium?.active;
  const isStaff = () => ['owner','admin'].includes(String(getUser()?.role || '').toLowerCase());
  const applyPreferences = () => {
    const html = document.documentElement;
    const allowedThemes = ['nebulo','midnight', ...(premium() ? ['ocean','forest'] : [])];
    html.dataset.chatTheme = allowedThemes.includes(prefs.theme) ? prefs.theme : 'nebulo';
    html.dataset.chatCursor = premium() && ['crosshair','cell'].includes(prefs.cursor) ? prefs.cursor : 'default';
    html.style.setProperty('--community-chat-font', {default:'Inter, sans-serif',serif:'Georgia, serif',mono:'ui-monospace, monospace'}[prefs.font] || 'Inter, sans-serif');
    html.style.setProperty('--community-chat-size', `${Math.max(12,Math.min(20,Number(prefs.size)||13))}px`);
  };
  applyPreferences();
  function absorb(value) {
    state = value;
    if (getUser() && Number.isFinite(Number(value?.coins))) setUser({ ...getUser(), coins:Number(value.coins) });
    if (getUser() && state) state.coins = getUser().coins;
    applyPreferences();
  }
  document.addEventListener('nebulo-wallet', event => {
    if (state) state.coins = event.detail.coins;
    root()?.querySelectorAll('[data-wallet-coins]').forEach(node => { node.textContent = number(event.detail.coins); });
  });
  function sound(kind, preview=false) {
    const tone = preview ? kind : prefs[kind === 'mention' ? 'mentionSound' : 'messageSound'];
    if (tone === 'off' || (!preview && Date.now()-lastSound < 1000)) return;
    if (!preview && (!audio || audio.state !== 'running')) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended' && preview) void audio.resume();
      if(preview&&!prefs.soundOverlap)stopSounds();
      const notes=(soundboard.find(item=>item.id===tone)||soundboard[0]).notes;
      const duration=notes.length*.15, t = audio.currentTime, gain = audio.createGain();
      gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(Math.max(0,Math.min(100,Number(prefs.volume)||0))/500,t+.015); gain.gain.exponentialRampToValueAtTime(.0001,t+duration); gain.connect(audio.destination);
      const osc = audio.createOscillator(); osc.type = 'sine'; notes.forEach((note,i)=>osc.frequency.setValueAtTime(note,t+i*.15)); osc.connect(gain); osc.start(t); osc.stop(t+duration+.02);
      const item={osc,gain};activeSounds.add(item);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); activeSounds.delete(item); }; lastSound = Date.now();
    } catch { if(preview) toast('Audio is unavailable in this browser','error'); }
  }
  async function load() {
    const version = ++loadVersion;
    try { const data = await api('/api/community/me'); if(version !== loadVersion) return; absorb(data); error=''; }
    catch(e) { if(version !== loadVersion) return; error = e?.data?.msg || 'Could not load your community account. Try again.'; }
    if(root()) render();
  }
  let openSource = 'community';
  function open(nextMode='community', nextTab) {
    openSource = nextMode;
    returnFocus = document.activeElement;
    mode = nextMode; tab = nextTab || tabs[mode][0]; error=''; result=''; board=null; recoveryCodes=[];
    // Reset game states
    minesState = { grid: [], revealed: [], mines: [], multiplier: 1, bet: 10, active: false, crashed: false };
    crashState = { multiplier: 1, bet: 10, active: false, crashed: false, cashedOut: false, crashPoint: 0 };
    hlState = { current: null, bet: 10, streak: 0, active: false };
    guessState = { target: 0, guess: null, attempts: 0, bet: 10, active: false, hint: '' };
    triviaState = { question: null, options: [], answered: false, bet: 10, active: false };
    openModal('<section id="community-hub" class="community-hub" role="dialog" aria-modal="true" aria-labelledby="ch-title"></section>');
    render(); root().querySelector('[data-ch-action="close"]')?.focus();
    void load();
  }
  function heading(title, description='') { return `<header class="ch-section-head"><h3>${esc(title)}</h3>${description?`<p>${esc(description)}</p>`:''}</header>`; }
  function rewards() {
    const daily = state.daily || {}, spin = state.spin || {};
    const coins = number(getUser()?.coins ?? state.coins);
    const streak = Number(daily.streak) || 0;
    const bestStreak = Number(daily.bestStreak) || 0;
    const nextReward = 100 + 25 * (Math.min(streak, 7) - 1);
    const progress = Math.min(100, (streak / 7) * 100);
    return `${heading('Rewards', 'Earn coins for cosmetics and membership. Rewards reset at midnight UTC.')}

      <div class="ch-rewards-hero">
        <div class="ch-rewards-hero-inner">
          <div class="ch-rewards-hero-left">
            <div class="ch-coin-icon" aria-hidden="true">🪙</div>
            <div>
              <div class="ch-rewards-hero-label">Your balance</div>
              <div class="ch-rewards-hero-amount"><span data-wallet-coins>${coins}</span> <small>coins</small></div>
            </div>
          </div>
          <div class="ch-rewards-hero-right">
            <div class="ch-rewards-stat">
              <span class="ch-rewards-stat-value">${number(streak)}</span>
              <span class="ch-rewards-stat-label">Day streak</span>
            </div>
            <div class="ch-rewards-stat-divider"></div>
            <div class="ch-rewards-stat">
              <span class="ch-rewards-stat-value">${number(bestStreak)}</span>
              <span class="ch-rewards-stat-label">Best streak</span>
            </div>
          </div>
        </div>
      </div>

      <section class="ch-rewards-section">
        <div class="ch-rewards-section-head">
          <div class="ch-rewards-section-title">
            <span class="ch-rewards-section-icon" aria-hidden="true">🔥</span>
            <h4>Daily streak</h4>
          </div>
          <span class="ch-rewards-badge">${streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : 'Start today'}</span>
        </div>
        <p class="ch-rewards-section-desc">Claim every day to keep your streak going. Rewards grow each day you claim.</p>
        <div class="ch-streak-bar-track"><div class="ch-streak-bar-fill" style="width:${progress}%"></div></div>
        <div class="ch-streak-bar-labels"><span>Day 1</span><span>Day 7</span></div>
        <ol class="ch-week" aria-label="Seven day reward progression">
          ${Array.from({length:7},(_,i)=>{
            const earned = i < Math.min(7, streak);
            const isNext = i === Math.min(6, streak);
            return `<li class="${earned ? 'earned' : ''} ${isNext && !daily.claimedToday ? 'next' : ''}">
              <span>Day ${i+1}</span>
              <b>${100+i*25}</b>
              ${earned ? '<small class="ch-week-check">✓</small>' : ''}
            </li>`;
          }).join('')}
        </ol>
        <div class="ch-rewards-claim-row">
          ${button(daily.claimedToday ? 'Claimed today' : `Claim ${number(daily.reward || nextReward)} coins`, 'daily', daily.claimedToday ? 'disabled' : 'class="ch-button ch-primary ch-claim-btn"')}
          <span class="ch-muted">${daily.claimedToday ? `Next claim ${esc(date(daily.nextClaimAt))}` : 'Come back tomorrow to keep your streak.'}</span>
        </div>
      </section>

      <section class="ch-rewards-section">
        <div class="ch-rewards-section-head">
          <div class="ch-rewards-section-title">
            <span class="ch-rewards-section-icon" aria-hidden="true">🎁</span>
            <h4>Daily bonus</h4>
          </div>
          ${spin.claimedToday ? '<span class="ch-rewards-badge ch-rewards-badge-done">Claimed</span>' : '<span class="ch-rewards-badge ch-rewards-badge-live">Available</span>'}
        </div>
        <p class="ch-rewards-section-desc">Claim a free daily bonus of 20, 40, 60, 100 or 200 coins. No streak required.</p>
        <div class="ch-rewards-claim-row">
          ${button(spin.claimedToday ? 'Claimed today' : 'Claim bonus', 'spin', spin.claimedToday ? 'disabled' : 'class="ch-button ch-primary ch-claim-btn"')}
          <span class="ch-muted">${spin.claimedToday ? `Next claim ${esc(date(spin.nextClaimAt))}` : 'Reset at midnight UTC.'}</span>
        </div>
      </section>

      <section class="ch-rewards-section ch-rewards-cosmetics-cta">
        <div class="ch-rewards-cosmetics-inner">
          <div class="ch-rewards-cosmetics-icon" aria-hidden="true">✨</div>
          <div>
            <h4>Visit the shop</h4>
            <p>Spend earned coins on cosmetics, boosts, perks, lottery tickets and more.</p>
          </div>
        </div>
        ${button('Open shop', 'cosmetics', 'class="ch-button ch-accent-btn"')}
      </section>

      ${state.recent?.length ? `<section class="ch-rewards-section">
        <div class="ch-rewards-section-head">
          <div class="ch-rewards-section-title">
            <span class="ch-rewards-section-icon" aria-hidden="true">📋</span>
            <h4>Recent activity</h4>
          </div>
        </div>
        <ul class="ch-activity">${state.recent.slice(0,8).map(item => {
          const amt = item.amount ?? item.delta ?? '';
          const isPositive = String(amt).startsWith('+') || Number(amt) > 0;
          return `<li><span>${esc(item.label || item.kind || item.action || 'Wallet activity')}</span><span class="${isPositive ? 'ch-positive' : ''}">${esc(amt)}</span></li>`;
        }).join('')}</ul>
      </section>` : ''}`;
  }
  function store() {
    const s = state.store || {}, items = s.items || [], coins = getUser()?.coins ?? state.coins ?? 0;
    const cats = [{id:'all',label:'All',icon:'🛒'},{id:'spend',label:'Spend',icon:'💸'},{id:'perk',label:'Perks',icon:'⚡'},{id:'cosmetic',label:'Cosmetics',icon:'✨'}];
    const filtered = storeCategory === 'all' ? items : items.filter(i => i.cat === storeCategory);
    const coinBadge = `<span class="ch-store-coins"><span data-wallet-coins>${number(coins)}</span> coins</span>`;
    const categoryBar = `<div class="ch-store-cats">${cats.map(c => `<button type="button" class="ch-store-cat ${storeCategory === c.id ? 'active' : ''}" data-ch-action="store-cat" data-cat="${c.id}">${c.icon} ${c.label}</button>`).join('')}</div>`;

    const statusItems = [];
    if (s.customStatus) statusItems.push({ label: 'Custom status', value: s.customStatus, until: s.customStatusUntil });
    if (s.nameEffect && s.nameEffect !== 'none') statusItems.push({ label: 'Name effect', value: s.nameEffect, until: s.nameEffectUntil });
    if (s.boostActive) statusItems.push({ label: 'Channel boost', value: 'Active', until: s.boostUntil });
    if (s.proxyActive) statusItems.push({ label: 'Proxy priority', value: 'Active', until: s.proxyUntil });
    if (s.uploadActive) statusItems.push({ label: 'Upload boost', value: 'Active', until: s.uploadUntil });
    const activeStatuses = statusItems.length ? `<div class="ch-store-statuses">${statusItems.map(i => `<div class="ch-store-status"><span class="ch-store-status-label">${esc(i.label)}</span><span class="ch-store-status-value">${esc(i.value)}</span><span class="ch-store-status-until">${i.until ? `Until ${esc(date(i.until))}` : ''}</span></div>`).join('')}</div>` : '';

    const lotteryInfo = s.lottery ? `<div class="ch-store-lottery"><div class="ch-store-lottery-inner"><div><span class="ch-store-lottery-label">Weekly lottery</span><span class="ch-store-lottery-pot">${number(s.lottery.pot)} coins in pot</span></div><div class="ch-store-lottery-meta">${s.lottery.tickets > 0 ? `Your tickets: ${number(s.lottery.tickets)}` : 'No tickets yet'}</div></div></div>` : '';

    const itemCards = filtered.map(item => {
      const owned = (item.id === 'name_glow' && s.nameEffect === 'glow') ||
                    (item.id === 'name_rainbow' && s.nameEffect === 'rainbow') ||
                    (item.id === 'badge_star' && (s.ownedBadges || []).includes('badge_star')) ||
                    (item.id === 'badge_verified' && (s.ownedBadges || []).includes('badge_verified')) ||
                    (item.id === 'premium' && state.premium?.active);
      const isActive = (item.id === 'channel_boost' && s.boostActive) ||
                       (item.id === 'proxy_priority' && s.proxyActive) ||
                       (item.id === 'upload_boost' && s.uploadActive);
      const statusBadge = owned ? '<span class="ch-store-badge-owned">Owned</span>' : isActive ? '<span class="ch-store-badge-active">Active</span>' : '';
      const needText = item.id === 'custom_status';
      const btnExtra = needText ? `data-need-text="true"` : '';
      return `<div class="ch-store-item">
        <div class="ch-store-item-icon" aria-hidden="true">${item.icon}</div>
        <div class="ch-store-item-info">
          <h5>${esc(item.name)}</h5>
          <p>${esc(item.desc)}</p>
          ${statusBadge}
        </div>
        <div class="ch-store-item-action">
          ${item.price > 0 ? `<span class="ch-store-price">${number(item.price)} coins</span>` : ''}
          ${item.available === false ? `<button type="button" class="ch-button ch-store-buy" disabled title="${esc(item.unavailableReason || 'Unavailable')}">Unavailable</button>` : owned ? `<button type="button" class="ch-button ch-store-buy" disabled>Owned</button>` :
            item.price > 0 ? `<button type="button" class="ch-button ch-primary ch-store-buy" data-ch-action="store-buy" data-item="${esc(item.id)}" ${coins < item.price ? 'disabled title="Not enough coins"' : ''}>Buy</button>` : ''}
        </div>
      </div>`;
    }).join('');

    return `${heading('Store', 'Spend your coins on cosmetics, boosts and perks.')}
      <div class="ch-store-header">${coinBadge}</div>
      ${activeStatuses}
      ${lotteryInfo}
      ${categoryBar}
      <div class="ch-store-grid">${itemCards || '<p class="ch-empty">No items in this category.</p>'}</div>`;
  }
  function casino() {
    const c=state.casino || {}, round=c.round, active=round?.status==='playing';
    if(active && !casinoView)casinoView=round.game;
    if(heldRound!==round?.id){held.clear();heldRound=round?.id || '';}
    const game=casinoView==='lobby'?'':active?round.game:casinoView, poker=game==='videopoker';
    const title=poker?'Video poker':game==='blackjack'?'Blackjack':game==='higherlower'?'Higher or Lower':game==='mines'?'Mines':game==='numberguess'?'Number Guess':game==='crash'?'Crash':game==='trivia'?'Trivia':'Casino';
    const names={blackjack:'Blackjack',videopoker:'Video poker',higherlower:'Higher or Lower',mines:'Mines',numberguess:'Number Guess',crash:'Crash',trivia:'Trivia'};
    const cards=(items,holdable=false)=>`<div class="ch-cards">${(items || []).map((card,i)=>card.hidden?'<div class="ch-playing-card ch-card-hidden" aria-label="Face-down card"><span>?</span></div>':`<${holdable?'button':'div'} ${holdable?`type="button" data-ch-action="hold" data-index="${i}" aria-pressed="${held.has(i)}" aria-label="${esc(card.label)}, ${held.has(i)?'held':'not held'}"`:''} class="ch-playing-card ${['H','D'].includes(card.suit)?'ch-red':''} ${held.has(i)&&holdable?'is-held':''}"><span>${esc(card.rank)}</span><b>${esc({S:'♠',H:'♥',D:'♦',C:'♣'}[card.suit] || '')}</b>${holdable?`<small>${held.has(i)?'Held':'Hold'}</small>`:''}</${holdable?'button':'div'}>`).join('')}</div>`;
    const history=`<section class="ch-divider"><h4>Recent hands</h4>${c.history?.length?`<ul class="ch-hand-history">${c.history.slice(0,6).map(h=>`<li><div><strong>${esc(names[h.game] || h.game)}</strong><small>${esc(h.outcome)} · ${number(h.stake ?? h.bet)} coin stake</small></div><b class="${h.net>0?'ch-positive':''}">${h.net>0?'+':''}${number(h.net)}<small>coins</small></b></li>`).join('')}</ul>`:'<p class="ch-empty">Your completed hands will appear here.</p>'}</section>`;
    const summary=`<div class="ch-casino-summary"><div><span>Your balance</span><strong><span data-wallet-coins>${number(getUser()?.coins ?? state.coins)}</span> <small>coins</small></strong></div></div>`;
    // Casino lobby
    if(!game)return `${heading('Casino','Bet your site coins on text-based games. Play at your own pace.')}${summary}<div class="ch-game-grid">
      <button class="ch-game-card" data-ch-action="choose-game" data-game="blackjack"><span class="ch-game-icon" aria-hidden="true">🃏</span><h4>Blackjack</h4><p>Hit, stand or double down. Get closer to 21 than the dealer.</p><small>Blackjack pays 3:2 · Dealer stands on 17</small></button>
      <button class="ch-game-card" data-ch-action="choose-game" data-game="videopoker"><span class="ch-game-icon" aria-hidden="true">🂡</span><h4>Video Poker</h4><p>Five cards, one draw. Choose what to hold and build your hand.</p><small>Jacks or Better · Royal flush pays 250×</small></button>
      <button class="ch-game-card" data-ch-action="choose-game" data-game="higherlower"><span class="ch-game-icon" aria-hidden="true">⬆️</span><h4>Higher or Lower</h4><p>Guess if the next card is higher or lower. Build your streak for bigger payouts.</p><small>Streak multiplier · Cash out anytime</small></button>
      <button class="ch-game-card" data-ch-action="choose-game" data-game="mines"><span class="ch-game-icon" aria-hidden="true">💣</span><h4>Mines</h4><p>Reveal tiles on a grid. Avoid mines, collect multipliers.</p><small>5×5 grid · Cash out after each safe tile</small></button>
      <button class="ch-game-card" data-ch-action="choose-game" data-game="numberguess"><span class="ch-game-icon" aria-hidden="true">🔢</span><h4>Number Guess</h4><p>Guess a secret number between 1 and 100. Fewer attempts means bigger wins.</p><small>Up to 7 attempts · Progressive hints</small></button>
      <button class="ch-game-card" data-ch-action="choose-game" data-game="crash"><span class="ch-game-icon" aria-hidden="true">📈</span><h4>Crash</h4><p>Watch the multiplier climb. Cash out before it crashes.</p><small>Random crash point · 2× to 100× potential</small></button>
      <button class="ch-game-card" data-ch-action="choose-game" data-game="trivia"><span class="ch-game-icon" aria-hidden="true">🧠</span><h4>Trivia</h4><p>Answer questions correctly to earn coins. Test your knowledge.</p><small>Multiple categories · Timed answers</small></button>
    </div>${history}`;
    // Game-specific views
    const visible=round?.game===game?round:null;
    // Blackjack
    if(game==='blackjack')return `${heading('Blackjack','Dealer stands on soft 17 · Blackjack pays 3:2')}<div class="ch-table-toolbar">${button('← All games','casino-lobby')}<span>${active?'Hand in progress':'Ready to deal'}</span></div>${summary}<section class="ch-game-table" aria-label="Blackjack table">${visible?`<div class="ch-hand-label">Dealer <span>${active?'One card hidden':number(visible.dealerTotal)}</span></div>${cards(visible.dealer)}<div class="ch-table-rule"></div><div class="ch-hand-label">You<span>${number(visible.playerTotal)}</span></div>${cards(visible.player)}${visible.status==='settled'?`<div class="ch-hand-result" role="status"><strong>${esc(visible.outcome)}</strong><span>${visible.net>0?'+':''}${number(visible.net)} coins · ${number(visible.payout)} returned</span></div>`:`<p class="ch-table-instruction">Choose your next move. Your stake is already placed.</p>`}`:`<div class="ch-table-empty"><span class="ch-table-mark" aria-hidden="true">21</span><h4>Take a seat at the table</h4><p>Place a stake to deal your first two cards.</p></div>`}</section>${active?`<div class="ch-game-actions"><span>Stake <strong>${number(round.stake)} coins</strong></span><div>${round.actions?.map(move=>button({hit:'Hit',stand:'Stand',double:'Double down'}[move] || move,'casino-move',`data-move="${esc(move)}"`)).join('')}</div></div>`:`<form data-ch-form="casino" class="ch-deal-form"><input type="hidden" name="game" value="${esc(game)}">${field('Stake','bet',wager,`type="number" min="1" required`)}<button class="ch-button ch-primary" type="submit">Deal</button></form>`}`;
    // Video Poker
    if(game==='videopoker')return `${heading('Video Poker','Jacks or Better · Five-card draw')}<div class="ch-table-toolbar">${button('← All games','casino-lobby')}<span>${active?'Hand in progress':'Ready to deal'}</span></div>${summary}<section class="ch-game-table" aria-label="Video poker table">${visible?`<div class="ch-hand-label">Your hand<span>${active?'Select cards to hold':'Final hand'}</span></div>${cards(visible.player,poker&&active)}${visible.status==='settled'?`<div class="ch-hand-result" role="status"><strong>${esc(visible.outcome)}</strong><span>${visible.net>0?'+':''}${number(visible.net)} coins · ${number(visible.payout)} returned</span></div>`:`<p class="ch-table-instruction">Hold any cards you want to keep, then draw once.</p>`}`:`<div class="ch-table-empty"><span class="ch-table-mark" aria-hidden="true">J Q K A</span><h4>Make your best five-card hand</h4><p>Deal five cards, hold your favorites and draw replacements.</p></div>`}</section>${active?`<div class="ch-game-actions"><span>Stake <strong>${number(round.stake)} coins</strong></span><div>${button('Draw cards','casino-move','data-move="draw"')}</div></div>`:`<form data-ch-form="casino" class="ch-deal-form"><input type="hidden" name="game" value="${esc(game)}">${field('Stake','bet',wager,`type="number" min="1" required`)}<button class="ch-button ch-primary" type="submit">Deal</button></form>`}`;
    // Higher or Lower
    if(game==='higherlower')return renderHigherLower(summary);
    // Mines
    if(game==='mines')return renderMines(summary);
    // Number Guess
    if(game==='numberguess')return renderNumberGuess(summary);
    // Crash
    if(game==='crash')return renderCrash(summary);
    // Trivia
    if(game==='trivia')return renderTrivia(summary);
    return '';
  }
  // ── Higher or Lower ──────────────────────────────────────────────────────
  function renderHigherLower(summary) {
    const cards = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const suits = ['♠','♥','♦','♣'];
    const suitIdx = hlState.current?.suit ?? 0;
    const currentCard = hlState.current ? { rank: hlState.current.rank, suit: suits[hlState.current.suit] } : null;
    const nextCard = hlState.next ? { rank: hlState.next.rank, suit: suits[hlState.next.suit] } : null;
    const suitColor = (s) => s === '♥' || s === '♦' ? 'ch-red' : '';
    return `${heading('Higher or Lower','Guess if the next card is higher or lower. Build your streak for bigger payouts.')}<div class="ch-table-toolbar">${button('← All games','casino-lobby')}${hlState.active?`<span>Streak: ${hlState.streak}</span>`:''}</div>${summary}<section class="ch-game-table">${hlState.active && currentCard ? `<div class="ch-hl-display"><div class="ch-hl-card ${suitColor(currentCard.suit)}"><span>${currentCard.rank}</span><small>${currentCard.suit}</small></div><span class="ch-hl-arrow">vs</span>${nextCard ? `<div class="ch-hl-card ${suitColor(nextCard.suit)}"><span>${nextCard.rank}</span><small>${nextCard.suit}</small></div>` : `<div class="ch-hl-card" style="background:#2a2d35;border-color:#444"><span style="color:#666">?</span></div>`}</div>${!hlState.revealed ? `<div class="ch-hl-buttons">${button('Higher','hl-guess','data-choice="higher"')}${button('Lower','hl-guess','data-choice="lower"')}</div>` : `<div style="text-align:center;margin-top:14px"><p style="font-size:13px;color:${hlState.won ? 'var(--ch-success)' : 'var(--ch-danger)'};font-weight:550">${hlState.won ? 'Correct!' : 'Wrong!'} ${nextCard ? `${nextCard.rank}${nextCard.suit}` : ''}</p><div style="margin-top:12px">${button('Next card','hl-next')} ${button('Cash out','hl-cashout')}</div></div>`}` : `<div class="ch-table-empty"><span class="ch-table-mark" aria-hidden="true">A K Q</span><h4>Higher or Lower</h4><p>Guess if the next card is higher or lower than the current one. Streak multiplier increases your payout.</p></div>`}</section>${!hlState.active ? `<form data-ch-form="casino" class="ch-deal-form"><input type="hidden" name="game" value="higherlower">${field('Stake','bet',hlState.bet,`type="number" min="1" required`)}<button class="ch-button ch-primary" type="submit">Start</button></form>` : ''}`;
  }
  // ── Mines ────────────────────────────────────────────────────────────────
  function renderMines(summary) {
    const gridSize = 25;
    const mineCount = 5;
    const gridHtml = Array.from({length: gridSize}, (_, i) => {
      const isRevealed = minesState.revealed.includes(i);
      const isMine = minesState.mines.includes(i);
      let cls = 'ch-mines-cell';
      let content = '';
      if(isRevealed) {
        cls += ' ch-mines-revealed';
        if(isMine) { cls += ' ch-mines-mine'; content = '💣'; }
        else { cls += ' ch-mines-safe'; content = minesState.multipliers?.[i] ? `${minesState.multipliers[i]}×` : '✓'; }
      }
      return `<button type="button" class="${cls}" data-ch-action="mines-reveal" data-index="${i}" ${isRevealed ? 'disabled' : ''}>${content}</button>`;
    }).join('');
    return `${heading('Mines','Reveal safe tiles to increase your multiplier. Cash out anytime to collect.')}${button('← All games','casino-lobby')}${summary}${minesState.active ? `<div class="ch-casino-summary" style="margin-top:16px"><div><span>Current multiplier</span><strong>${minesState.multiplier.toFixed(2)}×</strong></div><div><span>Potential win</span><strong>${number(Math.floor(minesState.bet * minesState.multiplier))} coins</strong></div></div>` : ''}<section class="ch-game-table">${minesState.active ? `<div class="ch-mines-grid">${gridHtml}</div><div style="display:flex;justify-content:space-between;margin-top:14px"><span style="font-size:12px;color:var(--ch-muted)">${minesState.revealed.length} tiles revealed · ${mineCount} mines</span><div>${button('Cash out','mines-cashout')}</div></div>` : `<div class="ch-table-empty"><span class="ch-table-mark" aria-hidden="true">💣</span><h4>Mines</h4><p>Avoid mines and collect multipliers. Cash out after each safe tile to lock in your winnings.</p></div>`}</section>${!minesState.active ? `<form data-ch-form="casino" class="ch-deal-form"><input type="hidden" name="game" value="mines">${field('Stake','bet',minesState.bet,`type="number" min="1" required`)}<button class="ch-button ch-primary" type="submit">Start</button></form>` : ''}`;
  }
  // ── Number Guess ─────────────────────────────────────────────────────────
  function renderNumberGuess(summary) {
    const maxAttempts = 7;
    return `${heading('Number Guess','Guess a secret number between 1 and 100. Fewer attempts means bigger wins.')}${button('← All games','casino-lobby')}${summary}<section class="ch-game-table">${guessState.active ? `<div class="ch-guess-display"><div class="ch-guess-range">Attempts: ${guessState.attempts} / ${maxAttempts}</div>${guessState.hint ? `<div class="ch-guess-hint ${guessState.hint.includes('High') ? 'ch-guess-too-high' : guessState.hint.includes('Low') ? 'ch-guess-too-low' : 'ch-guess-correct'}">${esc(guessState.hint)}</div>` : '<div class="ch-guess-hint"></div>'}</div><form data-ch-form="guess" class="ch-deal-form" style="justify-content:center">${field('Your guess','guess','',`type="number" min="1" max="100" required placeholder="1-100"`)}<button class="ch-button ch-primary" type="submit">Guess</button></form>${guessState.attempts >= maxAttempts && !guessState.hint?.includes('Correct') ? `<div style="text-align:center;margin-top:12px"><p style="font-size:12px;color:var(--ch-muted)">The number was ${guessState.target}</p></div>` : ''}` : `<div class="ch-table-empty"><span class="ch-table-mark" aria-hidden="true">1-100</span><h4>Number Guess</h4><p>Guess a number between 1 and 100. Get hints after each guess. Win with fewer attempts for higher payouts.</p></div>`}</section>${!guessState.active ? `<form data-ch-form="casino" class="ch-deal-form"><input type="hidden" name="game" value="numberguess">${field('Stake','bet',guessState.bet,`type="number" min="1" required`)}<button class="ch-button ch-primary" type="submit">Start</button></form>` : ''}`;
  }
  // ── Crash ────────────────────────────────────────────────────────────────
  function renderCrash(summary) {
    const crashClass = crashState.crashed ? 'ch-crash-crashed' : crashState.multiplier < 2 ? 'ch-crash-low' : crashState.multiplier < 5 ? 'ch-crash-mid' : 'ch-crash-high';
    return `${heading('Crash','Watch the multiplier climb. Cash out before it crashes to collect.')}${button('← All games','casino-lobby')}${summary}<section class="ch-game-table">${crashState.active || crashState.crashed || crashState.cashedOut ? `<div class="ch-crash-display"><div class="ch-crash-value ${crashClass}" data-crash-value>${crashState.crashed ? 'CRASHED' : `${crashState.multiplier.toFixed(2)}×`}</div><div class="ch-crash-label" data-crash-label>${crashState.crashed ? `Crashed at ${crashState.crashPoint.toFixed(2)}×` : crashState.cashedOut ? `Cashed out at ${crashState.lastCashout.toFixed(2)}×` : 'Climbing...'}</div>${crashState.active && !crashState.crashed && !crashState.cashedOut ? `<div style="margin-top:20px" data-crash-btn-wrap><button type="button" class="ch-button ch-primary" data-ch-action="crash-cashout" data-crash-cashout-btn>Cash out at ${crashState.multiplier.toFixed(2)}× (${number(Math.floor(crashState.bet * crashState.multiplier))} coins)</button></div>` : ''}${crashState.cashedOut ? `<div style="margin-top:16px"><p style="font-size:14px;font-weight:550;color:var(--ch-success)">Cashed out at ${crashState.lastCashout.toFixed(2)}× · +${number(crashState.lastWin)} coins</p></div>` : ''}${crashState.crashed && !crashState.cashedOut ? `<div style="margin-top:16px"><p style="font-size:14px;font-weight:550;color:var(--ch-danger)">You lost ${number(crashState.bet)} coins</p></div>` : ''}</div>` : `<div class="ch-table-empty"><span class="ch-table-mark" aria-hidden="true">📈</span><h4>Crash</h4><p>The multiplier starts at 1× and climbs randomly. Cash out before it crashes. If it crashes before you cash out, you lose.</p></div>`}</section>${!crashState.active ? `<form data-ch-form="casino" class="ch-deal-form"><input type="hidden" name="game" value="crash">${field('Stake','bet',crashState.bet,`type="number" min="1" required`)}<button class="ch-button ch-primary" type="submit">Start</button></form>` : ''}`;
  }
  // ── Trivia ───────────────────────────────────────────────────────────────
  function renderTrivia(summary) {
    const triviaQuestions = [
      { q: 'What planet is known as the Red Planet?', opts: ['Venus','Mars','Jupiter','Saturn'], correct: 1, cat: 'Science' },
      { q: 'Which element has the chemical symbol "O"?', opts: ['Gold','Osmium','Oxygen','Iron'], correct: 2, cat: 'Science' },
      { q: 'In what year did World War II end?', opts: ['1943','1944','1945','1946'], correct: 2, cat: 'History' },
      { q: 'What is the largest ocean on Earth?', opts: ['Atlantic','Indian','Arctic','Pacific'], correct: 3, cat: 'Geography' },
      { q: 'Which programming language was created by Brendan Eich?', opts: ['Python','Java','JavaScript','C++'], correct: 2, cat: 'Technology' },
      { q: 'What is the speed of light in km/s (approximately)?', opts: ['150,000','200,000','300,000','400,000'], correct: 2, cat: 'Science' },
      { q: 'Which country has the most natural lakes?', opts: ['USA','Russia','Canada','Brazil'], correct: 2, cat: 'Geography' },
      { q: 'What does "HTTP" stand for?', opts: ['HyperText Transfer Protocol','High Tech Transfer Process','Home Tool Transfer Protocol','HyperText Transmission Platform'], correct: 0, cat: 'Technology' },
      { q: 'Which planet has the most moons?', opts: ['Jupiter','Saturn','Uranus','Neptune'], correct: 1, cat: 'Science' },
      { q: 'In what year was the first iPhone released?', opts: ['2005','2006','2007','2008'], correct: 2, cat: 'Technology' },
    ];
    const keys = ['A','B','C','D'];
    return `${heading('Trivia','Answer questions correctly to earn coins. Each correct answer increases your payout.')}${button('← All games','casino-lobby')}${summary}<section class="ch-game-table">${triviaState.active && triviaState.question ? `<div class="ch-trivia-category">${esc(triviaState.question.cat)}</div><div class="ch-trivia-question">${esc(triviaState.question.q)}</div><div class="ch-trivia-options">${triviaState.question.opts.map((opt, i) => `<button type="button" class="ch-trivia-option ${triviaState.answered && i === triviaState.question.correct ? 'ch-trivia-correct' : triviaState.answered && i === triviaState.selected && i !== triviaState.question.correct ? 'ch-trivia-wrong' : ''}" data-ch-action="trivia-answer" data-index="${i}" ${triviaState.answered ? 'disabled' : ''}><span class="ch-trivia-key">${keys[i]}</span>${esc(opt)}</button>`).join('')}</div>${triviaState.answered ? `<div style="text-align:center;margin-top:16px"><p style="font-size:13px;color:${triviaState.correct ? 'var(--ch-success)' : 'var(--ch-danger)'};font-weight:550">${triviaState.correct ? 'Correct!' : 'Wrong!'}</p>${button('Next question','trivia-next')}</div>` : ''}` : `<div class="ch-table-empty"><span class="ch-trivia-key" style="font-size:20px;width:48px;height:48px">?</span><h4>Trivia</h4><p>Test your knowledge and earn coins. Each correct answer pays out based on your stake.</p></div>`}</section>${!triviaState.active ? `<form data-ch-form="casino" class="ch-deal-form"><input type="hidden" name="game" value="trivia">${field('Stake','bet',triviaState.bet,`type="number" min="1" required`)}<button class="ch-button ch-primary" type="submit">Start</button></form>` : ''}`;
  }
  function leaderboard() {
    return `${heading('Community leaderboard','Real standings, updated when you load them.')}<div class="ch-leaderboard-controls">${select('Rank by','metric',board?.metric || 'coins',[['coins','Coins'],['streak','Daily streak'],['wins','Casino wins']])}${button('Refresh standings','leaderboard')}</div>
      ${board?board.entries?.length?`<ol class="ch-leaderboard">${board.entries.map((entry,i)=>`<li><span class="ch-rank">${i+1}</span><div><strong>${esc(entry.displayName || entry.username)}</strong><small>@${esc(entry.username)}</small></div><b>${number(entry[board.metric])}</b></li>`).join('')}</ol>`:'<p class="ch-empty">No standings yet. Claim your daily reward to get started.</p>':'<p class="ch-empty">Choose a ranking and load the standings.</p>'}`;
  }
  function support() {
    return `${heading('Support', 'Ask for help or report a problem. Do not send passwords or recovery codes.')}
      <form class="ch-form" data-ch-form="support">${field('Subject','subject','','required maxlength="100" placeholder="What can we help with?"')}<label class="ch-field">Details<textarea name="body" required maxlength="2000" rows="4" placeholder="What happened, and what did you expect?"></textarea></label><button type="submit" class="ch-button ch-primary">Send support request</button></form>
      <section class="ch-divider"><h4>Your requests</h4>${state.tickets?.length?state.tickets.map(ticket=>`<article class="ch-ticket"><div class="ch-row"><strong>${esc(ticket.subject)}</strong><span class="ch-badge">${esc(ticket.status)}</span></div><p>${esc(ticket.body)}</p>${ticket.reply?`<div class="ch-note"><b>Staff reply</b><p>${esc(ticket.reply)}</p></div>`:'<small>Awaiting a reply</small>'}</article>`).join(''):'<p class="ch-empty">No support requests yet.</p>'}</section>
      ${isStaff()?`<section class="ch-divider">${button('Open staff inbox','staff')}${staffTickets?staffTickets.length?staffTickets.map(ticket=>`<form class="ch-ticket ch-form" data-ch-form="staff" data-ticket="${esc(ticket.id)}" data-user="${esc(ticket.userId)}"><h4>${esc(ticket.subject)}</h4><small>@${esc(ticket.username)} · ${esc(date(ticket.createdAt))}</small><p>${esc(ticket.body)}</p><label class="ch-field">Reply<textarea name="reply" maxlength="2000" rows="3">${esc(ticket.reply)}</textarea></label>${select('Status','status',ticket.status,[['open','Open'],['closed','Closed']])}<button class="ch-button" type="submit">Save reply & status</button></form>`).join(''):'<p class="ch-empty">The support inbox is clear.</p>':''}</section>`:''}`;
  }
  function account() {
    const user = getUser() || {}, p = state.profile || {}, privacy = state.privacy || {};
    switch(tab) {
      case 'Info': return `${heading('Account overview','Manage your identity, preferences and account security.')}<div class="ch-identity"><span class="ch-avatar">${esc((user.displayName || user.username || "N").slice(0,1).toUpperCase())}</span><div><strong>${esc(user.displayName || user.username)}</strong><p>@${esc(user.username)}</p></div><span class="ch-badge">${premium()?"Premium":"Member"}</span></div><dl class="ch-info"><div><dt>Display name</dt><dd>${esc(user.displayName || user.username)}</dd></div><div><dt>Username</dt><dd>@${esc(user.username)}</dd></div><div><dt>Role</dt><dd>${esc(user.role || 'Member')}</dd></div><div><dt>Coins</dt><dd data-wallet-coins>${number(getUser()?.coins ?? state.coins)}</dd></div><div><dt>Membership</dt><dd>${premium()?'Premium active':'Free member'}</dd></div></dl><div class="ch-row" style="gap:10px">${button('Edit name & avatar','profile-editor')} ${button('Community rewards','community')}</div>`;
      case 'Profile': return `${heading('Profile details','Name and avatar editing are in your profile editor.')}${button('Edit name & avatar','profile-editor')}<form class="ch-form ch-divider" data-ch-form="profile"><label class="ch-field">About me<textarea name="bio" maxlength="280" rows="3" placeholder="Tell others about yourself...">${esc(p.bio)}</textarea></label><div class="ch-two">${field('Pronouns','pronouns',p.pronouns,'maxlength="40" placeholder="e.g. they/them"')}${field('Favorite game','favoriteGame',p.favoriteGame,'maxlength="60" placeholder="e.g. Chess"')}</div>${field('Birthday (MM-DD)','birthday',p.birthday,'pattern="[0-9]{2}-[0-9]{2}" placeholder="MM-DD"')}${field('Profile name color (Premium)','nameColor',p.nameColor || '#60a5fa',`type="color" ${premium()?'':'disabled'}`)}<p class="ch-muted">These details are visible to other members. Leave anything private blank.</p><button type="submit" class="ch-button ch-primary">Save profile</button></form>`;
      case 'Appearance': return `${heading('Appearance','Saved on this browser. Message and animation settings are separate.')}<form class="ch-form" data-ch-form="appearance">${select('Theme','theme',prefs.theme,[['nebulo','Nebulo blue'],['midnight','Midnight'],...(premium()?[['ocean','Ocean · Premium'],['forest','Forest · Premium']]:[])])}<div class="ch-two">${select('Message font','font',prefs.font,[['default','Inter'],['serif','Serif'],['mono','Monospace']])}${select('Message text size','size',prefs.size,[12,13,14,16,18,20].map(i=>[i,`${i}px`]))}</div>${select('Cursor','cursor',prefs.cursor,[['default','Default'],...(premium()?[['crosshair','Crosshair · Premium'],['cell','Cell · Premium']]:[])])}<div class="ch-message-preview"><strong>Nebulo</strong><p>A familiar place. Your messages, your style.</p></div><button type="submit" class="ch-button ch-primary">Save appearance</button></form>${premium()?'':'<p class="ch-muted">Ocean, Forest and alternate cursors unlock with earned-coin Premium.</p>'}`;
      case 'Premium': return `${heading('Premium membership','Use site coins, not a credit card. No recurring charge.')}<div class="ch-premium"><span class="ch-eyebrow">NEBULO PREMIUM</span><h4>Additional personalization</h4><ul><li>Ocean and Forest chat themes</li><li>Crosshair and Cell cursors</li><li>Your own profile name color</li></ul><strong>${number(state.premium?.price || 2000)} coins <small>/ ${state.premium?.days || 30} days</small></strong><p>${premium()?`Active until ${esc(date(state.premium.expiresAt))}`:'Get coins from daily rewards, bonuses and chat participation.'}</p>${button(premium()?'Extend membership':'Activate Premium','premium')}</div>`;
      case 'DMs': return `${heading('Messages & privacy','Choose who can start conversations and send friend requests.')}<form class="ch-form" data-ch-form="privacy">${select('Who can message me','dms',privacy.dms || 'everyone',[['everyone','Everyone'],['friends','Friends only'],['none','No one']])}${select('Who can send friend requests','friendRequests',privacy.friendRequests || 'everyone',[['everyone','Everyone'],['mutual','People with mutual friends'],['none','No one']])}<button type="submit" class="ch-button ch-primary">Save privacy</button></form>`;
      case 'Password': return `${heading('Change password','Your current password protects this change.')}<form class="ch-form" data-ch-form="password">${field('Current password','currentPassword','','type="password" autocomplete="current-password" required')}${field('New password','newPassword','','type="password" autocomplete="new-password" minlength="8" maxlength="128" required')}${field('Confirm new password','confirmPassword','','type="password" autocomplete="new-password" minlength="8" maxlength="128" required')}<button type="submit" class="ch-button ch-primary">Update password</button></form>`;
      case 'Recovery': return `${heading('Account recovery','One-use recovery codes can reset your password if you lose access.')}<p>${number(state.recovery?.remaining)} unused codes remaining.</p><aside class="ch-note">Generating a new set invalidates your old codes. Store these somewhere private, outside this browser. Never share them with support.</aside><form class="ch-form" data-ch-form="recovery">${field('Confirm current password','currentPassword','','type="password" autocomplete="current-password" required')}<button type="submit" class="ch-button ch-primary">Generate new recovery codes</button></form>${recoveryCodes.length?`<section class="ch-codes"><h4>Save these now. They are shown only once.</h4><pre>${recoveryCodes.map(esc).join('\n')}</pre>${button('Copy codes','copy-codes')}</section>`:''}`;
      case 'Blocked': return `${heading('Blocked accounts','Block unwanted contact. You can undo this at any time.')}<form class="ch-form ch-inline" data-ch-form="block">${field('Username','username','','required maxlength="80" placeholder="username"')}<button type="submit" class="ch-button">Block account</button></form><ul class="ch-blocked">${state.blocked?.length?state.blocked.map(person=>`<li><span>@${esc(person.username)}</span>${button('Unblock','unblock',`data-id="${esc(person.id)}"`)}</li>`).join(''):'<li class="ch-empty">No blocked accounts.</li>'}</ul>`;
      case 'Sounds': return `${heading('Sounds','Gentle synthesized sounds. Nothing downloads, and nothing plays until you enable audio here.')}<form class="ch-form" data-ch-form="sounds">${select('New messages','messageSound',prefs.messageSound,[['off','Off'],['soft','Soft ping'],['chime','Chime']])}${select('Mentions & direct messages','mentionSound',prefs.mentionSound,[['off','Off'],['soft','Soft ping'],['chime','Chime']])}<label class="ch-field">Notification volume<input name="volume" type="range" min="0" max="100" value="${Number(prefs.volume)||0}"></label><div class="ch-row">${button('Preview soft ping','preview-soft')}${button('Preview chime','preview-chime')}</div><button type="submit" class="ch-button ch-primary">Save & enable sounds</button></form><p class="ch-muted">Preferences stay on this browser. Voice call volume remains in Settings → Voice & Audio.</p>${renderSoundboard()}`;
      default: return '';
    }
  }
  function renderSoundboard(){
    const favorites=Array.isArray(prefs.soundFavorites)?prefs.soundFavorites:[];
    return `<section class="ch-divider"><div class="ch-row"><div><h4>Soundboard</h4><p>Local playback only — not broadcast to the room or a call.</p></div>${button('Stop all','stop-sounds')}</div><label class="ch-field ch-sound-search">Find a sound<input type="search" data-ch-sound-search placeholder="Search sounds"></label><div class="ch-sound-options"><label><input type="checkbox" data-ch-favorites-only> Favorites only</label><label><input type="checkbox" data-ch-overlap ${prefs.soundOverlap?'checked':''}> Allow overlap</label></div><ul class="ch-sound-list">${soundboard.map(item=>`<li data-sound-name="${esc(item.name.toLowerCase())}" data-sound-favorite="${favorites.includes(item.id)}">${button(item.name,'sound',`data-sound="${item.id}" aria-label="Play ${item.name}"`)}${button(favorites.includes(item.id)?'★':'☆','favorite-sound',`data-sound="${item.id}" aria-label="Favorite ${item.name}" aria-pressed="${favorites.includes(item.id)}"`)}</li>`).join('')}</ul><p class="ch-empty" data-ch-no-sounds hidden>No sounds match this filter.</p></section>`;
  }
  function render() {
    const el=root(); if(!el)return;
    const user=getUser() || {};
    const labels={Info:'Overview',DMs:'Messages & privacy',Premium:'Membership',Blocked:'Blocked accounts'};
    const visibleGroups = openSource === 'account' ? [['account', tabs.account]] : Object.entries(tabs);
    el.innerHTML=`<aside class="ch-sidebar"><div class="ch-brand">Nebulo<span>${openSource === 'account' ? 'Account settings' : 'Community'}</span></div><nav class="ch-navigation" aria-label="Account and community sections">${visibleGroups.map(([group,items])=>`<div class="ch-nav-group"><h3>${group==='account'?'Account':'Community'}</h3>${items.map(name=>`<button type="button" data-ch-tab="${name}" data-ch-mode="${group}" aria-current="${mode===group&&tab===name?'page':'false'}">${labels[name] || name}${name==='Casino'?'<span class="ch-nav-tag">Play</span>':''}</button>`).join('')}</div>`).join('')}</nav><div class="ch-sidebar-user"><span class="ch-avatar">${esc((user.displayName || user.username || 'N').slice(0,1).toUpperCase())}</span><div><strong>${esc(user.displayName || user.username || 'Your account')}</strong><small><span data-wallet-coins>${number(user.coins ?? state?.coins)}</span> site coins</small></div></div></aside><div class="ch-workspace"><header class="ch-header"><h2 id="ch-title">${mode==='account'?'Account':'Community'}<span>/</span>${labels[tab] || tab}</h2>${button('×','close','aria-label="Close account and community"')}</header><main class="ch-body" aria-busy="${busy}">${error?`<div class="ch-error" role="alert">${esc(error)}</div>`:''}${result?`<div class="ch-result" role="status">${esc(result)}</div>`:''}${pending&&!busy?`<aside class="ch-note">The last action could not be confirmed. Retry checks the same request; it will not charge twice. ${button('Retry last action','retry')}</aside>`:''}${state?(mode==='account'?account():({Rewards:rewards,Casino:casino,Leaderboard:leaderboard,Support:support}[tab] || rewards)()):`<p class="ch-empty">${error?'Your account could not be loaded.':'Loading your account…'}</p>${error?button('Try again','reload'):''}`}</main><footer class="ch-footer"><span>${busy?'Saving changes…':'Nebulo community'}</span><span>${mode==='account'?'Your settings, in one place':'Bet your coins and play'}</span></footer></div>`;
    if(busy) el.querySelectorAll('form button, [data-ch-action]:not([data-ch-action="close"]), [data-ch-tab]').forEach(b=>b.disabled=true);
    el.onclick = click;
    el.onsubmit = submit;
    el.oninput = event => {
      if(event.target.matches('[data-ch-overlap]')){prefs.soundOverlap=event.target.checked;try{localStorage.setItem(preferenceKey,JSON.stringify(prefs));}catch{}}
      if(event.target.matches('[data-ch-sound-search],[data-ch-favorites-only]'))filterSounds();
    };
    el.onkeydown = event => {
      if(event.key==='Escape'){event.preventDefault();finish();}
      if(event.key==='Tab'){
        const nodes=[...el.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]')];
        const first=nodes[0],last=nodes[nodes.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    };
  }
  function filterSounds(){
    const query=(root()?.querySelector('[data-ch-sound-search]')?.value||'').toLowerCase(), favoritesOnly=root()?.querySelector('[data-ch-favorites-only]')?.checked;
    let count=0;root()?.querySelectorAll('[data-sound-name]').forEach(item=>{item.hidden=!item.dataset.soundName.includes(query)||(favoritesOnly&&item.dataset.soundFavorite!=='true');if(!item.hidden)count++;});
    const empty=root()?.querySelector('[data-ch-no-sounds]');if(empty)empty.hidden=count>0;
  }
  function finish() { recoveryCodes=[]; root()?.querySelector('.ch-codes')?.remove(); closeModal(); returnFocus?.focus?.(); }
  async function task(work, success='Saved') {
    if(busy)return;
    const version=accountVersion;
    busy=true;error='';result='';render();
    try { const data=await work(); if(version!==accountVersion)return; if(data?.state)absorb(data.state); else if(data && 'coins' in data)absorb(data); if(success)result=success; }
    catch(e){if(version===accountVersion)error=e?.data?.msg || e?.message || 'Something went wrong. Please try again.';}
    finally{if(version===accountVersion){busy=false;render();}}
  }
  async function mutate(payload) {
    if(busy)return;
    if(pending&&payload!==pending){error='Resolve the previous action with Retry before starting another.';render();return;}
    try{pending = pending || {...payload,requestId:createRequestId()};}
    catch(e){error=e.message;render();return;}
    const version=accountVersion;
    await task(async()=>{
      try{
        const data=await api('/api/community/action',{method:'POST',body:pending});
        if(version!==accountVersion)return;
        pending=null;
        const r=data.result || {};
        result=r.msg || (r.kind==='casino'?`${r.win?'You won':'No win this time'} · result ${r.outcome} · payout ${number(r.payout)} play coins`:`Received ${number(r.coinsEarned)} coins`);
        if(data.state)absorb(data.state);
        return null;
      }catch(e){if(version===accountVersion&&e.status && e.status<500){pending=null;if(e.status===409)await load();}throw e;}
    },'');
  }
  async function click(event) {
    const nav=event.target.closest('[data-ch-tab]');
    if(nav&&!busy){
      const nextMode=nav.dataset.chMode || mode;
      if(openSource==='account' && nextMode!=='account') return;
      tab=nav.dataset.chTab;mode=nextMode;error='';result='';recoveryCodes=[];render();root()?.querySelector(`[data-ch-tab="${tab}"]`)?.focus();if(tab==='Leaderboard')await fetchBoard();return;
    }
    const target=event.target.closest('[data-ch-action]'); if(!target)return;
    const action=target.dataset.chAction;
    if(action==='close')return finish();
    if(busy)return;
    if(action==='reload')return load();
    if(action==='choose-game'){casinoView=target.dataset.game;result='';render();return;}
    if(action==='casino-lobby'){casinoView='lobby';render();return;}
    if(action==='hold'){const i=Number(target.dataset.index);if(held.has(i))held.delete(i);else held.add(i);render();root()?.querySelector(`[data-ch-action="hold"][data-index="${i}"]`)?.focus();return;}
    if(action==='casino-move'){const r=state?.casino?.round;if(!r || r.status!=='playing')return;return mutate({action:'casino',game:r.game,move:target.dataset.move,roundId:r.id,version:r.version,...(target.dataset.move==='draw'?{hold:[...held].sort((a,b)=>a-b)}:{})});}
    // Higher or Lower actions
    if(action==='hl-guess'){return handleHigherLowerGuess(target.dataset.choice);}
    if(action==='hl-next'){return handleHigherLowerNext();}
    if(action==='hl-cashout'){return handleHigherLowerCashout();}
    // Mines actions
    if(action==='mines-reveal'){return handleMinesReveal(Number(target.dataset.index));}
    if(action==='mines-cashout'){return handleMinesCashout();}
    // Crash actions
    if(action==='crash-cashout'){return handleCrashCashout();}
    // Trivia actions
    if(action==='trivia-answer'){return handleTriviaAnswer(Number(target.dataset.index));}
    if(action==='trivia-next'){return handleTriviaNext();}
    if(action==='stop-sounds')return stopSounds();
    if(action==='sound'){prefs.volume=Number(root().querySelector('[name="volume"]')?.value || prefs.volume);return sound(target.dataset.sound,true);}
    if(action==='favorite-sound'){
      const favorites=new Set(Array.isArray(prefs.soundFavorites)?prefs.soundFavorites:[]), id=target.dataset.sound;
      if(favorites.has(id))favorites.delete(id);else favorites.add(id);
      prefs.soundFavorites=[...favorites];try{localStorage.setItem(preferenceKey,JSON.stringify(prefs));}catch{}
      target.setAttribute('aria-pressed',String(favorites.has(id)));target.textContent=favorites.has(id)?'★':'☆';target.closest('li').dataset.soundFavorite=String(favorites.has(id));filterSounds();return;
    }
    if(action==='account'||action==='community'){mode=action;tab=tabs[mode][0];recoveryCodes=[];render();return;}
    if(action==='profile-editor'){recoveryCodes=[];return openProfileEditor();}
    if(action==='cosmetics'){finish();return openCosmetics();}
    if(action==='store-cat'){storeCategory=target.dataset.cat||'all';result='';render();return;}
    if(action==='store-buy'){
      const itemId=target.dataset.item;
      if(itemId==='custom_status'){
        const text=prompt('Enter your custom status:');
        if(!text)return;
        return mutate({action:'buy_store',itemId,text});
      }
      if(itemId==='premium') return mutate({action:'premium'});
      return mutate({action:'buy_store',itemId});
    }
    if(['daily','spin','premium'].includes(action))return mutate({action});
    if(action==='retry')return pending&&mutate(pending);
    if(action==='leaderboard')return fetchBoard();
    if(action==='unblock')return task(()=>api(`/api/community/blocked/${encodeURIComponent(target.dataset.id)}`,{method:'DELETE'}),'Account unblocked');
    if(action==='staff')return task(async()=>{staffTickets=(await api('/api/community/support/admin')).tickets || [];},'Inbox loaded');
    if(action==='preview-soft'||action==='preview-chime'){prefs.volume=Number(root().querySelector('[name="volume"]')?.value || 0);return sound(action==='preview-soft'?'soft':'chime',true);}
    if(action==='copy-codes'){
      try{await navigator.clipboard.writeText(recoveryCodes.join('\n'));toast('Codes copied. Save them privately.','success');}catch{toast('Copy is unavailable. Select and copy the codes shown.','error');}
    }
  }
  // ── Higher or Lower handlers ──────────────────────────────────────────────
  function generateCard() {
    const rank = Math.floor(Math.random() * 13);
    const suit = Math.floor(Math.random() * 4);
    return { rank, suit };
  }
  function cardValue(card) { return card.rank + 2; }
  async function handleHigherLowerGuess(choice) {
    if(!hlState.active || hlState.revealed) return;
    hlState.next = generateCard();
    hlState.revealed = true;
    const currentVal = cardValue(hlState.current);
    const nextVal = cardValue(hlState.next);
    hlState.won = (choice === 'higher' && nextVal > currentVal) || (choice === 'lower' && nextVal < currentVal) || (nextVal === currentVal);
    if(hlState.won) {
      hlState.streak++;
      result = `Correct! Streak: ${hlState.streak}`;
    } else {
      result = `Wrong! The card was ${hlState.next.rank + 2}${['♠','♥','♦','♣'][hlState.next.suit]}`;
      hlState.active = false;
    }
    render();
  }
  async function handleHigherLowerNext() {
    hlState.current = hlState.next || hlState.current;
    hlState.next = null;
    hlState.revealed = false;
    render();
  }
  async function handleHigherLowerCashout() {
    const payout = Math.floor(hlState.bet * (1 + hlState.streak * 0.5));
    result = `Cashed out with ${hlState.streak} streak! +${number(payout)} coins`;
    hlState.active = false;
    await mutate({action:'casino',game:'higherlower',move:'cashout',bet:hlState.bet,streak:hlState.streak,roundId:hlState.roundId,version:hlState.version});
  }
  // ── Mines handlers ───────────────────────────────────────────────────────
  async function handleMinesReveal(index) {
    if(!minesState.active || minesState.revealed.includes(index)) return;
    if(minesState.mines.includes(index)) {
      // Hit a mine
      minesState.revealed = [...minesState.mines];
      minesState.crashed = true;
      result = `Boom! You hit a mine. Lost ${number(minesState.bet)} coins.`;
      minesState.active = false;
      api('/api/community/action',{method:'POST',body:{action:'casino',game:'mines',move:'crash',bet:minesState.bet,roundId:minesState.roundId,version:minesState.version,requestId:createRequestId()}}).then(d=>{if(d.state)absorb(d.state);}).catch(()=>{});
    } else {
      // Safe tile — send reveal to the server and update from its response
      await mutate({action:'casino',game:'mines',move:'reveal',index,bet:minesState.bet,roundId:minesState.roundId,version:minesState.version});
      const round = state?.casino?.round;
      if(round && round.game === 'mines' && round.status === 'playing') {
        minesState.version = round.version;
        minesState.revealed = round.gameData?.revealed ?? minesState.revealed;
        minesState.multiplier = round.gameData?.multiplier ?? minesState.multiplier;
      }
      result = `Safe! Multiplier now ${minesState.multiplier.toFixed(2)}×`;
    }
    render();
  }
  async function handleMinesCashout() {
    if(!minesState.active || minesState.revealed.length === 0) return;
    const payout = Math.floor(minesState.bet * minesState.multiplier);
    result = `Cashed out at ${minesState.multiplier.toFixed(2)}×! +${number(payout)} coins`;
    minesState.active = false;
    await mutate({action:'casino',game:'mines',move:'cashout',bet:minesState.bet,multiplier:minesState.multiplier,roundId:minesState.roundId,version:minesState.version});
  }
  // ── Crash handlers ───────────────────────────────────────────────────────
  let crashInterval = null;
  function handleCrashCashout() {
    if(!crashState.active || crashState.crashed || crashState.cashedOut) return;
    crashState.cashedOut = true;
    crashState.active = false;
    crashState.lastCashout = crashState.multiplier;
    crashState.lastWin = Math.floor(crashState.bet * crashState.multiplier);
    result = `Cashed out at ${crashState.lastCashout.toFixed(2)}×! +${number(crashState.lastWin)} coins`;
    if(crashInterval) cancelAnimationFrame(crashInterval);
    const r = root();
    if(r) {
      const valEl = r.querySelector('[data-crash-value]');
      const lblEl = r.querySelector('[data-crash-label]');
      const btnWrap = r.querySelector('[data-crash-btn-wrap]');
      if(valEl) { valEl.textContent = `${crashState.lastCashout.toFixed(2)}×`; valEl.className = 'ch-crash-value ch-crash-high'; }
      if(lblEl) lblEl.textContent = `Cashed out at ${crashState.lastCashout.toFixed(2)}×`;
      if(btnWrap) btnWrap.outerHTML = `<div style="margin-top:16px"><p style="font-size:14px;font-weight:550;color:var(--ch-success)">Cashed out at ${crashState.lastCashout.toFixed(2)}× · +${number(crashState.lastWin)} coins</p></div>`;
    }
    mutate({action:'casino',game:'crash',move:'cashout',bet:crashState.bet,multiplier:crashState.lastCashout,roundId:crashState.roundId,version:crashState.version}).then(d=>{if(d.state)absorb(d.state);}).catch(()=>{});
  }
  // ── Trivia handlers ──────────────────────────────────────────────────────
  async function handleTriviaAnswer(index) {
    if(!triviaState.active || triviaState.answered || !triviaState.question) return;
    triviaState.answered = true;
    triviaState.selected = index;
    triviaState.correct = index === triviaState.question.correct;
    if(triviaState.correct) {
      result = `Correct! +${number(triviaState.bet)} coins`;
      await mutate({action:'casino',game:'trivia',move:'answer',bet:triviaState.bet,correct:true,roundId:triviaState.roundId,version:triviaState.version});
    } else {
      result = `Wrong! The answer was ${triviaState.question.opts[triviaState.question.correct]}`;
      await mutate({action:'casino',game:'trivia',move:'answer',bet:triviaState.bet,correct:false,roundId:triviaState.roundId,version:triviaState.version});
    }
    render();
  }
  async function handleTriviaNext() {
    const questions = [
      { q: 'What planet is known as the Red Planet?', opts: ['Venus','Mars','Jupiter','Saturn'], correct: 1, cat: 'Science' },
      { q: 'Which element has the chemical symbol "O"?', opts: ['Gold','Osmium','Oxygen','Iron'], correct: 2, cat: 'Science' },
      { q: 'In what year did World War II end?', opts: ['1943','1944','1945','1946'], correct: 2, cat: 'History' },
      { q: 'What is the largest ocean on Earth?', opts: ['Atlantic','Indian','Arctic','Pacific'], correct: 3, cat: 'Geography' },
      { q: 'Which programming language was created by Brendan Eich?', opts: ['Python','Java','JavaScript','C++'], correct: 2, cat: 'Technology' },
      { q: 'What is the speed of light in km/s (approximately)?', opts: ['150,000','200,000','300,000','400,000'], correct: 2, cat: 'Science' },
      { q: 'Which country has the most natural lakes?', opts: ['USA','Russia','Canada','Brazil'], correct: 2, cat: 'Geography' },
      { q: 'What does "HTTP" stand for?', opts: ['HyperText Transfer Protocol','High Tech Transfer Process','Home Tool Transfer Protocol','HyperText Transmission Platform'], correct: 0, cat: 'Technology' },
      { q: 'Which planet has the most moons?', opts: ['Jupiter','Saturn','Uranus','Neptune'], correct: 1, cat: 'Science' },
      { q: 'In what year was the first iPhone released?', opts: ['2005','2006','2007','2008'], correct: 2, cat: 'Technology' },
    ];
    triviaState.question = questions[Math.floor(Math.random() * questions.length)];
    triviaState.answered = false;
    triviaState.selected = null;
    triviaState.correct = null;
    render();
  }
  async function fetchBoard(){const metric=root()?.querySelector('[name="metric"]')?.value || 'coins';return task(async()=>{board=await api(`/api/community/leaderboard?metric=${encodeURIComponent(metric)}`);},'Standings updated');}
  async function submit(event) {
    const form=event.target.closest('[data-ch-form]');if(!form)return;event.preventDefault();if(busy)return;
    const values=Object.fromEntries(new FormData(form)), type=form.dataset.chForm;
    if(type==='casino'){
      if(Number(values.bet)>Number(getUser()?.coins || state.coins || 0)){error='Not enough coins. Claim a daily reward or bonus to earn more.';render();return;}
      wager=Number(values.bet);
      // Handle new game types client-side
      if(values.game==='higherlower'){
        return task(async()=>{
          const data = await api('/api/community/action',{method:'POST',body:{action:'casino',game:'higherlower',move:'deal',bet:wager,requestId:createRequestId()}});
          if(data.state) absorb(data.state);
          const round = state?.casino?.round;
          if(!round || round.game !== 'higherlower') throw new Error('Failed to start Higher or Lower.');
          hlState.bet = wager; hlState.active = true; hlState.streak = 0; hlState.revealed = false;
          hlState.current = {rank: round.gameData.currentCard, suit: Math.floor(Math.random()*4)};
          hlState.next = null; hlState.roundId = round.id; hlState.version = round.version;
          result = 'Game started! Guess if the next card is higher or lower.';
        },'');
      }
      if(values.game==='mines'){
        return task(async()=>{
          const data = await api('/api/community/action',{method:'POST',body:{action:'casino',game:'mines',move:'deal',bet:wager,requestId:createRequestId()}});
          if(data.state) absorb(data.state);
          const round = state?.casino?.round;
          if(!round || round.game !== 'mines') throw new Error('Failed to start Mines.');
          minesState.bet = wager; minesState.active = true; minesState.crashed = false;
          minesState.revealed = []; minesState.multiplier = 1; minesState.multipliers = {};
          minesState.mines = round.gameData.mines || []; minesState.roundId = round.id; minesState.version = round.version;
          result = 'Game started! Reveal tiles to find safe spots.';
        },'');
      }
      if(values.game==='numberguess'){
        return task(async()=>{
          const data = await api('/api/community/action',{method:'POST',body:{action:'casino',game:'numberguess',move:'deal',bet:wager,requestId:createRequestId()}});
          if(data.state) absorb(data.state);
          const round = state?.casino?.round;
          if(!round || round.game !== 'numberguess') throw new Error('Failed to start Number Guess.');
          guessState.bet = wager; guessState.active = true; guessState.attempts = 0;
          guessState.target = round.gameData?.target || Math.floor(Math.random() * 100) + 1;
          guessState.hint = ''; guessState.guess = null; guessState.roundId = round.id; guessState.version = round.version;
          result = 'Game started! Guess a number between 1 and 100.';
        },'');
      }
      if(values.game==='crash'){
        return task(async()=>{
          const data = await api('/api/community/action',{method:'POST',body:{action:'casino',game:'crash',move:'deal',bet:wager,requestId:createRequestId()}});
          if(data.state) absorb(data.state);
          const round = state?.casino?.round;
          if(!round || round.game !== 'crash') throw new Error('Failed to start crash game.');
          crashState.bet = wager; crashState.active = true; crashState.crashed = false;
          crashState.cashedOut = false; crashState.multiplier = 1;
          crashState.roundId = round.id; crashState.version = round.version;
          crashState.crashPoint = round.gameData?.crashPoint || 2;
          result = 'Game started! Cash out before the crash.';
          if(crashInterval) cancelAnimationFrame(crashInterval);
          const crashStart = performance.now();
          const cp = crashState.crashPoint;
          const crashTick = (now) => {
            if(!crashState.active || crashState.crashed || crashState.cashedOut) return;
            const t = (now - crashStart) / 1000;
            crashState.multiplier = Math.min(1 + t * (cp - 1) * 0.6 + t * t * (cp - 1) * 0.15, cp);
            const valEl = root()?.querySelector('[data-crash-value]');
            const btnWrap = root()?.querySelector('[data-crash-btn-wrap]');
            if(crashState.multiplier >= cp) {
              crashState.multiplier = cp;
              crashState.crashed = true;
              crashState.active = false;
              result = `Crashed at ${cp.toFixed(2)}×! You lost ${number(crashState.bet)} coins.`;
              api('/api/community/action',{method:'POST',body:{action:'casino',game:'crash',move:'crash',bet:crashState.bet,roundId:crashState.roundId,version:crashState.version,requestId:createRequestId()}}).then(d=>{if(d.state)absorb(d.state);}).catch(()=>{});
              render();
              return;
            }
            if(valEl) valEl.textContent = `${crashState.multiplier.toFixed(2)}×`;
            if(btnWrap) btnWrap.querySelector('button').textContent = `Cash out at ${crashState.multiplier.toFixed(2)}× (${number(Math.floor(crashState.bet * crashState.multiplier))} coins)`;
            const cls = crashState.multiplier < 2 ? 'ch-crash-low' : crashState.multiplier < 5 ? 'ch-crash-mid' : 'ch-crash-high';
            if(valEl) valEl.className = `ch-crash-value ${cls}`;
            crashInterval = requestAnimationFrame(crashTick);
          };
          crashInterval = requestAnimationFrame(crashTick);
        },'');
      }
      if(values.game==='trivia'){
        return task(async()=>{
          const data = await api('/api/community/action',{method:'POST',body:{action:'casino',game:'trivia',move:'deal',bet:wager,requestId:createRequestId()}});
          if(data.state) absorb(data.state);
          const round = state?.casino?.round;
          if(!round || round.game !== 'trivia') throw new Error('Failed to start Trivia.');
          triviaState.bet = wager; triviaState.active = true; triviaState.roundId = round.id; triviaState.version = round.version;
          handleTriviaNext();
        },'');
      }
      return mutate({action:'casino',game:values.game,move:'deal',bet:wager});
    }
    if(type==='guess'){
      const guess = Number(values.guess);
      if(!guess || guess < 1 || guess > 100) { error='Guess must be between 1 and 100.'; render(); return; }
      guessState.attempts++;
      guessState.guess = guess;
      if(guess === guessState.target) {
        guessState.hint = 'Correct!';
        const payout = Math.floor(guessState.bet * (1 + (7 - guessState.attempts) * 0.3));
        result = `You got it in ${guessState.attempts} attempts! +${number(payout)} coins`;
        guessState.active = false;
        mutate({action:'casino',game:'numberguess',move:'guess',bet:guessState.bet,attempts:guessState.attempts,correct:true,roundId:guessState.roundId,version:guessState.version});
      } else if(guessState.attempts >= 7) {
        guessState.hint = `The number was ${guessState.target}`;
        guessState.active = false;
        result = `Out of attempts! The number was ${guessState.target}.`;
        mutate({action:'casino',game:'numberguess',move:'guess',bet:guessState.bet,attempts:guessState.attempts,correct:false,roundId:guessState.roundId,version:guessState.version});
      } else {
        guessState.hint = guess > guessState.target ? 'Too high!' : 'Too low!';
      }
      render(); return;
    }
    if(type==='appearance'||type==='sounds'){
      prefs={...prefs,...values};try{localStorage.setItem(preferenceKey,JSON.stringify(prefs));}catch{error='Browser storage is unavailable. Preferences apply only to this visit.';}
      applyPreferences();if(type==='sounds')sound(prefs.mentionSound==='off'?'soft':prefs.mentionSound,true);result='Preferences saved on this browser';render();return;
    }
    if(type==='password'){
      if(values.newPassword!==values.confirmPassword){error='New passwords do not match.';render();return;}
      return task(async()=>{const data=await api('/api/account/profile/password',{method:'PUT',body:{currentPassword:values.currentPassword,newPassword:values.newPassword}});applyAccountUpdate(data);},'Password updated');
    }
    if(type==='recovery')return task(async()=>{const data=await api('/api/community/recovery/codes',{method:'POST',body:values});recoveryCodes=data.codes || [];return data;},'New recovery codes created. Save them now.');
    if(type==='staff')return task(async()=>{await api(`/api/community/support/admin/${encodeURIComponent(form.dataset.ticket)}`,{method:'PUT',body:{...values,userId:form.dataset.user}});staffTickets=(await api('/api/community/support/admin')).tickets || [];},'Support reply saved');
    const endpoints={profile:['PUT','profile'],privacy:['PUT','privacy'],block:['POST','blocked'],support:['POST','support']};
    if(endpoints[type]){const [method,path]=endpoints[type];return task(()=>api(`/api/community/${path}`,{method,body:values}),type==='support'?'Support request sent':'Saved');}
  }
  function openRecovery() {
    openModal(`<section class="community-hub ch-recovery-reset" role="dialog" aria-modal="true" aria-labelledby="recovery-title"><header class="ch-header"><h2 id="recovery-title">Recover your account</h2><button class="ch-button" type="button" id="ch-recovery-close" aria-label="Close recovery">×</button></header><form id="ch-reset-form" class="ch-form ch-body">${field('Username or email','identifier','','autocomplete="username" required')}${field('One-use recovery code','code','','autocomplete="off" required')}${field('New password','newPassword','','type="password" autocomplete="new-password" minlength="8" maxlength="128" required')}<p id="ch-reset-status" role="status"></p><button type="submit" class="ch-button ch-primary">Reset password</button></form></section>`);
    document.getElementById('ch-recovery-close').onclick=closeModal;
    document.getElementById('ch-reset-form').onsubmit=async event=>{
      event.preventDefault();const form=event.currentTarget,b=form.querySelector('button[type="submit"]'),status=document.getElementById('ch-reset-status');b.disabled=true;
      try{const data=await api('/api/community/recovery/reset',{method:'POST',body:Object.fromEntries(new FormData(form)),ignoreAuthFailure:true});form.reset();status.textContent=data.msg || 'Password reset. Close this window and sign in.';}
      catch(e){status.textContent=e?.data?.msg || 'Unable to reset password. Check your code and try again.';}finally{b.disabled=false;}
    };
    document.querySelector('#ch-reset-form input')?.focus();
  }
  document.addEventListener('click',event=>{
    const entry=event.target.closest('[data-community-open]');
    if(entry){deps.closeMobilePanels?.();open(entry.dataset.communityOpen);}
    if(event.target.closest('[data-community-recovery]'))openRecovery();
  });
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&root()&&!busy&&!pending)void load();});
  window.addEventListener('online',()=>{if(root()&&!busy&&!pending)void load();});
  window.addEventListener('storage',event=>{if(event.key===preferenceKey){prefs=readPreferences();applyPreferences();}});
  const overlay=document.getElementById('modal-overlay');
  if(overlay)new MutationObserver(()=>{if(overlay.style.display==='none'){recoveryCodes=[];root()?.querySelector('.ch-codes')?.remove();}}).observe(overlay,{attributes:true,attributeFilter:['style']});
  async function enhanceProfile(username,card){
    if(!card)return;
    const version=accountVersion;
    try{
      const data=await api(`/api/community/profile/${encodeURIComponent(username)}`);
      if(version!==accountVersion||!card.isConnected||document.querySelector('.profile-card-modal')!==card)return;
      const profile=data.profile || {}, main=card.querySelector('.profile-card-main');if(!main)return;
      const details=document.createElement('section');details.className='ch-public-profile';
      details.innerHTML=`${profile.bio?`<p>${esc(profile.bio)}</p>`:''}<dl>${[['Pronouns',profile.pronouns],['Favorite game',profile.favoriteGame],['Birthday',profile.birthday]].filter(([,value])=>value).map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
      if(profile.bio||profile.pronouns||profile.favoriteGame||profile.birthday)main.querySelector('.profile-card-actions')?.before(details);
      if(data.premium?.active){
        const badge=document.createElement('span');badge.className='ch-badge';badge.textContent='✦ PREMIUM';card.querySelector('.profile-card-badges')?.append(badge);
        if(/^#[0-9a-f]{6}$/i.test(profile.nameColor||'')){const title=card.querySelector('.profile-card-head h3');if(title)title.style.color=profile.nameColor;}
      }
      if(data.equippedBadge && data.equippedBadge !== 'none'){
        const badgeIcons={badge_star:'⭐',badge_verified:'✅'};
        const badge=document.createElement('span');badge.className='ch-badge';badge.textContent=badgeIcons[data.equippedBadge] || data.equippedBadge;card.querySelector('.profile-card-badges')?.append(badge);
      }
    }catch{/* Existing profile remains usable if the optional community endpoint is unavailable. */}
  }
  return {open,enhanceProfile,notify:kind=>sound(kind),refresh:load,clear:()=>{++loadVersion;++accountVersion;busy=false;state=null;pending=null;casinoView='';held.clear();heldRound='';recoveryCodes=[];board=null;staffTickets=null;stopSounds();if(crashInterval)cancelAnimationFrame(crashInterval);applyPreferences();}};
}
