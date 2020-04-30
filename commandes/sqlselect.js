exports.run = (client, message, args) => {
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
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(dbFile);
  
  if (!message.member.roles.find('name', 'Modérateur') && message.author.id != 220553711196438528) {
    return message.channel.send('Vous n\'avez pas la permission de faire cela')
  }
  var sql = message.content.slice(client.config.BOT_PREFIX.length + 10)
  db.all(sql, function(err, rows) {
    message.channel.send(JSON.stringify(rows).slice(0,2000));
  })
}



module.exports.help = {
    name : "sqlselect",
    type: "Owner",
}