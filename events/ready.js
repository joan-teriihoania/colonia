const antispam = require('discord-anti-spam');
const Discord = require("discord.js");

module.exports = async (client) => {
  if(client.config.maintenance){
    client.guilds.get('587297215991775232').members.get(client.user.id).setNickname('Grâce désactivée')
    client.user.setActivity(client.config.maintenance_reason)
    return
  }
  /*
  const embed = {
    "title": "",
    "color": 16777215,
    "author": {
      "name": "A global annoucement by Tet#3382",
    },
    "fields": [
      {
        "name": "**Perturbations**",
        "value": "Due to some database's instability on the hosting servers, the systems may be affected and malfunctionned. Apoligise."
      }
    ]
  };

  client.channels.get('587298451067371530').send({ embed });*/
  //channelSend(client.channels.get('587298451067371530'), client, 'npm install --prefix ./5\ -\ viewer+server+oss+derivatives\nnpm ERR! code **EINVALIDTAGNAME**\nnpm ERR! Invalid tag name "viewer+server+oss+derivatives": Tags may not have any characters that encodeURIComponent encodes.\nnpm ERR! A complete log of this run can be found in:\nnpm ERR! `npm-cache_logs\2017-07-26T19_10_35_097Z-debug.log`\nnpm ERR! code **ELIFECYCLE**\nnpm ERR! errno 1\nnpm ERR! forge-boilers.nodejs@1.0.0 install-boiler5: npm install --prefix ./5\ -\ viewer+server+oss+derivatives\nnpm ERR! Exit status 1\nnpm ERR!\nnpm ERR! Failed at the forge-boilers.nodejs@1.0.0 install-boiler5 script.\nnpm ERR! This is probably not a problem with npm. There is likely additional logging output above.\nnpm WARN Local package.json exists, but node_modules missing, did you mean to install?\nnpm ERR! A complete log of this run can be found in:\nnpm ERR! `npm-cache_logs\2017-07-26T19_10_35_341Z-debug.log`\nnpm ERR! code **ELIFECYCLE**\nnpm ERR! errno 1\nnpm ERR! forge-boilers.nodejs@1.0.0 postinstall: npm run install-boiler5\nnpm ERR! Exit status 1\nnpm ERR!\nnpm ERR! Failed at the forge-boilers.nodejs@1.0.0 postinstall script.\nnpm ERR! This is probably not a problem with npm. There is likely additional logging output above.\nnpm WARN Local package.json exists, but node_modules missing, did you mean to install?\nnpm ERR! A complete log of this run can be found in:\nnpm ERR! `npm-cache_logs\2017-07-26T19_10_35_604Z-debug.log`')
  console.log(`${client.user.username} en ligne!`);
  //await client.user.setPresence({ game: { name: `${client.config.BOT_PREFIX}help`}});

  var guild_list = "";
	client.guilds.map(function(guild_object){
    guild_list = guild_list + "\n" + guild_object.name;
		console.log(" /!\\ " + guild_object.id + ":" + guild_object.name);
    if(guild_object.name != "Fortis Entreprise : Colonia"){
      console.log(" /!\\ NONE OFFICIAL GUILD : " + guild_object.name);
      client.guilds.get(guild_object.id).leave()
    }
	})
  
  client.guilds.get('587297215991775232').channels.map(function(channel_object){
    if(channel_object.parentID == '604980686750744595' || channel_object.parentID == '587298386110054401' || channel_object.parentID == '587298385288101891') {
      //console.log(channel_object.name)
      //channelSend(client.channels.get(channel_object.id), client, ":x: Security breach :x:\nShutdowning systems...")
    }
  })
  
  channelSend(client.channels.get('614929573636734976'), client, "**Status : **:white_check_mark: Online.\n:warning: **Systems may experience some outages and lag spikes due to the maintenance of the databases of the hosting supplier.\n\nApologise for the delays.\n - Tet.**")
  
  // Module Configuration Constructor
   /*antispam(client, {
        warnBuffer: 5, // Maximum ammount of messages allowed to send in the interval time before getting warned.
        maxBuffer: 10, // Maximum amount of messages allowed to send in the interval time before getting banned.
        interval: 2000, // Amount of time in ms users can send the maxim amount of messages(maxBuffer) before getting banned. 
        warningMessage: "ceci est votre premier et dernier avertissement pour **spam**. Veuillez vous arrêter sur le champ ou vous serez banni du serveur.", // Message users receive when warned. (message starts with '@User, ' so you only need to input continue of it.) 
        banMessage: "a été banni du serveur pour spam.", // Message sent in chat when user is banned. (message starts with '@User, ' so you only need to input continue of it.) 
        maxDuplicatesWarning: 7,// Maximum amount of duplicate messages a user can send in a timespan before getting warned.
        maxDuplicatesBan: 10, // Maximum amount of duplicate messages a user can send in a timespan before getting banned.
        deleteMessagesAfterBanForPastDays: 0, // Deletes the message history of the banned user in x days.
        exemptRoles: ["Staff"], // Name of roles (case sensitive) that are exempt from spam filter.
        exemptUsers: ["Tet#3382"] // The Discord tags of the users (e.g: MrAugu#9016) (case sensitive) that are exempt from spam filter.
      });*/
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