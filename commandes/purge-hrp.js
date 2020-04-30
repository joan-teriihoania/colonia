const Discord = require("discord.js");
const util = require("util");

module.exports.run = async(client, message, args) => {
  const logsChannel = client.channels.get("690577768961802260")
  if(!message.guild.members.get(message.author.id).roles.find('name', 'Staff') && message.author.id != 220553711196438528 ) {
    return message.channel.send(
      {
        embed: {
          title: ":x: **Vous ne disposez pas des droits nécessaires pour utiliser cette commande.**",
          color: 0xffffff,
        }
      }
    )
  }
  /*if (message.author.id != 220553711196438528) {
    return message.channel.send('Cette commande a été désactivée par l\'administrateur.')
  }*/
  

    const user = message.mentions.users.first();
    var amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
    if (!amount && !user) {
      return message.channel.send(
        {
          embed: {
            title: ":robot: **Vous devez spécifier un nombre de message à supprimer et/ou un utilisateur à cibler.**",
            color: 0xffffff,
          }
        }
      )
    }
    amount = amount + 1;
    message.channel.fetchMessages({	
      limit: amount,
    }).then((messages) => {
      if (user) {
        const filterBy = user ? user.id : client.user.id;
        messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
      }
      var cut_back;
      var output_hrp_purge = "";
      var output_hrp_purge_array = []
      messages.forEach(function(f_message){
        var l_message = new String(f_message);
        cut_back = l_message.substr(0, 1);

        if(cut_back === '(' || cut_back === "[" || cut_back === "/"){
          output_hrp_purge = /*"[" + f_message.createdAt + "] (" + f_message.channel.name + ")*/"[" + f_message.author.username + "] " + l_message + "\n" + output_hrp_purge;
          
					//output_hrp_purge_array.push("[" + f_message.createdAt + "] (" + f_message.channel.name + ")[" + f_message.author.username + "] " + l_message);
          f_message.delete();
        }


      });
      //console.log(output_hrp_purge_array)
      for (var i in output_hrp_purge_array)
        {
			    //client.channels.get("420857331858014208").send("```Markdown\n" + output_hrp_purge_array[i].slice(0,1950) + "```")
        } 
      var content = "**Purge HRP lancée par <@"+message.author.id+"> dans "+message.channel.toString()+"**\n\n"+output_hrp_purge
      channelSend(logsChannel, client, content, "description")
    });
    
    
    message.delete();
    return}  
  
  

module.exports.help = {
    name : "purge-hrp",
    type: "bot",
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