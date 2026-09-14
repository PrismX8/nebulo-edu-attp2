const crypto = require('crypto');

const DAY = 86400000;
const HOUSE_RETURN = 0.82;
const NUMBER_GUESS_MULTIPLIER = 16;
const TRIVIA = [
  { prompt: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], answer: 1 },
  { prompt: 'How many sides does a hexagon have?', options: ['Five', 'Eight', 'Six', 'Seven'], answer: 2 },
  { prompt: 'What is the chemical symbol for gold?', options: ['Ag', 'Fe', 'Gd', 'Au'], answer: 3 },
  { prompt: 'Which ocean is the largest?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], answer: 0 },
  { prompt: 'What is 12 multiplied by 8?', options: ['88', '96', '108', '84'], answer: 1 },
  { prompt: 'Which language runs natively in web browsers?', options: ['Python', 'C++', 'JavaScript', 'Rust'], answer: 2 },
  { prompt: 'How many minutes are in two and a half hours?', options: ['120', '180', '125', '150'], answer: 3 },
  { prompt: 'Which gas do plants absorb during photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Helium', 'Hydrogen'], answer: 0 },
  { prompt: 'What is the square root of 144?', options: ['14', '12', '16', '11'], answer: 1 },
  { prompt: 'Which instrument measures temperature?', options: ['Barometer', 'Compass', 'Thermometer', 'Altimeter'], answer: 2 },
];
const crashMultiplier = (round, now) => Math.floor(Math.exp(Math.min(50000, Math.max(0, now - round.startedAt)) / 10000) * 100) / 100;
const PAYTABLE = [
  ['Royal flush', 250], ['Straight flush', 50], ['Four of a kind', 25],
  ['Full house', 9], ['Flush', 6], ['Straight', 4], ['Three of a kind', 3],
  ['Two pair', 2], ['Jacks or better', 1], ['No win', 0],
].map(([name, multiplier]) => ({ name, multiplier }));
const RULES = {
  blackjack: 'Dealer stands on all 17s. Blackjack pays 3:2, rounded down to whole coins. Other wins pay 1:1. A push returns your stake. Double on your first two cards. No split or insurance.',
  videopoker: 'Five-card draw, Jacks or Better. Hold any cards, then draw once. Payouts in the paytable include your stake.',
  higherlower: 'Guess if the next number from 1 to 100 is higher or lower. Equal numbers lose. Each return is calculated from the exact chance of your choice with an 82% return rate.',
  mines: 'Reveal safe tiles on a 5×5 grid with 7 mines. Cash-out returns use the exact probability of surviving every revealed tile with an 82% return rate.',
  numberguess: 'Pick up to 5 different numbers from 1 to 100. There are no directional hints. A correct pick returns 16× your stake.',
  crash: 'Multiplier climbs from 1×. Cash out before it crashes. The crash curve has an 82% return rate and a 100× cap.',
};
function fail(message, status = 400) { const error = new Error(message); error.status = status; throw error; }
function floorTo(value, places = 100) { return Math.floor((Number(value) + 1e-10) * places) / places; }
const rank = card => card % 13 + 2;
const suit = card => Math.floor(card / 13);
function cardView(card) {
  const ranks = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };
  const value = ranks[rank(card)] || String(rank(card));
  return { rank: value, suit: ['S', 'H', 'D', 'C'][suit(card)], label: value + ['♠', '♥', '♦', '♣'][suit(card)] };
}
function shuffledDeck(randomInt = crypto.randomInt) {
  const deck = Array.from({ length: 52 }, (_, i) => i);
  for (let i = 51; i > 0; i--) {
    const j = randomInt(i + 1);
    if (!Number.isInteger(j) || j < 0 || j > i) throw new Error('Invalid card shuffle');
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
function blackjackTotal(cards) {
  let total = 0, aces = 0;
  for (const card of cards) {
    const value = rank(card);
    if (value === 14) { total += 11; aces++; }
    else total += Math.min(10, value);
  }
  while (total > 21 && aces) { total -= 10; aces--; }
  return total;
}
function pokerRank(cards) {
  if (cards.length !== 5 || new Set(cards).size !== 5) throw new Error('Invalid poker hand');
  const values = cards.map(rank).sort((a, b) => a - b);
  const groups = new Map();
  for (const value of values) groups.set(value, (groups.get(value) || 0) + 1);
  const counts = [...groups.values()].sort((a, b) => b - a);
  const flush = cards.every(card => suit(card) === suit(cards[0]));
  const straight = groups.size === 5 && (values[4] - values[0] === 4 || values.join(',') === '2,3,4,5,14');
  let name = 'No win';
  if (straight && flush) name = values[0] === 10 ? 'Royal flush' : 'Straight flush';
  else if (counts[0] === 4) name = 'Four of a kind';
  else if (counts[0] === 3 && counts[1] === 2) name = 'Full house';
  else if (flush) name = 'Flush';
  else if (straight) name = 'Straight';
  else if (counts[0] === 3) name = 'Three of a kind';
  else if (counts[0] === 2 && counts[1] === 2) name = 'Two pair';
  else if ([...groups].some(([value, count]) => count === 2 && value >= 11)) name = 'Jacks or better';
  return PAYTABLE.find(entry => entry.name === name);
}
function take(round) {
  const card = round.deck.pop();
  if (!Number.isInteger(card)) throw new Error('Saved deck is incomplete');
  return card;
}

function minesMultiplier(safeRevealed, safeTiles = 20, totalTiles = 25) {
  if (!Number.isInteger(safeRevealed) || safeRevealed < 1) return 1;
  let survivalChance = 1;
  for (let i = 0; i < safeRevealed; i++) {
    survivalChance *= (safeTiles - i) / (totalTiles - i);
  }
  return floorTo(HOUSE_RETURN / survivalChance);
}

// settle() records the outcome. Caller (communityModel) handles coin mutations.
function settle(state, outcome, payout, now) {
  const round = state.casinoRound;
  round.status = 'settled'; round.outcome = outcome; round.payout = payout;
  round.net = payout - round.stake; round.finishedAt = now;
  state.games++; state.wins += round.net > 0 ? 1 : 0; state.net += round.net;
  const message = outcome === 'push' ? `Push. Your ${round.stake} coins were returned.`
    : payout ? `${outcome === 'blackjack' ? 'Blackjack' : outcome === 'win' ? 'You win' : outcome}. ${payout} coins returned.`
      : `${outcome === 'loss' ? 'Dealer wins' : outcome}. No payout.`;
  round.log.push(message);
  state.casinoHistory = [...(state.casinoHistory || []), {
    id: round.id, game: round.game, bet: round.bet, stake: round.stake,
    outcome, payout, net: round.net, finishedAt: now,
  }].slice(-12);
}

function abandonCurrentRound(state, now) {
  const round = state.casinoRound;
  if (!round || round.status !== 'playing') return false;
  settle(state, 'loss', 0, now);
  return true;
}

function finishBlackjack(state, now) {
  const round = state.casinoRound;
  const player = blackjackTotal(round.player);
  if (player > 21) return settle(state, 'loss', 0, now);
  while (blackjackTotal(round.dealer) < 17) {
    round.dealer.push(take(round));
    round.log.push(`Dealer draws ${cardView(round.dealer.at(-1)).label}.`);
  }
  const dealer = blackjackTotal(round.dealer);
  if (dealer > 21 || player > dealer) settle(state, 'win', round.stake * 2, now);
  else if (player === dealer) settle(state, 'push', round.stake, now);
  else settle(state, 'loss', 0, now);
}

// apply() returns {bet, payout, net, ...}. Caller deducts bet and adds payout to coins.
function apply(state, request, { now = Date.now(), randomInt = crypto.randomInt } = {}) {
  const { game, move } = request;
  const supportedGames = ['blackjack', 'videopoker', 'higherlower', 'mines', 'numberguess', 'crash'];
  const canRefundRetiredTrivia = game === 'trivia' && ['answer', 'refund'].includes(move) &&
    state.casinoRound?.game === 'trivia' && state.casinoRound?.status === 'playing';
  if (!supportedGames.includes(game) && !canRefundRetiredTrivia) fail('Choose a current casino game.');
  
  if (['higherlower', 'mines', 'numberguess', 'crash', 'trivia'].includes(game)) {
    return applyTextGame(state, request, { now, randomInt });
  }
  
  if (move === 'deal') {
    const abandoned = abandonCurrentRound(state, now);
    const bet = request.bet;
    if (!Number.isSafeInteger(bet) || bet < 1) fail('Bet must be a positive whole number.');
    const today = Math.floor(now / DAY);
    if (state.casinoDay !== today) { state.casinoDay = today; state.playsToday = 0; }
    const round = {
      id: request.requestId, game, status: 'playing', version: 1, bet, stake: bet,
      player: [], dealer: [], deck: shuffledDeck(randomInt), outcome: null,
      payout: 0, net: 0, startedAt: now, finishedAt: null, log: [],
    };
    state.casinoRound = round;
    state.playsToday++; state.lastPlayAt = now;
    if (game === 'blackjack') {
      round.player.push(take(round)); round.dealer.push(take(round));
      round.player.push(take(round)); round.dealer.push(take(round));
      round.log.push(`Hand dealt. ${bet} coins staked.`);
      const playerNatural = blackjackTotal(round.player) === 21;
      const dealerNatural = blackjackTotal(round.dealer) === 21;
      if (playerNatural || dealerNatural) {
        settle(state, playerNatural && dealerNatural ? 'push' : playerNatural ? 'blackjack' : 'loss',
          playerNatural && dealerNatural ? bet : playerNatural ? Math.floor(bet * 2.5) : 0, now);
      }
    } else {
      for (let i = 0; i < 5; i++) round.player.push(take(round));
      round.log.push(`Five cards dealt. ${bet} coins staked. Choose cards to hold, then draw.`);
    }
  } else {
    const round = state.casinoRound;
    if (!round || round.id !== request.roundId || round.game !== game) fail('This hand is no longer current. Refresh the table.', 409);
    if (round.status !== 'playing') fail('This hand is already complete.', 409);
    if (!Number.isSafeInteger(request.version) || request.version !== round.version) fail('This hand changed in another tab. Refresh the table.', 409);
    if (game === 'blackjack') {
      if (!['hit', 'stand', 'double'].includes(move)) fail('Choose Hit, Stand, or Double.');
      if (move === 'double') {
        if (round.player.length !== 2 || round.stake !== round.bet) fail('You can double only on your first two cards.');
        round.stake += round.bet;
        round.log.push(`Doubled to ${round.stake} coins.`);
      }
      if (move !== 'stand') {
        round.player.push(take(round));
        round.log.push(`You draw ${cardView(round.player.at(-1)).label}. Total: ${blackjackTotal(round.player)}.`);
      } else round.log.push(`You stand on ${blackjackTotal(round.player)}.`);
      if (move !== 'hit' || blackjackTotal(round.player) >= 21) finishBlackjack(state, now);
    } else {
      if (move !== 'draw') fail('Choose cards to hold, then draw.');
      const hold = request.hold;
      if (!Array.isArray(hold) || hold.length > 5 || new Set(hold).size !== hold.length || hold.some(i => !Number.isInteger(i) || i < 0 || i > 4)) fail('Choose up to five different cards to hold.');
      for (let i = 0; i < 5; i++) if (!hold.includes(i)) round.player[i] = take(round);
      round.log.push(`Held ${hold.length}. Drew ${5 - hold.length}.`);
      const hand = pokerRank(round.player);
      settle(state, hand.name, round.stake * hand.multiplier, now);
    }
    round.version++;
  }
  const round = state.casinoRound;
  return { kind: 'casino', game, roundId: round.id, status: round.status,
    bet: round.bet, stake: round.stake, payout: round.payout, net: round.net,
    win: round.net > 0, coinsEarned: 0, msg: round.log.at(-1) };
}

// ── Text-based games ───────────────────────────────────────────────────────
function applyTextGame(state, request, { now, randomInt }) {
  const { game, move } = request;
  const today = Math.floor(now / DAY);
  if (state.casinoDay !== today) { state.casinoDay = today; state.playsToday = 0; }
  
  if (move === 'deal' || move === 'start') {
    const abandoned = abandonCurrentRound(state, now);
    const bet = request.bet;
    if (!Number.isSafeInteger(bet) || bet < 1) fail('Bet must be a positive whole number.');
    
    state.playsToday++;
    state.lastPlayAt = now;
    
    const round = {
      id: request.requestId, game, status: 'playing', version: 1, bet, stake: bet,
      player: [], dealer: [], deck: [], outcome: null,
      payout: 0, net: 0, startedAt: now, finishedAt: null, log: [],
      gameData: {},
    };
    
    if (game === 'mines') {
      const mineCount = 7;
      const tiles = Array.from({ length: 25 }, (_, i) => i);
      round.gameData.mines = Array.from({ length: mineCount }, () => tiles.splice(randomInt(tiles.length), 1)[0]);
      round.gameData.revealed = [];
      round.gameData.multiplier = 1;
    } else if (game === 'numberguess') {
      round.gameData.target = randomInt(100) + 1;
      round.gameData.attempts = 0;
      round.gameData.maxAttempts = 5;
      round.gameData.guesses = [];
    } else if (game === 'crash') {
      const r = randomInt(10000) / 10000;
      round.gameData.crashPoint = Math.max(1, Math.floor((HOUSE_RETURN / (1 - r)) * 100) / 100);
      if (round.gameData.crashPoint > 100) round.gameData.crashPoint = 100;
      round.gameData.multiplier = 1;
    } else if (game === 'higherlower') {
      round.gameData.currentNumber = randomInt(100) + 1;
      round.gameData.streak = 0;
      round.gameData.multiplier = 1;
    }
    
    state.casinoRound = round;
    round.log.push(`${game} started. ${bet} coins staked.`);
    
    return { kind: 'casino', game, roundId: round.id, status: round.status,
      bet: round.bet, stake: round.stake, outcome: null, payout: 0,
      win: false, coinsEarned: 0, msg: round.log.at(-1) };
  }
  
  const round = state.casinoRound;
  if (!round || round.id !== request.roundId || round.game !== game) fail('This game is no longer current. Refresh.', 409);
  if (round.status !== 'playing') fail('This game is already complete.', 409);
  if (!Number.isSafeInteger(request.version) || request.version !== round.version) fail('This game changed in another tab. Refresh.', 409);
  const allowed = { higherlower: ['guess', 'cashout'], mines: ['reveal', 'cashout'], numberguess: ['guess'], crash: ['tick', 'cashout'], trivia: ['answer', 'refund'] };
  if (!allowed[game].includes(move)) fail('Invalid move for this game.');
  if (game === 'higherlower' && !Number.isFinite(Number(round.gameData.multiplier))) {
    round.gameData.multiplier = 1 + Math.max(0, Number(round.gameData.streak || 0)) * 0.5;
  }
  
  let payout = 0;
  let outcome = '';
  let msg = '';
  
  if (game === 'higherlower') {
    if (move === 'guess') {
      const choice = request.choice;
      if (!['higher', 'lower'].includes(choice)) fail('Choose higher or lower.');
      const savedNumber = Number(round.gameData.currentNumber);
      const legacyCard = Number(round.gameData.currentCard);
      const currentVal = Number.isInteger(savedNumber) && savedNumber >= 1 && savedNumber <= 100
        ? savedNumber
        : Number.isInteger(legacyCard) && legacyCard >= 0 && legacyCard <= 12
          ? Math.round((legacyCard / 12) * 99) + 1
          : null;
      if (currentVal === null) fail('This round is invalid. Start a new game.', 409);
      const winningNumbers = choice === 'higher' ? 100 - currentVal : currentVal - 1;
      if (winningNumbers < 1) fail(`No number can be ${choice} than ${currentVal}. Choose the other direction.`);
      const winProbability = winningNumbers / 100;
      const nextNumber = randomInt(100) + 1;
      round.gameData.currentNumber = nextNumber;
      delete round.gameData.currentCard;
      const won = (choice === 'higher' && nextNumber > currentVal) ||
                  (choice === 'lower' && nextNumber < currentVal);
      if (won) {
        round.gameData.streak++;
        round.gameData.multiplier = floorTo(Number(round.gameData.multiplier || 1) * HOUSE_RETURN / winProbability, 10000);
        msg = `Correct! Streak: ${round.gameData.streak}. Cash out at ${round.gameData.multiplier.toFixed(2)}×.`;
        round.log.push(msg);
        round.version++;
        return { kind: 'casino', game, roundId: round.id, status: 'playing',
          bet: round.bet, stake: round.stake, outcome: null, payout: 0,
          win: false, coinsEarned: 0, msg };
      } else {
        outcome = 'loss';
        payout = 0;
        msg = nextNumber === currentVal ? 'Equal number. Ties lose.' : 'Wrong direction.';
      }
    } else if (move === 'cashout') {
      payout = Math.floor(round.stake * Number(round.gameData.multiplier || 1));
      outcome = 'cashout';
    }
  } else if (game === 'mines') {
    if (move === 'reveal') {
      const index = request.index;
      if (!Number.isInteger(index) || index < 0 || index >= 25) fail('Invalid tile index.');
      if (round.gameData.revealed.includes(index)) fail('Tile already revealed.');
      
      round.gameData.revealed.push(index);
      
      if (round.gameData.mines.includes(index)) {
        outcome = 'loss';
        payout = 0;
        msg = 'Boom! You hit a mine.';
      } else {
        const safeRevealed = round.gameData.revealed.filter(i => !round.gameData.mines.includes(i)).length;
        const totalSafe = 25 - round.gameData.mines.length;
        round.gameData.multiplier = minesMultiplier(safeRevealed, totalSafe, 25);
        msg = `Safe! Multiplier now ${round.gameData.multiplier.toFixed(2)}×`;
        round.log.push(msg);
        round.version++;
        return { kind: 'casino', game, roundId: round.id, status: 'playing',
          bet: round.bet, stake: round.stake, outcome: null, payout: 0,
          win: false, coinsEarned: 0, msg };
      }
    } else if (move === 'cashout') {
      const multiplier = round.gameData.multiplier || 1;
      payout = Math.floor(round.stake * multiplier);
      outcome = 'cashout';
    }
  } else if (game === 'numberguess') {
    if (move === 'guess') {
        const guess = request.guess;
        if (!Number.isInteger(guess) || guess < 1 || guess > 100) fail('Guess must be between 1 and 100.');
        if (!Array.isArray(round.gameData.guesses)) round.gameData.guesses = [];
        if (round.gameData.guesses.includes(guess)) fail('Choose a number you have not tried yet.');
        round.gameData.guesses.push(guess);
        round.gameData.attempts++;
        
        if (guess === round.gameData.target) {
          payout = Math.floor(round.stake * NUMBER_GUESS_MULTIPLIER);
          outcome = 'win';
          msg = `Correct! ${NUMBER_GUESS_MULTIPLIER.toFixed(1)}× returned after ${round.gameData.attempts} ${round.gameData.attempts === 1 ? 'pick' : 'picks'}.`;
        } else if (round.gameData.attempts >= round.gameData.maxAttempts) {
          outcome = 'loss';
          msg = `Out of attempts. The number was ${round.gameData.target}.`;
        } else {
          const remaining = round.gameData.maxAttempts - round.gameData.attempts;
          msg = `Not it. ${remaining} ${remaining === 1 ? 'pick' : 'picks'} left.`;
          round.log.push(msg);
          round.version++;
          return { kind: 'casino', game, roundId: round.id, status: 'playing',
            bet: round.bet, stake: round.stake, outcome: null, payout: 0,
            win: false, coinsEarned: 0, msg };
        }
    }
  } else if (game === 'crash') {
    const multiplier = crashMultiplier(round, now);
    round.gameData.multiplier = Math.min(multiplier, round.gameData.crashPoint);
    if (multiplier >= round.gameData.crashPoint) {
      outcome = 'crash';
      msg = `Crashed at ${round.gameData.crashPoint.toFixed(2)}×`;
    } else if (move === 'cashout') {
      payout = Math.floor(round.stake * multiplier);
      outcome = 'cashout';
      msg = `Cashed out at ${multiplier.toFixed(2)}×`;
    } else {
      return { kind: 'casino', game, roundId: round.id, status: 'playing', bet: round.bet, stake: round.stake, payout: 0, win: false, coinsEarned: 0, msg: `Multiplier ${multiplier.toFixed(2)}×` };
    }
  } else if (game === 'trivia') {
    if (move === 'answer' && (!Number.isInteger(request.answer) || request.answer < 0 || request.answer > 3)) fail('Choose an answer.');
    payout = round.stake;
    outcome = 'push';
    msg = 'Trivia was retired. Your full stake was returned.';
  }
  
  // Settle the game
  round.status = 'settled';
  round.outcome = outcome;
  round.payout = payout;
  round.net = payout - round.stake;
  round.finishedAt = now;
  round.version++;
  state.games++;
  state.wins += round.net > 0 ? 1 : 0;
  state.net += round.net;
  
  if (!msg) {
    msg = outcome === 'cashout' ? `Cashed out. ${payout} coins returned.`
      : outcome === 'win' ? `You win! ${payout} coins returned.`
        : `Game over. No payout.`;
  }
  round.log.push(msg);
  
  state.casinoHistory = [...(state.casinoHistory || []), {
    id: round.id, game: round.game, bet: round.bet, stake: round.stake,
    outcome, payout, net: round.net, finishedAt: now,
  }].slice(-12);
  
  return { kind: 'casino', game, roundId: round.id, status: round.status,
    bet: round.bet, stake: round.stake, outcome: round.outcome, payout: round.payout,
    win: round.net > 0, coinsEarned: 0, msg };
}

function snapshotRound(round, coins, now = Date.now()) {
  if (!round) return null;
  const blackjack = round.game === 'blackjack';
  const playing = round.status === 'playing';
  const canDouble = blackjack && playing && round.player.length === 2 && round.bet === round.stake && coins >= round.bet;
  const base = {
    id: round.id, game: round.game, status: round.status, version: round.version,
    bet: round.bet, stake: round.stake,
    outcome: round.outcome, payout: round.payout, net: round.net, canDouble,
    startedAt: round.startedAt, finishedAt: round.finishedAt, serverNow: now, log: [...round.log],
  };
  if (blackjack) {
    return { ...base,
      player: round.player.map(cardView),
      dealer: playing ? [cardView(round.dealer[0]), { hidden: true }] : round.dealer.map(cardView),
      playerTotal: blackjackTotal(round.player),
      dealerTotal: !playing ? blackjackTotal(round.dealer) : null,
      actions: !playing ? [] : ['hit', 'stand', ...(canDouble ? ['double'] : [])],
    };
  }
  if (round.game === 'videopoker') {
    return { ...base,
      player: round.player.map(cardView),
      dealer: [],
      playerTotal: null, dealerTotal: null,
      actions: !playing ? [] : ['draw'],
    };
  }
  const data = round.gameData || {};
  let gameData = {};
  if (round.game === 'higherlower') {
    const savedNumber = Number(data.currentNumber);
    const legacyCard = Number(data.currentCard);
    const currentNumber = Number.isInteger(savedNumber) && savedNumber >= 1 && savedNumber <= 100
      ? savedNumber
      : Number.isInteger(legacyCard) && legacyCard >= 0 && legacyCard <= 12
        ? Math.round((legacyCard / 12) * 99) + 1
        : null;
    gameData = { currentNumber, streak: data.streak, multiplier: data.multiplier || 1 };
  }
  if (round.game === 'mines') gameData = { revealed: [...(data.revealed || [])], multiplier: data.multiplier, ...(!playing ? { mines: [...(data.mines || [])] } : {}) };
  if (round.game === 'numberguess') gameData = { attempts: data.attempts, maxAttempts: data.maxAttempts, guesses: [...(data.guesses || [])], multiplier: NUMBER_GUESS_MULTIPLIER, ...(!playing ? { target: data.target } : {}) };
  if (round.game === 'trivia') {
    const question = TRIVIA[data.questionIndex] || TRIVIA[0];
    gameData = { question: { prompt: question.prompt, options: [...question.options] }, ...(!playing ? { answer: question.answer } : {}) };
  }
  if (round.game === 'crash') {
    const current = playing ? crashMultiplier(round, now) : data.multiplier;
    gameData = { multiplier: Math.min(current, data.crashPoint), crashed: current >= data.crashPoint, ...(!playing || current >= data.crashPoint ? { crashPoint: data.crashPoint } : {}) };
  }
  return { ...base,
    player: [], dealer: [],
    playerTotal: null, dealerTotal: null,
    actions: playing ? [round.game] : [],
    gameData,
  };
}
module.exports = { apply, snapshotRound, blackjackTotal, pokerRank, shuffledDeck, minesMultiplier, PAYTABLE, RULES, HOUSE_RETURN, NUMBER_GUESS_MULTIPLIER };
