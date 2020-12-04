document.addEventListener('deviceready',function(){

	let user = null;
	let db = null;
	let ref = 0;
	let refmod = null;
	getRedirectResult();
	document.querySelector('#btn_google_login').addEventListener('click',function(){
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider).then(()=>{
			getRedirectResult();
		});
	});

	document.querySelector('#btn_cancel_add').addEventListener('click',function(){
		document.querySelector('#page_add_task').style.display = 'none';
		document.querySelector('#page_main').style.display = 'block';
	});

	document.querySelector('#btn_add_task').addEventListener('click',function(){
		document.querySelector('#page_add_task').style.display = 'block';
		document.querySelector('#page_main').style.display = 'none';
	});

	document.querySelector('#btn_camera_add').addEventListener('click',function(){

		navigator.camera.getPicture(cameraSuccess, cameraError, { quality: 50, destinationType: Camera.DestinationType.DATA_URL});

	});

	function cameraSuccess(imageData) {
		
   		var image = document.getElementById('imagen');
   		image.src = "data:image/jpeg;base64," + imageData;
   		image.style.display = 'block';
	}

	function cameraError(message) {
    	alert('Failed because: ' + message);
	}

	document.querySelector('#btn_done_add').addEventListener('click',function(){
		var root_ref = db.ref();
		var task_name = document.querySelector("#task_name").value;
		var image = document.getElementById('imagen');
		if(refmod==null){
			
			firebase.database().ref(ref).set(
			{
    			user:user.email,
				name:task_name,
				image: image.src,
				referencia: ref
			});
			ref = ref++;
		}
		else{
			firebase.database().ref(refmod[1]).set(
			{
    			user:user.email,
				name:task_name,
				image: image.src,
				referencia: refmod[1],
  			});
  			refmod=null;
		}
		
		
		
		document.querySelector('#page_add_task').style.display = 'none';
		document.querySelector('#page_main').style.display = 'block';
		document.querySelector('#imagen').style.display = 'none';
		document.querySelector("#task_name").value = "";
	});


	function manejadorRemove(event) {
  		removeTask(event.target.id); 
	}
	function manejadorMod(event) {
		console.log("manejador");
  		mod(event.target.id); 
	}


	function removeTask(id){
		let refremove = id.split("r");
		console.log(refremove);
		firebase.database().ref(refremove[1]).remove();
		document.getElementById(refremove[1]).style.display = 'none';


	}

	function mod(id){
		refmod = id.split("m");
		console.log(refmod);
		document.querySelector('#page_add_task').style.display = 'block';
		document.querySelector('#page_main').style.display = 'none';
	}


	function add_tareas(child_snapshot, prev_child_key){
		console.log("ADD");
		let data = child_snapshot.val();
		const page_main = document.querySelector('#page_main');
		if(data.user == user.email ){
			let newDiv = document.createElement("div");
			newDiv.id = data.referencia;
			let el = document.createElement('p');
			let rid = "r"+data.referencia;
			let mid = "m"+data.referencia;
			el.innerHTML+= data.name;
			el.innerHTML += "<br>"
			if (data.image != "file:///android_asset/www/index.html"){
				el.innerHTML += "<img class=imagen src='"+data.image+"'/>";
			}
			el.innerHTML+="<br>"
			el.innerHTML+="<button id='"+mid+"' class='bmod'> Modificar </button>";
			el.innerHTML+="<button id='"+rid+"' class='bremove' > Eliminar </button>";
			newDiv.appendChild(el);
			page_main.appendChild(newDiv);
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
	}

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
			el.innerHTML+= data.name;
			el.innerHTML += "<br>"
			if (data.image != "file:///android_asset/www/index.html"){
				el.innerHTML += "<img class=imagen src='"+data.image+"'/>";
			}
			el.innerHTML+="<br>"
			el.innerHTML+="<button id='"+mid+"' class='bmod'> Modificar </button>";
			el.innerHTML+="<button id='"+rid+"' class='bremove' > Eliminar </button>";
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
	}


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
				let root_ref = db.ref();
				
				
				const page_main_foto = document.querySelector('#page_main_foto');
				let p = document.createElement('p');
				p.innerHTML += user.displayName;
				p.innerHTML += "<br>"
				p.innerHTML += "<img class=imagen src='"+user.photoURL+"' />";
				p.innerHTML += "<br></br>"
				page_main_foto.appendChild(p);
				root_ref.on('child_added',add_tareas);
				root_ref.on('child_changed',up_tareas);
				root_ref.on('child_removed',rem_tareas);
			}
		}).catch((error)=>{
			console.log(error);
		});
	}
});
