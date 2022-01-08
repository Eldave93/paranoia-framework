# Paranoia Framework

**version:**0.1.0

This is a work-in-progress module for Foundry VTT.

It requires the following dependencies:
- dice-so-nice
- worldbuilding
- pdfoundry

Three macros are availble for players...TODO

## Install
- open the Foundry Virtual Tabletop application,
- **TODO:** Instructions on installing Simple World-Building
- go to Add-on Modules, 
- then Install Module, 
- then in the Manifest URL paste `https://raw.githubusercontent.com/Eldave93/paranoia-framework/main/module.json`

## Setup
- open the Foundry Virtual Tabletop application,
- go to Game Worlds,
- then Create World,
- add a **World Title**
- When setting up the world to use this module, make sure to select the *Simple World-Building* as the **Game System**
- After making any other optional chnages, click **Create World**
- In the right hand menu, click the cog wheel icon and *Manage Modules*
- Tick the module *Paranoia Framework*, then *Save Module Settings*
- Now everything I've made should either be automatically added to the world or found in the Compendium

### Actor Setup
On the **Actor** tab navigate to a character, click on their name, then *Select PDF*, then change to *Character Sheet* which will configure the character sheet correctly. If you do not setup the actor rolls will assume the stats/skills are 0.

**TODO:** Try automate the character setup described above

### Cards Setup
Rather than provide all the card images, the framework is there but you'll need to provide a folder `cards` inside the `assets` folder which has `.png` images of each card. Each card is named with lowercase letters and a `-` instead of a space, and no punctuation. You can get this by purchasing a digital version of the game and cropping the provided pdf pages, or a physical version and scanning the cards in.

## TODO
- Create a default NPC
- continue writing the readme
- I think the minus NODE for character roll is not working properly
- need to make a check that the Default PC, Character Sheet, and Macros have not already been imported as currently they add each time you load into the world. 
	- Also it will overwrite any changes made to the default macrobar config each login.
