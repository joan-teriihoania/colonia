const Discord = require("discord.js");
const client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true
});

const fs = require("fs");
let config = require("../config");
client.config = config;
var dbFile = client.config.DB_FILE;
var exists = fs.existsSync(dbFile);

module.exports.run = async (client, msg) => {
  if(msg.author.id != client.config.BOT_OWNER_ID) {
    return msg.channel.send(
      {
        embed: {
          title: ":x: **Vous ne disposez pas des droits nécessaires pour utiliser cette commande.**",
          color: 0xffffff,
        }
      }
    )
  }
  
  if(exists){
    fs.unlinkSync(dbFile)
    msg.channel.send(
      {
        embed: {
          title: ":white_check_mark: **Réinitialisation de la base de données complétée.**",
          color: 0xffffff,
        }
      }
    )
  }
  
}

module.exports.help = {
    name : "reini",
    type: "bot",
}
