const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  
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
  
  let mentionnedUser = message.mentions.users.firstKey()
  let userAffected
  let managedUser
  let roleName = args[1]
  if(mentionnedUser == undefined){
    var roleNameArray = args.slice(0);
    roleNameArray.shift(2);
    roleName = roleNameArray.join(" ")
    userAffected = message.author.username
    managedUser = message.member
  } else {
    userAffected = client.users.get(mentionnedUser).username
    managedUser = message.guild.members.get(mentionnedUser)
  }
  
  if(args[0] == "add"){
    const role = message.guild.roles.find('name', roleName);
    managedUser.addRole(role)
      .then(
        message.channel.send(
          {
            embed: {
              title: ":white_check_mark: "+userAffected+" ! **Le rôle "+roleName+" vous a été ajouté.**",
              color: 0xffffff,
            }
          }
        )
      );
    return
  } else if (args[0] == "remove"){
    const role = message.guild.roles.find('name', roleName);
    managedUser.removeRole(role)
      .then(
        message.channel.send(
          {
            embed: {
              title: ":white_check_mark: "+userAffected+" ! **Le rôle "+roleName+" vous a été retiré.**",
              color: 0xffffff,
            }
          }
        )
      )
    return
  }
  
  return message.channel.send(
    {
      embed: {
        title: ":x: **La syntaxe utilisée est incorrecte : `role [add/remove] [role]`**",
        color: 0xffffff,
      }
    }
  ) 
}

module.exports.help = {
    name : "role",
    type: "Owner",
}
