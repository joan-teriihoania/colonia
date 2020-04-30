var sqlite3 = require('sqlite3').verbose()
const Discord = require("discord.js");

module.exports.run = async (client, msg, args) => {
  var db = new sqlite3.Database(client.config.DB_FILE);
  var characterSurname = args.join(' ')
  db.get('SELECT COUNT(*) AS characterExist from characters WHERE surname = "'+characterSurname+'"', function(err, characterExist) {
    if (characterExist) {
      if(characterExist["characterExist"] > 0){
        return channelSend(msg.channel, client, ":frowning: **Le personnage `"+characterSurname+"` existe déjà.**")
      } else {
        db.get('SELECT MAX(characterId) AS maxCharId FROM characters', function(err, maxCharId) {
          if (maxCharId && maxCharId['maxCharId']) {
            db.run('INSERT INTO characters (authorId, characterId, surname) VALUES ("'+msg.mentions.users.firstKey()+'", "'+maxCharId['maxCharId']+'", "'+characterSurname+'")')
          }
        })
      }
    }
  })
}

module.exports.help = {
    name : "add-character",
    type: "bot",
}


function channelSend(channel, client, content, forceMode){
  var titleContent = ""
  var descriptionContent = ""
  
  if(forceMode == "" || forceMode == undefined){
    if(content.length < 256){
      titleContent = content
    } else {
      descriptionContent = content
    }
  } else if (forceMode == "description"){
    descriptionContent = content
  } else if (forceMode == "title"){
    titleContent = content
  }
  
  
  if(descriptionContent.length > 2040){
    descriptionContent = descriptionContent.slice(0,2040) + "..."
  }
  const exampleEmbed = new Discord.RichEmbed()
    .setColor(0xffffff)
    .setTitle(titleContent)
    .setDescription(descriptionContent)

  channel.send(exampleEmbed);
}