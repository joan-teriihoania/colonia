exports.run = (client, message, args) => {
  if(!client.guilds.get(message.guild.id).me.hasPermission("MANAGE_ROLES")){
    return message.channel.send(
      {
        embed: {
          title: ":x: **Je ne dispose pas des accès pour pouvoir gérer les rôles.**",
          color: 0xffffff,
        }
      }
    ) 
  }

  let toSay = message.content.slice(client.config.BOT_PREFIX.length + 4)
  return message.channel.send(toSay)
}


module.exports.help = {
    name : "say",
    type: "bot",
}