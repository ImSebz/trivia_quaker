let vitaminas = [], allowVitaminas = true, mContext, gameInterval, tazon, textScore, textTime, tazonMoved = true, baby;

let assetsVitaminas = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'];

class MainScene extends Phaser.Scene {
    constructor() {
        super('mainScene');
    }

    preload() {
        assetsVitaminas.forEach((vitamina) => {
            this.load.image(vitamina, `./assets/${vitamina}.png`);
        });

        this.load.image('background', `./assets/background.jpg`);
        this.load.image('logo', './assets/logo.png');
        this.load.image('logo_baby', './assets/logo_baby.png');
        this.load.image('marcador', './assets/marcador.png');
        this.load.image('tazon', './assets/tazon.png');
        this.load.image('tiempo', './assets/tiempo.png');
        this.load.image('tazon', './assets/tazon.png');
    }

    create() {
        this.init();
        mContext = this;
        this.physics.add.overlap(tazon, vitaminas, (tazon, vitamina) => {
            if (textTime.time >= 0) {
                tazon.score++;
                textScore.setText(tazon.score);
                vitamina.destroy();
            }
        });
    }

    update() {
    }

    init() {
        this.add.image((this.game.config.width) / 2, (this.game.config.height) / 2, 'background').setScale(0.32, .32);
        this.add.image((this.game.config.width) / 2, (this.game.config.height) / 12, 'logo').setDepth(3).setScale(0.35);
        baby = this.add.image((this.game.config.width) / 2, (this.game.config.height) / 4.8, 'logo_baby').setScale(0.28);
        baby.angle = 0;
        this.add.image(((this.game.config.width) / 2) - 220, (this.game.config.height) / 3.2, 'marcador').setDepth(3).setScale(0.3);
        this.add.image(((this.game.config.width) / 2) + 220, (this.game.config.height) / 3.2, 'tiempo').setDepth(3).setScale(0.3);
        tazon = this.physics.add.sprite((this.game.config.width) / 2, (this.game.config.height) - 100, 'tazon');
        tazon.setScale(0.2);
        tazon.setInteractive();
        tazon.body.setAllowGravity(false);
        tazon.setCollideWorldBounds(true);
        tazon.setSize(980, 100, true);
        tazon.score = 0;
        this.input.setDraggable([tazon]);
        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            obj.setPosition(dragX, (this.game.config.height) - 100);

            if (tazonMoved) {
                mContext.beginGame();
                tazonMoved = false;
            }
        });
        textScore = this.add.text(((this.game.config.width) / 2.5) - 220, (this.game.config.height) / 3.18, tazon.score, { font: '40px VAG', fill: '#DB75A3' }).setDepth(3);
        textTime = this.add.text(((this.game.config.width) / 1.9) + 155, (this.game.config.height) / 3.18, '00:25', { font: '40px VAG', fill: '#F8D772' }).setDepth(3);
        textTime.time = 25;

        this.tweens.add({
            targets: baby,
            scale: 0.28,
            angle: 8,
            ease: 'Power2',
            duration: 500,
            repeat: -1,
            yoyo: true,
            hold: 500,
            repeatDelay: 3000
        });
    }

    beginGame() {
        gameInterval = setInterval(() => {
            vitaminas.push(this.physics.add.sprite(mContext.getRandomInt(60, 660), 490, assetsVitaminas[mContext.getRandomInt(0, 10)]).setScale(mContext.getRandomDouble(.25, .5)));
        }, 450);

        let timeInterval = setInterval(() => {
            let paddedTime = String(textTime.time).padStart(2, '0');
            textTime.setText(`00:${paddedTime}`);
            textTime.time--;

            if (textTime.time === 10) {
                clearInterval(gameInterval);
                gameInterval = setInterval(() => {
                    console.log('15');
                    vitaminas.push(this.physics.add.sprite(mContext.getRandomInt(60, 660), 490, assetsVitaminas[mContext.getRandomInt(0, 10)]).setScale(mContext.getRandomDouble(.25, .5)));
                }, 250);
            }

            if (textTime.time < 0) {
                clearInterval(timeInterval);
                setTimeout(() => {
                    const gamePop = document.querySelector('.game-end-pop');
                    const gamePElelemt = document.createElement('p');
                    gamePop.style.display = 'flex';
                    //Agrega atributo P con el score
                    gamePop.appendChild(gamePElelemt);
                    gamePElelemt.innerHTML = `<span>¡Felicidades!</span> Tu puntaje es de: ${tazon.score}`;
                }, 500);
                mContext.stopGame();
            }
        }, 1000);
    }

    stopGame() {

        clearInterval(gameInterval);

        setTimeout(() => {
            //Redirecciona a index.html
            window.location.href = 'index.html';
        }, 8000);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getRandomDouble(min, max) {
        return (Math.random() * (max - min)) + min;
    }
}

const config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
    parent: 'game-container',
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT
    },
    input: {
        activePointers: 3,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    }
}

const game = new Phaser.Game(config)