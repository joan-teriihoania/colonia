var sqlite3 = require('sqlite3').verbose()
const { registerFont, createCanvas, loadImage } = require('canvas')
registerFont('spacemono.ttf', { family: 'Space Mono' })
registerFont('firamono.ttf', { family: 'Fira Mono' })
const Discord = require("discord.js");
var notifCanvasUsed = false;

module.exports.run = async (client, msg, args) => {
  notifCanvasUsed = false;
  var db = new sqlite3.Database(client.config.DB_FILE);
  var characterSurname = args.join(" ")
  if(characterSurname == "" || characterSurname == undefined){
    return channelSend(msg.channel, client, ":x: **Vous devez spécifier le prénom d'un personnage.**")
  }
  db.get('SELECT COUNT(*) AS characterExist from characters WHERE surname LIKE \'%'+characterSurname+'%\'', function(err, characterExist) {
    if (characterExist) {
      if(characterExist["characterExist"] > 0){
        displayImage(msg, characterSurname, db)
      } else {
        return channelSend(msg.channel, client, ":frowning: **Le personnage `"+characterSurname+"` n'existe pas.**")
      }
    }
  })
}

module.exports.help = {
    name : "profile",
    type: "bot",
}


function infoIDFunction(ctx, height, text, content, textColor){
  ctx.fillStyle = '#fff'
  ctx.fillText(text, 290, height)
  var widthIDinfoLabel = ctx.measureText(text).width
  
  ctx.fillStyle = textColor
  if(content == ""){
    content = "-"
  }
  ctx.fillText(content, parseInt(290+widthIDinfoLabel), height)
  height += 14
  return height
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

/**
 * Draws a rounded rectangle using the current state of the canvas. 
 * If you omit the last three params, it will draw a rectangle 
 * outline with a 5 pixel border radius 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate 
 * @param {Number} width The width of the rectangle 
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke, styled) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof styled == "undefined" ) {
    styled = false;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  if(styled == false) ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  if(styled == false) ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
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


function displayImage(msg, characterSurname, db){
  msg.channel.startTyping()
  var canvasHeight = 529
  var canvasWidth = 1000
  loadImage('http://nickbarone3d.weebly.com/uploads/1/2/3/4/12344323/8887796_orig.png').then((background) => {
    //loadImage('https://fenterprise.000webhostapp.com/assets/img/logo.png').then((logo) => {
    loadImage('https://cdn.discordapp.com/icons/662343913574629388/8e219fb37e6c92f216d76952045f4520.png').then((logo) => {
      var noProfileImage = "http://pixsector.com/cache/94bed8d5/av3cbfdc7ee86dab9a41d.png"
      db.get('SELECT * from characters WHERE surname LIKE \'%'+characterSurname+'%\' LIMIT 1', function(err, char) {
        if (char) {
          var profileImageURL = ""
          if(checkURL(char.image)){
            profileImageURL = char.image
          } else {
            profileImageURL = noProfileImage
          }
        } else {
          profileImageURL = noProfileImage
        }
        
        loadImage(profileImageURL).then((profileImage) => {
          const canvas = createCanvas(canvasWidth, canvasHeight)
          const ctx = canvas.getContext('2d')


          //Apply the background image
          ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)
          ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
          //Darken the background image
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);

          //Add the Fortis logo
          ctx.drawImage(logo, 20, 20, 125, 100)
          ctx.fillStyle = '#fff'
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = "3"
          roundRect(ctx, 10, 10, 145, 120, 5, false, true)
          ctx.lineWidth = "1"
          
          //Draw console border
          ctx.lineWidth = "3"
          roundRect(ctx, 10, 135, 500, parseInt(canvasHeight-150), 5, false, true)
          ctx.lineWidth = "1"
          roundRect(ctx, 10, 135, 500, 20, 5, true, true)
          ctx.font = 'bold 15px "Space Mono"'
          ctx.fillStyle = "#000"
          ctx.textAlign = "center"
          ctx.fillText("Command prompt", 260, 150)
          ctx.textAlign = "start"
          
          ctx.font = '10px "Fira Mono"'
          ctx.fillStyle = "#fff"
          var commandPromptHeightLine = 170
          commandPromptHeightLine = commandPrompt(ctx, "Accessing database.............", '#fff', commandPromptHeightLine, true)
          commandPromptHeightLine = commandPrompt(ctx, "Retrieving profile data........", '#fff', commandPromptHeightLine, true)
          commandPromptHeightLine = commandPrompt(ctx, "Retrieving reports data........", '#fff', commandPromptHeightLine, true)
          commandPromptHeightLine = commandPrompt(ctx, "Retrieving relation data.......", '#fff', commandPromptHeightLine, true)
          commandPromptHeightLine = commandPrompt(ctx, "Retrieving social data.........", '#fff', commandPromptHeightLine, true)
          commandPromptHeightLine = commandPrompt(ctx, "Compiling data........................", '#fff', commandPromptHeightLine, true)
          commandPromptHeightLine = commandPrompt(ctx, "Calculating profile pattern.....", '#fff', commandPromptHeightLine, true)
          commandPromptHeightLine = commandPrompt(ctx, "Calculating behavior pattern....", '#fff', commandPromptHeightLine, true)
          var profileImageCanvasSize = 0
          if(profileImage.height <= profileImage.width){
            profileImageCanvasSize = profileImage.height
          } else {
            profileImageCanvasSize = profileImage.width
          }

          ctx.fillStyle = "rgba(255, 250, 250, 0.6)"
          ctx.fillRect(170, 20, 100, 100)
          ctx.drawImage(profileImage,
          0, 0,   // Start at 10 pixels from the left and the top of the image (crop),
          profileImageCanvasSize, profileImageCanvasSize,   // "Get" a `80 * 30` (w * h) area from the source image (crop),
          170, 20,     // Place the result at 0, 0 in the canvas,
          100, 100); // With as width / height: 160 * 60 (scale)

          //Add name of character
          var textColor = "#eb4034"
          var errorColor = "#fc633d"
          
          if(profileImageURL == noProfileImage){
            notifCanvas(ctx, "ERROR", "Profile image is not reachable, corrupted, invalid or is not extractable.", "Try another image link", canvasHeight, canvasWidth, errorColor, "#c41212", "#fff")
          }



          var statusColorMap = {
            "STABLE":"#32a852",
            "INJURED": "#c97900",
            "DECEASED": "#404040",
            "MISSING": "#b8b8b8"
          };

          var statusColor = "#32a852"

          if(statusColorMap[char.status]) {
            statusColor = statusColorMap[char.status];
          }
          
          ctx.font = '12px "Space Mono"'
          var heightinfoIDFunction = 30
          heightinfoIDFunction = infoIDFunction(ctx, heightinfoIDFunction, "Name: ", char.name, textColor)
          heightinfoIDFunction = infoIDFunction(ctx, heightinfoIDFunction, "Surname: ", char.surname, textColor)
          heightinfoIDFunction = infoIDFunction(ctx, heightinfoIDFunction, "Age: ", char.age + " ans", textColor)
          heightinfoIDFunction = infoIDFunction(ctx, heightinfoIDFunction, "Sexe: ", char.sexe, textColor)
          heightinfoIDFunction = infoIDFunction(ctx, heightinfoIDFunction, "Height: ", char.height, textColor)
          heightinfoIDFunction = infoIDFunction(ctx, heightinfoIDFunction, "Weight: ", char.weight, textColor)
          heightinfoIDFunction = infoIDFunction(ctx, heightinfoIDFunction, "Status: ", char.status, statusColor)

          ctx.fillStyle = '#fff'
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = "3"
          roundRect(ctx, 160, 10, parseInt(canvasWidth-170), 120, 5, false, true)
          ctx.lineWidth = "1"

          ctx.fillStyle = textColor
          roundRect(ctx, parseInt(canvasWidth-125), 15, 110, 110, 5, false, true)


          var gradeColorMap = {
            "Biologiste":"#32a852",
            "Soldat": "#9c0008",
            "Médecin": "#2a59d1",
            "Commandant": "#fcd238"
          };

          var colorGrade = "#fff"

          if(gradeColorMap[char.grade]) {
            colorGrade = gradeColorMap[char.grade];
          }

          // Rond coin haut droite (rang)
          
          ctx.beginPath()
          ctx.fillStyle = "#fff"
          ctx.arc(parseInt(canvasWidth-125+55), 70, 30, 0, Math.PI*1.5, false)
          ctx.fill()
          ctx.closePath()
          
          ctx.beginPath()
          ctx.fillStyle = "#000"
          ctx.arc(parseInt(canvasWidth-125+55), 70, 25, 0, Math.PI*2, false)
          ctx.fill()
          ctx.closePath()
          
          // Rond intérieur en couleur +20px
          ctx.beginPath()
          ctx.fillStyle = colorGrade
          ctx.arc(parseInt(canvasWidth-125+55), 70, 10, 0, Math.PI*2, false)
          ctx.fill()
          
          ctx.closePath()

          if(char.status == "DECEASED"){
            notifCanvas(ctx, "DECEASED", characterSurname + " is deceased.", "Profile closed", canvasHeight, canvasWidth, "#6e6e6e", "#404040", "#fff")
          }
          if(char.status == "MISSING"){
            notifCanvas(ctx, "MISSING", characterSurname + " is missing.", "Investigating...", canvasHeight, canvasWidth, "#3c79cf", "#194480", "#fff")
          }
          if(char.status == "HIGH THREAT"){
            notifCanvas(ctx, "HIGH THREAT", "This person is a HIGH THREAT target.", "Neutralization and elimination allowed", canvasHeight, canvasWidth, errorColor, "#c41212", "#fff")
          }

          //Sending image to discord channel
          msg.channel.send("", {
            file: canvas.toBuffer('image/png', { quality: 1 })
          })
          msg.channel.stopTyping()
        })
      })
    })
  })
    
}


function notifCanvas(ctx, title, content, secondContent, canvasHeight, canvasWidth, bgColor, borderColor, fontColor){
  if(notifCanvasUsed){
    return
  }
  notifCanvasUsed = true
  var errorCanvasNoProfileImageHeight = parseInt(canvasHeight /5)
  var errorCanvasNoProfileImageMaxWidth = parseInt(canvasWidth / 3)
  var errorCanvasNoProfileImageMinWidth = parseInt(canvasWidth / 6)
  
  ctx.font = "bold 15px 'Fira Mono'"
  /*if(ctx.measureText(content).width <= errorCanvasNoProfileImageMaxWidth && ctx.measureText(content).width >= errorCanvasNoProfileImageMinWidth){
    var errorCanvasNoProfileImageWidth = ctx.measureText(content).width
  } else if (ctx.measureText(content).width > errorCanvasNoProfileImageMaxWidth){
    var errorCanvasNoProfileImageWidth = errorCanvasNoProfileImageMaxWidth
  } else if (ctx.measureText(content).width < errorCanvasNoProfileImageMinWidth){
    var errorCanvasNoProfileImageWidth = errorCanvasNoProfileImageMinWidth
  }*/
  
  var errorCanvasNoProfileImageWidth = errorCanvasNoProfileImageMaxWidth
  
  var errorCanvasNoProfileImageX = parseInt((canvasWidth-errorCanvasNoProfileImageWidth)/2)
  var errorCanvasNoProfileImageY = parseInt((canvasHeight-errorCanvasNoProfileImageHeight)/2)

  ctx.fillStyle = bgColor
  ctx.fillRect(errorCanvasNoProfileImageX, errorCanvasNoProfileImageY, errorCanvasNoProfileImageWidth, errorCanvasNoProfileImageHeight)
  ctx.fillStyle = borderColor
  ctx.fillRect(errorCanvasNoProfileImageX, errorCanvasNoProfileImageY, errorCanvasNoProfileImageWidth, 40)
  
  ctx.save()
  ctx.beginPath()
  ctx.globalAlpha = 0.3
  ctx.fillStyle = bgColor
  ctx.fillRect(10, errorCanvasNoProfileImageY-5, canvasWidth-20, errorCanvasNoProfileImageHeight+10)
  ctx.clip();

    ctx.globalAlpha = 1
    ctx.rotate(-0.5);
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, 50, canvasHeight);
    ctx.rotate(0.5);
  
  ctx.restore();
  ctx.closePath()
  ctx.fillStyle = bgColor
  
  ctx.globalAlpha = 0.7
  ctx.fillRect(10, errorCanvasNoProfileImageY-30, canvasWidth-20, 25)
  ctx.fillRect(10, errorCanvasNoProfileImageY+errorCanvasNoProfileImageHeight+5, canvasWidth-20, 25)
  ctx.globalAlpha = 1
  
  ctx.fillStroke = fontColor
  ctx.beginPath();
  ctx.moveTo(errorCanvasNoProfileImageX-10, errorCanvasNoProfileImageY-5);
  ctx.lineTo(errorCanvasNoProfileImageX+10+errorCanvasNoProfileImageWidth, errorCanvasNoProfileImageY-5);
  ctx.stroke();
  ctx.moveTo(errorCanvasNoProfileImageX-10, errorCanvasNoProfileImageY+errorCanvasNoProfileImageHeight+5);
  ctx.lineTo(errorCanvasNoProfileImageX+10+errorCanvasNoProfileImageWidth, errorCanvasNoProfileImageY+errorCanvasNoProfileImageHeight+5);
  ctx.stroke();
  ctx.closePath()
  
  ctx.textAlign = "center"
  ctx.fillStyle = fontColor
  ctx.font = "bold 30px 'Fira Mono'"
  ctx.fillText(title, parseInt(canvasWidth/2), parseInt(canvasHeight/2-errorCanvasNoProfileImageHeight/4+5))
  ctx.font = "bold 15px 'Space Mono'"
  ctx.fillText(secondContent, parseInt((canvasWidth-20)/2), errorCanvasNoProfileImageY+errorCanvasNoProfileImageHeight+25)
  ctx.font = "bold 12px 'Fira Mono'"
  
  var lines = getLines(ctx, content, parseInt(errorCanvasNoProfileImageWidth-10))
  for(var i = 0; i < lines.length; i++){
    ctx.fillText(lines[i], parseInt(canvasWidth/2), parseInt(canvasHeight/2-errorCanvasNoProfileImageHeight/4+35+(i*15)))
  }
  
  ctx.textAlign = "start"
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}


function commandPrompt(ctx, content, fontColor, commandPromptHeightLine, completed = false){
  if(completed == true){
    ctx.fillStyle = "#32a852"
    ctx.fillText('complete', parseInt(15+ctx.measureText(content).width), commandPromptHeightLine)
  }
  
  ctx.fillStyle = fontColor
  ctx.fillText(content, 15, commandPromptHeightLine)
  return parseInt(commandPromptHeightLine+11)
}