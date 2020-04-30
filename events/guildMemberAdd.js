const Discord = require("discord.js");

module.exports = async (client, member) => {
  if(client.config.maintenance) return;
  
  if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(member.displayName)) {
    console.log(member.displayName + " est arrivé.")
    member.guild.members.get(member.user.id).setNickname("❌ Liens interdits ❌");
    return
  }
  
  //member.addRole('')
  
  var user = member.user.username;
  var server = member.guild.name;
  var count = member.guild.memberCount;
  var discriminator = member.user.discriminator;
  var bel = [
    "Bienvenue @ sur @server !",
    "Le serveur @server est heureux de t'accueillir, @ !",
    "C'est un plaisir de t'accueillir parmi nous, @.",
    "L'équipe d'administration de @server te souhaite bien le bonjour !",
    "Bien le bonjour @ ! Sur @server.",
  ]
  var welcome = bel[Math.floor(Math.random() * bel.length)];
  welcome = welcome.replace('@server', server)
  welcome = welcome.replace('@', user)
  welcome = welcome.replace('-', count)
  welcome = welcome.replace('$', discriminator)
  var description = "Nous sommes à présent " + count + " membres sur le serveur !\n\n Cela fait un beau chiffre, tu ne trouves pas ? En tout cas, nous sommes heureux de te compter parmi nous.\n\nNous te souhaitons, nous, l'équipe d'administration, une agréable navigation au sein de notre communauté."
  setTimeout(function() {
    let welcomeembed = new Discord.RichEmbed()
    .setColor(`RANDOM`)
    .setTitle("Bienvenue à " + user + " sur " + server)
    .setDescription(description)
    const logsChannel = client.channels.get("587298451067371530")
    logsChannel.send(welcomeembed)
    
    member.createDM().then(function (channel) {
      let embed = new Discord.RichEmbed()
        .setThumbnail(client.user.avatarURL) 
        .setColor(0xffffff)
        .setDescription("Bienvenue sur **Fortis - Colonia** !\n\nVous pouvez accéder au panneau du bot depuis le site https://colonia.glitch.me\n\nIl vous permettra de consulter les informations de votre pays ainsi que de nombreuses choses.\nSi vous tombez sur un bug, merci de bien vouloir vous tourner vers l'équipe d'administration ou bien l'équipe de développement.\n\nEn vous souhaitant un agréable temps de jeu parmi nous !")        
        .setFooter(`Fortis © 2019`, `${client.user.avatarURL}`)
      channel.send(`Bonjour **${user}** !`, embed);
      
      let welcomeembed = new Discord.RichEmbed()
        .setColor(`RANDOM`)
        .setTitle(welcome)
        .setDescription(description)
      //channel.send(welcomeembed)
    })
  },100)
  
  
  await client.destroy();
  await process.exit()
}