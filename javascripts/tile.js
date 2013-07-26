var Tile = function(properties) {
	properties = properties || {};
	Symbol.call(this, properties);
	this.isWalkable = properties['isWalkable'] || false;
	this.isDiggable = properties['isDiggable'] || false;
	this.isOpenable = properties['isOpenable'] || false;
};
Tile.extend(Symbol);
Tile.prototype.getSymbol = function() {
	return this.symbol;
};
Tile.error = new Tile({});
Tile.floor = new Tile({
	glyph: ".",
	fg: "white",
	isWalkable: true,
});
Tile.wall = new Tile({
	glyph: "#",
	fg: "white",
	isDiggable: true,
});
Tile.borderHorizontal = new Tile({
	glyph: "-",
	fg: "white",
});
Tile.borderVertical = new Tile({
	glyph: "|",
	fg: "white",
});
Tile.stairsUp = new Tile({
	glyph: "<",
	fg: "white",
	isWalkable: true,
});
Tile.stairsDown = new Tile({
	glyph: ">",
	fg: "white",
	isWalkable: true,
});
Tile.doorClosed = new Tile({
	glyph: "+",
	fg: "brown",
	isOpenable: true,
});
Tile.doorOpen = new Tile({
	glyph: "'",
	fg: "brown",
	isWalkable: true,
});