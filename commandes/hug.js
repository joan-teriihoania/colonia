const Discord = require("discord.js");
const fs = require("fs")

module.exports.run = async (client, message, args) => {
  let mutedUser = message.mentions.users.firstKey()
  /*if(message.author.id != 220553711196438528){
  return
  }*/
  
  if(mutedUser != undefined){
    if(message.author.id == mutedUser){
      var title_detail = message.member.displayName+ " vient de se hug lui même."
    } else {
      var title_detail = message.member.displayName+ " vient de hug " + message.guild.member(mutedUser).displayName + "."
    }
  } else {
    var title_detail = message.member.displayName+ " vient de se hug lui même."
  }
  
  const bfile_name = "&next_linkhttps://media.giphy.com/media/yziFo5qYAOgY8/giphy.gif&next_linkhttps://media.giphy.com/media/NI4FNMb4tJEYM/giphy.gif&next_linkhttp://media0.giphy.com/media/KL7xA3fLx7bna/giphy.gif&next_linkhttp://media.giphy.com/media/VGACXbkf0AeGs/giphy.gif&next_linkhttp://media.giphy.com/media/Y6uhhPPB5DYT6/giphy.gif&next_linkhttps://media.tenor.com/images/1171c186f9130d1efa4a186ad4371e8c/tenor.gif&next_linkhttps://2.bp.blogspot.com/-XPqck-C979s/V-QbRIOoqbI/AAAAAAAADzM/seUBJKyKCiQ5W2kScB627WjcKU5Pq1VKwCLcB/s1600/chuunibyou.gif&next_linkhttp://media.giphy.com/media/s31WaGPAmTP1e/giphy.gif&next_linkhttps://media.giphy.com/media/a5s3dI6Wv1Qcw/giphy.gif&next_linkhttps://media.tenor.com/images/121e9bbb97d61227e2b86db23f0f2e4a/tenor.gif&next_linkhttp://pa1.narvii.com/6163/70da58a93c7023161ae16752f0d428539fa7e167_hq.gif&next_linkhttps://pin.it/e7scjyuoubeod7.gif"
  var file_name = bfile_name.split("&next_link")
  var author_avatar = client.users.get(message.author.id)
  if(author_avatar == undefined){author_avatar = ""}else {author_avatar = author_avatar.avatar}
  var min = 0;
  var max = file_name.length - 1;
  var choice = Math.round(Math.random() * (max - min) + min);
  var min = 0;
  var max = 16777215;
  var random_color = Math.round(Math.random() * (max - min) + min);
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
    name : "hug",
    type: "bot",
}
