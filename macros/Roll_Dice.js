// macro altered from DJPhoenix719 on 
// https://www.reddit.com/r/ParanoiaRPG/comments/nnr6eh/moving_to_foundryvtt_from_roll20/

// Roll some basic dice using 5's and 6's as successes with a computer dice.
export async function rollD6s(amount) {
    const roll = async (amount, message, computerEnabled) => {
        const isPos = amount > 0;

        const poolSize = Math.abs(amount);
        
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

        var flavor = `<strong>Overall Score:</strong> ${r.result}`;

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
                var computerFlavor = "<strong>Friend Computers assistance activated</strong>"
                // TODO: remove one moxie - would need to alter pdf to get this attribute
            } else {
                var computerFlavor = "Friend Computer is busy"
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

    let content = `
        <div style="display: block; width: 100%; height: 100%">
            <div style="display: flex; line-height: 2rem;">
                <label style="flex-grow: 1; padding-right: 8px;" for="dialogMessage">Label</label>
                <input type="text" style="height: 2rem;" id="dialogMessage" value="" placeholder="(optional)">
            </div>
            <div style="display: flex; line-height: 2rem;">
                <label style="flex-grow: 1; padding-right: 8px;" for="dialogAmount">Amount</label>
                <input type="number" style="height: 2rem;" id="dialogAmount" value="${amount ?? ''}">
            </div>
            <div style="display: flex; line-height: 2rem;">
                <label style="flex-grow: 1; padding-right: 8px;" for="dialogComputer">Computer</label>
                <input type="checkbox" style="height: 2rem;" id="dialogComputer" checked>
            </div>
        </div>`;

    let d = new Dialog({
        title: `Roll D6s`,
        content,
        buttons: {
            roll: {
                icon: '<i class="fas fa-check"></i>',
                label: 'Roll',
                callback: async (html) => {
                    const descriptionInput = html.find('#dialogMessage');
                    const description = descriptionInput.val();

                    const amountInput = html.find('#dialogAmount');
                    const amount = parseInt(amountInput.val());

                    const computerInput = html.find('#dialogComputer');
                    const computer = computerInput.prop('checked');

                    await roll(amount, description, computer);
                },
            },
        },
        default: 'roll',
    });
    d.render(true);
}
//rollD6s(1);