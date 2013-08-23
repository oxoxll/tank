var canvas = document.getElementById('canvas');
(function(w) {

	var cxt = canvas.getContext('2d'),
		sleep = Math.floor(1000 / 30),
		keys = {},
		key = {
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			shoot: 65
		},
		tanks = [],
		bullets = [],
		totalTank = 20,
		liveTank = 3;



	var game = {

		init: function() {
			tanks.push(new Tank({
				direction: 'up',
				speed: 100,
				isEnemy: false,
				x: 200,
				y: 400
			}));
			for (var i = 1; i <= 3; i++) {
				addEnemy(i);
			}

			this.addEvent();

		},
		start: function() {
			var gameover = false;

			function run() {
				if (liveTank === 0) {
					if(totalTank === 0){
						alert('恭喜你');
						gameover = true;
						return;
					}else{
						addEnemy(2);
					}
				}

				updateUI();

				game.clear();
				var now = new Date().getTime();



				tanks.forEach(function(tank, index) {

					//子弹和坦克的碰撞检测
					bullets.forEach(function(b) {
						if (!b.getDie()) {
							if ((b.isEnemy && !tank.isEnemy) || (tank.isEnemy && !b.isEnemy)) {
								if (game.collideDetect({
									x: b.x,
									y: b.y,
									r: 2
								}, {
									x: tank.x,
									y: tank.y,
									r: 10
								})) {
									b.die = true;
									tank.die = true;
									totalTank--;
									liveTank--;
									setTimeout(addEnemy,5000);

								}
							}
						}
					});


					if (index === 0) {

						//主坦克
						tanks.forEach(function(t, index) {
							if (index === 0) {
								return;
							}
							if (game.collideDetect({
								x: tank.x,
								y: tank.y,
								r: 10
							}, {
								x: t.x,
								y: t.y,
								r: 10
							}) && !(t.die && tank.die)) {
								t.die = true;
								tank.die = true;
								liveTank--;
								totalTank--;
							}
						});

						if (tank.die) {
							gameover = true;
							alert('game over !!!!');
							return false;
						}
						tank.setCanMove(false);
						for (pro in key) {

							if (pro === 'shoot') {

								if (keys[key[pro]]) {
									if (tank.bulletCount < 3) {
										addBullet(tank);
									}
								}
								keys[key[pro]] = 0;
								continue;
							}

							if (keys[key[pro]]) {
								tank.setDirection(pro);
								tank.setCanMove(true);
							}
						}
					} else {
						//敌人坦克发子弹
						if (now - tank.lastShootTime > 5000) {
							tank.lastShootTime = now;
							addBullet(tank);
						}
					}

					if (tank.die) {
						tanks.splice(index, 1);

					} else {
						tank.update(sleep);
						tank.draw(cxt);
					}
				});



				bullets.forEach(function(bullet, index) {
					if (bullet.getDie()) {
						bullets.splice(index, 1);
						tanks[0].bulletCount--;
						return;
					}
					bullet.update(sleep);
					bullet.draw(cxt);
				});

				if (!gameover) {
					setTimeout(run, sleep)
				}
			}
			run();
		},
		addEvent: function() {
			document.addEventListener('keydown', function(event) {
				for (pro in key) {
					if (typeof keys[key[pro]] === 'boolean') {
						keys[key[pro]] = false;
					}
				}
				keys[event.keyCode] = true;
				keys[event.keyCode] = 1;

			}, false);

			document.addEventListener('keyup', function(event) {
				keys[event.keyCode] = false;
			}, false);
		},
		clear: function() {
			cxt.clearRect(0, 0, 420, 420);
		},
		collideDetect: function(c1, c2) {
			return c1.r + c2.r >= Math.sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y));
		}

	};

	function addBullet(tank) {
		tank.bulletCount++;
		bullets.push(new Bullet({
			direction: tank.direction,
			speed: 200,
			isEnemy: tank.isEnemy,
			x: tank.x,
			y: tank.y
		}));
	}

	function addEnemy(i) {
		var i = i || Math.round(Math.random() * 2 + 1);
		if(totalTank-liveTank>0){
			tanks.push(new Tank({
				direction: 'down',
				speed: 100,
				isEnemy: true,
				x: 30 + (i-1) * 180,
				y: 20
			}));
			liveTank++;
		}
	}

	function updateUI() {
		document.getElementById('totalTank').innerHTML = totalTank;
	}


	w.game = game;



})(window)

game.init();
game.start();
