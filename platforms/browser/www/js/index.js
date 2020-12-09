document.addEventListener('deviceready',function(){

	let user = null;
	let db = null;
	let ref = 0;
	let ref_pregunta = 1;
	let ref_prof = 0;
	let refmod = null;
	getRedirectResult();
	document.querySelector('#btn_google_login').addEventListener('click',function(){
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider).then(()=>{
			getRedirectResult();
		});
	});

/*	document.querySelector('#btn_cancel_add').addEventListener('click',function(){
		document.querySelector('#page_add_task').style.display = 'none';
		document.querySelector('#page_main').style.display = 'block';
	});*/

	document.querySelector('#btn_add_task').addEventListener('click',function(){
		document.querySelector('#page_add_game').style.display = 'block';
		document.querySelector('#preguntas').style.display = 'block';
		document.querySelector('#page_main').style.display = 'none';
	});



	document.querySelector('#btn_done_add').addEventListener('click',function(){
		//var juegos_ref = db.ref("/juegos");
		var task_name = document.querySelector("#game_name").value;
	//	var image = document.getElementById('imagen');
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
		document.querySelector('#page_main').style.display = 'block';
		document.querySelector("#game_name").value = "";
	});

	function pregunta(id){
		let identificador = id.split("p");
		//var juegos_ref = db.ref("/juegos");
		var task_name = document.querySelector("#question").value;
	//	var image = document.getElementById('imagen');
		if(refmod==null){

			firebase.database().ref("/juegos/"+identificador[1]+"/preguntas/"+task_name).set(
			{
				juego: identificador[1],
				pregunta:task_name
			});
		}

		document.querySelector('#preguntas').style.display = 'none';
		document.querySelector('#page_main').style.display = 'block';
		document.querySelector("#question").value = "";
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
		/*
		el.innerHTML += "<label for=\"question\">Pregunta </label>";
		el.innerHTML += "<input type=\"text\" id=\"question\" name=\"question\" />";
*/

		let pid = id;
		el.innerHTML+="<button id='"+pid+"' class='p' > Añadir Preguta </button>";
		page_main.appendChild(el);
		var p = document.querySelectorAll('.p');//obtenemos botone done
		for(var i = 0; i < p.length; i++) {
			p[i].addEventListener('click', añadirPregunta);//cauturamos el evento click
		}
	}

	function Empezar(id){
		let refremove = id.split("e");
		console.log(refremove);
		var juegos_ref = db.ref("/juegos/"+id[1]);
		firebase.database().ref(refremove[1]).remove();
		document.getElementById(refremove[1]).style.display = 'none';
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


	function add_juegos(child_snapshot, prev_child_key){
		console.log("ADD");
		let data = child_snapshot.val();
		const page_main = document.querySelector('#page_main');
		if(data.user == user.email ){
			let newDiv = document.createElement("div");
			newDiv.id = data.referencia;
			let el = document.createElement('p');
			let rid = "r"+data.referencia;
			let mid = "m"+data.referencia;
			let eid = "e"+data.referencia;
			let pid = "p"+data.referencia;
			el.innerHTML+= data.name;
			el.innerHTML += "<br>";
			el.innerHTML+="<br>";
			el.innerHTML+="<button id='"+mid+"' class='bmod'> Modificar </button>";
			el.innerHTML+="<button id='"+rid+"' class='bremove' > Eliminar </button>";
			el.innerHTML+="<button id='"+pid+"' class='bp' > Añadir Preguta </button>";
			el.innerHTML+="<button id='"+eid+"' class='bempezar' > Empezar  </button>";
			newDiv.appendChild(el);
			page_main.appendChild(newDiv);
		}
/*
		let preguntas_ref = db.ref("/juegos/"+data.referencia+"/preguntas");
		preguntas_ref.on('child_added',add_preguntas);*/
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
			/*	db.ref("/profesores/"+ref_prof).set(
				{
					name: user.email,
					referencia: ref_prof
				});
				ref_prof = ref_prof++;*/
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
