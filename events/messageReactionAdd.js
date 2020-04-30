const Discord = require("discord.js");

module.exports = async (client, reaction, user, member) => {
  //console.log('Reaction ' + reaction.emoji + " added on message " + reaction.message.content + " by " + user.username)
  if(user.bot == false){
    if(reaction.emoji == "❌"){
      reaction.remove(user)
      if(reaction.message.content.slice(0,1) == '[' || reaction.message.content.slice(0,1) == '(' || reaction.message.content.slice(0,1) == "/" ){
        if (reaction.message.guild.members.get(user.id).roles.find('name', 'Staff') || user.id == 220553711196438528 || user.id == reaction.message.author.id) {
          if(reaction.message.author.id != user.id) channelSend(client.channels.get('690577768961802260'), client, "**Message de <@"+reaction.message.author.id+"> supprimé par <@"+user.id+"> dans "+reaction.message.guild.channels.get(reaction.message.channel.id).toString()+"**.\n\n"+reaction.message.content, "description")
          if(reaction.message.author.id == user.id) channelSend(client.channels.get('690577768961802260'), client, "**<@"+user.id+"> a supprimé son message dans "+reaction.message.guild.channels.get(reaction.message.channel.id).toString()+"**.\n\n"+reaction.message.content, "description")
          reaction.message.delete()
        } else {
          dm(client, ":x: **Vous n'êtes pas autorisé à supprimer ce message.**", "", user.id)
        }
      }
    } else if (reaction.emoji == "🖼"){
      reaction.remove(user);
      var Attachment = (reaction.message.attachments).array();
      var link_image_msg = reaction.message.channel.send(
        {
          embed: {
            title: ":frame_photo: Lien de l'image",
            description: Attachment[0].url,
            url: Attachment[0].url,
            color: 0xffffff
          }
        }
      )
    } else if (reaction.emoji == "▶"){
      reaction.remove(user);
      const voiceChannelUser = reaction.message.member.voiceChannel;
      var voiceChannelClient = client.guilds.get(reaction.message.guild.id).voiceConnection
      if (!voiceChannelUser) return channelSend(reaction.message.channel, client, ":x: **Vous devez être connecté à un canal vocal.**");
      if(!voiceChannelClient) {
        voiceChannelUser.join();
        voiceChannelClient = client.guilds.get(reaction.message.guild.id).voiceConnection
      } else {
        if (voiceChannelUser != voiceChannelClient.channel) return channelSend(reaction.message.channel, client, ":x: **Vous devez être connecté au même canal vocal que moi.**");
      }
      
      //var links = reaction.message.content.match(/^.*(youtu.be\/|v=)([^#\&\?]*).*/)
      //var regex = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?")
      //var links = reaction.message.content.match(regex)
      var links = reaction.message.content.match(/\bhttps?:\/\/\S+/gi);
      links.forEach(function(link) {
        reaction.message.channel.send(client.config.BOT_PREFIX + "music play " + link);
      });
    }
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


function dm(client, content, forceMode, user_id){
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

  //client.channels.get('675728232708046858').send(exampleEmbed)
  
  if(user_id){
    client.users.get(user_id).createDM().then(() => {
      client.users.get(user_id).dmChannel.send(exampleEmbed)
    })
  } else {
    return exampleEmbed
  }
}