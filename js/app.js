// Global Variables
let playerOneScore = 0
let playerTwoScore = 0
let board = Array(9).fill(null)
let turn = 'X'
let winner = null
let firstPlayer = 'X'
let isSinglePlayer = true // Toggle this for one-player or two-player mode

// Constants
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const messageEl = document.getElementById('win-message')
const squareEls = document.querySelectorAll('[id^="sq"]')
const restartButton = document.getElementById('reset-button')
const onePlayerButton = document.getElementById('one-player')
const twoPlayerButton = document.getElementById('two-player')

// Functions
function handleSquareClick(event) {
    const index = parseInt(event.target.id.replace('sq', ''))
    if (board[index] || winner) return

    board[index] = turn
    event.target.textContent = turn

    if (turn === 'X') {
        event.target.classList.add('x-mark', 'x-ease-in')
    } else {
        event.target.classList.add('o-mark', 'o-ease-in')
    }

    checkForWinner()

    if (!winner) {
        turn = turn === 'X' ? 'O' : 'X'
        updateTurnMessage()

        if (isSinglePlayer && turn === 'O') {
            setTimeout(makeAiMove, 500) // Add delay for better experience
        }
    }
}

function makeAiMove() {
    const availableMoves = board
        .map((value, index) => (value === null ? index : null))
        .filter(index => index !== null)

    if (availableMoves.length === 0) return

    // Simple AI: Choose a random available move
    const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)]
    board[randomIndex] = 'O'

    const aiSquare = document.getElementById(`sq${randomIndex}`)
    aiSquare.textContent = 'O'
    aiSquare.classList.add('o-mark', 'o-ease-in')

    checkForWinner()

    if (!winner) {
        turn = 'X'
        updateTurnMessage()
    }
}

function checkForWinner() {
    for (const [a, b, c] of winningCombos) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a]
            updateScore(winner)
            displayWinnerMessage(winner)
            return
        }
    }
    if (!board.includes(null)) {
        displayWinnerMessage('draw')
    }
}

function displayWinnerMessage(result) {
    if (result === 'draw') {
        messageEl.textContent = "draw"
        messageEl.style.color = "var(--Sagewood)"
    } else {
        messageEl.textContent = `${winner} wins`
        messageEl.classList.add(winner === 'X' ? 'x-win-msg' : 'o-win-msg')
        messageEl.style.color = winner === 'X' ? 'var(--Frosted-Mint)' : 'var(--Oceanic-Teal)' 
    }
    restartButton.classList.remove('invisible')
    messageEl.style.display = 'block'
}

function updateScore(winner) {
    if (winner === 'X') playerOneScore++
    else if (winner === 'O') playerTwoScore++
    document.getElementById('t-text-right').textContent = `| ${playerOneScore}`
    document.getElementById('t-text-left').textContent = `| ${playerTwoScore}`
}

function updateTurnMessage() {
    const messageLeft = document.getElementById('message-left')
    const messageRight = document.getElementById('message-right')

    messageLeft.classList.remove('active')
    messageRight.classList.remove('active')

    if (turn === 'X') {
        messageRight.classList.add('active')
    } else {
        messageLeft.classList.add('active')
    }
}

function resetGame() {
    board.fill(null)
    winner = null

    firstPlayer = firstPlayer === 'X' ? 'O' : 'X'
    turn = firstPlayer

    squareEls.forEach(square => {
        square.textContent = ''
        square.classList.remove('o-ease-in', 'x-ease-in', 'o-mark', 'x-mark')
    })

    messageEl.textContent = ''
    restartButton.classList.add('invisible')

    document.getElementById('t-text-right').textContent = `| ${playerOneScore}`
    document.getElementById('t-text-left').textContent = `| ${playerTwoScore}`

    updateTurnMessage()

    squareEls.forEach(square => {
        square.addEventListener('click', handleSquareClick)
    })

    if (isSinglePlayer && turn === 'O') {
        setTimeout(makeAiMove, 500) // Ensure the computer plays first in single player mode
    }
}

// Function to reset the scores when the game mode changes
function resetScoreboard() {
    playerOneScore = 0
    playerTwoScore = 0
    document.getElementById('t-text-right').textContent = `| ${playerOneScore}`
    document.getElementById('t-text-left').textContent = `| ${playerTwoScore}`
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    squareEls.forEach(square => square.addEventListener('click', handleSquareClick))
    restartButton.addEventListener('click', resetGame)
    updateTurnMessage()

    onePlayerButton.addEventListener('click', () => {
        isSinglePlayer = true
        resetScoreboard()  // Reset the score when changing to single player mode
        resetGame()        // Reset the game board
    })

    twoPlayerButton.addEventListener('click', () => {
        isSinglePlayer = false
        resetScoreboard()  // Reset the score when changing to two player mode
        resetGame()        // Reset the game board
    })
})










