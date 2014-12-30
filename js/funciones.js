function ajax_recover_data(type, container) {
	var extern_url='http://w3.cebreros.es/api/v1/';
	
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
	  url: extern_url+type,
	  type: 'GET',
	  dataType: 'json',
	  crossDomain: true, 
	  success: 'successCallback',
	  error:function(jqXHR, textStatus, errorThrown){
			alert('Error de conexión. No se han podido recuperar los datos. Por favor inténtalo de nuevo.');	
			console.log(jqXHR);
			console.log(textStatus+" "+errorThrown);
	  },
	  async:false,
	});
	
}

function ajax_recover_data_jsonp(type, container) {
	var extern_url='http://w3.cebreros.es/api/v1/';
	
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
	  url: extern_url+type,
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
