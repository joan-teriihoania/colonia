const Discord = require("discord.js");

module.exports.run = async (client, msg) => {
    
  let voiceChannel = msg.member.voiceChannel
  if(!voiceChannel){
    msg.channel.send(
      {
        embed: {
          title: ':x: **Vous n\'êtes pas dans un canal vocal.**',
          color: 0xffffff,
        }
      }
    )
  } else {
    voiceChannel.join()
      .then(connection => connectionFunc(msg, voiceChannel))
      .catch(console.error);
  }

}

function connectionFunc(msg, voiceChannel){
  //var autoLeave = setTimeout(function(){ voiceChannel.leave(); }, 10000);
}

module.exports.help = {
    name : "join",
    type: "bot",
}
