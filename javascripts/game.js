var Game = 
{
	display: null,
	messageDisplay: null,
	statDisplay: null,
	screen: null,
	width: null,
	height: null,
	player: null,
	init: function() {
		this.display = new ROT.Display();
		this.messageDisplay = new ROT.Display({height:4});
		this.statDisplay = new ROT.Display({height: 4});
		this.width = this.display.getOptions().width;
		this.height = this.display.getOptions().height;
		document.getElementById("GameWindow").appendChild(this.messageDisplay.getContainer());
		document.getElementById("GameWindow").appendChild(this.display.getContainer());
		document.getElementById("GameWindow").appendChild(this.statDisplay.getContainer());
		this.player = new Actor(Actor.PlayerTemplate);
	},
	switchScreen: function(show, dLevel) {
		var level = 0;
		if(this.screen!==null)
		{
			level = this.screen.exit();
		}
		level = level + dLevel;
		this.display.clear();
		this.messageDisplay.clear();
		this.screen = show;
		if(!this.screen !== null)
		{
			this.screen.enter(level, dLevel);
			this.player.fov = {};
			this.refresh();
		}
	},
	refresh: function() {
		//this.display.clear();
		this.screen.render(this.display);
	}
}