(function(w) {

	function Tank(opt) {
		for (pros in opt) {
			this[pros] = opt[pros];
		}
		if (this.isEnemy) {
			this.canMove = true;
			this.color = 'black';
		} else {
			this.canMove = false;
			this.color = 'red';
		}
		this.allDistance = 0;
		this.allTime = 0;
		this.bulletCount = 0;
	}

	Tank.prototype = {
		setDirection: function(dire) {
			this.direction = dire;
		},
		setSpead: function(spee) {
			this.speed = spee;
		},
		setCanMove: function(b) {
			this.canMove = b;
		},
		update: function(time) {
			if (!this.canMove) {
				return;
			}

			this.allTime += time;
			var diff = Math.floor(this.speed * this.allTime / 1000);
			if (diff) {
				switch (this.direction) {
					case 'up':
						this.y -= diff;
						if (this.y < 16) {
							this.y = 17;
							randomDirection.call(this);
						}
						break;
					case 'down':
						this.y += diff;
						if (this.y > w.canvas.height - 16) {
							this.y = w.canvas.height - 17;
							randomDirection.call(this);
						}
						break;
					case 'left':
						this.x -= diff;
						if (this.x < 16) {
							this.x = 17;
							randomDirection.call(this);
						}
						break;
					case 'right':
						this.x += diff;
						if (this.x > w.canvas.width - 16) {
							this.x = w.canvas.width - 17;
							randomDirection.call(this);
						}
						break;
				}


				this.allDistance += diff;

				this.allTime = 0;
			}

			if (this.allDistance > w.canvas.width / 3) {
				randomDirection.call(this);
				this.allDistance = 0;
			}

			function randomDirection() {
				if (this.isEnemy) {
					this.direction = (['right', 'left', 'down', 'up'])[Math.round(Math.random() * 3)];
				}

			}

		},
		draw: function(cxt) {

			cxt.beginPath();
			cxt.fillStyle = this.color;
			cxt.strokeStyle = this.color;
			cxt.arc(this.x, this.y, 10, 0, 2 * Math.PI);
			cxt.fill();
			cxt.fillRect(this.x - 11, this.y - 11, 22, 22);
			cxt.moveTo(this.x, this.y);
			cxt.lineWidth = 5;
			switch (this.direction) {
				case 'up':
					cxt.lineTo(this.x, this.y - 20);
					break;
				case 'down':
					cxt.lineTo(this.x, this.y + 20);
					break;
				case 'left':
					cxt.lineTo(this.x - 20, this.y);
					break;
				case 'right':
					cxt.lineTo(this.x + 20, this.y);
					break;
			}

			cxt.stroke();
			cxt.closePath();
		}
	}


	window.Tank = Tank;
})(window)
