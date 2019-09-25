$(document).ready(function(){
	console.log("js en saldosxcuenta.js");
	$("#panel_principal_3 .panel-heading").html("CESPM <i class='fa fa-cog fa-fw'></i> Saldos por cuenta");

	window.registro_fail=0; 
	window.file="";
	var data;
	var longitud=0;
	var arg_codseg="";
	var arg_pobcta=""; 
	var arg_gpocta=""; 
	var arg_folcta=""; 
	var arg_subcta="";
	var file="";
	var err= new Object();
	err[0] = new Array();
	var err_array = new Array();
	var errores_count=0;
	window.valida_mismo_registro=0;
	window.valida_servidor=0;

	$("input[name='archivo3']").change(handleFileSelect);

	function handleFileSelect(evt){
		file = evt.target.files[0];
	}

	function scroll_div(id){
		var div = $('#'+id);
	    var height = div[0].scrollHeight;
	    div.scrollTop(height);
	}

	function download_CSV(array,name,tipo)
	{	
		//alert("Descargando...");
	    var csv = Papa.unparse(array);

	    var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
	    var csvURL =  null;
	    if (navigator.msSaveBlob)
	    {
	        csvURL = navigator.msSaveBlob(csvData, name+tipo);
	    }
	    else
	    {
	        csvURL = window.URL.createObjectURL(csvData);
	    }

	    var tempLink = document.createElement('a');
	    tempLink.href = csvURL;
	    tempLink.setAttribute('download', name+tipo);
	    tempLink.click();
	}

	function parse(){
		var fila= 0;
        var mensaje3="";

		Papa.parse(file, {
	      header: true,
	      keepEmptyRows:false,
		  skipEmptyLines: true,
	      errors: function(error, file) {
				console.log("Parsing error:", error, file);
				$("#mensaje3").append("<br>ERROR:"+error+"<br>"+file);
		  },
	      complete: function(results) {
	      	$("#mensaje3").removeClass("hide");
			$("#mensaje3").addClass("show");
			$(".fa-cog").addClass("fa-spin text-success");
			console.log("Cargando datos...");
	      	data = results;
            longitud=data.data.length;
            console.log("longitud:"+longitud);
            var array = $.map(data.data, function(value, index) {
			    return [value];
			});
			var i=0;
			console.log("array:");
			console.log(array);
			var obj= new Object();
			obj[0] = new Array();
            function next(i,array){
            		console.log("inside array");
            		var index=i;
        			arg_codseg=array[index].arg_codseg;
                    arg_pobcta=array[index].arg_pobcta;
                    arg_gpocta=array[index].arg_gpocta;
                    arg_folcta=array[index].arg_folcta;
                    arg_subcta=array[index].arg_subcta;
                    console.log("arg_codseg:"+arg_codseg+" arg_pobcta:"+arg_pobcta+" arg_gpocta:"+arg_gpocta+" arg_folcta:"+arg_folcta+" arg_subcta:"+arg_subcta);
                    $.ajax({
					    url: 'data/saldosxcuenta.php',
					    type: 'POST',
					    data: {arg_codseg:arg_codseg,arg_pobcta:arg_pobcta,arg_gpocta:arg_gpocta,arg_folcta:arg_folcta,arg_subcta:arg_subcta},
						statusCode: {
							201: function(XMLHttpRequest) {
								//alert(XMLHttpRequest.mensaje);
								console.log(XMLHttpRequest.mensaje);
								console.log(XMLHttpRequest.respuesta_soap);
								if (XMLHttpRequest.mensaje=='Registro insertado correctamente') {
									i++;
									test = 
										[
										    {	
										    	"NUMERO_CUENTA" : arg_gpocta+arg_folcta+arg_subcta,
										        "ADEUDO_VENCIDO": XMLHttpRequest.respuesta_soap.ADEUDO_VENCIDO,
										        "CONVENIOS": XMLHttpRequest.respuesta_soap.CONVENIOS,
										        "CUENTA_CORRIENTE": XMLHttpRequest.respuesta_soap.CUENTA_CORRIENTE,
										        "OBRA_Y_DERECHOS": XMLHttpRequest.respuesta_soap.OBRA_Y_DERECHOS,
										        "OTROS_SERVICIOS": XMLHttpRequest.respuesta_soap.OTROS_SERVICIOS,
										        "RECARGO_ADEUDO_VENCIDO": XMLHttpRequest.respuesta_soap.RECARGO_ADEUDO_VENCIDO,
										        "RECARGO_CONVENIOS": XMLHttpRequest.respuesta_soap.RECARGO_CONVENIOS,
										        "RECARGO_OTROS_SERVICIOS": XMLHttpRequest.respuesta_soap.RECARGO_OTROS_SERVICIOS,
										        "RECARGO_REZAGO": XMLHttpRequest.respuesta_soap.RECARGO_REZAGO,
										        "REZAGO": XMLHttpRequest.respuesta_soap.RECARGO_REZAGO,
										        "TEL1": XMLHttpRequest.respuesta_soap.TEL,
										        "TEL2": XMLHttpRequest.respuesta_soap.TEL2,

										    }
									];
									obj[0].push(
									    test[0]
									);
									console.log("Fila #"+i+": procesada. |"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+"|");
					      			$("#mensaje3").append("<br><label><strong>Fila #"+i+":procesada</strong>  |"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+"|</label>");
					      	 		scroll_div("mensaje3");
									if (i<longitud&&registro_fail==0) {
							      		next(i,array);
							      	} else if(i>=longitud){
							      		console.log("FIN----------------------------------------------------------------------");
							      		console.log("object despues de next");
							            console.log(obj);
							            $('#id_data3').removeClass("hide");
							  			$('#id_data3').addClass("show");
							  			$('#id_data3').click(function(){
										    download_CSV(obj[0],"cuentas",".xls");
										    download_CSV(obj[0],"cuentas",".txt");
										    //download_CSV(obj[0],"cuentas",".csv");
							  			});
							            /*$('#id_data3').bootstrapTable({
									        data: obj[0]
									    });*/
										if(err[0].length > 0){
							            	/*$('#id_error3').bootstrapTable({
										        data: err[0]
										    });*/
										    $("#panel_errores3").removeClass("hide");
											$("#panel_errores3").addClass("show");
											$('#errores3').click(function(){
											    download_CSV(err[0],"cuentas_no_cargadas",".xls");
											    download_CSV(err[0],"cuentas_no_cargadas",".txt");
											    //download_CSV(err[0],"cuentas_no_cargadas",".csv");
								  			});
										    console.log("Errores:");
										    console.log(err[0]);
										    alert("Revise los registros que no se cargaron");
										    $("#mensaje3").append("<br><label class='text-warning'>**********************************************************************************************************************************************************************</label>");
											$("#mensaje3").append("<br><strong><i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'></i> Revise los registros que no se cargaron.</strong><br><strong>Total de registros:"+(longitud)+"</strong>"+"<br><strong>Total de registros cargados:"+(longitud-errores_count)+"</strong>");
											$("#estatus3").removeClass("hide panel-info panel-success");
											$("#estatus3").addClass("show panel-warning");
											$("#estatus3 label").html("<i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'> Se han cargado "+(longitud-errores_count)+" registros.");
											$("#estatus3 .panel-heading").html("Registros <i class='fa fa-exclamation-triangle' aria-hidden='true'></i>");
											$(".fa-cog").removeClass("fa-spin");  
							            } else {
							            	$("#mensaje3").append("<br><label class='text-success'>**********************************************************************************************************************************************************************</label>");
											$("#mensaje3").append("<br><strong><i class='fa fa-check-circle-o text-success' aria-hidden='true'></i> Se ha cargado toda la información</strong><br><strong>Total de registros:"+(longitud)+"</strong>");
											$("#estatus3").removeClass("hide");
											$("#estatus3").addClass("show");
											$("#estatus3 label").html("<i class='fa fa-check-circle-o text-success' aria-hidden='true'> Se han cargado "+(longitud-errores_count)+" registros.");
											$("#estatus3 .panel-heading").html("Registros <i class='fa fa-list-alt' aria-hidden='true'></i>");
											$(".fa-cog").removeClass("fa-spin");
							            }
										scroll_div("mensaje3");
							      	}
								}
							},
							500: function(XMLHttpRequest) { 
								console.log("Error!"); 
								console.log(XMLHttpRequest);
								registro_fail=i;
					    		var x= registro_fail+1;
					    		//if (XMLHttpRequest.responseJSON.respuesta_soap=='La Cuenta No Existe'||XMLHttpRequest.responseJSON.mensaje=='Revise el código de seguridad de su archivo.') {
								if (XMLHttpRequest.responseJSON.mensaje=='Error desconocido del web service') {
									console.log("valida_mismo_registro:"+valida_mismo_registro+" i:"+i+" valida_servidor:"+valida_servidor);
									if (valida_mismo_registro==i) {
										console.log("-----Mismo valor reprocesado");
										valida_servidor++;
										if (valida_servidor>40) { //Si manda el registro más de 40 veces y sigue enviando el mismo error-> entra la excepción y finaliza el programa.
											err_array = 
											[
											    {	
											        "arg_codseg": arg_codseg,
											        "arg_pobcta": arg_pobcta,
											        "arg_gpocta": arg_gpocta,
											        "arg_folcta": arg_folcta,
											        "arg_subcta": arg_subcta,
											        "error": XMLHttpRequest.responseJSON.respuesta_soap
											    }
											];
											err[0].push(
											    err_array[0]
											);
											console.log("Parece ser que el servidor no responde");
											console.log("longitud:"+longitud+" errores_count"+errores_count);
											$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>Hay un problema con el servidor.</label>");
											$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>Servidor no responde.</label>");
											valida_mismo_registro==0;
											console.log("FIN----------------------------------------------------------------------");
								            $('#id_data3').removeClass("hide");
								  			$('#id_data3').addClass("show");
								            /*$('#id_data3').bootstrapTable({
										        data: obj[0]
										    });*/
										    $('#id_data3').click(function(){
											    download_CSV(obj[0],"cuentas",".xls");
											    download_CSV(obj[0],"cuentas",".txt");
											    //download_CSV(obj[0],"cuentas",".csv");
								  			});
										    /*$('#id_error3').bootstrapTable({
										        data: err[0]
										    });*/
										    $('#errores3').click(function(){
											    download_CSV(err[0],"cuentas_no_cargadas",".xls");
											    download_CSV(err[0],"cuentas_no_cargadas",".txt");
											    //download_CSV(err[0],"cuentas_no_cargadas",".csv");
								  			});
										    $("#panel_errores3").removeClass("hide");
											$("#panel_errores3").addClass("show");
										    console.log("Errores:");
										    console.log(err[0]);
										    alert("Revise los registros que no se cargaron");
										    $("#mensaje3").append("<br><label class='text-warning'>**********************************************************************************************************************************************************************</label>");
											$("#mensaje3").append("<br><strong><i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'></i> El servidor no responde.</strong><br><strong>Total de registros:"+(longitud)+"</strong>"+"<br><strong>Total de registros cargados:"+(i-errores_count)+"</strong>");
											$("#estatus3").removeClass("hide panel-info panel-success");
											$("#estatus3").addClass("show panel-warning");
											$("#estatus3 label").html("<i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'> Se han cargado "+(i-errores_count)+" registros.");
											$("#estatus3 .panel-heading").html("Registros <i class='fa fa-exclamation-triangle' aria-hidden='true'></i>");
											$(".fa-cog").removeClass("fa-spin");  
										}else {
											console.log("Reprocesando valor... fila:"+i);
											console.log("longitud:"+longitud+" errores_count"+errores_count);
											console.log("valida_mismo_registro:"+valida_mismo_registro+" i:"+i+" valida_servidor:"+valida_servidor);
							      			$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i> Registro#:"+x+"|"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+"|</label>");
							      			$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.mensaje+"</label>");
											$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.respuesta_soap+"</label>");
											$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>Reprocesando valor...</label><br>");
											scroll_div("mensaje3");
											console.log(XMLHttpRequest.responseJSON.mensaje);
											console.log(XMLHttpRequest.responseJSON.respuesta_soap);
											registro_fail=0;
										//next(i,array);
										if (i<longitud&&registro_fail==0) {
								      		next(i,array);
								      	} else if(i>=longitud){
								      		console.log("FIN----------------------------------------------------------------------");
								      		console.log("object despues de next");
								            console.log(obj);
								            $('#id_data3').removeClass("hide");
								  			$('#id_data3').addClass("show");
								            /*$('#id_data3').bootstrapTable({
										        data: obj[0]
										    });*/
										    $('#id_data3').click(function(){
											    download_CSV(obj[0],"cuentas",".xls");
											    download_CSV(obj[0],"cuentas",".txt");
											    //download_CSV(obj[0],"cuentas",".csv");
								  			});
											if(err[0].length > 0){
								            	/*$('#id_error3').bootstrapTable({
											        data: err[0]
											    });*/
											    $('#errores3').click(function(){
												    download_CSV(err[0],"cuentas_no_cargadas",".xls");
												    download_CSV(err[0],"cuentas_no_cargadas",".txt");
												    //download_CSV(err[0],"cuentas_no_cargadas",".csv");
									  			});
											    $("#panel_errores3").removeClass("hide");
												$("#panel_errores3").addClass("show");
											    console.log("Errores:");
											    console.log(err[0]);
											    alert("Revise los registros que no se cargaron");
											    $("#mensaje3").append("<br><label class='text-warning'>**********************************************************************************************************************************************************************</label>");
												$("#mensaje3").append("<br><strong><i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'></i> Revise los registros que no se cargaron.</strong><br><strong>Total de registros:"+(longitud)+"</strong>"+"<br><strong>Total de registros cargados:"+(longitud-errores_count)+"</strong>");
												$("#estatus3").removeClass("hide panel-info panel-success");
												$("#estatus3").addClass("show panel-warning");
												$("#estatus3 label").html("<i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'> Se han cargado "+(longitud-errores_count)+" registros.");
												$("#estatus3 .panel-heading").html("Registros <i class='fa fa-exclamation-triangle' aria-hidden='true'></i>");
												$(".fa-cog").removeClass("fa-spin");    
												$("#descargar_error3").click(function(){
													$('#id_error3').tableExport({type:'csv'});
												})
								            } else {
								            	$("#mensaje3").append("<br><label class='text-success'>**********************************************************************************************************************************************************************</label>");
												$("#mensaje3").append("<br><strong><i class='fa fa-check-circle-o text-success' aria-hidden='true'></i> Se ha cargado toda la información</strong><br><strong>Total de registros:"+(longitud-errores_count)+"</strong>");
												$("#estatus3").removeClass("hide");
												$("#estatus3").addClass("show");
												$("#estatus3 label").html("<i class='fa fa-check-circle-o text-success' aria-hidden='true'> Se han cargado "+(longitud-errores_count)+" registros.");
												$("#estatus3 .panel-heading").html("Registros <i class='fa fa-list-alt' aria-hidden='true'></i>");
												$(".fa-cog").removeClass("fa-spin");
												$("#descargar_data3").click(function(){
													$('#id_data3').tableExport({type:'csv'});
												})
								            }
											scroll_div("mensaje3");
								      	}
							      		valida_mismo_registro=i;
										}

									} else {
										console.log("Reprocesando valor... fila:"+i);
										console.log("valida_mismo_registro:"+valida_mismo_registro+" i:"+i+" valida_servidor:"+valida_servidor);
						      			$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i> Registro#:"+x+"|"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+"|</label>");
						      			$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.mensaje+"</label>");
										$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.respuesta_soap+"</label>");
										$("#mensaje3").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>Reprocesando valor...</label><br>");
										scroll_div("mensaje3");
										console.log(XMLHttpRequest.responseJSON.mensaje);
										console.log(XMLHttpRequest.responseJSON.respuesta_soap);
										registro_fail=0;
										//next(i,array);
										if (i<longitud&&registro_fail==0) {
								      		next(i,array);
								      	} else if(i>=longitud){
								      		console.log("FIN----------------------------------------------------------------------");
								      		console.log("object despues de next");
								            console.log(obj);
								            $('#id_data3').removeClass("hide");
								  			$('#id_data3').addClass("show");
								            /*$('#id_data3').bootstrapTable({
										        data: obj[0]
										    });*/
										    $('#id_data3').click(function(){
											    download_CSV(obj[0],"cuentas",".xls");
											    download_CSV(obj[0],"cuentas",".txt");
											    //download_CSV(obj[0],"cuentas",".csv");
								  			});
											if(err[0].length > 0){
								            	/*$('#id_error3').bootstrapTable({
											        data: err[0]
											    });*/
											    $('#errores3').click(function(){
												    download_CSV(err[0],"cuentas_no_cargadas",".xls");
												    download_CSV(err[0],"cuentas_no_cargadas",".txt");
												    download_CSV(err[0],"cuentas_no_cargadas",".csv");
									  			});
											    $("#panel_errores3").removeClass("hide");
												$("#panel_errores3").addClass("show");
											    console.log("Errores:");
											    console.log(err[0]);
											    alert("Revise los registros que no se cargaron");
											    $("#mensaje3").append("<br><label class='text-warning'>**********************************************************************************************************************************************************************</label>");
												$("#mensaje3").append("<br><strong><i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'></i> Revise los registros que no se cargaron.</strong><br><strong>Total de registros:"+(longitud)+"</strong>"+"<br><strong>Total de registros cargados:"+(longitud-errores_count)+"</strong>");
												$("#estatus3").removeClass("hide panel-info panel-success");
												$("#estatus3").addClass("show panel-warning");
												$("#estatus3 label").html("<i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'> Se han cargado "+(longitud-errores_count)+" registros.");
												$("#estatus3 .panel-heading").html("Registros <i class='fa fa-exclamation-triangle' aria-hidden='true'></i>");
												$(".fa-cog").removeClass("fa-spin");    
												$("#descargar_error3").click(function(){
													$('#id_error3').tableExport({type:'csv'});
												})
								            } else {
								            	$("#mensaje3").append("<br><label class='text-success'>**********************************************************************************************************************************************************************</label>");
												$("#mensaje3").append("<br><strong><i class='fa fa-check-circle-o text-success' aria-hidden='true'></i> Se ha cargado toda la información</strong><br><strong>Total de registros:"+(longitud)+"</strong>");
												$("#estatus3").removeClass("hide");
												$("#estatus3").addClass("show");
												$("#estatus3 label").html("<i class='fa fa-check-circle-o text-success' aria-hidden='true'> Se han cargado "+(longitud-errores_count)+" registros.");
												$("#estatus3 .panel-heading").html("Registros <i class='fa fa-list-alt' aria-hidden='true'></i>");
												$(".fa-cog").removeClass("fa-spin");
												$("#descargar_data3").click(function(){
													$('#id_data3').tableExport({type:'csv'});
												})
								            }
											scroll_div("mensaje3");
								      	}
							      		valida_mismo_registro=i;
									}

								} else {
									if (XMLHttpRequest.responseJSON.respuesta_soap=='La Cuenta No Existe'||XMLHttpRequest.responseJSON.mensaje=='Revise el código de seguridad de su archivo.') {
										console.log("la cuenta no existe....");
										err_array = 
										[
										    {
										        "arg_codseg": arg_codseg,
										        "arg_pobcta": arg_pobcta,
										        "arg_gpocta": arg_gpocta,
										        "arg_folcta": arg_folcta,
										        "arg_subcta": arg_subcta,
										        "error": XMLHttpRequest.responseJSON.respuesta_soap
										    }
										];
										err[0].push(
										    err_array[0]
										);
										$("#mensaje3").append("<label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i> Registro#:"+x+"|"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+"|</label>");
							      		$("#mensaje3").append("<br><label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.mensaje+"</label>");
										$("#mensaje3").append("<br><label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.respuesta_soap+"</label>");
										scroll_div("mensaje3");
										console.log(XMLHttpRequest.responseJSON.mensaje);
										console.log(XMLHttpRequest.responseJSON.respuesta_soap);
										registro_fail=0;
										i++;
										errores_count++;
										//next(i,array);
										console.log("i:"+i+" longitud:"+longitud+" registro_fail:"+registro_fail);
										if (i<longitud&&registro_fail==0) {
								      		next(i,array);
								      	} else if(i>=longitud){
								      		console.log("FIN----------------------------------------------------------------------");
								      		console.log("object despues de next");
								            console.log(obj);
								            $('#id_data3').removeClass("hide");
								  			$('#id_data3').addClass("show");
								            /*$('#id_data3').bootstrapTable({
										        data: obj[0]
										    });*/
										    $('#id_data3').click(function(){
											    download_CSV(obj[0],"cuentas",".xls");
											    download_CSV(obj[0],"cuentas",".txt");
											    download_CSV(obj[0],"cuentas",".csv");
								  			});
											if(err[0].length > 0){
								            	/*$('#id_error3').bootstrapTable({
											        data: err[0]
											    });*/
											    $('#errores3').click(function(){
												    download_CSV(err[0],"cuentas_no_cargadas",".xls");
												    download_CSV(err[0],"cuentas_no_cargadas",".txt");
												    download_CSV(err[0],"cuentas_no_cargadas",".csv");
									  			});
											    $("#panel_errores3").removeClass("hide");
												$("#panel_errores3").addClass("show");
											    console.log("Errores:");
											    console.log(err[0]);
											    alert("Revise los registros que no se cargaron");
											    $("#mensaje3").append("<br><label class='text-warning'>**********************************************************************************************************************************************************************</label>");
												$("#mensaje3").append("<br><strong><i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'></i> Revise los registros que no se cargaron.</strong><br><strong>Total de registros:"+(longitud)+"</strong>"+"<br><strong>Total de registros cargados:"+(longitud-errores_count)+"</strong>");
												$("#estatus3").removeClass("hide panel-info panel-success");
												$("#estatus3").addClass("show panel-warning");
												$("#estatus3 label").html("<i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'> Se han cargado "+(longitud-errores_count)+" registros.");
												$("#estatus3 .panel-heading").html("Registros <i class='fa fa-exclamation-triangle' aria-hidden='true'></i>");
												$(".fa-cog").removeClass("fa-spin");    
												$("#descargar_error3").click(function(){
													$('#id_error3').tableExport({type:'csv'});
												})
								            } else {
								            	$("#mensaje3").append("<br><label class='text-success'>**********************************************************************************************************************************************************************</label>");
												$("#mensaje3").append("<br><strong><i class='fa fa-check-circle-o text-success' aria-hidden='true'></i> Se ha cargado toda la información</strong><br><strong>Total de registros:"+(longitud)+"</strong>");
												$("#estatus3").removeClass("hide");
												$("#estatus3").addClass("show");
												$("#estatus3 label").html("<i class='fa fa-check-circle-o text-success' aria-hidden='true'> Se han cargado "+(longitud-errores_count)+" registros.");
												$("#estatus3 .panel-heading").html("Registros <i class='fa fa-list-alt' aria-hidden='true'></i>");
												$(".fa-cog").removeClass("fa-spin");
												$("#descargar_data3").click(function(){
													$('#id_data3').tableExport({type:'csv'});
												})
								            }
											scroll_div("mensaje3");
								      	}
									} else {
										$("#mensaje3").append("<label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i> Registro#:"+x+"|"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+"|</label>");
							      		$("#mensaje3").append("<br><label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.mensaje+"</label>");
										$("#mensaje3").append("<br><label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.respuesta_soap+"</label>");
										$("#estatus3 label").html("<i class='fa fa-times-circle-o text-danger' aria-hidden='true'></i> Ha ocurrido un error.<br> Fila: "+x+"<br>"+XMLHttpRequest.responseJSON.mensaje+"<br>"+XMLHttpRequest.responseJSON.respuesta_soap);
										$("#estatus3").removeClass("hide panel-info");
										$("#estatus3").addClass("show panel-danger");
										$(".fa-cog").removeClass("fa-spin text-success");
										scroll_div("mensaje3");
										console.log(XMLHttpRequest.responseJSON.mensaje);
										console.log(XMLHttpRequest.responseJSON.respuesta_soap);
									}
								}
							}
						}
					});
            }
            next(i,array);
            /*if(err[0].length > 0){
            	alert("Array mayor a cero");
            } else {
            	alert("No hay errores");
            }
            $('#id_error3').bootstrapTable({
		        data: err[0]
		    });*/
	      	console.log("Total de registros:"+fila);
			console.log("Se ha cargado toda la información.");
	      }
	    });
	}

	$("#cargar3").click(function(){
		if (file=="") {
			alert("No se ha seleccionado ningún archivo.");
		} else {
			parse();
		}
	});

});