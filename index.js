const Discord = require("discord.js");
const client = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true
});

const fs = require("fs");

let config = require("./config");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
var io = require('socket.io').listen(server);
exports.io = "salut"

client.config = config;
client.commands = new Discord.Collection();

const redirect_ = client.config.WEBSITE_URL+'/api/discord/callback'
const redirect = encodeURIComponent(redirect_);
var dbFile = client.config.DB_FILE;
var exists = fs.existsSync(dbFile);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function() {
  if (!exists) {
    db.run("CREATE TABLE logsMessages (createdAt TIMESTAMP, userId TEXT, message TEXT, guildId TEXT)");
    db.run("CREATE TABLE users (id, username, discriminator, avatarURL)");
    db.run("CREATE TABLE characters (authorId, characterId, status, name, surname, age, sexe, height, weight, quality, defect, sexualOrientation, descMentale, descPhysique, histoire, image, accreditationLevel, grade)");
    db.run("CREATE TABLE inventories (characterId, slotId, slotContent)");
    db.run("CREATE TABLE sessions (sessionId, userId, access_token)");
    db.run("CREATE TABLE warns (warnedUserId, warnId, warnContent)");
    db.run("CREATE TABLE chambres (colonID, channelID)");
    db.run("CREATE TABLE meteo (date, matin, midi, soir, temperature)");
    db.run("CREATE TABLE reactor (temperature, tritium_stock, deuterium_stock, tritium_cons, deuterium_cons, elec_production)")
    // insert default dreams
  } else {
    db.each("select name from sqlite_master where type='table'", function(
      err,
      table
    ) {
      console.log("Table " + table.name + " loaded and ready.");
    });
  }
});

const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const youtube = new YouTube(config.GOOGLE_API_KEY);
const queue = new Map();

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/reload`);
  http.get(`http://deborah.glitch.me/reload`);
  http.get("http://botdelespritu.glitch.me/reload");
}, 30000);

/* ===================== */
/*  Websocket.io*/
/* ===================== */

io.on('connection', function(socket){  
  socket.on('reconnect', function(){
    socket.emit('music', 'stop')
  })
  
  socket.on('disconnection', function(access_token){
    const Base64 = require("js-base64").Base64;
    const credentials = Base64.encode(`${client.config.CLIENT_ID}:${client.config.CLIENT_SECRET}`);

    try{
      oauth.revokeToken(access_token, credentials);
    }
    catch {
      console.error
    }
  })
  
  socket.on('banned', function(session_id, user_id){
    if(client.users.get(user_id)){
      dm(client, "La session a bien été déconnectée. Cet événement sera reporté aux administrateurs pour comparaison et vérification.", "title", user_id)
      
      var to_send = "Une tentative de connexion non-autorisée à l'interface Web via le\ncompte de "+
                     client.users.get(user_id).username
                     +" a été reportée par l'utilisateur ou la connexion a été déconnectée de force par l'administrateur.\n\n"
      + "La connexion intrusive a été déconnectée par l'utilisateur mais \nrequiert une vérification de l'authentification Discord du compte.\n\n"
      + "L'administrateur système est prié de bien vouloir enquêter afin de\n maintenir la sécurité et l'intégrité de l'interface.\n\n"
      + "Toute connexion abusivement intrusive déclenchera \nautomatiquement la désactivation complète du système."
      
      //client.channels.get("614929573636734976").send(client.config.BOT_PREFIX+"command "+to_send)
      client.channels.get("614929573636734976").send(
        client.config.BOT_PREFIX+
        "message Security breach\nUnauthorized connection detected from the web interface to "+
        client.users.get(user_id).username+
        ".\nConnection terminated\nred"
      )
    }
    return socket.disconnect(true)
  })
  socket.on('disconnect', function(){
    console.log('Instance destroyed');
  });
  
  socket.on('check_connection', function(){
    checkConnection(socket)
  })
  
  socket.on('ask_meteo_graph', function(){
    var labels = []
    var values = []
    
    db.all("SELECT DISTINCT date,temperature FROM meteo", function(err, rows){
      rows = rows.reverse()
      var max_rows = rows.length
      if(max_rows > 30) max_rows=30
      for (var i = 0; i < max_rows; i++) {
        var row = rows[i]
        if(row){
          labels.push(row.date)
          values.push(row.temperature)
        }
      }
      socket.emit('meteo_graph', labels, values)
    })
  })
  
  socket.on('music', function(command){
    client.channels.get("614929573636734976").send(client.config.BOT_PREFIX + "music "+command)
  })
  
  checkConnection(socket)
});

function sendChar(socket, user_id){
  db.all("SELECT * FROM characters WHERE authorId = '"+user_id+"'", function(err,characters) {
    socket.emit("characters", characters)
  })
  db.all("SELECT * FROM characters ORDER BY characterId DESC", function(err,characters) {
    socket.emit("all_characters", characters)
  })
}

function sendRoles(socket, user_id){
  var coloniaGuild = client.guilds.get("587297215991775232")
  var roles =  coloniaGuild.members.get(user_id).roles.array()
  var role_send = []
  for(var i = 0;i < roles.length;i++){
    var role = {
      name: "",
      hexColor: ""
    }
    role.name = roles[i].name
    role.hexColor = roles[i].hexColor
    role_send[i] = role
  }
  
  socket.emit("roles", role_send)
}

function checkConnection(socket, session_id, access_token, user_id){
  var coloniaGuild = client.guilds.get("587297215991775232")
  if(!coloniaGuild) return
  
  var ask_connect_discord = "Pour poursuivre votre navigation, vous devez vous connecter à votre compte Discord."
  var ask_connect_colonia = "Vous n'êtes pas connecté au serveur Discord de Colonia !<br>Cliquez sur le lien ci-dessous pour être redirigé." +
      "<br><br>Si vous êtes déjà connecté, contactez un administrateur ou rechargez la page."
  
  if(!socket.handshake.query) {
    socket.emit("connection", 0, "Connectez-vous", ask_connect_discord)
    //return socket.disconnect(true)
  }
  
  if(session_id == "" || access_token == "" || user_id == "" || session_id == undefined || access_token == undefined || user_id == undefined) {
    session_id = socket.handshake.query.session_id
    access_token = socket.handshake.query.access_token
    user_id = socket.handshake.query.user_id
  }
  
  
  if(session_id == "" || access_token == "" || user_id == "" || session_id == undefined || access_token == undefined || user_id == undefined) {
    socket.emit("connection", 1, "Connectez-vous", ask_connect_discord)
    //return socket.disconnect(true)
  } else {
    
    oauth.getUser(access_token).then(function(user){
        if(client.users.get(user.id)){
          var context_file = fs.readFileSync("context.txt", 'UTF-8').toString()
          var userMember = coloniaGuild.members.get(user.id)
          sendChar(socket, user_id)
          sendRoles(socket, user_id)
          var welcome = "Bienvenue, <font color='"+userMember.displayHexColor+"'>"+userMember.displayName+"</font>."
          var welcome_msg = ""

          socket.emit("connection", 2, welcome, welcome_msg)
          socket.emit("avatar", 'https://cdn.discordapp.com/avatars/'+user.id+'/'+user.avatar+'.png')
          
          var voiceConnection = coloniaGuild.voiceConnection
          if(coloniaGuild.members.get(user_id) && coloniaGuild.members.get(user_id).voiceChannel && voiceConnection){
            if(voiceConnection.channel.equals(coloniaGuild.members.get(user_id).voiceChannel)){
              socket.emit("music", "channel", true)
            } else {
              console.log("1")
              socket.emit("music", "channel", false)
            }
          } else {
            socket.emit("music", "channel", false)
          }
        } else {
          socket.emit("connection", 3, "", ask_connect_colonia)
        }
      }
    ).catch(function(error){
      socket.emit("connection", 1, "Connectez-vous", ask_connect_discord)
    })
  }
}


function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


/* ===================== */
/*  Express */
/* ===================== */

app.get("*", (request, response, next) => {
  next()
})

app.get("/reload", (request, response) => {
  //console.log(Date.now() + " : Reload instruction received");
  response.sendStatus(200);
});

app.get('/ban', (req, res) => {
  if(!req.query.session_id) return res.send("Invalid session_id.")
  if(!req.query.user_id) return res.send("Invalid user_id.")
  var session_id = req.query.session_id
  var user_id = req.query.user_id
  
  var banned_session = "Votre session a été déconnectée en raison d'une connexion frauduleuse " +
      "reportée par l'utilisateur de ce compte sur Discord ou la connexion a été déconnecté de force par l'administrateur. " +
      "Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur. Pour vous reconnecter, rechargez la page.<br><br><br>" +
      "Vérifiez la sécurité et l'intégrité de votre compte Discord afin que cela ne se reproduise pas."
  
  io.emit("session_banned", session_id, banned_session)  
  res.write("<script>window.close();</script>")
  res.end()
})

var SpellChecker = require('simple-spellchecker');

app.get('/meteo', (req, res) => {
  res.send(buildPage('meteo_details.html'));
  res.end()
})

app.get('/fiche', (req, res) => {
  if(req.query && req.query.charId && req.query.access_token) {
    oauth.getUser(req.query.access_token).then(function(user){
      db.all("SELECT * FROM characters WHERE characterId = '"+req.query.charId+"'", function(err,characters) {
        SpellChecker.getDictionary("fr-FR", async function(err, dictionary) {
          if(characters){
            var index_html = buildPage("post.html")
            var from_replace = ""
            for (var [key, value] of Object.entries(characters[0])) {
              from_replace = "{{ character_"+key+" }}"
              if(value == null || value == undefined) value = ""
              value = value.replace(/\\n/gi, "<br>")
              var correct_value = value              

              if(key == "quality" || key == "defect" || key == "descMentale" || key == "descPhysique" || key == "histoire"){
                correct_value = ""
                var corrected = ""
                var words = value.split(' ')
                for (let i = 0; i < words.length; i++) {
                  var origin_word = words[i]
                  var word = words[i]
                  
                  if(word == "jusqu'à") word = ""
                  var word = word.replace(/n’/gi, "").replace(/l’/gi, "").replace(/m’/gi, "").replace(/qu’/gi, "").replace(/d’/gi, "").replace(/s’/gi, "")
                  var word = word.replace(/n'/gi, "").replace(/l'/gi, "").replace(/m'/gi, "").replace(/qu'/gi, "").replace(/d'/gi, "").replace(/s'/gi, "")
                  word = word.match(/[a-zA-ZÀ-ú0-9'-]+/g)
                  if(word){
                    word = word.join('')
                    if(!err && word.charAt(0) != word.charAt(0).toUpperCase()) {
                        var misspelled = ! dictionary.spellCheck(word);
                        if(misspelled) {
                          var suggestions = dictionary.getSuggestions(word);
                          if(suggestions[0] != undefined){
                            corrected = corrected+" <strike style='color:red'>"+origin_word+"</strike> <sup>(<i>"
                            if(suggestions[0]) corrected = corrected+suggestions[0]
                            if(suggestions[1]) corrected = corrected+"</i>/<i>"+suggestions[1]
                            if(suggestions[2]) corrected = corrected+"</i>/<i>"+suggestions[2]
                            corrected = corrected+"</i>)</sup>"
                          } else {
                            corrected = corrected + " <i>" + origin_word + "</i><sup>?</sup>"
                          }
                        } else {
                          corrected = corrected+" "+origin_word
                        }
                    } else {
                      corrected = corrected+" "+origin_word
                    }
                  } else {
                    corrected = corrected+" "+origin_word
                  }
                }
                correct_value = corrected
                var regex = new RegExp(from_replace,"gi")
                index_html = index_html.replace(regex, correct_value)
              } else {
                var regex = new RegExp(from_replace,"gi")
                index_html = index_html.replace(regex, correct_value)
              }
            }
            res.write(index_html)
            res.end()
          } else {
            res.redirect('/')
          }
        });
      })
    }).catch(function(error){
      res.redirect('/')
    })
  } else {
    res.redirect('/')
  }
})

app.use(express.static('public'));

function buildPage(main){
  var nav_bar = fs.readFileSync("website/nav_bar.html", 'UTF-8').toString()
  var index_html = fs.readFileSync("website/"+main, 'UTF-8').toString()
  var index_css = fs.readFileSync("website/index.css", 'UTF-8').toString()
  var index_js = fs.readFileSync("website/index.js", 'UTF-8').toString()
  var meteo_html = fs.readFileSync("website/meteo.html", 'UTF-8').toString()
  var meteo_js = fs.readFileSync("website/meteo.js", 'UTF-8').toString()
  var meteo_css = fs.readFileSync("website/meteo.css", 'UTF-8').toString()
  var loader_animation = fs.readFileSync("website/loader_animation.html", 'UTF-8').toString()
  var vendor_bootstrap_css = fs.readFileSync("website/vendor_bootstrap.css", 'UTF-8').toString()
  var vendor_bootstrap_js = fs.readFileSync("website/vendor_bootstrap.js", 'UTF-8').toString()
  var vendor_jquery_js = fs.readFileSync("website/vendor_jquery.js", 'UTF-8').toString()
  var music_player_html = fs.readFileSync("website/music_player.html", 'UTF-8').toString()
  var music_player_css = fs.readFileSync("website/music_player.css", 'UTF-8').toString()
  var face_api = fs.readFileSync("website/face-api.js", 'UTF-8').toString()

  index_html = index_html.replace(/{{ style_css }}/gi, index_css)
  index_html = index_html.replace(/{{ index_js }}/gi, index_js)
  index_html = index_html.replace(/{{ nav_bar }}/gi, nav_bar)
  index_html = index_html.replace(/{{ face_api }}/gi, face_api)

  index_html = index_html.replace(/{{ music_player_html }}/gi, music_player_html)
  index_html = index_html.replace(/{{ music_player_css }}/gi, music_player_css)

  index_html = index_html.replace(/{{ meteo_html }}/gi, meteo_html)
  index_html = index_html.replace(/{{ meteo_css }}/gi, meteo_css)
  index_html = index_html.replace(/{{ meteo_js }}/gi, meteo_js)

  index_html = index_html.replace(/{{ vendor_bootstrap_css }}/gi, vendor_bootstrap_css)
  index_html = index_html.replace(/{{ vendor_bootstrap_js }}/gi, vendor_bootstrap_js)
  index_html = index_html.replace(/{{ vendor_jquery_js }}/gi, vendor_jquery_js)

  index_html = index_html.replace(/{{ loader_animation }}/gi, loader_animation)

  index_html = index_html.replace(/{{ client_avatar }}/gi, client.user.avatarURL)
  
  var citations = [
    {
      text: "Quand le pouvoir de l'amour surpassera l'amour du pouvoir, le monde connaîtra la paix.",
      author: "Un banc de métro"
    },
    {
      text: "Parce que je suis une pute.",
      author: "Ally Graham"
    },
    {
      text: "Je suis triste, on ne peut pas les gazer.",
      author: "Ally Graham"
    },
    {
      text: "La vie c'est surcôté.",
      author: "Ally Graham"
    },
    {
      text: "C'est donc vrai que les gays sont gays.",
      author: "Ally Graham"
    },
    {
      text: "Punaise, je suis en train de finir comme Soryo.",
      author: "Lucas Jameson"
    },
    {
      text: "Je dirais que j'ai glissé et son sexe est tombé entre mes mains.",
      author: "Vincent Herrwolf"
    },
    {
      text: "Punaise mais mes voisines qui gloussent comme des loutres avec une pneumonie.",
      author: "Ally Graham"
    },
    {
      text: "Personne ne mérite d'être violé même en cas d'extrême nécessité.",
      author: "Danalieth"
    },
    {
      text: "Oh ! Soryo a allumé un feu... Oh ! Soryo est en feu.",
      author: "Alejandro Velasco"
    },
    {
      text: "C'est donc vrai que les gays sont gays.",
      author: "Ally Graham"
    },
    {
      text: "Au pire, je vais tuer mes enfants.",
      author: "Elie Adam"
    }
  ]
  var citation = citations[Math.floor(Math.random() * citations.length)]
  index_html = index_html.replace(/{{ citation_text }}/gi, citation.text)
  index_html = index_html.replace(/{{ citation_author }}/gi, citation.author)
  
  return index_html
}

app.get('/', (req, res) => {
  var index_html = buildPage("index.html")
  res.write(index_html)
  res.end()
});

app.get('/api/discord/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${client.config.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();

app.get('/api/discord/callback', (req, res) => {
  if (!req.query.code) res.redirect('/');
  const code = req.query.code

  oauth.tokenRequest({
      clientId: client.config.CLIENT_ID,
      clientSecret: client.config.CLIENT_SECRET,
      code: code,
      scope: "identify",
      grantType: "authorization_code",
      redirectUri: redirect_
  }).then(
    function(response){
      oauth.getUser(response.access_token).then(
        function(user){
          res.redirect('/auth?access_token='+response.access_token)
        }
      )
    }
  )
});

app.get('/auth', (req, res) => {
  if(!req.query.access_token) res.redirect('/')
  const access_token = req.query.access_token
  const session_id = getUUID()
  oauth.getUser(access_token).then(
    function(user){
      const user_id = user.id
      console.log(user.username+" connected")
      db.run('INSERT INTO sessions(sessionId, userId, access_token) VALUES("'+session_id+'", "'+user_id+'", "'+access_token+'")')
      var auth_file = fs.readFileSync("website/auth.html", 'UTF-8').toString()
      auth_file = auth_file.replace(/{{ access_token }}/gi, access_token)
      auth_file = auth_file.replace(/{{ session_id }}/gi, session_id)
      auth_file = auth_file.replace(/{{ user_id }}/gi, user_id)
      
      if(client.users.get(user.id)){
        dm(client, "**Un utilisateur vient de se connecter sur l'interface web avec votre compte**\n"
           + "Si ce n'était pas vous, cliquez sur le lien suivant pour le déconnecter immédiatement.\n\n"
           + "Veuillez contacter un administrateur et vérifier votre compte en cas de doute sur la nature de cette nouvelle connexion. "
           + "Il peut s'agir d'une connexion non-autorisée."
           + "\n\nhttps://colonia.glitch.me/ban?user_id="+user.id+"&session_id="+session_id, "description", user.id)
        
        if(user.id != "220553711196438528") {
          dm(client, "**Un utilisateur vient de se connecter sur l'interface web**\n"
           + "Pour forcer la déconnexion :"
           + "\n\nhttps://colonia.glitch.me/ban?user_id="+user.id+"&session_id="+session_id, "description", "220553711196438528")
        }
        
      }
      
      res.write(auth_file)
      res.end()
    }
  );
})

function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}



setInterval(() => {
  if(client){
    client.emit('Interval', db)
    client.emit("socketMeteo", db, io)
  }
}, 1000);

fs.readdir("./commandes/", (err, files) => {
  if (err) throw err;
  let commandes = files.filter(f => f.split(".").pop() === "js");
  if (commandes.length <= 0)
    return console.log("[ALERTE] Aucune commande chargée.");
  console.log(`Nombre de commande en chargement : ${files.length}`);

  commandes.forEach((f, i) => {
    let commande = require(`./commandes/${f}`);
    //console.log(`[COMMANDE] ${f} chargée!`);
    client.commands.set(commande.help.name, commande);
  });
});

fs.readdir("./events/", (err, files) => {
  if (err) throw err;
  console.log(`Nombre d\'event en chargement : ${files.length}`);

  files.forEach(f => {
    const events = require(`./events/${f}`);
    const event = f.split(".")[0];
    client.on(event, events.bind(null, client));
    delete require.cache[require.resolve(`./events/${f}`)];
  });
});

client.login(config.BOT_TOKEN);
module.exports = (client, io);

server.listen(process.env.PORT, () => {
  console.info('Running on port '+process.env.PORT);
});

function dm(client, content, forceMode, user_id){
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

  //client.channels.get('675728232708046858').send(exampleEmbed)
  
  if(user_id){
    client.users.get(user_id).createDM().then(() => {
      client.users.get(user_id).dmChannel.send(exampleEmbed)
    })
  } else {
    return exampleEmbed
  }
}