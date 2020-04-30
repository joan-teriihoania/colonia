const Discord = require("discord.js");
const util = require("util");

module.exports.run = async(client, msg) => {

    let code = msg.content.split(" ").slice(1);

    if(msg.author.id != client.config.BOT_OWNER_ID) {
      return msg.channel.send(
        {
          embed: {
            title: ":x: **Vous ne disposez pas des droits nécessaires pour utiliser cette commande.**",
            color: 0xffffff,
          }
        }
      )
    }
        try {
            let ev = eval(code);
            let str = util.inspect(ev, {
                depth: 1
            });

            str = `${str.replace(new RegExp(`${client.token}`, "g"), "token")}`;

            if(str.length > 1900) {
                str = str.substr(0, 1900);
                str = str + "...";
            }
          
            msg.channel.send(
              {
                embed: {
                  title: `✅ Evaluation réussi`,
                  description: `\`\`\`JS\n${str}\`\`\``,
                  color: 0xffffff,
                }
              }
            )
        } catch (err) {
            msg.channel.send(
              {
                embed: {
                  title: `❌ Evaluation échoué:`,
                  description: `\`\`\`JS\n${err}\`\`\``,
                  color: 0xffffff,
                }
              }
            )
        }
}


module.exports.help = {
    name : "eval",
    type: "Owner",
}
