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
							cadena+="<div style='width:100%;height:50px;background:url("+imagen+") no-repeat center;background-size:cover;'></div>";
							
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

					if(imagen!=null) 
						cadena+="<img src='"+imagen+"' alt='Imagen principal' />";
					
					cadena+=d.Page;
					
					alert(cadena);
					
					//if(online)
					{
						/*var geolocation2=d.Geolocation;
						if(geolocation2!="" || geolocation2!=null)
						{
							geolocation2=geolocation2.split(/[(,)]/);
							var geo_lat=geolocation2[1];
							var geo_lon=geolocation2[2];
							cadena+="<br><iframe width='100%;border:none;' src='https://www.google.com/maps/embed/v1/directions?key=AIzaSyAD0H1_lbHwk3jMUzjVeORmISbIP34XtzU&origin="+geo_lat+","+geo_lon+"' ></iframe>";
							
							<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3035.649766162187!2d-4.4656033!3d40.4608881!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI3JzM5LjIiTiA0wrAyNyc1Ni4yIlc!5e0!3m2!1ses!2ses!4v1420718903973" width="600" height="450" frameborder="0" style="border:0"></iframe>
						}
						
						var imagenes=data.Result.Images;
						if(d.Result.TotalImages>0) 
						{
							for(i=0;i<imagenes.TotalImages;i++)
								cadena+="<br><img src='"+(extern_url+"public/images/"+imagenes[i].Image)+"' alt='Imagen' />";
						}
						var adjuntos=data.Result.Attachments;
						if(d.Result.TotalAttachments>0) 
						{
							for(i=0;i<d.Result.TotalAttachments;i++)
								cadena+="<br><a href='"+(extern_url+"public/files/"+adjuntos[i].File)+"' target='_blank' />"+enlaces[i].Description+"</a>";
						}
						var enlaces=data.Result.Links;
						if(d.Result.TotalLinks>0) 
						{
							for(i=0;i<d.Result.TotalLinks;i++)
								cadena+="<br><a href='"+enlaces[i].Link+"' target='_blank' />"+enlaces[i].Description+"</a>";
						}
						var videos=data.Result.Videos;
						if(d.Result.TotalVideos>0) 
						{
							for(i=0;i<d.Result.TotalVideos;i++)
								cadena+="<br>"+videos[i].Embed;
						}*/
					}
				
					$("#"+container).html(cadena);
				
					break;
					
			case "calendar": break;
			case "calendar_day": break;
			case "event": break;
			
			case "galleries": 
					var cadena="";
					
					cadena+="<p>"+data.Result.ItemCount+" galería/s</p>";
					
					$.each(data.Result.Items, function(index, d){   
						var imagen=d.minImage; 
						cadena+="<div style='border-bottom: 1px dashed #CCC'>";
						
						if(imagen!=null) 
							cadena+="<div style='width:100%;height:50px;background:url("+imagen+") no-repeat center;background-size:cover;'></div>";
							
						cadena+=d.Title+" ::: <a href='fotos.html?id="+d.ID+"'>Ver &gt;</a>"
						cadena+="</div>";
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
					
					if(imagen!=null) 
						cadena+="<img src='"+imagen+"' alt='Imagen principal' />";
					
					cadena+=d.Description;
					alert(cadena);
					
					//if(online)
					{
						if(d.Total>0) 
						{
							var imagenes=d.Items;
							for(i=0;i<d.Total;i++)
								cadena+="<br><img src='"+imagenes[i].MinImage+"' alt='Imagen' />";
						}
						
					}
					break;
					
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
					
					switch(id)
					{
						case "1": src_image='./resources/images/mapas/mapa_prueba.jpg';  break;
						case "2": src_image='./resources/images/mapas/mapa_prueba.jpg';  break;
					}
				
					var d=data.Result;

					var imagen=d.Image; 
					cadena+="<h2>"+d.Title+"</h2>";
					cadena+=extern_url+"public/images/"+imagen;
					
					if(imagen!=null) 
						cadena+="<img src='"+imagen+"' alt='Imagen de la ruta' />";
					
					cadena+=d.Page;
					
					cadena+="<p>DATOS DE LA RUTA</p>";
					cadena+="<p>Altitud máxima: "+d.MaxAltitude+"</p>"+
							"<p>Altitud mínima: "+d.MinAltitude+"</p>"+
							"<p>Dificultad:  "+d.Difficulty+"</p>"+
							"<p>Distancia:  "+d.Distance+"</p>"+
							"<p>Ruta circular Monumentos: "+d.Monuments+"</p>"+
							"<p>Panorámicas:  "+d.Panoramics+"</p>";
					
					alert(cadena);
					
					/*var imagenes=d.Items;
					if(d.Total>0) 
					{
						for(i=0;i<d.Total;i++)
							cadena+="<br><img src='"+imagenes[i].MinImage+"' alt='Imagen noticia' />";
					}*/
					alert(container);
				
					$("#"+container).append(cadena);
					
					draw_route(container,src_image,'.resources/rutas/'+data.Result.DownloadGPX); 
					
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
	alert(src_image);
	
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