var sqlite3 = require('sqlite3').verbose()
const { registerFont, createCanvas, loadImage } = require('canvas')
registerFont('spacemono.ttf', { family: 'Space Mono' })
registerFont('firamono.ttf', { family: 'Fira Mono' })
const Discord = require("discord.js");

module.exports.run = async (client, msg, args) => {
  var db = new sqlite3.Database(client.config.DB_FILE);
  var allArgs = args.join(" ")
  var contents = allArgs.split("\n")
  
  displayImage(msg, contents[0], contents[1], contents[2], contents[3])
}

module.exports.help = {
    name : "message",
    type: "bot",
}

function displayImage(msg, title, content, secondContent, color){
  if(color == "" || color == undefined) color = "blue"
  msg.channel.startTyping()
  var canvasHeight = 529
  var canvasWidth = 1000
  loadImage('https://cdn.glitch.com/df813b31-7108-4468-9f27-ca3574c399b7%2F8887796_orig.png?v=1581319920349').then((background) => {
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')

    //Apply the background image
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    //Darken the background image
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    var errorColor = "#fc633d"
    if(color == "red") notifCanvas(ctx, title, content, secondContent, canvasHeight, canvasWidth, errorColor, "#c41212", "#fff")
    if(color == "green") notifCanvas(ctx, title, content, secondContent, canvasHeight, canvasWidth, "#169c39", "#077825", "#fff")
    if(color == "blue") notifCanvas(ctx, title, content, secondContent, canvasHeight, canvasWidth, "#3c79cf", "#194480", "#fff")

    msg.channel.send("", {
      file: canvas.toBuffer('image/png', { quality: 1 })
    })
    msg.channel.stopTyping()
  })
    
}


function notifCanvas(ctx, title, content, secondContent, canvasHeight, canvasWidth, bgColor, borderColor, fontColor){
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
  ctx.fillStyle = "#fff"
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
  if(text == undefined) return 0
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