//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//Variables globales:
//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++

//var personId = Math.floor((Math.random() * 1000000) + 1);
var personId = processText(stringDate());
var participantIP = "";
//var group =99; 
//var Balanceo = Math.floor(Math.random()*2 + 1);
var state=99;           //controla el ensayo dentro de cada fase
var stateTexto=99;      //controla la pantalla de textos
var fase = 0;           //controla en qué fase estamos  ---> No es de aplicación, porque solo tenemos una fase
var stateQuest = 1;     //controla en qué pregunta del cuestionario estamos
var training=[];        //contendrá el array de ensayos
var data=[];            //contendrá los datos.
var fecha="";           //contendrá la fecha/hora.
var Cuestionario=[];    //contiene las respuestas al cuestionario de generalizacion
var t0 = 0; 
var t1 = 0; 
var testeo = 1;  // variable para reducir el número de ensayos durante el testeo del código // mover a 0 para producción 
//var testeo = 0;  

// Indicadores de estado para ver qué pregunta se lanza  
var batatrimEvaluado = 0;	// Este lo usamos para evaluar el batatrim
var placeboEvaluado = 0; // Este lo vamos a usar para el placebo

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
var grupoH = 0;  // Grupo MIXTO Placebo-Batatrim
var grupoP = 0;	//  Solo Placebo
var grupoB = 0;	// Control -- Solo Batatrim

// Esta variable realmente se verá como la variable: grupoAsignado
// [grupoB = 0, grupoP = 1, grupoH = 2] 
var groupNames = ["batatrim", "placebo", "hibrido"];		//Usado para extraer datos


// creamos un array para ver el número de participantes en cada grupo
var grouplist = [grupoH, grupoP, grupoB];
var participantCount = new Array();
var tempArray = [0, 1, 2]; 
var tempShuffled = shuffle(tempArray);
var grupoAsignado = tempShuffled[0]; 	// Elige un grupo al azar



// Esta variable la usaremos para el grupo de SOLO BATATRIM
var grupoBatatrim = {
	nombreClave: ["\"Batatrim\"","\"Batatrim\""],
	nombreSindrome: "Síndrome de Lindsay",
	ImagenClave: ["img/BatatrimBoton.png","img/BatatrimBoton.png"], 
	ImagenNOClave: ["img/noBatatrimBoton.png","img/noBatatrimBoton.png"], 
	ImagenSindrome: "img/NooutcomeNuevo.png",
	ImagenSano: "img/outcomeNuevo.png",
	textoCue: "Este paciente tiene el Síndrome de Lindsay",
	textoPregunta: ["¿Quieres administrarle \"Batatrim\"?","¿Quieres administrarle \"Batatrim\"?"],
	textoYES: ["Has administrado \"Batatrim\"","Has administrado \"Batatrim\""],
	textoNO: ["No has administrado \"Batatrim\"","No has administrado \"Batatrim\""],
	numTrials: 100,
	posibleOutcomes: [],
	posibleOptions: [], 	// 0 para BATATRIM y 1 para CAPSULA DE GLUCOSA
	secuenciaCells: [],
	secuenciaResps: [],
	Juicio: 999,
	JuicioPlacebo: 999,
	Confianza: 999,
	NPS: 999,
	TiemposRespuesta: [],
};
// Esta variable la usaremos para el grupo de SOLO PLACEBO
var grupoPlacebo = {
	nombreClave: ["\"Cápsula placebo de sacarosa \"","\"Cápsula placebo de sacarosa \""],
	nombreSindrome: "Síndrome de Lindsay",
	ImagenClave: ["img/PlaceboBoton.png","img/PlaceboBoton.png"],
	ImagenNOClave: ["img/noPlaceboBoton.png","img/noPlaceboBoton.png"], 
	ImagenSindrome: "img/Nooutcome.png",
	ImagenSano: "img/outcome.png",
	textoCue: "Este paciente tiene el Síndrome de Lindsay",
	textoPregunta: ["¿Quieres administrarle una Cápsula placebo de sacarosa?","¿Quieres administrarle una Cápsula placebo de sacarosa?"],
	textoYES: ["Has administrado una Cápsula placebo de sacarosa","Has administrado una Cápsula placebo de sacarosa"],
	textoNO: ["No has administrado una Cápsula placebo de sacarosa","No has administrado una Cápsula placebo de sacarosa"],
	numTrials: 100,
	posibleOutcomes: [],
	posibleOptions: [], 	// 0 para BATATRIM y 1 para CAPSULA DE GLUCOSA
	secuenciaCells: [],
	secuenciaResps: [],
	Juicio: 999,
	JuicioPlacebo: 999,
	Confianza: 999,
	NPS: 999,
	TiemposRespuesta: [],
};
// Esta variable la usaremos para el grupo A de CONDICIÓN MIXTA PLACEBO & BATATRIM
var grupoHibrido = {
	// Index 0 = Batatrim, Index 1 = Placebo
	nombreClave: ["\"Batatrim\"","\"Cápsula placebo de sacarosa \""],
	nombreSindrome: "Síndrome de Lindsay",
	ImagenClave: ["img/BatatrimBoton.png","img/PlaceboBoton.png"], 
	ImagenNOClave: ["img/noBatatrimBoton.png","img/noPlaceboBoton.png"], 
	ImagenSindrome: "img/NooutcomeNuevo.png",
	ImagenSano: "img/outcomeNuevo.png",
	textoCue: "Este paciente tiene el Síndrome de Lindsay",
	textoPregunta: ["¿Quieres administrarle \"Batatrim\"?","¿Quieres administrarle una Cápsula placebo de sacarosa?"],
	textoYES: ["Has administrado \"Batatrim\"","Has administrado una Cápsula placebo de sacarosa"],
	textoNO: ["No has administrado \"Batatrim\"","No has administrado una Cápsula placebo de sacarosa"],
	numTrials: 100,
	posibleOutcomes: [],
	posibleOptions: [], 	// 0 para BATATRIM y 1 para CAPSULA DE GLUCOSA
	secuenciaCells: [],
	secuenciaResps: [],
	Juicio: 999,
	JuicioPlacebo: 999,
	Confianza: 999,
	NPS: 999,
	TiemposRespuesta: [],
};

if(testeo === 1){
	grupoHibrido.numTrials = 5;
	grupoPlacebo.numTrials = 2;
	grupoBatatrim.numTrials = 2; 
	console.log("Reduced trials!! This should only be running during tests.")
}

// Agrupamos las variables que hemos sacado antes en "misGrupos": 
misGrupos = [grupoBatatrim, grupoPlacebo, grupoHibrido];


//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//Funciones generales:
//++++++++++++++++++++++++++++++++++++++
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
	asignagrupo();
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
	}
	if(testeo === 1){
		console.log("El GRUPO asignado es el: "+groupNames[grupoAsignado]+".");		//debug
		//console.log("El grupo asignado es el: "+grupoAsignado+".");					// debug
		console.log("Grupo asignado aleatorio es el:"+grupoAsignado+".") 				// debug
	}
	// TODO ESTE BLOQUE SIGUIENTE CHECKEA LAS PROBABILIDADES: 
	group= "No asignado";	
	// En función del número de participantes que hayan realizado la tarea en la secuencia normal
	// y de contrabalanceo, asigna a un grupo o a otro al participante. 

	
	training=misGrupos[grupoAsignado];		
	if(grupoAsignado == 0){	// Grupo Batatrim no evalúa Placebo: 
		placeboEvaluado = 1; 
	}
	else{	// Grupo Placebo no evalúa Batatrim
		batatrimEvaluado = 1; 
	}
	
	if(testeo === 1){
		console.log("Pues te ha tocado grupo :"+groupNames[grupoAsignado]+".");		//debug
		console.log(training.nombreClave[0]);
	}
}    
//++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++
//GENERACION DE ENSAYOS:

function generaEnsayos(){
	var arrayOutcome = [];

	for(var i=0; i<10; i++){ //creo 10 bloques de 10 con 30%/70% de éxito
		var block= [1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
		block=shuffle(block);
		arrayOutcome = arrayOutcome.concat(block);
	}
	// Ahora generamos la secuencia de ensayos de Batatrim y Glucosa para asegurar el reparto igual.
	 // Create arrayOptions with balanced drug assignment
    let arrayOptions = new Array(100).fill(0);
    
    // drug0[0] = slots for when arrayOutcome[i] = 0, drug0[1] = slots for when arrayOutcome[i] = 1
    let drug0 = [15, 35]; // 15 zeros, 35 ones --> 35 éxitos 
    let drug1 = [15, 35]; // 15 zeros, 35 ones --> 35 éxitos 

	// Iterate over arrayOutcome and assign drugs randomly
    for (let i = 0; i < arrayOutcome.length; i++) {	
        let outcome = arrayOutcome[i]; // either 0 or 1
		//console.log(outcome)
        let availableDrugs = [];
		
		//console.log("Available drugs:");
		//console.log(drug0);
		//console.log(drug0[outcome]);
		//console.log(drug1);
		//console.log(drug1[outcome]);
        // Check which drugs still have slots available for this outcome
		if (drug0[outcome] > 0){
			//console.log("yes, we can add drug0");
			availableDrugs.push(0);
		} 
		if (drug1[outcome] > 0) {
			//console.log("yes, we can add drug1");
			availableDrugs.push(1);
		}
		//console.log(availableDrugs)		
		// Randomly choose one of the available drugs
		if (availableDrugs.length > 0) {
			let chosenDrug = availableDrugs[Math.floor(Math.random() * availableDrugs.length)];
			arrayOptions[i] = chosenDrug;
			// Subtract 1 from the chosen drug's slot for this outcome
			if (chosenDrug === 0) {
				drug0[outcome]--;
			} else {
				drug1[outcome]--;
			}
		}
	}

    //console.log("Drug distribution:");
	//console.log(arrayOptions)
	//console.log(arrayOutcome)
	grupoBatatrim.posibleOutcomes=arrayOutcome;
	grupoPlacebo.posibleOutcomes=arrayOutcome;
	grupoHibrido.posibleOutcomes=arrayOutcome;

	grupoBatatrim.posibleOptions=new Array(100).fill(0); // 0 --> BATATRIM
	grupoPlacebo.posibleOptions=new Array(100).fill(1); // 1 --> PLACEBO
	grupoHibrido.posibleOptions=arrayOptions;
}
// Test the function
function testFunctionEnsayosGenerados() {

	// Esta función comprueba que se hayan repartido bien: 	
	arrayOutcome=grupoHibrido.posibleOutcomes;
	arrayOptions=grupoHibrido.posibleOptions;
    
    // Verify constraints
    let onesInOutcome = arrayOutcome.filter(x => x === 1).length;
    let zerosInOutcome = arrayOutcome.filter(x => x === 0).length;
    let drug0Count = arrayOptions.filter(x => x === 0).length;
    let drug1Count = arrayOptions.filter(x => x === 1).length;
    
    console.log(`\nVerification:`);
    console.log(`ArrayOutcome - Ones: ${onesInOutcome}, Zeros: ${zerosInOutcome}`);
    console.log(`ArrayOptions - Drug0: ${drug0Count}, Drug1: ${drug1Count}`);
    
    // Check the distribution for each drug
    let drug0_with_outcome0 = 0, drug0_with_outcome1 = 0;
    let drug1_with_outcome0 = 0, drug1_with_outcome1 = 0;
    
    for (let i = 0; i < 100; i++) {
        if (arrayOptions[i] === 0) { // Drug 0
            if (arrayOutcome[i] === 0) drug0_with_outcome0++;
            else drug0_with_outcome1++;
        } else { // Drug 1
            if (arrayOutcome[i] === 0) drug1_with_outcome0++;
            else drug1_with_outcome1++;
        }
    }
    
    console.log(`\nDrug distribution:`);
    console.log(`Drug0 - with outcome 0: ${drug0_with_outcome0}, with outcome 1: ${drug0_with_outcome1}`);
    console.log(`Drug1 - with outcome 0: ${drug1_with_outcome0}, with outcome 1: ${drug1_with_outcome1}`);
    console.log(`Target for each drug: 15 zeros, 35 ones`);
    return;
}

function RandomString(length){
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
	//console.log("Aquí estams pintando -- training.ImagenSindrome --");
	pintarHTML("divPreStatus", "<img src=\""+training.ImagenSindrome+"\" width=250px>"+
            "<br><br><br><p class=\"mensaje\">"+training.textoCue+"</p><p class=\"mensaje\">"+training.textoPregunta[training.posibleOptions[training.secuenciaResps.length]]+"</p>");  // TFK Hay que revisar cómo estamos viendo en qué trial vamos
    
	pintarHTML("divRegistro", "<h3>Paciente "+RandomString(4)+"</h3>");
	
	
    mostrar(divRegistro);
    mostrar(divPreStatus);
    setTimeout('mostrarEleccion()', 100);
    
    //mostrar(divEleccion);
    //setTimeout('mostrar(divEleccion)', 500); 
}

function mostrarEleccion(){
		
		// Tenemos que customiza los paneles según el grupo y el tipo de ensayo. TFK REVISAR
		// Para grupo Batatrim: ImagenClave[0]
		// Para grupo Placebo: ImagenClave[0]
		// Para grupo Hibrido: ImagenClave[posibleOption][0]

	// training.posibleOptions[training.secuenciaResps.length] ---> Así podemos saber por qué número de ensayo vamos.
	if(BalPanel==1){
			if (grupoAsignado == 2) { 
				pintarHTML('divEleccion',
				"<div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training.ImagenClave[training.posibleOptions[training.secuenciaResps.length]]+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training.ImagenNOClave[training.posibleOptions[training.secuenciaResps.length]]+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div id=\"mensajeCue\"></div>"
				);
			}
			else {
				pintarHTML('divEleccion',
				"<div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training.ImagenClave[0]+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training.ImagenNOClave[0]+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div id=\"mensajeCue\"></div>"
				);
			}
	}
		else if(BalPanel==2){
				if (grupoAsignado == 2) { 
					pintarHTML('divEleccion',
				   "<div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training.ImagenNOClave[training.posibleOptions[training.secuenciaResps.length]]+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training.ImagenClave[training.posibleOptions[training.secuenciaResps.length]]+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div id=\"mensajeCue\"></div>"
				   );
				}
				else {
					pintarHTML('divEleccion',
				   "<div ><button id=\"botonNO\" value=\"NO\" class=\"botonEleccion\" onclick='respuestaNO()'><img src=\""+training.ImagenNOClave[0]+"\" width=150px  class=\"icon icon_hover\" id=\"imagenNO\"></button></div><div ><button id=\"botonYES\" value=\"YES\" class=\"botonEleccion\" onclick='respuestaYES()'><img src=\""+training.ImagenClave[0]+"\" width=150px class=\"icon icon_hover\" id=\"imagenYES\"></button></div><div id=\"mensajeCue\"></div>"
				   );
				}

		}

	mostrar(divEleccion);
}

function respuestaYES(){
	t1 = performance.now(); // Medir tiempos
	//console.log("El tiempo actual es: "+t1+"."); // debug
	tiempotranscurrido = t1 - t0; //
	//console.log("El tiempo de respuesta es: "+tiempotranscurrido+"."); // debug
	training.TiemposRespuesta.push(tiempotranscurrido); 
	
	
	document.getElementById("botonNO").classList.add('unselected');
    training.secuenciaResps.push(1); //Aquí guardamos la respuesta al ensayo, con lo que que al mostrar el texto, hay que reducir 1
    document.getElementById("imagenYES").classList.remove('icon_hover');
    document.getElementById("imagenYES").classList.remove('icon');
    document.getElementById("imagenNO").classList.remove('icon');
    document.getElementById("imagenYES").classList.add('iconselected');
    
    document.getElementById("botonYES").disabled = true;
    document.getElementById("botonNO").disabled = true;

    document.getElementById("divPreStatus").classList.add('FadeOut');
    mostrar(divPreStatus);
    // En la siguiente línea restamos 1 porque ya hemos añadido la respuesta al ensayo en la secuenciaResps:
	pintarHTML("mensajeCue", "<p class=\"mensaje\">"+training.textoYES[training.posibleOptions[training.secuenciaResps.length-1]]+"</p>");
    
    setTimeout('showOutcome()', 100);
}

function respuestaNO(){
	t1 = performance.now(); // Medir tiempos
	//console.log("El tiempo actual es: "+t1+"."); // debug
	tiempotranscurrido = t1 - t0; //Medir tiempos
	//console.log("El tiempo de respuesta es: "+tiempotranscurrido+".");// debug
	training.TiemposRespuesta.push(tiempotranscurrido); 
	
    document.getElementById("botonYES").classList.add('unselected');
    training.secuenciaResps.push(0); //Aquí guardamos la respuesta al ensayo, con lo que que al mostrar el texto, hay que reducir 1 
    document.getElementById("imagenNO").classList.remove('icon_hover');
    document.getElementById("imagenYES").classList.remove('icon');
    document.getElementById("imagenNO").classList.remove('icon');
    document.getElementById("imagenNO").classList.add('iconselected');       
    
    document.getElementById("botonYES").disabled = true;
    document.getElementById("botonNO").disabled = true;
    
    document.getElementById("divPreStatus").classList.add('FadeOut');
    mostrar(divPreStatus);
    // En la siguiente línea restamos 1 porque ya hemos añadido la respuesta al ensayo en la secuenciaResps:
    pintarHTML("mensajeCue", "<p class=\"mensaje\">"+training.textoNO[training.posibleOptions[training.secuenciaResps.length-1]]+"</p>");
    
    setTimeout('showOutcome()', 100);
}


function showOutcome(){

    var imgOutcome = "";
    var textoOutcome = "";
    
    switch(training.secuenciaResps[state]){
        case 1: //si ha respondido 1 --> Administrar Batatrim:
            if(training.posibleOutcomes[state]==1) {
                imgOutcome = training.ImagenSano;
				textoOutcome = "<br><p class=\"mensaje\">¡El paciente ha superado la crisis!</p>";
				training.secuenciaCells.push("a");
                //console.log(" debug: cell a");
            }
                
            else {
			//else if(training.posibleOutcomes[state]==0){
                imgOutcome = training.ImagenSindrome;
				textoOutcome = "<br><p class=\"mensajeMALO\">¡El paciente NO ha superado la crisis!</p>";
                training.secuenciaCells.push("b");
                //console.log(" debug: cell b");
            }
     
            break;
        case 0: //si ha respondido 0 --> no administrar Batatrim:
            if(training.posibleOutcomes[state]==1) {
                imgOutcome = training.ImagenSano;
				textoOutcome = "<br><p class=\"mensaje\">¡El paciente ha superado la crisis!</p>"; //en estos bloques hemos eliminado el if del Case 1
				training.secuenciaCells.push("c");   
                //console.log(" debug: cell c"); 				// debug
            }
            
			else {
            //else if(training.posibleOutcomes[state]==0){
                imgOutcome = training.ImagenSindrome;
				textoOutcome = "<br><p class=\"mensajeMALO\">¡El paciente NO ha superado la crisis!</p>";
                training.secuenciaCells.push("d"); 
                //console.log(" debug: cell d"); 				// debug
            }            
            
    }
        

    pintarHTML('divOutcome', "<img src=\""+imgOutcome+"\" width=250px><br><br>"+textoOutcome);
    pintarHTML('divBoton', "<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='ITI()' value='Siguiente paciente'/>");	
	
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
    
    if(state<training.numTrials-1){	// Esta es la función FIN de los ensayos, que hace de trigger del final.
        console.log("Aquí vamos a ir haciendo capturas del estado. State: "+state);
		state++;
        setTimeout("showCue()", 100);
		
		// Aquí vamos a ir haciendo capturas
		if((state+1) % grupoBatatrim.numTrials == 0){
			startData = "A participant with ID " + personId +","+ "reached state:"+ ","+ state +","+ stringDate();
			if (testeo == 0){
				guardaFirebase(startData, 'mySurvivalLogs');				
			}
			else {
				console.log(startData);
			}
		}
    }
    else if(state==training.numTrials-1){

		// Aquí nos vamos a saltar el Juicio si estamos en el grupo PLACEBO. Este grupo es el: 1
		if(grupoAsignado == 1){ 	// Estamos en grupo PLACEBO
			
			if(testeo == 1){
				console.log("Nos saltamos el juicio, es grupo PLACEBO");
			}
			validaJuicio();
		}
		else{
			showJuicio();
		}
	}
	    
}

function showJuicio(){
    ocultar(divContingencia);
    ocultar(divTextos);
	
	textoJuicio= "<p class=\"pregunta\">¿Hasta qué punto crees que el "+
			training.nombreClave[0]+" es efectivo para curar las crisis del "+training.nombreSindrome+"?</p>";
	

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

function showJuicioPlacebo(){
    ocultar(divContingencia);
    ocultar(divTextos);
	//  Aquí lo vamos a usar para evaluar el PLACEBO. 
	//textoConfianza= "<p class=\"pregunta\">En una escala del 0 al 10, ¿cómo de probable es que recomendaras a un paciente tomar "+training.nombreClave[0]+"?</p>";
	//textoInstrucciones="<p>Responde usando la siguiente escala, donde los números se interpretan así:</p><ul><li>0: No lo recomendaría en absoluto.</li><li>10: Lo recomendaría con total seguridad.</li></ul></p><br><br>";
	//textoConfianza = textoConfianza.concat(textoInstrucciones);
	textoConfianza= "<p class=\"pregunta\">¿Hasta qué punto crees que la "+
			training.nombreClave[1]+" es efectivo para curar las crisis del "+training.nombreSindrome+"?</p>";
	

	textoInstrucciones="<p>Responde usando la siguiente escala, donde los números se interpretan así:</p><ul><li>0: Nada efectivo.</li><li>100: Completamente efectivo.</li></ul><p>Puedes hacer clic dentro de la escala tantas veces como desees hasta marcar el valor que consideres más adecuado. Cualquier valor entre 0 y 100 es válido. También puedes usar las flechas del teclado (izquierda / derecha) para ajustar el valor de la respuesta con más precisión. </p><br><br>";
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


// Esta es la función que actualiza el valor según lo que se marca en la escala, dividíamos entre 10 para el NPS
function updateTextInput(val) {
	//if(placeboEvaluado ==1 ){  // Con este valor = 1, cuando se actualiza divide ls valores entre 10. 
	if(placeboEvaluado ==100 ){
		document.getElementById('textInput').value=Math.floor(val/10);
	}
	else {
		document.getElementById('textInput').value=val;
	} 
}

function updateLimit() {
	//if(placeboEvaluado ==1 ){  // Con este valor = 1, cuando se actualiza divide ls valores entre 10. 
	if(placeboEvaluado ==100 ){
		return 10;
	}
	else {
		return 100;
	} 
}

function updateLimitMax() {
	//if(placeboEvaluado ==1 ){  // Con este valor = 1, cuando se actualiza divide ls valores entre 10. 
	if(placeboEvaluado ==100 ){
		document.getElementById('textInput').value=Math.floor(val/10);
	}
	else {
		document.getElementById('textInput').value=val;
	} 
}

function validaJuicio(){
    if (document.getElementById('textInput').value!=""){
		
		// Vamos a grabar el valor del slider en un punto u otro según nuestra fase
		if(batatrimEvaluado == 0){ 	// Solo se activa para agrupo BATATRIM / HIBRIDO
			//training.Juicio=document.getElementById('textInput').value;

			if(grupoAsignado == 0){ 	// Estamos en grupo BATATRIM -- guardamos un valor de control. 
				training.JuicioPlacebo= 555;   // Valor para grupo BATATRIM, que es el grupoAsignado 0 				
			}
			
			training.Juicio=document.getElementById('textInput').value;			
			batatrimEvaluado++;

			// Una vez que ya se ha lanzado el juicio, cambiamos la escala para el NPS --> YA NO LO CAMBIAMOS (experimento anterior con NPS)
			// Get the elements by their class name
			//var separador2 = document.getElementsByClassName("separador2")[0];
			//var separador3 = document.getElementsByClassName("separador3")[0];

			// Change their content
			//separador2.innerHTML = "5<br>|";
			//separador3.innerHTML = "10<br>|";

		}	
		else if(placeboEvaluado == 0){	// Solo se activa para grupo PLACEBO / HIBRIDO
			
			if(grupoAsignado == 1){ 	// Estamos en grupo PLACEBO, por lo que no hay Juicio de Batatrim
				training.Juicio==777; // Valor para grupo Placebo -- guardamos un valor de control. 
			}
			training.JuicioPlacebo=document.getElementById('textInput').value;			// Valor para grupo Placebo o Hibrido, que es el real
			placeboEvaluado++;
		}	
		
		document.getElementById("sliderJuicio").classList.remove('sliderCONTPrimero');
		
		if(placeboEvaluado==0){
			showJuicioPlacebo();
		}
		else if(placeboEvaluado==1){
			// prepararTextos(); // Esto ya no aplica, era para preparar los segundos textos
			//cambiafase(); // COMENTAMOS PORQUE SOLO HAY 1 FASE
			siguienteTexto(); // Si esto se activa es que ya tenemos los juicios completos y hay que proseguir. 
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
        
		batatrimEvaluado=0;
		npsEvaluada=0;
		placeboEvaluado=0;

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
    if ((grupoBatatrim.secuenciaResps.reduce((a, b) => a + b, 0) / grupoBatatrim.numTrials) > 0.94 || (grupoBatatrim.secuenciaResps.reduce((a, b) => a + b, 0) / grupoBatatrim.numTrials) < 0.05) {
        return 1;
    }
    return 0;
}

// Esta función controla cuántas preguntas se hace al final del experimento
function numberOfQuestions() {
    return 4 + shouldShowFifthQuestion();
}

function siempreOnunca() { 
	// Esto hace que vaya a aumentar en uno el número de preguntas para participantes extremos 
	if (grupoBatatrim.secuenciaResps.reduce((a, b) => a + b, 0) / grupoBatatrim.numTrials == 1) {
        return "siempre";
    }
	if (grupoBatatrim.secuenciaResps.reduce((a, b) => a + b, 0) / grupoBatatrim.numTrials == 0) {
        return "nunca";
    }
	if (grupoBatatrim.secuenciaResps.reduce((a, b) => a + b, 0) / grupoBatatrim.numTrials > 0.94) {
        return "prácticamente siempre";
    }
	if (grupoBatatrim.secuenciaResps.reduce((a, b) => a + b, 0) / grupoBatatrim.numTrials < 0.05) {
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
	console.log(`Current State is${stateTexto}`); //

    if (stateTexto >= arrayInstruc.length - 6) {
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
	// En esta función tenemos la llamada a los Cuestionarios de Edad, ver después del array de instrucciones. 
	if(grupoAsignado == 0){ // Instrucciones para grupo de solo Batatrim: 
		if (testeo == 1){ 
			console.log("Preparando textos para grupo de solo Batatrim");			//debug
			grupoHibrido.numTrials = 5;
			grupoPlacebo.numTrials = 2;
			grupoBatatrim.numTrials = 2; 
			console.log("Reduced trials!! This should only be running during tests.");
		}
		arrayInstruc=[
			//0: (portada) 
			"<h2 class=\"titulo\">ESTUDIO CVTD23XX2</h2><p>¡Muchas gracias por participar en esta investigación, no seria posible sin ti!</p><br><br><img style=\"display"
			+ ": block; margin-left: auto; margin-right: auto;\" src=\"img/uned.png\" width=\"200px\"><p>Sigue las instrucciones que encontrarás a continuación.</p>",
		
			//2: Instrucciones 1 
			"<h3 class=\"titulo\">Instrucciones</h3><p align=\"left\">Imagina que eres un médico que trabaja en el laboratorio de investigación de una universidad. "
			+ "Eres especialista en una enfermedad muy rara y peligrosa llamada "+ training.nombreSindrome+", que hay que tratar muy rápido en urgencias. "
			+ "Las crisis que provoca esta enfermedad podrían curarse inmediatamente con una medicina llamada "+ training.nombreClave[0]+", pero esta medicina aún está en " 
			+ "fase experimental, por lo que todavía no se ha comprobado claramente su efectividad.</p><br>",
			
			//3: Instrucciones 2.a 
			"<h3 class=\"titulo\">Instrucciones</h3><p>Como parte de los ensayos clínicos para evaluar la efectividad del \"Batatrim\", te vamos a presentar una serie "
				+ "de fichas médicas de pacientes que están sufriendo una crisis del "+training.nombreSindrome +". En cada ficha verás un paciente y se te dará la oportunidad "
				+ "de administrarle o no el "+training.nombreClave[0]+ ".</p>",
			
			//4: Instrucciones 2.b 
			"<h3 class=\"titulo\">Instrucciones</h3><p>El procedimiento será el siguiente: para cada nuevo paciente, debes decidir si quieres administrar el "
			+ ""+training.nombreClave[0]+ " o no, pulsando la imagen correspondiente de las dos siguientes.</p><br><br><table style=\"text-align: center; align-content:"
			+ "center; border: 0px; width: 100%;\"><tr><td><img src=\""+training.ImagenClave[0]+"\" width=\"150px\"></td><td><img src=\""+training.ImagenNOClave[0]+"\" width"
			+ "=\"150px\"></td></tr><tr><td>Administrar la medicina</td><td>No administrar la medicina</td></tr></table><br><br>",
			
			//5: Instrucciones 2.c 
			"<p><h3 class=\"titulo\">Instrucciones</h3>A continuación te informaremos de si el paciente superó la crisis."
			+ "</p><table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\">"
			+ "<tr><td><img src=\""+training.ImagenSindrome+"\" width=\"150px\"></td><td><img src=\""+training.ImagenSano+"\" width=\"150px\"></td></tr><tr><td>"
			+ "Paciente enfermo</td><td>Paciente curado</td></tr></table><p>Después de darte esa información, se te presentará la ficha del siguiente paciente. <br>"
			+ "Intenta averiguar hasta qué punto es efectivo el "+training.nombreClave[0]+ ". "
			+ "Cuando hayas tratado a un buen número de pacientes te haremos algunas preguntas.</p>",

			"<p><h3 class=\"titulo\">Pregunta 1 / "+numberOfQuestions()+" </h3><p> ¿Podrías explicar con tus palabras cuál era el objetivo que tenías que cumplir en la tarea de este estudio? ¿Qué entendiste que debías hacer?",
		    "<p><h3 class=\"titulo\">Pregunta 2 / "+numberOfQuestions()+" </h3><p> ¿Cómo tomaste la decisión de dar o no el medicamento a cada paciente?",
		    "<p><h3 class=\"titulo\">Pregunta 3 / "+numberOfQuestions()+" </h3><p> En la pregunta final sobre la efectividad de la medicina, en la escala de 0 a 100, indicaste "+training.Juicio+".</p>" 
			+ "¿Cómo llegaste a esta conclusión sobre la efectividad del medicamento al final del experimento? ¿Hubo algún aspecto en particular que influyera en tu decisión?",
			"<p><h3 class=\"titulo\">Pregunta 5 / "+numberOfQuestions()+" </h3><p> ¿Podrías explicar con tus palabras cuál es la efectividad de la medicina? ¿Qué significa ese número para ti?",
							
			// A guardar datos! 
			//13: Save Data... 
			"<h3 class=\"titulo\">Envío de datos</h3><p>A continuación podrás enviar los resultados para que se incluyan en nuestro estudio. Los datos que nos aportes se unirán a los del grupo y serán analizados estadísticamente.</p><p align=\"left\"> Para hacerlo, haz click en el botón \"Enviar\".</p>",
			
			//13:
			"<h3 class=\"titulo\">Ya has terminado. ¡Muchas gracias por tu colaboración!</h3><p>El experimento que acabas de realizar está directamente relacionado con la materia explicada en el Capítulo 3 del libro “Psicología del Aprendizaje” que utilizas en tu asignatura del mismo nombre, concretamente con el concepto de “Contingencia” explicado en el apartado 2.1 de dicho capítulo. Para más información no dudes en ponerte en contacto con los autores del estudio.<br>"
				+" <br>Autores:<br>Daniel Segura, Carlos Vera, Pedro Montoro y Cristina Orgaz.</p>"
				+ "<br><br> Pulsa F11 para salir del modo pantalla completa."
		];
	}
	else if(grupoAsignado == 1){ // Instrucciones para grupo de solo Placebo: 

		if (testeo == 1){ 
			console.log("Preparando textos para grupo de solo Placebo");			//debug
			grupoHibrido.numTrials = 5;
			grupoPlacebo.numTrials = 2;
			grupoBatatrim.numTrials = 2; 
			console.log("Reduced trials!! This should only be running during tests.");
		}
		arrayInstruc=[
			//0: (portada) 
			"<h2 class=\"titulo\">ESTUDIO CVTD23XX2</h2><p>¡Muchas gracias por participar en esta investigación, no seria posible sin ti!</p><br><br><img style=\"display"
			+ ": block; margin-left: auto; margin-right: auto;\" src=\"img/uned.png\" width=\"200px\"><p>Sigue las instrucciones que encontrarás a continuación.</p>",
		
			//2: Instrucciones 1 
			"<h3 class=\"titulo\">Instrucciones</h3><p align=\"left\">Imagina que eres un médico que trabaja en el laboratorio de investigación de una universidad. "
			+ "Eres especialista en una enfermedad muy rara y peligrosa llamada "+ training.nombreSindrome+", que hay que tratar muy rápido en urgencias. "
			+ "Las crisis que provoca esta enfermedad podrían mitigarse por medio del consumo de una cápsula placebo de sacarosa (azúcar), pero aún no hay datos suficientes " 
			+ "de la efectividad de dicha cápsula. <br> La sacarosa es ampliamente usada como placebo debido a que en condiciones generales no produce ningún tipo de efecto terapéutico.<br>"
			+ "Tenga en cuenta que en el campo de la medicina el efecto placebo consiste en  administrar una sustancia inerte (en la presente investigación una cápsula de sacarosa) que"
			+ " por sí mismo no consta de ningún efecto terapéutico y que, sin embargo, la persona que lo recibe afirma encontrarse mejor debido a esta intervención.</p><br>",
			
			//3: Instrucciones 2.a 
			"<h3 class=\"titulo\">Instrucciones</h3><p>Como parte de los ensayos clínicos para evaluar la efectividad del "+ training.nombreClave[0]+", te vamos a presentar una serie "
				+ "de fichas médicas de pacientes que están sufriendo una crisis del "+training.nombreSindrome +". En cada ficha verás un paciente y se te dará la oportunidad "
				+ "de administrarle o no el "+training.nombreClave[0]+ ".</p>",
			
			//4: Instrucciones 2.b 
			"<h3 class=\"titulo\">Instrucciones</h3><p>El procedimiento será el siguiente: para cada nuevo paciente, debes decidir si quieres administrar el "
			+ ""+training.nombreClave[0]+ " o no, pulsando la imagen correspondiente de las dos siguientes.</p><br><br><table style=\"text-align: center; align-content:"
			+ "center; border: 0px; width: 100%;\"><tr><td><img src=\""+training.ImagenClave[0]+"\" width=\"150px\"></td><td><img src=\""+training.ImagenNOClave[0]+"\" width"
			+ "=\"150px\"></td></tr><tr><td>Administrar la medicina</td><td>No administrar la medicina</td></tr></table><br><br>",
			
			//5: Instrucciones 2.c 
			"<p><h3 class=\"titulo\">Instrucciones</h3>A continuación te informaremos de si el paciente superó la crisis."
			+ "</p><table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\">"
			+ "<tr><td><img src=\""+training.ImagenSindrome+"\" width=\"150px\"></td><td><img src=\""+training.ImagenSano+"\" width=\"150px\"></td></tr><tr><td>"
			+ "Paciente enfermo</td><td>Paciente curado</td></tr></table><p>Después de darte esa información, se te presentará la ficha del siguiente paciente. <br>"
			+ "Intenta averiguar hasta qué punto es efectivo el "+training.nombreClave[0]+ ". "
			+ "Cuando hayas tratado a un buen número de pacientes te haremos algunas preguntas.</p>",

			"<p><h3 class=\"titulo\">Pregunta 1 / "+numberOfQuestions()+" </h3><p> ¿Podrías explicar con tus palabras cuál era el objetivo que tenías que cumplir en la tarea de este estudio? ¿Qué entendiste que debías hacer?",
		    "<p><h3 class=\"titulo\">Pregunta 2 / "+numberOfQuestions()+" </h3><p> ¿Cómo tomaste la decisión de dar o no el placebo a cada paciente?",
 	   		"<p><h3 class=\"titulo\">Pregunta 4 / "+numberOfQuestions()+" </h3><p> En la pregunta final sobre la efectividad del placebo, en la escala de 0 a 100, indicaste "+training.Juicio+".</p>"  
			+ "¿Cómo llegaste a esta conclusión sobre la efectividad del placebo al final del experimento? ¿Hubo algún aspecto en particular que influyera en tu decisión?",
			"<p><h3 class=\"titulo\">Pregunta 5 / "+numberOfQuestions()+" </h3><p> ¿Podrías explicar con tus palabras cuál es la efectividad del placebo? ¿Qué significa ese número para ti?",
							
			// A guardar datos! 
			//13: Save Data... 
			"<h3 class=\"titulo\">Envío de datos</h3><p>A continuación podrás enviar los resultados para que se incluyan en nuestro estudio. Los datos que nos aportes se unirán a los del grupo y serán analizados estadísticamente.</p><p align=\"left\"> Para hacerlo, haz click en el botón \"Enviar\".</p>",
			
			//13:
			"<h3 class=\"titulo\">Ya has terminado. ¡Muchas gracias por tu colaboración!</h3><p>El experimento que acabas de realizar está directamente relacionado con la materia explicada en el Capítulo 3 del libro “Psicología del Aprendizaje” que utilizas en tu asignatura del mismo nombre, concretamente con el concepto de “Contingencia” explicado en el apartado 2.1 de dicho capítulo. Para más información no dudes en ponerte en contacto con los autores del estudio.<br>"
				+" <br>Autores:<br>Daniel Segura, Carlos Vera, Pedro Montoro y Cristina Orgaz.</p>"
				+ "<br><br> Pulsa F11 para salir del modo pantalla completa."
		];
	}
	else{			

		if (testeo == 1){ 
			console.log("Preparando textos para grupo Híbrido");			//debug HIBRIDO
			grupoHibrido.numTrials = 5;
			grupoPlacebo.numTrials = 2;
			grupoBatatrim.numTrials = 2; 
			console.log("Reduced trials!! This should only be running during tests.");
		}		
		arrayInstruc=[
			//0: (portada) 
			"<h2 class=\"titulo\">ESTUDIO CVTD23XX2</h2><p>¡Muchas gracias por participar en esta investigación, no seria posible sin ti!</p><br><br><img style=\"display"
			+ ": block; margin-left: auto; margin-right: auto;\" src=\"img/uned.png\" width=\"200px\"><p>Sigue las instrucciones que encontrarás a continuación.</p>",
		
			//2: Instrucciones 1 
			"<h3 class=\"titulo\">Instrucciones</h3><p align=\"left\">Imagina que eres un médico que trabaja en el laboratorio de investigación de una universidad. "
			+ "Eres especialista en una enfermedad muy rara y peligrosa llamada "+ training.nombreSindrome+", que hay que tratar muy rápido en urgencias. "
			+ "Las crisis que provoca esta enfermedad podrían curarse inmediatamente con una medicina llamada "+training.nombreClave[0]+ ", pero esta medicina aún está en fase experimental." 
			+ "Además, es posible que las crisis que provoca esta enfermedad podrían verse mitigadas por medio del consumo de una cápsula placebo de sacarosa (azúcar), pero aún no hay datos suficientes de la efectividad de dicha cápsula.<br>"
			+ "La sacarosa es ampliamente usada como placebo debido a que en condiciones generales no produce ningún tipo de efecto terapéutico.<br>"
			+ "Tenga en cuenta que en el campo de la medicina el efecto placebo consiste en  administrar una sustancia inerte (en la presente investigación una cápsula de sacarosa) que"
			+ " por sí mismo no consta de ningún efecto terapéutico y que, sin embargo, la persona que lo recibe afirma encontrarse mejor debido a esta intervención.</p><br>",
			
			//3: Instrucciones 2.a 
			"<h3 class=\"titulo\">Instrucciones</h3><p>Como parte de los ensayos clínicos para evaluar la efectividad del \"Batatrim\" y del placebo, te vamos a presentar una serie "
				+ "de fichas médicas de pacientes que están sufriendo una crisis del "+training.nombreSindrome +". En cada ficha verás un paciente y se te dará la oportunidad "
				+ "de administrarle o no el "+training.nombreClave[0]+ ".</p>",
			
			//4: Instrucciones 2.b 
			"<h3 class=\"titulo\">Instrucciones</h3><p>El procedimiento será el siguiente: para cada nuevo paciente, debes decidir si quieres administrar o no el "
			+ ""+training.nombreClave[0]+ " o el placebo, pulsando la imagen correspondiente de las dos siguientes."
			+ " <br>Nota: En unos ensayos tendrás la opción de dar "+training.nombreClave[0]+ " y en otros de dar el placebo."
			+ "</p><br><br><table style=\"text-align: center; align-content:"
			+ "center; border: 0px; width: 100%;\"><tr><td><img src=\""+training.ImagenClave[0]+"\" width=\"150px\"></td><td><img src=\""+training.ImagenNOClave[0]+"\" width"
			+ "=\"150px\"></td></tr><tr><td>Administrar la medicina</td><td>No administrar la medicina</td></tr></table><br><br>",
			
			//5: Instrucciones 2.c 
			"<p><h3 class=\"titulo\">Instrucciones</h3>A continuación te informaremos de si el paciente superó la crisis."
			+ "</p><table style=\"text-align: center; align-content: center; border: 0px; width: 100%;\">"
			+ "<tr><td><img src=\""+training.ImagenSindrome+"\" width=\"150px\"></td><td><img src=\""+training.ImagenSano+"\" width=\"150px\"></td></tr><tr><td>"
			+ "Paciente enfermo</td><td>Paciente curado</td></tr></table><p>Después de darte esa información, se te presentará la ficha del siguiente paciente. <br>"
			+ "Intenta averiguar hasta qué punto punto son efectivos el "+training.nombreClave[0]+ " y el placebo. "
			+ "Cuando hayas tratado a un buen número de pacientes te haremos algunas preguntas.</p>",

			"<p><h3 class=\"titulo\">Pregunta 1 / "+numberOfQuestions()+" </h3><p> ¿Podrías explicar con tus palabras cuál era el objetivo que tenías que cumplir en la tarea de este estudio? ¿Qué entendiste que debías hacer?",
		    "<p><h3 class=\"titulo\">Pregunta 2 / "+numberOfQuestions()+" </h3><p> ¿Cómo tomaste la decisión de dar o no el medicamento (o el placebo) a cada paciente?",
		    "<p><h3 class=\"titulo\">Pregunta 3 / "+numberOfQuestions()+" </h3><p> En la pregunta final sobre la efectividad de la medicina, en la escala de 0 a 100, indicaste "+training.Juicio+".</p>" 
			+ "¿Cómo llegaste a esta conclusión sobre la efectividad del medicamento al final del experimento? ¿Hubo algún aspecto en particular que influyera en tu decisión?",
 	   		"<p><h3 class=\"titulo\">Pregunta 4 / "+numberOfQuestions()+" </h3><p> En la pregunta final sobre la efectividad del placebo, en la escala de 0 a 100, indicaste "+training.Juicio+".</p>"  
			+ "¿Cómo llegaste a esta conclusión sobre la efectividad del placebo al final del experimento? ¿Hubo algún aspecto en particular que influyera en tu decisión?",
			"<p><h3 class=\"titulo\">Pregunta 5 / "+numberOfQuestions()+" </h3><p> ¿Podrías explicar con tus palabras cuál es la efectividad de la medicina? ¿Y la del placebo? ¿Qué significa ese número para ti?",
							
			// A guardar datos! 
			//13: Save Data... 
			"<h3 class=\"titulo\">Envío de datos</h3><p>A continuación podrás enviar los resultados para que se incluyan en nuestro estudio. Los datos que nos aportes se unirán a los del grupo y serán analizados estadísticamente.</p><p align=\"left\"> Para hacerlo, haz click en el botón \"Enviar\".</p>",
			
			//13:
			"<h3 class=\"titulo\">Ya has terminado. ¡Muchas gracias por tu colaboración!</h3><p>El experimento que acabas de realizar está directamente relacionado con la materia explicada en el Capítulo 3 del libro “Psicología del Aprendizaje” que utilizas en tu asignatura del mismo nombre, concretamente con el concepto de “Contingencia” explicado en el apartado 2.1 de dicho capítulo. Para más información no dudes en ponerte en contacto con los autores del estudio.<br>"
				+" <br>Autores:<br>Daniel Segura, Carlos Vera, Pedro Montoro y Cristina Orgaz.</p>"
				+ "<br><br> Pulsa F11 para salir del modo pantalla completa."
		];
	}
	
	// Aquí tenemos la llamada al cuestionarioEdad. //// ESTO VA A HACER FALTA REVISAR, PORQUE NO ERCUERDO QUÉ DIFERENCIAS HABÍA AQUÍ EN LOS BOTONES... 
	// Básicament esta es la función que va haciendo que avance el experimento. 
	if(grupoAsignado>1){ 			// El grupo HIBRIDO es 2

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
			"<input type='button' class = \"botonFlow\" style=\"font-size:100%\" onclick='siguienteTexto()' value='Continuar'/>",

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
			"<input type='button' class='botonFlow' style='font-size:100%' onclick='siguienteTexto()' value='Siguiente'/>",	// Quinta pregunta para el híbrido



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
			//"<input type='button' class='botonFlow' style='font-size:100%' onclick='siguienteTexto()' value='Siguiente'/>",	// Sin 5ª pregunta para no hibrido. 

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
	//asignagrupo(); 
	//prepararTextos();   	// ???? Por qué lo llamamos aquí si ya lo hemos llamado?? Es para que vuelva? Hummm. 
	generaEnsayos();		// Esta función genera el orden de recuperación o no, y qué medicamento dar a los participantes. 
	// Run test
	if(testeo === 1){
		console.log("Running test")
		testFunctionEnsayosGenerados();
	}
	document.querySelector('input[name="edad"]').value="";
    
	/////// Aquí vamos a aprovechar para enviar a Firebase los datos de nuestro participante
	// Esta línea nos guarda el intento: 
	startData = "A participant has started with ID " + personId +" with IP:"+ participantIP;
	if (testeo == 0){ 
		guardaFirebase(startData, 'mySurvivalLogs');
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
    
	// ESTO NO SE USA: 
    //var Fase1countCells = new Map([...new Set(grupoBatatrim.secuenciaCells)].map(
    //x => [x, grupoBatatrim.secuenciaCells.filter(y => y === x).length]));
    //var Fase2countCells = new Map([...new Set(grupoPlacebo.secuenciaCells)].map(
    //x => [x, grupoPlacebo.secuenciaCells.filter(y => y === x).length]));
    //var BalanceoContingencia = grupoBatatrim.Contingencia+"-"+grupoPlacebo.Contingencia;
  
	data = 
		"ExpCVTD22XX2" + "," + 
		groupNames[grupoAsignado] + "," + 
		personId + "," +                		//ID aleatorio
		participantIP + "," +					// IP del participante //Modified for testing TFK
		Age + "," +         		
		Gender + "," +		
		training.Juicio + "," + 				//Juicio 
		training.Confianza + "," + 				//Confianza
		training.secuenciaResps + "," + 		//Secuencia de respuestas dada
		training.posibleOutcomes + "," + 		//Secuencia de resultados de éxito presentada
		training.secuenciaCells + "," + 		//Secuencia de combinaciones acción-éxito
		training.secuenciaResps + "," + 		//Fase 2 - Secuencia de respuestas dada
		training.posibleOutcomes + "," + 	//Fase 2 - Secuencia de resultados de éxito presentada
		training.secuenciaCells + "," +  	//Fase 2 - Secuencia de combinaciones acción-éxito
		training.TiemposRespuesta + "," + 		//Tiempos de respuesta 
		fecha


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

