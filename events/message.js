var SpellChecker = require('simple-spellchecker');

async function reactHRP(msg){
    msg.react('🕐')
   await sleep(2000, msg)
    msg.react('🕒')
   await sleep(2000, msg)
    msg.react('🕕')
   await sleep(2000, msg)
    msg.react('🕘')
   await sleep(2000, msg)
    msg.react('🕛')
   await sleep(2000, msg)
}
function sleep(ms, msg){
    msg.reactions.forEach(function(reaction){
      reaction.remove()
    })
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


module.exports = async (client, msg, purge) => {
  if(client.config.maintenance) return;
  
  if (msg.attachments.size > 0) {
    if (msg.attachments.every(attachIsImage)){
        msg.react('🖼')
        msg.react('👍')
        msg.react('👎')
    }
  }

  function attachIsImage(msgAttach) {
      var url = msgAttach.url;
      //True if this url is a png image.
      return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
  }
  
  if(msg.isMemberMentioned(client.user)){
    msg.react('👋')
    msg.react('614258288065773568')
  }
  
  //client.emit('checkMessage', msg)
  if(msg.content.slice(0,1) == "[" || msg.content.slice(0,1) == "(" || msg.content.slice(0,1) == "/" && msg.channel.parent.name.slice(0,10) != "=====  HRP") {
    if(msg.content.length < 10){
      reactHRP(msg)
      msg.delete(12000)
    } else if (msg.content.length > 9){
      msg.react('❌')
    }
  }
  
  var isLink = false;
  if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(msg)) {
    isLink = true;
    if(msg.content.match(/^.*(youtu.be\/|v=)([^#\&\?]*).*/)){
      msg.react("▶")
    }
    if (msg.content.includes('discord.gg/') || msg.content.includes('discordapp.com/invite/') || msg.content.includes('discord.me/')) { //if it contains an invite link
      if (msg.member.roles.find('name', 'Staff')) {
        msg.react("✅")
        msg.react("🌐")
        return
      }
      msg.delete() //delete the message
        .then(
            msg.channel.send(
              {
                embed: {
                  title: ':warning: '+msg.author.username+' ! **Les liens d\'invitation discord ne sont pas autorisés.**',
                  color: 0xffffff,
                }
              }
            )
          )
    } else {
      /*msg.react("✅")
      msg.react("🌐")*/
    }
  }
  if(msg.author.bot &&
     msg.content.slice(client.config.BOT_PREFIX.length,6) != "music" &&
     msg.content.slice(client.config.BOT_PREFIX.length,8) != "message" &&
     msg.content.slice(client.config.BOT_PREFIX.length,8) != "command") return;
  if(msg.channel.type === "dm") return;
  
  if (!msg.content.startsWith(client.config.BOT_PREFIX)) {
    /*var words = msg.content.match(/[a-zA-ZÀ-ú]+/g)
    var corrected = ""
    var was_false = false;
    if(words){
      await SpellChecker.getDictionary("fr-FR", function(err, dictionary) {
        for (let i = 0; i < words.length; i++) {
          var word = words[i]
              if(!err && word.charAt(0) != word.charAt(0).toUpperCase()) {
                  var misspelled = ! dictionary.spellCheck(word);
                  if(misspelled) {
                    var suggestions = dictionary.getSuggestions(word);
                    if(suggestions[0] != undefined){
                      was_false = true
                      corrected = corrected+" ~~"+word+"~~ (*"+suggestions[0]+"/"+suggestions[1]+"/"+suggestions[2]+"*)"
                    }
                  } else {
                    corrected = corrected+" "+word
                  }
              } else {
                corrected = corrected+" "+word
              }
        }
        if(corrected.replace(/ /gi, "") != "" && was_false){
          //msg.react("619243311370207293")
          client.channels.get("614929573636734976").send(
            "**Suggestion: **"+corrected
          )
        }
      });
    }*/
    return;
  }
  
  //msg.delete()
  let args = msg.content.slice(client.config.BOT_PREFIX).trim().split(/ +/g)
  let cmd = args.shift().slice(1).toLowerCase()
  let commande = client.commands.get(cmd);
  if(commande) commande.run(client, msg, args);
  if(purge == undefined || purge == true){
    msg.delete(500)
  }
}

