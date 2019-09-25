<?php 
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
    var_dump("conectado!");
    $client=new nusoap_client($wsdl,'wsdl');
    $arg_codseg = $_POST['arg_codseg'];
    $arg_gpoini = $_POST['arg_gpoini'];
    $param=array('arg_codseg'=>$arg_codseg, 'arg_gpoini' =>(string)$arg_gpoini);
	$resultado = $client->call('cobext_saldosxgrupo', $param);
    if ($resultado['cobext_saldosxgrupoResult']=='Código de Seguridad Invalido') {
            echo json_encode(['codigo' => http_response_code(500),'mensaje'=>'Código de seguridad inválido','respuesta_soap'=>$resultado['cobext_saldosxgrupoResult']]);
    } 
     else{
      echo json_encode(['codigo' => http_response_code(202),'mensaje'=>'Registro insertado correctamente','respuesta_soap'=>$resultado['cobext_saldosxgrupoResult']['diffgram']['NewDataSet']['Table']]); 
    }
?>