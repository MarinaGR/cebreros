var api_url='http://w3.cebreros.es/api/v1/';
var extern_url='http://w3.cebreros.es/';
var local_url='./resources/json/';
var file_path;

var coord_image_ppal=new Array();
var coord_image=new Array();
var array_coord_image_ppal=new Array();
var array_coord_image=new Array();

var first_click=true;
var scale=2;
var frame;
var now=new Date(2014,0,1).getTime(); 
var first_time=false;

var destination;
var fs;
var DATADIR;

var archivos={category:'/1',page:'/1',page:'/2','':'routes',route:'/1'};


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

	//cordova.plugins.backgroundMode.enable(); 	
	
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
	
	if(!first_time) 
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemError);   
	 
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

function ajax_recover_data(type, id, container, isLocal, haveCanvas, canvas_number) {

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
									cadena+="<div style='width:100%;height:75px;background:#FFF url("+extern_url+"public/thumbnails/"+imagen+") no-repeat center;background-size:cover;'></div>";							
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
								cadena+="<img src='"+extern_url+imagen+"' style='display:block;margin:auto;' alt='Imagen principal' />";
							else
								cadena+="<img src='"+extern_url+"public/thumbnails/"+imagen+"' style='display:block;margin:auto;' alt='Imagen principal' />";
						
						}
						else
							cadena+="<img src='"+imagen+"' style='display:block;margin:auto;' alt='Imagen principal' />";
						
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
							
							//cadena+="<br><iframe width='100%' style='height:300px;border:none;'  src='http://maps.google.es/maps?q=loc:"+geo_lat+","+geo_lon+"&z="+my_zoom+"&output=embed' ></iframe>";
							
							destination=geo_lat+","+geo_lon;
							get_geo_route_map();
							
							cadena+="<br><iframe width='100%' style='height:400px;border:none;' id='geo_route_map'  src='https://www.google.com/maps/embed/v1/directions?key=AIzaSyAD0H1_lbHwk3jMUzjVeORmISbIP34XtzU&origin="+destination+"&destination="+destination+"&avoid=tolls|highways&language=es' ></iframe><div id='datos_geo_position'></div>";			
							
						}
						
						var imagenes=data.Result.Images;
						if(data.Result.TotalImages>0) 
						{
							for(i=0;i<data.Result.TotalImages;i++)
								cadena+="<br><img src='"+(extern_url+"public/thumbnails/"+imagenes[i].Image)+"' style='display:block;margin:auto;' alt='Imagen' />";
								
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
									   
							case "/3": src_image='./resources/images/mapas/mapa_03.jpg';
									   coord_image_ppal=[["top-left", "40.5029", "-4.5515"],["bottom-left", "40.4443", "-4.5515"], ["top-right","40.5029", "-4.4357"]];
									   break;
									   
							case "/4": src_image='./resources/images/mapas/mapa_04.jpg';  
									   coord_image_ppal=[["top-left", "40.4736", "-4.4936"],["bottom-left", "40.4149", "-4.4936"], ["top-right","40.4736", "-4.3778"]];
									   break;
									   
							case "/5": src_image='./resources/images/mapas/mapa_05.jpg';  
									   coord_image_ppal=[["top-left", "40.4840", "-4.5260"],["bottom-left", "40.4253", "-4.5260"], ["top-right","40.4840", "-4.4102"]];
									   break;
									
							case "/6": src_image='./resources/images/mapas/mapa_06.jpg';  
									   coord_image_ppal=[["top-left", "40.5063", "-4.5182"],["bottom-left", "40.4476", "-4.5182"], ["top-right","40.5063", "-4.4024"]];
									   break;
									   
							case "/7": src_image='./resources/images/mapas/mapa_07.jpg';  
									   coord_image_ppal=[["top-left", "40.4977", "-4.4984"],["bottom-left", "40.4391", "-4.4984"], ["top-right","40.4977", "-4.3826"]];
									   break;
									   
							default: src_image='';  
									 break;
						}
						
						var d=data.Result;
						draw_canvas(container,src_image,'./resources/rutas/'+data.Result.DownloadGPX,id,canvas_number); 
						
						if(canvas_number==1)
						{
							$("#"+container).css("height",height);
							$("#datos_geo").append("<div id='datos_geo_position'></div>");
						}
						
						//$("#datos_geo").append("<div class='vermas' onclick='show_geoloc()'>ACTUALIZAR</div>");
						
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
					
					cadena+='<p><br><br><a class="vermas" onclick="window.open(\''+d.WikilocLink+'\', \'_system\', \'location=yes\');" href="#" >Ver ruta en Wikiloc</a></p>';	
										
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

/*function draw_route(container,src_image, src_gpx) 
{	
	$("#"+container).append('<img src="'+src_image+'" width="768" id="imagen_mapa" style="opacity:0" />');
			
	 $("#imagen_mapa").load(function() {
		
		width=$(this).width();
		height=$(this).height();
		
		var cuadrantes=[[width/3],[height/2]];
		
		$("#"+container).append('<canvas id="canvas" width="'+width+'" height="'+height+'" style="position:absolute;top:0;left:0" ></canvas>');
		
		var canvas = document.getElementById("canvas");						
		canvas.style.border="1px solid #AAA";
		
		canvas.addEventListener('click', function zoom(event)
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
*/

var canvasOffset;
var offsetX;
var offsetY;

var ctx;

var imageX = 0;
var imageY = 0;
var img_global;

var draggingImage = false;
var isDown = false;
var startX=0;
var startY=0;


function handleMouseDown(e) {
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

	draggingImage = true;
}
function handleTouchStart(e) {
    startX = parseInt(e.changedTouches[0].clientX - offsetX);
    startY = parseInt(e.changedTouches[0].clientY - offsetY);
	draggingImage = true;
}

function handleMouseUp(e) {
    draggingImage = false;
    //Pintar la ruta y la geolocalización teniendo en cuenta la nueva posición 'x' e 'y' de la imagen
	draw_points2(ctx);
}

function handleMouseOut(e) {
    handleMouseUp(e);
}

  
function handleMouseMove(e) {
	if(draggingImage) {
	
        imageClick = false;

		mouseX = parseInt(e.clientX - offsetX);
        mouseY = parseInt(e.clientY - offsetY);

         // mover la imagen con la cantidad del ultimo drag
        var dx = mouseX - startX;
        var dy = mouseY - startY;
        imageX -= dx;
        imageY += dy;
        // reset startXY para la siguiente vez
        startX = mouseX;       
		startY = mouseY;
		
		
		if(imageX > 0)
			imageX=0;
		if(imageY > 0)
			imageY=0;
			
		if(imageX < -(img_global.height-$("#mapa_canvas").width()))
			imageX= -(img_global.height-$("#mapa_canvas").width());		
			
		if(imageY < -(img_global.width-$("#mapa_canvas").height()))
			imageY= -(img_global.width-$("#mapa_canvas").height());		

        // repintamos
		ctx.clearRect(0, 0, canvas.height, canvas.width);
		ctx.drawImage(img_global, 0, 0, img_global.width, img_global.height, imageY, imageX, img_global.width, img_global.height);

    }

}
function handleTouchMove(e) {
  
	if(draggingImage) {
	
        imageClick = false;

		mouseX = parseInt(e.changedTouches[0].clientX - offsetX);
        mouseY = parseInt(e.changedTouches[0].clientY - offsetY);

        // mover la imagen con la cantidad del ultimo drag
        var dx = mouseX - startX;
        var dy = mouseY - startY;
        imageX -= dx;
        imageY += dy;
        // reset startXY para la siguiente vez
        startX = mouseX;       
		startY = mouseY;
		
		
		if(imageX > 0)
			imageX=0;
		if(imageY > 0)
			imageY=0;
			
		if(imageX < -(img_global.height-$("#mapa_canvas").width()))
			imageX= -(img_global.height-$("#mapa_canvas").width());		
			
		if(imageY < -(img_global.width-$("#mapa_canvas").height()))
			imageY= -(img_global.width-$("#mapa_canvas").height());		

        // repintamos
		ctx.clearRect(0, 0, canvas.height, canvas.width);
		ctx.drawImage(img_global, 0, 0, img_global.width, img_global.height, imageY, imageX, img_global.width, img_global.height);

    }

}

function draw_canvas(container,src_image, src_gpx, id, canvas_number) 
{	
	
	$("#"+container).append('<div id="mapa_canvas" style="overflow:hidden; width=100%; opacity:1"></div>');
	
	//Tendría que ser proporcional al tamaño de la imagen que vamos a cargar
		
		width=$(window).width(); 
		height=$(window).height();
		
		if(canvas_number==1)
		{
			$("#mapa_canvas").css("width",width);
			$("#mapa_canvas").css("height",height);
			$("#mapa_canvas").append('<canvas id="canvas" width="'+width+'" height="'+height+'" style="position:relative;top:0;left:0;" ></canvas>');
			
			var canvas = document.getElementById("canvas");			
			
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
			
		}
		if(canvas_number==2)
		{
			var img = new Image();
			img.src = src_image;
			img.onload = function(){
			
				img_global=img;
				
				$("#mapa_canvas").css("width",width);
				$("#mapa_canvas").css("height",height);
				
				$("#mapa_canvas").append('<canvas id="canvas" width="'+img.height+'" height="'+img.width+'" style="position:relative;top:0;left:0;" ></canvas>');
				
				$("#canvas").width(img.height);
				$("#canvas").height(img.width);			
				
				//$("#canvas").draggable();
				
				canvasOffset = $("#canvas").offset();
				offsetX = canvasOffset.left;
				offsetY = canvasOffset.top;
				
				$("#canvas").mousedown(function (e) {
					handleMouseDown(e);
				});
				$("#canvas").mousemove(function (e) {
					handleMouseMove(e);
				});
				$("#canvas").mouseup(function (e) {
					handleMouseUp(e);
				});
				$("#canvas").mouseout(function (e) {
					handleMouseOut(e);
				});
				
				var canvas = document.getElementById("canvas");			
				
				canvas.addEventListener("touchstart", handleTouchStart);
				canvas.addEventListener("touchmove", handleTouchMove);
				canvas.addEventListener("touchend", handleMouseUp);
				
				
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
					
						var lat_canvas=parseFloat(((coord_image[0][1]-lat)*img.height)/altura);
						var lon_canvas=parseFloat(((coord_image[0][2]-lon)*img.width)/anchura);

						lat_canvas=lat_canvas.toFixed(3);
						lon_canvas=lon_canvas.toFixed(3);
						
						array_coord_image[k]=lat_canvas+","+lon_canvas;
						k++;
					});

					{
						var contexto = canvas.getContext("2d");
						ctx=contexto;
						
						contexto.lineWidth = 3;
						contexto.fillStyle = "orange";		
						contexto.strokeStyle = "orange";		
						contexto.font = '12px "Tahoma"';	
						
						contexto.save();
						
						contexto.scale(1.2, 1.2);
						
						// Translate 
						contexto.translate(width, 0);
						// Rotate it
						contexto.rotate(90*Math.PI/180);
						//contexto.restore();		
						
						contexto.drawImage(img, 0, 0, img.width, img.height);

						draw_points(contexto);
					}
								
				}).fail(function(){
					$("#"+container).append("<p>No se pudo cargar la ruta.</p>");
				});
			}
			
		}
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

function draw_points2(contexto)
{
	var altura=(coord_image[0][1]-coord_image[1][1]);
	var anchura=(coord_image[0][2]-coord_image[2][2]);
					
	k=0;
	array_coord_image_ppal.forEach(function(latlon) {
	
		var latlon_split=latlon.split(",");
		lat=latlon_split[0];
		lon=latlon_split[1];
	
		var lat_canvas=parseFloat(((coord_image[0][1]-lat)*img_global.height)/altura)+imageX;
		var lon_canvas=parseFloat(((coord_image[0][2]-lon)*img_global.width)/anchura)+imageY;

		lat_canvas=lat_canvas.toFixed(3);
		lon_canvas=lon_canvas.toFixed(3);
		
		array_coord_image[k]=lat_canvas+","+lon_canvas;
		k++;
	});
	
	contexto.fillStyle = "orange";		
	contexto.strokeStyle = "orange";		
				
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
	
	show_geoloc(true);
}


function show_geoloc(redraw)
{
	if (navigator.geolocation)
	{
		//navigator.geolocation.watchPosition(draw_geoloc, error_geoloc, options);
		
		options = {
		  enableHighAccuracy: true,
		  timeout: 15000,
		  maximumAge: 30000
		};
		
		$("#cargando").show('fade', function() {
			if(redraw)
				navigator.geolocation.getCurrentPosition(draw_geoloc2,error_geoloc,options);
			else
				navigator.geolocation.getCurrentPosition(draw_geoloc,error_geoloc,options);
			
		});
	}
	else
	{	
		$("#datos_geo_position").html("<p>Tu dispositivo no permite la geolocalizaci&oacute;n din&aacute;mica.</p>");	
		$("#cargando").hide();
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
	contexto.fillStyle = "#BE0000";		
	contexto.strokeStyle = "#BE0000";		
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
	
	$("#cargando").hide();
	
	$("#datos_geo_position").html("<div class='data_route'>"+
									  "<p class='title_01'>GEOLOCALIZACI&Oacute;N</p>"+
									  "<b>TU POSICI&Oacute;N</b><br>"+
									  "<b>Latitud: </b>:" +lat+"<br>"+
									  "<b>Longitud: </b>: "+lon+"<br>"+
									  "<b>Precisi&oacute;n:</b> "+position.coords.accuracy+"<br>"+
									  "<b>Velocidad:</b> "+position.coords.speed+"<br>"+
									  "<b>Altitud:</b>  "+position.coords.altitude+"<br><br>"+
								  "</div><br>");
								  
	if(lat>=coord_image[0][1] || lat<=coord_image[1][1] || lon<=coord_image[0][2] || lon>=coord_image[2][2])
		$("#datos_geo_position").html("<p>Tu posici&oacute;n ("+lat+", "+lon+") est&aacute; fuera de este mapa</p>");	
		
}
function draw_geoloc2(position)
{
	var lat = position.coords.latitude;
  	var lon = position.coords.longitude;
	
	//var lat=40.455;
	//var lon=-4.465;

	var canvas = document.getElementById("canvas");						
	var contexto = canvas.getContext("2d");
	contexto.fillStyle = "#BE0000";		
	contexto.strokeStyle = "#BE0000";		
	contexto.font = '12px "Tahoma"';		

	var width=canvas.width;
	var height=canvas.height;
							
	var altura=(coord_image[0][1]-coord_image[1][1]);
	var anchura=(coord_image[0][2]-coord_image[2][2]);
							
	var lat_canvas=parseFloat(((coord_image[0][1]-lat)*img_global.height)/altura)+imageX;
	var lon_canvas=parseFloat(((coord_image[0][2]-lon)*img_global.width)/anchura)+imageY;
								
	lat_canvas=Math.round(lat_canvas * 100)/100;
	lon_canvas=Math.round(lon_canvas * 100)/100;
	
	contexto.beginPath();
	contexto.arc(lon_canvas,lat_canvas, 7, 0, 2 * Math.PI, true);
	contexto.fill();
	contexto.closePath();
	
	$("#cargando").hide();
		
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
	$("#cargando").hide();
}

function get_geo_route_map()
{
	if (navigator.geolocation)
	{
		options = {enableHighAccuracy:true, timeout:15000, maximumAge:30000};
		navigator.geolocation.getCurrentPosition(return_user_geoloc,error_user_geoloc,options);
	}
	else
	{	
		$("#datos_geo_position").html("<p>Tu dispositivo no permite la geolocalizaci&oacute;n din&aacute;mica.</p>");	
	}
}
function return_user_geoloc(position)
{
	var lat = position.coords.latitude;
  	var lon = position.coords.longitude;
	
	var latlon_user=lat+","+lon;
	$("#geo_route_map").attr("src","https://www.google.com/maps/embed/v1/directions?key=AIzaSyAD0H1_lbHwk3jMUzjVeORmISbIP34XtzU&origin="+latlon_user+"&destination="+destination+"&avoid=tolls|highways&language=es");

}
function error_user_geoloc(position)
{
	$("#datos_geo_position").html("<p>Error en la geolocalizaci&oacute;n</p>");
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



function onFileSystemError(error) 
{
	console.log("Error File System");
}
function onFileSystemSuccess(fileSystem) 
{

	console.log("File System OK");
	//Cargado el sistema de archivos, crear los directorios pertinentes para la descarga de los ficheros.
	
	//window.webkitStorageInfo.queryUsageAndQuota(webkitStorageInfo.unlimitedStorage, console.log.bind(console));

	/*navigator.webkitPersistentStorage.requestQuota (1024*1024*1024, function() {
		  console.log ('requestQuota: ', arguments);
		}, onError);*/

		
	fs=fileSystem.root;
	
	setFilePath();		
	
	console.log(fs)
	console.log(file_path);
	
	first_time=true;
	
	fs.getDirectory("Cebreros",{create:true, exclusive:false},function() {
		fs.getDirectory(file_path,{create:true, exclusive:false},downloadToDir,onError);
	},onError);
    
    
}

function setFilePath() {
    var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf("android") > -1; 
	if(isAndroid) {
		file_path = "Cebreros/resources";
		//Android
	}
	else {
		file_path = "Cebreros/resources";
		//IOS
	}

}

function downloadToDir(d) {

	console.log('created directory '+d.name);

	DATADIR = d;  

	$("body").prepend("<div id='descarga' onclick='$(this).hide()'></div>");

	$("#descarga").append("Descargando archivos...<br>");
	
	$.each(archivos, function(folder, filename)  
	{	
		console.log(folder+": "+filename);
		
		fs.getDirectory(folder,{create:true, exclusive:false},function() {
			
			console.log("RUTA: "+api_url+folder+filename+"<br>");
			
			var ft = new FileTransfer();		
			
			var dlPath = fs.toURL()+file_path+"/"+folder+filename+".json"; 			

			$("#descarga").append(dlPath);
			
			ft.download(api_url+folder+filename , dlPath, function() {
					$("#descarga").append(" .......... OK<br>");
				}, 
				function(error){
					$("#descarga").append(" .......... KO<br>");
				});
		}
		,function(error){
			alert("Get Directory "+folder+" fail" + error.code);
		});
	});
	
	$("#descarga").html("");
	$("#descarga").hide();
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
	alert("ERROR "+e.code+" - "+e.source+" - "+e.target);
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