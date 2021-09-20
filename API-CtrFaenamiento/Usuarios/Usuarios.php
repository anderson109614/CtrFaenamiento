<?php
ob_start();
include("../coneccion.php");
include("../Encript.php");
include("../Validacion.php");
$dbConn =  connect($db);
if ($_SERVER['REQUEST_METHOD'] == 'GET' && $auth) {
    
            
             try {
                if (isset($_GET['id'])) {
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
                    WHERE  us.IdPerfil=pe.IdPerfil
                    AND us.Estado !=?
                    AND IdUsuario=?
                    ";
                    $decri= decrypt($_GET['id']);
                    $obj= json_decode($decri, true);
                    $params = array('Eliminado',$obj);
                    $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
                    $stmt = sqlsrv_query( $dbConn, $sql , $params, $options );
                    $row_count = sqlsrv_num_rows( $stmt );
         
                    $pila=array();
                    
                    
                    //$res['estado']=$row_count;
                    if ($row_count === false || $row_count==0){
                         $res['estado']=false;
                         $res['mensaje']=sqlsrv_errors();
                         $res['res']=$obj;
                    }else{
                        while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)) {
                            $row['Permisos']=getPermisos($row['IdPerfil'],$dbConn);
                            array_push($pila, $row);
                        }
        
                        $res['res']= encrypt($pila,false);
                    }
                    header("HTTP/1.1 200 OK");
                    sqlsrv_close($dbConn);        
                    echo json_encode($res);
                
            
                }else{
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
                    WHERE  us.IdPerfil=pe.IdPerfil
                    AND us.Estado !=?
                   ";
                    
                    $params = array('Eliminado');
                    $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
                    $stmt = sqlsrv_query( $dbConn, $sql , $params, $options );
                    $row_count = sqlsrv_num_rows( $stmt );
         
                    $pila=array();
                    
                    
                    //$res['estado']=$row_count;
                    if ($row_count === false || $row_count==0){
                         $res['estado']=false;
                         $res['mensaje']=sqlsrv_errors();
                         $res['res']=$obj;
                    }else{
                        while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)) {
                            $row['Imagen']=OptenerImagen($row['Imagen']);
                            array_push($pila, $row);
                        }
        
                        $res['res']= encrypt($pila,false);
                    }
                    header("HTTP/1.1 200 OK");
                    sqlsrv_close($dbConn);        
                    echo json_encode($res);
        
                }  
            } catch (Exception $e) {
                $res['estado']=false;
                $res['mensaje']=$e->getMessage();
                echo json_encode($res);
            }
            
}
function OptenerImagen($name){
    $rutaImagen ="";
    if($name!=""){
        $rutaImagen = __DIR__ . "/images/".$name;
        
    }else{
        $rutaImagen = __DIR__ . "/images/user.jpg";
    }
    $contenidoBinario = file_get_contents($rutaImagen);
    $imagenComoBase64 = base64_encode($contenidoBinario);
    return 'data:image/jpg;base64,'.$imagenComoBase64;
    

}
if ($_SERVER['REQUEST_METHOD'] == 'POST' && $auth) {
    
    try {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $decri= decrypt($input['value']);
        $obj= json_decode($decri, false);
        
        $sql = "INSERT INTO Usuarios
        (Cedula
        ,Nombres
        ,Apellidos
        ,FechaCreacion
        ,Estado
        ,IdPerfil
        )
  VALUES
        (?
        ,?
        ,?
        ,getdate()
        ,'Activo'
        ,?
        );
        SELECT SCOPE_IDENTITY() AS id;";
        //$res['res']=$decri; 
        $params = array($obj->Cedula,
                        $obj->Nombres,
                        $obj->Apellidos, 
                        $obj->IdPerfil,
                        
                    );

        $stmt = sqlsrv_query( $dbConn, $sql , $params );

           
        if (!$stmt){
             $res['estado']=false;
             $res['mensaje']=sqlsrv_errors();              
            $res['res']= json_encode($obj);
        }else{
           
            sqlsrv_next_result($stmt);
            sqlsrv_fetch($stmt);
            $id=sqlsrv_get_field($stmt, 0);
            actualizarImagen($obj->img,$dbConn,$id);
            actualizarContraseña($obj->Contrasena,$dbConn,$id);
            
        }
        header("HTTP/1.1 200 OK");
        sqlsrv_close($dbConn);        
        echo json_encode($res);



        
    } catch (Exception $e) {
        $res['estado']=false;
        $res['mensaje']=$e->getMessage();
        echo json_encode($res);
    }


}

if ($_SERVER['REQUEST_METHOD'] == 'PUT' && $auth) {
    
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
       ,IdPerfil  = ?
       
  WHERE IdUsuario= ?";
           
    $params = array($usr->Cedula,$usr->Nombres,$usr->Apellidos,$usr->IdPerfil,$usr->IdUsuario,);
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
if ($_SERVER['REQUEST_METHOD'] == 'DELETE' && $auth) {
    
    try {
        if (isset($_GET['id'])) {
            $sql = "UPDATE Usuarios
            SET Estado = 'Eliminado'             
          
            WHERE IdUsuario=?";
            $decri= decrypt($_GET['id']);
            $obj= json_decode($decri, true);
            $params = array($obj);
            $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
            $stmt = sqlsrv_query( $dbConn, $sql , $params, $options );
            
 
            $pila=array();
            
            
            //$res['estado']=$row_count;
            if ($stmt){
                 $res['estado']=true;
                 $res['mensaje']='Usuario Eliminado';
                
            }else{
                $res['estado']=false;
                $res['mensaje']=sqlsrv_errors();
               
            }
            
        
    
        }else{
            
                 $res['estado']=false;
                 $res['mensaje']='Informacion Incompleta';
                 $res['res']='';
           

        } 
        sqlsrv_close($dbConn);  

        header("HTTP/1.1 200 OK");
        echo json_encode($res);
        
    } catch (Exception $e) {
        $res['estado']=false;
        $res['mensaje']=$e->getMessage();
        echo json_encode($res);
    }

}

header('Content-type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
ob_end_flush();
?>