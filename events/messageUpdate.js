module.exports = async (client, oldMessage, newMessage) => {
  newMessage.reactions.forEach(reaction => reaction.remove(client.user.id))
  client.emit('message', newMessage);
}

