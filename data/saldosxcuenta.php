<?php //_x003A_B3
    ini_set('max_execution_time',0);
    header("Access-Control-Allow-Origin: *");
    header('Content-type: application/json');
    require_once('lib/nusoap.php');
    $wsdl="http://200.38.16.187:203/ws_publicos/Service.asmx?wsdl";

    try {
        $client = new SoapClient($wsdl,array(
        'exceptions' => true,
    ));

    } catch ( SoapFault $e ) { 
          echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'El web service no esta disponible','respuesta_soap'=>'El web service no esta disponible']);
        die();
    }

    $client=new nusoap_client($wsdl,'wsdl');
    $arg_codseg = $_POST['arg_codseg'];
    $arg_pobcta = $_POST['arg_pobcta'];
    $arg_gpocta = $_POST['arg_gpocta'];
    $arg_folcta = $_POST['arg_folcta'];
    $arg_subcta = $_POST['arg_subcta'];

    $param=array('arg_codseg'=>$arg_codseg, 'arg_pobcta' =>(string)$arg_pobcta,'arg_gpocta' =>(string)$arg_gpocta,'arg_folcta' =>(string)$arg_folcta,'arg_subcta' =>(string)$arg_subcta);
    $resultado = $client->call('cobext_saldosxcta', $param);
    //print_r($resultado);
    if ($resultado['cobext_saldosxctaResult'] == null || $resultado['cobext_saldosxctaResult'] == "null" || $resultado['cobext_saldosxctaResult'] == ""){
        /**Error desconocido del web service**/
               echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'Error desconocido del web service','respuesta_soap'=>'Error desconocido']);
         }else{
            //print_r($resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table']['MENSAJE']);
             if ($resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table']['MENSAJE'] == "Exito"){
                /**Éxito**/
                /*----------------Código agregado para la simulación del json: (Agrega los teléfonos)--------------*/
                   $tel1=array();
                    $res=array();
                    $res=$resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table'];
                    $tel1=$resultado['cobext_saldosxctaResult']['schema']['element']['complexType']['choice']['element']['complexType']['sequence']['element'][11]['!msprop:OraDbType']; //Obtiene tel1
                    $tel2=$resultado['cobext_saldosxctaResult']['schema']['element']['complexType']['choice']['element']['complexType']['sequence']['element'][12]['!msprop:OraDbType']; //Obtiene tel2
                    $res['TEL4']=$tel1;
                    $res['TEL3']=$tel2;
                    //print_r($res);
                    //array_push($res,$tel1); //Los agrega al resultado
                    //array_push($res,$tel2); //Los agrega al resultado
                    //print_r($res);
                /*---------------------------------Fin del código agregado.----------------------------------------*/
                //Código anterior, no borrar: //echo json_encode(['codigo' => http_response_code(201),'mensaje'=>'Registro insertado correctamente','respuesta_soap'=>$resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table']]);
                echo json_encode(['codigo' => http_response_code(201),'mensaje'=>'Registro insertado correctamente','respuesta_soap'=>$res]);
             }else if($resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table']['MENSAJE'] !='Exito'){
                /**Cae en algún error:**/
                if($resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table']['MENSAJE'] =='La Cuenta No Existe'){
                     /**La cuenta no existe**/
                   echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'Revise el número de cuenta o el formato del archivo.','respuesta_soap'=>$resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table']['MENSAJE']]);
                }else if ($resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table']['MENSAJE'] =='Codigo de Seguridad Invalido') {
                    /**Código de seguridad inválido**/
                    echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'Revise el código de seguridad de su archivo.','respuesta_soap'=>$resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table']['MENSAJE']]);
                } else {
                    /**Error ??**/
                    echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'ERROR','respuesta_soap'=>$resultado['cobext_saldosxctaResult']['diffgram']['NewDataSet']['Table']['MENSAJE']]);
                }
            } 
    }
?>