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
    [2, 4, 6]
]

const messageEl = document.getElementById('win-message')
const squareEls = document.querySelectorAll('[id^="sq"]')
const restartButton = document.getElementById('reset-button')

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
    }
}

function checkForWinner() {
    console.log("Current board state:", board)

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

    const drawMessageEl = document.getElementById('drawMessage')
    drawMessageEl.style.display = "none"
    drawMessageEl.textContent = ""
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    squareEls.forEach(square => square.addEventListener('click', handleSquareClick))
    restartButton.addEventListener('click', resetGame)
    updateTurnMessage()
})