Mixins = {};
Mixins.Moveable = {
	name:'Moveable',
};
Mixins.PlayerActor = {
	name: 'PlayerActor',
	groupName: 'Actor',
	init: function(template) {
		this.alignment = template['alignment'];
	},
	act: function() {
		this.map.engine.lock();
		Game.messageDisplay.clear();
		for(i=this.messages.length;i>0;i--)
		{
			Game.messageDisplay.drawText(0, this.messages.length - i, this.messages[i - 1]);
		}
		this.clearMessages();
		window.addEventListener("keydown", this);
		window.addEventListener("keypress", this);
	}
}
Mixins.PlayerMoveable = {
	name: 'PlayerMoveable',
	groupName: 'Moveable',
	tryMove: function(x, y, map) {
		var ptile = map.getTile(this.x, this.y);
		var tile = map.getTile(x, y);
		var target = map.getEntityAt(x, y);
		if(target)
		{
			if(this.hasMixin('Attacker'))
			{
				this.attack(target);
				return true;
			}
			else
				return false;
		}else if(tile.isWalkable)
		{
			Game.display.draw(this.x, this.y, ptile.glyph, ptile.fg, ptile.bg);
			this.x = x;
			this.y = y;
			Game.display.draw(x, y, this.glyph, this.fg, this.bg);
			return true;
		} else if(tile.isDiggable)
		{
			map.dig(x, y);
			return true;
		} else if(tile.isOpenable)
		{
			map.openDoor(x, y);
			return true;
		}
		return false;
	},
}
Mixins.PedroActor = {
	name: 'PedroActor',
	groupName: 'Actor',
	act: function() {
		var playerX = Game.player.x;
		var playerY = Game.player.y;
		var fov = FOV.getFov(this);
		var actor = this;
		if(playerX+","+playerY in fov)
		{
			var passableCallback = function(x, y) {
				return(actor.map.getTile(x,y).isWalkable);
			}
			var astar = new ROT.Path.AStar(playerX, playerY, passableCallback, {topology:8});
			var path = [];
			var pathCallback = function(x, y) {
				path.push([x,y]);
			}
			astar.compute(this.x, this.y, pathCallback);
			path.shift();
			if(path.length == 1)
			{
				//this.map.engine.lock();
				//alert("Game Over - You were caught by Pedro");
			} else
			{
				x=path[0][0];
				y=path[0][1];
				tile = this.map.getTile(this.x, this.y);
				if(x+","+y in Game.player.fov)
				{
					Game.display.draw(this.x, this.y, tile.glyph, "white", tile.bg);
					Game.display.draw(x, y, this.glyph, this.fg, this.bg);
				}
				this.x = x;
				this.y = y;
			}
		}
	},
}
Mixins.MonsterActor = {
	name: 'MonsterActor',
	groupName: 'Actor',
	init: function(template) {
		this.alignment = template['alignment'];
	},
	act: function() {
		var playerX = Game.player.x;
		var playerY = Game.player.y;
		var fov = FOV.getFov(this);
		var actor = this;
		if(playerX+","+playerY in fov)
		{
			var passableCallback = function(x, y) {
				return(actor.map.getTile(x,y).isWalkable);
			}
			var astar = new ROT.Path.AStar(playerX, playerY, passableCallback, {topology:8});
			var path = [];
			var pathCallback = function(x, y) {
				path.push([x,y]);
			}
			astar.compute(this.x, this.y, pathCallback);
			path.shift();
			x=path[0][0];
			y=path[0][1];
		} else {
			do
			{
				dx = ROT.RNG.getWeightedValue({"-1":1, "1":1, "0":1});
				dy = ROT.RNG.getWeightedValue({"-1":1, "1":1, "0":1});
			} while(dx==0 && dy==0);
			x = this.x + parseInt(dx);
			y = this.y + parseInt(dy);
		}
		var ptile = map.getTile(this.x, this.y);
		var tile = map.getTile(x, y);
		var target = map.getEntityAt(x, y);
		if(target)
		{
			if(this.hasMixin('Attacker') && this.alignment!=target.alignment)
				this.attack(target);
		} else if(tile.isWalkable)
		{
			if(x+","+y in Game.player.fov)
			{
				Game.display.draw(this.x, this.y, ptile.glyph, ptile.fg, ptile.bg);
				Game.display.draw(x, y, this.glyph, this.fg, this.bg);
			}
			this.x = x;
			this.y = y;
		} else if(tile.isOpenable)
			map.openDoor(x, y);
	},
}
Mixins.Destructible = {
	name: 'Destructible',
	init: function(template) {
		this.maxHp = template['maxHp'] || 10;
		this.hp = template['hp'] || this.maxHp;
		this.defenseValue = template['defenseValue'] || 0;
	},
	takeDamage: function(attacker, damage) {
		this.hp-=damage;
		if(this.hasMixin('PlayerActor'))
		{
			Game.statDisplay.clear();
			Game.statDisplay.drawText(0, 0, "Hp: "+Math.floor(this.hp))
		}
		if(this.hasMixin('MessageRecipient'))
			this.receiveMessage(attacker.name+" hits you");
		if(this.hp<=0)
		{
			this.map.removeEntity(this);
			if(attacker.hasMixin('MessageRecipient'))
				attacker.receiveMessage(this.name+" dies.");
			if(this.hasMixin('MessageRecipient'))
			{
				this.receiveMessage("You die");
				this.map.engine.lock();
			}
		}
	}
}
Mixins.Attacker = {
	name: 'Attacker',
	groupName: 'Attacker',
	init: function(template) {
		this.attackValue = template['attackValue'] || 1;
	},
	attack: function(target) {
		if(target.hasMixin('Destructible'))
		{
			var attack = this.attackValue;
			var defense = target.defenseValue;
			var max = Math.max(0, attack-defense);
			var hit = 1 + Math.floor(Math.random() * max);
			target.takeDamage(this, hit);
			if(this.hasMixin('MessageRecipient'))
				this.receiveMessage("You Hit "+target.name+" for "+hit+".");
		}
	}
}
Mixins.MessageRecipient = {
	name: 'MessageRecipient',
	init: function(template) {
		this.messages = [];
	},
	receiveMessage: function(message) {
		this.messages.push(message);
	},
	clearMessages: function() {
		this.messages = [];
	}
}