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
		totalTank = 0,
		tanks = [],
		bullets = [],
		myBullets = [];

	var gameClient = {

		init: function() {
			tanks.push(new Tank({
				direction: 'up',
				speed: 100,
				isEnemy: false,
				x: 100,
				y: 400,
				id: gameClient.id
			}));
			this.addEvent();
		},
		start: function() {
			

			function run() {

				updateUI()
				gameClient.clear();
				var now = new Date().getTime();

				tanks.forEach(function(tank, index) {

					if (tank.id === gameClient.id) {

						//主坦克
						tanks.forEach(function(t, index) {
							if (t.id) {
								return;
							}
							if (gameClient.collideDetect({
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

							}
						});

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
						tank.update(sleep);
					}
					if (!tank.die) {
						Tank.prototype.draw.call(tank, cxt);
					}
				});
				bullets.forEach(function(bullet, index) {
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
				if (event.keyCode === key.shoot) {
					keys[event.keyCode] = 1;
				} else {
					keys[event.keyCode] = true;
				}
			}, false);

			document.addEventListener('keyup', function(event) {

				if (event.keyCode !== key.shoot) {
					keys[event.keyCode] = false;
				}

			}, false);
		},
		clear: function() {
			cxt.clearRect(0, 0, 420, 420);
		},
		collideDetect: function(c1, c2) {
			return c1.r + c2.r >= Math.sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y));
		},
		updateData: function(data) {
			tanks = [tanks[0]].concat(data.tanks);
			bullets = data.bullets;
			totalTank = data.totalTank;
			tanks[0].bulletCount = data.friendTankBullets;
			console.log(tanks[0].bulletCount);
			gameover = data.gameover;
		}

	};

	function addBullet(tank) {
		tank.bulletCount++;
		var b = new Bullet({
			direction: tank.direction,
			speed: 200,
			isEnemy: tank.isEnemy,
			x: tank.x,
			y: tank.y,
			color: tank.color
		});
		bullets.push(b);
		myBullets.push(b);
	}

	function updateUI() {
		document.getElementById('totalTank').innerHTML = totalTank;
	}

	function sendData() {
		var data = {
			id: gameClient.id,
			tank: tanks[0],
			bullets: myBullets.shift()
		};
		websocket.send(JSON.stringify(data));
	}

	w.gameClient = gameClient;

})(window)
