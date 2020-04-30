const Discord = require("discord.js");
const fs = require("fs")

module.exports.run = async (client, message, args) => {
  let mutedUser = message.mentions.users.firstKey()
  /*if(message.author.id != 220553711196438528){
  return
  }*/
  
  if(mutedUser != undefined){
    if(message.author.id == mutedUser){
      var title_detail = message.member.displayName+ " vient de s'exploser lui même."
    } else {
      var title_detail = message.member.displayName+ " vient d'exploser " + message.guild.member(mutedUser).displayName + "."
    }
  } else {
    var title_detail = message.member.displayName+ " vient de s'exploser lui même."
  }
  
  var author_avatar = client.users.get(message.author.id)
  if(author_avatar == undefined){author_avatar = ""}else {author_avatar = author_avatar.avatar}
  var min = 0;
  var max = 16777215;
  var random_color = Math.round(Math.random() * (max - min) + min);
  const bfile_name = "https://thumbs.gfycat.com/ShockedScentedLeafwing-size_restricted.gif&next_linkhttps://thumbs.gfycat.com/SoulfulAlarmingBumblebee-size_restricted.gif&next_linkhttps://thumbs.gfycat.com/UnhappyFirsthandBlackfly-size_restricted.gif&next_linkhttps://vignette.wikia.nocookie.net/supernatural/images/a/aa/HeavenSmites.gif"
  var file_name = bfile_name.split("&next_link")
  var min = 0;
  var max = file_name.length - 1;
  var choice = Math.round(Math.random() * (max - min) + min);
  var hug_img = file_name[choice]
  var embed = (
    {
      embed: {
        title: "",
        description: "",
        color: random_color,
        footer: {
          text: ''
        },
    "image": {
      "url": hug_img
    },
    "author": {
      "name": title_detail,
      "url": "",
      "icon_url": 'https://cdn.discordapp.com/avatars/'+message.author.id+'/'+author_avatar+'.jpg?size=1024'
    }
        /*fields: [
          {
            "name": "Erreur de syntaxe :",
            "value": "",
            "inline": true
          }
        ]*/
      }
    }
  )
console.log(random_color + " - " + hug_img + " by " + message.member.displayName)
  return message.channel.send(embed)


}

module.exports.help = {
    name : "explosion",
    type: "bot",
}
