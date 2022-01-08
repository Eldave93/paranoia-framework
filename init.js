// for adding stuff onto hooks
//Hooks.on('init', function() {
//	CONFIG.debug.hooks = !CONFIG.debug.hooks;
//	if (CONFIG.debug.hooks)
//	    console.log("NOW LISTENING TO ALL HOOK CALLS!");
//	else
//	    console.log("HOOK LISTENING DISABLED.");
//});

import * as characterRoll from './macros/Character_Roll.js';
import * as rollDice from './macros/Roll_Dice.js';
import * as rollInitiative from './macros/Roll_Initiative.js';

// Setting Hooks to easily interact with the importing of the compendiums.
Hooks.on('init', () => {
  game.settings.register("paranoia-framework", 'imported', {
    name: 'Imported Compendiums',
    scope: 'world',
    config: false,
    type: Boolean,
    default: false,
  });
});

// the first time the Compendium directory is rendered
Hooks.once("renderCompendiumDirectory", async function() {
	console.log("This code runs once the compendium directory is rendered");
	
	// import default character sheet
	// code adapted from the alienrpg-corerules
	let pack = await game.packs.find((p) => p.metadata.name === "paranoia-journal-entries")
	await pack.getIndex();
	//let entry = pack.index.find((j) => j.name === "Character Sheet");
	//game['journal'].importFromCompendium(pack, entry._id, { keepId: true });

	const pdfs = ["Character Sheet", "NPC Sheet"];
	for (const pdf of pdfs) {
		let entry = pack.index.find((j) => j.name === pdf);
		game['journal'].importFromCompendium(pack, entry._id, { keepId: true });
	}

	// create character roll macro
	let charRollMacro = await Macro.create({
		name: "Character Roll",
		type: "script",
	  	//img: item.img,
	  	command: characterRoll.rollChar,
	});
	// add the command to run the function to the macro
	game.macros.get(charRollMacro.id).data.command = game.macros.get(charRollMacro.id).data.command + '\nrollChar();';

	// create Roll Dice macro
	let rollDiceMacro = await Macro.create({
		name: "Roll Dice",
		type: "script",
	  	//img: item.img,
	  	command: rollDice.rollD6s,
	});
	// add the command to run the function to the macro
	game.macros.get(rollDiceMacro.id).data.command = game.macros.get(rollDiceMacro.id).data.command + '\nrollD6s(1);';

	// create Roll Initiative macro
	let rollInitiativeMacro = await Macro.create({
		name: "Roll Initiative",
		type: "script",
	  	//img: item.img,
	  	command: rollInitiative.roll,
	});
	// add the command to run the function to the macro
	game.macros.get(rollInitiativeMacro.id).data.command = game.macros.get(rollInitiativeMacro.id).data.command + '\nroll();';

	// assign this macros to hotkeys
	await game.user.assignHotbarMacro(game.macros.get(charRollMacro.id), 1);
	await game.user.assignHotbarMacro(game.macros.get(rollDiceMacro.id), 2);
	await game.user.assignHotbarMacro(game.macros.get(rollInitiativeMacro.id), 3);
});

// the first time the actors directory is rendered
Hooks.once("renderActorDirectory", async function() {
	console.log("This code runs once the actors directory is rendered");

	// import default actors
	// code adapted from the alienrpg-corerules
	let pack = await game.packs.find((p) => p.metadata.name === "paranoia-default-actors")
	await pack.getIndex();

	const actors = ['Default PC', 'Default NPC'];

	for (const actor of actors) {
		let entry = pack.index.find((j) => j.name === actor);
		game['actors'].importFromCompendium(pack, entry._id, { keepId: true });
	}

	// update the actors class so they default to PDFActorSheetAdapter
	Actors.registerSheet("pdfoundry", Actors.registeredSheets[0], {
	  types: [],
	  makeDefault: true
	});

	// set imported to true
	game.settings.set("paranoia-framework", 'imported', true);
});