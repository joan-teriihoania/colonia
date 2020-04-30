const Roll = require('roll')
const fs = require('fs')
var roll = new Roll()

module.exports.run = async (client, message, args) => {
  
    let userRoll = args[0]

  // Validation du roll
  var valid = roll.validate(userRoll)

  if (valid) {
    // Roll
    var dice = roll.roll(userRoll)
    var bonus_malus = parseInt(dice.calculations[0]) - parseInt(dice.calculations[1]) 
    var rollResult = dice.result
    
    let separators = ['d', '\\\+', '-', '\\*', '/']
    let tokens = userRoll.split(new RegExp(separators.join('|'), 'g'))
    let size = 100
    if (tokens[0] == '') size = tokens[1]
    if (tokens[0] != '') size = tokens[0] * tokens[1]
    
    // Couleur par défaut du message
    let embedColor = 7506394
    // Changement de couleur selon le roll
    if (rollResult <= 0) {
     embedColor = 16312092 // RCU - Doré - Réussite Critique Ultime
      if(bonus_malus > -45) {}
    } else
    if (rollResult <= size * 0.1 && rollResult > 0) {
      embedColor = 4387906 // RC - Vert - Reussite Critique
    } else
    if (rollResult <= size * 0.5 && rollResult > size * 0.1) {
      embedColor = 4342516 // Réussite - Bleu
    } else
    if (rollResult <= size * 0.9 && dice.result > size * 0.5) {
      embedColor = 16030530 // Échec - Orange
    } else
    if (rollResult > size * 0.9 && rollResult <= size * 1) {
      embedColor = 16007746 // EC - Rouge - Échec Critique
    } else
    if (rollResult > size * 1) {
      embedColor = 1 //ECU - Rouge foncé - Échec Critique Ultime
      if(bonus_malus < 45) {}
    }
    
    

    if(message.channel.parent.name.substr(0,2) != "RP") {
      var count_info = "Non-comptabilisé"
    } else {
    }
    var count_info = "Non-comptabilisé"
    
    // Envoi du message
    message.channel.send(
      {
        embed: {
          title: message.member.displayName + ' a roll ' + userRoll + '.',
          description: 'Le résultat est de **' + rollResult + '**.',
          color: embedColor,
          footer: {
            text: count_info + ' - (' + dice.rolled + ')'
          }
        }
      }
    )

    return
  } else

  if (!valid || userRoll === undefined) {
    // Fonction servant à supprimer les messages inutiles
    function deleteInvalidRoll () {
      message.delete()
      client.user.lastMessage.delete()
    }

    message.channel.send(
      {
        embed: {
          title: "Le roll que vous avez entré n'est pas valide.",
          color: 16007746,
        }
      }
    )

    // Timeout de 5 secondes avant la suppression des messages
    setTimeout(deleteInvalidRoll, 5000)

    return
  }
}



module.exports.help = {
    name : "roll",
    type: "bot",
}