
    var session_id = getCookie("session_id")
    var user_id = getCookie("user_id")
    var access_token = getCookie("access_token")
    var connected = false;
    if(document.getElementById("loader-svg")) var loader_animation = document.getElementById("loader-svg").innerHTML
    var banned = false;

    message("Connexion en cours...<br>", "")
    
    var connexion_failed = "Une erreur s'est produite durant la tentative de connexion."
    + "Vérifiez que votre connexion à Internet est stable.<br>"
    + "Si le problème persiste, contactez un administrateur."
    + "<br><br>Tentative de connexion...<br>"
    + loader_animation
    
    var connexion_lost = "La connexion au serveur a été perdue. <br>Nous tentons de résoudre le problème, merci de patienter."
    + "<br><br>Tentative de reconnexion...<br>"
    + loader_animation
    
    var connexion_lost_reload = "La connexion au serveur a été perdue. <br>"
    + "Si le problème persiste, contactez un administrateur."
    + "<br><br>Tentative de reconnexion...<br>"
    + loader_animation
    
    /*setInterval(() => {
    }, 1000);*/
    
    var socket = io.connect('/', {
      query: {
        session_id: session_id,
        user_id: user_id,
        access_token: access_token
      }
    });

    socket.on('avatar', function(url){
      if(document.getElementById('user_avatar')) document.getElementById('user_avatar').setAttribute('src', url)
    })

    socket.on('roles', function(roles){
      var role_list = document.getElementById("player_roles")
      if(!role_list) return
      if(roles.length == 0){
        return role_list.innerHTML = "Vous n'avez aucun rôle."
      }
      role_list.innerHTML = ""
      for(var i = 0;i < roles.length;i++){
        var span = document.createElement('span')
        span.setAttribute('class', 'badge')
        span.style.color = "white"
        span.style.backgroundColor = roles[i].hexColor
        span.innerHTML = roles[i].name
        role_list.appendChild(span)
        role_list.innerHTML += " "
      }
    })

    socket.on('notif', function(msg){
      var in_channel = document.getElementById("in_channel")
      if(in_channel.innerHTML == 1){
        alertify.success(msg)
      }
    })

    function music_play(){
      var music_play = document.getElementById("music_play").style.backgroundColor
      if(music_play == "rgb(255, 255, 255)"){
        socket.emit("music", "pause")
      } else {
        socket.emit("music", "resume")
      }
    }

    function confirm_logout(){ 
      javascript:alertify.confirm( 'Confirmation',
      'Êtes-vous sûr de vouloir vous déconnecter ? Cette action déconnectera <b>toutes</b> vos sessions sur <b>tous</b> vos appareils.',
      function() { disconnect() },
      function() {  });
    }

    function music_next(){
      socket.emit("music", "skip")
    }

    function add_music(){
      alertify.prompt("Veuillez entrer un <b>lien Youtube</b> ci-dessous afin de le lire.", "", function(event, youtube_link){
        socket.emit('music', 'play '+youtube_link)
      })
    }

    socket.on('music', function(command, msg){
      var music_player = document.getElementById("music_player_div")
      var in_channel = document.getElementById("in_channel")
      var music_player_title = document.getElementById("music_player_title")
      var music_player_title_next = document.getElementById("music_player_title_next")
      var music_player_image = document.getElementById("music_player_image")
      var music_play = document.getElementById("music_play")
      var music_next = document.getElementById("music_next")
      var music_playing_not_in_channel = document.getElementById("music_playing_not_in_channel")
      var music_title = document.getElementById("music_title")
      
      if(command == "channel"){
        if(msg){
          in_channel.innerHTML = 1
        } else {
          in_channel.innerHTML = 0
        }
      }
      
      if(command == "author_title"){
        document.getElementById("music_player_author_title").innerHTML = "par <b>"+msg+"</b>"
      }
      if(command == "author_img"){
        document.getElementById("music_player_author_img").setAttribute('src', msg)
      }
      
      if(command == "link"){
        document.getElementById("music_player_link").href = msg;
      }
      
      if(command == "command"){
        if(msg == "stop"){
          if(music_playing_not_in_channel) music_playing_not_in_channel.style.display = "none"
          music_player_title.innerHTML = "";
          if(music_title) music_title.innerHTML = ""
          music_player.style.display = "none"
        }
        if(msg == "pause"){
          music_play.style.backgroundColor = "rgb(0, 0, 0)"
        }
        if(msg == "resume"){
          music_play.style.backgroundColor = "rgb(255, 255, 255)"
        }
      }
      
      if(command == "title"){
        var title_point = ""
        if(msg.length > 29){
          title_point = "..."
        }
        music_player_title.innerHTML = msg.substring(0, 30)+title_point;
        if(music_title) music_title.innerHTML = msg
      }
      
      if(command == "next"){
        if(msg == undefined){
          music_player_title_next.innerHTML = ""
        } else {
          var title_point = ""
          if(msg.length > 39){
            title_point = "..."
          }
          music_player_title_next.innerHTML = "Suivant: "+msg.substring(0, 40)+title_point
        }
      }
      
      if(command == "img"){
        music_player_image.style.backgroundImage = "url("+msg+")"
      }
      
      if(in_channel.innerHTML == 0){
        music_player.style.display = "none"
        if(music_title && music_title.innerHTML != ""){
          if(music_playing_not_in_channel) music_playing_not_in_channel.style.display = "block"
        }
      } else {
        music_player.style.display = "block"
        if(music_playing_not_in_channel) music_playing_not_in_channel.style.display = "none"
      }
    })

    socket.on('all_characters', function(characters){
      var body = document.getElementById("characters_list")
      if(!body) return
      if(characters.length == 0){
        return body.style.display = "none"
      }
      body.innerHTML = ""
        
      for(var i = 0;i < characters.length;i++){
        if(i > 2) break;
        var col = document.createElement('div')
        col.setAttribute('class', 'col-md-4 mb-5')
        
        var card = document.createElement('div')
        card.setAttribute('class', 'card h-100')
        card.style.overflow = "hidden"
        
        var img = document.createElement('div')
        img.style.backgroundSize = "cover"
        img.style.backgroundImage = "url("+characters[i].image+")"
        img.style.backgroundPosition = "top center"
        img.style.width = "100%"
        img.style.height = "200px"
        
        var card_body = document.createElement('div')
        card_body.setAttribute('class', 'card-body')
        
        var card_title = document.createElement('h4')
        card_title.setAttribute('class', 'card-title')
        card_title.innerHTML = characters[i].name + " " + characters[i].surname
        
        var card_text = document.createElement('p')
        card_text.setAttribute('class', 'card-text')
        if(characters[i] != undefined && characters[i] != null && characters[i].descMentale != undefined && characters[i].descMentale != null &&characters[i].descMentale != ""){
          card_text.innerHTML = characters[i].descMentale.substring(0, 100)+'...'
        } else {
          card_text.innerHTML = "Aucune description mentale fournie."
        }
        var card_footer = document.createElement('div')
        card_footer.setAttribute('class', 'card-footer')
        var more_button = document.createElement('a')
        more_button.setAttribute('href', '/fiche?access_token='+access_token+'&charId='+characters[i].characterId)
        more_button.setAttribute('class', 'btn btn-primary')
        more_button.innerHTML = "En savoir plus"
        
        card_body.appendChild(card_title)
        card_body.appendChild(card_text)
        card_footer.appendChild(more_button)
        card.appendChild(img)
        card.appendChild(card_body)
        card.appendChild(card_footer)
        col.appendChild(card)
        body.appendChild(col)
      }
    })

    socket.on('characters', function(characters){
      var body = document.getElementById("characters")
      if(!body) return
      if(characters.length == 0){
        return body.innerHTML = "Vous n'avez aucun personnage. Pour créer un personnage, rendez-vous sur la page <a href='/candid'>Candidature</a>."
      }
      
      var tbl = document.createElement('table');
      tbl.setAttribute('class', 'table table-hover')
      var thead = document.createElement('thead')
      var trhead = document.createElement('tr')
      
      var thhead = document.createElement('th')
      thhead.setAttribute('scope', 'col')
      thhead.innerHTML = "#"
      trhead.appendChild(thhead)
      
      var thhead = document.createElement('th')
      thhead.setAttribute('scope', 'col')
      thhead.innerHTML = "Nom"
      trhead.appendChild(thhead)
      
      var thhead = document.createElement('th')
      thhead.setAttribute('scope', 'col')
      thhead.innerHTML = "Prénom"
      trhead.appendChild(thhead)
      
      var thhead = document.createElement('th')
      thhead.setAttribute('scope', 'col')
      thhead.innerHTML = "Grade"
      trhead.appendChild(thhead)
      
      var thhead = document.createElement('th')
      thhead.setAttribute('scope', 'col')
      thhead.innerHTML = "Actions"
      trhead.appendChild(thhead)
      
      thead.appendChild(trhead)
      var tbody = document.createElement('tbody')
      var trbody = document.createElement('tr')
      var tdbody = document.createElement('td')
      
      for(var i = 0;i < characters.length ; i++){
        var character = characters[i]
        
        var thbody = document.createElement('th')
        thbody.setAttribute('scope', 'row')
        thbody.innerHTML = (i+1)
        trbody.appendChild(thbody)
        
        var tdbody = document.createElement('td')
        tdbody.innerHTML = (character.name)
        trbody.appendChild(tdbody)
        
        var tdbody = document.createElement('td')
        tdbody.innerHTML = (character.surname)
        trbody.appendChild(tdbody)
        
        var tdbody = document.createElement('td')
        tdbody.innerHTML = (character.grade)
        trbody.appendChild(tdbody)
        
        var tdbody = document.createElement('td')
        var abutton = document.createElement('a')
        abutton.setAttribute('class', 'btn btn-primary')
        abutton.innerHTML = "<i class='fa fa-edit'></i>"
        tdbody.appendChild(abutton)
        tdbody.appendChild(document.createTextNode (" "));
        var abutton = document.createElement('a')
        abutton.setAttribute('class', 'btn btn-danger')
        abutton.innerHTML = "<i class='fa fa-trash-o'></i>"
        tdbody.appendChild(abutton)
        trbody.appendChild(tdbody)
        
        tbody.appendChild(trbody)
      }
      
      tbl.appendChild(thead)
      tbl.appendChild(tbody)
      body.innerHTML = ""
      body.appendChild(tbl)
    })

    socket.on('meteo', function(temperature, date, status) {
      if(!document.getElementById("meteo_status")) return
      try{
        if(status == -1){
          if(document.getElementById("meteo_status").innerHTML != status){
            alertify.error("Une erreur s'est produite lors de la mise à jour de la météo.")
            triggerMeteo("none")
          }
        } else {
          triggerMeteo("block")
          meteo(temperature, date)
          if(document.getElementById("meteo_status").innerHTML != status){
            alertify.success("La météo a été mise à jour !")
            changeWeather(weather[status]);
          }
        }
      }
      catch(error){
        console.error(error)
      }
      document.getElementById("meteo_status").innerHTML = status;
    });
    
    socket.on('disconnect', function(code, status, info) {
      connected = false;
      /*triggerModal(true)
      setModal("Connexion interrompue", connexion_lost)*/
      if(document.getElementById('connection_lost')) document.getElementById('connection_lost').style.display = "block"
    });

    socket.on("session_banned", function(session_banned, banned_session){
      if(session_id == session_banned){
        socket.emit('banned', session_id, user_id)
        disconnect()
        banned = true;
        triggerMeteo("none")
        triggerModal(true)
        setModal("Session invalide", banned_session)
        lockModal(true)
      }
    })

    function disconnect(){
      socket.emit("disconnection", access_token)
      if(document.getElementById("music_player")) document.getElementById("music_player").style.display = "none"
      if(document.getElementById("player_recap")) document.getElementById("player_recap").style.display = "none"
      if(document.getElementById("nav-user")) document.getElementById("nav-user").style.display = "none"
      message("Déconnexion en cours...", "")
      deleteCookie("user_id")
      deleteCookie("access_token")
      deleteCookie("session_id")
      session_id = ""
      user_id = ""
      access_token = ""
      if(document.location.href != "https://colonia.glitch.me/") document.location.href = "https://colonia.glitch.me/"
    }

    setInterval(() => {
      if(!banned){
        socket.emit('check_connection', session_id, access_token, user_id)
      }
    }, 1000);

    socket.on('getUser')
    
    socket.on("connection", function(code, status, info){
      if(!banned){
        if(document.getElementById('connection_lost')) document.getElementById('connection_lost').style.display = "none"
        triggerModal(false)
        connected = true;
        message(status, info)
        if(document.getElementById("login_discord_button")){
          if(code < 2){
            document.getElementById("login_discord_button").style.display = "block"
          } else {
            document.getElementById("login_discord_button").style.display = "none"
          }
        }

        if(document.getElementById("join_discord_colonia_button")){
          if(code == 3){
            document.getElementById("join_discord_colonia_button").style.display = "block"
          } else {
            document.getElementById("join_discord_colonia_button").style.display = "none"
          }
        }
        
        if(code == 2){
          if(document.getElementById("player_recap")) document.getElementById("player_recap").style.display = "block"
          if(document.getElementById("characters_list")) document.getElementById("characters_list").style.display = ""
          if(document.getElementById("nav-user")) document.getElementById("nav-user").style.display = "block"
        } else {
          //if(document.location.href != "https://colonia.glitch.me/") document.location.href = "https://colonia.glitch.me/"
          if(document.getElementById("player_recap")) document.getElementById("player_recap").style.display = "none"
          if(document.getElementById("characters_list")) document.getElementById("characters_list").style.display = "none"
          if(document.getElementById("nav-user")) document.getElementById("nav-user").style.display = "none"
        }
      }
    })
    
    
    var modal = document.getElementById("myModal");
    
    
    /* Function */

    var lockModal_element = document.getElementById("lockModal")

    function triggerMeteo(status){
      var meteo_element = document.getElementById("meteo_div")

      if(status != undefined || status != null){
        meteo_element.style.display = status;
      } else {
        if(meteo_element.style.display == "none" || meteo_element.style.display == ""){
          meteo_element.style.display = "block"
        } else {
          meteo_element.style.display = "none"
        }
      }
    }

    function meteo(temperature, date){
      var meteo_element = document.getElementById("meteo_div")
      document.getElementById("meteo_temperature").innerHTML = temperature + "<span>c°</span>";
      document.getElementById("meteo_date").innerHTML = date;
    }

    function lockModal(status){
      if(status){
        lockModal_element.innerHTML = 1;
      } else {
        lockModal_element.innerHTML = 0;
      }
    }
    
    function triggerModal(status){
      if(lockModal_element.innerHTML == 0){
        var display;
        if(status == true){display = "block";}
        if(status == false){display = "none";}
        modal.style.display = display;
      }
    }
    
    function setModal(title, text){
      if(lockModal_element.innerHTML == 0){
        if(document.getElementById("modal_title")) document.getElementById("modal_title").innerHTML = title
        if(document.getElementById("modal_message")) document.getElementById("modal_message").innerHTML = text
      }
    }
        
    function message(title, text){
      var title_ = document.getElementById("display_message_title")
      var text_ = document.getElementById("display_message_text")
      if(title_) title_.innerHTML = title
      if(text_) text_.innerHTML = text
    }

    function deleteCookie(cname){
      setCookie(cname, "", 0)
    }
    
    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
  
    function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }