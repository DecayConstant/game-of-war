
import * as shuffle from 'lodash.shuffle'

type Card = { name: string, value: number }
type Deck = Card[]
type PlayerName = 'p1' | 'p2'

const deck: Deck = [
  { name: '2', value: 2 }, { name: '2', value: 2 }, { name: '2', value: 2 }, { name: '2', value: 2 },
  { name: '3', value: 3 }, { name: '3', value: 3 }, { name: '3', value: 3 }, { name: '3', value: 3 },
  { name: '4', value: 4 }, { name: '4', value: 4 }, { name: '4', value: 4 }, { name: '4', value: 4 },
  { name: '5', value: 5 }, { name: '5', value: 5 }, { name: '5', value: 5 }, { name: '5', value: 5 },
  { name: '6', value: 6 }, { name: '6', value: 6 }, { name: '6', value: 6 }, { name: '6', value: 6 },
  { name: '7', value: 7 }, { name: '7', value: 7 }, { name: '7', value: 7 }, { name: '7', value: 7 },
  { name: '8', value: 8 }, { name: '8', value: 8 }, { name: '8', value: 8 }, { name: '8', value: 8 },
  { name: '9', value: 9 }, { name: '9', value: 9 }, { name: '9', value: 9 }, { name: '9', value: 9 },
  { name: '10', value: 10 }, { name: '10', value: 10 }, { name: '10', value: 10 }, { name: '10', value: 10 },
  { name: 'J', value: 11 }, { name: 'J', value: 11 }, { name: 'J', value: 11 }, { name: 'J', value: 11 },
  { name: 'Q', value: 12 }, { name: 'Q', value: 12 }, { name: 'Q', value: 12 }, { name: 'Q', value: 12 },
  { name: 'K', value: 13 }, { name: 'K', value: 13 }, { name: 'K', value: 13 }, { name: 'K', value: 13 },
  { name: 'A', value: 14 }, { name: 'A', value: 14 }, { name: 'A', value: 14 }, { name: 'A', value: 14 },
]

const shuffledDeck: Deck = shuffle(deck)

// Split the decks and assign one half to each player.
let player1: Deck = shuffledDeck.slice(0, 26)
let player2: Deck = shuffledDeck.slice(26, 52)

let winner
let rounds = 0

// Main Game Loop!
while (player1.length !== 0 && player2.length !== 0) {
  rounds++
  winner = doBattle()

  // Give up after 10000 rounds.
  if (rounds > 10000) {
    break
  }
}

console.log(`${winner} won the game in ${rounds} rounds!`)

// Does one battle, i.e.: Takes the top cards from each deck and give the winner the cards. 
// Initiates a WAR if the battle is a tie.
function doBattle(isWarBattle: boolean = false): PlayerName {
  const p1Card = player1.shift()
  const p2Card = player2.shift()
  let warWinner: PlayerName
  let battleWinner: PlayerName

  console.log(`${isWarBattle ? 'WAR: ' : ''}P1: ${p1Card.name} v. P2: ${p2Card.name}`)
  if (p1Card.value === p2Card.value) {
    // WAR!
    warWinner = doWar()
  }

  if (p1Card.value > p2Card.value || warWinner === 'p1') {
    player1 = [...player1, ...shuffle([p1Card, p2Card])]
    battleWinner = 'p1'
  } else if (p1Card.value < p2Card.value || warWinner === 'p2') {
    player2 = [...player2, ...shuffle([p1Card, p2Card])]
    battleWinner = 'p2'
  }

  // Don't print anything if this is a Mid-War Battle.
  if (!isWarBattle) {
    console.log(`${battleWinner} wins.  ${player1.length} - ${player2.length}`)
  }

  // Shows the players' decks after each round
  // console.log(`P1: ${player1.map(c=>c.name).join(',')}`)
  // console.log(`P2: ${player2.map(c=>c.name).join(',')}`)

  return battleWinner
}

// Handles the War logic.
function doWar(): PlayerName {
  // If a player doesn't have enough cards to war, they lose.
  // Set their deck to [] to trigger the game-loop's end condition.
  if (player1.length < 4) {
    player2 = [...player1, ...player2]
    player1 = []
    return 'p2'
  } else if (player2.length < 4) {
    player1 = [...player1, ...player2]
    player2 = []
    return 'p1'
  }

  const p1FaceDown = player1.splice(0, 3)
  const p2FaceDown = player2.splice(0, 3)

  // Show each player's face down cards in the War.
  console.log(`WAR: P1 Face Down: ${p1FaceDown.map(card => card.name).join(', ')}`)
  console.log(`WAR: P2 Face Down: ${p2FaceDown.map(card => card.name).join(', ')}`)

  // Do a regular battle to determine the war's winner
  const winner = doBattle(true)

  // Give the war's winner the face-down cards.
  // Shuffling the pot here, and in regular battles, helps prevent infinite-loop games.
  if (winner === 'p1') {
    player1 = [...player1, ...shuffle([...p1FaceDown, ...p2FaceDown])]
  } else {
    player2 = [...player2, ...shuffle([...p1FaceDown, ...p2FaceDown])]
  }

  return winner
}