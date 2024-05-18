document.addEventListener('DOMContentLoaded', function() {
    let points = 0;
    let clickPower = 1;
    const pointsDisplay = document.getElementById('points');
    const clickButton = document.getElementById('click-button');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');

    // クリックボタンのイベントリスナー
    clickButton.addEventListener('click', function() {
        points += clickPower;
        updatePointsDisplay();
    });

    // アップグレードボタンのイベントリスナー
    upgradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const upgradeCost = parseInt(this.textContent.match(/\d+/)[0]);
            if (points >= upgradeCost) {
                points -= upgradeCost;
                applyUpgrade(this.id);
                updatePointsDisplay();
            } else {
                alert('CPが足りません！');
            }
        });
    });

    function updatePointsDisplay() {
        pointsDisplay.textContent = `${points} CP`;
    }

    function applyUpgrade(upgradeId) {
        switch (upgradeId) {
            case 'upgrade1':
                clickPower *= 2;
                clickButton.textContent = `ClickPower ${clickPower}`;
                break;
            case 'upgrade2':
                points += 1000;
                break;
            case 'upgrade3':
                clickPower *= 2;
                clickButton.textContent = `ClickPower ${clickPower}`;
                break;
        }
    }
});
