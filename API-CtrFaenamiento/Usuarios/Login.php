<?php
ob_start();

include("../coneccion.php");
$dbConn =  connect($db);
include("../Encript.php");
/*
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
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
    $res= array( 'estado' => true, 'mensaje' => 'Proceso exitoso','res'=> encrypt($pila,false));
    echo json_encode($res);

           // echo json_encode($sql->fetchAll());
	    
	
        //}  
    } catch (Exception $e) {
        echo 'Excepción capturada: ',  $e->getMessage(), "\n";
    }
}
*/

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    try {
        //$input = $_POST;
            $input = (array) json_decode(file_get_contents('php://input'), TRUE);
            //echo  $_POST;
            $decri= decrypt($input['value']);
            $obj= json_decode($decri, false);
            
            
          
            $clave = md5( $obj->password );
            
            $sql = "SELECT us.IdUsuario
            ,us.Cedula
            ,us.Nombres
            ,us.Apellidos
            ,us.Imagen
            ,us.FechaCreacion
            ,us.Estado
            ,us.IdPerfil
            ,pe.Nombre as NombrePerfil
            ,'0' as token
            FROM Usuarios us,Perfiles pe
            WHERE  us.IdPerfil=pe.IdPerfil
            AND us.Cedula=?
            AND us.Contrasena=?";
            //echo json_encode($obj);
            $params = array($obj->user,$clave);
            $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
            $stmt = sqlsrv_query( $dbConn, $sql , $params, $options );
            $row_count = sqlsrv_num_rows( $stmt );
 
            $pila=array();

            $user='';
            $mensaje='';
            $estado=false;
            //$jwt='';
            if ($row_count === false){
            //echo 'Excepción capturada: ',  'Error al obtener datos.', "\n"; 
                $mensaje="Error al obtener datos";
            
            }else{
                if($row_count === 0){
                    $mensaje="Usuario o contraseña incorrectos";
                }else{
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)) {
                    if($row['Estado']=="Activo"){
                        $time = time();
                        $dat= date("Y-m-d H:i:s", $time);
                        $jwt=jwtCreate($row['IdUsuario'],$dat); 
                        $row['token']=$jwt;
                        $row['Imagen']=OptenerImagen($row['Imagen']);
                        array_push($pila, $row);
                       if(actualizarIngreso($dbConn,$row['IdUsuario'],$dat)){
                        $estado=true;
                       }  
                        
                    }else{
                     $mensaje="Usuario bloqueado o eliminado";
                    }
                
            
                }
                 }

            }

            sqlsrv_close($dbConn);


          
            

            $res= array( 'estado' => $estado,'mensaje'=>$mensaje,'user'=>encrypt($pila,false));

            header("HTTP/1.1 200 OK");
           // echo json_encode($arr[0]); 
            //echo json_encode($sql->fetchAll());     
            echo json_encode($res); 
        
       
        
    } catch (Exception $e) {
        //echo 'Excepción capturada: ',  $e->getMessage(), "\n";
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
function actualizarIngreso($dbConn,$idUsuario,$time){
try {
            $sql = "UPDATE Usuarios SET ultimoingreso='".$time."' WHERE IdUsuario=?";
            //echo json_encode($obj);
            $params = array($idUsuario);
            //$options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
            $stmt = sqlsrv_query( $dbConn, $sql , $params );
            if($stmt){
                return true;
            }else{
                return false;
            }



} catch (\Throwable $th) {
    //throw $th;
    return false;
}
}
//header("HTTP/1.1 400 Bad Request");
header('Content-type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
ob_end_flush();
?>