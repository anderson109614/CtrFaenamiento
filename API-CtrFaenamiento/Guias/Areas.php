<?php
ob_start();
include("../coneccion.php");
include("../Encript.php");
include("../Validacion.php");
$dbConn =  connect($db);
if ($_SERVER['REQUEST_METHOD'] == 'GET' && $auth) {
    try {
        if (isset($_GET['cod'])) {
            $sql = "SELECT *
            FROM Areas
            WHERE Codigo=?";
            $decri= decrypt($_GET['cod']);
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
                    $row['Propietario']=getPersona($row['IdPropietario'],$dbConn);
                    array_push($pila, $row);
                }
                $res['res']= encrypt($pila,false);
            }
            header("HTTP/1.1 200 OK");
            sqlsrv_close($dbConn);        
            echo json_encode($res);
	    
	
        }else{
            $sql = "SELECT *
            FROM Areas";
            $params = array();
            $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
            $stmt = sqlsrv_query( $dbConn, $sql , $params, $options );
            $row_count = sqlsrv_num_rows( $stmt );
 
            $pila=array();
            
            
            //$res['estado']=$row_count;
            if ($row_count === false || $row_count==0){
                 $res['estado']=false;
                 $res['mensaje']='no se encontraron registros.'; 
            }else{
                while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)) {
                    $row['Propietario']=getPersona($row['IdPropietario'],$dbConn);
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

function getPersona($id,$dbConn){
    $sql = "SELECT *
            FROM Personas
            WHERE IdPersona=?";
            
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
            return $pila[0];
}
if ($_SERVER['REQUEST_METHOD'] == 'POST' && $auth) {
    
    try {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $decri= decrypt($input['value']);
        $obj= json_decode($decri, false);
       
        $sql = "INSERT INTO Areas
                (Codigo
                ,Provincia
                ,Canton
                ,Parroquia
                ,Direccion
                ,CodPredial
                ,Descripcion
                ,IdPropietario
               ) 
                VALUES
                (?
                ,?
                ,?
                ,?
                ,?
                ,?
                ,?
                ,?
                );
                SELECT SCOPE_IDENTITY() AS id;";
        //$res['res']=$decri; 
        $params = array($obj->Codigo
        ,$obj->Provincia
        ,$obj->Canton
        ,$obj->Parroquia
        ,$obj->Direccion
        ,$obj->CodPredial
        ,$obj->Descripcion
        ,$obj->IdPropietario);

        $stmt = sqlsrv_query( $dbConn, $sql , $params );

           
        if (!$stmt){
             $res['estado']=false;
             $res['mensaje']=sqlsrv_errors(); 
             
            $res['res']= json_encode($obj);
        }else{
           
            
            $res['res']= 'Actualisacion Correcta';

            
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
       
        $sql = "UPDATE Areas
                SET 
                Codigo=?
                ,Provincia=?
                ,Canton=?
                ,Parroquia=?
                ,Direccion=?
                ,CodPredial=?
                ,Descripcion=?
                ,IdPropietario=?
                WHERE IdArea=?
               ";
        //$res['res']=$decri; 
        $params = array($obj->Codigo
        ,$obj->Provincia
        ,$obj->Canton
        ,$obj->Parroquia
        ,$obj->Direccion
        ,$obj->CodPredial
        ,$obj->Descripcion
        ,$obj->IdPropietario
        ,$obj->IdArea);

        $stmt = sqlsrv_query( $dbConn, $sql , $params );

           
        if (!$stmt){
             $res['estado']=false;
             $res['mensaje']=sqlsrv_errors(); 
             
            $res['res']= json_encode($obj);
        }else{
           
            sqlsrv_next_result($stmt);
            sqlsrv_fetch($stmt);
            $res['res']= encrypt(sqlsrv_get_field($stmt, 0),true);

            
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

header('Content-type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
ob_end_flush();
?>