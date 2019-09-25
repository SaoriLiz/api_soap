<?php 
	
	//Tiempo de procesamiento de script ilimitado.
	//ini_set('max_execution_time',0);

    //header('Content-Type: text/html; charset=ISO-8859-1'); 
    header('Content-type: application/json');
    require_once('lib/nusoap.php');//Libreria para consumir servicios web soap.

    
    //Subida del archivo excel al servidor.
  
    

    //url del webservice
    $wsdl="http://200.38.16.187:203/ws_publicos/Service.asmx?wsdl";

    try {

        //el servicio esta disponible;
        $client = new SoapClient($wsdl,array(
        'exceptions' => true,
    ));
    } catch ( SoapFault $e ) { 

    	//El servicio no esta disponible y matamos el proceso.
        //echo 'El web service no esta disponible';
          echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'El web service no esta disponible','respuesta_soap'=>'El web service no esta disponible']);
        die();
    }
    
    //instanciando un nuevo objeto cliente para consumir el webservice.
    $client=new nusoap_client($wsdl,'wsdl');

    //Variables a asignar a los parametros de entrada de web service.
    
    //die($_POST['arg_codseg'].' '.$_POST['arg_pobcta'].' '.$_POST['arg_gpocta'].' '.$_POST['arg_folcta'].' '.$_POST['arg_subcta']);
    $arg_codseg = $_POST['arg_codseg'];
    $arg_pobcta = $_POST['arg_pobcta'];
    $arg_gpocta = $_POST['arg_gpocta'];
    $arg_folcta = $_POST['arg_folcta'];
    $arg_subcta = $_POST['arg_subcta'];
    $fecha = DateTime::createFromFormat("d/m/Y",(string)$_POST['arg_alta']);
    $arg_alta = $fecha->format('Y-m-d\TH:i:s');
    $arg_tipoaccion = $_POST['arg_tipoaccion'];
    //$arg_obs = $_POST['arg_obs'];
    $arg_obs ="IGNORAR ESTE REGISTRO, ES DE PRUEBA.";
    $arg_archivo =  $_POST['arg_archivo'];
    
  

            

            //Pasamos la informacion de las variables asignadas a los parametros de entrada del servicio web.
	        $param=array('arg_codseg'=>$arg_codseg, 'arg_pobcta' =>(string)$arg_pobcta,'arg_gpocta' =>(string)$arg_gpocta,'arg_folcta' =>(string)$arg_folcta,'arg_subcta' =>(string)$arg_subcta,'arg_alta' => $arg_alta,'arg_tipoaccion' =>(string)$arg_tipoaccion,'arg_obs' => $arg_obs,'arg_archivo' => $arg_archivo);
                 

                 //llamando al método y pasándole el array con los parámetros
			     $resultado = $client->call('cobext_inserta_accion', $param);
                 

                 //Se verifica si hay un error en el proceso del guardado de datos y si lo hay matamos el proceso con la funcion die().
                 
	                 //Verifica si cada registro es exitoso, si encuentra alguno que no,manda mensaje de error.

                  if ($resultado['cobext_inserta_accionResult'] == null || $resultado['cobext_inserta_accionResult'] == "null" || $resultado['cobext_inserta_accionResult'] == ""){

                           echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'Error desconocido del web service','respuesta_soap'=>'Error desconocido']);
                               //die();
                     }
                     else{
    	                 

                         if ($resultado['cobext_inserta_accionResult'] != "Exito"){

    	                 	   echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'Error en la insercion del registro,revise su archivo y vuelva a cargarlo','respuesta_soap'=>$resultado['cobext_inserta_accionResult']]);
    	                 	       //die();
    	                 }
    	                 else{
                          
                          //Si se cargo con exito Muestra el resultado.
    				      echo json_encode(['codigo' => http_response_code(201),'mensaje'=>'Registro insertado correctamente','respuesta_soap'=>$resultado['cobext_inserta_accionResult']]);
    				    }
                }


				 



?>