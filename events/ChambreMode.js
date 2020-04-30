const Discord = require('discord.js')

module.exports = async (client, db, mode) => {
  if(client.config.maintenance) return;
  
  if(mode == "Night"){
    db.each('SELECT * from chambres', function(err, chambre) {
      if ( chambre ) {
        var messageToSend = "> **[Grâce] **Mode nuit activé.\n"+
          "> **[Grâce] **Economie d'énergie...\n"+
          "> **[Grâce] **Extinction des feux...\n"+
          "\n\n**Les lumières blanches de la chambre faiblissent alors puis s'éteignent assez lentement jusqu'à finalement devenir de petites veilleuses éclairant assez faiblement la chambre.**"
        channelSend(client.channels.get(chambre.channelID), client, messageToSend)
      }
    });
  } else if (mode == "Reboot"){
    db.each('SELECT * from chambres', function(err, chambre) {
      if ( chambre ) {
        var messageToSend = "**Des écritures sur les consoles apparaissent alors.**\n\n"+
          "> **[Grâce] **Votre système de contrôle d'habitation va redémarrer pour la mise à jour journalière.\n"+
          "> **[Grâce] **Veuillez patienter...\n"+
          "\n\n**Les lumières de la chambre s'éteignent alors pendant quelques secondes, toutes les consoles redémarrent puis le tout se relance.**\n\n"+
          "> **[Grâce] **Système de contrôle d'habitation redémarré\n"+
          "> **[Grâce] **Mise à jour complétée\n"+
          "> **[Grâce] **Merci de votre patience."
        channelSend(client.channels.get(chambre.channelID), client, messageToSend)
      }
    });
  } else if (mode == "Day"){
    db.each('SELECT * from chambres', function(err, chambre) {
      if ( chambre ) {
        var messageToSend = "> **[Grâce] **Mode jour activé.\n"+
          "> **[Grâce] **Réallumage des feux...\n"+
          "\n\n**Les lumières de la chambre se rallument alors lentement puis les prévisions météorologiques du jour ainsi que les rapports de la nuit s'affichent sur les consoles.**"
        channelSend(client.channels.get(chambre.channelID), client, messageToSend)
      }
    });
  }
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