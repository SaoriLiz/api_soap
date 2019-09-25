$(document).ready(function(){
	console.log("js en gestiones.js");
	$("#panel_principal_1 .panel-heading").html("CESPM <i class='fa fa-cog fa-fw'></i> Gestiones");

	window.registro_fail=0; 
	window.file="";
	var data;
	var longitud=0;
	var arg_codseg="";
	var arg_pobcta=""; 
	var arg_gpocta=""; 
	var arg_folcta=""; 
	var arg_subcta="";
	var arg_alta="";
	var arg_tipoaccion="";
	var arg_obs="";
	var arg_archivo="";
	var file="";
	var errores_count=0;
	var err_array = new Array(); //error, almacena las cuentas no cargadas
	var err= new Object(); //error, declara la cuenta en el momento
	err[0] = new Array(); //error, almacena las cuentas no cargadas

	$("input[name='archivo1']").change(handleFileSelect);

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
        var mensaje="";
        var flag=0;

		Papa.parse(file, {
	      header: true,
	      keepEmptyRows:false,
		  skipEmptyLines: true,
	      errors: function(error, file) {
				console.log("Parsing error:", error, file);
				$("#mensaje").append("<br>ERROR:"+error+"<br>"+file);
		  },
	      complete: function(results) {
	      	$("#mensaje").removeClass("hide");
			$("#mensaje").addClass("show");
			$(".fa-cog").addClass("fa-spin text-success");
			console.log("Cargando datos...");
	      	data = results;
            longitud=data.data.length;
            var array = $.map(data.data, function(value, index) {
			    return [value];
			});
			var i=0;

            function next(i,array){
            		var index=i;
        			arg_codseg=array[index].arg_codseg;
                    arg_pobcta=array[index].arg_pobcta;
                    arg_gpocta=array[index].arg_gpocta;
                    arg_folcta=array[index].arg_folcta;
                    arg_subcta=array[index].arg_subcta;
                    arg_alta=array[index].arg_alta;
                    arg_tipoaccion=array[index].arg_tipoaccion;
                    arg_obs=array[index].arg_obs;
                    arg_archivo=array[index].arg_archivo;
                    $.ajax({
				      url: 'data/gestiones.php',
				      type: 'POST',
				      data: {arg_codseg:arg_codseg,arg_pobcta:arg_pobcta, arg_gpocta:arg_gpocta,arg_folcta:arg_folcta,arg_subcta:arg_subcta,arg_alta:arg_alta,arg_tipoaccion:arg_tipoaccion,arg_obs:arg_obs,arg_archivo:arg_archivo},
				      success: function(data){
				      	i++;
				       	console.log("Fila #"+i+": procesada. |"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+","+arg_tipoaccion+","+arg_obs+","+arg_archivo+"|");
				      	$("#mensaje").append("<label><br><strong>Fila #"+i+":procesada</strong>  |"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+","+arg_tipoaccion+","+arg_obs+","+arg_archivo+"|</label>");
				      	 scroll_div("mensaje");
				      	if (i<longitud&&registro_fail==0) {
				      		next(i,array);
				      	} else if(i>=longitud){
				      		if(err[0].length > 0){
								    $("#panel_errores").removeClass("hide");
									$("#panel_errores").addClass("show");
									$('#errores').click(function(){
									    download_CSV(err[0],"cuentas_no_cargadas",".xls");
									    download_CSV(err[0],"cuentas_no_cargadas",".txt");
									    //download_CSV(err[0],"cuentas_no_cargadas",".csv");
						  			});
								    console.log("Errores:");
								    console.log(err[0]);
								    alert("Revise los registros que no se cargaron");
								    $("#mensaje").append("<br><label class='text-warning'>**********************************************************************************************************************************************************************</label>");
									$("#mensaje").append("<br><strong><i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'></i> Revise los registros que no se cargaron.</strong><br><strong>Total de registros:"+(longitud)+"</strong>"+"<br><strong>Total de registros cargados:"+(longitud-errores_count)+"</strong>");
									$("#estatus").removeClass("hide panel-info panel-success");
									$("#estatus").addClass("show panel-warning");
									$("#estatus label").html("<i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'> Se han cargado "+(i-errores_count)+" registros.");
									$("#estatus .panel-heading").html("Registros <i class='fa fa-exclamation-triangle' aria-hidden='true'></i>");
									$(".fa-cog").removeClass("fa-spin");  
							} else {
					      		$("#mensaje").append("<br><label class='text-success'>**********************************************************************************************************************************************************************</label>");
								$("#mensaje").append("<br><strong><i class='fa fa-check-circle-o text-success' aria-hidden='true'></i> Se ha cargado toda la información</strong><br><strong>Total de registros:"+longitud+"</strong>");
								$("#estatus").removeClass("hide");
								$("#estatus").addClass("show");
								$("#estatus label").html("<i class='fa fa-check-circle-o text-success' aria-hidden='true'> Se han cargado "+i+" registros.");
								$("#estatus .panel-heading").html("Registros <i class='fa fa-list-alt' aria-hidden='true'></i>");
								$(".fa-cog").removeClass("fa-spin");
								scroll_div("mensaje");
							} 
				      	} 
				      },
				      error: function(XMLHttpRequest, textStatus, errorThrown) {
					    registro_fail=i;
					    var x= registro_fail+1;
				      	if (XMLHttpRequest.responseJSON.respuesta_soap=='Error desconocido') {
				      			console.log("Reprocesando valor... fila:"+i);
				      			$("#mensaje").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i> Registro#:"+x+"|"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+","+arg_tipoaccion+","+arg_obs+","+arg_archivo+"|</label>");
				      			$("#mensaje").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.mensaje+"</label>");
								$("#mensaje").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.respuesta_soap+"</label>");
								$("#mensaje").append("<br><label style='background-color: #ff3f00;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>Reprocesando valor...</label><br>");
								scroll_div("mensaje");
								console.log(XMLHttpRequest.responseJSON.mensaje);
								console.log(XMLHttpRequest.responseJSON.respuesta_soap);
								console.log(textStatus);
								console.log(errorThrown);
				      			registro_fail=0;
								next(i,array);
				      	} else if(XMLHttpRequest.responseJSON.respuesta_soap=='La cuenta No Existe'){ //Si la cuenta no existe, salta a la otra cuenta :)
								err_array = 
										[
										    {
										        "arg_codseg": arg_codseg,
										        "arg_pobcta": arg_pobcta,
										        "arg_gpocta": arg_gpocta,
										        "arg_folcta": arg_folcta,
										        "arg_subcta": arg_subcta,
										        "arg_alta": arg_alta,
										        "arg_tipoaccion": arg_tipoaccion,
										        "arg_obs": arg_obs,
										        "arg_archivo": arg_archivo,
										        "error": XMLHttpRequest.responseJSON.respuesta_soap
										    }
										];
								err[0].push(
								    err_array[0]
								);

								$("#mensaje").append("<label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i> Registro#:"+x+"|"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+"|</label>");
					      		$("#mensaje").append("<br><label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.mensaje+"</label>");
								$("#mensaje").append("<br><label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.respuesta_soap+"</label><br>");
								
								scroll_div("mensaje");
								console.log(XMLHttpRequest.responseJSON.mensaje);
								console.log(XMLHttpRequest.responseJSON.respuesta_soap);
								registro_fail=0;
								i++;
								errores_count++;
								if (i<longitud&&registro_fail==0) {
								    next(i,array);
								} else if(i>=longitud){
									if(err[0].length > 0){ //Formato final si hay errores:
											    $('#errores').click(function(){
												    download_CSV(err[0],"cuentas_no_cargadas",".xls");
												    download_CSV(err[0],"cuentas_no_cargadas",".txt");
												    //download_CSV(err[0],"cuentas_no_cargadas",".csv");
									  			});
											    $("#panel_errores").removeClass("hide");
												$("#panel_errores").addClass("show");
											    console.log("Errores:");
											    console.log(err[0]);
											    alert("Revise los registros que no se cargaron");
											    $("#mensaje").append("<br><label class='text-warning'>**********************************************************************************************************************************************************************</label>");
												$("#mensaje").append("<br><strong><i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'></i> Revise los registros que no se cargaron.</strong><br><strong>Total de registros:"+(longitud)+"</strong>"+"<br><strong>Total de registros cargados:"+(i-errores_count)+"</strong>");
												$("#estatus").removeClass("hide panel-info panel-success");
												$("#estatus").addClass("show panel-warning");
												$("#estatus label").html("<i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'> Se han cargado "+(longitud-errores_count)+" registros.");
												$("#estatus .panel-heading").html("Registros <i class='fa fa-exclamation-triangle' aria-hidden='true'></i>");
												$(".fa-cog").removeClass("fa-spin");    
												$("#descargar_error").click(function(){
													$('#id_error').tableExport({type:'csv'});
												})
								            } else {
								            	//---Formato de final si no hay errores:
												$("#mensaje").append("<br><label class='text-success'>**********************************************************************************************************************************************************************</label>");
												$("#mensaje").append("<br><strong><i class='fa fa-check-circle-o text-success' aria-hidden='true'></i> Se ha cargado toda la información</strong><br><strong>Total de registros:"+longitud+"</strong>");
												$("#estatus").removeClass("hide");
												$("#estatus").addClass("show");
												$("#estatus label").html("<i class='fa fa-check-circle-o text-success' aria-hidden='true'> Se han cargado "+i+" registros.");
												$("#estatus .panel-heading").html("Registros <i class='fa fa-list-alt' aria-hidden='true'></i>");
												$(".fa-cog").removeClass("fa-spin");
												scroll_div("mensaje");
								            }
								}
				      	} else {
				      			err_array = 
										[
										    {
										        "arg_codseg": arg_codseg,
										        "arg_pobcta": arg_pobcta,
										        "arg_gpocta": arg_gpocta,
										        "arg_folcta": arg_folcta,
										        "arg_subcta": arg_subcta,
										        "arg_alta": arg_alta,
										        "arg_tipoaccion": arg_tipoaccion,
										        "arg_obs": arg_obs,
										        "arg_archivo": arg_archivo,
										        "error": XMLHttpRequest.responseJSON.respuesta_soap
										    }
										];
								err[0].push(
								    err_array[0]
								);

								$("#mensaje").append("<label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i> Registro#:"+x+"|"+arg_codseg+","+arg_pobcta+","+arg_gpocta+","+arg_folcta+","+arg_subcta+"|</label>");
					      		$("#mensaje").append("<br><label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.mensaje+"</label>");
								$("#mensaje").append("<br><label style='background-color: darkred;color:white'><i class='fa fa-times-circle-o' aria-hidden='true'></i>"+XMLHttpRequest.responseJSON.respuesta_soap+"</label><br>");
								
								scroll_div("mensaje");
								console.log(XMLHttpRequest.responseJSON.mensaje);
								console.log(XMLHttpRequest.responseJSON.respuesta_soap);
								registro_fail=0;
								i++;
								errores_count++;
								if (i<longitud&&registro_fail==0) {
								    next(i,array);
								} else if(i>=longitud){
									if(err[0].length > 0){ //Formato final si hay errores:
									    $('#errores').click(function(){
										    download_CSV(err[0],"cuentas_no_cargadas",".xls");
										    download_CSV(err[0],"cuentas_no_cargadas",".txt");
										    //download_CSV(err[0],"cuentas_no_cargadas",".csv");
							  			});
									    $("#panel_errores").removeClass("hide");
										$("#panel_errores").addClass("show");
									    console.log("Errores:");
									    console.log(err[0]);
									    alert("Revise los registros que no se cargaron");
									    $("#mensaje").append("<br><label class='text-warning'>**********************************************************************************************************************************************************************</label>");
										$("#mensaje").append("<br><strong><i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'></i> Revise los registros que no se cargaron.</strong><br><strong>Total de registros:"+(longitud)+"</strong>"+"<br><strong>Total de registros cargados:"+(i-errores_count)+"</strong>");
										$("#estatus").removeClass("hide panel-info panel-success");
										$("#estatus").addClass("show panel-warning");
										$("#estatus label").html("<i class='fa fa-exclamation-triangle text-warning' aria-hidden='true'> Se han cargado "+(i-errores_count)+" registros.");
										$("#estatus .panel-heading").html("Registros <i class='fa fa-exclamation-triangle' aria-hidden='true'></i>");
										$(".fa-cog").removeClass("fa-spin");    
										$("#descargar_error").click(function(){
											$('#id_error').tableExport({type:'csv'});
										})
						            } else {
						            	//---Formato de final si no hay errores:
										$("#mensaje").append("<br><label class='text-success'>**********************************************************************************************************************************************************************</label>");
										$("#mensaje").append("<br><strong><i class='fa fa-check-circle-o text-success' aria-hidden='true'></i> Se ha cargado toda la información</strong><br><strong>Total de registros:"+longitud+"</strong>");
										$("#estatus").removeClass("hide");
										$("#estatus").addClass("show");
										$("#estatus label").html("<i class='fa fa-check-circle-o text-success' aria-hidden='true'> Se han cargado "+i+" registros.");
										$("#estatus .panel-heading").html("Registros <i class='fa fa-list-alt' aria-hidden='true'></i>");
										$(".fa-cog").removeClass("fa-spin");
										scroll_div("mensaje");
										console.log(XMLHttpRequest.responseJSON.mensaje);
										console.log(XMLHttpRequest.responseJSON.respuesta_soap);
										console.log(textStatus);
										console.log(errorThrown);
						            }
						        }
				      	}
					  }
        			});
            }
            next(i,array);
	      	console.log("Total de registros:"+fila);
			console.log("Se ha cargado toda la información.");
	      }
	    });
	}

	$("#cargar").click(function(){
		if (file=="") {
			alert("No se ha seleccionado ningún archivo.");
		} else {
			parse();
		}
	});

});