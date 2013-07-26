var Screen = {};
Screen.startscreen = {
	enter: function(level) {},
	exit: function() {return 0;},
	render: function(display, messageDisplay)
	{
		Game.messageDisplay.drawText(1,1, "Press Enter To Continue");
	},
	handleInput: function(inputType, inputData)
	{
		if(inputData.keyCode === ROT.VK_RETURN)
			Game.switchScreen(Screen.playscreen, 1);
	}
}
Screen.playscreen = {
	map: null,
	tiles: [],
	level: null,
	dLevel: null,
	enter: function(level, dLevel)
	{
		this.level = level;
		this.dLevel = dLevel;
		for(var x=0;x<Game.width;x++)
		{
			this.tiles.push([]);
			for(var y=0;y<Game.height;y++)
				this.tiles[x].push(Tile.error);
		}
		var mapperCallback = function(x, y, value) {
			if(x == 0 || x == Game.width - 1)
				this.tiles[x][y] = Tile.borderVertical;
			else if(y == 0 || y == Game.height - 1)
				this.tiles[x][y] = Tile.borderHorizontal;
			else if(value)
				this.tiles[x][y] = Tile.wall;
			else
				this.tiles[x][y] = Tile.floor;
		}
		var mapper = new ROT.Map.Uniform(Game.width, Game.height, {timeLimit: 3000});
		mapper.create(mapperCallback.bind(this));
		mapRooms = mapper.getRooms();
		this.pedro = new Actor(Actor.PedroTemplate);
		this.map = new Map(this.tiles, Game.player);
		upPos = this.map.getFreePosition();
		if(dLevel == 1)
			upPos = {x:Game.player.x, y:Game.player.y};
		this.map.tiles[upPos.x][upPos.y] = Tile.stairsUp;
		downPos = this.map.getFreePosition();
		if(dLevel == -1)
			downPos = {x:Game.player.x, y:Game.player.y};
		this.map.tiles[downPos.x][downPos.y] = Tile.stairsDown;
		for(i =0; i<mapRooms.length; i++)
		{
			mapRooms[i].getDoors(function (x, y) {
				var door = ROT.RNG.getWeightedValue({0:1, 1:1, 2:1});
				if(door)
					if(door == 2)
						this.map.tiles[x][y] = Tile.doorClosed;
					else if(door == 1)
						this.map.tiles[x][y] = Tile.doorOpen;
			}.bind(this));
		}
		this.map.addMonsters(this.level);
		this.map.addEntityAtRandom(this.pedro);
		Game.statDisplay.drawText(0, 0, "Hp: "+Math.floor(Game.player.hp));
		this.map.engine.start();
	},
	render: function(display)
	{
		map = this.map;
		player = Game.player;
		var previousFOV = player.fov;
		player.fov = FOV.getFov(player);
		for(var x=0; x<this.map.width; x++)
		{
			for(var y=0; y<this.map.height; y++)
			{
				var tile = this.map.getTile(x,y);
				if(x+","+y in player.fov)
				{
					display.draw(x, y, tile.glyph, tile.fg, tile.bg);
					var entity = this.map.getEntityAt(x,y);
					if(entity)
						display.draw(entity.x, entity.y, entity.glyph, entity.fg, entity.bg);
				}
				else if(x+","+y in previousFOV)
					display.draw(x, y, tile.glyph, "#aaaaaa", tile.bg);
			}
		}
	},
	exit: function()
	{
		return this.level;
	}
}
window.addEventListener('keydown', function(e) {
	Screen.startscreen.handleInput(event, e);
});