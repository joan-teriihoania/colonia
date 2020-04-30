const Discord = require("discord.js");
const util = require("util");


module.exports.run = async(client, message, args) => {
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
  
  var dbFile = client.config.DB_FILE;
  const fs = require("fs");
  var exists = fs.existsSync(dbFile);
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(dbFile);
  
  
  var today = new Date();
  today.setHours(today.getHours() - 2);
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  // add a zero in front of numbers<10
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);
  
  client.emit("weatherSimulation", db, h + " " + m + " " + s);
}  
  
  

module.exports.help = {
    name : "meteo",
    type: "Owner",
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}