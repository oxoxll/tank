var canvas = document.getElementById('canvas');
var cxt = canvas.getContext('2d');
var sleep = Math.floor(1000 / 30);
var keys = {};
var key = {
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	shoot: 65
};

var tanks = [];

tanks.push(new Tank({
	direction: 'up',
	speed: 100,
	isEnemy: false,
	x: 200,
	y: 400
}));
tanks.push(new Tank({
	direction: 'down',
	speed: 100,
	isEnemy: true,
	x: 200,
	y: 20
}));
var bullets = [];


function start() {
	cxt.clearRect(0, 0, 420, 420);

	tanks.forEach(function(tank, index) {
		if (index === 0) {
			tank.setCanMove(false);
			for (pro in key) {

				if (pro === 'shoot') {

					if (keys[key[pro]]) {
						if (tank.bulletCount < 3) {
							tank.bulletCount++;
							bullets.push(new Bullet({
								direction: tank.direction,
								speed: 200,
								isEnemy: false,
								x: tank.x,
								y: tank.y
							}));
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
		}

		tank.update(sleep);
		tank.draw(cxt);
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

	setTimeout(start, sleep)
}

start();

window.addEventListener('keydown', function(event) {
	for (pro in key) {
		if (typeof keys[key[pro]] === 'boolean') {
			keys[key[pro]] = false;
		}
	}
	keys[event.keyCode] = true;
	keys[event.keyCode] = 1;
}, false);

window.addEventListener('keyup', function(event) {
	keys[event.keyCode] = false;
}, false);
