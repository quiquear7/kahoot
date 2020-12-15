document.addEventListener('deviceready',function(){

	let user = null;
	let db = null;
	let ref = 0;
	let ref_pregunta = 1;
	let ref_prof = 0;
	let refmod = null;
	let tipo_pregunta = "";

	getRedirectResult();
	document.querySelector('#btn_google_login').addEventListener('click',function(){
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider).then(()=>{
			getRedirectResult();
		});
	});

	document.querySelector('#btn_cancel').addEventListener('click',function(){
		document.querySelector('#page_add_game').style.display = 'none';
		document.querySelector('#page_main').style.display = 'block';
	});

	document.querySelector('#btn_add_task').addEventListener('click',function(){
		document.querySelector('#page_add_game').style.display = 'block';
		document.querySelector('#preguntas').style.display = 'none';
		document.querySelector('#page_main').style.display = 'none';
	});



	document.querySelector('#btn_done_add').addEventListener('click',function(){
		//var juegos_ref = db.ref("/juegos");
		var task_name = document.querySelector("#game_name").value;
	//	var image = document.getElementById('file').value;
		if(refmod==null){

			firebase.database().ref("/juegos/"+ref).set(
			{
    		user:user.email,
				name:task_name,
				referencia: ref
			});
			ref = ref++;
		}

		document.querySelector('#page_add_game').style.display = 'none';
		document.querySelector('#preguntas').style.display = 'none';
		document.querySelector('#page_main').style.display = 'block';
		document.querySelector("#game_name").value = "";
	});

	function pregunta(id){
		let identificador = id.split("p");
		//var juegos_ref = db.ref("/juegos");
		var task_name = document.querySelector("#question").value;
	/*	var file = document.getElementById("file").files[0];
  	var reader = new FileReader();
  	reader.onload = function(event) {
    var img = document.getElementById('img');
    img.src= event.target.result;
  	}
  	reader.readAsDataURL(file);

*/		let respuesta = new Array();
		if(tipo_pregunta=="opciones"){

			var opcionA = document.querySelector("#opcion_a").value;
			var opcionB = document.querySelector("#opcion_b").value;
			var opcionC = document.querySelector("#opcion_c").value;
			var opcionD = document.querySelector("#opcion_d").value;

		var check = document.querySelectorAll('.checkbox');//obtenemos botone done
		
			for(var i = 0; i < check.length; i++) {
				if (check[i].checked){
					if(i==2 && opcionC!="" || i==3 && opcionD!="" || i==0 || i==1) {
						respuesta.push(i);
					}
				}
			}
		}

		if(tipo_pregunta=="si_no"){
		radio
		var radio = document.querySelectorAll('.radio'); //obtenemos bootnes remove
  		for(var i = 0; i < radio.length; i++) {
   			if(radio[i].checked){
   				respuesta.push(radio[i].value);

   			}
  		}
    		
    	}

	//	var image = document.getElementById('imagen');
		const input = document.getElementById('file');
   		
       
    	if(tipo_pregunta!="" && task_name !="" && respuesta.length > 0){
    		if(refmod==null){

			firebase.database().ref("/juegos/"+identificador[1]+"/preguntas/"+task_name).set(
			{
				juego: identificador[1],
				tipo: tipo_pregunta,
				pregunta:task_name,
				respuesta: respuesta,
				//imagen: reader.result
			});
		}
		if(tipo_pregunta=="opciones"){
    			firebase.database().ref("/juegos/"+identificador[1]+"/preguntas/"+task_name+"/opciones").set(
			{
			opcion_a: opcionA,
			opcion_b: opcionB,
			opcion_c: opcionC,
			opcion_d: opcionD
		});
    	}

		document.querySelector('#preguntas').style.display = 'none';
		document.querySelector('#page_main').style.display = 'block';
    	}
    	else{
    		alert("Datos incorrectos");
    		document.querySelector('#preguntas').style.display = 'block';
			document.querySelector('#page_main').style.display = 'none';
			document.querySelector("#question").value = '';
			document.querySelector("#tiempopregunta").value = '';
			document.querySelector("#opcion_a").value = '';
			document.querySelector("#opcion_b").value = '';
			document.querySelector("#opcion_c").value = '';
			document.querySelector("#opcion_d").value = '';
    	}

		
	}

	function manejadorRemove(event) {
  		removeTask(event.target.id);
	}
	function manejadorMod(event) {
		console.log("manejador");
  		mod(event.target.id);
	}

	function manejadorEmpezar(event) {
		console.log("manejador");
  		Empezar(event.target.id);
	}

	function manejadorPregunta(event) {
		console.log("manejador");
			mostrar_preguntas(event.target.id);
	}

	function añadirPregunta(event) {
		console.log("manejador");
			pregunta(event.target.id);
	}

	function mostrar_preguntas(id){
		document.querySelector('#preguntas').style.display = 'block';
		document.querySelector('#page_main').style.display = 'none';
		const page_main = document.querySelector('#preguntas_btn');
		page_main.innerHTML = "";

		let el = document.createElement('p');
		let pid = id;
		el.innerHTML += "<br>"
		el.innerHTML+="<button id='"+pid+"' class='p mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Añadir Pregunta </button>";
		page_main.appendChild(el);
		var p = document.querySelectorAll('.p');//obtenemos botone done
		document.querySelector('#page_main').style.display = 'none';
		for(var i = 0; i < p.length; i++) {
			p[i].addEventListener('click', añadirPregunta);//cauturamos el evento click
		}
	}

	function Empezar(id){
		let refremove = id.split("e");
		let identificador = refremove[1];

		cordova.plugins.qrcodejs.encode('TEXT_TYPE', identificador, (base64EncodedQRImage) => {
			document.querySelector('#page_main').style.display = 'none';
			document.querySelector('#qr').style.display = 'block';
			const qr = document.querySelector('#qr');
			qr.innerHTML="";
			let el = document.createElement('p');
			el.innerHTML +="Esperando a que se unan jugadores"
			el.innerHTML += "<br></br>";
			el.innerHTML += "<img class=imagen src='"+base64EncodedQRImage+"'/>";
			el.innerHTML += "<br></br>";
			el.innerHTML += "<button id='"+identificador+"' class='bempezar mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Empezar </button>";
			el.innerHTML += "<button id='cancelarqr' class='bempezar mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Cancelar </button>";
			qr.appendChild(el);

			document.querySelector('#cancelarqr').addEventListener('click',function(){
				firebase.database().ref("/juegos/"+identificador+"/jugadores/").remove();
				document.querySelector('#page_main').style.display = 'block';
				document.querySelector('#qr').style.display = 'none';

			});
			let jugadores_ref = db.ref("/juegos/"+identificador+"/jugadores/");
			jugadores_ref.on('child_added',jugadores);
			jugadores_ref.on('child_changed',jugadores);
    
    }, (err) => {
    });



	}

	function jugadores(child_snapshot, prev_child_key){
		let data = child_snapshot.val();
		const page_main = document.querySelector('#qr');
		if(data!=null){
			let el = document.createElement('p');
			el.innerHTML += data;
			console.log(data);
			page_main.appendChild(el)
		}
		
		
	}

	function removeTask(id){
		let refremove = id.split("r");
		console.log(refremove);
		firebase.database().ref("/juegos/"+refremove[1]).remove();
		document.getElementById(refremove[1]).style.display = 'none';
	}

	function mod(id){
		refmod = id.split("m");
		console.log(refmod);
		document.querySelector('#page_add_task').style.display = 'block';
		document.querySelector('#page_main').style.display = 'none';
	}

	var select = document.getElementById('tipo_pregunta');
		select.addEventListener('change',
  		function(){
  			

    		var selectedOption = this.options[select.selectedIndex];
    		tipo_pregunta = selectedOption.value;
    		if(selectedOption.value=="opciones"){
    			document.querySelector('#respuestas').style.display = 'block';
				document.querySelector('#si_no').style.display = 'none';
    		}
    		if(selectedOption.value=="si_no"){
    			document.querySelector('#si_no').style.display = 'block';
				document.querySelector('#respuestas').style.display = 'none';
    		}

    		if(selectedOption.value=="abierta"){
    			document.querySelector('#si_no').style.display = 'none';
				document.querySelector('#respuestas').style.display = 'none';
    		}

 	 });

	function add_juegos(child_snapshot, prev_child_key){
		let data = child_snapshot.val();
		const page_main = document.querySelector('#page_main');
		if(data.user == user.email ){
			let newDiv = document.createElement("div");
			newDiv.id = data.referencia;
			newDiv.className += "demo-card-wide mdl-card mdl-shadow--2dp";
			let el = document.createElement('p');
			let rid = "r"+data.referencia;
			let mid = "m"+data.referencia;
			let eid = "e"+data.referencia;
			let pid = "p"+data.referencia;
			el.innerHTML+= "  "+data.name;
			el.innerHTML += "<br>";
			el.innerHTML+="<br>";
			el.innerHTML+="<button id='"+mid+"' class='bmod margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'>Modificar</button>";
			
			el.innerHTML+="<button id='"+rid+"' class='bremove margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' >Eliminar </button>";
			el.innerHTML+="<br>";
			el.innerHTML+="<br>";
			el.innerHTML+="<button id='"+pid+"' class='bp margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' >Pregunta </button>";
			el.innerHTML+="<button id='"+eid+"' class='bempezar margen mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent' > Empezar </button>";
			newDiv.appendChild(el);
			page_main.appendChild(newDiv);
			let p = document.createElement('p');
			p.innerHTML+= "<br>";
			page_main.appendChild(p)
		}

		ref = data.referencia+1;
		var bremove = document.querySelectorAll('.bremove'); //obtenemos bootnes remove
  		for(var i = 0; i < bremove.length; i++) {
   			bremove[i].addEventListener('click', manejadorRemove);//capturamos el evento click
  		}
  		var bmod = document.querySelectorAll('.bmod');//obtenemos botone done
  		for(var i = 0; i < bmod.length; i++) {
   			bmod[i].addEventListener('click', manejadorMod);//cauturamos el evento click
  		}
			var bp = document.querySelectorAll('.bp');//obtenemos botone done
  		for(var i = 0; i < bp.length; i++) {
   			bp[i].addEventListener('click', manejadorPregunta);//cauturamos el evento click
  		}
			var e = document.querySelectorAll('.bempezar');//obtenemos botone done
  		for(var i = 0; i < e.length; i++) {
   			e[i].addEventListener('click', manejadorEmpezar);//cauturamos el evento click
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

	function rem_tareas(child_snapshot, prev_child_key){
		let data = child_snapshot.val();
		const page_main = document.querySelector('#page_main');
		const newDiv = document.getElementById(data.referencia);
		newDiv.innerHTML="";
	}


	function getRedirectResult(){
		let id = 0;
		firebase.auth().getRedirectResult().then((result)=>{
			if(result.credential){
				document.querySelector('#page_login').style.display = 'none';
				document.querySelector('#page_main').style.display = 'block';
				user = result.user;
				db = firebase.database();
				db.ref("/profesores/"+user.uid).set(
				{
					name: user.email
				});
				let juegos_ref = db.ref("/juegos");

				//const page_main_foto = document.querySelector('#page_main_foto');
				let p = document.createElement('p');
				p.innerHTML += user.displayName;
				p.innerHTML += "<br>";
				p.innerHTML += "<br></br>"
				juegos_ref.on('child_added',add_juegos);
				//juegos_ref.on('child_changed',up_tareas);
				juegos_ref.on('child_removed',rem_tareas);
			}
		}).catch((error)=>{
			console.log(error);
		});
	}
});
