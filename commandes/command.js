var sqlite3 = require('sqlite3').verbose()
const { registerFont, createCanvas, loadImage } = require('canvas')
registerFont('spacemono.ttf', { family: 'Space Mono' })
registerFont('firamono.ttf', { family: 'Fira Mono' })
const Discord = require("discord.js");

module.exports.run = async (client, msg, args) => {
  var db = new sqlite3.Database(client.config.DB_FILE);
  var allArgs = args.join(" ")
  var contents = allArgs.split("\n")
  
  displayImage(msg, contents)
}

module.exports.help = {
    name : "command",
    type: "bot",
}

function displayImage(msg, contents){
  msg.channel.startTyping()
  var canvasHeight = 529
  var canvasWidth = 1000
  //loadImage('https://fenterprise.000webhostapp.com/assets/img/logo.png').then((logo) => {
  loadImage('https://cdn.glitch.com/df813b31-7108-4468-9f27-ca3574c399b7%2Flogo.png?v=1581975540872').then((logo) => {
    loadImage('https://cdn.glitch.com/df813b31-7108-4468-9f27-ca3574c399b7%2F8887796_orig.png?v=1581319920349').then((background) => {
      const canvas = createCanvas(canvasWidth, canvasHeight)
      const ctx = canvas.getContext('2d')

      //Apply the background image
      ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      //Darken the background image
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      //Add the logo
      ctx.drawImage(logo, 20, 20, 125, 100)
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = "3"
      roundRect(ctx, 10, 10, 145, 120, 5, false, true)
      ctx.lineWidth = "1"
      
      //Draw title text
      ctx.font = 'bold 50px "Space Mono"'
      ctx.fillStyle = "#fff"
      ctx.textAlign = "start"
      ctx.fillText("Grâce", 175, 50)
      ctx.font = 'bold 15px "Space Mono"'
      ctx.textAlign = "start"
      ctx.fillText("by Vondeuschtadt", 175, 65)
      ctx.fillText("Version 1.2555.147", 175, 80)
      ctx.fillText("Self optimization patch 869", 175, 95)
      
      //Draw right side
      ctx.strokeStyle = "#fff"
      ctx.fillStyle = "#fff"
      ctx.lineWidth = "3"
      roundRect(ctx, 520, 10, parseInt(canvasWidth-530), parseInt(canvasHeight-25), 5, false, true)
      ctx.fillStyle = "#fff"
      ctx.lineWidth = "1"
      roundRect(ctx, 520, 10, parseInt(canvasWidth-530), 20, 5, true, true)
      ctx.font = 'bold 15px "Space Mono"'
      ctx.fillStyle = "#000"
      ctx.textAlign = "center"
      ctx.fillText("Status report", parseInt(canvasWidth/2+(parseInt(canvasWidth-530)/2)), 25)
      ctx.textAlign = "start"
      
      //Draw the status text
      ctx.font = '12px "Fira Mono"'
      ctx.fillStyle = "#fff"
      var commandPromptHeightLine = 45
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking modules...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking systems...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking protocols...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking network...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking connected devices...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking hard drives...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking processors...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking connection...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking sequences...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking procedures...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "===================", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "Retrieving data from network...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Verifying data from local secured server...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Decrypting file data from local secured server...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "Checking data...", '#fff', commandPromptHeightLine, true)
      commandPromptHeightLine = commandPrompt(525, ctx, "All data retrieved and loaded with success.", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "Biometric data confirmed", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "Biological data confirmed", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "Physiological data confirmed", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "Physical data confirmed", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "Psychometric data confirmed", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "Genetic data confirmed", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "Facial data confirmed", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "Voice data confirmed", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "============================================", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "! Neurological Information Analysis System !", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "============================================", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "", '#fff', commandPromptHeightLine, false)
      commandPromptHeightLine = commandPrompt(525, ctx, "All systems online and running.", '#fff', commandPromptHeightLine, false)
      /*for(var i = 0;i < contents.length; i++){
        commandPromptHeightLine = commandPrompt(525, ctx, contents[i], '#fff', commandPromptHeightLine, false)
      }*/

      //Draw console border
      ctx.strokeStyle = "#fff"
      ctx.fillStyle = "#fff"
      ctx.lineWidth = "3"
      roundRect(ctx, 10, 135, 500, parseInt(canvasHeight-150), 5, false, true)
      ctx.fillStyle = "#fff"
      ctx.lineWidth = "1"
      roundRect(ctx, 10, 135, 500, 20, 5, true, true)
      ctx.font = 'bold 15px "Space Mono"'
      ctx.fillStyle = "#000"
      ctx.textAlign = "center"
      ctx.fillText("Command prompt", 260, 150)
      ctx.textAlign = "start"

      //Draw the text
      ctx.font = '12px "Fira Mono"'
      ctx.fillStyle = "#fff"
      var commandPromptHeightLine = 170
      for(var i = 0;i < contents.length; i++){
        commandPromptHeightLine = commandPrompt(15, ctx, contents[i], '#fff', commandPromptHeightLine, false)
      }

      msg.channel.send("", {
        file: canvas.toBuffer('image/png', { quality: 1 })
      })
      msg.channel.stopTyping()
    })
  })
}



function commandPrompt(width, ctx, content, fontColor, commandPromptHeightLine, completed = false){
  if(completed == true){
    ctx.fillStyle = "#32a852"
    ctx.fillText('complete', parseInt(width+ctx.measureText(content).width), commandPromptHeightLine)
  }
  
  ctx.fillStyle = fontColor
  ctx.fillText(content, width, commandPromptHeightLine)
  return parseInt(commandPromptHeightLine+13)
}

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