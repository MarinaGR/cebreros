var api_url='http://w3.cebreros.es/api/v1/';
var extern_url='http://w3.cebreros.es/';
var local_url='./resources/json/';

var coord_image_ppal=new Array();
var coord_image=new Array();
var array_coord_image_ppal=new Array();
var array_coord_image=new Array();

var first_click=true;
var scale=2;
var frame;
var now=new Date(2014,0,1).getTime(); 

var DATADIR;

function onBodyLoad(type, container)
{	
    document.addEventListener("deviceready", onDeviceReady, false);
	document.getElementById("boton_menu").addEventListener("click", onMenuKeyDown, false);	
	document.getElementById("boton_salir").addEventListener("click", onOutKeyDown, false);	
	document.getElementById("boton_atras").addEventListener("click", onBackKeyDown, false);	
}
function onDeviceReady()
{
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false);

	cordova.plugins.backgroundMode.enable(); 	
	
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
	
	var fecha=getLocalStorage("fecha"); 
	if(typeof fecha == "undefined"  || fecha==null)	
	{	
		var nueva_fecha=now;  
		setLocalStorage("fecha", nueva_fecha);
		//Primera ejecución, descargamos contenidos si está online
		//window.requestFileSystem(PERSISTENT, 0, onFileSystemSuccess, onFileSystemError);    
	}
	
	window.requestFileSystem(PERSISTENT, 0, onFileSystemSuccess, onFileSystemError);    
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
function onBackKeyDown()
{
	window.history.back();
}
function onOutKeyDown()
{
	navigator.app.exitApp();
	return false;
}
function onOnline()
{
	/*setTimeout(function(){
		$("#contenido").attr("src",siteurl);
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
	//$(".contenedor").prepend("Necesita una conexión a internet para poder ver correctamente todos los contenidos de la aplicación");
	/*setTimeout(function(){
		$("#contenido").attr("src","offline.html");
	},250);*/

}

function ajax_recover_data(type, id, container, isLocal, haveCanvas) {

	if(isLocal==true || isLocal=="true")
	{		
		var objajax=$.getJSON(local_url+type+id+".json", f_success)
		.fail(function(jqXHR, textStatus, errorThrown) {
			alert('Error: '+type+id+" - "+textStatus+"  "+errorThrown);	
			$("#"+container).html("No se han cargado los datos del archivo");
		});
	
	}
	else 
	{
		$.ajax({
		  url: api_url+type+id,
		  type: 'GET',
		  dataType: 'json',
		  crossDomain: true, 
		  success: f_success,
		  error: f_error,
		  async:false,
		});
	
	}
	
	function f_success(data) {
	
		//data = $.parseJSON(data);
		
		switch(type)
		{
			case "category": 			
					var cadena="";

					$.each(data.Result.Items, function(index, d){   
						var fecha=new Date(d.DatePublish);
						var imagen=d.Image; 

						if(imagen!=null) 
						{						
							if(imagen.indexOf("http")<0)
							{
								if(imagen.indexOf("public/images")>=0 || imagen.indexOf("public/thumbnails")>=0)
									cadena+="<div style='width:100%;height:75px;background:#FFF url("+extern_url+imagen+") no-repeat center;background-size:cover;'></div>";
								else
									cadena+="<div style='width:100%;height:75px;background:#FFF url("+extern_url+"public/images/"+imagen+") no-repeat center;background-size:cover;'></div>";							
							}
							else
								cadena+="<div style='width:100%;height:75px;background:#FFF url("+imagen+") no-repeat center;background-size:cover;'></div>";
							
						}
							
						if(isLocal!=true && isLocal!="true")
							cadena+="<div class='fecha_01'>"+fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"</div>";
							
						cadena+="<h3>"+d.Title+"</h3>";
						
						if(isLocal)
							cadena+="<a class='vermas' href='noticia.html?id="+d.ID+"&local=true'>VER</a>";
						else
							cadena+="<a class='vermas' href='noticia.html?id="+d.ID+"'>VER</a>";

					});

					$("#"+container).html(cadena);
				
					break;
					
			case "page": 			
					var cadena="";
				
					var d=data.Result.Data;
						
					var fecha=new Date(d.DatePublish);
					var imagen=d.Image; 
					cadena+="<h2>"+d.Title+"</h2>";
					
					if(isLocal!=true && isLocal!="true")
						cadena+="<div class='fecha_02'>"+fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"</div>";

					if(imagen!=null) 
					{						
						if(imagen.indexOf("http")<0)
						{
							if(imagen.indexOf("public/images")>=0 || imagen.indexOf("public/thumbnails")>=0)
								cadena+="<img src='"+extern_url+imagen+"' alt='Imagen principal' />";
							else
								cadena+="<img src='"+extern_url+"public/images/"+imagen+"' alt='Imagen principal' />";
						
						}
						else
							cadena+="<img src='"+imagen+"' alt='Imagen principal' />";
						
					}
					
					cadena+=d.Page;
					
					//if(online)
					{
						var geolocation2=d.Geolocation;
						if(geolocation2!="" || geolocation2!=null)
						{
							geolocation2=geolocation2.split(/[(,)]/);
							var geo_lat=geolocation2[1];
							var geo_lon=geolocation2[2];
							var my_zoom=parseInt(geolocation2[3]);
							
							cadena+="<br><iframe width='100%' style='height:300px;border:none;'  src='http://maps.google.es/maps?q=loc:"+geo_lat+","+geo_lon+"&z="+my_zoom+"&output=embed' ></iframe>";
							
						}
						
						var imagenes=data.Result.Images;
						if(data.Result.TotalImages>0) 
						{
							for(i=0;i<data.Result.TotalImages;i++)
								cadena+="<br><img src='"+(extern_url+"public/images/"+imagenes[i].Image)+"' alt='Imagen' />";
								
							cadena+="<br>";
						}
						var adjuntos=data.Result.Attachments;
						if(data.Result.TotalAttachments>0) 
						{
							for(i=0;i<data.Result.TotalAttachments;i++)
								cadena+="<br><a href='"+(extern_url+"public/files/"+adjuntos[i].File)+"' target='_blank' >"+adjuntos[i].Description+"</a>";
							
							cadena+="<br>";
						}
						var enlaces=data.Result.Links;
						if(data.Result.TotalLinks>0) 
						{
							for(i=0;i<data.Result.TotalLinks;i++)
								cadena+="<br><a class='vermas' href='#' onclick='window.open(\'"+enlaces[i].Link+"\', \'_system\', \'location=yes\');'>"+enlaces[i].Description+"</a>";	
							
							cadena+="<br>";
						}
						var videos=data.Result.Videos;
						if(data.Result.TotalVideos>0) 
						{
							for(i=0;i<data.Result.TotalVideos;i++)
							{
								var src_video=$(videos[i].Embed).attr('src');
								
								if(src_video.substring(0, 2)=="//")
								{
									var new_src_video="http:"+src_video;
									cadena+="<br>"+videos[i].Embed.replace(src_video, new_src_video);
								}
									
								if(src_video.substring(0, 4)=="http")
									cadena+="<br>"+videos[i].Embed;			
							}
							
							cadena+="<br>";
						}
					}
				
					$("#"+container).html(cadena);
				
					break;
					
			case "calendar": break;
			case "calendar_day": break;
			case "event": break;
			
			case "galleries": 
					var cadena="";
					
					$.each(data.Result.Items, function(index, d){   
						var imagen=d.MinImage; 
						
						cadena+="<div class='buttons_galleries'>";
						if(imagen!=null) 
							cadena+="<div style='width:100%;height:75px;background: #FFF url("+imagen+") no-repeat center;background-size:cover;'></div>";
							
						cadena+="<h3>"+d.Title+"</h3>";
						
						if(isLocal)
							cadena+="<a class='vermas' href='fotos.html?id="+d.ID+"&local=true'>VER</a></div>";
						else
							cadena+="<a class='vermas' href='fotos.html?id="+d.ID+"'>VER</a></div>";

					});
					
					cadena+="<div style='clear:both'> </div>";

					$("#"+container).html(cadena);
					break;
					
			case "gallery": 
					var cadena="";
				
					var d=data.Result;
					
					var fecha=new Date(d.DatePublish);
					var imagen=d.Image; 
					cadena+="<h2>"+d.Title+"</h2>";
					
					cadena+=d.Description;
					
					//if(online)
					{
						if(d.Total>0) 
						{
							var imagenes=d.Items;
							for(i=0;i<d.Total;i++)
								cadena+="<br><img src='"+imagenes[i].MinImage+"' alt='Imagen' />";
						}
						
					}
					$("#"+container).html(cadena);
					break;
					
			case "routes": 
					var cadena="";
					
					$.each(data.Result.Items, function(index, d){   
						var fecha=new Date(d.DatePublish);
						
						cadena+="<div class='buttons_routes' onclick='window.location.href=\"mapa.html?id="+d.ID+"\"'>";
						
						var imagen=d.Image; 
						if(imagen!=null) 
						{
							//Sacar ruta local para la imagen	
							var array_ruta_imagen=imagen.split("/public/images/");
							var imagen_local="./resources/images/mapas/"+array_ruta_imagen[1];	
						
							cadena+="<div style='width:100%;height:100px;background:url("+imagen_local+") no-repeat center;background-size:cover;'></div>";
						}
							
						cadena+="<h5>"+d.Title+"</h5>";
						cadena+="</div>";
					});
					
					cadena+="<div style='clear:both'> </div>";

					$("#"+container).html(cadena);
					break;
					
			case "route": 
					var cadena="";
					
					if(haveCanvas==true)
					{
						var src_image="";
				
						switch(id)
						{
							case "/1":src_image='./resources/images/mapas/mapa_01.jpg';  
									  coord_image_ppal=[["top-left", "40.4758", "-4.4805"],["bottom-left", "40.4365", "-4.4805"], ["top-right","40.4758", "-4.3698"]];
									  break;
									  
							case "/2": src_image='./resources/images/mapas/mapa_02.jpg';  
									   coord_image_ppal=[["top-left", "40.6769", "-4.7371"],["bottom-left", "40.6379", "-4.7371"], ["top-right","40.6769", "-4.6257"]];
									   break;
									   
							default: src_image='';  
									 break;
						}
						var d=data.Result;
						draw_canvas(container,src_image,'./resources/rutas/'+data.Result.DownloadGPX,id); 
						
						$("#"+container).css("height",height);
						
						$("#datos_geo").append("<div id='datos_geo_position'></div>");
						
						$("#datos_geo").append("<span class='vermas' onclick='show_geoloc()'>ACTUALIZAR</span>");
						
						break;
					}
					
					var d=data.Result;

					cadena+="<h2>"+d.Title+"</h2>";
					
					var imagen=d.Image; 
					if(imagen!=null) 
					{
						//Sacar ruta local para la imagen	
						var array_ruta_imagen=imagen.split("/public/images/");
						var imagen_local="./resources/images/mapas/"+array_ruta_imagen[1];	
					
						cadena+="<img src='"+imagen_local+"' alt='Imagen de la ruta' />";
					}

					cadena+=d.Page;
					
					cadena+="<div class='data_route'>";
					cadena+="<p class='title_01'>DATOS DE LA RUTA</p>";
					cadena+="<p><b>Altitud m&aacute;xima:</b> "+d.MaxAltitude+"</p>"+
							"<p><b>Altitud m&iacute;nima:</b> "+d.MinAltitude+"</p>"+
							"<p><b>Dificultad:</b>  "+d.Difficulty+"</p>"+
							"<p><b>Distancia:</b>  "+d.Distance+"</p>"+
							"<p><b>Ruta circular monumentos:</b> "+d.Monuments+"</p>"+
							"<p><b>Panor&aacute;micas:</b>  "+d.Panoramics+"</p>";
							"<p><b>Realizable en bici:</b>  "+d.CycleReady+"</p>";
					cadena+="</div>";		

					/*var imagenes=d.Items;
					if(d.Total>0) 
					{
						for(i=0;i<d.Total;i++)
							cadena+="<br><img src='"+imagenes[i].MinImage+"' alt='Imagen ruta' />";
					}*/
					
					cadena+="<p><br><br><a class='vermas' href='#' onclick='window.open(\'"+d.WikilocLink+"\', \'_system\', \'location=yes\');'>Ver ruta en Wikiloc</a></p>";	
										
					cadena+="<p><a class='vermas' href='canvas.html?id="+id+"'>Ver ruta con geolocalizaci&oacute;n</a></p>";				
					
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
			alert('Error de conexi&oacute;n. No se han podido recuperar los datos. Por favor int&eacute;ntalo de nuevo.');	
			console.log(jqXHR);
			console.log(textStatus+" "+errorThrown);
	  },
      jsonp: 'callback',
      jsonpCallback: 'jsonpCallback',
	  async:false,
	});
	
}

function draw_route(container,src_image, src_gpx) 
{	
	$("#"+container).append('<img src="'+src_image+'" width="768" id="imagen_mapa" style="opacity:0" />');
			
	 $("#imagen_mapa").load(function() {
		
		width=$(this).width();
		height=$(this).height();
		
		var cuadrantes=[[width/3],[height/2]];
		
		$("#"+container).append('<canvas id="canvas" width="'+width+'" height="'+height+'" style="position:absolute;top:0;left:0" ></canvas>');
		
		var canvas = document.getElementById("canvas");						
		canvas.style.border="1px solid #AAA";
		
		/*canvas.addEventListener('click', function zoom(event)
		{
		
			var mousex = event.offsetX;
			var mousey = event.offsetY;

			var contexto = canvas.getContext("2d");

				
			if(first_click)
			{			
				src_image_new='';			
			
				if(mousey<height/2) 
				{
					if(mousex<=width/2) {
						console.log("cuadrante 1");
						//Para cada ruta una configuracion de coordenadas (una por imagen ampliada)
						src_image_new='./resources/images/mapas/mapa_01_1.jpg'; 					
						coord_image=[["top-left", "40.4753", "-4.4815"],["bottom-left", "40.4564", "-4.4815"], ["top-right","40.4753", "-4.4275"]];
					}
					else if(mousex<=width) {
						console.log("cuadrante 2");
						src_image_new='./resources/images/mapas/mapa_01_2.jpg'; 
						coord_image=[["top-left", "40.4754", "-4.4237"],["bottom-left", "40.4565", "-4.4237"], ["top-right","40.4754", "-4.3697"]];
						
					} 
				}
				else if(mousey<height) 
				{
					if(mousex<=width/2) {
						console.log("cuadrante 3");
						src_image_new='./resources/images/mapas/mapa_01_3.jpg'; 
						coord_image=[["top-left", "40.4565", "-4.4811"],["bottom-left", "40.4377", "-4.4811"], ["top-right","40.4565", "-4.4272"]];
					}
					else if(mousex<=width) {
						console.log("cuadrante 4");
						src_image_new='./resources/images/mapas/mapa_01_4.jpg'; 
						coord_image=[["top-left", "40.4565", "-4.4237"],["bottom-left", "40.4376", "-4.4237"], ["top-right","40.4565", "-4.3698"]];;
					} 
				}
				
				var altura=(coord_image[0][1]-coord_image[1][1]);
				var anchura=(coord_image[0][2]-coord_image[2][2]);
				
				k=0;
				array_coord_image_ppal.forEach(function(latlon) {
				
					var latlon_split=latlon.split(",");
					lat=latlon_split[0];
					lon=latlon_split[1];
				
					var lat_canvas=parseFloat(((coord_image[0][1]-lat)*height)/altura);
					var lon_canvas=parseFloat(((coord_image[0][2]-lon)*width)/anchura);

					lat_canvas=lat_canvas.toFixed(3);
					lon_canvas=lon_canvas.toFixed(3);
					
					array_coord_image[k]=lat_canvas+","+lon_canvas;
					k++;
				});

				contexto.clearRect(0,0,width, height);

				var img = new Image();
				img.src = src_image_new;
				img.onload = function(){
					contexto.drawImage(img, 0, 0, width, height);
				   
					contexto.lineWidth = 4;
					contexto.fillStyle = "orange";		
					contexto.strokeStyle = "orange";		
					contexto.font = '12px "Tahoma"';		
				
					draw_points(contexto);
				}
				
				first_click=false;
			}
			else
			{
				coord_image=coord_image_ppal;
				
				var altura=(coord_image[0][1]-coord_image[1][1]);
				var anchura=(coord_image[0][2]-coord_image[2][2]);
				
				k=0;
				array_coord_image_ppal.forEach(function(latlon) {
			
					var latlon_split=latlon.split(",");
					lat=latlon_split[0];
					lon=latlon_split[1];
				
					var lat_canvas=parseFloat(((coord_image[0][1]-lat)*height)/altura);
					var lon_canvas=parseFloat(((coord_image[0][2]-lon)*width)/anchura);

					lat_canvas=lat_canvas.toFixed(3);
					lon_canvas=lon_canvas.toFixed(3);
					
					array_coord_image[k]=lat_canvas+","+lon_canvas;
					k++;
				});
				
				contexto.clearRect(0,0,width, height);
				
				var img = new Image();
				img.src = src_image;
				img.onload = function(){
					contexto.drawImage(img, 0, 0, width, height);
				   
					contexto.lineWidth = 4;
					contexto.fillStyle = "orange";		
					contexto.strokeStyle = "orange";		
					contexto.font = '12px "Tahoma"';		
				
					draw_points(contexto);
				}
				
				first_click=true;
			}
		}
		, false);*/

		
		$.get(src_gpx, function(xml) { 
		}).done(function(xml_Doc) {
		
			coord_image=coord_image_ppal;
		
			var altura=(coord_image[0][1]-coord_image[1][1]);
			var anchura=(coord_image[0][2]-coord_image[2][2]);
			
			var k=0;
			$(xml_Doc).find("rtept").each(function() {
				var lat=$(this).attr("lat");
				var lon=$(this).attr("lon");
				
				array_coord_image_ppal[k]=lat+","+lon;
				k++;
				
			});
			
			k=0;
			array_coord_image_ppal.forEach(function(latlon) {
			
				var latlon_split=latlon.split(",");
				lat=latlon_split[0];
				lon=latlon_split[1];
			
				var lat_canvas=parseFloat(((coord_image[0][1]-lat)*height)/altura);
				var lon_canvas=parseFloat(((coord_image[0][2]-lon)*width)/anchura);

				lat_canvas=lat_canvas.toFixed(3);
				lon_canvas=lon_canvas.toFixed(3);
				
				array_coord_image[k]=lat_canvas+","+lon_canvas;
				k++;
			});

			
			var img = new Image();
			img.src = src_image;
			img.onload = function(){
			
				var contexto = canvas.getContext("2d");
				contexto.drawImage(img, 0, 0, width, height);
				
				contexto.lineWidth = 3;
				contexto.fillStyle = "orange";		
				contexto.strokeStyle = "orange";		
				contexto.font = '12px "Tahoma"';		

				draw_points(contexto);
			
			}
			
		}).fail(function(){
			$("#"+container).append("<p>No se pudo cargar la ruta.</p>");
		});
			
	});

}

function draw_canvas(container,src_image, src_gpx, id) 
{	
	//$("#"+container).append('<img src="'+src_image+'" width="100%" id="imagen_mapa" style="opacity:0" />');
	
	//Tendría que ser proporcional al tamaño de la imagen que vamos a cargar
			
	// $("#imagen_mapa").load(function() {
		
		width=$(window).width(); 
		height=$(window).height();
		
		var cuadrantes=[[width/3],[height/2]];
		
		$("#"+container).append('<canvas id="canvas" width="'+width+'" height="'+height+'" style="position:absolute;top:0;left:0;" ></canvas>');
				
		var canvas = document.getElementById("canvas");						
		
		canvas.addEventListener('click', function zoom(event)
		{
		
			var mousex = event.offsetX;
			var mousey = event.offsetY;

			var contexto = canvas.getContext("2d");

				
			if(first_click)
			{			
				src_image_new='';			
			
				//Para cada ruta una configuracion de coordenadas (una por imagen ampliada)
				//Guardar en ficheros y recuperar de ahí las coordenadas!
				
				switch(id)
				{
					case "/1": 
								if(mousey<height/2) 
								{
									if(mousex<=width/2) {
										console.log("cuadrante 3");
										src_image_new='./resources/images/mapas/mapa_01_3.jpg'; 
										coord_image=[["top-left", "40.4565", "-4.4811"],["bottom-left", "40.4377", "-4.4811"], ["top-right","40.4565", "-4.4272"]];
									}
									else if(mousex<=width) {
										console.log("cuadrante 1");
										src_image_new='./resources/images/mapas/mapa_01_1.jpg'; 					
										coord_image=[["top-left", "40.4753", "-4.4815"],["bottom-left", "40.4564", "-4.4815"], ["top-right","40.4753", "-4.4275"]];						
									} 
								}
								else if(mousey<height) 
								{
									if(mousex<=width/2) {
										console.log("cuadrante 4");
										src_image_new='./resources/images/mapas/mapa_01_4.jpg'; 
										coord_image=[["top-left", "40.4565", "-4.4237"],["bottom-left", "40.4376", "-4.4237"], ["top-right","40.4565", "-4.3698"]];
									}
									else if(mousex<=width) {
										console.log("cuadrante 2");
										src_image_new='./resources/images/mapas/mapa_01_2.jpg'; 
										coord_image=[["top-left", "40.4754", "-4.4237"],["bottom-left", "40.4565", "-4.4237"], ["top-right","40.4754", "-4.3697"]];
									} 
								}
								break;	
					case "/2": 								
					default:
								if(mousey<height/2) 
								{
									if(mousex<=width/2) {
										console.log("cuadrante 3");
										src_image_new='./resources/images/mapas/mapa_02_3.jpg'; 
										coord_image=[["top-left", "40.6573", "-4.7372"],["bottom-left", "40.6379", "-4.7372"], ["top-right","40.6573", "-4.6815"]];
									}
									else if(mousex<=width) {
										console.log("cuadrante 1");
										src_image_new='./resources/images/mapas/mapa_02_1.jpg'; 					
										coord_image=[["top-left", "40.6769", "-4.7370"],["bottom-left", "40.6574", "-4.7370"], ["top-right","40.6769", "-4.6813"]];								
									} 
								}
								else if(mousey<height) 
								{
									if(mousex<=width/2) {
										console.log("cuadrante 4");
										src_image_new='./resources/images/mapas/mapa_02_4.jpg'; 
										coord_image=[["top-left", "40.6570", "-4.6813"],["bottom-left", "40.63756", "-4.6813"], ["top-right","40.6570", "-4.6256"]];
									}
									else if(mousex<=width) {
										console.log("cuadrante 2");
										src_image_new='./resources/images/mapas/mapa_02_2.jpg'; 
										coord_image=[["top-left", "40.6769", "-4.6813"],["bottom-left", "40.6575", "-4.6813"], ["top-right","40.6769", "-4.6256"]];
									} 
								}
								break;
				}
				
				
				var altura=(coord_image[0][1]-coord_image[1][1]);
				var anchura=(coord_image[0][2]-coord_image[2][2]);
				
				k=0;
				array_coord_image_ppal.forEach(function(latlon) {
				
					var latlon_split=latlon.split(",");
					lat=latlon_split[0];
					lon=latlon_split[1];
				
					var lat_canvas=parseFloat(((coord_image[0][1]-lat)*width)/altura);
					var lon_canvas=parseFloat(((coord_image[0][2]-lon)*height)/anchura);

					lat_canvas=lat_canvas.toFixed(3);
					lon_canvas=lon_canvas.toFixed(3);
					
					array_coord_image[k]=lat_canvas+","+lon_canvas;
					k++;
				});

				contexto.clearRect(0, 0, height, width);	

				var img = new Image();
				img.src = src_image_new;
				img.onload = function(){
					contexto.drawImage(img, 0, 0, height, width);
				   
					contexto.lineWidth = 4;
					contexto.fillStyle = "orange";		
					contexto.strokeStyle = "orange";		
					contexto.font = '12px "Tahoma"';		
				
					draw_points(contexto);
				}
				
				first_click=false;
			}
			else
			{
				coord_image=coord_image_ppal;
				
				var altura=(coord_image[0][1]-coord_image[1][1]);
				var anchura=(coord_image[0][2]-coord_image[2][2]);
				
				k=0;
				array_coord_image_ppal.forEach(function(latlon) {
			
					var latlon_split=latlon.split(",");
					lat=latlon_split[0];
					lon=latlon_split[1];
				
					var lat_canvas=parseFloat(((coord_image[0][1]-lat)*width)/altura);
					var lon_canvas=parseFloat(((coord_image[0][2]-lon)*height)/anchura);

					lat_canvas=lat_canvas.toFixed(3);
					lon_canvas=lon_canvas.toFixed(3);
					
					array_coord_image[k]=lat_canvas+","+lon_canvas;
					k++;
				});
				
				contexto.clearRect(0, 0, height, width);	
				
				var img = new Image();
				img.src = src_image;
				img.onload = function(){
				
					contexto.drawImage(img, 0, 0, height, width);
				   
					contexto.lineWidth = 4;
					contexto.fillStyle = "orange";		
					contexto.strokeStyle = "orange";		
					contexto.font = '12px "Tahoma"';		
				
					draw_points(contexto);
				}
				
				first_click=true;
			}
		}
		, false);

		
		$.get(src_gpx, function(xml) { 
		}).done(function(xml_Doc) {
		
			coord_image=coord_image_ppal;
		
			var altura=(coord_image[0][1]-coord_image[1][1]);
			var anchura=(coord_image[0][2]-coord_image[2][2]);
			
			var k=0;
			$(xml_Doc).find("rtept").each(function() {
				var lat=$(this).attr("lat");
				var lon=$(this).attr("lon");
				
				array_coord_image_ppal[k]=lat+","+lon;
				k++;
				
			});
			
			k=0;
			array_coord_image_ppal.forEach(function(latlon) {
			
				var latlon_split=latlon.split(",");
				lat=latlon_split[0];
				lon=latlon_split[1];
			
				var lat_canvas=parseFloat(((coord_image[0][1]-lat)*width)/altura);
				var lon_canvas=parseFloat(((coord_image[0][2]-lon)*height)/anchura);

				lat_canvas=lat_canvas.toFixed(3);
				lon_canvas=lon_canvas.toFixed(3);
				
				array_coord_image[k]=lat_canvas+","+lon_canvas;
				k++;
			});

			
			var img = new Image();
			img.src = src_image;
			img.onload = function(){
			
				var contexto = canvas.getContext("2d");
				
				contexto.lineWidth = 3;
				contexto.fillStyle = "orange";		
				contexto.strokeStyle = "orange";		
				contexto.font = '12px "Tahoma"';	
				
				contexto.save();
				// Translate 
				contexto.translate(width, 0);
				// Rotate it
				contexto.rotate(90*Math.PI/180);
				//contexto.restore();		
				
				contexto.drawImage(img, 0, 0, height, width);

				draw_points(contexto);
			
			}
			
		}).fail(function(){
			$("#"+container).append("<p>No se pudo cargar la ruta.</p>");
		});
			
	//});

}

function draw_points(contexto)
{
				
	for(i=0;i<array_coord_image.length;i++)
	{
		var array_points=array_coord_image[i].split(",");
		var lat_canvas=array_points[0];
		var lon_canvas=array_points[1];

		//contexto.lineTo(lon_canvas,lat_canvas);								
		//contexto.stroke();
		
		contexto.beginPath();
		contexto.arc(lon_canvas,lat_canvas, 3, 0, 2 * Math.PI, true);
		contexto.fill();
		contexto.closePath();
			
		//contexto.fillText(i,lon_canvas,lat_canvas);
	}
	
	show_geoloc();
}

function show_geoloc()
{
	if (navigator.geolocation)
	{
		//navigator.geolocation.getCurrentPosition(draw_geoloc,error_geoloc,{enableHighAccuracy:true, maximumAge:30000, timeout:30000});
		
		options = {
		  enableHighAccuracy: false,
		  timeout: 15000,
		  maximumAge: 30000
		};

		id = navigator.geolocation.watchPosition(draw_geoloc, error_geoloc, options);
	}
	else
	{	
		$("#datos_geo_position").html("<p>Tu dispositivo no permite la geolocalizaci&oacute;n din&aacute;mica.</p>");	
	}
}

function draw_geoloc(position)
{
	var lat = position.coords.latitude;
  	var lon = position.coords.longitude;
	
	//var lat=40.455;
	//var lon=-4.465;

	var canvas = document.getElementById("canvas");						
	var contexto = canvas.getContext("2d");
	contexto.fillStyle = "#00405D";		
	contexto.strokeStyle = "#00405D";		
	contexto.font = '12px "Tahoma"';		

	var width=canvas.width;
	var height=canvas.height;
							
	var altura=(coord_image[0][1]-coord_image[1][1]);
	var anchura=(coord_image[0][2]-coord_image[2][2]);
							
	var lat_canvas=parseFloat(((coord_image[0][1]-lat)*width)/altura);
	var lon_canvas=parseFloat(((coord_image[0][2]-lon)*height)/anchura);
								
	lat_canvas=Math.round(lat_canvas * 100)/100;
	lon_canvas=Math.round(lon_canvas * 100)/100;
	
	contexto.beginPath();
	contexto.arc(lon_canvas,lat_canvas, 7, 0, 2 * Math.PI, true);
	contexto.fill();
	contexto.closePath();
	
	//$("#datos_geo_position").html("<p>Est&aacute;s en la posici&oacute;n: "+lat+", "+lon+"</p><p>Precisi&oacute;n: "+position.coords.accuracy+"<br>Velocidad: "+position.coords.speed+"<br>Altitud: "+position.coords.altitude+"<br></p>");
	
	$("#datos_geo_position").html("<div class='data_route'>"+
									  "<p class='title_01'>GEOLOCALIZACI&Oacute;N</p>"+
									  "<b>Tu posici&oacute;n:</b> "+lat+", "+lon+"<br>"+
									  "<b>Precisi&oacute;n:</b> "+position.coords.accuracy+"<br>"+
									  "<b>Velocidad:</b> "+position.coords.speed+"<br>"+
									  "<b>Altitud:</b>  "+position.coords.altitude+"<br><br>"+
								  "</div><br>");
								  
	if(lat>=coord_image[0][1] || lat<=coord_image[1][1] || lon<=coord_image[0][2] || lon>=coord_image[2][2])
		$("#datos_geo_position").html("<p>Tu posici&oacute;n ("+lat+", "+lon+") est&aacute; fuera de este mapa</p>");	
		
}
function error_geoloc(error)
{
	if(error.code == 1) {
		$("#datos_geo_position").html("<p>La geolocalizaci&oacute;n ha fallado. Acceso denegado.</p>");	
	} 
	else if( error.code == 2) {
		$("#datos_geo_position").html("<p>La geolocalizaci&oacute;n ha fallado. Posición no disponible.</p>");	
	}
	else {
		$("#datos_geo_position").html("<p>La geolocalizaci&oacute;n ha fallado.</p>");	
	}
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



function onFileSystemError() 
{
	alert("Error File System");
}
function onFileSystemSuccess(fileSystem) 
{

	alert("File System Sucess");
	//Cargado el sistema de archivos, crear los directorios pertinentes para la descarga de los ficheros.
	
	//window.webkitStorageInfo.queryUsageAndQuota(webkitStorageInfo.unlimitedStorage, console.log.bind(console));

	navigator.webkitPersistentStorage.requestQuota (1024*1024*1024, function() {
		  console.log ('requestQuota: ', arguments);
		}, onError);

		
	fs=fileSystem;
	
    fileSystem.root.getDirectory("com.ovnyline.cebreros",{create:true},gotDir,onError);
    
  //  fs.root.getDirectory("com.ovnyline.cebreros/",{create:true},null,onError);
}
function gotDir(d) {

	console.log(d);
	DATADIR = d;
	var reader = DATADIR.createReader();
	$("body").prepend("<div id='descarga'></div>");
	reader.readEntries(function(d){
		
		$("#descarga").append("Descargando archivos... ");
		$.get(local_url+"routes.json", {}, function(res) {
		
			if (res.Sucess==1) {
				$("#descarga").append("RUTA: "+api_url+"routes</br>");

				var ft = new FileTransfer();
				var dlPath = DATADIR.fullPath + "/routes.json";
				console.log("Descargando a " + dlPath);
				ft.download(api_url+"routes" , dlPath, function() {
					alert("Exito");
				}, onError);
			}

		}, "json");
		
	},onError);
	
	$("#descarga").html("");
}
function gotFS(fileSystem) 
{
	//var fichero="./resources/json/routes.json";
    //fileSystem.root.getFile(fichero, {create: false}, success_getFile, fail_getFile);
   
    var reader = fileSystem.root.createReader();
    reader.readEntries(gotList, fail_getFile);   
}
function gotList(entries) {
    var i;
    for (i=0; i<entries.length; i++) {
        if (entries[i].name.indexOf(".json") != -1) {
            console.log(entries[i].name);
        }
    }
}
function success_getFile(parent) {
    console.log("Nombre del padre: " + parent.name);
}
function fail_getFile(error) {
    alert("Ocurrió un error recuperando el fichero: " + error.message);
}
function onError(e){
	alert("ERROR");
	alert(JSON.stringify(e));
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