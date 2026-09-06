// Native Nebulo community/account UI. Wallet mutations are authoritative on the server.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => Number(value || 0).toLocaleString();
const tabs = {
  community: ['Rewards', 'Casino', 'Leaderboard', 'Support'],
  account: ['Info', 'Profile', 'Appearance', 'Premium', 'DMs', 'Password', 'Recovery', 'Blocked', 'Sounds'],
};
const defaults = { theme:'nebulo', font:'default', size:13, cursor:'default', volume:35, messageSound:'off', mentionSound:'chime' };
const preferenceKey = 'nebuloCommunityPreferencesV1';
function readPreferences() { try { return { ...defaults, ...JSON.parse(localStorage.getItem(preferenceKey) || '{}') }; } catch { return {...defaults}; } }
const field = (label, name, value = '', extra = '') => `<label class="ch-field">${esc(label)}<input name="${esc(name)}" value="${esc(value)}" ${extra}></label>`;
const select = (label, name, value, options) => `<label class="ch-field">${esc(label)}<select name="${esc(name)}">${options.map(([id, text]) => `<option value="${esc(id)}" ${String(value)===String(id)?'selected':''}>${esc(text)}</option>`).join('')}</select></label>`;
const button = (text, action, extra='') => `<button type="button" class="ch-button" data-ch-action="${esc(action)}" ${extra}>${esc(text)}</button>`;
const date = value => value ? new Date(value).toLocaleString() : '—';

export function initCommunityHub(deps) {
  const { api, getUser, setUser, openModal, closeModal, toast, openProfileEditor, openCosmetics, applyAccountUpdate } = deps;
  let state = null, mode = 'community', tab = 'Rewards', prefs = readPreferences(), pending = null;
  let busy = false, loadVersion = 0, error = '', result = '', recoveryCodes = [], board = null, staffTickets = null;
  let audio = null, lastSound = 0, returnFocus = null;
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
    applyPreferences();
  }
  function sound(kind, preview=false) {
    const tone = preview ? kind : prefs[kind === 'mention' ? 'mentionSound' : 'messageSound'];
    if (tone === 'off' || (!preview && Date.now()-lastSound < 1000)) return;
    // A user gesture must unlock audio first; incoming messages never create an audio context.
    if (!preview && (!audio || audio.state !== 'running')) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended' && preview) void audio.resume();
      const t = audio.currentTime, gain = audio.createGain();
      gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(Math.max(0,Math.min(100,Number(prefs.volume)||0))/500,t+.015); gain.gain.exponentialRampToValueAtTime(.0001,t+.3); gain.connect(audio.destination);
      const osc = audio.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(tone==='chime'?880:440,t); osc.frequency.setValueAtTime(tone==='chime'?1174:660,t+.1); osc.connect(gain); osc.start(t); osc.stop(t+.32);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); }; lastSound = Date.now();
    } catch { if(preview) toast('Audio is unavailable in this browser','error'); }
  }
  async function load() {
    const version = ++loadVersion;
    try { const data = await api('/api/community/me'); if(version !== loadVersion) return; absorb(data); error=''; }
    catch(e) { if(version !== loadVersion) return; error = e?.data?.msg || 'Could not load your community account. Try again.'; }
    if(root()) render();
  }
  function open(nextMode='community', nextTab) {
    returnFocus = document.activeElement;
    mode = nextMode; tab = nextTab || tabs[mode][0]; error=''; result=''; board=null; recoveryCodes=[];
    openModal('<section id="community-hub" class="community-hub" role="dialog" aria-modal="true" aria-labelledby="ch-title"></section>');
    render(); root().querySelector('[data-ch-action="close"]')?.focus();
    void load();
  }
  function heading(title, description='') { return `<header class="ch-section-head"><h3>${esc(title)}</h3>${description?`<p>${esc(description)}</p>`:''}</header>`; }
  function rewards() {
    const daily = state.daily || {}, spin = state.spin || {};
    return `${heading('A little progress, every day.', 'Your coins unlock cosmetics and membership. All rewards use UTC days.')}
      <div class="ch-wallet"><div><span class="ch-eyebrow">YOUR WALLET</span><strong>${number(state.coins)} <small>coins</small></strong></div><span class="material-icons-round" aria-hidden="true">toll</span></div>
      <section class="ch-daily"><div class="ch-row"><div><h4>Daily streak</h4><p>${number(daily.streak)} days · personal best ${number(daily.bestStreak)}</p></div><strong class="ch-streak">${number(daily.streak)}<small>DAY STREAK</small></strong></div>
        <ol class="ch-week" aria-label="Seven day reward progression">${Array.from({length:7},(_,i)=>`<li class="${i<Math.min(7,Number(daily.streak)||0)?'earned':''}"><span>Day ${i+1}</span><b>${100+i*25}</b></li>`).join('')}</ol>
        <div class="ch-row">${button(daily.claimedToday?'Claimed today':`Claim ${number(daily.reward || 100)} coins`,'daily',daily.claimedToday?'disabled':'')}<span class="ch-muted">${daily.claimedToday?`Next claim ${esc(date(daily.nextClaimAt))}`:'Come back tomorrow to keep your streak.'}</span></div>
      </section>
      <section class="ch-divider ch-row"><div><h4>Daily lucky spin</h4><p>One free spin. Earn 20, 40, 60, 100, or 200 coins.</p></div>${button(spin.claimedToday?'Spin claimed':'Free spin','spin',spin.claimedToday?'disabled':'')}</section>
      <section class="ch-divider"><div class="ch-row"><div><h4>Make it yours</h4><p>Spend earned coins on avatar rings, tags and message effects.</p></div>${button('Open cosmetics','cosmetics')}</div></section>
      ${state.recent?.length?`<section class="ch-divider"><h4>Recent activity</h4><ul class="ch-activity">${state.recent.slice(0,8).map(item=>`<li><span>${esc(item.label || item.kind || item.action || 'Wallet activity')}</span><span>${esc(item.amount ?? item.delta ?? '')}</span></li>`).join('')}</ul></section>`:''}`;
  }
  function casino() {
    return `${heading('The arcade casino', 'Play with site coins only. No purchases, cash value, or cash-out.')}
      <div class="ch-wallet ch-wallet-small"><span>Available to play</span><strong>${number(state.coins)} <small>coins</small></strong></div>
      <form data-ch-form="casino" class="ch-form"><div class="ch-two">${select('Game','game','coinflip',[['coinflip','Coin flip'],['dice','Exact dice']])}${field('Bet in coins','bet',10,'type="number" min="1" max="100" step="1" required')}</div>
      <div class="ch-two">${select('Coin flip pick','coinChoice','heads',[['heads','Heads'],['tails','Tails']])}${select('Dice pick','diceChoice',1,Array.from({length:6},(_,i)=>[i+1,String(i+1)]))}</div>
      <aside class="ch-note">Coin flip: 1 in 2 chance, pays 2× your stake. Exact dice: 1 in 6 chance, pays 5×. The stake is deducted first; a loss pays nothing. Maximum 100 coins per play, 80 plays per UTC day, and 2 seconds between plays.</aside>
      <button class="ch-button ch-primary" type="submit">Place one bet</button></form>
      <dl class="ch-stats"><div><dt>Games</dt><dd>${number(state.stats?.games)}</dd></div><div><dt>Wins</dt><dd>${number(state.stats?.wins)}</dd></div><div><dt>Net coins</dt><dd>${number(state.stats?.net)}</dd></div></dl>`;
  }
  function leaderboard() {
    return `${heading('Community leaderboard','Real standings, updated when you load them.')}${select('Rank by','metric',board?.metric || 'coins',[['coins','Coins'],['streak','Daily streak'],['wins','Casino wins']])}${button('Refresh standings','leaderboard')}
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
      case 'Info': return `${heading('Your account','Everything you need to feel at home in Nebulo.')}<dl class="ch-info"><div><dt>Display name</dt><dd>${esc(user.displayName || user.username)}</dd></div><div><dt>Username</dt><dd>@${esc(user.username)}</dd></div><div><dt>Role</dt><dd>${esc(user.role || 'Member')}</dd></div><div><dt>Coins</dt><dd>${number(state.coins)}</dd></div><div><dt>Membership</dt><dd>${premium()?'Premium active':'Free member'}</dd></div></dl>${button('Edit name & avatar','profile-editor')} ${button('Community rewards','community')}`;
      case 'Profile': return `${heading('A little more you','Name and avatar editing are still in your existing profile editor.')}${button('Edit name & avatar','profile-editor')}<form class="ch-form ch-divider" data-ch-form="profile"><label class="ch-field">About me<textarea name="bio" maxlength="280" rows="3">${esc(p.bio)}</textarea></label><div class="ch-two">${field('Pronouns','pronouns',p.pronouns,'maxlength="40"')}${field('Favorite game','favoriteGame',p.favoriteGame,'maxlength="60"')}</div>${field('Birthday (month-day, optional)','birthday',p.birthday,'pattern="[0-9]{2}-[0-9]{2}" placeholder="MM-DD"')}${field('Profile name color (Premium)','nameColor',p.nameColor || '#60a5fa',`type="color" ${premium()?'':'disabled'}`)}<p class="ch-muted">These profile details are visible to other members. Leave anything private blank.</p><button type="submit" class="ch-button ch-primary">Save profile</button></form>`;
      case 'Appearance': return `${heading('Your space, your style','Saved on this browser. Existing message and animation settings stay available.')}<form class="ch-form" data-ch-form="appearance">${select('Theme','theme',prefs.theme,[['nebulo','Nebulo blue'],['midnight','Midnight'],...(premium()?[['ocean','Ocean · Premium'],['forest','Forest · Premium']]:[])])}<div class="ch-two">${select('Message font','font',prefs.font,[['default','Inter'],['serif','Serif'],['mono','Monospace']])}${select('Message text size','size',prefs.size,[12,13,14,16,18,20].map(i=>[i,`${i}px`]))}</div>${select('Cursor','cursor',prefs.cursor,[['default','Default'],...(premium()?[['crosshair','Crosshair · Premium'],['cell','Cell · Premium']]:[])])}<div class="ch-message-preview"><strong>Nebulo</strong><p>A familiar place. A little more your own.</p></div><button type="submit" class="ch-button ch-primary">Save appearance</button></form>${premium()?'':'<p class="ch-muted">Ocean, Forest and alternate cursors unlock with earned-coin Premium.</p>'}`;
      case 'Premium': return `${heading('A membership you can earn','Use site coins, not a credit card. No recurring charge.')}<div class="ch-premium"><span class="ch-eyebrow">NEBULO PREMIUM</span><h4>Make your space stand out.</h4><ul><li>Ocean and Forest chat themes</li><li>Crosshair and Cell cursors</li><li>Your own profile name color</li></ul><strong>${number(state.premium?.price || 2000)} coins <small>/ ${state.premium?.days || 30} days</small></strong><p>${premium()?`Active until ${esc(date(state.premium.expiresAt))}`:'Get coins from daily rewards, spins, and chat participation.'}</p>${button(premium()?'Extend membership':'Activate Premium','premium')}</div>`;
      case 'DMs': return `${heading('Your inbox, your rules','Choose who can start conversations and send friend requests.')}<form class="ch-form" data-ch-form="privacy">${select('Who can message me','dms',privacy.dms || 'everyone',[['everyone','Everyone'],['friends','Friends only'],['none','No one']])}${select('Who can send friend requests','friendRequests',privacy.friendRequests || 'everyone',[['everyone','Everyone'],['mutual','People with mutual friends'],['none','No one']])}<button type="submit" class="ch-button ch-primary">Save privacy</button></form>`;
      case 'Password': return `${heading('Change password','Your current password protects this change.')}<form class="ch-form" data-ch-form="password">${field('Current password','currentPassword','','type="password" autocomplete="current-password" required')}${field('New password','newPassword','','type="password" autocomplete="new-password" minlength="8" maxlength="128" required')}${field('Confirm new password','confirmPassword','','type="password" autocomplete="new-password" minlength="8" maxlength="128" required')}<button type="submit" class="ch-button ch-primary">Update password</button></form>`;
      case 'Recovery': return `${heading('Never lose your way back','One-use recovery codes can reset your password if you lose access.')}<p>${number(state.recovery?.remaining)} unused codes remaining.</p><aside class="ch-note">Generating a new set invalidates your old codes. Store these somewhere private, outside this browser. Never share them with support.</aside><form class="ch-form" data-ch-form="recovery">${field('Confirm current password','currentPassword','','type="password" autocomplete="current-password" required')}<button type="submit" class="ch-button ch-primary">Generate new recovery codes</button></form>${recoveryCodes.length?`<section class="ch-codes"><h4>Save these now. They are shown only once.</h4><pre>${recoveryCodes.map(esc).join('\n')}</pre>${button('Copy codes','copy-codes')}</section>`:''}`;
      case 'Blocked': return `${heading('Blocked accounts','Block unwanted contact. You can undo this at any time.')}<form class="ch-form ch-inline" data-ch-form="block">${field('Username','username','','required maxlength="80" placeholder="username"')}<button type="submit" class="ch-button">Block account</button></form><ul class="ch-blocked">${state.blocked?.length?state.blocked.map(person=>`<li><span>@${esc(person.username)}</span>${button('Unblock','unblock',`data-id="${esc(person.id)}"`)}</li>`).join(''):'<li class="ch-empty">No blocked accounts.</li>'}</ul>`;
      case 'Sounds': return `${heading('Sounds, on your terms','Gentle synthesized sounds. Nothing downloads, and nothing plays until you enable audio here.')}<form class="ch-form" data-ch-form="sounds">${select('New messages','messageSound',prefs.messageSound,[['off','Off'],['soft','Soft ping'],['chime','Chime']])}${select('Mentions & direct messages','mentionSound',prefs.mentionSound,[['off','Off'],['soft','Soft ping'],['chime','Chime']])}<label class="ch-field">Notification volume<input name="volume" type="range" min="0" max="100" value="${Number(prefs.volume)||0}"></label><div class="ch-row">${button('Preview soft ping','preview-soft')}${button('Preview chime','preview-chime')}</div><button type="submit" class="ch-button ch-primary">Save & enable sounds</button></form><p class="ch-muted">Preferences stay on this browser. Voice call volume remains in Settings → Voice & Audio.</p>`;
      default: return '';
    }
  }
  function render() {
    const el=root(); if(!el)return;
    el.innerHTML=`<header class="ch-header"><div><span class="ch-eyebrow">NEBULO / ${mode==='account'?'YOU':'COMMUNITY'}</span><h2 id="ch-title">${mode==='account'?'Account':'Community'}</h2></div>${button('×','close','aria-label="Close community hub"')}</header><nav class="ch-tabs" aria-label="${mode==='account'?'Account':'Community'} sections">${tabs[mode].map(name=>`<button type="button" data-ch-tab="${name}" aria-current="${tab===name?'page':'false'}">${name==='Premium'?'✦ ':''}${name}</button>`).join('')}</nav><main class="ch-body" aria-busy="${busy}">${error?`<div class="ch-error" role="alert">${esc(error)}</div>`:''}${result?`<div class="ch-result" role="status">${esc(result)}</div>`:''}${pending&&!busy?`<aside class="ch-note">The last action could not be confirmed. Retry checks the same request; it will not charge twice. ${button('Retry last action','retry')}</aside>`:''}${state?(mode==='account'?account():({Rewards:rewards,Casino:casino,Leaderboard:leaderboard,Support:support}[tab] || rewards)()):`<p class="ch-empty">${error?'Your account could not be loaded.':'Loading your account…'}</p>${error?button('Try again','reload'):''}`}</main><footer class="ch-footer"><span>Made for the Nebulo community</span>${button(mode==='account'?'Community':'Account',mode==='account'?'community':'account')}</footer>`;
    if(busy) el.querySelectorAll('form button, [data-ch-action]:not([data-ch-action="close"]), [data-ch-tab]').forEach(b=>b.disabled=true);
    el.onclick = click;
    el.onsubmit = submit;
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
  function finish() { recoveryCodes=[]; closeModal(); returnFocus?.focus?.(); }
  async function task(work, success='Saved') {
    if(busy)return;
    busy=true;error='';result='';render();
    try { const data=await work(); if(data?.state)absorb(data.state); else if(data && 'coins' in data)absorb(data); result=success; }
    catch(e){error=e?.data?.msg || e?.message || 'Something went wrong. Please try again.';}
    finally{busy=false;render();}
  }
  async function mutate(payload) {
    if(busy)return;
    if(pending&&payload!==pending){error='Resolve the previous action with Retry before starting another.';render();return;}
    pending = pending || {...payload,requestId:crypto.randomUUID()};
    await task(async()=>{
      try{
        const data=await api('/api/community/action',{method:'POST',body:pending});
        pending=null;
        const r=data.result || {};
        result=r.msg || (r.kind==='casino'?`${r.win?'You won':'No win this time'} · result ${r.outcome} · payout ${number(r.payout)} coins`:`Received ${number(r.coinsEarned)} coins`);
        if(data.state)absorb(data.state);
        return null;
      }catch(e){if(e.status && e.status<500)pending=null;throw e;}
    },'');
  }
  async function click(event) {
    const nav=event.target.closest('[data-ch-tab]');
    if(nav&&!busy){tab=nav.dataset.chTab;error='';result='';recoveryCodes=[];render();root()?.querySelector(`[data-ch-tab="${tab}"]`)?.focus();if(tab==='Leaderboard')await fetchBoard();return;}
    const target=event.target.closest('[data-ch-action]'); if(!target)return;
    const action=target.dataset.chAction;
    if(action==='close')return finish();
    if(busy)return;
    if(action==='reload')return load();
    if(action==='account'||action==='community'){mode=action;tab=tabs[mode][0];recoveryCodes=[];render();return;}
    if(action==='profile-editor'){recoveryCodes=[];return openProfileEditor();}
    if(action==='cosmetics'){finish();return openCosmetics();}
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
  async function fetchBoard(){const metric=root()?.querySelector('[name="metric"]')?.value || 'coins';return task(async()=>{board=await api(`/api/community/leaderboard?metric=${encodeURIComponent(metric)}`);},'Standings updated');}
  async function submit(event) {
    const form=event.target.closest('[data-ch-form]');if(!form)return;event.preventDefault();if(busy)return;
    const values=Object.fromEntries(new FormData(form)), type=form.dataset.chForm;
    if(type==='casino')return mutate({action:'casino',game:values.game,bet:Number(values.bet),choice:values.game==='dice'?Number(values.diceChoice):values.coinChoice});
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
  window.addEventListener('storage',event=>{if(event.key===preferenceKey){prefs=readPreferences();applyPreferences();}});
  return {open,notify:kind=>sound(kind),refresh:load,clear:()=>{state=null;pending=null;recoveryCodes=[];applyPreferences();}};
}
