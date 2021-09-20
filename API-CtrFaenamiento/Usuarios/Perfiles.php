<?php
ob_start();
include("../coneccion.php");
include("../Encript.php");
include("../Validacion.php");
$dbConn =  connect($db);
if ($_SERVER['REQUEST_METHOD'] == 'GET' && $auth) {
    try {
        if (isset($_GET['id'])) {
            $sql = "SELECT IdPerfil
            ,Nombre
            FROM Perfiles
            WHERE IdPerfil =?";
            $decri= decrypt($_GET['id']);
            $obj= json_decode($decri, true);
            $params = array($obj);
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
            $sql = "SELECT IdPerfil
            ,Nombre
            FROM Perfiles
           ";
            
            $params = [];
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

        }  
    } catch (Exception $e) {
        $res['estado']=false;
        $res['mensaje']=$e->getMessage();
        echo json_encode($res);
    }



}

function getPermisos($id,$dbConn){
    $sql = "SELECT ru.Nombre
    FROM Permisos per, Ruta ru
    WHERE per.IdRuta=ru.Id
    and per.IdPerfil=?";
            
            $params = array($id);
            $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
            $stmt = sqlsrv_query( $dbConn, $sql , $params, $options );
            $row_count = sqlsrv_num_rows( $stmt );
 
            $pila=array();
            
            
            //$res['estado']=$row_count;
            if ($row_count === false || $row_count==0){
                 //$res['estado']=false;
                 //$res['mensaje']=sqlsrv_errors();
                 
            }else{
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)) {
                    array_push($pila, $row);
                }
                
            }
            return $pila;
}
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    try {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $decri= decrypt($input['value']);
        $obj= json_decode($decri, false);
        //$res['mensaje']=$obj;
        if(ValiparPermisos($obj,$dbConn)){
            $res['estado']=true;
            $res['mensaje']='Permisos de acceso a '.$obj->Nombre;
           

           
        }else{
            $res['estado']=false;
            $res['mensaje']='No se permite acceso a '.$obj->Nombre;
        }



        header("HTTP/1.1 200 OK");
        echo json_encode($res);
        
    } catch (Exception $e) {
        $res['estado']=false;
        $res['mensaje']=$e->getMessage();
        echo json_encode($res);
    }

}
function ValiparPermisos($obj,$dbConn){
    try{
    $sql = "SELECT ru.Nombre
    FROM Permisos per, Ruta ru
    WHERE per.IdRuta=ru.Id
    and per.IdPerfil=?
    and ru.Nombre=?";
           
    $params = array($obj->idPerfil,$obj->Nombre,);
    $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
    $stmt = sqlsrv_query( $dbConn, $sql , $params,$options );
    $row_count = sqlsrv_num_rows( $stmt );
       // echo $row_count;
            if ($row_count === false || $row_count==0){
                 return false;
            }else{
                return true;
            }
    } catch (Exception $e) {
        
        return false;
    }
}

header('Content-type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
ob_end_flush();
?>