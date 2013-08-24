var canvas = document.getElementById('canvas');
(function(w) {

	var cxt = canvas.getContext('2d'),
		sleep = Math.floor(1000 / 10),
		keys = {},
		key = {
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			shoot: 65
		},
		gameover = false,
		tanks = [],
		bullets = [],
		friendTank = {},
		totalTank = 20,
		liveTank = 0;

	var game = {

		init: function() {
			tanks.push(new Tank({
				direction: 'up',
				speed: 100,
				isEnemy: false,
				x: 300,
				y: 400,
				id: game.id
			}));
			for (var i = 1; i <= 3; i++) {
				addEnemy(i);
			}

			this.addEvent();

		},
		start: function() {
			function run() {
				if (liveTank === 0) {
					if (totalTank === 0) {
						//alert('恭喜你');
						gameover = true;
						//return;
					} else {
						addEnemy(2);
					}
				}

				if(friendTank.die && tanks[0].isEnemy ){
					gameover = true;
				}

				updateUI();

				game.clear();
				var now = new Date().getTime();

				tanks.forEach(function(tank, index) {

					//子弹和坦克的碰撞检测
					bullets.forEach(function(b) {
						if (!Bullet.prototype.getDie.call(b)) {
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
									setTimeout(addEnemy, 5000);

								}
							}
						}
					});


					if (tank.id === game.id) {

						//主坦克
						tanks.forEach(function(t, index) {
							if (t.id) {
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

						// if (tank.die) {
						// 	gameover = --;
						// 	alert('game over !!!!');
						// 	return;
						// }
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

				if (friendTank && !friendTank.die) {
					Tank.prototype.draw.call(friendTank, cxt);
				}



				bullets.forEach(function(bullet, index) {
					if (Bullet.prototype.getDie.call(bullet)) {

						if (!bullet.isEnemy) {

							if (bullet.getDie) {
								tanks[0].bulletCount--;
							} else {
								friendTank.bulletCount--;
							}

						}
						bullets.splice(index, 1);
						return;
					}
					Bullet.prototype.update.call(bullet, sleep);
					Bullet.prototype.draw.call(bullet, cxt);
				});

				sendData();
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
		},
		updateData: function(data) {
			var count = friendTank.direction ? friendTank.bulletCount : 0;
			friendTank = data.tank;
			friendTank.bulletCount = count;
			if (data.bullets && count < 3) {
				bullets.push(data.bullets);
				friendTank.bulletCount++;
			}
		}
	};

	function addBullet(tank) {
		tank.bulletCount++;
		bullets.push(new Bullet({
			direction: tank.direction,
			speed: 200,
			isEnemy: tank.isEnemy,
			x: tank.x,
			y: tank.y,
			color: tank.color
		}));
	}

	function addEnemy(i) {
		var i = i || Math.round(Math.random() * 2 + 1);
		if (totalTank - liveTank > 0) {
			tanks.push(new Tank({
				direction: 'down',
				speed: 100,
				isEnemy: true,
				x: 30 + (i - 1) * 180,
				y: 20
			}));
			liveTank++;
		}
	}

	function updateUI() {
		document.getElementById('totalTank').innerHTML = totalTank;
	}

	function sendData(tank) {

		var data = {
			id: game.id,
			totalTank: totalTank,
			tanks: tanks,
			bullets: bullets,
			friendTankBullets: friendTank.direction ? friendTank.bulletCount : 0,
			gameover : gameover
		}

		websocket.send(JSON.stringify(data));
	}


	w.game = game;



})(window)
