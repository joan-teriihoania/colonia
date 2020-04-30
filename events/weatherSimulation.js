const Discord = require('discord.js')

module.exports = async (client, db, actual_time) => {
  if(client.config.maintenance) return;
  
  var args = actual_time.split(' ')

  console.log("\n" + 'Meteo command running ...');
  var today = new Date();
  today.setDate(today.getDate());
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  let day = dd
  let month = mm.toString()
  let year = yyyy
  /*let day = args[0];
  let month = args[1];
  let year = args[2];*/

  if(day.length === 1){
    day = "0" + day;
  }
  if(month.length === 1){
    month = "0" + month;
  }

  let ask_date = day + "/" + month + "/" + year;

  let couleur = 37376;
  let icone = "http://herbetendre.fr/wp-content/uploads/2016/06/chambre-printemps-icone.png";
  let temperature = 25;
  let season = 0;
  let season_a = "Printemps";
  let matin = "`input.text(message.on).ERRORparse:'Matin';`";
  let midi = "`input.text(message.on).ERRORparse:'Midi';`";
  let soir = "`input.text(message.on).ERRORparse:'Soir';`";
  let autre = "`input.text(message.on).ERRORparse:'Autre';`";
  let pluie = 100;
  let pluie_matin = 100;
  let pluie_midi = 100;
  let pluie_soir = 100;
  let type_pluie = "pluie";
  let type_pleut = "pleut";
  let type_goutte = "goutte";
  var choice_reponse = "";
  var choice = 0;


  if(month === "03"){
    season = 0;
  }
  if(month === "04"){
    season = 0;
  }
  if(month === "05"){
    season = 1;
  }
  if(month === "06"){
    season = 1;
    //season = 1;
  }
  if(month === "07"){
    season = 1;
  }
  if(month === "08"){
    season = 1;
    //season = 0;
  }
  if(month === "09"){
    season = 2;
    //season = 0;
  }
  if(month === "10"){
    season = 2;
    //season = 0;
  }
  if(month === "11"){
    season = 2;
    //season = 0;
  }
  if(month === "12"){
    season = 3;
    //season = 0;
  }
  if(month === "01"){
    season = 3;
    //season = 0;
  }
  if(month === "02"){
    season = 3;
    //season = 0;
  }

  if(season === 0){
    season_a = "Printemps";
    //season_a = "Moisson";
    couleur = 37376;
    icone = "http://herbetendre.fr/wp-content/uploads/2016/06/chambre-printemps-icone.png";




    var min = 0;
    var max = 4;
    max = max + 1;
    choice = Math.round(Math.random() * (max - min) + min);


    choice_reponse = {
      "0":"**C'est le printemps, les fleurs ont commencés à germer et de nombreuses plantes embellissent la région.**",
      "1":"**Le doux parfum des fleurs envahi la plaine et le pollen se disperse, gare aux allergies !**",
      "2":"**Des couleurs de partout, un soleil radieux, une chaleur réconfortante, quelle belle saison...**",
      "3":"**Sport, jeux ou peinture ? Vaquez à vos occupations, le ciel ne vous tombera pas sur la tête ... enfin, peut être !**",
      "4":"**La plaine vêtu de son manteau émeraude tacheté de couleur rubis ponctue enfin cette toile blanche de couleur éclatante !**"
    };

    if(choice_reponse[choice]) {
      autre = choice_reponse[choice];
    }
    var min = 25;
    var max = 30;
    max = max + 1;
    temperature = Math.round(Math.random() * (max - min) + min);

    min = 0;
    max = 100;
    pluie = Math.round(Math.random() * (max - min) + min + 10);
  }
  if(season === 1){
    season_a = "Eté";
    //season_a = "Diette";
    couleur = 16771840;
    icone = "https://tourismesutton.ca/wp-content/uploads/2018/04/Icone-Ete.png";

    var min = 0;
    var max = 5;
    max = max + 1;
    choice = Math.round(Math.random() * (max - min) + min);


    choice_reponse = {
      "0":"**L'eau est bonne, le lac est reluisant et donne des envies d'y plonger tandis que l'on voit aux côtes de nombreux enfants qui s'amusent, l'été est là.**",
      "1":"**Il fait chaud non ? Normal, les enfants jouent un peu partout, c'est l'été, la plage vous attend**",
      "2":"**Restez chez vous si vous voulez souffrir et mourir de chaud, il est temps de décompresser et de s'amuser**",
      "3":"**L'été ... il fait chaud, rien d'autre à dire**",
      "4":"**Le soleil, la plage, la mer, les filles, si vous ne voyez pas à quoi je fais allusion ... vous êtes une cause perdue**",
      "5":"**L'été est là et apporte le soleil et la chaleur insuppotable, n'espérez pas une goutte de pluie mais plutôt des gouttes de sueurs sur votre peau**"
    };

    if(choice_reponse[choice]) {
      autre = choice_reponse[choice];
    }



    var min = 25;
    var max = 35;
    max = max + 1;
    temperature = Math.round(Math.random() * (max - min) + min);

    min = 0;
    max = 100;
    pluie = Math.round(Math.random() * (max - min) + min + 35);
  }
  if(season === 2){
    season_a = "Automne";
    couleur = 16745984;
    icone = "https://media.cdnandroid.com/6e/b1/38/b9/imagen-3d-autumn-maple-leaves-0thumb.jpg";

    var min = 0;
    var max = 4;
    max = max + 1;
    choice = Math.round(Math.random() * (max - min) + min);


    choice_reponse = {
      "0":"**Les feuilles tombent et deviennent marron, jaunes, tandis que les plantes se préparent à hiverner, le monde se couvre de ses plus belles parures pourpres et orangées.**",
      "1":"**Les jardiniers vont avoir du travail pour ratisser cette invasion de feuilles mourrantes.**",
      "2":"**Les arbres revêtent leur habits hivernales et se délaissent de leur manteau végétal, les feuilles tombent incessament**",
      "3":"**Marron, orange, jaune ... peu de vert, telles sont les prochaines couleur qu'arboreront les arbres**",
      "4":"**La plaine est recouverte de feuilles à profusion et la brise les souffle facilement, les enfants s'amusent à se créer des cabanes végétales et l'on voit partout des tas de feuilles s'amonceler**"
    };

    if(choice_reponse[choice]) {
      autre = choice_reponse[choice];
    }




    var min = 8;
    var max = 12;
    max = max + 1;
    temperature = Math.round(Math.random() * (max - min) + min);

    min = 0;
    max = 100;
    pluie = Math.round(Math.random() * (max - min) + min + 5);
  }
  if(season === 3){
    season_a = "Hiver";
    couleur = 29439;
    icone = "https://img.icons8.com/color/452/winter.png";


    var min = 0;
    var max = 5;
    max = max + 1;
    choice = Math.round(Math.random() * (max - min) + min);


    choice_reponse = {
      "0":"**Le lac est gelé, la neige est là et la température est frigorifique, on peut voir un peu partout dans la neige le soir dans la plaine des fleurs brillantes**",
      "1":"**Il fait froid, plutôt froid ou très froid, en tout cas, le lac lui est blanc glacé telle une patinoire.**",
      "2":"**Le monde s'est arrêté, le temps s'est suspendu, pour un temps et le manteau de neige blanc recouvre la surface de la plaine**",
      "3":"**Peu d'animaux, des bruits très rares, seul le bruissement du vent peut être encore entendu, le monde s'est endormi sous cette froideur hivernale**",
      "4":"**Si l'on sort sans manteau, on ne sent plus le bout de ses doigts, l'hiver est là et son froid glacial l'accompagne**",
      "5":"**L'hiver est au rendez-vous, préparez vous pour le froid et le temps glacial, un chocolat chaud pour se réchauffer chez vous**"
    };

    if(choice_reponse[choice]) {
      autre = choice_reponse[choice];
    }

    var min = -10;
    var max = 5;
    max = max + 1;
    temperature = Math.round(Math.random() * (max - min) + min);

    min = 0;
    max = 100;
    pluie = Math.round(Math.random() * (max - min) + min + 10);
    if(month === "12"){
      pluie = pluie - 20;
    }
    type_pluie = "neige";
    type_pleut = "neige";
    type_goutte = "flocon";
  }

  if(args[3]){
    pluie = parseInt(args[3])
  }
  
  pluie_matin = pluie;


  let msg_type1 = "**:thunder_cloud_rain: - Il " + type_pleut + " des cordes et très fortement, le vent est violent et les fenêtres tapent tandis que la " + type_pluie + " balaye la ville. C'est une vrai " + type_pluie + " dilluvienne.**";
  let msg_type11 = "**:thunder_cloud_rain: - Il " + type_pleut + " d'une puissance titanesque comme si le ciel noir et couvert nous tombait sur la tête**";
  let msg_type12 = "**:thunder_cloud_rain: - Le monde est sombre sous une " + type_pluie + " énorme et en quantité considérable**";


  let msg_type2 = "**:cloud_rain: - La " + type_pluie + " est battante mais n'empêche pas les allés et venus des passants, malgré sa lourdeur, la vie continu.**";
  let msg_type21 = "**:cloud_rain: - Il " + type_pleut + " mais cela semble être passable, mais mieux vaut tout de même prendre quelques habits supplémentaire**";
  let msg_type22 = "**:cloud_rain: - A cause de la " + type_pluie + ", on a du mal à voir à plusieurs mètres mais cela n'empêche pas vraiment les gens d'aller au travail !**";


  let msg_type3 = "**:white_sun_rain_cloud: - La " + type_pluie + " est calme et lente, fine, le ciel lui est totalement couvert.**";
  let msg_type31 = "**:white_sun_rain_cloud: - Il " + type_pleut + " mais assez faiblement, pas vraiment de quoi s'en faire.**";
  let msg_type32 = "**:white_sun_rain_cloud: - Les nuages dispersent un peu de " + type_pluie + ", couvrant entièrement le ciel**";


  let msg_type4 = "**:white_sun_cloud: - Malgré quelques nuages en vue dans le ciel, la " + type_pluie + " ne semble pas tomber pour le moment.**";
  let msg_type41 = "**:white_sun_cloud: - Le ciel est couvert de nuage, plutôt haut mais les " + type_goutte + " ne semble pas vouloir tomber.**";
  let msg_type42 = "**:white_sun_cloud: - Les nuages masquent le soleil mais aucun d'entre eux ne semble vouloir lâcher de la " + type_pluie + ".**";


  let msg_type5 = "**:white_sun_small_cloud: - Les nuages sont très très peu nombreux, des éclaircis régulières trouent le ciel, laissant passer les rayons du soleil.**";
  let msg_type51 = "**:white_sun_small_cloud: - Le ciel est parsemé de nuage par ci par là et le soleil darde ses rayons au travers.**";
  let msg_type52 = "**:white_sun_small_cloud: - On ne voit qu'assez peu de nuage, tout de même présents, qui se baladent dans le ciel**";


  let msg_type6 = "**:sunny:  - Aucun nuage dans le ciel bleu et ensoleillé.**";
  let msg_type61 = "**:sunny:  - Le ciel est bleu, vide.**";
  let msg_type62 = "**:sunny:  - Pas de nuage à l'horizon !**";


  let msg_type7 = "**:sunny:  - Aucun nuage, il fait chaud, très chaud pour la saison.**";
  let msg_type71 = "**:sunny:  - Pas de nuage mais à la place, une chaleur très forte pour la saison.**";
  let msg_type72 = "**:sunny:  - Pour une fois que l'on voudrait des nuages, il n'y en a aucun et une forte chaleur inahabituelle pour la saison s'installe.**";


  if(type_pluie === "neige"){
    msg_type1 = msg_type1.replace(":thunder_cloud_rain:",":cloud_snow: :dash:");
    msg_type2 = msg_type2.replace(":cloud_rain:",":cloud_snow:");
    msg_type3 = msg_type3.replace(":white_sun_rain_cloud:",":cloud_snow: :white_sun_cloud:");
    msg_type11 = msg_type11.replace(":thunder_cloud_rain:",":cloud_snow: :dash:");
    msg_type21 = msg_type21.replace(":cloud_rain:",":cloud_snow:");
    msg_type31 = msg_type31.replace(":white_sun_rain_cloud:",":cloud_snow: :white_sun_cloud:");
    msg_type12 = msg_type12.replace(":thunder_cloud_rain:",":cloud_snow: :dash:");
    msg_type22 = msg_type22.replace(":cloud_rain:",":cloud_snow:");
    msg_type32 = msg_type32.replace(":white_sun_rain_cloud:",":cloud_snow: :white_sun_cloud:");
  }


  var emote_matin = ""
  var emote_midi = ""
  var emote_soir = ""
  
  if(pluie_matin>=-100){
    matin = msg_type1;
    emote_matin = ":thunder_cloud_rain:"
    if(pluie_matin>=25){
      matin = msg_type2;
      emote_matin = ":cloud_rain:"
      if(pluie_matin>=45){
        matin = msg_type3;
        emote_matin = ":white_sun_rain_cloud:"
        if(pluie_matin>=50){
          matin = msg_type4;
          emote_matin = ":white_sun_cloud:"
          if(pluie_matin>=75){
            matin = msg_type5;
            emote_matin = ":white_sun_small_cloud:"
            if(pluie_matin>=80){
              matin = msg_type6;
              emote_matin = ":sunny:"
              if(pluie_matin>=120){
                matin = msg_type7;
                emote_matin = ":sunny:"
                temperature = temperature + 15;			
              }
            }
          }
        }
      }
    }
  }

  pluie_midi = pluie - 10;


  if(pluie_midi>=-100){
    midi = msg_type11;
    emote_midi = ":thunder_cloud_rain:"
    if(pluie_midi>=25){
      midi = msg_type21;
      emote_midi = ":cloud_rain:"
      if(pluie_midi>=45){
        midi = msg_type31;
        emote_midi = ":white_sun_rain_cloud:"
        if(pluie_midi>=50){
          midi = msg_type41;
          emote_midi = ":white_sun_cloud:"
          if(pluie_midi>=75){
            midi = msg_type51;
            emote_midi = ":white_sun_small_cloud:"
            if(pluie_midi>=80){
              midi = msg_type61;
              emote_midi = ":sunny:"
              if(pluie_midi>=120){
                midi = msg_type71;
                emote_midi = ":sunny:"
                temperature = temperature + 15;			
              }
            }
          }
        }
      }
    }
  }


  pluie_soir = pluie + 20;


  if(pluie_soir>=-100){
    soir = msg_type12;
    emote_soir = ":thunder_cloud_rain:"
    if(pluie_soir>=25){
      soir = msg_type22;
      emote_soir = ":cloud_rain:"
      if(pluie_soir>=45){
        soir = msg_type32;
        emote_soir = ":white_sun_rain_cloud:"
        if(pluie_soir>=50){
          soir = msg_type42;
          emote_soir = ":white_sun_cloud:"
          if(pluie_soir>=75){
            soir = msg_type52;
            emote_soir = ":white_sun_small_cloud:"
            if(pluie_soir>=80){
              soir = msg_type62;
              emote_soir = ":sunny:"
              if(pluie_soir>=120){
                soir = msg_type72;
                emote_soir = ":sunny:"
                temperature = temperature + 15;			
              }
            }
          }
        }
      }
    }
  }


  if(day >= 10){
    if(month === "04"){autre = "**La saison sèche approche à grand pas. Préparez-vous.**";}
    if(month === "07"){autre = "**L'humidité commence à remonter et l'on sent que bientôt, la pluie arrivera.**";}

    if(month === "02"){autre = "**La neige commence à fondre et l'on sent que le printemps va bientôt arriver.**";}
    if(month === "05"){autre = "**La température monte graduellement et l'on peut sentir que l'été approche à grand pas.**";}
    if(month === "08"){autre = "**Les feuilles commencent à jaunir et tombent lentement, l'automne arrive.**";}
    if(month === "11"){autre = "**La température baisse lentement et le froid s'installe progressivement dans la région.**";}
  } else {
    if(month === "05"){autre = "**La saison sèche est là. A vous points d'eau tout le monde.**";}
    if(month === "08"){autre = "**La moisson est arrivée ! Les champs sont prêts à être récoltés.**";}

    if(month === "03"){autre = "**Les fleurs s'ouvrent et la verdure repousse. Attention tout de même si vous allez en forêt.**";}
    if(month === "06"){autre = "**L'été est arrivé et la température monte.**";}
    if(month === "09"){autre = "**Les feuilles jaunissent et tombent, tapissant le sol d'orange et de marrons.**";}
    if(month === "12"){autre = "**Les premiers flocons de neige vont tomber et la température est déjà glaciale.**";}
  }

  if(pluie_matin <= 20){
    autre = "**Attention :** Vigilance, des dégâts matériels et humains peuvent être déplorés.";
    //client.channels.get('587298430569807914').send("**Une affiche holographique apparaît un peu partout et les soldats informent les personnes qui sortent du complexe d'un avertissement à la vigilance en raison de risque météorologique**")

    var vigilance_embed = (
      {
      embed : {
      "title": "Annonce météorologique.",
      "description": "**Avertissement météorologique**",
      "url": "",
      "color": 13644802,
      "footer": {
        "icon_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6VnXYQcovLUWsMaY7DuuUY9Iyex79tjKuQIzh4NaVvWXqWlH",
        "text": "ALERTE VIGILANCE !"
      },
      "thumbnail": {
        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6VnXYQcovLUWsMaY7DuuUY9Iyex79tjKuQIzh4NaVvWXqWlH"
      },
      "image": {
        "url": ""
      },
      "author": {
        "name": "Par le centre de recherche de l'empire",
        "url": "",
        "icon_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6VnXYQcovLUWsMaY7DuuUY9Iyex79tjKuQIzh4NaVvWXqWlH"
      },
      "fields": [
        {
          "name": "Bulletin affiché",
          "value": "Nous informons les membres de la colonie de prises de mesures en raison de graves et importants risques liés à des évènements climatique.\nEn raison de ces risques, l'accès à des zones peut vous être restreints en dehors du complexe notamment au lac et en forêt notamment.\nAfin d'éviter tout accident, nous vous conseillons de vous éloigner des zones les plus à risques et de, dans le cas échéant, vous munir de toutes les dispositions nécessaires afin de maintenir votre sécurité ainsi que ceux de votre entourage éventuel.\n\nMerci de votre attention.",
        }
        ]
      }
    })

    client.channels.get("587298430569807914").send(vigilance_embed)
  }


  const event = {
    "24/12":"\n\n**Ce soir, c'est le réveillon de noël**",
    "25/12":"\n\n**Joyeux Noël à tous !**",
    "31/10":"\n\n**Joyeux Halloween à tous !**",
    "31/12":"\n\n**Ce soir, c'est la nouvelle année ! Joyeux fêtes !**"
  };

  var event_date = day + "/" + month;
  if(event[event_date]) {
    autre = autre + event[event_date];
  }
  
  if(temperature > 34) {temperature = 34}
  console.log("\n" + 'Meteo command runned with success');
  console.log("\n" + '--------------------------------------------');
  console.log("\n" + '== Nouveau rapport météorologique ==');
  var d = new Date();
  var time_actually = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
  const logsChannel = client.channels.get('614929573636734976')
  logsChannel.send("Nouveau rapport météorologique publié à `" + time_actually + "` en date du `" + ask_date + ".\n**Détails du rapport :\nIndice dilluvien (matin/midi/soir)** : `" + pluie_matin + "/" + pluie_midi + "/" + pluie_soir + "`\n**Température : **`" + temperature + "` **C°**\n**Saison : **`" + season_a + "` (" + season + ")")
  console.log("\n" + 'Temps : ' + time_actually);
  console.log("\n" + '--------------------------------------------');
  console.log("\n" + 'Code couleur : ' + couleur);
  console.log("\n" + 'Icone : ' + icone);
  console.log("\n" + 'Date : ' + ask_date);
  console.log("\n" + 'Température : ' + temperature + "C°");
  console.log("\n" + 'Saison (' + season + ") : " + season_a);
  console.log("\n" + 'Indicateur dilluvien : ' + pluie_matin + "/" + pluie_midi + "/" + pluie_soir);
  console.log("\n" + '--------------------------------------------');

  const embed = {
    "title": "Annonce météorologique du cenntre météologique du système.",
    "description": "**Les prévisions de la journée annoncées par Grâce.**",
    "url": "",
    "color": couleur,
    "footer": {
      "icon_url": icone,
      "text": "Informations météorologiques du [" + ask_date + "]"
    },
    "thumbnail": {
      "url": icone
    },
    "image": {
      "url": ""
    },
    "author": {
      "name": "Par le centre de recherche et d'analyse météorologique.",
      "url": "",
      "icon_url": icone
    },
    "fields": [
      {
        "name": "Température",
        "value": temperature + " degrés celsius",
        "inline":true
      },
      {
        "name": "Saison (" + season + ")",
        "value": season_a,
        "inline":true
      },
      {
        "name": "Indices dilluvien",
        "value": "Matin (" + pluie_matin + ") - Midi (" + pluie_midi + ") - Soir (" + pluie_soir + ")",
        "inline":true
      },
      {
        "name": "Matin",
        "value": matin
      },
      {
        "name": "Midi",
        "value": midi
      },
      {
        "name": "Soir",
        "value": soir
      },
      {
        "name": "Autre",
        "value": autre
      }
    ]
  };

  /*var jingle = "https://cdn.glitch.com/df813b31-7108-4468-9f27-ca3574c399b7%2FFortisMusic_2.mp3"
  jingle = "./ressources/FortisMusic.mp3"
  client.channels.get('613990792481996800').send("**Un petit jingle retentit alors dans les couloirs du complexe, puis un rapport fut envoyé à tous les membres de la colonie.**", {
    embed,
    files: [jingle]
  });*/
  
  client.channels.get('613990792481996800').send("**Retrouver le récap des précédentes météo ici : https://colonia.glitch.me/meteo**", {embed})
  
  /*var coloniaGuild = client.guilds.get("587297215991775232")
  var voiceConnection = coloniaGuild.voiceConnection
  if(voiceConnection){
    voiceConnection.playFile(jingle)
  } else {
    var voiceChannel = client.channels.get("587298734509916170")
    if (voiceChannel){
      voiceChannel.join().then(connection => {
        connection.playFile(jingle)
      }).catch(e => {
        console.error(e);
      });
    }
  }*/
  
  db.get('SELECT COUNT(*) AS NB_METEO from meteo WHERE date = "'+ask_date+'" LIMIT 1', function(err, meteo_count) {
    if(meteo_count && meteo_count['NB_METEO'] > 0){
      //var emote_matin = matin.split(' ')
      //emote_matin = emote_matin[0].replace(/\*/g, "")
      //emote_matin = emote_matin.replace(/ /g, "")
      //var emote_midi = midi.split(' ')
      //emote_midi = emote_midi[0].replace(/\*/g, "")
      //emote_midi = emote_midi.replace(/ /g, "")
      //var emote_soir = soir.split(' ')
      //emote_soir = emote_soir[0].replace(/\*/g, "")
      //emote_soir = emote_soir.replace(/ /g, "")
      db.get('SELECT * from meteo WHERE date = "'+ask_date+'" LIMIT 1', function(err, meteo) {
        if(meteo){
          db.run('UPDATE meteo SET matin="'+emote_matin+'", midi="'+emote_midi+'", soir="'+emote_soir+'", temperature="'+temperature+'" WHERE date = "'+ask_date+'"')
        }
      })
    } else {
      db.run('INSERT INTO meteo (date, matin, midi, soir, temperature) VALUES ("'+ask_date+'", "'+emote_matin+'", "'+emote_midi+'", "'+emote_soir+'", "'+temperature+'")')
    }
  })
  //message.channel.send("https://www.calendrier-lunaire.fr/api/moon.php?font=FFFFFF&bg=24405D&border=000000&format=2")
  /*var roliste_mention = "<@&"+config.roliste+">";
  message.channel.send(roliste_mention);*/
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