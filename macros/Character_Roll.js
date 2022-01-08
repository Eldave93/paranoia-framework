// macro altered from DJPhoenix719 on 
// https://www.reddit.com/r/ParanoiaRPG/comments/nnr6eh/moving_to_foundryvtt_from_roll20/

// Automatically roll a Stat + Skill using either a selected token or the players active actor, 
// which is assigned in the player configuration menu (right click a player's name at the 
// bottom left). This includes all the default stats and skills, a field for a bonus to the 
// roll, automatically rolls a computer dice, and subtracts wounds (-1, -2, and -3 respectively).

export async function rollChar() {
    // calculates the roll based on the user inputs defined in the dialog box created below
    const roll = async (skill, attribute, bonus, woundsEnabled, computerEnabled, token) => {
        // tidy up skill and attribute names
        const skillName = skill
            .split('_')
            .map((v) => v.capitalize())
            .join(' ');
        const attriName = attribute
            .split('_')
            .map((v) => v.capitalize())
            .join(' ');

        if (token){
            //console.log("token activated");

            // check a token has been selected
            if (canvas.tokens.controlled.length == 0 || canvas.tokens.controlled.length > 1){
                ui.notifications.error("Please select a single token");
                return;
            }

            // get the general attributes of the selected token (including stats and skills)
            var attributes = canvas.tokens.controlled[0].actor.data.data.attributes;
        } else {
            //console.log("default character");

            // check the user (Gamesmaster or player) has been assigned a character
            if (game.user.character === undefined){
                ui.notifications.error("Please select a character in user configuration");
                return;
            }
            // get the game users general attributes (including stats and skills)
            var attributes = game.user.character.data.data.attributes;
        }

        // default values
        let attributeValue = 0
        let skillValue = 0

        try {
            attributeValue = parseInt(attributes.attributes[attribute].value);
            // if has a path on teh sheet but is empty then set to 0
            if (isNaN(attributeValue)) attributeValue = 0;
        } catch {
        // then leave at default
        }

        try {
            // get the stats value
            skillValue = parseInt(attributes.skills[skill].value);
            // if has a path on teh sheet but is empty then set to 0
            if (isNaN(skillValue)) skillValue = 0;
        } catch {
        // then leave at default
        }

        // TESTING LOGS
        //console.log(skillName);
	    //console.log(skillValue);
	    //console.log(attriName);
	    //console.log(attributeValue);

        // calculate the injuryLevel of character
        let injuryLevel = 0;
        if (woundsEnabled) {
            const isHurt = attributes.attributes['hurt'].value === 'true';
            const isInjured = attributes.attributes['injured'].value === 'true';
            const isMaimed = attributes.attributes['maimed'].value === 'true';

            if (isHurt) injuryLevel = -1;
            if (isInjured) injuryLevel = -2;
            if (isMaimed) injuryLevel = -3;
        }

        // number of dice to roll
        const poolSize = Math.abs(attributeValue + skillValue + bonus + injuryLevel);

        // check if you have a negative NODE dice number
        const isPos = skillValue + attributeValue + bonus > 0;
        //console.log(isPos);

        // If you have a positive NODE dice number
        if(isPos){
            //console.log("pos");
            // roll the dice and count a success for each die which rolls a 5 or higher
            var r = await new Roll(`${poolSize}d6cs>=5`);
        } else {
            //console.log("neg");
            // roll the dice and count a success for each die which rolls a 5 or higher but deduct 
            // a success for any roll that is a failure
            var r = await new Roll(`${poolSize}d6cs>=5df<5`);
        }

        // eval the roll
        r.evaluate(async=true);

        // make the flavor text to display in the chat window
        let flavor = `${attriName} (${attributeValue}) + ${skillName} (${skillValue})`;
        if (bonus !== 0) {
            flavor += ` + Bonus (${bonus})`;
        }
        if (injuryLevel !== 0) {
            flavor += ` + Wounds (${injuryLevel})`;
        }

        flavor += `<br><br> <strong>Overall Score:</strong> ${r.result}`;
        
        // TESTING LOG
        //console.log(r.result);

        // change the player dice colour
        r.dice[0].options.colorset = 'white';

        // roll the dice visually using "Dice so Nice" module 
        // and output the flavor message
        let chatOptions = {
               type: CONST.CHAT_MESSAGE_TYPES.ROLL,
               roll: r,
               rollMode: game.settings.get("core", "rollMode"),
               content: flavor
            };
        ChatMessage.create(chatOptions);

        // if rolling the computer die...
        if (computerEnabled) {
            const computer = await new Roll('1d6').roll({async:true});

            // change the computer dice colour
            computer.dice[0].options.colorset = 'bronze';

            // if friend computer is rolled (6)
            if (computer.result==6){
                // flavor text to say if friend computer is going to provide assistance
                computerFlavor = "<strong>Friend Computers assistance activated</strong>"
                // TODO: remove one moxie - would need to alter pdf to get this attribute
            } else {
                computerFlavor = "Friend Computer is busy"
            }

            let chatOptions = {
               type: CONST.CHAT_MESSAGE_TYPES.ROLL,
               roll: computer,
               rollMode: game.settings.get("core", "rollMode"),
               content: computerFlavor
            };
            ChatMessage.create(chatOptions);
        }

    };

    // Content of the Dialog box
    let content = `
        <div style="display: block; width: 100%; height: 100%">
            <div style="display: flex; line-height: 2rem;">
                <label style="flex-grow: 1; padding-right: 8px;" for="dialogAttribute">Attribute</label>
                <select style="height: 2rem;" id="dialogAttribute">
                    <option value="violence" selected>Violence</option>
                    <option value="brains">Brains</option>
                    <option value="chutzpah">Chutzpah</option>
                    <option value="mechanics">Mechanics</option>
                </select>
            </div>
            <div style="display: flex; line-height: 2rem;">
                <label style="flex-grow: 1; padding-right: 8px;" for="dialogSkill">Skill</label>
                <select style="height: 2rem;" id="dialogSkill">
                    <option value="alpha_complex" selected>Alpha Complex</option>
                    <option value="athletics">Athletics</option>
                    <option value="bluff">Bluff</option>
                    <option value="bureaucracy">Bureaucracy</option>
                    <option value="charm">Charm</option>
                    <option value="demolitions">Demolitions</option>
                    <option value="engineer">Engineer</option>
                    <option value="guns">Guns</option>
                    <option value="intimidate">Intimidate</option>
                    <option value="melee">Melee</option>
                    <option value="operate">Operate</option>
                    <option value="program">Program</option>
                    <option value="psychology">Psychology</option>
                    <option value="science">Science</option>
                    <option value="stealth">Stealth</option>
                    <option value="throw">Throw</option>
                </select>
            </div>
            <div style="display: flex; line-height: 2rem;">
                <label style="flex-grow: 1; padding-right: 8px;" for="dialogBonus">Bonus</label>
                <input type="number" style="height: 2rem;" id="dialogBonus" value="0">
            </div>
            <div style="display: flex; line-height: 2rem;">
                <label style="flex-grow: 1; padding-right: 8px;" for="dialogComputer">Computer</label>
                <input type="checkbox" style="height: 2rem;" id="dialogComputer" checked>
            </div>
            <div style="display: flex; line-height: 2rem;">
                <label style="flex-grow: 1; padding-right: 8px;" for="dialogWounds">Wounds</label>
                <input type="checkbox" style="height: 2rem;" id="dialogWounds" checked>
            </div>
            <div style="display: flex; line-height: 2rem;">
                <label style="flex-grow: 1; padding-right: 8px;" for="tokenRoll">Selected Token?</label>
                <input type="checkbox" style="height: 2rem;" id="tokenRoll">
            </div>
        </div>`;

    // create the Dialog box with associated buttons and functions
    let d = new Dialog({
        title: `Roll D6s`,
        content,
        buttons: {
            roll: {
                icon: '<i class="fas fa-check"></i>',
                label: 'Roll',
                callback: async (html) => {
                    const dialogAttribute = html.find('#dialogAttribute');
                    const attribute = dialogAttribute.val();

                    const dialogSkill = html.find('#dialogSkill');
                    const skill = dialogSkill.val();

                    const dialogBonus = html.find('#dialogBonus');
                    const bonus = parseInt(dialogBonus.val());

                    const computerInput = html.find('#dialogComputer');
                    const computer = computerInput.prop('checked');

                    const woundsInput = html.find('#dialogWounds');
                    const wounds = woundsInput.prop('checked');

                    const tokenInput = html.find('#tokenRoll');
                    const token = tokenInput.prop('checked');

                    await roll(skill, attribute, bonus, wounds, computer, token);
                },
            },
        },
        default: 'roll',
    });
    d.render(true);
}

//rollChar();