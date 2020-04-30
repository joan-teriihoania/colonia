const Discord = require("discord.js");
const util = require("util");

module.exports.run = async(client, message, args) => {
  if(!message.guild.members.get(message.author.id).roles.find('name', 'Staff') && message.author.id != 220553711196438528) {
    return message.channel.send(
      {
        embed: {
          title: ":x: **Vous ne disposez pas des droits nécessaires pour utiliser cette commande.**",
          color: 0xffffff,
        }
      }
    )
  }
  /*if (message.author.id != 220553711196438528) {
    return message.channel.send('Cette commande a été désactivée par l\'administrateur.')
  }*/
  

  let amount = Number(args[0]) + 1

  if (amount == undefined) {
    return message.channel.send(
      {
        embed: {
          title: ":robot: **Vous devez entrer un nombre de message à supprimer entier positif valide.**",
          color: 0xffffff,
        }
      }
    )
  }
  
  if (amount != parseInt(amount, 10) || amount < 0) {
    return message.channel.send(
      {
        embed: {
          title: ":robot: **Vous devez entrer un nombre de message à supprimer entier positif valide.**",
          color: 0xffffff,
        }
      }
    )
  }

  function deleteMessage () {
    client.user.lastMessage.delete()

    //const logsChannel = client.channels.get(config.logs)
    //logsChannel.send('**Éxécuteur :** ' + message.author.username + ' (' + message.author.id + ')\n**Channel :** ' + message.channel.name + ' (' + message.channel.id + ')\n**Envoi :** ' + message.createdAt.toString() + '\n**Commande :** ' + message.content)
  }

  let deletedMessages = amount - 1

  message.channel.bulkDelete(amount)
  message.channel.send(
      {
        embed: {
          title: ":white_check_mark: **" + deletedMessages + " messages ont bien été supprimés.**",
          color: 0xffffff,
        }
      }
    )

  setTimeout(deleteMessage, 5000)

  return
}  
  
  

module.exports.help = {
    name : "purge",
    type: "Owner",
}
