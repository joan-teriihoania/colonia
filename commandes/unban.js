const fs = require('fs')
const fileExists = require('file-exists')

module.exports.run = async (client, message, args) => {
  if(message.author.id != client.config.BOT_OWNER_ID) {
    return message.channel.send(
      {
        embed: {
          title: ":x: **Vous ne disposez pas des droits nécessaires pour utiliser cette commande.**",
          color: 0xffffff,
        }
      }
    ) 
  }
  message.guild.unban(args[0])
    .then(user => 
      message.channel.send(
        {
          embed: {
            title: `:white_check_mark: L'utilisateur ${args[0]} a été débanni de ${message.guild.name}`,
            color: 0xffffff,
          }
        }
      )
    )
    .catch(
      message.channel.send(
        {
          embed: {
            title: ":thinking: **Vérifiez que l'identifiant est correcte ou que l'utilisateur spécifié est bien bannis.**",
            color: 0xffffff,
          }
        }
      )
    );
}



module.exports.help = {
    name : "unban",
    type: "Owner",
}