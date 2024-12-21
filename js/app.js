const urlParams = new URLSearchParams(window.location.search)
const mode = urlParams.get('mode')

let isSinglePlayer = mode === 'one'

// Global Variables
let playerOneScore = 0
let playerTwoScore = 0
let board = Array(9).fill(null)
let turn = 'X'
let winner = null
let firstPlayer = 'X'

// Constants
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

const messageEl = document.getElementById('win-message')
const squareEls = document.querySelectorAll('[id^="sq"]')
const restartButton = document.getElementById('reset-button')
const hardResetButton = document.getElementById('hard-reset')

// Score elements
const tTextRight = document.getElementById('t-text-right') 
const tTextLeft = document.getElementById('t-text-left')

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
            setTimeout(makeAiMove, 500)
        }
    }
}

function findBestMove(player) {
    for (let i = 0; i < winningCombos.length; i++) {
        const [a, b, c] = winningCombos[i]
        const values = [board[a], board[b], board[c]]

        if (values.filter(v => v === player).length === 2 && values.filter(v => v === null).length === 1) {
            return [a, b, c].find(index => board[index] === null)
        }
    }

    return null
}

function makeAiMove() {
    const availableMoves = board
        .map((value, index) => (value === null ? index : null))
        .filter(index => index !== null)

    if (availableMoves.length === 0) return

    let move = findBestMove('O')
    console.log("AI move:", move)
    
    if (move === null) {
        move = findBestMove('X')
        console.log("Blocking player move:", move)
    }

    if (move === null) {
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)]
        console.log("Random move:", move)
    }

    board[move] = 'O'
    const aiSquare = document.getElementById(`sq${move}`)
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
            return;
        }
    }
    if (!board.includes(null)) {
        displayWinnerMessage('draw')
    }
}

function displayWinnerMessage(result) {
    const messageEl = document.getElementById('win-message')

    messageEl.classList.remove('x-win-msg', 'o-win-msg')
    messageEl.style.color = ''

    if (result === 'draw') {
        messageEl.textContent = "draw!"
        messageEl.style.color = "var(--Sagewood)"
    } else {
        messageEl.textContent = `${result} wins!`
        messageEl.classList.add(result === 'X' ? 'x-win-msg' : 'o-win-msg')
        messageEl.style.color = result === 'X' ? 'var(--Frosted-Mint)' : 'var(--Oceanic-Teal)'
    }

    restartButton.classList.remove('invisible')
    messageEl.style.display = 'block'
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

function updateScore(winner) {
    if (winner === 'X') {
        playerOneScore++
        tTextRight.textContent = `| ${playerOneScore}`
    } else if (winner === 'O') {
        playerTwoScore++
        tTextLeft.textContent = `| ${playerTwoScore}`
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

    updateTurnMessage()

    if (isSinglePlayer && turn === 'O') {
        setTimeout(makeAiMove, 500)
    }
}

// Navigate back to index.html
function resetToGameStart() {
    window.location.href = 'index.html'
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    squareEls.forEach(square => square.addEventListener('click', handleSquareClick))
    restartButton.addEventListener('click', resetGame)
    hardResetButton.addEventListener('click', resetToGameStart)
    updateTurnMessage()
})


















