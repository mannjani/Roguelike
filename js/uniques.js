var Pedro = function(x,y) {
	this.x = x;
	this.y = y;
	this.draw();
}
Pedro.prototype.draw = function() {
	Game.display.draw(this.x, this.y, "P", "red");
}
Pedro.prototype.act = function() {
	var playerX = Game.player.getX();
	var playerY = Game.player.getY();
	var passableCallback = function(x, y) {
		return(x+","+y in Game.map);
	}
	var astar = new ROT.Path.AStar(playerX, playerY, passableCallback, {topology:4});
	var path = [];
	var pathCallback = function(x, y) {
		path.push([x,y]);
	}
	astar.compute(this.x, this.y, pathCallback);
	path.shift();
	if(path.length == 1)
	{
		Game.engine.lock();
		alert("Game Over - You were caught by Pedro");
	} else
	{
		x=path[0][0];
		y=path[0][1];
		Game.display.draw(this.x, this.y, Game.map[this.x+","+this.y]);
		Game.map["Pedro"] = x+","+y;
		this.x = x;
		this.y = y;
		this.draw();
	}
}