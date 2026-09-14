import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
const require = createRequire(import.meta.url);
const model = require('../chat-git-main/services/chat/communityModel');
const casino = require('../chat-git-main/services/chat/casinoModel');
const now = Date.UTC(2026, 8, 6, 12);
const c = (rank, suit = 'S') => 'SHDC'.indexOf(suit) * 13 + ({ J: 11, Q: 12, K: 13, A: 14 }[rank] || Number(rank)) - 2;
const req = body => ({ action: 'casino', requestId: randomUUID(), ...body });
function rig(draws) {
  assert.equal(new Set(draws).size, draws.length);
  const source = Array.from({ length: 52 }, (_, i) => i);
  const target = [...source.filter(card => !draws.includes(card)), ...draws.toReversed()];
  return max => {
    const i = max - 1, j = source.indexOf(target[i]);
    assert.ok(j <= i);
    [source[i], source[j]] = [source[j], source[i]];
    return j;
  };
}
// deal() now passes coins as the balance, since casinoCredits is no longer in state
function deal(game, draws, coins = 900, bet = 10) {
  return model.action({}, coins, req({ game, move: 'deal', bet }), { now, randomInt: rig(draws) });
}
function move(previous, name, extra = {}, at = now, randomInt) {
  const round = previous.state.casinoRound;
  return model.action(previous.state, previous.coins, req({ game: round.game, move: name, roundId: round.id, version: round.version, ...extra }), { now: at, ...(randomInt ? { randomInt } : {}) });
}

test('shuffles use a complete unique deck and ace totals do not bust prematurely', () => {
  for (let i = 0; i < 50; i++) {
    const deck = casino.shuffledDeck();
    assert.equal(deck.length, 52); assert.equal(new Set(deck).size, 52);
  }
  assert.equal(casino.blackjackTotal([c('A'), c('A', 'H'), c(9)]), 21);
  assert.equal(casino.blackjackTotal([c('A'), c(6)]), 17);
  assert.equal(casino.blackjackTotal([c('A'), c(6), c('K')]), 17);
});

test('blackjack pays a natural 3:2, returns pushes, and resolves dealer naturals', () => {
  // Natural blackjack: bet 10, pays 2.5x = 25, net +15
  const natural = deal('blackjack', [c('A'), c(9), c('K'), c(7)], 900, 10);
  assert.equal(natural.coins, 915); // 900 - 10 + 25
  assert.equal(natural.state.casinoRound.outcome, 'blackjack');
  assert.equal(natural.state.casinoRound.payout, 25);
  // Push: bet 10, returns 10
  const push = deal('blackjack', [c('A'), c('A', 'H'), c('K'), c('Q', 'H')], 900, 10);
  assert.equal(push.coins, 900); assert.equal(push.state.casinoRound.outcome, 'push');
  // Loss: bet 10, payout 0
  const loss = deal('blackjack', [c(8), c('A'), c(9), c('Q')], 900, 10);
  assert.equal(loss.coins, 890); assert.equal(loss.state.casinoRound.outcome, 'loss');
  // Blackjack bets must be a valid integer
  assert.throws(() => model.action({}, 900, req({ game: 'blackjack', move: 'deal', bet: -5 }), { now }), /Invalid bet amount/);
});

test('dealer stands on soft 17 and a hand cannot pay twice', () => {
  const start = deal('blackjack', [c(10), c('A'), c(8), c(6)], 900, 10);
  const command = req({ game: 'blackjack', move: 'stand', roundId: start.state.casinoRound.id, version: 1 });
  const settled = model.action(start.state, start.coins, command, { now });
  assert.equal(settled.coins, 910); // Won 10 (1:1)
  assert.equal(settled.state.casinoRound.dealer.length, 2);
  const replay = model.action(settled.state, settled.coins, command, { now });
  assert.equal(replay.coins, 910); assert.equal(replay.state.games, 1);
  assert.throws(() => move(settled, 'stand'), /complete/);
});

test('doubling charges the second stake once and draws exactly one card', () => {
  const start = deal('blackjack', [c(5), c(10), c(6), c(7), c('K')], 900, 10);
  const settled = move(start, 'double');
  assert.equal(settled.state.casinoRound.player.length, 3);
  assert.equal(settled.state.casinoRound.stake, 20);
  assert.equal(settled.state.casinoRound.payout, 40);
  assert.equal(settled.coins, 920); // 900 - 20 (initial+double) + 40
  // Not enough coins to double
  const poor = deal('blackjack', [c(5), c(10), c(6), c(7)], 900, 10);
  poor.coins = 5; // Override to simulate poor player
  assert.throws(() => move(poor, 'double'), /Not enough/);
});

test('a bust settles immediately and stale moves cannot change a saved hand', () => {
  const start = deal('blackjack', [c(10), c(9), c(6), c(7), c('Q')], 900, 10);
  const bust = move(start, 'hit');
  assert.equal(bust.state.casinoRound.status, 'settled');
  assert.equal(bust.coins, 890); assert.equal(bust.state.net, -10);
  const live = deal('blackjack', [c(2), c(10), c(3), c(7), c(4)], 900, 10);
  const hit = move(live, 'hit');
  assert.equal(hit.state.casinoRound.version, 2);
  assert.throws(() => model.action(hit.state, 900, req({ game: 'blackjack', move: 'stand', roundId: hit.state.casinoRound.id, version: 1 }), { now }), /another tab/);
  assert.throws(() => move(hit, 'double'), /first two/);
});

test('every video poker hand category, including wheel and low pair, has the correct return', () => {
  const cases = [
    [[c(10), c('J'), c('Q'), c('K'), c('A')], 'Royal flush', 250],
    [[c('A'), c(2), c(3), c(4), c(5)], 'Straight flush', 50],
    [[c(7), c(7, 'H'), c(7, 'D'), c(7, 'C'), c(2)], 'Four of a kind', 25],
    [[c(7), c(7, 'H'), c(7, 'D'), c(2, 'C'), c(2)], 'Full house', 9],
    [[c(2), c(5), c(7), c(9), c('J')], 'Flush', 6],
    [[c('A'), c(2, 'H'), c(3), c(4), c(5)], 'Straight', 4],
    [[c(7), c(7, 'H'), c(7, 'D'), c(3, 'C'), c(2)], 'Three of a kind', 3],
    [[c(7), c(7, 'H'), c(2, 'D'), c(3, 'C'), c(2)], 'Two pair', 2],
    [[c('J'), c('J', 'H'), c(2, 'D'), c(3, 'C'), c(7)], 'Jacks or better', 1],
    [[c(10), c(10, 'H'), c(2, 'D'), c(3, 'C'), c(7)], 'No win', 0],
    [[c(10), c('J', 'H'), c('Q'), c('K'), c('A')], 'Straight', 4],
  ];
  for (const [hand, name, multiplier] of cases) assert.deepEqual(casino.pokerRank(hand), { name, multiplier });
});

test('poker holds preserve selected cards, draw settles once, and altered retries fail', () => {
  const first = [c('J'), c('J', 'H'), c(2), c(4, 'D'), c(7, 'C')];
  const start = deal('videopoker', [...first, c('J', 'D'), c('J', 'C'), c('K')], 900, 10);
  const command = req({ game: 'videopoker', move: 'draw', roundId: start.state.casinoRound.id, version: 1, hold: [0, 1] });
  const drawn = model.action(start.state, start.coins, command, { now });
  assert.deepEqual(drawn.state.casinoRound.player.slice(0, 2), first.slice(0, 2));
  assert.equal(drawn.state.casinoRound.outcome, 'Four of a kind');
  // Four of a kind pays 25x, so payout = 10 * 25 = 250, net = 240
  assert.equal(drawn.coins, 900 - 10 + 250); // 1140
  const replay = model.action(JSON.parse(JSON.stringify(drawn.state)), drawn.coins, command, { now });
  assert.equal(replay.coins, drawn.coins); // No change on replay
  assert.throws(() => model.action(drawn.state, 900, { ...command, hold: [] }, { now }), /different/);
  for (const hold of [[0, 0], [-1], [5], ['1'], null]) assert.throws(() => move(start, 'draw', { hold }), /different cards/);
  // Start state should still have 890 coins (900 - 10 bet)
  assert.equal(start.coins, 890);
});

test('a restored active hand hides the deck and dealer hole card, and is auto-abandoned when starting a new game', () => {
  const start = deal('blackjack', [c(10), c(9), c(6), c(7)], 900, 10);
  const restored = model.normalize(JSON.parse(JSON.stringify(start.state)));
  const view = model.snapshot(restored, 900, now).casino.round;
  assert.equal(view.dealer.length, 2); assert.deepEqual(view.dealer[1], { hidden: true });
  assert.equal(view.dealerTotal, null); assert.ok(!('deck' in view));
  assert.ok(!JSON.stringify(model.snapshot(restored, 900, now)).includes('"deck"'));
  const newGame = model.action(restored, 900, req({ game: 'videopoker', move: 'deal', bet: 10 }), { now: now + 10000 });
  assert.equal(newGame.state.casinoRound.game, 'videopoker');
  assert.equal(newGame.state.casinoRound.status, 'playing');
  assert.equal(newGame.state.casinoHistory.at(-1).outcome, 'loss');
  assert.equal(move({ state: restored, coins: 900 }, 'stand').state.casinoRound.status, 'settled');
});

test('holding all poker cards is valid and limits never prevent finishing a paid hand', () => {
  const start = deal('videopoker', [c(10), c('J'), c('Q'), c('K'), c('A')], 900, 10);
  const settled = move(start, 'draw', { hold: [0, 1, 2, 3, 4] });
  // Royal flush pays 250x, payout = 10 * 250 = 2500, net = 2490
  assert.equal(settled.coins, 900 - 10 + 2500); // 3390
  assert.equal(settled.state.casinoHistory[0].outcome, 'Royal flush');
  assert.equal(settled.state.games, 1); assert.equal(settled.state.wins, 1);
});

function textStart(game, randomInt = () => 0) {
  return model.action({}, 1000, req({ game, move: 'start', bet: 10 }), { now, randomInt });
}

test('text game snapshots hide answers and mine positions until settlement', () => {
  for (const game of ['mines', 'numberguess', 'crash']) {
    const start = textStart(game, () => game === 'crash' ? 9000 : 0);
    const view = model.snapshot(start.state, start.coins, now).casino.round;
    for (const key of ['mines', 'target', 'answer', 'questionIndex', 'crashPoint']) assert.ok(!(key in view.gameData), `${game} leaked ${key}`);
  }
});

test('number guess uses five unique blind picks with a fixed 80% return', () => {
  const start = textStart('numberguess', () => 41);
  assert.throws(() => move(start, 'guess', {correct: true, attempts: 1}), /Guess must/);
  const wrong = move(start, 'guess', {guess: 70});
  assert.equal(wrong.coins, 990);
  const view = model.snapshot(wrong.state, wrong.coins, now).casino.round;
  assert.equal(view.gameData.attempts, 1);
  assert.deepEqual(view.gameData.guesses, [70]);
  assert.ok(!('hint' in view.gameData));
  assert.equal(view.gameData.multiplier, 16);
  assert.throws(() => move(wrong, 'guess', {guess: 70}), /not tried/);
  const restored = {state: JSON.parse(JSON.stringify(wrong.state)), coins: wrong.coins};
  const win = move(restored, 'guess', {guess: 42});
  assert.equal(win.coins, 1150); assert.equal(win.state.casinoRound.status, 'settled');
  assert.throws(() => move(win, 'guess', {guess: 42}), /complete/);
});

test('mines cashouts use saved revealed tiles and reject invalid moves without losing a hand', () => {
  const start = textStart('mines');
  assert.deepEqual(start.state.casinoRound.gameData.mines, [0,1,2,3,4,5,6]);
  const safe = move(start, 'reveal', {index: 24});
  assert.equal(safe.state.casinoRound.gameData.multiplier, 1.13);
  const secondSafe = move(safe, 'reveal', {index: 23});
  assert.equal(secondSafe.state.casinoRound.gameData.multiplier, 1.6);
  assert.throws(() => move(safe, 'reveal', {index: 24}), /already/);
  assert.throws(() => move(safe, 'unexpected'), /Invalid move/);
  const cash = move(safe, 'cashout', {multiplier: 99999});
  assert.equal(cash.coins, 1001); assert.equal(cash.state.casinoRound.payout, 11);
  const loss = move(start, 'reveal', {index: 0});
  assert.equal(loss.coins, 990); assert.equal(loss.state.casinoRound.status, 'settled');
});

test('higher/lower uses exact 1-100 odds and equal numbers lose', () => {
  const start = textStart('higherlower', () => 49);
  assert.equal(casino.snapshotRound(start.state.casinoRound, start.coins, now).gameData.currentNumber, 50);
  const won = move(start, 'guess', {choice: 'higher'}, now, () => 99);
  assert.equal(won.state.casinoRound.gameData.streak, 1);
  assert.equal(won.state.casinoRound.gameData.multiplier, 1.64);
  assert.equal(won.state.casinoRound.version, 2);
  const cash = move(won, 'cashout', {streak: 999999});
  assert.equal(cash.coins, 1006);
  const tieStart = textStart('higherlower', () => 49);
  const tie = move(tieStart, 'guess', {choice: 'higher'}, now, () => 49);
  assert.equal(tie.coins, 990);
  assert.equal(tie.state.casinoRound.outcome, 'loss');
  assert.match(tie.state.casinoRound.log.at(-1), /Ties lose/);
  const maximum = textStart('higherlower', () => 99);
  assert.throws(() => move(maximum, 'guess', {choice:'higher'}, now, () => 0), /Choose the other/);
});

test('repeatable trivia questions cannot be used to farm casino coins', () => {
  assert.throws(() => textStart('trivia'), /current casino game/);
  const legacy = model.normalize({ casinoRound: {
    id: randomUUID(), game:'trivia', status:'playing', version:1, bet:10, stake:10,
    player:[], dealer:[], deck:[], outcome:null, payout:0, net:0, startedAt:now,
    finishedAt:null, log:['Trivia started. 10 coins staked.'], gameData:{questionIndex:0}
  }});
  const refunded = model.action(legacy, 990, req({ game:'trivia', move:'refund', roundId:legacy.casinoRound.id, version:1 }), { now });
  assert.equal(refunded.coins, 1000);
  assert.equal(refunded.state.casinoRound.outcome, 'push');
  assert.match(refunded.state.casinoRound.log.at(-1), /full stake was returned/);
});

test('crash uses an 82% server-side curve and cannot accept an invented multiplier', () => {
  const start = textStart('crash', () => 5000); // 1.64x crash point
  const cash = move(start,'cashout',{multiplier:999999},now+4000);
  assert.equal(cash.coins,1004); // 1.49x rounds to 14 coins returned
  const after = move(start,'cashout',{multiplier:1.5},now+8000);
  assert.equal(after.coins,990); assert.equal(after.state.casinoRound.outcome,'crash');
  const view = model.snapshot(start.state,start.coins,now+8000).casino.round;
  assert.equal(view.gameData.crashed,true);
  const tick = move(start,'tick',{},now+8000);
  assert.equal(tick.state.casinoRound.status,'settled');
});

test('odd blackjack bets never leave fractional coins that disappear on reload', () => {
  const natural = deal('blackjack',[c('A'),c(9),c('K'),c(7)],900,11);
  assert.equal(natural.coins,916); assert.equal(Number.isSafeInteger(natural.coins),true);
  assert.equal(model.normalize(natural.state).net,16);
});

test('settled games can start again immediately without an artificial cooldown', () => {
  const natural = deal('blackjack', [c('A'), c(9), c('K'), c(7)], 900, 10);
  const nextHand = model.action(natural.state, natural.coins, req({ game: 'blackjack', move: 'deal', bet: 10 }), {
    now,
    randomInt: rig([c(2), c(3), c(4), c(5)]),
  });
  assert.equal(nextHand.state.casinoRound.status, 'playing');

  const guess = textStart('numberguess', () => 0);
  const settled = move(guess, 'guess', { guess: 1 });
  const nextGuess = model.action(settled.state, settled.coins, req({ game: 'numberguess', move: 'start', bet: 10 }), { now, randomInt: () => 1 });
  assert.equal(nextGuess.state.casinoRound.status, 'playing');
});
