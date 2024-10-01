document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.container button');
    const homeLink = document.getElementById('home');
    const gamesLink = document.getElementById('games');

    let sequence = []; // 存储游戏的正确序列
    let level = 1;     // 当前游戏级别
    let playerSequence = []; // 存储玩家点击的序列
    let gameActive = false; // 标记游戏是否处于活动状态

    // 获取随机索引
    function getRandomIndex() {
        return Math.floor(Math.random() * buttons.length);
    }

    // 显示序列
    function showSequence() {
        sequence = [];
        buttons.forEach(button => button.classList.remove('active'));

        const delay = 1000; // 每个按钮显示的延迟时间
        let timerId = null;

        // 显示单个按钮
        const display = (index) => {
            highlightButton(sequence[index], true);
            setTimeout(() => {
                highlightButton(sequence[index], false);
            }, 1000);
            if (index === sequence.length - 1) {
                clearInterval(timerId);
                gameActive = true;
            }
        };

        for (let i = 0; i < level; i++) {
            const index = getRandomIndex();
            sequence.push(index);
        }

        let count = 0;
        timerId = setInterval(() => {
            display(count);
            count++;
            if (count >= sequence.length) {
                clearInterval(timerId);
                gameActive = true;
            }
        }, delay);
    }

    // 高亮显示按钮
    function highlightButton(index, isHighlight) {
        const button = buttons[index];
        if (isHighlight) {
            button.style.backgroundColor = 'green';
        } else {
            button.style.backgroundColor = ''; // 恢复原来的颜色
        }
    }

    // 检查玩家序列
    function checkPlayerSequence() {
        if (playerSequence.join(',') === sequence.join(',')) {
            playerSequence = [];
            level++;
            showSequence();
        } else {
            alert('游戏结束！');
            resetGame();
        }
    }

    // 重置游戏
    function resetGame() {
        playerSequence = [];
        level = 1;
        gameActive = false;
    }

    // 开始游戏
    function startGame() {
        gameActive = true;
        level = 1;
        playerSequence = [];
        showSequence();
    }

    // 处理按钮点击
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            if (!gameActive) return;
            const index = Array.from(buttons).indexOf(event.target);
            playerSequence.push(index);
            highlightButton(index, true);
            setTimeout(() => {
                highlightButton(index, false);
                checkPlayerSequence();
            }, 1000);
        });
    });

    // 处理导航链接
    homeLink.addEventListener('click', () => {
        location.href = '/';
    });

    gamesLink.addEventListener('click', () => {
        location.href = '/games';
    });

    // 添加开始按钮
    const startButton = document.createElement('button');
    startButton.textContent = '开始游戏';
    startButton.addEventListener('click', startGame);
    document.body.insertBefore(startButton, document.querySelector('.menu'));
});