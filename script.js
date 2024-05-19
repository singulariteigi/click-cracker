document.addEventListener('DOMContentLoaded', () => {
    // 既存のコード

    let cpHistory = [];
    let startTime;

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

    function incrementScore() {
        score += clickValue;
        updateScore();
        recordCpHistory();
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
            recordCpHistory();
        }
    }

    function tradeScore() {
        if (score >= 50) {
            score -= 50;
            score += 100;
            updateScore();
            recordCpHistory();
        }
    }

    function useSkill() {
        // 既存のコード（スキル使用のロジック）
        recordCpHistory();
    }

    function recordCpHistory() {
        const elapsedTime = (Date.now() - startTime) / 1000; // 経過時間を秒単位で記録
        cpHistory.push({ time: elapsedTime, score: score });
    }

    function endGame() {
        clickButton.style.display = 'none';
        multiplyButton.style.display = 'none';
        tradeButton.style.display = 'none';
        skillButton.style.display = 'none';
        scoreDisplay.style.display = 'none';
        clearInterval(gameInterval);

        resultScreen.style.display = 'block';
        drawChart();
    }

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
                    tension: 0.1
                }]
            },
            options: {
                animation: {
                    duration: 0, // 初期表示はアニメーションなし
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    }
                }
            }
        });

        // アニメーションの設定
        setTimeout(() => {
            chart.data.labels = labels.slice(0, Math.floor(labels.length * 0.8));
            chart.data.datasets[0].data = data.slice(0, Math.floor(data.length * 0.8));
            chart.update();

            setTimeout(() => {
                chart.data.labels = labels;
                chart.data.datasets[0].data = data;
                chart.update();
            }, 1000);
        }, 2000);
    }

    restartButton.addEventListener('click', () => {
        resultScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        characterSelection.style.display = 'block';
    });

    backToTitleButton.addEventListener('click', () => {
        resultScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        document.getElementById('title-screen').style.display = 'block';
    });
});
