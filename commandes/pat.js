const Discord = require("discord.js");
const fs = require("fs")

module.exports.run = async (client, message, args) => {


  let mutedUser = message.mentions.users.firstKey()
  /*if(message.author.id != 220553711196438528){
  return
  }*/
  
  if(mutedUser != undefined){
    if(message.author.id == mutedUser){
      var title_detail = message.member.displayName+ " vient de se pat lui même."
    } else {
      var title_detail = message.member.displayName+ " vient de pat " + message.guild.member(mutedUser).displayName + "."
    }
  } else {
    var title_detail = message.member.displayName+ " vient de se pat lui même."
  }
  
  const bfile_name = "&next_linkhttps://cdn.weeb.sh/images/SkksgsnCW.gif&next_linkhttps://cdn.weeb.sh/images/HyWlxJFvb.gif&next_linkhttps://gifimage.net/wp-content/uploads/2017/07/head-pat-gif-5.gif&next_linkhttps://78.media.tumblr.com/e6713de4cab8a28711835b6a339928b4/tumblr_mp0yr2VHQQ1rvdjx0o4_500.gif&next_linkhttps://78.media.tumblr.com/c1462cd42efe9ad99de5674b3aeb722a/tumblr_ononzbfplN1uz6bnko1_500.gif&next_linkhttps://gifimage.net/wp-content/uploads/2017/09/anime-head-pat-gif.gif&next_linkhttp://pa1.narvii.com/6451/1123cea199f4a6f0134c9dfdfd97e8f0fabce777_hq.gif&next_linkhttps://78.media.tumblr.com/de08e19da2faabdc79e2dc9a6d853fff/tumblr_mgi01xyoAu1rfp5pbo2_500.gif&next_linkhttps://api.ning.com/files/IwLlOd3kUEdp9plQCpRalMlv-2vJtGkzXQ08q9gTutpzJxlks3mTEY9IgNsaHFVxM-GJUeaX1Try2zQoSN1UWGTkFBFr*2Vq/animepathead.gif&next_linkhttps://78.media.tumblr.com/e759f2da1f07de37832fc8269e99f1e7/tumblr_n3w02z954N1swm6rso1_500.gif&next_linkhttps://media.giphy.com/media/SHyuhBtRr8Zeo/giphy.gif&next_linkhttp://pa1.narvii.com/5742/e78781191996beba3103416ec7251e846188defb_hq.gif&next_linkhttp://i2.kym-cdn.com/photos/images/original/001/142/787/396.gif&next_linkhttps://media.giphy.com/media/IwDJf2h15R9te/giphy.gif"
  var file_name = bfile_name.split("&next_link")
  var author_avatar = client.users.get(message.author.id)
  if(author_avatar == undefined){author_avatar = ""}else {author_avatar = author_avatar.avatar}
  var min = 0;
  var max = file_name.length - 1;
  var choice = Math.round(Math.random() * (max - min) + min);
  var min = 0;
  var max = 16777215;
  var random_color = Math.round(Math.random() * (max - min) + min);
  var pat_img = file_name[choice]
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
      "url": pat_img
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

  return message.channel.send(embed)

}

module.exports.help = {
    name : "pat",
    type: "bot",
}
