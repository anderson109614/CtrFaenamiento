<?php
ob_start();
include("../coneccion.php");
include("../Encript.php");
include("../Validacion.php");
$dbConn =  connect($db);
if ($_SERVER['REQUEST_METHOD'] == 'GET' && $auth) {
    try {
        //if (isset($_GET['nom'])) {
            $sql = "SELECT us.IdUsuario
            ,us.Cedula
            ,us.Nombres
            ,us.Apellidos
            ,us.Imagen
            ,us.FechaCreacion
            ,us.Estado
            ,us.IdPerfil
            ,pe.Nombre as NombrePerfil
            FROM Usuarios us,Perfiles pe
            WHERE  us.IdPerfil=pe.IdPerfil";
            $params = array();
            $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
            $stmt = sqlsrv_query( $dbConn, $sql , $params, $options );
            $row_count = sqlsrv_num_rows( $stmt );
 
            $pila=array();
        if ($row_count === false)
            echo 'Excepción capturada: ',  'Error al obtener datos.', "\n"; 
        else
            
            while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)) {
                array_push($pila, $row);
            }
            

        

    sqlsrv_close($dbConn);

    header("HTTP/1.1 200 OK");
    $res= array( 'data'=>encrypt($pila,false));
    echo json_encode($res);

           // echo json_encode($sql->fetchAll()); 'estado' => $estado,'mensaje'=>$mensaje,
	    
	
        //}  
    } catch (Exception $e) {
        echo 'Excepción capturada: ',  $e->getMessage(), "\n";
    }
}


if ($_SERVER['REQUEST_METHOD'] == 'POST' && $auth) {
    
    try {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $decri= decrypt($input['value']);
        $obj= json_decode($decri, false);
        
        if(actualizarInfomacion($obj,$dbConn)){
            $res['estado']=true;
            $res['mensaje']='Usuario Actualisado correctamente';
            if(!actualizarImagen($obj->img,$dbConn,$obj->IdUsuario)){
                $res['mensaje']='Imagen no actualizada';
            }
            if(!actualizarContraseña($obj->Contrasena,$dbConn,$obj->IdUsuario)){
                $res['mensaje']='Contraseña no actualizada';
            }


           
        }else{
            $res['estado']=false;
            $res['mensaje']='Error al actualizar informacion';
        }



        header("HTTP/1.1 200 OK");
        echo json_encode($res);
        
    } catch (Exception $e) {
        $res['estado']=false;
        $res['mensaje']=$e->getMessage();
        echo json_encode($res);
    }

}
function actualizarInfomacion($usr,$dbConn){
    try{
    $sql = "UPDATE Usuarios
    SET Cedula = ?
       ,Nombres = ?
       ,Apellidos = ? 
       
  WHERE IdUsuario= ?";
           
    $params = array($usr->Cedula,$usr->Nombres,$usr->Apellidos,$usr->IdUsuario,);
    $stmt = sqlsrv_query( $dbConn, $sql , $params );
        if($stmt){
            return true;
        }else{
            return false;
        }
    } catch (Exception $e) {
        return false;
    }
}
function actualizarImagen($img,$dbConn,$IdUsuario){
    try{
    if(strlen($img)>0){
        $sql = "UPDATE Usuarios
        SET Imagen = ?
           
      WHERE IdUsuario= ?";
        $nom=guardarImg($img,$IdUsuario);
        $params = array($nom,$IdUsuario);
        $stmt = sqlsrv_query( $dbConn, $sql , $params );
            if($stmt){
                return true;
            }else{
                return false;
            }
    }else{
        return true;
    }

    
    } catch (Exception $e) {
        return false;
    }
}
function actualizarContraseña($pass,$dbConn,$IdUsuario){
    try{
        if(strlen($pass)>0){
            $sql = "UPDATE Usuarios
            SET Contrasena = ?
               
          WHERE IdUsuario= ?";
            
            $params = array(md5($pass),$IdUsuario);
            $stmt = sqlsrv_query( $dbConn, $sql , $params );
                if($stmt){
                    return true;
                }else{
                    return false;
                }
        }else{
            return true;
        }
    
        
        } catch (Exception $e) {
            return false;
        }
}
function guardarImg($img,$IdUsuario){
    $base_to_php = explode(',', $img);
    $data = base64_decode($base_to_php[1]);

    $nomImg=$IdUsuario."-".date("Y")."-".date("m")."-".date("d")."-".date("G")."-".date("i").".jpg";
    
    $filepath = __DIR__ . "/images/".$nomImg;  
    file_put_contents($filepath, $data);
    return $nomImg;
}

header('Content-type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
ob_end_flush();
?>