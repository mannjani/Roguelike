Symbol = function(properties) {
	properties = properties || {};
	this.glyph = properties['glyph'] || '';
	this.fg = properties['fg'] || 'white';
	this.bg = properties['bg'] || 'black';
}