// main.js

import './singlePlayer.js';
import { startVersusMode, handleVersusClick } from './multiPlayer.js';
import { updateRanking, displayRanking } from './ranking.js';

// 初期化コードや共通の設定をここに記述

document.addEventListener('DOMContentLoaded', () => {
    // ロゴ要素を取得
    const logo = document.getElementById('logo');

    // クリックカウントを初期化
    let clickCount = 0;

    // ロゴにクリックイベントリスナーを追加
    logo.addEventListener('click', function() {
        // クリックカウントを増やす
        clickCount += 1;

        // クリックカウントが10に達したら9人目のキャラクターを表示
        if (clickCount >= 10) {
            var char9 = document.querySelector('.character[data-character="char9"]');
            char9.style.display = 'block';
        }
    });

    // 対戦モードの初期化
    startVersusMode();

    // ランキングの初期表示
    displayRanking();
});


    document.getElementById('vs-mode-button').addEventListener('click', () => {
        const playerName = document.getElementById('player-name').value;
        if (playerName) {
            localStorage.setItem('playerName', playerName);
            // 対戦モードの画面に移行する処理を追加
            enterVsMode();
        } else {
            alert('Please enter your name.');
        }
    });

    function enterVsMode() {
        document.getElementById('title-screen').style.display = 'none';
        document.getElementById('versus-mode').style.display = 'block';
        // 対戦モードの初期化処理を追加
        initVsMode();
    }
