const crypto = require('crypto');

const DAY = 86400000;
const PAYTABLE = [
  ['Royal flush', 250], ['Straight flush', 50], ['Four of a kind', 25],
  ['Full house', 9], ['Flush', 6], ['Straight', 4], ['Three of a kind', 3],
  ['Two pair', 2], ['Jacks or better', 1], ['No win', 0],
].map(([name, multiplier]) => ({ name, multiplier }));
const RULES = {
  blackjack: 'Dealer stands on all 17s. Blackjack pays 3:2. Other wins pay 1:1. A push returns your stake. Double on your first two cards. No split or insurance.',
  videopoker: 'Five-card draw, Jacks or Better. Hold any cards, then draw once. Payouts in the paytable include your stake.',
  higherlower: 'Guess if the next card is higher or lower. Build your streak for bigger payouts. Cash out anytime.',
  mines: 'Reveal safe tiles on a 5×5 grid. Avoid 5 mines. Multiplier increases with each safe tile. Cash out anytime.',
  numberguess: 'Guess a number between 1 and 100. Fewer attempts means bigger wins. Up to 7 attempts with progressive hints.',
  crash: 'Multiplier climbs from 1×. Cash out before it crashes. Random crash point between 1× and 100×.',
  trivia: 'Answer trivia questions correctly to earn coins. Each correct answer pays 1× your stake.',
};
function fail(message, status = 400) { const error = new Error(message); error.status = status; throw error; }
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
  const supportedGames = ['blackjack', 'videopoker', 'higherlower', 'mines', 'numberguess', 'crash', 'trivia'];
  if (!supportedGames.includes(game)) fail('Choose Blackjack or Video Poker.');
  
  if (['higherlower', 'mines', 'numberguess', 'crash', 'trivia'].includes(game)) {
    return applyTextGame(state, request, { now, randomInt });
  }
  
  if (move === 'deal') {
    const abandoned = abandonCurrentRound(state, now);
    const bet = request.bet;
    if (!Number.isSafeInteger(bet) || bet < 1) fail('Bet must be a positive whole number.');
    const today = Math.floor(now / DAY);
    if (state.casinoDay !== today) { state.casinoDay = today; state.playsToday = 0; }
    if (!abandoned && state.lastPlayAt && now - state.lastPlayAt < 2000) fail('Wait two seconds before dealing a new hand.', 429);
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
          playerNatural && dealerNatural ? bet : playerNatural ? bet * 2.5 : 0, now);
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
    if (!abandoned && state.lastPlayAt && now - state.lastPlayAt < 1000) fail('Wait a moment before starting another game.', 429);
    
    state.playsToday++;
    state.lastPlayAt = now;
    
    const round = {
      id: request.requestId, game, status: 'playing', version: 1, bet, stake: bet,
      player: [], dealer: [], deck: [], outcome: null,
      payout: 0, net: 0, startedAt: now, finishedAt: null, log: [],
      gameData: {},
    };
    
    if (game === 'mines') {
      const mineCount = 5;
      const minePositions = new Set();
      while (minePositions.size < mineCount) {
        minePositions.add(randomInt(25));
      }
      round.gameData.mines = [...minePositions];
      round.gameData.revealed = [];
      round.gameData.multiplier = 1;
    } else if (game === 'numberguess') {
      round.gameData.target = randomInt(100) + 1;
      round.gameData.attempts = 0;
      round.gameData.maxAttempts = 7;
    } else if (game === 'crash') {
      const r = randomInt(10000) / 10000;
      round.gameData.crashPoint = Math.max(1, Math.floor((1 / (1 - r)) * 100) / 100);
      if (round.gameData.crashPoint > 100) round.gameData.crashPoint = 100;
      round.gameData.multiplier = 1;
    } else if (game === 'higherlower') {
      round.gameData.currentCard = randomInt(13);
      round.gameData.streak = 0;
    } else if (game === 'trivia') {
      round.gameData.questionIndex = randomInt(10);
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
  
  let payout = 0;
  let outcome = '';
  let msg = '';
  
  if (game === 'higherlower') {
    if (move === 'guess') {
      const choice = request.choice;
      if (!['higher', 'lower'].includes(choice)) fail('Choose higher or lower.');
      const currentVal = round.gameData.currentCard;
      const nextCard = randomInt(13);
      round.gameData.currentCard = nextCard;
      const won = (choice === 'higher' && nextCard > currentVal) || 
                  (choice === 'lower' && nextCard < currentVal) ||
                  (nextCard === currentVal);
      if (won) {
        round.gameData.streak++;
        msg = `Correct! Streak: ${round.gameData.streak}`;
        round.version++;
        return { kind: 'casino', game, roundId: round.id, status: 'playing',
          bet: round.bet, stake: round.stake, outcome: null, payout: 0,
          win: false, coinsEarned: 0, msg };
      } else {
        outcome = 'loss';
        payout = 0;
      }
    } else if (move === 'cashout') {
      const streak = request.streak ?? round.gameData.streak ?? 0;
      payout = Math.floor(round.stake * (1 + streak * 0.5));
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
        round.gameData.multiplier = 1 + (safeRevealed / totalSafe) * 4;
        msg = `Safe! Multiplier now ${round.gameData.multiplier.toFixed(2)}×`;
        round.version++;
        return { kind: 'casino', game, roundId: round.id, status: 'playing',
          bet: round.bet, stake: round.stake, outcome: null, payout: 0,
          win: false, coinsEarned: 0, msg };
      }
    } else if (move === 'cashout') {
      const multiplier = request.multiplier || round.gameData.multiplier || 1;
      payout = Math.floor(round.stake * multiplier);
      outcome = 'cashout';
    } else if (move === 'crash') {
      outcome = 'loss';
      msg = 'Boom! You hit a mine.';
    }
  } else if (game === 'numberguess') {
    if (move === 'guess') {
      // Accept either server-side validation (request.guess) or client-settled (request.correct)
      if (request.correct !== undefined) {
        // Client settled: use attempts from request
        round.gameData.attempts = request.attempts || round.gameData.attempts;
        if (request.correct) {
          payout = Math.floor(round.stake * (1 + (round.gameData.maxAttempts - round.gameData.attempts) * 0.3));
          outcome = 'win';
          msg = `Correct! Got it in ${round.gameData.attempts} attempts.`;
        } else {
          outcome = 'loss';
          msg = `Out of attempts. The number was ${round.gameData.target}.`;
        }
      } else {
        const guess = request.guess;
        if (!Number.isInteger(guess) || guess < 1 || guess > 100) fail('Guess must be between 1 and 100.');
        round.gameData.attempts++;
        
        if (guess === round.gameData.target) {
          payout = Math.floor(round.stake * (1 + (round.gameData.maxAttempts - round.gameData.attempts) * 0.3));
          outcome = 'win';
          msg = `Correct! Got it in ${round.gameData.attempts} attempts.`;
        } else if (round.gameData.attempts >= round.gameData.maxAttempts) {
          outcome = 'loss';
          msg = `Out of attempts. The number was ${round.gameData.target}.`;
        } else {
          const hint = guess > round.gameData.target ? 'Too high!' : 'Too low!';
          msg = hint;
          round.version++;
          return { kind: 'casino', game, roundId: round.id, status: 'playing',
            bet: round.bet, stake: round.stake, outcome: null, payout: 0,
            win: false, coinsEarned: 0, msg };
        }
      }
    }
  } else if (game === 'crash') {
    if (move === 'cashout') {
      const multiplier = request.multiplier || 1;
      payout = Math.floor(round.stake * multiplier);
      outcome = 'cashout';
      msg = `Cashed out at ${multiplier.toFixed(2)}×`;
    } else if (move === 'crash') {
      outcome = 'crash';
      msg = `Crashed at ${round.gameData.crashPoint?.toFixed(2) || '?'}×`;
    }
  } else if (game === 'trivia') {
    if (move === 'answer') {
      const correct = request.correct;
      if (correct) {
        payout = round.stake;
        outcome = 'win';
        msg = 'Correct answer!';
      } else {
        outcome = 'loss';
        msg = 'Wrong answer.';
      }
    }
  }
  
  // Settle the game
  round.status = 'settled';
  round.outcome = outcome;
  round.payout = payout;
  round.net = payout - round.stake;
  round.finishedAt = now;
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

function snapshotRound(round, coins) {
  if (!round) return null;
  const blackjack = round.game === 'blackjack';
  const playing = round.status === 'playing';
  const canDouble = blackjack && playing && round.player.length === 2 && round.bet === round.stake && coins >= round.bet;
  const base = {
    id: round.id, game: round.game, status: round.status, version: round.version,
    bet: round.bet, stake: round.stake,
    outcome: round.outcome, payout: round.payout, net: round.net, canDouble,
    startedAt: round.startedAt, finishedAt: round.finishedAt, log: [...round.log],
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
  return { ...base,
    player: [], dealer: [],
    playerTotal: null, dealerTotal: null,
    actions: playing ? [round.game] : [],
    gameData: round.gameData || {},
  };
}
module.exports = { apply, snapshotRound, blackjackTotal, pokerRank, shuffledDeck, PAYTABLE, RULES };
