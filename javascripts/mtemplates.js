MonsterTemplates = [
	orcTemplate = {
		name: 'Orc',
		glyph: 'o',
		fg: 'green',
		maxHp: 10,
		attackValue: 2,
		alignment: 'Monster',
		minLevel: 1,
		maxLevel: 12,
		mixins: [Mixins.MonsterActor, Mixins.Destructible, Mixins.Attacker]
	},
	goblinTemplate = {
		name: 'Goblin',
		glyph: 'g',
		fg: 'blue',
		maxHp: 15,
		attackValue: 3,
		alignment: 'Monster',
		minLevel: 1,
		maxLevel: 20,
		mixins: [Mixins.MonsterActor, Mixins.Destructible, Mixins.Attacker]
	},
]