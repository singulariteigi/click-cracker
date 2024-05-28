document.addEventListener('DOMContentLoaded', () => {
    const playerNameInput = document.getElementById('player-name');
    const startButton = document.getElementById('start-button');
    const vsModeButton = document.getElementById('vs-mode-button');
    const characterSelection = document.getElementById('character-selection');
    const readyButton = document.getElementById('ready-button');
    const gameScreen = document.getElementById('game-screen');
    const countdown = document.getElementById('countdown');
    const clickButton = document.getElementById('click-button');
    const scoreDisplay = document.getElementById('score');
    const resultScreen = document.getElementById('result-screen');
    const restartButton = document.getElementById('restart-button');
    const backToTitleButton = document.getElementById('back-to-title-button');
    const multiplyButton = document.getElementById('multiply-button');
    const tradeButton = document.getElementById('trade-button');
    const skillButton = document.getElementById('skill-button');
    const finalCpDisplay = document.getElementById('final-cp');
    const characters = document.querySelectorAll('.character');

    let selectedCharacter = null;
    let score = 0;
    let clickValue = 1;
    let gameInterval = null;
    let countdownInterval = null;
    let recordInterval = null;
    let multiplyActive = false;
    let skillActive = false;
    const cpHistory = [];
    let chart = null;
    let selectedCharacterImage = null;

    // プレイヤー名の入力チェック
    playerNameInput.addEventListener('input', () => {
        if (playerNameInput.value.trim() !== '') {
            startButton.disabled = false;
        } else {
            startButton.disabled = true;
        }
    });

    startButton.addEventListener('click', () => {
        if (playerNameInput.value.trim() === '') {
            alert('Please enter your name.');
            return;
        }

        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('selectYourCharacter').style.display = 'block';
        characterSelection.style.display = 'flex';
    });

    vsModeButton.addEventListener('click', () => {
        if (playerNameInput.value.trim() === '') {
            alert('Please enter your name.');
            return;
        }

        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('selectYourCharacter').style.display = 'block';
        characterSelection.style.display = 'flex';
    });

    characters.forEach(character => {
        character.addEventListener('click', () => {
            characters.forEach(c => c.style.border = '2px solid #000');
            character.style.border = '2px solid red';
            selectedCharacter = character.dataset.character;
            selectedCharacterImage = character.querySelector('img').src;
            readyButton.style.display = 'block';
        });
    });

    readyButton.addEventListener('click', () => {
        document.getElementById('selectYourCharacter').style.display = 'none';
        characterSelection.style.display = 'none';
        gameScreen.style.display = 'block';
        document.getElementById('character-image').src = selectedCharacterImage;
        startCountdown();
    });

    function startCountdown() {
        let timeLeft = 3;
        countdown.textContent = timeLeft;
        countdown.style.display = 'block';

        countdownInterval = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft === 0) {
                clearInterval(countdownInterval);
                startGame();
            } else {
                countdown.textContent = timeLeft;
            }
        }, 1000);
    }

    function startGame() {
        countdown.style.display = 'none';
        clickButton.style.display = 'block';
        multiplyButton.style.display = 'inline-block';
        tradeButton.style.display = 'inline-block';
        skillButton.style.display = 'inline-block';
        scoreDisplay.style.display = 'block';
        score = 0;
        clickValue = 1;
        cpHistory.length = 0;
        updateScore();

        gameInterval = setTimeout(endGame, 20000);
        recordInterval = setInterval(recordCpHistory, 1000);
        startGameTimer();

        clickButton.addEventListener('click', incrementScore);
        multiplyButton.addEventListener('click', multiplyScore);
        tradeButton.addEventListener('click', tradeScore);
        skillButton.addEventListener('click', useSkill);

           
    }

    function incrementScore() {
        score += clickValue;
        updateScore();
    }

    function multiplyScore() {
        if (score >= 10 && !multiplyActive) {
            score -= 10;
            clickValue *= 2;
            multiplyActive = true;
            setTimeout(() => {
                clickValue /= 2;
                multiplyActive = false;
            }, 5000);
            updateScore();
        }
    }

    function tradeScore() {
        if (score >= 50) {
            score -= 50;
            score += 100;
            updateScore();
        }
    }

    function useSkill() {
        if (score >= 100) {
            score -= 100;
            clickValue *= 5;
            setTimeout(() => {
                clickValue /= 5;
            }, 5000);
            updateScore();
        }
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }


    function endGame() {
    
        // 以下のコードは変更なし
        clickButton.style.display = 'none';
        multiplyButton.style.display = 'none';
        tradeButton.style.display = 'none';
        skillButton.style.display = 'none';
        scoreDisplay.style.display = 'none';
        clearInterval(gameInterval);
        clearInterval(recordInterval);
    
        // イベントリスナーの削除
        clickButton.removeEventListener('click', incrementScore);
        multiplyButton.removeEventListener('click', multiplyScore);
        tradeButton.removeEventListener('click', tradeScore);
        skillButton.removeEventListener('click', useSkill);
    
        recordCpHistory(true, 20);
    
        resultScreen.style.display = 'block';
        drawChart();


    }
    

    let startTime;

    function recordCpHistory(force = false, forceTime = null) {
        if (!startTime) startTime = Date.now();
        const elapsedTime = forceTime !== null ? forceTime : Math.round((Date.now() - startTime) / 1000);
        if (force || cpHistory.length === 0 || elapsedTime > cpHistory[cpHistory.length - 1].time) {
            cpHistory.push({ time: elapsedTime, score: score });
        }
    }

    function startGameTimer() {
        let gameTimeLeft = 20;
        countdown.textContent = gameTimeLeft;
        countdown.style.display = 'block';
    
        const gameTimerInterval = setInterval(() => {
            gameTimeLeft -= 1;
            if (gameTimeLeft <= 0) {
                clearInterval(gameTimerInterval);
                countdown.style.display = 'none';
                endGame();
            } else {
                countdown.textContent = gameTimeLeft;
            }
        }, 1000);
    }

    function drawChart() {
        const ctx = document.getElementById('result-chart').getContext('2d');
        const labels = cpHistory.map(entry => entry.time);
        const data = cpHistory.map(entry => entry.score);

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'CP Over Time',
                    data: data,
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 4,
                    fill: false,
                    lineTension: 0
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Time (s)',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff',
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'CP',
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                animation: false
            }
        });

        const partialData = data.slice(0, Math.floor(data.length * 0.8));
        chart.data.datasets[0].data = partialData;
        chart.update();

        setTimeout(() => {
            chart.data.datasets[0].data = data;
            chart.update();
            finalCpDisplay.textContent = `Final CP: ${score}`;
            finalCpDisplay.style.display = 'block';
        }, 2000);
    }

    restartButton.addEventListener('click', () => {
        resultScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        characterSelection.style.display = 'block';
        finalCpDisplay.style.display = 'none';
        startTime = null;
    });

    backToTitleButton.addEventListener('click', () => {
        resultScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        document.getElementById('title-screen').style.display = 'block';
        finalCpDisplay.style.display = 'none';
        startTime = null;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('logo');
    let clickCount = 0;

    logo.addEventListener('click', function() {
        clickCount += 1;
        console.log('Click count:', clickCount); // ログを追加
        if (clickCount >= 10) {
            var char9 = document.querySelector('.character[data-character="char9"]');
            console.log('Character 9:', char9); // ログを追加
            char9.style.display = 'block';
        }
    });
});

const SHEET_ID = '19m6f_Kc2TMSg8gGTo8iAZd2wUJKtyqgd6IaqPRJINwQ'; // ここにスプレッドシートのIDを入力します
function addGameData(playerName, score, character) {
    const apiKey = process.env.REACT_APP_API_KEY; // GitHub Actionsで設定したAPIキーを環境変数から取得します
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:D1:append?valueInputOption=USER_ENTERED&key=${apiKey}`;
    const data = {
      values: [[new Date(), playerName, score, character]]
    };
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  }