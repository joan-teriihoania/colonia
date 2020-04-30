const Discord = require("discord.js");

module.exports = async (client, oldMember, newMember) => {
  if(client.config.maintenance) return;
  
  var nbVoiceChannelsPrivate = 0
  var nbVoiceChannelsPrivateBusy = 0
  var guild = client.guilds.get(oldMember.guild.id)
  
  var mainParentChannel;
  await guild.channels.map(function(channel){
    if(channel.type == "voice" && channel.name.slice(0, 5) == "Privé"){
      nbVoiceChannelsPrivate += 1
      if(channel.parent){
        mainParentChannel = channel.parent
      }
    }
  });
  
  await sleep(50)
  
  guild.channels.map(function(channel){
    if(channel.type == "voice" && channel.name.slice(0, 5) == "Privé" && channel.members.size > 0){
      nbVoiceChannelsPrivateBusy += 1
    }
  });

  var nbVoiceChannelsPrivateNotBusy = parseInt(nbVoiceChannelsPrivate - nbVoiceChannelsPrivateBusy)
  var indexChannels = nbVoiceChannelsPrivateNotBusy-2
  if(nbVoiceChannelsPrivateNotBusy > 1){
    guild.channels.map(function(channel){
      if(channel.type == "voice" && channel.name.slice(0, 5) == "Privé" && channel.name.slice(0, 7) != "Privé 1"){
        indexChannels += 1
        if(indexChannels > 1 && channel.members.size == 0){
          var voiceChannelNameFormatted = channel.name.toLowerCase()
          voiceChannelNameFormatted = voiceChannelNameFormatted.replace(/ /gi, "-")  
          voiceChannelNameFormatted = voiceChannelNameFormatted + "-no-mic"

          indexChannels += 1
          if(voiceChannelNameFormatted != "Privé 2"){
            deleteChannels(client, voiceChannelNameFormatted, channel)
          }
        }
      }
    });  
  }
  
  if (nbVoiceChannelsPrivateBusy == nbVoiceChannelsPrivate){
    var i = 1
    var nameOfVoiceChannel = 'Privé ' + parseInt(nbVoiceChannelsPrivate+i)
    var nameOfTextChannel = 'privé-' + parseInt(nbVoiceChannelsPrivate+i) + "-no-mic"
    
    guild.channels.map(function(channel){
      if(channel.name == nameOfVoiceChannel || channel.name == nameOfTextChannel){
        i += 1
        nameOfVoiceChannel = 'Privé ' + parseInt(nbVoiceChannelsPrivate+i)
        nameOfTextChannel = 'privé-' + parseInt(nbVoiceChannelsPrivate+i) + "-no-mic"
      }
    });
    
    guild.createChannel(nameOfTextChannel, {
        type: 'text',
        permissionOverwrites: [{
          id: guild.id,
          deny: ['VIEW_CHANNEL'],
          allow: ['SEND_MESSAGES']
        }]
      })
    guild.createChannel(nameOfVoiceChannel, {
        type: 'voice',
      })
    
    await sleep(500)
    
    client.channels.find("name", nameOfVoiceChannel).setParent(mainParentChannel)
    client.channels.find("name", nameOfVoiceChannel).setUserLimit(3)
    client.channels.find("name", nameOfTextChannel).setParent(mainParentChannel)
    client.channels.find("name", nameOfTextChannel).setTopic("Canal textuel temporaire no-mic de " + nameOfVoiceChannel + ".")
  }
  
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel


  if(oldUserChannel === undefined && newUserChannel !== undefined) {
     //console.log("User joined " + newUserChannel.name)
     channelJoined(client, newUserChannel, newMember)
  } else if(newUserChannel === undefined){
     //console.log("User left " + oldUserChannel.name)
     channelLeft(client, oldUserChannel, oldMember)
  } else if (oldUserChannel && newUserChannel && oldUserChannel.id != newUserChannel.id) {
     //console.log("User moved from " + oldUserChannel.name + " to " + newUserChannel.name)
     channelJoined(client, newUserChannel, newMember)
     channelLeft(client, oldUserChannel, oldMember)
  }
}

async function deleteChannels(client, voiceChannelNameFormatted, channel){
  
  await sleep(500)
  
  channel.delete()
  client.channels.find("name", voiceChannelNameFormatted).delete()
}

function sleep(ms, msg){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function channelJoined(client, voiceChannel, user){

  var textChannelId
  //textChannelId = voiceToText[voiceChannel.id]
  
  var voiceChannelNameFormatted = voiceChannel.name.toLowerCase()
  voiceChannelNameFormatted = voiceChannelNameFormatted.replace(/ /gi, "-")  
  voiceChannelNameFormatted = voiceChannelNameFormatted + "-no-mic"
  
  textChannelId = client.channels.find("name", voiceChannelNameFormatted).id
  
  if(textChannelId) {
    client.channels.get(textChannelId).overwritePermissions(user, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: null
    })
    
    await sleep(500)
    
    var description = ""
    if(voiceChannel.name.slice(0,5) == "Privé" && voiceChannel.name.slice(0,7) != "Privé 1" && voiceChannel.name.slice(0,7) != "Privé 2"){
      description = "**__Attention :__** Ce salon est un salon `temporaire`. Il sera supprimé dès que plus aucun utilisateur n'y sera connecté et que sa présence ne sera plus requise.\n\n"
      description = description + "**Tous les messages seront donc perdus. Ne l'oubliez pas.**"
    }
    
    var counter = ""
    var nbUsers = voiceChannel.members.size
    var maxUsers = voiceChannel.userLimit
    if(maxUsers > 0 && nbUsers > 0){
      counter = "["+nbUsers+"/"+maxUsers+"] "
    }
    if(maxUsers > 0 && nbUsers >= maxUsers){
      description = description + "\nLe canal **" + voiceChannel.name + " **est complet !"
    }
    if(voiceChannel.userLimit > 0){
      maxUsers = voiceChannel.userLimit
    }
    client.channels.get(textChannelId).send(
      {
        embed: {
          title: ':speaker: ' + counter + user.displayName + '** a rejoint le canal audio.**',
          description: description,
          color: 0xffffff,
        }
      }
    )
  }
}

async function channelLeft(client, voiceChannel, user){
  
  var textChannelId
  //textChannelId = voiceToText[voiceChannel.id]
  
  var voiceChannelNameFormatted = voiceChannel.name.toLowerCase()
  voiceChannelNameFormatted = voiceChannelNameFormatted.replace(/ /gi, "-")  
  voiceChannelNameFormatted = voiceChannelNameFormatted + "-no-mic"
  
  textChannelId = client.channels.find("name", voiceChannelNameFormatted).id
  
  if(textChannelId) {
    client.channels.get(textChannelId).overwritePermissions(user, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: null
    })
    
    await sleep(500)
    
    var counter = ""
    var nbUsers = voiceChannel.members.size
    var maxUsers = voiceChannel.userLimit
    if(maxUsers > 0 && nbUsers > 0){
      counter = "["+nbUsers+"/"+maxUsers+"] "
    }
    client.channels.get(textChannelId).send(
      {
        embed: {
          title: ':mute: ' + counter + user.displayName + '** a quitté le canal audio.**',
          color: 0xffffff,
        }
      }
    )
  }
}