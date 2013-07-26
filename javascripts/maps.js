var Map = function(tiles, player) {
	this.tiles = tiles;
	this.width = tiles.length;
	this.height = tiles[0].length;
	this.entities = [];
	this.scheduler = new ROT.Scheduler.Simple();
	this.engine = new ROT.Engine(this.scheduler);
	this.addEntityAtRandom(player);
};
Map.prototype.getTile = function (x, y) {
	if((x>=0 && x<Game.width) && (y>=0 && y<Game.height))
		return this.tiles[x][y];
	else
		return Tile.error;
};
Map.prototype.dig = function(x, y) {
	if(this.getTile(x,y).isDiggable)
		this.tiles[x][y] = Tile.floor;
	if(x+","+y in Game.player.fov)
		Game.display.draw(x, y, Tile.floor.glyph, Tile.floor.fg, Tile.floor.bg);
}
Map.prototype.openDoor = function(x, y) {
	if(this.getTile(x,y).isOpenable)
		this.tiles[x][y] = Tile.doorOpen;
	if(x+","+y in Game.player.fov)
		Game.display.draw(x, y, Tile.floor.glyph, Tile.floor.fg, Tile.floor.bg);
}
Map.prototype.getFreePosition = function() {
	var x, y;
	do {
		x = Math.floor(ROT.RNG.getUniform() * this.width);
		y = Math.floor(ROT.RNG.getUniform() * this.height);
	} while(!this.isEmptyTile(x, y));
	return {x:x, y:y};
}
Map.prototype.getEntities = function() {
	return this.entities;
}
Map.prototype.getEntityAt = function(x, y) {
	for(var i=0; i< this.entities.length; i++)
		if(this.entities[i].x == x && this.entities[i].y == y)
			return this.entities[i];
}
Map.prototype.addEntity = function(entity) {
	entity.setMap(this);
	this.entities.push(entity);
	if(entity.hasMixin('Actor'))
		this.scheduler.add(entity, true);
}
Map.prototype.addEntityAtRandom = function(entity) {
	var position = this.getFreePosition();
	entity.setX(position.x);
	entity.setY(position.y);
	this.addEntity(entity);
}
Map.prototype.removeEntity = function(entity) {
	for(var i=0;i<this.entities.length;i++)
	{
		if(this.entities[i] == entity)
		{
			this.entities.splice(i,1);
			break;
		}
	}
	var tile = this.getTile(entity.x, entity.y);
	if(x+","+y in Game.player.fov)
		Game.display.draw(entity.x, entity.y, tile.glyph, tile.fg, tile.bg);
	if(entity.hasMixin('Actor'))
		this.scheduler.remove(entity);
}
Map.prototype.isEmptyTile = function(x, y) {
	return this.getTile(x, y) == Tile.floor && !this.getEntityAt(x, y);
}
Map.prototype.addMonsters = function(level) {
	for(i=0;i<MonsterTemplates.length;i++)
	{
		var monster = MonsterTemplates[i];
		if(level >= monster.minLevel && level <= monster.maxLevel)
		{
			number = ROT.RNG.getWeightedValue({"1": 10, "2": 4, "3": 1})
			number = parseInt(number) + level;
			for(j=0;j<number;j++)
			{
				monsterActor = new Actor(monster);
				this.addEntityAtRandom(monsterActor);
			}
		}
	}
}