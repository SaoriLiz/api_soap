$(document).ready(function(){
	console.log("cargado");
	$("#panel_principal_2 .panel-heading").html("CESPM <i class='fa fa-cog fa-fw'></i> Saldos por grupo");

	var data;

	$('[id^=cuenta]').keypress(validateNumber);

	function validateNumber(event) {
	    var key = window.event ? event.keyCode : event.which;
	    if (event.keyCode === 8 || event.keyCode === 46) {
	        return true;
	    } else if ( key < 48 || key > 57 ) {
	        return false;
	    } else {
	    	return true;
	    }
	};

	$("#form_saldosxgrupo").submit(function(event) {
	  event.preventDefault();
	  var myData = $("#form_saldosxgrupo").serializeArray();
  		$.get('data/saldosxgrupo_entry.php',function(data){}) 
    	.done(function(data) {
			if (myData[0]['value']==data) {
				$.ajax({
				    url: 'data/saldosxgrupo.php',
				    type: 'POST',
				    async: true,  
				    data: {arg_codseg:myData[0]['value'],arg_gpoini:myData[1]['value']},
					statusCode: {
						202: function(XMLHttpRequest) { 
						  var obj= XMLHttpRequest.responseText.replace('string(10) "conectado!"', ''); 
						  console.log("obj:");
						  console.log(obj);
						  obj2 = $.parseJSON(JSON.stringify(obj));
						  if (obj2.indexOf("Warning") !=-1) {
							alert("Revise el número de cuenta.");
							$("#estatus_2 label").html("<i class='fa fa-times-circle-o text-danger' aria-hidden='true'></i> Ha ocurrido un error.<br>Revise el número de cuenta.");
							$("#estatus_2").removeClass("hide panel-info panel-primary");
							$("#estatus_2").addClass("show panel-danger");
							$('#id_data').removeClass("show");
							$('#id_data').addClass("hide");
							console.log("HIDE(?)");
						  } else {
						  	if (obj2.indexOf("Exito") !=-1) {
							    console.log("# registros:"+Object.keys(obj).length);
							  	obj = $.parseJSON(obj);
							  	console.log(obj['respuesta_soap']);
							  	$('#id_data').removeClass("hide");
							  	$('#id_data').addClass("show");
								$('#id_data').bootstrapTable({
								    data: obj['respuesta_soap']
								});
							  	$('#id_data').bootstrapTable('refresh');

							  	$("#estatus_2").removeClass("hide panel-danger");
								$("#estatus_2").addClass("show panel-primary");
								$("#estatus_2 label").html("<i class='fa fa-check-circle-o text-success' aria-hidden='true'> Se han cargado "+Object.keys(obj['respuesta_soap']).length+" registros.");
								$("#estatus_2 .panel-heading").html("Estatus <i class='fa fa-list-alt' aria-hidden='true'></i>");
						  	} else if(obj2.indexOf("Código de Seguridad Invalido")!=-1){
						  		alert("Código de Seguridad Invalido");
						  		$("#estatus_2 label").html("<i class='fa fa-times-circle-o text-danger' aria-hidden='true'></i> Ha ocurrido un error.<br>Código de Seguridad Invalido.");
								$("#estatus_2").removeClass("hide panel-info panel-primary");
								$("#estatus_2").addClass("show panel-danger");
								$('#id_data').removeClass("show");
								$('#id_data').addClass("hide");
						  	} else {
						  		alert("Error desconocido(?)");
						  		$("#estatus_2 label").html("<i class='fa fa-times-circle-o text-danger' aria-hidden='true'></i> Ha ocurrido un error.<br>Error desconocido (?). --Formato JSON--");
								$("#estatus_2").removeClass("hide panel-info panel-primary");
								$("#estatus_2").addClass("show panel-danger");
								$('#id_data').removeClass("show");
								$('#id_data').addClass("hide");
						  	}
						  }
						},
						403: function() { console.log("Error!"); },
						500: function() { console.log("Error!"); }
						}
				});
			} else {
				alert("Código de seguridad inválido.");
				$("#estatus_2 label").html("<i class='fa fa-times-circle-o text-danger' aria-hidden='true'></i> Ha ocurrido un error.<br>Código de Seguridad Invalido.");
				$("#estatus_2").removeClass("hide panel-info panel-primary");
				$("#estatus_2").addClass("show panel-danger");
				$('#id_data').removeClass("show");
				$('#id_data').addClass("hide");
			}
		  });
	});



});