var Player = function(x, y) {
	this.x = x;
	this.y = y;
	this.draw();
}
Player.prototype.draw = function() {
	Game.display.draw(this.x, this.y, "@", "#ff0");
}
Player.prototype.act = function() {
	Game.engine.lock();
	window.addEventListener("keydown", this);
}
Player.prototype.handleEvent = function(e) {
	var keyMap = {};
	keyMap[38] = 0;
	keyMap[33] = 1;
	keyMap[39] = 2;
	keyMap[34] = 3;
	keyMap[40] = 4;
	keyMap[35] = 5;
	keyMap[37] = 6;
	keyMap[36] = 7;
	var code = e.keyCode;
	if(code == 13 || code == 32)
	{
		this.checkBox();
		return 1;
	}
	if (!(code in keyMap)) {return;}
	var diff = ROT.DIRS[8][keyMap[code]];
	var newX = this.x + diff[0];
	var newY = this.y + diff[1];
	var newKey = newX+","+newY;
	if(!(newKey in Game.map)) {return;}
	if(newKey == Game.map["Pedro"])
	{
		alert("You can't attack Pedro yet");
		return;
	}
	Game.display.draw(this.x, this.y, Game.map[this.x+","+this.y]);
	this.x = newX;
	this.y = newY;
	this.draw();
	Game.map["Player"] = newKey;
	window.removeEventListener("keydown", this);
	Game.display.drawText(0,0,"");
	Game.engine.unlock();
}
Player.prototype.checkBox = function() {
	var key = this.x+","+this.y;
	if(Game.map[key] != "*")
	{
		//alert("There is no box here!");
		Game.display.drawText(0,0,"There is no box here!");
	} else if(key == Game.ananas)
	{
		//alert("Hooray! You found an ananas and won the game");
		Game.display.drawText(0,0,"Hooray! you found an ananas and won the game");
		Game.map[key] = "\"";
		Game.engine.lock();
		window.removeEventListener("keydown",this);
	} else
	{
		//alert("This Box is empty");
		Game.display.drawText(0,0,"This Box is empty");
		Game.map[key] = "\"";
	}
}
Player.prototype.getX = function() {
	return this.x;
}
Player.prototype.getY = function() {
	return this.y;
}