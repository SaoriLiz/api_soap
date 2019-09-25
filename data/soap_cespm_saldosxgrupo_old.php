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
    var_dump("conectado!");
    $client=new nusoap_client($wsdl,'wsdl');
    //Variables a asignar a los parametros de entrada de web service.

    //die($_POST['arg_codseg'].' '.$_POST['arg_pobcta'].' '.$_POST['arg_gpocta'].' '.$_POST['arg_folcta'].' '.$_POST['arg_subcta']);
    $arg_codseg = $_POST['arg_codseg'];
    $arg_gpoini = $_POST['arg_gpoini'];
    //$arg_archivo =  $_POST['arg_archivo'];
    
    //Pasamos la informacion de las variables asignadas a los parametros de entrada del servicio web.
    //$param=array('arg_codseg'=>$arg_codseg, 'arg_gpoini' =>(string)$arg_gpoini);
    $param=array('arg_codseg'=>'CESPMCOBEXT03102018', 'arg_gpoini' =>'765');
        //llamando al método y pasándole el array con los parámetros
	     $resultado = $client->call('cobext_saldosxgrupo', $param);
        //Se verifica si hay un error en el proceso del guardado de datos y si lo hay matamos el proceso con la funcion die().
        //Verifica si cada registro es exitoso, si encuentra alguno que no,manda mensaje de error.
          /*if ($resultado['cobext_saldosxgrupoResult'] == null || $resultado['cobext_saldosxgrupoResult'] == "null" || $resultado['cobext_saldosxgrupoResult'] == ""){
                   echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'Error desconocido del web service','respuesta_soap'=>'Error desconocido']);
                       //die();
             }
             else{*/
                if ($resultado['cobext_saldosxgrupoResult']=='Código de Seguridad Invalido') {
                        echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'Código de seguridad inválido','respuesta_soap'=>$resultado['cobext_saldosxgrupoResult']]);
                } /*else if ($resultado['cobext_saldosxgrupoResult'] != "conectado!"){ //Exito

                 	   echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'Error en la insercion del registro,revise su archivo y vuelva a cargarlo','respuesta_soap'=>$resultado['cobext_saldosxgrupoResult']]); //$resultado['cobext_saldosxgrupoResult']
                 	       //die();
                 //}*/
                 else{
                   /* echo "valor proximo:";
                    echo $resultado['cobext_saldosxgrupoResult']; 
                    echo "lo intento:";
                    echo $resultado['cobext_saldosxgrupoResult']['mensaje'];
                    echo "---";
                    echo count($resultado['cobext_saldosxgrupoResult']);
                    echo "aaaaaaaaaaaaaaa";
                    //print_r($resultado['cobext_saldosxgrupoResult']['diffgram']['NewDataSet']['Table']);
                    $array= $resultado['cobext_saldosxgrupoResult'];
                    foreach ($resultado['cobext_saldosxgrupoResult']['diffgram']['NewDataSet']['Table'] as $value) {
                        //print_r($value);
                        foreach ($value as $valor =>$llave) {
                            print_r($valor);
                            print_r($llave);
                        }
                    }*/
                    /*foreach ($resultado['cobext_saldosxgrupoResult'] as $value=>$key) {
                        print_r($value);
                        echo "----";
                        //print_r($key);
                        foreach ($key as $valor=>$llave) {
                          //  print_r($valor);
                          //  print_r($llave);
                        }

                    }*/


                    /*for ($i = 0; $i <=count($array); $i++) {
                        echo $array[$i];
                    }*/
                    //print_r($resultado['cobext_saldosxgrupoResult']);
                  //Si se cargo con exito Muestra el resultado.
                   // echo $resultado['cobext_saldosxgrupoResult'];
			      echo json_encode(['codigo' => http_response_code(202),'mensaje'=>'Registro insertado correctamente','respuesta_soap'=>$resultado['cobext_saldosxgrupoResult']['diffgram']['NewDataSet']['Table']],JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); //$resultado['cobext_saldosxgrupoResult'] 'respuesta_soap'=>$resultado['cobext_saldosxgrupoResult']
			    }
    //}
?>