// multiPlayer.js

let socket;
let playerName;

function initVsMode() {
    playerName = localStorage.getItem('playerName');
    // プロジェクトURLに合わせたWebSocket URLを設定
    socket = new WebSocket('wss://auspicious-apricot-maize.glitch.me');  // ここをプロジェクトの名前に置き換える

    socket.onopen = () => {
        console.log('Connected to WebSocket server');
        socket.send(JSON.stringify({ type: 'join', name: playerName }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'match':
                startMatch(data.opponent);
                break;
            case 'update':
                updateGame(data);
                break;
            case 'end':
                endGame(data);
                break;
            // 他のメッセージタイプに対する処理
        }
    };

    socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };
}

function startMatch(opponent) {
    // 対戦相手の情報を表示し、ゲームを開始する準備
    console.log(`Matched with ${opponent.name}`);
    startCountdown();
}

function updateGame(data) {
    // ゲーム中のデータを更新
}

function endGame(data) {
    // ゲームの終了処理
}

export { initVsMode, startMatch, updateGame, endGame };
