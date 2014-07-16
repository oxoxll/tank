(function(w){
    function Bullet(opt){
        for(pros in opt){
            this[pros] = opt[pros];
        }
        
        this.allTime = 0;
    }

    Bullet.prototype = {
        update: function(time){
            this.allTime += time;
            var diff = Math.floor(this.speed * this.allTime / 1000);

            if(diff){
                switch (this.direction)
                {
                    case 'up':
                        this.y -= diff;
                        break;
                    case 'down':
                        this.y += diff;
                        break;
                    case 'left':
                        this.x -= diff;
                        break;
                    case 'right':
                        this.x += diff;
                        break;
                }

                this.allTime = 0;
            }

        },
        draw: function(cxt){
            cxt.fillStyle = this.color;
            switch (this.direction) {
                case 'up':
                    cxt.fillRect(this.x-2,this.y-2-20,4,4);
                    break;
                case 'down':
                    cxt.fillRect(this.x-2,this.y-2+20,4,4);
                    break;
                case 'left':
                    cxt.fillRect(this.x-2-20,this.y-2,4,4);
                    break;
                case 'right':
                    cxt.fillRect(this.x-2+20,this.y-2,4,4);
                    break;
            }
            
        },
        getDie:function(){
            return this.die || this. x <0 || this.x > w.canvas.width || this.y < 0 || this.y>w.canvas.height;
        }
    }



    w.Bullet = Bullet;

})(window)
