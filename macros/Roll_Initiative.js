// macro altered from DJPhoenix719 on 
// https://www.reddit.com/r/ParanoiaRPG/comments/nnr6eh/moving_to_foundryvtt_from_roll20/

// Roll 1d10 and only show the rolling player and the GM.
export async function roll(){
    const results = await new Roll('1d10').roll();
    let chatOptions = {
               type: CONST.CHAT_MESSAGE_TYPES.ROLL,
               roll: results,
               rollMode: game.settings.get("core", "rollMode"),
               content: `<strong>Initiative:</strong> ${results.result}`,
               whisper: game.users.filter((user) => user.isGM).map((user) => user.id)
            };
    ChatMessage.create(chatOptions);
};
//roll();