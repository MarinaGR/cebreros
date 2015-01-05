var api_url='http://w3.cebreros.es/api/v1/';
var extern_url='http://w3.cebreros.es/';

function onBodyLoad(type, container)
{	
    document.addEventListener("deviceready", onDeviceReady, false);
	document.getElementById("boton_menu").addEventListener("click", onMenuKeyDown, false);	
	
	/*var fecha=getLocalStorage("fecha"); 
	if(typeof fecha == "undefined"  || fecha==null)	
	{	
		var nueva_fecha=now; //new Date(2014,0,1).getTime(); 
		setLocalStorage("fecha", nueva_fecha);
	}	*/	
		
}
function onDeviceReady()
{
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false);

	cordova.plugins.backgroundMode.enable(); 	
	
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
}    
function onBackKeyDown()
{
	if(window.location.href=="index.html") 
	{		
		navigator.app.exitApp();
		return false;
	}
	window.history.back();
}
function onMenuKeyDown()
{
	window.location.href='index.html';
}
function onOnline()
{
	/*setTimeout(function(){
		$("#contenido").attr("src",º_siteurl);
	},250);
	
	/*var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Conexión: ' + states[networkState]);*/

}
function onOffline()
{
	alert("Necesita una conexión a internet para poder ver correctamente todos los contenidos de la aplicación");
	/*setTimeout(function(){
		$("#contenido").attr("src","offline.html");
	},250);*/

}

function ajax_recover_data(type, id, container) {

	$.ajax({
	  url: api_url+type+id,
	  type: 'GET',
	  dataType: 'json',
	  crossDomain: true, 
	  success: f_success,
	  error: f_error,
	  async:false,
	});
	function f_success(data) {
	
		//data = $.parseJSON(data);
		
		switch(type)
		{
			case "category": 			
					var cadena="";
					
					cadena+="<p>"+data.Result.ItemCount+" noticia/s</p>";
					
					$.each(data.Result.Items, function(index, d){   
						var fecha=new Date(d.DatePublish);
						var imagen=d.Image; 
						cadena+="<div style='border-bottom: 1px dashed #EEE'>";
						
						cadena+=extern_url+"public/images/"+imagen;
						
						if(imagen!=null) 
							cadena+="<div style='width:100%;height:50px;background:url("+(extern_url+imagen)+") no-repeat center;background-size:cover;'></div>";
						cadena+=fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"<br>";
						cadena+=d.Title+" ::: <a href='"+(extern_url+d.Permalink)+"'>Ver en web &gt;</a>";
						cadena+="<br><a href='noticia.html?"+data
						
						/**/**
						
						+"'>Ver en app &gt;</a>"
						cadena+="</div>";
					});

					$("#"+container).html(cadena);
				
					break;
					
			case "page": 			
					var cadena="";
				
					var d=data.Result.Data;
					
					var fecha=new Date(d.DatePublish);
					var imagen=d.Image; 
					cadena+="<h2>"+d.Title+"</h2>";
					cadena+=fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"<br>";
					
					cadena+=extern_url+"public/images/"+imagen;
					
					if(imagen!=null) 
						cadena+="<img src='"+(extern_url+imagen)+"' alt='Imagen de la noticia' />";
					
					cadena+=d.Page;
					
					var imagenes=data.Result.Images;
					if(imagenes.TotalImages>0) 
					{
						for(i=0;i<imagenes.TotalImages;i++)
							cadena+="<br><img src='"+(extern_url+"public/images/"+imagenes.Images[i].Image)+"' alt='Imagen noticia' />";
					}
					var adjuntos=data.Result.Attachments;
					if(adjuntos.TotalAttachments>0) 
					{
						for(i=0;i<adjuntos.TotalAttachments;i++)
							cadena+="<br><a href='"+(extern_url+"public/files/"+adjuntos.Attachments[i].File)+"' target='_blank' />"+enlaces.Attachments[i].Description+"</a>";
					}
					var enlaces=data.Result.Links;
					if(enlaces.TotalLinks>0) 
					{
						for(i=0;i<enlaces.TotalLinks;i++)
							cadena+="<br><a href='"+enlaces.Links[i].Link+"' target='_blank' />"+enlaces.Links[i].Description+"</a>";
					}
					var videos=data.Result.Videos;
					if(videos.TotalVideos>0) 
					{
						for(i=0;i<videos.TotalVideos;i++)
							cadena+="<br>"+videos.Videos[i].Embed;
					}
				
					$("#"+container).html(cadena);
				
					break;
					
			case "calendar": break;
			case "calendar_day": break;
			case "event": break;
			case "galleries": break;
			case "gallery": break;
			case "routes": break;
			case "route": break;

		}

		
				
	}
	function f_error(jqXHR, textStatus, errorThrown){
		alert('Error: '+textStatus+" - "+errorThrown);	
		$("#"+container).html("No se han cargado los datos");
	}	
}

function ajax_recover_data_jsonp(type, container) {
	
	function successCallback(data) {
		console.log(data);
		//data = $.parseJSON(data);
		var cadena="";
		
		$.each(data.Result.Items, function(index, d){            
			cadena+="ID : "+d.ID+", "+
					"Title : "+d.Title+", "+
					"DatePublish : "+d.DatePublish+"<br>";
		});
		
		$("#"+container).html(cadena);
				
	}
	function jsonpCallback(data){
		successCallback(data);
	}
	
	$.ajax({
	  url: api_url+type,
	  type: 'GET',
	  dataType: 'jsonp',
	  crossDomain: true, 
	  success: 'successCallback',
	  error:function(jqXHR, textStatus, errorThrown){
			alert('Error de conexión. No se han podido recuperar los datos. Por favor inténtalo de nuevo.');	
			console.log(jqXHR);
			console.log(textStatus+" "+errorThrown);
	  },
      jsonp: 'callback',
      jsonpCallback: 'jsonpCallback',
	  async:false,
	});
	
}

function get_var_url(variable){

	var tipo=typeof variable;
	var direccion=location.href;
	var posicion=direccion.indexOf("?");
	
	posicion=direccion.indexOf(variable,posicion) + variable.length; 
	
	if (direccion.charAt(posicion)== "=")
	{ 
        var fin=direccion.indexOf("&",posicion); 
        if(fin==-1)
        	fin=direccion.length;
        	
        return direccion.substring(posicion+1, fin); 
    } 
	else
		return false;
	
}

function setLocalStorage(keyinput,valinput) 
{
	if(typeof(window.localStorage) != 'undefined') { 
		window.localStorage.setItem(keyinput,valinput); 
	} 
	else { 
		alert("localStorage no definido"); 
	}
}
function getLocalStorage(keyoutput)
{
	if(typeof(window.localStorage) != 'undefined') { 
		return window.localStorage.getItem(keyoutput); 
	} 
	else { 
		alert("localStorage no definido"); 
	}
}