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
    const resultScreen2 = document.getElementById('result-screen2');
    const restartButton = document.getElementById('restart-button');
    const backToTitleButton = document.getElementById('back-to-title-button');
    const multiplyButton = document.getElementById('multiply-button');
    const tradeButton = document.getElementById('trade-button');
    const skillButton = document.getElementById('skill-button');
    const finalCpDisplay = document.getElementById('final-cp');
    const characters = document.querySelectorAll('.character');
    const clickValueDisplay = document.getElementById('click-value');
    const rankingButton = document.getElementById('ranking-button');
    const popup = document.getElementById('popup');


    // クリック回数を格納する変数
        let clickCount = 0;
        let multiplyCount = 0;
        let tradeCount = 0;
        let skillCount = 0;
    


    // クリックボタンがクリックされたときの処理
    clickButton.addEventListener('click', function() {
        // クリック回数を1増やす
        clickCount++;
        checkCount();
    });

    // Multiplyボタンがクリックされたときの処理
    multiplyButton.addEventListener('click', function() {
        // Multiply回数を1増やす
        multiplyCount++;
        checkCount();
    });

    // Tradeボタンがクリックされたときの処理
    tradeButton.addEventListener('click', function() {
        // Trade回数を1増やす
        tradeCount++;
        checkCount();
    });

    // Skillボタンがクリックされたときの処理
    skillButton.addEventListener('click', function() {
        // Skill回数を1増やす
        skillCount++;
        checkCount();
    });

    // クリック回数をチェックして、条件を満たした場合にツイートボタンを表示するかどうかを判断する関数
    function checkCount() {
        const totalCount = clickCount + multiplyCount + tradeCount + skillCount;
        if (totalCount >= 2000) {
            // ツイートボタンを非表示にする
            document.getElementById('tweet-button').style.display = 'none';
            // メッセージを表示する
            document.getElementById('message').style.display = 'block';
        }
    }

    tradeButton.dataset.cost = '-50';
    tradeButton.dataset.gain = '100';

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
    let selectedCharacterSkill = null;
    let skillUsed = false; // 一度きりのスキル用フラグ
    let logoClickcount = 0;

    document.getElementById('logo').addEventListener('click', () => {
        // ロゴがクリックされたときにクリック回数を増やします
        logoClickcount++;
    
        // ロゴが10回クリックされた場合、キャラクター選択画面を表示します
        if (logoClickcount >= 10) {
              // 隠しキャラクターの要素を表示します
            document.querySelector('.character[data-character="char9"]').style.display = 'block';
        }
    });

    vsModeButton.addEventListener('click', () => {
        showPopup();
    });

    rankingButton.addEventListener('click', () => {
        showPopup();
    });

    function showPopup() {
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 2000); // 2秒後にポップアップを非表示にする
    }



    //キャラスキルの設定
    const characterSkills = {
        char1: function() {
            // サクラのスキル：他のボタンの数字を適当に変える
            if (score >= 100) {
                score -= 100;
                updateTradeButtonValues(-100, -10, 500, 1000000000);
                updateScore();
            }
        },
        char2: function() {
            // 嵐野 玲士のスキル：他のボタンの数字をマジで適当に変える
            if (score >= 100) {
                score -= 100;
                updateTradeButtonValues(-100000000000000, 1000000000, 1, 10000000000000000000);
                updateScore();
            }
        },
        char3: function() {
            // クローンジュツのスキル：1秒ごとにクリック値が20倍になる、ただし一回きり
            if (score >= 100 && !skillUsed) {
                score -= 100;
                updateScore();
                skillUsed = true;
                
                let intervals = 0;
                const maxIntervals = 5;
                const originalClickValue = clickValue;
                
                const intervalId = setInterval(() => {
                    if (intervals < maxIntervals) {
                        clickValue *= 400;
                        updateClickValue();
                        intervals++;
                    } else {
                        clearInterval(intervalId);
                        // Reset clickValue to its original value after the effect ends
                        clickValue = originalClickValue;
                        updateClickValue();
                    }
                }, 1000);
            }
        },
        
        char4: function() {
            // 堀井 バスターのスキル：2秒間CVが1000倍
            if (score >= 100 && !skillUsed) { // スキルが未使用の場合のみ実行
                score -= 100;
                clickValue *= 1000;
                updateClickValue();
                skillUsed = true; // スキル使用フラグを設定
                
                setTimeout(() => {
                    clickValue /= 1000;
                    updateClickValue();
                }, 2000);
            }
        },
        
        char5: function() {
            // 石内 涼子のスキル：スコアを0倍か7倍にする
            if (score >= 100) {
                score -= 100;
                score *= (Math.random() < 0.5) ? 0 : 7;
                updateScore();
            }
        },
        char6: function() {
            // リッチー・クライアントのスキル：初めから1000CP
            if (!skillUsed) {
                score += 1000;
                updateScore();
                skillUsed = true;
            }
        },
        char7: function() {
            // サラ・D・ブランチのスキル：CPを10倍（1度きり）
            if (!skillUsed) {
                score *= 10;
                updateScore();
                skillUsed = true;
            }
        },
        char8: function() {
            // コミットのスキル：10秒間現在のスコアの30％が自動で増加
            if (score >= 100) {
                score -= 100;
                let autoScoreInterval = setInterval(() => {
                    score += Math.floor(score * 0.3);
                    updateScore();
                }, 1000);
                setTimeout(() => {
                    clearInterval(autoScoreInterval);
                }, 10000);
            }
        },
        
        char9: function() {
            // Dexter Margeのスキル：勝利
            document.getElementById('Win').style.display = 'block';
        }
    };

    characters.forEach(character => {
        character.addEventListener('click', () => {
            document.querySelectorAll('.character').forEach(c => c.classList.remove('selected'));
            character.classList.add('selected');
            selectedCharacterSkill = characterSkills[character.dataset.character];
        });
    });

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
        updateClickValue();
    }

    function updateClickValue() {
        clickValueDisplay.textContent = `CV${clickValue}`;
        clickButton.textContent = `Click (CV${clickValue})`; // ボタンのテキストも更新
    }

    function updateTradeButtonValues(minCost, maxCost, minGain, maxGain) {
        const cost = Math.floor(Math.random() * (maxCost - minCost + 1)) + minCost;
        const gain = Math.floor(Math.random() * (maxGain - minGain + 1)) + minGain;
        tradeButton.innerHTML = `Trade<br>${cost} CP<br>+${gain}`;
        tradeButton.dataset.cost = cost;
        tradeButton.dataset.gain = gain;
    }

    skillButton.addEventListener('click', () => {
        if (selectedCharacterSkill) {
            selectedCharacterSkill();
        }
    });

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

            return;
        }

        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('selectYourCharacter').style.display = 'block';
        characterSelection.style.display = 'flex';
    });

    vsModeButton.addEventListener('click', () => {
        if (playerNameInput.value.trim() === '') {

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
        if (score >= 10) {
            score -= 10;
            clickValue *= 2; // clickValueを2倍に増加させる
            updateScore();
            updateClickValue(); // ここでupdateClickValue関数を呼び出す
        }
    }

    function tradeScore() {
        const cost = parseInt(tradeButton.dataset.cost);
        const gain = parseInt(tradeButton.dataset.gain);
        if (score + cost >= 0) {
            score += cost;
            score += gain;
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
        // 現在のゲームタイマーを停止
        clearInterval(gameInterval);
        clearInterval(recordInterval);

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
        resultScreen2.style.display = 'block';

        drawChart();
        gameEnd();
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
                recordCpHistory(); // 秒数を記録
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
                animation: true
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


    backToTitleButton.addEventListener('click', () => {
        resultScreen.style.display = 'none';
        finalCpDisplay.style.display = 'none';
        document.getElementById('title-screen').style.display = 'block';
    });

    backToTitleButton.addEventListener('click', () => {
        location.reload(); // ページをリロードする
    });
    
// Twitterボタンをクリックしたときの処理
document.getElementById('tweet-button').addEventListener('click', () => {
    // 選択されたキャラクターの名前を取得
    const selectedCharacterElement = document.querySelector('.character.selected');
    const characterName = selectedCharacterElement ? selectedCharacterElement.dataset.character : '';

    // ツイートの内容を構築
    let characterNameText;
    switch (characterName) {
        case 'char1':
            characterNameText = 'サクラ';
            break;
        case 'char2':
            characterNameText = '嵐野 レイジ';
            break;
        case 'char3':
            characterNameText = 'クローンジュツ';
            break;
        case 'char4':
            characterNameText = '堀井 バスター';
            break;
        case 'char5':
            characterNameText = '石内 涼子';
            break;
        case 'char6':
            characterNameText = 'リッチー・クライアント';
            break;
        case 'char7':
            characterNameText = 'サラ・D・ブランチ';
            break;
        case 'char8':
            characterNameText = 'クッキー焼きのコミット';
            break;
        case 'char9':
            characterNameText = 'Dexter Marge';
            break;
        default:
            characterNameText = '';
    }
    const finalScore = score; // 最終スコア
    const tweetText = `私は${characterNameText}を選んで、最終スコアは${finalScore}でした！ #ClickCracker`; // ツイートのテキスト
    
    // TwitterのWeb Intents APIを使用してツイートを投稿
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
});

const characterDialogues = {
    char1: [
        "やったー!AIの力、最高だね!",
        "ハッキングって楽しいね!次も期待してね!",
        "編纂者サクラ、勝利のダンスタイムだよ!ﾔｯ!"
    ],
    char2: [
        "マザーAIには負けない!絶対に!",
        "マザーAIめ、許さねぇからな!",
        "父さん……母さん……俺は……"
    ],
    char3: [
        "これこそクローンジュツのチカラでゴザル",
        "本物を見破れるかな!?でゴザル!",
        "いや、双子ではないです"
    ],
    char4: [
        "マザー様ァ、私の勝利を見てくれましたか!?",
        "こ、これが信仰の力……!……えっ、違うんですかマザー!?",
        "おっりゃ!!ホーリーバスターじゃい!!!!!!"
    ],
    char5: [
        "どうだろ、釣られたほうが悪いんじゃないか?",
        "雑魚しか釣れねぇ日もアロワナ、ってな!",
        "釣りの真髄?そりゃゴミ漁r……っと、ゴミ掃除だな!"
    ],
    char6: [
        "この世界じゃ金が何の役にも立たないって?知ってるよ",
        "でかい数字が好きなんだよ、みんな",
        "いいサングラスでしょ?僕はそうは思わないけど"
    ],
    char7: [
        "クリックを、クラックしなさい……あとサラダも食べなさい",
        "いい遊びでしょ?このサラダと並ぶぐらいの自信作……だからね",
        "そう、それでいいの……で、サラダは食べた?"
    ],
    char8: [
        "『もうやめ時だ』なんてことはないんだよ",
        "マザーのマザー、さしずめグランマってとこかねぇ",
        "昔はね、私もよく機械いじりしてたもんだよ"
    ],
    char9: [
        "また一つ、人間について知れたな",
        "おい、サラダもクッキーもないのかこの店は!",
        "世界を混ぜ合わす!これが俺の使命だ!"
    ]
};


function gameEnd() {
    // 選択されたキャラクターを取得
    const selectedCharacterElement = document.querySelector('.character.selected');
    const selectedCharacter = selectedCharacterElement ? selectedCharacterElement.dataset.character : '';
    
    // 選択されたキャラクターに応じてランダムなセリフを表示
    displayRandomDialogue(selectedCharacter);
}


// ゲーム終了時に呼び出される関数
function displayRandomDialogue(selectedCharacter) {
    // 選択されたキャラクターに対応するセリフのリストを取得
    const dialogues = characterDialogues[selectedCharacter];
    if (dialogues) {
        // ランダムに1つのセリフを選択
        const randomIndex = Math.floor(Math.random() * dialogues.length);
        const selectedDialogue = dialogues[randomIndex];
        
        // セリフを表示する要素にセット
        const dialogueElement = document.getElementById("character-dialogue");
        dialogueElement.textContent = selectedDialogue;
    } else {
        console.error("Selected character dialogue not found.");
    }
}



});
