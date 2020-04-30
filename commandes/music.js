const Util = require("discord.js");
const Discord = require("discord.js");
const util = require("util");

const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const queue = new Map();

const io = require('../index.js')

module.exports.run = async(client, msg, args) => {
  
  const youtube = new YouTube(client.config.GOOGLE_API_KEY);
  const searchString = args.slice(1).join(' ');
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(msg.guild.id);
  let command = msg.content.toLowerCase().split(' ')[1];
  
  if(command == "play"){
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Vous devez être connecté à un canal vocal.**");
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT')) {
      return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Je peux pas rejoindre le canal vocal `" + voiceChannel.name + "`**");
    }
    if (!permissions.has('SPEAK')) {
      return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Je ne peux pas parler dans le canal vocal `" + voiceChannel.name + "`**");
    }

    //if (url.match(/^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:playlist|list)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/)) {
    if (url.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/) || url == "RANDOM" || url == "VEXENTO") {
      var newUrl = url
      if(url == "RANDOM"){
        var newUrl = "https://www.youtube.com/watch?v=c1y45rUMJfM&list=RDMMc1y45rUMJfM&start_radio=1"
      } else if(url == "VEXENTO"){
        var newUrl = "https://www.youtube.com/watch?v=qhD3jKUXlGU&list=PLylWdFkOSDhaDCcDVZvi85oup7I6Xn8Rd"
      }
      const playlist = await youtube.getPlaylist(newUrl);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(client, video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      io.emit('notif', "La playlist "+playlist.title+" a été ajoutée à la liste d'attente.")
      return channelSend(msg.channel, client, `✅ **La playlist \`${playlist.title}\` a été ajoutée à la liste d'attente.**`);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;
          if(Object.size(videos) < 1){
            channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Je n'ai trouvé aucun résultat.**")
          } else {
            var similarity = false
            var index_similarity = 0
            for(var i = Object.size(videos);i--;){
              if(similar(videos[i].title, searchString)>0.8){
                similarity = true
                index_similarity = i
              }
            }
            
            if(similarity){
              var video = await youtube.getVideoByID(videos[index_similarity].id);
            } else {
              channelSend(msg.channel, client, `
                __**Choisissez une musique:**__
                ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
                \nVeuillez entrer une valeur pour sélectionner l'un des résultats de recherche de 1 à 10.
              `);
            }
          }
          // eslint-disable-next-line max-depth
          if(!similarity){
            try {
              var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                maxMatches: 1,
                time: 10000,
                errors: ['time']
              });
            } catch (err) {
              console.error(err);
              return channelSend(msg.channel, client, ':x: '+msg.author.username+' ! **Aucune ou valeur invalide entrée. La sélection a donc été annulée.**');
            }
            const videoIndex = parseInt(response.first().content);
            var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
          }
        } catch (err) {
          console.error(err);
          return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Je n'ai trouvé aucun résultat.**");
        }
      }
      return handleVideo(client, video, msg, voiceChannel);
    }
  } else if(command == "skip"){
    if (!msg.member.voiceChannel) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Vous devez être connecté à un canal vocal.**");
    if (msg.member.voiceChannel != client.guilds.get(msg.guild.id).voiceConnection.channel) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Vous devez être connecté au même canal vocal que moi.**");
    if (!serverQueue) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Il n'y a aucune musique en lecture à passer.**");
    serverQueue.connection.dispatcher.end('Skip command has been used!');
    return undefined;  
  } else if(command == "stop"){
    if (!msg.member.voiceChannel) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Vous devez être connecté à un canal vocal.**");
    if (msg.member.voiceChannel != client.guilds.get(msg.guild.id).voiceConnection.channel) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Vous devez être connecté au même canal vocal que moi.**");
    if (!serverQueue) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Il n'y a aucune musique en lecture à arrêter.**");
    io.emit('music', 'command', 'stop')
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end('Stop command has been used!');
    return undefined;
  } else if(command == "volume"){
    if (!msg.member.voiceChannel) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Vous devez être connecté à un canal vocal.**");
    if (msg.member.voiceChannel != client.guilds.get(msg.guild.id).voiceConnection.channel) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Vous devez être connecté au même canal vocal que moi.**");
    if (!serverQueue) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Il n'y a aucune musique en lecture.**");
    if (!args[1]) return channelSend(msg.channel, client, `**Le volume actuel est de : \`${serverQueue.volume}\`**`);
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return channelSend(msg.channel, client, `I set the volume to: **${args[1]}**`);
  } else if(command == "np"){
    if (!serverQueue) return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Il n'y a aucune musique en lecture.**");
    return channelSend(msg.channel, client, `🎶 **Musique en cours : \`${serverQueue.songs[0].title}\`**`);
  } else if(command == "queue"){
    if (!serverQueue) {
      io.emit('music', 'command', 'stop')
      return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Il n'y a aucune musique en lecture.**");
    }
    
    io.emit('music', 'title', serverQueue.songs[0].title)
    io.emit('music', 'img', serverQueue.songs[0].img)
    io.emit('music', 'link', serverQueue.songs[0].url)
    io.emit('music', 'author_img', serverQueue.songs[0].author.img)
    io.emit('music', 'author_title', serverQueue.songs[0].author.title)
    if(serverQueue.songs[1]){
      io.emit('music', 'next', serverQueue.songs[1].title)
    } else {
      io.emit('music', 'next', undefined)
    }
    return channelSend(msg.channel, client, `
      __**Liste d'attente:**__
      ${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
      \n**Musique en cours :** \`${serverQueue.songs[0].title}\`
    `, "description");
  } else if(command == "reload"){
    if (!serverQueue) {
      return io.emit('music', 'command', 'stop')
    }
    
    io.emit('music', 'title', serverQueue.songs[0].title)
    io.emit('music', 'img', serverQueue.songs[0].img)
    io.emit('music', 'link', serverQueue.songs[0].url)
    io.emit('music', 'author_img', serverQueue.songs[0].author.img)
    io.emit('music', 'author_title', serverQueue.songs[0].author.title)
    if(serverQueue.songs[1]){
      io.emit('music', 'next', serverQueue.songs[1].title)
    } else {
      io.emit('music', 'next', undefined)
    }
    return
  } else if(command == "pause"){
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      io.emit('music', 'command', 'pause')
      return channelSend(msg.channel, client, "⏸ "+msg.author.username+" ! **La musique a été mis en pause.**");
    }
    return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Il n'y a aucune musique en lecture.**");
  } else if(command == "resume"){
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      io.emit('music', 'command', 'resume')
      return channelSend(msg.channel, client, "▶ "+msg.author.username+" ! **La musique a été reprise.**");
    }
    return channelSend(msg.channel, client, ":x: "+msg.author.username+" ! **Il n'y a aucune musique en lecture.**");
  }
  
  return undefined
}


module.exports.help = {
    name : "music",
    type: "bot",
}

async function handleVideo(client, video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);
  var videoChannel = await video.channel.fetch()
  const song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    img: video.thumbnails.default.url,
    author: {
      img: video.channel.thumbnails.default.url,
      title: video.channel.title,
      url: video.channel.url
    }
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(msg, msg.guild, queueConstruct.songs[0], client);
    } catch (error) {
      console.error(`I could not join the voice channel: ${error}`);
      queue.delete(msg.guild.id);
      return channelSend(msg.channel, client, `:x: **Je n'ai pas pu rejoindre le canal vocal \`${voiceChannel.name}\` :** \`\`\`${error}\`\`\``);
    }
  } else {
    serverQueue.songs.push(song);
    //console.log(serverQueue.songs);
    if (playlist) return undefined;
    else {
      io.emit('notif', "La musique "+song.title+" a été ajouté à la liste d'attente.")
      return channelSend(msg.channel, client, `✅ **\`${song.title}\` a été ajouté à la liste d'attente!**`);
    }
  }
  return undefined;
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


async function play(msg, guild, song, client) {
  const youtube = new YouTube(client.config.GOOGLE_API_KEY);
  const serverQueue = queue.get(guild.id);
  
  if (!song) {
    //channelSend(msg.channel, client, ":leftwards_arrow_with_hook: **Mode autoplay activé.**")
    /*var video = await youtube.getVideo('https://www.youtube.com/watch?v=3ZOxqEpJdS0')
    song = {
      id: video.id,
      title: Util.escapeMarkdown(video.title),
      url: `https://www.youtube.com/watch?v=${video.id}`
    }*/
    
    //sleep(2000, msg, client)    
    
    /*var url = "https://www.youtube.com/watch?v=c1y45rUMJfM&list=RDMMc1y45rUMJfM&start_radio=1"
    const playlist = await youtube.getPlaylist(url);
    const videos = await playlist.getVideos();
    for (const video of Object.values(videos)) {
      //console.log(video.id + ": " + video.title + " ("+video.url+")")
      const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
      await handleVideo(client, video2, msg, serverQueue.voiceChannel, true); // eslint-disable-line no-await-in-loop
    }
    
    return*/
    io.emit('music', 'stop')
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
  }
  //console.log(serverQueue.songs);

  if(song){
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
      .on('end', reason => {
        if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
        else console.log(reason);
        serverQueue.songs.shift();
        play(msg, guild, serverQueue.songs[0], client);
      })
      .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    io.emit('music', 'title', song.title)
    io.emit('music', 'img', song.img)
    io.emit('music', 'link', song.url)
    io.emit('music', 'author_img', song.author.img)
    io.emit('music', 'author_title', song.author.title)
    if(serverQueue.songs[1]){
      io.emit('music', 'next', serverQueue.songs[1].title)
    } else {
      io.emit('music', 'next', undefined)
    }
    channelSend(serverQueue.textChannel, client, `🎶 **Musique en cours : \`${song.title}\`**`);
  }

}

function sleep(ms, msg, client){
    msg.channel.send(client.config.BOT_PREFIX + "music play RANDOM")
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function similar(a,b) {
    var lengthA = a.length;
    var lengthB = b.length;
    var equivalency = 0;
    var minLength = (a.length > b.length) ? b.length : a.length;    
    var maxLength = (a.length < b.length) ? b.length : a.length;    
    for(var i = 0; i < minLength; i++) {
        if(a[i] == b[i]) {
            equivalency++;
        }
    }


    var weight = equivalency / maxLength;
    return (weight * 100);
}