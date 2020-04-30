const Discord = require("discord.js");

module.exports.run = async (client, msg) => {

    let embed = new Discord.RichEmbed()
	.setThumbnail(client.user.avatarURL) 
	.setColor(0xffffff)
	.setDescription("Bienvenue dans la bêta de **Fortis - Colonia**.\n\nVous pouvez accéder au panneau du bot depuis le site https://colonia.glitch.me\n\nIl vous permettra de consulter les informations de votre pays ainsi que de nombreuses choses.\nSi vous tombez sur un bug, merci de bien vouloir vous tourner vers l'équipe d'administration ou bien l'équipe de développement.\n\nEn vous souhaitant un agréable temps de jeu parmi nous !")        
	.setFooter(`Fortis © 2019`, `${client.user.avatarURL}`)
                 
     msg.channel.send(`Bonjour **${msg.author.username}** !`, embed);
    
}

module.exports.help = {
    name : "help",
    type: "bot",
}
