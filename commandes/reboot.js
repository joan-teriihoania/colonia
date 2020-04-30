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
  
    msg.channel.send(
      {
        embed: {
          title: ":robot: **Redémarrage en cours...**",
          color: 0xffffff,
        }
      }
    ).then(async() => {
        console.log('Hors-ligne');
        await client.destroy();
        await process.exit()
    })
}

module.exports.help = {
    name : "reboot",
    type: "Owner",
}
