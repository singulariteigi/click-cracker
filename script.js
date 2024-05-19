document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const readyButton = document.getElementById('ready-button');
    const characterSelection = document.getElementById('character-selection');
    const gameScreen = document.getElementById('game-screen');
    const countdown = document.getElementById('countdown');
    const clickButton = document.getElementById('click-button');
    const multiplyButton = document.getElementById('multiply-button');
    const tradeButton = document.getElementById('trade-button');
    const skillButton = document.getElementById('skill-button');
    const scoreDisplay = document.getElementById('score');
    const resultScreen = document.getElementById('result-screen');
    const restartButton = document.getElementById('restart-button');
    const backToTitleButton = document.getElementById('back-to-title-button');
    let selectedCharacter = null;
    let score = 0;
    let clickValue = 1;
    let multiplyActive = false;
    let gameInterval;
    let cpHistory = [];
    let startTime;

    // スタートボタンのクリックイベント
    startButton.addEventListener('click', () => {
        document.getElementById('title-screen').style.display = 'none';
        characterSelection.style.display = 'block';
    });

    // キャラクター選択のクリックイベント
    document.querySelectorAll('.character').forEach(character => {
        character.addEventListener('click', () => {
            document.querySelectorAll('.character').forEach(char => {
                char.style.border = '2px solid #000';
            });
            character.style.border = '2px solid #f00';
            selectedCharacter = character.getAttribute('data-character');
            readyButton.style.display = 'block';
        });
    });

    // レディーボタンのクリックイベント
    readyButton.addEventListener('click', () => {
        characterSelection.style.display = 'none';
        gameScreen.style.display = 'block';
        startCountdown();
    });

    // カウントダウンの開始
    function startCountdown() {
        let count = 3;
        countdown.innerHTML = count;
        countdown.style.display = 'block';
        const countdownInterval = setInterval(() => {
            count--;
            countdown.innerHTML = count;
            if (count <= 0) {
                clearInterval(countdownInterval);
                startGame();
            }
        }, 1000);
    }

    // ゲームの開始
    function startGame() {
        countdown.style.display = 'none';
        clickButton.style.display = 'block';
        multiplyButton.style.display = 'inline-block';
        tradeButton.style.display = 'inline-block';
        skillButton.style.display = 'inline-block';
        scoreDisplay.style.display = 'block';
        score = 0;
        clickValue = 1;
        cpHistory = [];
        startTime = Date.now();
        updateScore();

        gameInterval = setTimeout(endGame, 20000);

        clickButton.addEventListener('click', incrementScore);
        multiplyButton.addEventListener('click', multiplyScore);
        tradeButton.addEventListener('click', tradeScore);
        skillButton.addEventListener('click', useSkill);

        cpHistory.push({ time: 0, score: score });
    }

    // スコアの更新
    function updateScore() {
        scoreDisplay.innerHTML = `Score: ${score}`;
    }

    // スコアの増加
    function incrementScore() {
        score += clickValue;
        updateScore();
        recordCpHistory();
    }

    // スコアの増幅
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
            recordCpHistory();
        }
    }

    // スコアの取引
    function tradeScore() {
        if (score >= 50) {
            score -= 50;
            score += 100;
            updateScore();
            recordCpHistory();
        }
    }

    // スキルの使用
    function useSkill() {
        if (score >= 100) {
            score -= 100;
            clickValue *= 5;
            setTimeout(() => {
                clickValue /= 5;
            }, 5000);
            updateScore();
            recordCpHistory();
        }
    }

    // CP履歴の記録
    function recordCpHistory() {
        const elapsedTime = (Date.now() - startTime) / 1000;
        cpHistory.push({ time: elapsedTime, score: score });
    }

    // ゲームの終了
    function endGame() {
        clickButton.style.display = 'none';
        multiplyButton.style.display = 'none';
        tradeButton.style.display = 'none';
        skillButton.style.display = 'none';
        scoreDisplay.style.display = 'none';
        clearTimeout(gameInterval);

        resultScreen.style.display = 'block';
        drawChart();
    }

    // グラフの描画
    function drawChart() {
        const ctx = document.getElementById('result-chart').getContext('2d');
        const labels = cpHistory.map(entry => entry.time.toFixed(1));
        const data = cpHistory.map(entry => entry.score);

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'CP Over Time',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
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
                            text: 'Time (s)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'CP'
                        }
                    }
                },
                animation: false
            }
        });

        // グラフのアニメーション
        setTimeout(() => {
            chart.data.datasets[0].data = data.slice(0, Math.floor(data.length * 0.8));
            chart.update();
            setTimeout(() => {
                chart.data.datasets[0].data = data;
                chart.update();
            }, 1000);
        }, 2000);
    }

    // リスタートボタンのクリックイベント
    restartButton.addEventListener('click', () => {
        resultScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        characterSelection.style.display = 'block';
    });

    // タイトルに戻るボタンのクリックイベント
    backToTitleButton.addEventListener('click', () => {
        resultScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        document.getElementById('title-screen').style.display = 'block';
    });
});
