module.exports = async (client, db, socket) => {
  if(client.config.maintenance) return;
  
  /*var activities = ["manger des algues", client.config.BOT_PREFIX + "help", "servir Tet", "faire des ECU", "yggdrasil-rp.glitch.me", "un jeu"];
  client.user.setActivity(activities[Math.floor(Math.random() * activities.length)])*/
  var today = new Date();
  today.setHours(today.getHours() - 2);
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  // add a zero in front of numbers<10
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);
  var display = h + ":" + m;

  var today = new Date();
  today.setDate(today.getDate());
  today.setHours(today.getHours()-2)
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  mm = mm.toString();
  var yyyy = today.getFullYear();

  if (dd.length === 1) {
    dd = "0" + dd;
  }
  if (mm.length === 1) {
    mm = "0" + mm;
  }

  if (client.user) {
    let ask_date = dd + "/" + mm + "/" + yyyy;
    db.get(
      'SELECT COUNT(*) AS NB_METEO from meteo WHERE date = "' +
        ask_date +
        '" LIMIT 1',
      function(err, meteo_count) {
        if (meteo_count && meteo_count["NB_METEO"] > 0) {
          db.get(
            'SELECT * from meteo WHERE date = "' + ask_date + '" LIMIT 1',
            function(err, meteo) {
              if (meteo) {
                var time_period;
                if (h < 12) time_period = "matin";
                if (h >= 12) time_period = "midi";
                if (h > 19) time_period = "soir";
                var emote = "";
                var text = "";

                if (meteo[time_period] === ":thunder_cloud_rain:") emote = "⛈";
                if (meteo[time_period] === ":cloud_rain:") emote = "🌧";
                if (meteo[time_period] === ":white_sun_rain_cloud:")
                  emote = "🌦";
                if (meteo[time_period] === ":white_sun_cloud:") emote = "🌥";
                if (meteo[time_period] === ":white_sun_small_cloud:")
                  emote = "🌤";
                if (meteo[time_period] === ":sunny:") emote = "☀";
                
                status = -1;
                if (meteo[time_period] === ":thunder_cloud_rain:")
                  status = 3
                  text = "Très orageux";
                
                if (meteo[time_period] === ":cloud_rain:")
                  status = 3
                  text = "Orageux";
                
                if (meteo[time_period] === ":white_sun_rain_cloud:")
                  status = 2
                  text = "Pluvieux";
                
                if (meteo[time_period] === ":white_sun_cloud:")
                  status = 1
                  text = "Nuageux";
                
                if (meteo[time_period] === ":white_sun_small_cloud:")
                  status = 4
                  text = "Eclaircis";
                
                if (meteo[time_period] === ":sunny:")
                  status = 4
                  text = "Ensoleillé";
                socket.emit("meteo", meteo["temperature"], ask_date + " ("+h+":"+m+":"+s+")", status)
              }
            }
          );
        } else {
          client.user.setActivity(display);
          //client.user.setActivity("OFFLINE");
        }
      }
    );
  }
  if (h + ":" + m + ":" + s == "22:30:00") {
    //client.emit('ChambreMode', db, "Night");
  } else if (h + ":" + m + ":" + s == "00:00:02") {
    //client.emit("weatherSimulation", db, h + " " + m + " " + s);
    //client.emit('ChambreMode', db, "Reboot");
  } else if (h + ":" + m + ":" + s == "08:00:00") {
    //client.emit('ChambreMode', db, "Day");
  }
}


function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}