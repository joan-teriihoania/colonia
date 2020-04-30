var sqlite3 = require('sqlite3').verbose()
const Discord = require("discord.js");

module.exports.run = async (client, msg, args) => {
  var db = new sqlite3.Database(client.config.DB_FILE);
  var characterSurname = args.slice(0,-1).join(' ')
  var channelID = args.slice(-1)
  channelID = channelID[0]
  channelID = channelID.slice(2,channelID.length-1)
  db.get('SELECT COUNT(*) AS characterExist from characters WHERE surname = "'+characterSurname+'"', function(err, characterExist) {
    if (characterExist) {
      if(characterExist["characterExist"] > 0){
        db.get('SELECT * from characters WHERE surname = "'+characterSurname+'" LIMIT 1', function(err, char) {
          if (char) {
            db.run("INSERT INTO chambres (colonID, channelID) VALUES ('"+char.characterId+"', '"+channelID+"')")
            return channelSend(msg.channel, client, ":white_check_mark: Le salon <#"+channelID+"> a été attribué à " + char.name + " " + char.surname)
          }
        })
      } else {
        return channelSend(msg.channel, client, ":frowning: **Le personnage `"+characterSurname+"` n'existe pas.**")
      }
    }
  })
}

module.exports.help = {
    name : "chambre",
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