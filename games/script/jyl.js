document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.container button');
    const homeLink = document.getElementById('home');
    const gamesLink = document.getElementById('games');

    let sequence = []; // 存储游戏的正确序列
    let level = 2;     // 当前游戏级别，从第二轮开始增加新的格子
    let playerSequence = []; // 存储玩家点击的序列
    let gameActive = false; // 标记游戏是否处于活动状态
    let displayInProgress = false; // 标记显示序列是否正在进行
    let timeoutIds = []; // 用于存储所有的setTimeout id

    // 获取随机索引
    function getRandomIndex(excludeIndices) {
        let index;
        do {
            index = Math.floor(Math.random() * buttons.length);
        } while (excludeIndices.includes(index));
        return index;
    }

    // 显示序列
    function showSequence() {
        sequence = [];
        buttons.forEach(button => button.classList.remove('active'));
        disableButtons(); // 禁用按钮

        const delay = 1000; // 每个按钮显示的延迟时间

        // 显示单个按钮
        const display = (index) => {
            highlightButton(sequence[index], true);
            const timeoutId = setTimeout(() => {
                highlightButton(sequence[index], false);
                if (index === sequence.length - 1) {
                    enableButtons(); // 启用按钮
                    gameActive = true;
                    displayInProgress = false;
                }
            }, delay);
            timeoutIds.push(timeoutId);
        };

        // 第一轮只高亮两个格子，之后每轮增加一个格子
        const currentLevel = Math.min(level, 9); // 限制最多高亮9个格子
        const excludeIndices = []; // 用于存储已经使用的索引

        for (let i = 0; i < currentLevel; i++) {
            const index = getRandomIndex(excludeIndices);
            sequence.push(index);
            excludeIndices.push(index);
        }

        let count = 0;
        const intervalId = setInterval(() => {
            if (count < sequence.length) {
                display(count);
                count++;
            } else {
                clearInterval(intervalId);
            }
        }, delay);
    }

    // 高亮显示按钮
    function highlightButton(index, isHighlight) {
        const button = buttons[index];
        if (isHighlight) {
            button.classList.add('active');
        } else {
            button.classList.remove('active'); // 恢复原来的颜色
        }
    }

    // 检查玩家序列
    function checkPlayerSequence() {
        if (playerSequence.length === sequence.length && playerSequence.join(',') === sequence.join(',')) {
            // 清除所有格子的高亮
            buttons.forEach(button => button.classList.remove('active'));

            // 禁用按钮点击，防止在提示框显示期间继续点击
            disableButtons();

            // 清除所有延时回调
            timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
            timeoutIds = [];

            alert(`成功通关第${level - 1}轮，即将开始下一轮`, () => {
                // 重置所有状态变量
                level++; // 每过一轮增加一个格子
                playerSequence = [];
                gameActive = false;
                displayInProgress = true;
                
                // 清除所有格子的高亮
                buttons.forEach(button => button.classList.remove('active'));
                
                // 开始下一轮游戏
                showSequence();
            });
        } else {
            alert('游戏结束！');
            resetGame();
        }
    }

    // 重置游戏
    function resetGame() {
        playerSequence = [];
        level = 2; // 重置为第二轮的配置
        gameActive = false;
        displayInProgress = false;
        
        // 重新启用按钮点击
        enableButtons();
        
        // 清除所有格子的高亮
        buttons.forEach(button => button.classList.remove('active'));
    }

    // 开始游戏
    function startGame() {
        gameActive = true;
        level = 2; // 设置为第二轮的配置
        playerSequence = [];
        displayInProgress = true;
        showSequence();
    }

    // 处理按钮点击
    buttons.forEach(button => {
        button.addEventListener('click', event => {
            if (!gameActive || displayInProgress) return;
            const index = Array.from(buttons).indexOf(event.target);
            playerSequence.push(index);
            highlightButton(index, true);

            // 保存当前的timeoutId以便后续清除
            const timeoutId = setTimeout(() => {
                highlightButton(index, false);
                checkPlayerSequence();
            }, 1000);
            timeoutIds.push(timeoutId);
        });
    });

    // 处理导航链接
    homeLink.addEventListener('click', () => {
        location.href = '/';
    });

    gamesLink.addEventListener('click', () => {
        location.href = '/games/';
    });

    // 页面加载完成后立即开始游戏
    startGame();

    // 辅助函数：禁用按钮
    function disableButtons() {
        buttons.forEach(button => button.disabled = true);
    }

    // 辅助函数：启用按钮
    function enableButtons() {
        buttons.forEach(button => button.disabled = false);
    }
});