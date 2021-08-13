<?php

$dbConn =  connect($db);
$hed=apache_request_headers();
$auth=false;
$token='';
$res= array( 'estado' => true, 'mensaje' => '','res'=>'');
$usuario_identificacion='';

try {
   if(array_key_exists('token', $hed)){
    $token=$hed['token'];
    $auth=jwtVali($token);

   }
    
} catch (Exception $e) {
    $auth=false;
}
/*
if(!$auth){
    $res['estado']=false;
    $res['mensaje']='No autorizado';
   echo json_encode($res);
    
}else{
       
    $decodeInfo=json_decode(getInfo($token), true);
    $usuario_identificacion=$decodeInfo['usuario'];
    $ingreso=$decodeInfo['date'];
    if(verificarUsuario($dbConn,$usuario_identificacion,$ingreso)){
        $res['mensaje']=$decodeInfo;
        $res['estado']=$auth;
    }else{
        $res['mensaje']='Bloqueado';
        $res['estado']=false;
        $auth=false;
       echo json_encode($res);
    }
     
}

function verificarUsuario($Conn,$idUsr,$ingreso){
    $sql = $Conn->prepare("SELECT
            du.usuario_id,
            du.usuario_bloqueado,
            du.usuario_estado
            
        FROM
            data_usuarios du,
            maeporteador map
        WHERE
            du.usuario_bloqueado = 1 
            AND du.usuario_estado = 'activo' 
            AND du.usuario_ultimoingreso = :ingreso
            AND du.usuario_nombre = :nombre 
            and du.usuario_nombre=map.idPorteador
            ");

            // map.idPorteador as usuario_id,
            $sql->bindValue(':nombre', $idUsr);
            $sql->bindValue(':ingreso', $ingreso);
            $sql->execute();
	    	$sql->setFetchMode(PDO::FETCH_ASSOC);
            $arr = $sql->fetchAll(PDO::FETCH_ASSOC);
            if(count($arr)>0){
                return true;
            }else{
                return false;
            }

}
*/