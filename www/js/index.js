document.addEventListener('deviceready', function() {

  let user = null;
  let db = null;
  let ref = 0;
  let ref_pregunta = 1;
  let ref_prof = 0;
  let refmod = null;
  let tipo_pregunta = "";
  let tiempo = null;
  let preguntasarr = new Array();
  getRedirectResult();
  document.querySelector('#btn_google_login').addEventListener('click', function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(() => {
      getRedirectResult();
    });
  });

  document.querySelector('#btn_cancel').addEventListener('click', function() {
    document.querySelector('#page_add_game').style.display = 'none';
    document.querySelector('#page_main').style.display = 'block';
  });

  document.querySelector('#btn_add_task').addEventListener('click', function() {
    document.querySelector('#page_add_game').style.display = 'block';
    document.querySelector('#preguntas').style.display = 'none';
    document.querySelector('#page_main').style.display = 'none';
  });



  document.querySelector('#btn_done_add').addEventListener('click', function() {
    //var juegos_ref = db.ref("/juegos");
    var task_name = document.querySelector("#game_name").value;
    //	var image = document.getElementById('file').value;
    let id = ref;
    if (refmod == null) {
      firebase.database().ref("/juegos/" + ref).set({
        user: user.email,
        name: task_name,
        referencia: ref,


      });

      firebase.database().ref("/juegos/" + id + "/estado").set({
        iniciado: 0
      });
      ref = ref++;
    }

    document.querySelector('#page_add_game').style.display = 'none';
    document.querySelector('#preguntas').style.display = 'none';
    document.querySelector('#page_main').style.display = 'block';
    document.querySelector("#game_name").value = "";
  });

  function pregunta(id) {
    let identificador = id.split("p");
    //var juegos_ref = db.ref("/juegos");
    var task_name = document.querySelector("#question").value;

    let respuesta = new Array();
    let puntos = null;
    let espunto = 1;
    if (tipo_pregunta == "opciones") {

      var opcionA = document.querySelector("#opcion_a").value;
      var opcionB = document.querySelector("#opcion_b").value;
      var opcionC = document.querySelector("#opcion_c").value;
      var opcionD = document.querySelector("#opcion_d").value;

      if (opcionA != "" && opcionB != "") {
        puntos = document.getElementById('puntoopcion').value;
        if (isNaN(parseInt(puntos))) {
          espunto = 0;
        }
      }


      var opradio = document.querySelectorAll('.opciones'); //obtenemos bootnes remove
      for (var i = 0; i < opradio.length; i++) {
        if (opradio[i].checked) {
          if (i == 2 && opcionC != "" || i == 3 && opcionD != "" || i == 0 || i == 1) {
            respuesta.push(opradio[i].value);
          }
        }
      }
    }

    if (tipo_pregunta == "si_no") {
      var radio = document.querySelectorAll('.radio'); //obtenemos bootnes remove
      for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
          respuesta.push(radio[i].value);
          puntos = document.getElementById('puntoradio').value;
          if (isNaN(parseInt(puntos))) {
            espunto = 0;
          }
        }
      }
    }

    //  var oFReader = new FileReader();
    //oFReader.readAsDataURL();
    /*let imagensrc = null;
    if (document.getElementById("file").files[0]!=null){
    	imagensrc = URL.createObjectURL(document.getElementById("file").files[0]);
    	imagen = imagensrc.split("blob:");

    }*/
    //var imagen = document.getElementById("file").files[0];

    var inputFile = document.getElementById('file');
    //inputFile.addEventListener('change', mostrarImagen, false);

    var imagen = "";
    console.log("mostrarImagen");
    var file = inputFile.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      console.log(event.target.result);
      imagen = event.target.result;
    }
    reader.readAsDataURL(file);

    console.log(imagen);
    if (imagen == null) {
      imagen = "";
    }
    const input = document.getElementById('file');
    let tiempo = document.getElementById('tiempopregunta').value;
    let esnumero = 1;
    if (isNaN(parseInt(tiempo))) {
      esnumero = 0;
    }

    if ((tipo_pregunta != "" && task_name != "" && respuesta.length > 0 && esnumero == 1 && espunto == 1) || (tipo_pregunta == "abierta" && task_name != "" && esnumero == 1)) {
      if (refmod == null) {
        if (tipo_pregunta != "abierta") {
          firebase.database().ref("/juegos/" + identificador[1] + "/preguntas/" + task_name).set({
            juego: identificador[1],
            tipo: tipo_pregunta,
            tiempo: tiempo,
            puntos: puntos,
            pregunta: task_name,
            respuesta: respuesta,
            imagen: imagen
          });
          reader.onload = function(event) {
            console.log(event.target.result);
            imagen = event.target.result;
            firebase.database().ref("/juegos/" + identificador[1] + "/preguntas/" + task_name).update({
              juego: identificador[1],
              tipo: tipo_pregunta,
              tiempo: tiempo,
              puntos: puntos,
              pregunta: task_name,
              respuesta: respuesta,
              imagen: imagen
            });
          }

        } else {
          firebase.database().ref("/juegos/" + identificador[1] + "/preguntas/" + task_name).set({
            juego: identificador[1],
            tipo: tipo_pregunta,
            tiempo: tiempo,
            puntos: "no hay",
            pregunta: task_name,
            respuesta: "",
            imagen: imagen
          });
          reader.onload = function(event) {
            console.log(event.target.result);
            imagen = event.target.result;
            firebase.database().ref("/juegos/" + identificador[1] + "/preguntas/" + task_name).update({
              juego: identificador[1],
              tipo: tipo_pregunta,
              tiempo: tiempo,
              puntos: "no hay",
              pregunta: task_name,
              respuesta: "",
              imagen: imagen
            });
          }
        }
      }


      if (tipo_pregunta == "opciones") {
        firebase.database().ref("/juegos/" + identificador[1] + "/preguntas/" + task_name + "/opciones").set({
          opcion_a: opcionA,
          opcion_b: opcionB,
          opcion_c: opcionC,
          opcion_d: opcionD
        });
      } else {
        firebase.database().ref("/juegos/" + identificador[1] + "/preguntas/" + task_name + "/opciones").set({
          opcion: "otro",
        });
      }

      document.querySelector('#preguntas').style.display = 'none';
      document.querySelector('#page_main').style.display = 'block';
      document.querySelector("#question").value = '';
      document.querySelector("#tiempopregunta").value = '';
      document.querySelector("#opcion_a").value = '';
      document.querySelector("#opcion_b").value = '';
      document.querySelector("#opcion_c").value = '';
      document.querySelector("#opcion_d").value = '';
    } else {
      alert("Datos incorrectos");
      document.querySelector('#preguntas').style.display = 'block';
      document.querySelector('#page_main').style.display = 'none';
    }
  }

  function manejadorRemove(event) {
    removeTask(event.target.id);
  }

  function manejadorMod(event) {

    mod(event.target.id);
  }

  function manejadorEmpezar(event) {

    Empezar(event.target.id);
  }

  function manejadorPregunta(event) {

    mostrar_preguntas(event.target.id);
  }

  function añadirPregunta(event) {

    pregunta(event.target.id);
  }

  function mostrar_preguntas(id) {
    document.querySelector('#preguntas').style.display = 'block';
    document.querySelector('#page_main').style.display = 'none';
    const page_main = document.querySelector('#preguntas_btn');
    page_main.innerHTML = "";

    let el = document.createElement('p');
    let pid = id;
    el.innerHTML += "<br>"
    el.innerHTML += "<button id='" + pid + "' class='p mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Añadir Pregunta </button>";
    el.innerHTML += "<button id='cancelarpr' class='bempezar margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Cancelar </button>";



    page_main.appendChild(el);
    var p = document.querySelectorAll('.p'); //obtenemos botone done
    document.querySelector('#page_main').style.display = 'none';
    for (var i = 0; i < p.length; i++) {
      p[i].addEventListener('click', añadirPregunta); //cauturamos el evento click
    }

    document.querySelector('#cancelarpr').addEventListener('click', function() {
      document.querySelector('#page_main').style.display = 'block';
      document.querySelector('#preguntas').style.display = 'none';
      document.querySelector("#question").value = '';
      document.querySelector("#tiempopregunta").value = '';
      document.querySelector("#opcion_a").value = '';
      document.querySelector("#opcion_b").value = '';
      document.querySelector("#opcion_c").value = '';
      document.querySelector("#opcion_d").value = '';
    });
  }

  function Empezar(id) {
    let refremove = id.split("e");
    let identificador = refremove[1];
    firebase.database().ref("/juegos/" + identificador + "/jugadores/").remove();
    firebase.database().ref("/juegos/" + identificador + "/resultados").remove();
    cordova.plugins.qrcodejs.encode('TEXT_TYPE', identificador, (base64EncodedQRImage) => {
      document.querySelector('#page_main').style.display = 'none';
      document.querySelector('#qr').style.display = 'block';
      document.querySelector('#jugadores').style.display = 'block';
      const qr = document.querySelector('#qr');
      qr.innerHTML = "";
      let el = document.createElement('p');
      el.innerHTML += "Esperando a que se unan jugadores";
      el.innerHTML += "<br></br>";
      el.innerHTML += "<img class=imagen src='" + base64EncodedQRImage + "'/>";
      el.innerHTML += "<br></br>";
      el.innerHTML += "<button id='empezarjuego' class='bempezar margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Empezar </button>";
      el.innerHTML += "<button id='cancelarqr' class='bempezar margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Cancelar </button>";
      qr.appendChild(el);


      document.querySelector('#empezarjuego').addEventListener('click', function() {

        document.querySelector('#page_main').style.display = 'none';
        document.querySelector('#qr').style.display = 'none';
        document.querySelector('#jugadores').style.display = 'none';
        document.querySelector('#juego_en_curso').style.display = 'block';
        document.querySelector('#tiempo_pregunta').style.display = 'block';
        let preguntas = db.ref("/juegos/" + identificador + "/preguntas");
        preguntas.once("value").then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            preguntasarr.push(doc.val());
          });
        });
        document.querySelector('#proxima_pregunta').style.display = 'block';
        let juego = document.querySelector('#proxima_pregunta');
        juego.innerHTML = "";
        let p = document.createElement("p");
        p.innerHTML += "<br></br>";
        p.innerHTML += "<br></br>";
        p.innerHTML += "<br></br>";

        p.innerHTML += "<button id='proximapregunta' class='prpregunta margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Pregunta </button>";
        juego.appendChild(p);
        document.querySelector('#proximapregunta').addEventListener('click', preg);

      });

      function preg() {
        document.querySelector('#proxima_pregunta').style.display = 'none';
        document.querySelector('#respuesta_correcta').style.display = 'none';
        firebase.database().ref("/juegos/" + identificador + "/estado").update({
          iniciado: 1
        });
        //firebase.database().ref("/juegos/"+preguntasarr[0].juego+"/preguntaActual").remove();
        firebase.database().ref("/juegos/" + preguntasarr[0].juego + "/preguntaActual").set({
          juego: preguntasarr[0].juego,
          tipo: preguntasarr[0].tipo,
          tiempo: preguntasarr[0].tiempo,
          puntos: preguntasarr[0].puntos,
          pregunta: preguntasarr[0].pregunta,
          respuesta: preguntasarr[0].respuesta,
          opciones: preguntasarr[0].opciones,
          imagen: preguntasarr[0].imagen
          //imagen: reader.result
        });
        jugar(preguntasarr[0]);
        preguntasarr.shift();
      }

      function jugar(doc) {
        let juego = document.querySelector('#juego_en_curso');
        document.querySelector('#juego_en_curso').style.display = 'block';
        document.querySelector('#tiempo_pregunta').style.display = 'block';
        juego.innerHTML = "";
        let p = document.createElement("p");
        p.innerHTML += "<img class=imagen src='" + doc.imagen + "' />";
        p.innerHTML += "<h4>" + doc.pregunta + "</h4>";
        juego.appendChild(p);
        start(doc.tiempo, doc);
      }



      function mostrarResultados(doc) {
        firebase.database().ref("/juegos/" + identificador + "/estado").update({
          iniciado: 0
        });
        document.querySelector('#juego_en_curso').style.display = 'none';
        document.querySelector('#tiempo_pregunta').style.display = 'none';
        document.querySelector('#respuesta_correcta').style.display = 'block';
        let respuesta = doc.respuesta[0];

        if (doc.tipo == "opciones") {
          if (doc.respuesta[0] == 0) {
            respuesta = doc.opciones.opcion_a;
          }
          if (doc.respuesta[0] == 1) {
            respuesta = doc.opciones.opcion_b;
          }
          if (doc.respuesta[0] == 2) {
            respuesta = doc.opciones.opcion_c
          }
          if (doc.respuesta[0] == 3) {
            respuesta = doc.opciones.opcion_d;
          }
        }
        let respuesta_correcta = document.querySelector('#respuesta_correcta');
        respuesta_correcta.innerHTML = "";
        let parrafo = document.createElement("p");
        if (doc.tipo != "abierta") {
          parrafo.innerHTML += "RESPUESTA CORRECTA:   ";
          parrafo.innerHTML += "<h4>" + respuesta + "</h4>";
        }
        parrafo.innerHTML += "<br></br>";
        parrafo.innerHTML += "PUNTUACIÓN";
        parrafo.innerHTML += "<br></br>";
        let resultados = db.ref("/juegos/" + doc.juego + "/resultados");
        resultados.once("value").then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            let puntos = doc.val();
            parrafo.innerHTML += puntos.email + " ----- " + puntos.puntos + " puntos";
            parrafo.innerHTML += "<br></br>";
          });
        });

        respuesta_correcta.appendChild(parrafo);
        if (preguntasarr.length > 0) {
          document.querySelector('#proxima_pregunta').style.display = 'block';
        }
      }



      let timer = null;

      function start(time, doc) {
        tiempo = time * 1000;
        let timediv = document.querySelector('#tiempo_pregunta');
        timediv.innerHTML = "";
        let p = document.createElement("p");
        firebase.database().ref("/juegos/" + doc.juego + "/preguntaActual").update({
          tiempo: tiempo
        });
        p.innerHTML += "Tiempo Restante:  " + tiempo / 1000;
        timediv.appendChild(p);
        timer = setInterval(() => {
          tiempo -= 1000;
          let timediv = document.querySelector('#tiempo_pregunta');
          timediv.innerHTML = "";
          let p = document.createElement("p");
          firebase.database().ref("/juegos/" + doc.juego + "/preguntaActual").update({
            tiempo: tiempo
          });
          p.innerHTML += "Tiempo Restante:  " + tiempo / 1000;
          timediv.appendChild(p);
          if (tiempo == 0) {
            stop();
            mostrarResultados(doc);
          }
        }, 1000);
      }




      function stop() {
        clearInterval(timer);
        timer = null;
      }

      document.querySelector('#cancelarqr').addEventListener('click', function() {
        firebase.database().ref("/juegos/" + identificador + "/jugadores/").remove();
        document.querySelector('#page_main').style.display = 'block';
        document.querySelector('#qr').style.display = 'none';
        document.querySelector('#jugadores').style.display = 'none';

      });
      let jugadores_ref = db.ref("/juegos/" + identificador + "/jugadores/");
      jugadores_ref.on('child_added', jugadores);
      jugadores_ref.on('child_changed', jugadores);
      jugadores_ref.on('child_removed', borrarjugador);
    }, (err) => {

    });
  }



  function jugadores(child_snapshot, prev_child_key) {
    let data = child_snapshot.val();
    const page_main = document.querySelector('#jugadores');
    page_main.innerHTML = "";
    if (data != null) {
      let el = document.createElement('p');
      el.innerHTML += data;

      page_main.appendChild(el)
    }


  }

  function borrarjugador(child_snapshot, prev_child_key) {
    let data = child_snapshot.val();
    const page_main = document.querySelector('#jugadores');
    page_main.innerHTML = "";
  }

  function removeTask(id) {
    let refremove = id.split("r");

    firebase.database().ref("/juegos/" + refremove[1]).remove();
    document.getElementById(refremove[1]).style.display = 'none';
  }

  function mod(id) {
    refmod = id.split("m");

    document.querySelector('#page_add_task').style.display = 'block';
    document.querySelector('#page_main').style.display = 'none';
  }

  var select = document.getElementById('tipo_pregunta');
  select.addEventListener('change',
    function() {


      var selectedOption = this.options[select.selectedIndex];
      tipo_pregunta = selectedOption.value;
      if (selectedOption.value == "opciones") {
        document.querySelector('#respuestas').style.display = 'block';
        document.querySelector('#si_no').style.display = 'none';
      }
      if (selectedOption.value == "si_no") {
        document.querySelector('#si_no').style.display = 'block';
        document.querySelector('#respuestas').style.display = 'none';
      }

      if (selectedOption.value == "abierta") {
        document.querySelector('#si_no').style.display = 'none';
        document.querySelector('#respuestas').style.display = 'none';
      }

    });

  function add_juegos(child_snapshot, prev_child_key) {
    let data = child_snapshot.val();
    const page_main = document.querySelector('#page_main');
    if (data.user == user.email) {
      let newDiv = document.createElement("div");
      newDiv.id = data.referencia;
      newDiv.className += "demo-card-wide mdl-card mdl-shadow--2dp";
      let el = document.createElement('p');
      let rid = "r" + data.referencia;
      let mid = "m" + data.referencia;
      let eid = "e" + data.referencia;
      let pid = "p" + data.referencia;
      el.innerHTML += "  " + data.name;
      el.innerHTML += "<br>";
      el.innerHTML += "<br>";
      el.innerHTML += "<button id='" + mid + "' class='bmod margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'>Modificar</button>";

      el.innerHTML += "<button id='" + rid + "' class='bremove margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' >Eliminar </button>";
      el.innerHTML += "<br>";
      el.innerHTML += "<br>";
      el.innerHTML += "<button id='" + pid + "' class='bp margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' >Pregunta </button>";
      el.innerHTML += "<button id='" + eid + "' class='bempezar margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Empezar </button>";
      newDiv.appendChild(el);
      page_main.appendChild(newDiv);
      let p = document.createElement('p');
      p.innerHTML += "<br>";
      page_main.appendChild(p)
    }

    ref = data.referencia + 1;
    var bremove = document.querySelectorAll('.bremove'); //obtenemos bootnes remove
    for (var i = 0; i < bremove.length; i++) {
      bremove[i].addEventListener('click', manejadorRemove); //capturamos el evento click
    }
    var bmod = document.querySelectorAll('.bmod'); //obtenemos botone done
    for (var i = 0; i < bmod.length; i++) {
      bmod[i].addEventListener('click', manejadorMod); //cauturamos el evento click
    }
    var bp = document.querySelectorAll('.bp'); //obtenemos botone done
    for (var i = 0; i < bp.length; i++) {
      bp[i].addEventListener('click', manejadorPregunta); //cauturamos el evento click
    }
    var e = document.querySelectorAll('.bempezar'); //obtenemos botone done
    for (var i = 0; i < e.length; i++) {
      e[i].addEventListener('click', manejadorEmpezar); //cauturamos el evento click
    }
  }



  /*
  	function up_tareas(child_snapshot, prev_child_key){
  		console.log("MOD");
  		let data = child_snapshot.val();
  		const page_main = document.querySelector('#page_main');
  		const newDiv = document.getElementById(data.referencia);
  		newDiv.innerHTML="";
  		if(data.user == user.email ){
  			newDiv.id = data.referencia;
  			let el = document.createElement('p');
  			let rid = "r"+data.referencia;
  			let mid = "m"+data.referencia;
  			let eid = "e"+data.referencia;
  			el.innerHTML+= data.name;
  			el.innerHTML += "<br>";
  			el.innerHTML+="<br>";
  			el.innerHTML+="<button id='"+mid+"' class='bmod'> Modificar </button>";
  			el.innerHTML+="<button id='"+rid+"' class='bremove' > Eliminar </button>";
  			el.innerHTML+="<button id='"+eid+"' class='bempezar' > Empezar  </button>";

  			newDiv.appendChild(el);
  			page_main.appendChild(newDiv);
  		}
  		var bremove = document.querySelectorAll('.bremove'); //obtenemos bootnes remove
    		for(var i = 0; i < bremove.length; i++) {
     			bremove[i].addEventListener('click', manejadorRemove);//capturamos el evento click
    		}
    		var bmod = document.querySelectorAll('.bmod');//obtenemos botone done
    		for(var i = 0; i < bmod.length; i++) {
     			bmod[i].addEventListener('click', manejadorMod);//cauturamos el evento click
    		}
  			var bem = document.querySelectorAll('.bempezar');//obtenemos botone done
    		for(var i = 0; i < bmod.length; i++) {
     			bem[i].addEventListener('click', manejadorEmpezar);//cauturamos el evento click
    		}
  	}
  */

  function rem_tareas(child_snapshot, prev_child_key) {
    let data = child_snapshot.val();
    const page_main = document.querySelector('#page_main');
    /*	const newDiv = document.getElementById(data.referencia);
    	newDiv.innerHTML="";*/
    const newDi = document.getElementById(data.referencia).style.display = 'none';
  }


  function getRedirectResult() {
    let id = 0;
    firebase.auth().getRedirectResult().then((result) => {
      if (result.credential) {
        document.querySelector('#page_login').style.display = 'none';
        document.querySelector('#page_main').style.display = 'block';
        user = result.user;
        db = firebase.database();
        db.ref("/profesores/" + user.uid).set({
          name: user.email
        });
        let juegos_ref = db.ref("/juegos");

        let p = document.createElement('p');
        p.innerHTML += user.displayName;
        p.innerHTML += "<br>";
        p.innerHTML += "<br></br>"
        juegos_ref.on('child_added', add_juegos);
        //juegos_ref.on('child_changed',up_tareas);
        juegos_ref.on('child_removed', rem_tareas);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
});
