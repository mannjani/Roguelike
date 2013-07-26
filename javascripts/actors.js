Actor = function(properties) {
	properties = properties || {};
	Symbol.call(this, properties);
	this.name = properties['name'] || '';
	this.x = properties['x'] || 0;
	this.y = properties['y'] || 0;
	this.map = null;
	if(properties.hasOwnProperty('fov'))
		this.fov = properties['fov'] || '';
	this.attachedMixins = {};
	this.attachedMixinGroups = {};
	var mixins = properties['mixins'] || [];
	for(var i=0;i<mixins.length;i++)
	{
		for(var key in mixins[i])
		{
			if(key != 'init' && key != 'name' && !this.hasOwnProperty(key))
				this[key] = mixins[i][key];
		}
		this.attachedMixins[mixins[i].name] = true;
		if(mixins[i].groupName)
			this.attachedMixinGroups[mixins[i].groupName] = true;
		if(mixins[i].init)
			mixins[i].init.call(this, properties);
	}
}
Actor.extend(Symbol);
Actor.prototype.setName = function(name) {
	this.name = name;
}
Actor.prototype.setX = function(x) {
	this.x = x;
}
Actor.prototype.setY = function(y) {
	this.y = y;
}
Actor.prototype.setMap = function(map) {
	this.map = map;
}
Actor.prototype.hasMixin = function(obj) {
	if(typeof obj === 'object')
		return this.attachedMixins[obj.name];
	else
		return this.attachedMixins[obj] || this.attachedMixinGroups[obj];
}
Actor.prototype.handleEvent = function(e) {
	if(e.type == "keypress")
	{
		if(e.charCode == ROT.VK_GREATER_THAN)
			this.changeLevel("down");
		else if(e.charCode == ROT.VK_LESS_THAN)
			this.changeLevel("up");
		else if(e.keyCode == ROT.VK_4 || e.keyCode == ROT.VK_NUMPAD4)
			this.move(-1, 0);
		else if(e.keyCode == ROT.VK_6 || e.keyCode == ROT.VK_NUMPAD6)
			this.move(1, 0);
		else if(e.keyCode == ROT.VK_8 || e.keyCode == ROT.VK_NUMPAD8)
			this.move(0, -1);
		else if(e.keyCode == ROT.VK_2 || e.keyCode == ROT.VK_NUMPAD2)
			this.move(0, 1);
		else if(e.keyCode == ROT.VK_1 || e.keyCode == ROT.VK_NUMPAD1)
			this.move(-1, 1);
		else if(e.keyCode == ROT.VK_3 || e.keyCode == ROT.VK_NUMPAD3)
			this.move(1, 1);
		else if(e.keyCode == ROT.VK_7 || e.keyCode == ROT.VK_NUMPAD7)
			this.move(-1, -1);
		else if(e.keyCode == ROT.VK_9 || e.keyCode == ROT.VK_NUMPAD9)
			this.move(1, -1);
	} else if(e.type == "keydown")
	{
		if(e.keyCode == ROT.VK_LEFT)
			this.move(-1, 0);
		else if(e.keyCode == ROT.VK_RIGHT)
			this.move(1, 0);
		else if(e.keyCode == ROT.VK_UP)
			this.move(0, -1);
		else if(e.keyCode == ROT.VK_DOWN)
			this.move(0, 1);
	}
	if(Game.player.hp<Game.player.maxHp)
	{
		Game.player.hp+=0.1;
		Game.statDisplay.clear();
		Game.statDisplay.drawText(0, 0, "Hp: "+Math.floor(Game.player.hp));
	}
	window.removeEventListener("keydown", this);
	this.map.engine.unlock();
}
Actor.prototype.changeLevel = function(direction)
{
	if(direction=="down")
	{
		if(this.map.getTile(this.x, this.y) == Tile.stairsDown)
		{
			Game.switchScreen(Screen.playscreen, 1);
			this.receiveMessage("You descend into the dungeon");
		}
		else
			this.receiveMessage("There is no stairs going downward there");
	}
	if(direction=="up")
	{
		if(this.map.getTile(this.x, this.y) == Tile.stairsUp)
		{
			Game.switchScreen(Screen.playscreen, -1);
			this.receiveMessage("You ascend from the dungeon");
		}
		else
			this.receiveMessage("There is no stairs going upward there");
	}
}
Actor.prototype.move = function(dX, dY)
{
	var newX = this.x + dX;
	var newY = this.y + dY;
	if(this.tryMove(newX, newY, this.map));
		Game.refresh();
}
Actor.PlayerTemplate = {
	name: 'You',
	glyph: '@',
	fg: '#ff0',
	maxHp: 40,
	attackValue: 10,
	alignment: 'Player',
	fov: {},
	mixins: [Mixins.PlayerActor, Mixins.PlayerMoveable, Mixins.Attacker, Mixins.Destructible, Mixins.MessageRecipient]
}
Actor.PedroTemplate = {
	name: 'Pedro',
	glyph: 'P',
	fg: 'red',
	maxHp: 20,
	mixins: [Mixins.PedroActor, Mixins.Destructible]
}