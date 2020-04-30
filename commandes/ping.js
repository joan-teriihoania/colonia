const Discord = require("discord.js");

module.exports.run = async (client, msg) => {

    msg.channel.send(
      {
        embed: {
          title: 'Pong ! **' + client.pings[0] + ' ms**',
          color: 0xffffff,
        }
      }
    )

}

module.exports.help = {
    name : "ping",
    type: "bot",
}
