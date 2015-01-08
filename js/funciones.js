var api_url='http://w3.cebreros.es/api/v1/';
var extern_url='http://w3.cebreros.es/';

var coord_image=new Array();
var array_coord_image=new Array();

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
	$(body).prepend("Necesita una conexión a internet para poder ver correctamente todos los contenidos de la aplicación");
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

					$.each(data.Result.Items, function(index, d){   
						var fecha=new Date(d.DatePublish);
						var imagen=d.Image; 

						if(imagen!=null) 
							cadena+="<div style='width:100%;height:75px;background:#FFF url("+imagen+") no-repeat center;background-size:cover;'></div>";
							
						cadena+="<div class='fecha_01'>"+fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"</div>";
						cadena+="<h3>"+d.Title+"</h3>";
						cadena+="<a class='vermas' href='noticia.html?id="+d.ID+"'>VER</a>"

					});

					$("#"+container).html(cadena);
				
					break;
					
			case "page": 			
					var cadena="";
				
					var d=data.Result.Data;
						
					var fecha=new Date(d.DatePublish);
					var imagen=d.Image; 
					cadena+="<h2>"+d.Title+"</h2>";
					cadena+="<div class='fecha_02'>"+fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"</div>";

					if(imagen!=null) 
						cadena+="<img src='"+imagen+"' alt='Imagen principal' />";
					
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
								cadena+="<br><a href='"+enlaces[i].Link+"' target='_blank' >"+enlaces[i].Description+"</a>";
							
							cadena+="<br>";
						}
						var videos=data.Result.Videos;
						if(data.Result.TotalVideos>0) 
						{
							for(i=0;i<data.Result.TotalVideos;i++)
								cadena+="<br>"+videos[i].Embed;
							
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
						cadena+="<a class='vermas' href='fotos.html?id="+d.ID+"'>VER</a></div>";

					});

					$("#"+container).html(cadena);
					break;
					
			case "gallery": 
					var cadena="";
				
					var d=data.Result;
					
					var fecha=new Date(d.DatePublish);
					var imagen=d.Image; 
					cadena+="<h2>"+d.Title+"</h2>";
					cadena+=fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"<br>";
					
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
						var imagen=d.Image; 
						cadena+="<div class='buttons_routes' onclick='window.location.href=\"mapa.html?id="+d.ID+"\"'>";
						
						if(imagen!=null) 
							cadena+="<div style='width:100%;height:100px;background:url("+imagen+") no-repeat center;background-size:cover;'></div>";
							
						cadena+="<h5>"+d.Title+"</h5>";
						cadena+="</div>";
					});
					
					cadena+="<div style='clear:both'> </div>";

					$("#"+container).html(cadena);
					break;
					
			case "route": 
					var cadena="";
					var src_image="./resources/images/mapas/mapa_prueba.jpg";
					
					switch(id)
					{
						case "/1": src_image='./resources/images/mapas/mapa_prueba.jpg';  
								  coord_image=[["top-left", "40.474924", "-4.476232"],["bottom-left", "40.438524", "-4.476232"], ["top-right","40.478924", "-4.376584"]];
								  break;
						case "/2": src_image='./resources/images/mapas/mapa_prueba.jpg';  break;
					}
				
					var d=data.Result;

					var imagen=d.Image; 
					cadena+="<h2>"+d.Title+"</h2>";
					
					if(imagen!=null) 
						cadena+="<img src='"+imagen+"' alt='Imagen de la ruta' />";
					
					cadena+=d.Page;
					
					cadena+="<p>DATOS DE LA RUTA</p>";
					cadena+="<p>Altitud maxima: "+d.MaxAltitude+"</p>"+
							"<p>Altitud minima: "+d.MinAltitude+"</p>"+
							"<p>Dificultad:  "+d.Difficulty+"</p>"+
							"<p>Distancia:  "+d.Distance+"</p>"+
							"<p>Ruta circular Monumentos: "+d.Monuments+"</p>"+
							"<p>Panoramicas:  "+d.Panoramics+"</p>";
										
					var imagenes=d.Items;
					if(d.Total>0) 
					{
						for(i=0;i<d.Total;i++)
							cadena+="<br><img src='"+imagenes[i].MinImage+"' alt='Imagen noticia' />";
					}
					
					draw_route(container,src_image,'./resources/rutas/'+data.Result.DownloadGPX); 
					
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

function draw_route(container,src_image, src_gpx) 
{
	alert(src_image+" "+src_gpx);
	
	$("#"+container).append('<img src="'+src_image+'" width="768" id="imagen_mapa" />');
			
	 $("#imagen_mapa").load(function() {
		
		width=$(this).width();
		height=$(this).height();
		
		$("#"+container).append('<canvas id="canvas" width="'+width+'" height="'+height+'" style="position:absolute;top:0;left:0" ></canvas>');
		
		var canvas = document.getElementById("canvas");						
		canvas.style.border="1px solid red";
		
		/*canvas.addEventListener('click', function zoom(event)
		{
		
			var mousex = event.clientX - canvas.offsetLeft;
			var mousey = event.clientY - canvas.offsetTop;
				
			var originx=0,originy=0;

			var trabajo = canvas.getContext("2d");

			var zoom;
				
			if(first_click)
			{
				zoom = 1.2;
											
				trabajo.translate(
					originx,
					originy
				);
				trabajo.scale(zoom,zoom);
				trabajo.translate(
					-( mousex / scale + originx - mousex / ( scale * zoom ) ),
					-( mousey / scale + originy - mousey / ( scale * zoom ) )
				);

				originx = ( mousex / scale + originx - mousex / ( scale * zoom ) );
				originy = ( mousey / scale + originy - mousey / ( scale * zoom ) );
				scale *= zoom;

				var img = new Image();
				img.src = src_image;
				img.onload = function(){
					trabajo.drawImage(img, 0, 0, width, height);
				   
					trabajo.lineWidth = 3;
					trabajo.fillStyle = "blue";		
					trabajo.strokeStyle = "orange";		
					trabajo.font = '12px "Tahoma"';		
				
					draw_points(trabajo);
				}
				
				first_click=false;
			}
			else
			{
			
				zoom = 1;
				trabajo.translate(
					originx,
					originy
				);
				trabajo.scale(zoom,zoom);

				
				var img = new Image();
				img.src = src_image;
				img.onload = function(){
					trabajo.drawImage(img, 0, 0, width, height);
				   
					trabajo.lineWidth = 3;
					trabajo.fillStyle = "blue";		
					trabajo.strokeStyle = "orange";		
					trabajo.font = '12px "Tahoma"';		
				
					draw_points(trabajo);
				}
				
				first_click=true;
			}
		}
		, false);*/

		
		$.get(src_gpx, function(xml) { 
		}).done(function(xml_Doc) {
		
			var altura=(coord_image[0][1]-coord_image[1][1]);
			var anchura=(coord_image[0][2]-coord_image[2][2]);
			
			var k=0;
			$(xml_Doc).find("rtept").each(function() {
				var lat=$(this).attr("lat");
				var lon=$(this).attr("lon");
				
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
			
				var trabajo = canvas.getContext("2d");
				trabajo.drawImage(img, 0, 0, width, height);
				
				trabajo.lineWidth = 3;
				trabajo.fillStyle = "blue";		
				trabajo.strokeStyle = "orange";		
				trabajo.font = '12px "Tahoma"';		

				draw_points(trabajo);
			
			}
			
		}).fail(function(){
			$("#"+container).append("<p>No se pudo cargar la ruta.</p>");
		});
			
			
		
	});


}

function draw_points(trabajo)
{
	for(i=0;i<array_coord_image.length;i++)
	{
		var array_points=array_coord_image[i].split(",");
		var lat_canvas=array_points[0];
		var lon_canvas=array_points[1];

		trabajo.lineTo(lon_canvas,lat_canvas);								
		trabajo.stroke();
		
		trabajo.beginPath();
		trabajo.arc(lon_canvas,lat_canvas, 1, 0, 2 * Math.PI, true);
		trabajo.fill();
		trabajo.closePath();
			
		//trabajo.fillText(i,lon_canvas,lat_canvas);
	}
	
	show_geoloc();
}

function show_geoloc()
{
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(draw_geoloc,error_geoloc,{enableHighAccuracy:true, maximumAge:30000, timeout:30000});
	}
	else
	{
		$("#contenido").append("Tu dispositivo no permite la geolocalización dinámica.");			
	}
}

function draw_geoloc(position)
{
	//var lat = position.coords.latitude;
  	//var lon = position.coords.longitude;
	
	var lat=40.46;
	var lon=-4.46;

	var canvas = document.getElementById("canvas");						
	var trabajo = canvas.getContext("2d");
	trabajo.fillStyle = "blue";		
	trabajo.strokeStyle = "blue";		
	trabajo.font = '12px "Tahoma"';		

	var width=canvas.width;
	var height=canvas.height;
							
	var altura=(coord_image[0][1]-coord_image[1][1]);
	var anchura=(coord_image[0][2]-coord_image[2][2]);
							
	var lat_canvas=parseFloat(((coord_image[0][1]-lat)*height)/altura);
	var lon_canvas=parseFloat(((coord_image[0][2]-lon)*width)/anchura);
								
	lat_canvas=Math.round(lat_canvas * 100)/100;
	lon_canvas=Math.round(lon_canvas * 100)/100;
	
	trabajo.beginPath();
	trabajo.arc(lon_canvas,lat_canvas, 6, 0, 2 * Math.PI, true);
	trabajo.fill();
	trabajo.closePath();
	
	$("#contenido").append("<p>Tu posicion: "+lat+", "+lon+"</p>");	
		
}

function error_geoloc(error)
{
	$("#contenido").append("La geolocalización ha fallado.");	
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