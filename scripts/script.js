//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//Variables globales:
//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++

//var personId = Math.floor((Math.random() * 1000000) + 1);
var personId = processText(stringDate());
var participantIP = "";
var group =99; 
//var Balanceo = Math.floor(Math.random()*2 + 1);
var state=99;           //controla el ensayo dentro de cada fase
var stateTexto=99;      //controla la pantalla de textos
var fase = 0;           //controla en qué fase estamos
var stateQuest = 1;     //controla en qué pregunta del cuestionario estamos
var training=[];        //contendrá el array de ensayos
var data=[];            //contendrá los datos.
var fecha="";           //contendrá la fecha/hora.
var Cuestionario=[];    //contiene las respuestas al cuestionario de generalizacion
var t0 = 0; 
var t1 = 0; 
//var testeo = 1;  // variable para reducir el número de ensayos durante el testeo del código // mover a 0 para producción 
var testeo = 0;  

// Indicadores de estado para ver qué pregunta se lanza  
var juiciorealizado = 0;
var confianzaevaluada = 0;

var alertcount = 0; 
//variables demográficas:
var Gender=""; 
var	Age=99;
var Experience=99;
var BalPanel = Math.floor((Math.random() * 2) + 1); //para aleatorizar la posición del panel de respuesta para cada sujeto
//var PartIP = ""; //Modified for testing TFK

var arrayInstruc=[];
var arrayBoton = [];

var PregInduccionPrecio = "";	// No se usa, TFK comprobar y eliminar
var PregInduccion = ""; 		// No se usa, TFK comprobar y eliminar

// Seguimiento de los participantes en cada grupo para adjudicar contrabalanceo o no
var grupoA1 = 9999;  	// grupo 0 -  controla el número de participantes del grupo A1
var grupoA2 = 9999; 	// grupo 1 -  controla el número de participantes del grupo A2
var grupoB1 = 9999;	// grupo 2 - B1 
var grupoB2 = 9999;	// grupo 3 - B2
var grupoC1 = 9999;	// grupo 4 - Control 1
var grupoC2 = 0;	// grupo 5 - Control 2
// Esta variable realmente se verá como la variable: grupoAsignado
// [grupoA1 = 0, grupoA2 = 1, grupoB1 = 2, grupoB2= 3, grupoC1 = 4, grupoC2 = 5] 

var groupNames = ["A1", "A2", "B1", "B2", "C1", "C2"];		//Usado para extraer datos


// creamos un array para ver el número de participantes en cada grupo
var grouplist = [grupoA1, grupoA2, grupoB1, grupoB2, grupoC1, grupoC2];
var participantCount = new Array();
var tempArray = [0, 1, 2, 3, 4, 5]; 
var tempShuffled = shuffle(tempArray);
var grupoAsignado = tempShuffled[0]; 	// Elige un grupo al azar


//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//Funciones generales:
//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++


//función para inyectar HTML:
function pintarHTML(targetDiv, htmlContenido){ 
	document.getElementById(targetDiv).innerHTML=htmlContenido;
}

//función para desordenar arrays...
function shuffle(array) {    
    var rand, 
        index = -1,        
        length = array.length,        
        result = Array(length);    
    while (++index < length) {        
        rand = Math.floor(Math.random() * (index + 1));        
        result[index] = result[rand];        
        result[rand] = array[index];    }    
    return result;
}


//función para rellenar arrays...
function fillArray(value, len) { 
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}
    
//funciones para mostrar/ocultar paneles:
function mostrar(panel){panel.style.display="block";}
function ocultar(panel){panel.style.display="none";}


//función de fecha:
function stringDate() {
  var fecha = new(Date);
  //return(String(fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear() + "-" + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds()));
  return(String(fecha.getFullYear() + "/" + (fecha.getMonth()+1) + "/" + fecha.getDate() + "-" + fecha.getHours() + ":" + fecha.getMinutes() ));
}


//precache de imágenes:
var preloadImages="img/BatatrimBoton.png, img/enfermo.png, img/enfermoNuevo.png, img/recuperaSi.png, img/recuperaNo.png, img/noBatatrimBoton.png, img/noBatatrimBoton2.png, img/Nooutcome.png, img/NooutcomeNuevo.png, img/outcome.png, img/outcomeNuevo.png, img/outcomeAvion.png, img/outcomeNoAvion.png, img/Sano.png, img/SanoNuevo.png, img/uned.png, img/RecalibradoNo.png, img/RecalibradoSi.png".split(",");
var tempIMG=[];

function preloadIMG(){
	for (var i=0;i<preloadImages.length;i++){
		tempIMG[i]=new Image();
		tempIMG[i].src=preloadImages[i];    }
}

//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//Función ARRANCA:
//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++

//función global
function arranca(){
    preloadIMG();
	// CARGA la base de datos: 
	firebase.database().ref().on("value", gotData, errData); 	// TFK - MODO DEMO SIN CONEXIÓN
	
	// Carga de la IP del usuario:
	async function getUserIP() {
		try {
		  const response = await fetch('https://api.ipify.org?format=json');
		  const data = await response.json();
		  const userIP = data.ip;
		  participantIP = userIP;  
		  //console.log('User IP:', userIP); //debug
		  return userIP;
		} catch (error) {
		  //console.error('Error fetching IP:', error); //debug
		}
	  }
	  
	getUserIP();

	
	function gotData(data) { 
			
		//console.log("participantes: "+grouplist+".");				// debug para comprobar el grupo antes de leer datos
		//firebase.database().ref('participantesPorGrupo').set(grouplist)
		grouplist = data.val().participantesPorGrupo;				// esta línea lee el histórico de firebase (añadida en el 2º run de la app)
		//console.log("participantes: "+grouplist+".");				// debug para comprobar el grupo antes de leer datos
	};
		
	function errData(err) {
		console.log("Error!");
		console.log(err);
	};
	
	state=0;
    stateTexto=0;
    fase=0;

    prepararTextos();   
	pregInduccion();      
	//setTimeout(function() {
	//	pregInduccion();
	//}, (1 * 1000));
    
    
}


function asignagrupo() {

	//console.log(groupNames[grupoAsignado]);
	
	//console.log(grouplist.length + " is the length");							// debug
	for (var i = 0; i < grouplist.length; i++) {								// Este bucle asigna al grupo con menos participantes
		//console.log(grouplist[i]+"--- i ="+i)									// debug
		if (grouplist[i] < grouplist[grupoAsignado]) {
			grupoAsignado = i;
		}
	//console.log("El GRUPO asignado es el: "+groupNames[grupoAsignado]+".");		//debug
	//console.log("El grupo asignado es el: "+grupoAsignado+".");					// debug
	//console.log("Grupo asignado aleatorio es el:"+grupoAsignado+".") 				// debug
	}

	// TODO ESTE BLOQUE SIGUIENTE CHECKEA LAS PROBABILIDADES: 
	group= "No asignado";	
	// En función del número de participantes que hayan realizado la tarea en la secuencia normal
	// y de contrabalanceo, asigna a un grupo o a otro al participante. 
	if(grupoAsignado > 3){

		training=[FaseTest];
		//training=[FaseControl, FaseTest];
		//training=[FaseControl];
		if(grupoAsignado == 4){
			group= "Control Remisión Baja - C1"; 
		}
		else if(grupoAsignado == 5){
			group= "Control Remisión Alta - C2"; 
		}
		else{
			group= "ERROR!!!"	
			//console.log(group);												//debug
			//console.log("El grupo asignado era: "+grupoAsignado+".");  		//debug
		}
	}
	else if(grupoAsignado < 2){
		training=[FasePrevia, FaseTest];
		if(grupoAsignado == 0){
			group= "Expectativa Alta y Remisión Baja - A1"; 
		}
		else if(grupoAsignado == 1){
			group= "Expectativa Alta y Remisión Alta - A2"; 
		}
		else{
			group= "ERROR!!!"
			console.log(group);
			//console.log("El grupo asignado era: "+grupoAsignado+".");			//debug
		}  
	}
	else{
		training=[FasePrevia, FaseTest];
		if(grupoAsignado == 2){
			group= "Expectativa Baja y Remisión Baja - B1"; 
		}
		else if(grupoAsignado == 3){
			group= "Expectativa Baja y Remisión Alta - B2"; 
		}
		else{
			group= "ERROR!!!"
			//console.log(group);												//debug
			//console.log("El grupo asignado era: "+grupoAsignado+".");  		//debug
		}
	}
	//console.log("Pues te ha tocado grupo :"+group+".");						// debug

}    
//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//GENERACION DE ENSAYOS:

function generaEnsayos(){

	for(var i=0; i<2; i++){ //creo 2 bloques de 10 con 30%/70% de éxito
		if(grupoAsignado<2){  	// grupos A1 y A2 (expectativa inicial alta)
			var arrayOutcome= [1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
		}
		else if(grupoAsignado>3){  	// grupos C1 y C2 (Control - sin ensayos)
			var arrayOutcome= []; // Añadido para que este grupo salte directamente 
		}
		else{        			// grupos B1 y B2 (expectativa inicial baja)
			var arrayOutcome= [1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
		}  
		arrayOutcome=shuffle(arrayOutcome);
		FasePrevia.posibleOutcomes=FasePrevia.posibleOutcomes.concat(arrayOutcome);              
	}

	for(var i=0; i<5; i++){ //creo 5 bloques de 10 con 30%/70% de éxito
		if(grupoAsignado%2==0){  	// grupos A1, B1 y C1 (remisión espontánea baja)
			var arrayOutcome= [1, 1, 1, 0, 0, 0, 0, 0, 0, 0];}
		else{        				// grupos A2, B2 y C2 (remisión espontánea alta)
			var arrayOutcome= [1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
		}  
		arrayOutcome=shuffle(arrayOutcome);
		FaseTest.posibleOutcomes=FaseTest.posibleOutcomes.concat(arrayOutcome);
	}
	// Todo este bloque siguiente es para debugging //debug
	//if(grupoAsignado<4){					
	//	sum = FasePrevia.posibleOutcomes.reduce((a, b) => {
	//		return a + b;
	//	});
	//	console.log("Expectativa inicial: "+100*sum/20+"%.");	
	//			// Para control qué dice
	//}
	//else{ 
	//	console.log("Este es un grupo de control sin manipulación");	
	//}
    //console.log("Resultados para fase test:");	
    //console.log(FaseTest.posibleOutcomes);	
	//sum2 = FaseTest.posibleOutcomes.reduce((a, b) => {
	//	return a + b;
	//  });
	//console.log("Remisión espontánea: "+100*sum2/50+"%.");
	
}

//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++

var FaseTest = {
  	nombreClave: "\"Batatrim\"",
	nombreSindrome: "Síndrome de Lindsay",
	ImagenClave: "img/BatatrimBoton.png",
	ImagenNOClave: "img/noBatatrimBoton.png",
	ImagenSindrome: "img/NooutcomeNuevo.png",
	ImagenSano: "img/outcomeNuevo.png",
	textoCue: "Este paciente tiene el Síndrome de Lindsay",
    textoPregunta: "¿Quieres administrarle \"Batatrim\"?",
	textoYES: "Has administrado \"Batatrim\"",
	textoNO: "No has administrado \"Batatrim\"",
	numTrials: 50,
	//numTrials: 2,
    posibleOutcomes: [],
    secuenciaCells: [],
    secuenciaResps: [],
    Juicio: 999,
    Confianza: 999,
	NPS: 999,
	TiemposRespuesta: [],
}

var FasePrevia = {
	nombreClave: "\"Batatrim\"",
	nombreSindrome: "Síndrome de Lindsay",
	ImagenClave: "img/recuperaSi.png",		
	ImagenNOClave: "img/recuperaNo.png",	
	ImagenSindrome: "img/Nooutcome.png",
	ImagenSano: "img/outcome.png",
	textoTransitAlta: "alta",
	textoTransitBaja: "baja", 
	textoCue: "Este paciente tiene el Síndrome de Lindsay y se le ha administrado \"Batatrim\"",
    textoPregunta: "¿Crees que va a recuperarse?",
    textoYES: "Crees que se va a recuperar",
	textoNO: "Crees que NO se va a recuperar",
    numTrials: 20,
    //numTrials: 2,
	posibleOutcomes: [],   
    secuenciaCells: [],
    secuenciaResps: [],
    Juicio: 999,
    Confianza: 999,
	NPS: 999,
	TiemposRespuesta: [],
}

var FaseControl = {
	nombreClave: "\"Batatrim\"",
	nombreSindrome: "Síndrome de Lindsay",
	ImagenClave: "img/BatatrimBoton.png",
	ImagenNOClave: "img/noBatatrimBoton.png",
	ImagenSindrome: "img/NooutcomeNuevo.png",
	ImagenSano: "img/outcomeNuevo.png",
	textoIntroControl: "Sin embargo, esta medicina aún está en fase experimental, por lo que todavía no se ha comprobado claramente su efectividad.",
	textoCue: "Este paciente tiene el Síndrome de Lindsay",
	textoPregunta: "¿Quieres administrarle \"Batatrim\"?",
	textoYES: "Has administrado \"Batatrim\"",
	textoNO: "No has administrado \"Batatrim\"",
	numTrials: 50, 
    posibleOutcomes: [],   
    secuenciaCells: [],
    secuenciaResps: [],
	posibleOutcomes: [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9], // Esto lo dejamos para que todos los grupos tengan los datos ordenados igual
	secuenciaCells: [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	secuenciaResps: [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
	Juicio: 999,
	Confianza: 999,
	TiemposRespuesta: [],
	TiemposRespuesta: [999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999],
}

if(testeo === 1){
	FaseControl.numTrials = 2;
	FasePrevia.numTrials = 2;
	FaseTest.numTrials = 2; 
	console.log("This should only be running during tests.")
}



function RandomString(length){
//    var mask = 'ABCDEFGHIJKLMNOPQRSTUVW';
//    var mask = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var mask = 'BCDFGHJKLMNPQRSTVWXZ';
var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}


function showCue(){
    ocultar(divTextos);
    ocultar(divEleccion);
    ocultar(divOutcome);
    ocultar(divBoton);
    	
    document.getElementById("divPreStatus").classList.remove('FadeOut');
    
    mostrar(divContingencia);
    
	t0 = performance.now(); // Medir tiempos
	//console.log("El tiempo actual es: "+t0+"."); // debug

	pintarHTML("divPreStatus", "<img src=\""+training[fase].ImagenSindrome+"\" width=250px>"+
            "<br><br><br><p class=\"mensaje\">"+training[fase].textoCue+"</p><p class=\"mensaje\">"+training[fase].textoPregunta+"</p>");
    
	pintarHTML("divRegistro", "<h3>Paciente "+RandomString(4)+"</h3>");
	
	
    mostrar(divRegistro);
    mostrar(divPreStatus);
    setTimeout('mostrarEleccion()', 100);
    
    //mostrar(divEleccion);
    //setTimeout('mostrar(divEleccion)', 500); 
}

function mostrarEleccion(){
		
	if(training[fase] == FaseTest){ 

		if(BalPanel==1){
				pintarHTML('divEleccion',
				   "<div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training[fase].ImagenClave+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training[fase].ImagenNOClave+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div id=\"mensajeCue\"></div>"
				   );
		}
		else if(BalPanel==2){
				pintarHTML('divEleccion',
				   "<div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training[fase].ImagenNOClave+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training[fase].ImagenClave+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div id=\"mensajeCue\"></div>"
				   );

		}

		mostrar(divEleccion);
    }
	else if(training[fase] == FasePrevia){

		if(BalPanel==1){
				pintarHTML('divEleccion',
				   "<div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training[fase].ImagenClave+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training[fase].ImagenNOClave+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div id=\"mensajeCue\"></div>"
				   );
		}
		else if(BalPanel==2){
				pintarHTML('divEleccion',
				   "<div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training[fase].ImagenNOClave+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training[fase].ImagenClave+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div id=\"mensajeCue\"></div>"
				   );

		}

		mostrar(divEleccion);
	}

	if(training[fase] == FaseTest){ 

		if(BalPanel==1){
				pintarHTML('divEleccion',
				   "<div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training[fase].ImagenClave+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training[fase].ImagenNOClave+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div id=\"mensajeCue\"></div>"
				   );
		}
		else if(BalPanel==2){
				pintarHTML('divEleccion',
				   "<div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training[fase].ImagenNOClave+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training[fase].ImagenClave+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div id=\"mensajeCue\"></div>"
				   );

		}

		mostrar(divEleccion);
	}
	
    if(BalPanel==1){
            pintarHTML('divEleccion',
               "<div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training[fase].ImagenClave+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training[fase].ImagenNOClave+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div id=\"mensajeCue\"></div>"
               );
    }
    else if(BalPanel==2){
            pintarHTML('divEleccion',
               "<div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training[fase].ImagenNOClave+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training[fase].ImagenClave+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div id=\"mensajeCue\"></div>"
               );

    }

    mostrar(divEleccion);
}

function respuestaYES(){
	t1 = performance.now(); // Medir tiempos
	//console.log("El tiempo actual es: "+t1+"."); // debug
	tiempotranscurrido = t1 - t0; //
	//console.log("El tiempo de respuesta es: "+tiempotranscurrido+"."); // debug
	training[fase].TiemposRespuesta.push(tiempotranscurrido); 
	
	
	document.getElementById("botonNO").classList.add('unselected');
    training[fase].secuenciaResps.push(1);
    document.getElementById("imagenYES").classList.remove('icon_hover');
    document.getElementById("imagenYES").classList.remove('icon');
    document.getElementById("imagenNO").classList.remove('icon');
    document.getElementById("imagenYES").classList.add('iconselected');
    
    document.getElementById("botonYES").disabled = true;
    document.getElementById("botonNO").disabled = true;

    document.getElementById("divPreStatus").classList.add('FadeOut');
    mostrar(divPreStatus);
    
	pintarHTML("mensajeCue", "<p class=\"mensaje\">"+training[fase].textoYES+"</p>");
    
    setTimeout('showOutcome()', 100);
}

function respuestaNO(){
	t1 = performance.now(); // Medir tiempos
	//console.log("El tiempo actual es: "+t1+"."); // debug
	tiempotranscurrido = t1 - t0; //Medir tiempos
	//console.log("El tiempo de respuesta es: "+tiempotranscurrido+".");// debug
	training[fase].TiemposRespuesta.push(tiempotranscurrido); 
	
    document.getElementById("botonYES").classList.add('unselected');
    training[fase].secuenciaResps.push(0);
    document.getElementById("imagenNO").classList.remove('icon_hover');
    document.getElementById("imagenYES").classList.remove('icon');
    document.getElementById("imagenNO").classList.remove('icon');
    document.getElementById("imagenNO").classList.add('iconselected');       
    
    document.getElementById("botonYES").disabled = true;
    document.getElementById("botonNO").disabled = true;
    
    document.getElementById("divPreStatus").classList.add('FadeOut');
    mostrar(divPreStatus);
    
	pintarHTML("mensajeCue", "<p class=\"mensaje\">"+training[fase].textoNO+"</p>");
    
    setTimeout('showOutcome()', 100);
}


function showOutcome(){

    var imgOutcome = "";
    var textoOutcome = "";
    
    switch(training[fase].secuenciaResps[state]){
        case 1: //si ha respondido 1 --> Administrar Batatrim:
            if(training[fase].posibleOutcomes[state]==1) {
                imgOutcome = training[fase].ImagenSano;
				textoOutcome = "<br><p class=\"mensaje\">¡El paciente ha superado la crisis!</p>";
				training[fase].secuenciaCells.push("a");
                //console.log(" debug: cell a");
            }
                
            else {
			//else if(training[fase].posibleOutcomes[state]==0){
                imgOutcome = training[fase].ImagenSindrome;
				textoOutcome = "<br><p class=\"mensajeMALO\">¡El paciente NO ha superado la crisis!</p>";
                training[fase].secuenciaCells.push("b");
                //console.log(" debug: cell b");
            }
     
            break;
        case 0: //si ha respondido 0 --> no administrar Batatrim:
            if(training[fase].posibleOutcomes[state]==1) {
                imgOutcome = training[fase].ImagenSano;
				textoOutcome = "<br><p class=\"mensaje\">¡El paciente ha superado la crisis!</p>"; //en estos bloques hemos eliminado el if del Case 1
				training[fase].secuenciaCells.push("c");   
                //console.log(" debug: cell c"); 				// debug
            }
            
			else {
            //else if(training[fase].posibleOutcomes[state]==0){
                imgOutcome = training[fase].ImagenSindrome;
				textoOutcome = "<br><p class=\"mensajeMALO\">¡El paciente NO ha superado la crisis!</p>";
                training[fase].secuenciaCells.push("d"); 
                //console.log(" debug: cell d"); 				// debug
            }            
            
    }
        

    pintarHTML('divOutcome', "<img src=\""+imgOutcome+"\" width=250px><br><br>"+textoOutcome);
    if(training[fase] == FasePrevia){ 
		pintarHTML('divBoton', "<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='ITI()' value='Siguiente paciente'/>")	
	}
	else if(training[fase] == FaseTest){
		pintarHTML('divBoton', "<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='ITI()' value='Siguiente paciente'/>")	

	}
	else if(training[fase] == FaseControl){
		pintarHTML('divBoton', "<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='ITI()' value='Siguiente paciente'/>")		
	}
    mostrar(divOutcome);
    setTimeout('mostrar(divBoton)', 100);
    
    
}


function ITI(){
    
    ocultar(divOutcome);
    ocultar(divContingencia);
	ocultar(divBoton);	
        
    document.getElementById("botonNO").classList.remove('unselected');
    document.getElementById("botonYES").classList.remove('unselected');
    document.getElementById("imagenNO").classList.remove('iconselected');
    document.getElementById("imagenYES").classList.remove('iconselected');

    document.getElementById("imagenNO").classList.add('icon_hover');
    document.getElementById("imagenNO").classList.add('icon');
    document.getElementById("imagenYES").classList.add('icon_hover');
    document.getElementById("imagenYES").classList.add('icon');    
    
    document.getElementById("botonYES").disabled = false;
    document.getElementById("botonNO").disabled = false;
    
    document.getElementById("divPreStatus").classList.remove('FadeOut');
    
    if(state<training[fase].numTrials-1){
        state++;
        setTimeout("showCue()", 100);
		
		// Aquí vamos a ir haciendo capturas
		if((state+1) % FaseTest.numTrials == 0){
			startData = "A participant with ID " + personId +","+ "reached state:"+ ","+ state +","+ stringDate();
			if (testeo == 0){
				guardaFirebase(startData, 'mySurvivalLogs');				
			}
			else {
				console.log(startData);
			}
		}
    }
     else if(state==training[fase].numTrials-1){

		// Esta siguiente línea se activa si estamos en la fase de creación de expectativas 
		if(training[fase] == FasePrevia){
			//console.log("Estamos en la fase de manipulación");		 // Comentarios para debug
			cambiafase();
		}
		else{
			//console.log("Esta es la fase de test de verdad");			 // Comentarios para debug
			showJuicio();
			juiciorealizado++;	
		}
	
     }
}

function showJuicio(){
    ocultar(divContingencia);
    ocultar(divTextos);
	
	textoJuicio= "<p class=\"pregunta\">¿Hasta qué punto crees que el "+
			training[fase].nombreClave+" es efectivo para curar las crisis del "+training[fase].nombreSindrome+"?</p>";
	

	textoInstrucciones="<p>Responde usando la siguiente escala, donde los números se interpretan así:</p><ul><li>0: Nada efectivo.</li><li>100: Completamente efectivo.</li></ul><p>Puedes hacer clic dentro de la escala tantas veces como desees hasta marcar el valor que consideres más adecuado. Cualquier valor entre 0 y 100 es válido. También puedes usar las flechas del teclado (izquierda / derecha) para ajustar el valor de la respuesta con más precisión. </p><br><br>";
	textoJuicio = textoJuicio.concat(textoInstrucciones);
	
	pintarHTML('divPregunta', textoJuicio);
		
    document.getElementById("sliderJuicio").classList.add('sliderCONTPrimero');

    ReseteoJuicios();
    
    document.getElementById("textInput").disabled = true;
    document.getElementById("textInput").value = "";

    
    textoBoton="<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='validaJuicio()' value='Confirmar'/>";
    pintarHTML('divBoton', textoBoton);
    
    mostrar(divJuicio);
    setTimeout('mostrar(divBoton)', 100);

}

function showNPS(){
	// Esta nueva función va a dar a evaluar el NPS de 1 a 10.
	
	// para ello reutilizamos la confianza pero voy a ver si al mostrar el resultado puedo mostrar redondeado a 10 
	ocultar(divContingencia);
    ocultar(divTextos);
 
	textoNPS= "<p class=\"pregunta\">¿Recomendarías a un familiar o amigo tomar "+training[fase].nombreClave+"?</p>";
	textoInstruccionesNPS="<p>Responde usando la siguiente escala, donde los números se interpretan así:</p><ul><li>0: En absoluto.</li><li>10: Completamente seguro.</li></ul></p><br><br>";
	textoNPS = textoNPS.concat(textoInstruccionesNPS);
	pintarHTML('divPreguntaNPS', textoNPS);
    
    document.getElementById("sliderNPS").classList.add('sliderCONTPrimero');

    ReseteoJuicios();
    
    document.getElementById("textInput").disabled = true;
    document.getElementById("textInput").value = "";

    
    textoBoton="<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='validaJuicio()' value='Confirmar'/>";
    pintarHTML('divBoton', textoBoton);
    

    setTimeout('mostrar(divBoton)', 100);    
}


function showConfianza(){
    ocultar(divContingencia);
    ocultar(divTextos);

	textoConfianza= "<p class=\"pregunta\">En una escala del 0 al 10, ¿cómo de probable es que recomendaras a un paciente tomar "+training[fase].nombreClave+"?</p>";
	textoInstrucciones="<p>Responde usando la siguiente escala, donde los números se interpretan así:</p><ul><li>0: No lo recomendaría en absoluto.</li><li>10: Lo recomendaría con total seguridad.</li></ul></p><br><br>";
	textoConfianza = textoConfianza.concat(textoInstrucciones);
	pintarHTML('divPregunta', textoConfianza);
    
    document.getElementById("sliderJuicio").classList.add('sliderCONTPrimero');

    ReseteoJuicios();
    
    document.getElementById("textInput").disabled = true;
    document.getElementById("textInput").value = "";

    
    textoBoton="<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='validaJuicio()' value='Confirmar'/>";
    pintarHTML('divBoton', textoBoton);
    
    mostrar(divJuicio);
    setTimeout('mostrar(divBoton)', 100);    
}


// Esta es la función que actualiza el valor según lo que se marca en a escala
function updateTextInput(val) {
	if(confianzaevaluada ==1 ){

	document.getElementById('textInput').value=Math.floor(val/10);
	
	}
	else {
		document.getElementById('textInput').value=val;
	} 
}

function updateLimit() {
	if(confianzaevaluada ==1 ){

		return 10;
	
	}
	else {
		return 100;
	} 
}

function updateLimitMax() {
	if(confianzaevaluada ==1 ){

	document.getElementById('textInput').value=Math.floor(val/10);
	
	}
	else {
		document.getElementById('textInput').value=val;
	} 
}

function validaJuicio(){
    if (document.getElementById('textInput').value!=""){
		
		// Vamos a grabar el valor del slider en un punto u otro según nuestra fase
		if(training[fase].Juicio==999){
			//training[fase].Juicio=document.getElementById('textInput').value;
			FaseTest.Juicio=document.getElementById('textInput').value; 			// Añadido porque en el exp CVTD22XX2 solo guardamos en fase test
			//console.log("--- LA HORA DEL JUICIO ESTÁ CERCA!!! ---");			// debug
			//console.log(training[fase].Juicio);								// debug
			
			// Una vez que ya se ha lanzado el juicio, cambiamos la escala para el NPS
			// Get the elements by their class name
			var separador2 = document.getElementsByClassName("separador2")[0];
			var separador3 = document.getElementsByClassName("separador3")[0];

			// Change their content
			separador2.innerHTML = "5<br>|";
			separador3.innerHTML = "10<br>|";

		}	
		else if(training[fase].Confianza==999){
			//training[fase].Confianza=document.getElementById('textInput').value;
			FaseTest.Confianza=document.getElementById('textInput').value;			// Añadido porque en el exp CVTD22XX2 solo guardamos en fase test
			// console.log("--- LA HORA DE LA MEDIR NPS ESTÁ CERCA!!! ---");		// debug 
			// console.log(document.getElementById('textInput').value);		// debug 
			// console.log(FaseTest.NPS)
			FaseTest.NPS=document.getElementById('textInput').value;			// Añadido porque en el exp CVTD22XX2 solo guardamos en fase test
			// console.log("--- HEMOS MEDIDO NPS! ---");		// debug 
			// console.log(FaseTest.NPS)
			//console.log("--- LA HORA DE LA CONFIANZA ESTÁ CERCA!!! ---");		// debug
			//console.log(training[fase].Confianza);							// debug
		}	
		
		document.getElementById("sliderJuicio").classList.remove('sliderCONTPrimero');
		
		if(confianzaevaluada==0){
			showConfianza();
			confianzaevaluada++;
		}
		else if(confianzaevaluada==1){
			prepararTextos();
			cambiafase();
		}
        
	}
	else {
        alert("Contesta la pregunta");
        document.getElementById("sliderJuicio").classList.add('sliderCONTPrimero');
        document.getElementById("textInput").value = "";
         }   
}


function cambiafase(){
	//startData = "A participant with ID has completed the first phase " + personId +","+ stringDate();
	//guardaFirebase(startData, 'mySurvivalLogs');
	
    if (grupoAsignado > 3){
		siguienteTexto();
	}
	else if(fase==0) {
        fase++;
        state=0; 
        
		juiciorealizado=0;
		npsEvaluada=0;
		confianzaevaluada=0;

		siguienteTexto();
     }
}

function ReseteoJuicios(){
	document.getElementById('sliderJuicio').value=-10000;
	//document.getElementById('sliderNPS').value=-10000;
	document.getElementById('textInput').value="";
}


//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//FUNCIONES DE CONTROL DE TEXTOS:
//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++

function shouldShowFifthQuestion() {
    // Replace this with the actual condition
    if ((FaseTest.secuenciaResps.reduce((a, b) => a + b, 0) / FaseTest.numTrials) > 0.94 || (FaseTest.secuenciaResps.reduce((a, b) => a + b, 0) / FaseTest.numTrials) < 0.05) {
        return 1;
    }
    return 0;
}

function numberOfQuestions() {
    // Replace this with the actual condition
    return 4 + shouldShowFifthQuestion();
}

function siempreOnunca() { 
	if (FaseTest.secuenciaResps.reduce((a, b) => a + b, 0) / FaseTest.numTrials == 1) {
        return "siempre";
    }
	if (FaseTest.secuenciaResps.reduce((a, b) => a + b, 0) / FaseTest.numTrials == 0) {
        return "nunca";
    }
	if (FaseTest.secuenciaResps.reduce((a, b) => a + b, 0) / FaseTest.numTrials > 0.94) {
        return "prácticamente siempre";
    }
	if (FaseTest.secuenciaResps.reduce((a, b) => a + b, 0) / FaseTest.numTrials < 0.05) {
        return "prácticamente nunca";
    }
}


function saveAnswer(){
	// Esta función envía las respuestas de las preguntas. 
	return true
}

function processText(text) {
    // Replace newline characters with spaces
    text = text.replace(/\n/g, ' ');

    // Remove backslashes, forward slashes, curly braces, and dollar signs
    text = text.replace(/[\\\/{}$]/g, '');

    return text;
}


function siguienteTexto(){
	
	mostrar(divTextos);
	mostrar(divBoton);
    ocultar(divContingencia);
    ocultar(divJuicio);
    ocultar(divCuestionariosEdad);
	
    htmlContenido=arrayInstruc[stateTexto];
    // Check if the current state is one of the custom questions
	
    if (stateTexto >= arrayInstruc.length - 7) {
		var answerElementId = `questionText${stateTexto - 1}`; // Get the previous question's answer
    	var answerElement = document.getElementById(answerElementId);

        // If this isn't the first time this function is called (answerElement will be null on the first call)
        if (answerElement) {
			//console.log("Estoy guardando la respuesta"); // debug
            var participantId = personId;
            var answer = answerElement.value;
            var processedAnswer = processText(answer); // process the text (you need to define this function)

            // Save to Firebase
            var dataToSave = `${participantId}; ${processedAnswer}`;
        
			if (testeo == 0){
				guardaFirebase(dataToSave, 'myAnswers');
			}
			else{
				console.log("Estoy guardando la respuesta en testeo - " + dataToSave);
			}        
		}
		if (stateTexto >= arrayInstruc.length - 7 && stateTexto < arrayInstruc.length - 3) {
	    	htmlContenido += `<br><textarea id="questionText${stateTexto}" rows="10" cols="50" style="width: 100%;" oninput="saveAnswer(${stateTexto})"></textarea>`;
		}
	}
    if (stateTexto == arrayInstruc.length - 3) {
		
		if (shouldShowFifthQuestion()) {
        // Show the 5th question
			htmlContenido += `<br><textarea id="questionText${stateTexto}" rows="10" cols="50" style="width: 100%;" oninput="saveAnswer(${stateTexto})"></textarea>`;
		}
		else { // En este caso no hay que mostrar la pregunta 5 porque no se cumple la condición
			//console.log("No se va a mostrar la pregunta 5"); // Debug
			stateTexto++;
		}
		htmlContenido=arrayInstruc[stateTexto];
		if (stateTexto == arrayInstruc.length - 3) {
			htmlContenido += `<br><textarea id="questionText${stateTexto}" rows="10" cols="50" style="width: 100%;" oninput="saveAnswer(${stateTexto})"></textarea>`;
		}
	
    }
	
	
	htmlBotones=arrayBoton[stateTexto];
	
	pintarHTML("divTextos",htmlContenido);
    pintarHTML("divBoton",htmlBotones);
	//console.log("Estado de texto actual = " + stateTexto)		//debug
    stateTexto++;	
}

function previoTexto(){
	stateTexto=stateTexto-2;
    siguienteTexto();
}

// Inicializamos el arrayInstruc con el modo grupos experimentales (grupos A y B)

function prepararTextos(){
	if(grupoAsignado<2){ // Instrucciones para los grupos A1 y A2: 
		//console.log("Preparando textos para grupo de ALTA");			//debug
		arrayInstruc=[
			//0: (portada)  
			"<h2 class=\"titulo\">ESTUDIO CVTD22XX2</h2><p>¡Muchas gracias por participar en esta investigación, no seria posible sin ti!</p><br><br>"
			+ "<img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"img/uned.png\" width=\"200px\"><p>Sigue las instrucciones que encontrarás a continuación.</p>",
				
			// EXPERIMENTAL! Instrucciones para la fase previa
			//2: Instrucciones 1
			"<h3 class=\"titulo\">Instrucciones</h3><p align=\"left\">Imagina que eres un médico que trabaja en el laboratorio de investigación de una universidad. "
			+ "Eres especialista en una enfermedad muy rara y peligrosa llamada "+ FaseTest.nombreSindrome+", que hay que tratar muy rápido en urgencias. "
			+ "Las crisis que provoca esta enfermedad podrían curarse inmediatamente con una medicina llamada "+ FaseTest.nombreClave+".<br>",
						
			//3: Instrucciones 2.a 
			"<h3 class=\"titulo\">Instrucciones</h3><p> Como parte de un experimento piloto de los ensayos clínicos para evaluar la efectividad del \"Batatrim\", "
			+ "te vamos a presentar una serie de fichas médicas de pacientes que están sufriendo una crisis del \"Síndrome de Lindsay\". "
			+ "<br><br>En cada ficha verás un paciente al que se ha administrado \"Batatrim\" y se te pedirá intentar predecir si va a superar la crisis o no. </p>",
					
			//4: Instrucciones 2.b 
			"<h3 class=\"titulo\">Instrucciones</h3><p>El procedimiento será el siguiente: para cada nuevo paciente, debes intentar predecir si va a superar la crisis o no, "
			+ "pulsando la imagen correspondiente de las dos siguientes.</p><br><br><table style=\"text-align: center; align-content: "
			+ "center; border: 0px; width: 100%;\"><tr><td><img src=\""+FasePrevia.ImagenClave+"\" width=\"150px\"></td><td><img src=\""+FasePrevia.ImagenNOClave+"\" width=\"150px\"></td></tr><tr><td>"
			+ "Va a superar la crisis</td><td>No va a superar la crisis</td></tr></table><br><br>",
					
			//5: Instrucciones 2.c 
			"<p><h3 class=\"titulo\">Instrucciones</h3>A continuación te informaremos de si el paciente superó la crisis.</p>"
			+ "<table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\"><tr><td><img src=\""+FasePrevia.ImagenSindrome+"\" width=\"150px\"></td><td><img src=\""+FasePrevia.ImagenSano+"\" width=\"150px\"></td></tr>"
			+ "<tr><td>Paciente enfermo</td><td>Paciente curado</td></tr></table><p> Después de darte esa información, se te presentará la ficha del siguiente paciente. "
			+ "<br> Cuando hayas visto a un cierto número de pacientes pasaremos a la siguiente fase.</p>",
					
			//6: Instrucciones de la tarea de ALERGIAS 
			"<p><h3 class=\"titulo\">Instrucciones</h3>Ya has terminado esta fase del estudio de "+FaseTest.nombreSindrome +". Como has visto, la tasa de recuperación de los pacientes que han recibido \"Batatrim\" ha sido "+FasePrevia.textoTransitAlta+". <br><br> Después de ver los resultados anteriores, se te ha invitado a participar en un nuevo experimento con un grupo de población distinto al del experimento piloto.</p>",
		
			//6: Instrucciones 1b Phase 2: 
			"<p><h3 class=\"titulo\">Instrucciones</h3><p>Como parte de los ensayos clínicos para evaluar la efectividad del \"Batatrim\", te vamos a presentar una nueva serie de fichas médicas de pacientes que están sufriendo una crisis del \"Síndrome de Lindsay\". En cada ficha verás un paciente y se te dará la oportunidad de administrarle o no el \"Batatrim\". <br></p><table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\"><tr><td><img src=\""+FaseTest.ImagenClave+"\" width=\"150px\"></td><td><img src=\""+FaseTest.ImagenNOClave+"\" width=\"150px\"></td></tr><tr><td>Administrar la medicina</td><td>No administrar la medicina</td></tr></table>",
					
			//7: Instrucciones 2 Phase 2
			"<h3 class=\"titulo\">Instrucciones</h3><p>A continuación te informaremos de si el paciente superó la crisis. </p><table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\"><tr><td><img src=\""+FaseTest.ImagenSindrome+"\" width=\"150px\"></td><td><img src=\""+FaseTest.ImagenSano+"\" width=\"150px\"></td></tr><tr><td>Paciente enfermo</td><td>Paciente curado</td></tr></table><br><p>Después de darte esa información, se te presentará la ficha del siguiente paciente. <br> Intenta averiguar hasta qué punto es efectivo el "+FaseTest.nombreClave+ ". Cuando hayas tratado a un buen número de pacientes te haremos algunas preguntas.</p>",
					
			// A guardar datos via Firebase!  
			//13: Save Data...
			"<h3 class=\"titulo\">Envío de datos</h3><p>A continuación podrás enviar los resultados para que se incluyan en nuestro estudio. Los datos que nos aportes se unirán a los del grupo y serán analizados estadísticamente.</p><p align=\"left\"> Para hacerlo, haz click en el botón \"Enviar\".</p>",
					
			//13:
			"<h3 class=\"titulo\">Ya has terminado. ¡Muchas gracias por tu colaboración!</h3><p>El experimento que acabas de realizar está directamente relacionado con la materia explicada en el Capítulo 3 del libro “Psicología del Aprendizaje” que utilizas en tu asignatura del mismo nombre, concretamente con el concepto de “Contingencia” explicado en el apartado 2.1 de dicho capítulo. Para más información no dudes en ponerte en contacto con los autores del estudio.<br>"
				+" <br>Autores:<br>Carlos Vera, Pedro Montoro, Cristina Orgaz y María José Contreras.</p>"
				+ "<br><br> Pulsa F11 para salir del modo pantalla completa."
		];
	}
	else if(grupoAsignado>3){ // Instrucciones para el grupo de CONTROL 

		// Hay que modificar el arrayInstruc
		//console.log("Preparando textos para grupo de CONTROL");	 	//debug
		arrayInstruc=[
			//0: (portada) 
			"<h2 class=\"titulo\">ESTUDIO CVTD23XX2</h2><p>¡Muchas gracias por participar en esta investigación, no seria posible sin ti!</p><br><br><img style=\"display"
			+ ": block; margin-left: auto; margin-right: auto;\" src=\"img/uned.png\" width=\"200px\"><p>Sigue las instrucciones que encontrarás a continuación.</p>",
		
			//2: Instrucciones 1 
			"<h3 class=\"titulo\">Instrucciones</h3><p align=\"left\">Imagina que eres un médico que trabaja en el laboratorio de investigación de una universidad. "
			+ "Eres especialista en una enfermedad muy rara y peligrosa llamada "+ FaseTest.nombreSindrome+", que hay que tratar muy rápido en urgencias. "
			+ "Las crisis que provoca esta enfermedad podrían curarse inmediatamente con una medicina llamada "+ FaseTest.nombreClave+", pero esta medicina aún está en " 
			+ "fase experimental, por lo que todavía no se ha comprobado claramente su efectividad.</p><br>",
			
			//3: Instrucciones 2.a 
			"<h3 class=\"titulo\">Instrucciones</h3><p>Como parte de los ensayos clínicos para evaluar la efectividad del \"Batatrim\", te vamos a presentar una serie "
				+ "de fichas médicas de pacientes que están sufriendo una crisis del "+FaseTest.nombreSindrome +". En cada ficha verás un paciente y se te dará la oportunidad "
				+ "de administrarle o no el "+FaseTest.nombreClave+ ".</p>",
			
			//4: Instrucciones 2.b 
			"<h3 class=\"titulo\">Instrucciones</h3><p>El procedimiento será el siguiente: para cada nuevo paciente, debes decidir si quieres administrar el "
			+ ""+FaseTest.nombreClave+ " o no, pulsando la imagen correspondiente de las dos siguientes.</p><br><br><table style=\"text-align: center; align-content:"
			+ "center; border: 0px; width: 100%;\"><tr><td><img src=\""+FaseTest.ImagenClave+"\" width=\"150px\"></td><td><img src=\""+FaseTest.ImagenNOClave+"\" width"
			+ "=\"150px\"></td></tr><tr><td>Administrar la medicina</td><td>No administrar la medicina</td></tr></table><br><br>",
			
			//5: Instrucciones 2.c 
			"<p><h3 class=\"titulo\">Instrucciones</h3>A continuación te informaremos de si el paciente superó la crisis."
			+ "</p><table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\">"
			+ "<tr><td><img src=\""+FaseControl.ImagenSindrome+"\" width=\"150px\"></td><td><img src=\""+FaseControl.ImagenSano+"\" width=\"150px\"></td></tr><tr><td>"
			+ "Paciente enfermo</td><td>Paciente curado</td></tr></table><p>Después de darte esa información, se te presentará la ficha del siguiente paciente. <br>"
			+ "Intenta averiguar hasta qué punto es efectivo el "+FaseTest.nombreClave+ ". "
			+ "Cuando hayas tratado a un buen número de pacientes te haremos algunas preguntas.</p>",

			"<p><h3 class=\"titulo\">Pregunta 1 / "+numberOfQuestions()+" </h3><p> ¿Podrías explicar con tus palabras cuál era el objetivo que tenías que cumplir en la tarea de este estudio? ¿Qué entendiste que debías hacer?",
		    "<p><h3 class=\"titulo\">Pregunta 2 / "+numberOfQuestions()+" </h3><p> ¿Cómo tomaste la decisión de dar o no el medicamento a cada paciente?",
		    "<p><h3 class=\"titulo\">Pregunta 3 / "+numberOfQuestions()+" </h3><p> En la pregunta final sobre la efectividad de la medicina, en la escala de 0 a 100, indicaste "+FaseTest.Juicio+".</p>" 
			+ "¿Cómo llegaste a esta conclusión sobre la efectividad del medicamento al final del experimento? ¿Hubo algún aspecto en particular que influyera en tu decisión?",
 	   		"<p><h3 class=\"titulo\">Pregunta 4 / "+numberOfQuestions()+" </h3><p> ¿Podrías explicar con tus palabras cuál es la efectividad de la medicina? ¿Qué significa ese número para ti?",
			"<p><h3 class=\"titulo\">Pregunta 5 / "+numberOfQuestions()+" </h3><p> ¿Qué te llevó a tomar la decisión de dar "+siempreOnunca()+" la medicina a los pacientes del experimento?",
							
			// A guardar datos! 
			//13: Save Data... 
			"<h3 class=\"titulo\">Envío de datos</h3><p>A continuación podrás enviar los resultados para que se incluyan en nuestro estudio. Los datos que nos aportes se unirán a los del grupo y serán analizados estadísticamente.</p><p align=\"left\"> Para hacerlo, haz click en el botón \"Enviar\".</p>",
			
			//13:
			"<h3 class=\"titulo\">Ya has terminado. ¡Muchas gracias por tu colaboración!</h3><p>El experimento que acabas de realizar está directamente relacionado con la materia explicada en el Capítulo 3 del libro “Psicología del Aprendizaje” que utilizas en tu asignatura del mismo nombre, concretamente con el concepto de “Contingencia” explicado en el apartado 2.1 de dicho capítulo. Para más información no dudes en ponerte en contacto con los autores del estudio.<br>"
				+" <br>Autores:<br>Carlos Vera, Pedro Montoro, Cristina Orgaz y María José Contreras.</p>"
				+ "<br><br> Pulsa F11 para salir del modo pantalla completa."
		];
	}
	else{
		//console.log("Preparando textos para grupo de BAJA");		 // Comentarios para debug
		arrayInstruc=[ // Instrucciones para los grupos B1 y B2: 
			//0: (portada)  
			"<h2 class=\"titulo\">ESTUDIO CVTD22XX2</h2><p>¡Muchas gracias por participar en esta investigación, no seria posible sin ti!</p><br><br><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"img/uned.png\" width=\"200px\"><p>Sigue las instrucciones que encontrarás a continuación.</p>",
				
			// EXPERIMENTAL! Instrucciones para la fase previa
			//2: Instrucciones 1
			"<h3 class=\"titulo\">Instrucciones</h3><p align=\"left\">Imagina que eres un médico que trabaja en el laboratorio de investigación de una universidad. Eres especialista en una enfermedad muy rara y peligrosa llamada "+ FaseTest.nombreSindrome+", que hay que tratar muy rápido en urgencias. Las crisis que provoca esta enfermedad podrían curarse inmediatamente con una medicina llamada "+ FaseTest.nombreClave+".<br>",
						
			//3: Instrucciones 2.a // 
			"<h3 class=\"titulo\">Instrucciones</h3><p> Como parte de un experimento piloto de los ensayos clínicos para evaluar la efectividad del \"Batatrim\", te vamos a presentar una serie de fichas médicas de pacientes que están sufriendo una crisis del \"Síndrome de Lindsay\". <br><br>En cada ficha verás un paciente al que se ha administrado \"Batatrim\" y se te pedirá intentar predecir si va a superar la crisis o no. </p>",
					
			//4: Instrucciones 2.b 
			"<h3 class=\"titulo\">Instrucciones</h3><p>El procedimiento será el siguiente: para cada nuevo paciente, debes intentar predecir si va a superar la crisis o no, pulsando la imagen correspondiente de las dos siguientes.</p><br><br>"
			+ "<table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\"><tr><td><img src=\""+FasePrevia.ImagenClave+"\" width=\"150px\"></td><td><img src=\""+FasePrevia.ImagenNOClave+"\" width=\"150px\"></td></tr><tr><td>Va a superar la crisis</td><td>No va a superar la crisis</td></tr></table><br><br>",
					
			//5: Instrucciones 2.c // 
			"<p><h3 class=\"titulo\">Instrucciones</h3>A continuación te informaremos de si el paciente superó la crisis.</p><table style=\"text-align: center; align-content: center; border:"
			+ " 0px; width: 100%;\"><tr><td><img src=\""+FasePrevia.ImagenSindrome+"\" width=\"150px\"></td><td><img src=\""+FasePrevia.ImagenSano+"\" width=\"150px\"></td></tr><tr><td>Paciente enfermo</td><td>Paciente curado</td></tr></table><p> Después de darte esa información, se te presentará la ficha del siguiente paciente.<br> Cuando hayas visto a un cierto número de pacientes pasaremos a la siguiente fase.</p>",
					
			//6: Instrucciones de la tarea de ALERGIAS
			"<p><h3 class=\"titulo\">Instrucciones</h3>Ya has terminado esta fase del estudio de "+FaseTest.nombreSindrome +". Como has visto, la tasa de recuperación de los pacientes que han recibido \"Batatrim\" ha sido "+FasePrevia.textoTransitBaja+". <br><br> Después de ver los resultados anteriores, se te ha invitado a participar en un nuevo experimento con un grupo de población distinto al del experimento piloto.</p>",
			
			//6: Instrucciones 1b Phase 2:
			"<p><h3 class=\"titulo\">Instrucciones</h3><p>Como parte de los ensayos clínicos para evaluar la efectividad del \"Batatrim\", te vamos a presentar una nueva serie de fichas médicas de pacientes que están sufriendo una crisis del \"Síndrome de Lindsay\". En cada ficha verás un paciente y se te dará la oportunidad de administrarle o no el \"Batatrim\". <br></p><table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\"><tr><td><img src=\""+FaseTest.ImagenClave+"\" width=\"150px\"></td><td><img src=\""+FaseTest.ImagenNOClave+"\" width=\"150px\"></td></tr><tr><td>Administrar la medicina</td><td>No administrar la medicina</td></tr></table>",
					
			//7: Instrucciones 2 Phase 2
			"<h3 class=\"titulo\">Instrucciones</h3><p>A continuación te informaremos de si el paciente superó la crisis. </p><table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\"><tr><td><img src=\""+FaseTest.ImagenSindrome+"\" width=\"150px\"></td><td><img src=\""+FaseTest.ImagenSano+"\" width=\"150px\"></td></tr><tr><td>Paciente enfermo</td><td>Paciente curado</td></tr></table><br><p>Después de darte esa información, se te presentará la ficha del siguiente paciente. <br>Intenta averiguar hasta qué punto es efectivo el "+FaseTest.nombreClave+ ". Cuando hayas tratado a un buen número de pacientes te haremos algunas preguntas.</p>",
					
			// A guardar datos via Firebase!  
			//13: Save Data...
			"<h3 class=\"titulo\">Envío de datos</h3><p>A continuación podrás enviar los resultados para que se incluyan en nuestro estudio. Los datos que nos aportes se unirán a los del grupo y serán analizados estadísticamente.</p><p align=\"left\"> Para hacerlo, haz click en el botón \"Enviar\".</p>",
					
			//13:
			"<h3 class=\"titulo\">Ya has terminado. ¡Muchas gracias por tu colaboración!</h3><p>El experimento que acabas de realizar está directamente relacionado con la materia explicada en el Capítulo 3 del libro “Psicología del Aprendizaje” que utilizas en tu asignatura del mismo nombre, concretamente con el concepto de “Contingencia” explicado en el apartado 2.1 de dicho capítulo. Para más información no dudes en ponerte en contacto con los autores del estudio.<br>"
				+" <br>Autores:<br>Carlos Vera, Pedro Montoro, Cristina Orgaz y María José Contreras.</p>"
				+ "<br><br> Pulsa F11 para salir del modo pantalla completa."
		];
	}
	
	if(grupoAsignado>3){

		//console.log("Preparando botones para grupo de CONTROL");		 // Comentarios para debug
		arrayBoton = [
			//0:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='cuestionarioEdad()' value='Empezar'/>",
			
			//1:
			//"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='cuestionarioEdad()' value='Continuar'/>",
			
			//2:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",
			//3:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
				+ "   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",

			//4:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
				+ "   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",
			
			//5:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
				+"   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='showCue()' value='Comenzar'/>",
			
			//6a:
			//"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",

			//6b:
			//"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
			//	+ "   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",

			
			//7:
			//"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
			//	+ "   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='showCue()' value='Comenzar'/>",
			
			//12:
			//"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",
			
			"<input type='button' class='botonFlow' style='font-size:100%' onclick='siguienteTexto()' value='Siguiente'/>",
		    "<input type='button' class='botonFlow' style='font-size:100%' onclick='siguienteTexto()' value='Siguiente'/>",
    		"<input type='button' class='botonFlow' style='font-size:100%' onclick='siguienteTexto()' value='Siguiente'/>",
    		"<input type='button' class='botonFlow' style='font-size:100%' onclick='siguienteTexto()' value='Siguiente'/>",
			"<input type='button' class='botonFlow' style='font-size:100%' onclick='siguienteTexto()' value='Siguiente'/>",



			// A guardar datos! 
			//13:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='saveData()' value='Enviar'/>",
			
			//14:
			""
			
		];
	}
	else {
		//console.log("Preparando textos para grupos B1 y B2");		 // Comentarios para debug
		arrayBoton = [
			//0:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='cuestionarioEdad()' value='Empezar'/>",
			
			//1:
			//"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='cuestionarioEdad()' value='Continuar'/>",
			
			//2:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",
			//3:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
				+ "   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",

			//4:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
				+ "   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",
			
			//5:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
				+"   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='showCue()' value='Comenzar'/>",
			
			//6a:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",

			//6b:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
				+ "   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",

			
			//7:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='previoTexto()' value='Atrás'/>"
				+ "   <input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='showCue()' value='Comenzar'/>",
			
			//12:
			//"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",

			// A guardar datos! 
			//13:
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='saveData()' value='Enviar'/>",
			
			//14:
			""
			];
	}
}

//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//FUNCIONES DE CUESTTIONARIOS:
//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++

function cuestionarioEdad(){
	
	if ( alertcount == 0){
			alertcount++
			alert("Pulsa F11 para verme a pantalla completa.");
	}
    ocultar(divTextos);
    mostrar(divCuestionariosEdad);
	
	// Aquí mientras se rellenan los cuestionarios lanzamos la llamada a Firebase 
	// para calcular grupos y tal
	asignagrupo(); 
	prepararTextos();   
	generaEnsayos();
	document.querySelector('input[name="edad"]').value="";
    
	/////// Aquí vamos a aprovechar para enviar a Firebase los datos de nuestro participante
	// Esta línea nos guarda el intento: 
	startData = "A participant has started with ID " + personId +" with IP:"+ participantIP;
	if (testeo == 0){ 
		guardaFirebase(startData, 'mySurvivalLogs');
	}
	else{
		console.log(startData);
	}
	///////
    var HTMLboton = "<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='validaEdad()' value='Continuar'/>";
    pintarHTML('divBoton', HTMLboton);
}

function validaEdad(){
    if(
        // Esta condición exige que se respondan las preguntas de experiencia y edad	
        //(document.querySelector('input[name="experiencia"]').value=="") || (document.querySelector('input[name="edad"]').value=="")
		(document.querySelector('input[name="edad"]').value=="")
      ) {
        alert("Contesta las preguntas, por favor");
    }
    
	else { //el género se puede dejar sin marcar.
        
        if (document.querySelector('input[name="gender"]:checked')==null) 
            Gender = "noescoge";
        else Gender = document.querySelector('input[name="gender"]:checked').value;	
		
        Age = document.querySelector('input[name="edad"]').value
		//Experience = document.querySelector('input[name="experiencia"]').value;
    	// Curso = document.querySelector('input[name="curso"]:checked').value;
        siguienteTexto();
	}
}


function validaPregunta(){
    if(document.querySelector('input[name="Pregunta'+stateQuest+'"]:checked')==null) alert("Contesta la pregunta, por favor");
    else {
        Cuestionario.push(document.querySelector('input[name="Pregunta'+stateQuest+'"]:checked').value);
        //console.log(Cuestionario);		// debug
        stateQuest++;
        siguienteTexto();
    } 
}


// Podría cambiarle el título, ya que ahora no es realmente esto sino una bienvenida. 
function pregInduccion(){
    ocultar(divTextos);
    mostrar(divPregInduccion);
    pintarHTML('divBoton', "<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='validaInduccion()' value='Aceptar y continuar'/>");
	
}


function validaInduccion(){
  
    if(document.querySelector('input[name="induccion1"]:checked')==null)
        // (document.querySelector('input[name="induccion1"]:checked')==null) || (document.querySelector('input[name="induccion2"]:checked')==null)
      // ) {
        // alert("Contesta las preguntas, por favor");
		alert("Para continuar, lee la hoja de información y confirma que estás de acuerdo con las condiciones.");
    
    else{
        PregInduccion = document.querySelector('input[name="induccion1"]').value;
        ocultar(divPregInduccion);
        siguienteTexto();
    }
}

//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//FUNCIONES DE SALIDA DE DATOS:
//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++

function stringDate() {
  fecha = new(Date);
  return(String(fecha.getDate() + "/" + (fecha.getMonth()+1) + "/" + fecha.getFullYear() + "-" + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds()));
}


function hideUnnecessaryElements() {
    const elementsToHide = [
        'divTextos',
        'divContingencia',
        'divJuicio',
        'divPregInduccion'
    ];

    elementsToHide.forEach(id => {
        let element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function saveData(){
	//console.log("We are now saving data!") // debug
    //showQuestion()
	var participantId = personId;

    stringDate();
    
    var Fase1countCells = new Map([...new Set(FaseTest.secuenciaCells)].map(
    x => [x, FaseTest.secuenciaCells.filter(y => y === x).length]));
    var Fase2countCells = new Map([...new Set(FasePrevia.secuenciaCells)].map(
    x => [x, FasePrevia.secuenciaCells.filter(y => y === x).length]));
    
    var BalanceoContingencia = FaseTest.Contingencia+"-"+FasePrevia.Contingencia;
     
	if(grupoAsignado>3){  // En esta caso estamos en un participante del grupo de control
		data = 
			"ExpCVTD22XX2" + "," + 
			groupNames[grupoAsignado] + "," + 
			personId + "," +                		//ID aleatorio
			participantIP + "," +						// IP del participante //Modified for testing TFK
			Age + "," +         		
			Gender + "," +		
			FaseTest.Juicio + "," + 				//Juicio 
			FaseTest.Confianza + "," + 				//Confianza
			FaseTest.secuenciaResps + "," + 		//Secuencia de respuestas dada
			FaseTest.posibleOutcomes + "," + 		//Secuencia de resultados de éxito presentada
			FaseTest.secuenciaCells + "," + 		//Secuencia de combinaciones acción-éxito
			FaseControl.secuenciaResps + "," + 		//Fase 2 - Secuencia de respuestas dada
			FaseControl.posibleOutcomes + "," + 	//Fase 2 - Secuencia de resultados de éxito presentada
			FaseControl.secuenciaCells + "," +  	//Fase 2 - Secuencia de combinaciones acción-éxito
			FaseTest.TiemposRespuesta + "," + 		//Tiempos de respuesta 
			fecha
	}
	else{
		data = 
			"ExpCVTD22XX2" + "," + 
			groupNames[grupoAsignado] + "," + 
			personId + "," +                		//ID aleatorio
			participantIP + "," +							// IP del participante //Modified for testing TFK
			Age + "," +         		
			Gender + "," +		
			FaseTest.Juicio + "," + 				//Juicio 
			FaseTest.Confianza + "," + 				//Confianza
			FaseTest.secuenciaResps + "," + 		//Secuencia de respuestas dada
			FaseTest.posibleOutcomes + "," + 		//Secuencia de resultados de éxito presentada
			FaseTest.secuenciaCells + "," + 		//Secuencia de combinaciones acción-éxito
			FasePrevia.secuenciaResps + "," + 		//Fase 2 - Secuencia de respuestas dada
			FasePrevia.posibleOutcomes + "," + 		//Fase 2 - Secuencia de resultados de éxito presentada
			FasePrevia.secuenciaCells + "," + 	 	//Fase 2 - Secuencia de combinaciones acción-éxito
			FaseTest.TiemposRespuesta + "," + 		//Tiempos de respuesta 
			fecha
	}

	// la siguiente línea guarda un vector con los participantes. 
	// Recordatorio de cómo se lee: 
	// grouplist = [grupoA1, grupoA2, grupoB1, grupoB2, grupoC1, grupoC2];
	//console.log("participantes: "+grouplist+".")			//debug
	grouplist[grupoAsignado]++
	//console.log("participantes: "+grouplist+".")			//debug
	firebase.database().ref('participantesPorGrupo').set(grouplist)
	//firebase.database().ref('participantes/porGrupo/participantesPorGrupo').set(grouplist)

    //console.log(data);      // Debug
    guardaFirebase(data,'datoscontrol/');
    siguienteTexto();
}

function guardaFirebase(myData, target ){

	var expdata={
		expName:"TFM-Carlos",
		datos:myData
	}
    
	firebase.database().ref(target).push(myData); 								// MODO Operativo! 
    //firebase.database().ref('datoscontrol/').push(data); 								// MODO DEMO SIN CONEXIÓN
	//console.log("Experimento realizado en modo DEMO. ¡Datos NO guardados!");			//debug
}

