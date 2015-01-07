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
						cadena+="<div style='border-bottom: 1px dashed #CCC'>";
						
						if(imagen!=null) 
							cadena+="<div style='width:100%;height:50px;background:url("+(extern_url+imagen)+") no-repeat center;background-size:cover;'></div>";
							
						cadena+=fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"<br>";
						cadena+=d.Title+" ::: <a href='noticia.html?id="+d.ID+"'>Ver &gt;</a>"
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
						cadena+="<img src='"+(extern_url+imagen)+"' alt='Imagen principal' />";
					
					cadena+=d.Page;
					
					//if(online)
					{
						var geolocation=data.Result.Geolocation;
						geolocation=geolocation(/[(,)]/);
						var geo_lat=geolocation[1];
						var geo_lon=geolocation[2];
						if(geolocation!="")
						{
							cadena+="<br><iframe src='https://www.google.com/maps/embed/v1/directions?key=AIzaSyAD0H1_lbHwk3jMUzjVeORmISbIP34XtzU&origin="+geo_lat+","+geo_lon+"' ></iframe>";
						}
						
						var imagenes=data.Result.Images;
						if(imagenes.TotalImages>0) 
						{
							for(i=0;i<imagenes.TotalImages;i++)
								cadena+="<br><img src='"+(extern_url+"public/images/"+imagenes.Images[i].Image)+"' alt='Imagen' />";
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
					}
				
					$("#"+container).html(cadena);
				
					break;
					
			case "calendar": break;
			case "calendar_day": break;
			case "event": break;
			case "galleries": break;
			case "gallery": break;
			case "routes": 
					var cadena="";
					
					$.each(data.Result.Items, function(index, d){   
						var fecha=new Date(d.DatePublish);
						var imagen=d.Image; 
						cadena+="<div style='border-top: 1px dashed #CCC'>";
						
						if(imagen!=null) 
							cadena+="<div style='width:100%;height:50px;background:url("+imagen+") no-repeat center;background-size:cover;'></div>";
							
						cadena+=d.Title+" ::: <a href='mapa.html?id="+d.ID+"'>Ver &gt;</a>"
						cadena+="</div>";
					});

					$("#"+container).html(cadena);
					break;
					
			case "route": 
					var cadena="";
					
					draw_route(container); 
				
					var d=data.Result.Data;

					var imagen=d.Image; 
					cadena+="<h2>"+d.Title+"</h2>";
					cadena+=extern_url+"public/images/"+imagen;
					
					if(imagen!=null) 
						cadena+="<img src='"+imagen+"' alt='Imagen de la ruta' />";
					
					cadena+=d.Page;
					
					var imagenes=data.Result.Items;
					if(imagenes.TotalImages>0) 
					{
						for(i=0;i<imagenes.TotalImages;i++)
							cadena+="<br><img src='"+(extern_url+"public/images/"+imagenes.Images[i].Image)+"' alt='Imagen noticia' />";
					}
				
					$("#"+container).append(cadena);
					
					break;

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

function draw_route(container) 
{
	var coord_image=[["top-left", "40.472435", "-4.478185"],["bottom-left", "40.433340", "-4.478185"], ["top-right","40.472435", "-4.370632"], ["bottom-right","40.433340","-4.370632"]];

	$("#"+container).html('<img src="./resources/images/mapas/mapa_prueba.jpg" width="768" id="imagen_mapa" />');
			
	 $("#imagen_mapa").load(function() {
		
		var width=$(this).width();
		var height=$(this).height();
		
		$("#"+container).append('<canvas id="canvas" width="'+width+'" height="'+height+'" style="position:absolute;top:0;left:0" ></canvas>');
		
		var canvas = document.getElementById("canvas");						
		canvas.style.border="1px solid red";
		
		$.get("./resources/rutas/ruta-pcr-1-camino-de-rasueros.gpx", function(xml) { 
		}).done(function(xml_Doc) {
		
			var trabajo = canvas.getContext("2d");
			trabajo.lineWidth = 4;
			trabajo.fillStyle = "blue";		
			trabajo.strokeStyle = "orange";		
			trabajo.font = '12px "Tahoma"';							
			
			var altura=(coord_image[0][1]-coord_image[1][1]);
			var anchura=(coord_image[0][2]-coord_image[2][2]);
			
			var k=0;
			$(xml_Doc).find("wpt").each(function() {
				var lat=$(this).attr("lat");
				var lon=$(this).attr("lon");
				
				var lat_canvas=parseFloat(((coord_image[0][1]-lat)*height)/altura);
				var lon_canvas=parseFloat(((coord_image[0][2]-lon)*width)/anchura);
				
				lat_canvas=Math.round(lat_canvas * 100)/100;
				lon_canvas=Math.round(lon_canvas * 100)/100;
				
				//$("#"+container).append(lat+", "+lon+"<br>");
				//$("#"+container).append(lat_canvas+", "+lon_canvas+"<br><br>");
			
				trabajo.lineTo(lon_canvas,lat_canvas);								
				trabajo.stroke();
				
				trabajo.beginPath();
				trabajo.arc(lon_canvas,lat_canvas, 1, 0, 2 * Math.PI, true);
				trabajo.fill();
				
				//trabajo.fillText(k,lon_canvas,lat_canvas);
				k++;
				
				
				
			});	
			
		}).fail(function(){
			$("#"+container).append("<p>No se pudo cargar la ruta.</p>");
		});
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