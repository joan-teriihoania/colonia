const Discord = require("discord.js");

module.exports = async (client, member) => {
  if(client.config.maintenance) return;
  
  await client.destroy();
  await process.exit()
}