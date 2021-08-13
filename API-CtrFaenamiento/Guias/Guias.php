<?php
ob_start();
include("../coneccion.php");
include("../Encript.php");
include("../Validacion.php");
$dbConn =  connect($db);
if ($_SERVER['REQUEST_METHOD'] == 'GET' && $auth) {
    try {
        if (isset($_GET['usr'])) {
            $sql = "SELECT IdGia
            ,Numero
            ,TipoEmision
            ,FechaEmision
            ,FechaInicio
            ,FechaFinaliza
            ,Ruta
            ,IdAreaOrigen as AreaOrigen
            ,IdAreaDestino as AreaDestino
            ,LugarOrigen
            ,IdPersonaAutorizada as PersonaAutorizada
            ,TotalProductos
            ,IdVehiculo as Vehiculo
            ,IdUsuario as Usuario
            FROM Gias
            WHERE IdUsuario=?";
            $decri= decrypt($_GET['usr']);
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

                    array_push($pila, $row);
                }

                $res['res']= encrypt($pila,false);
            }
            header("HTTP/1.1 200 OK");
            sqlsrv_close($dbConn);        
            echo json_encode($res);
	    
	
        }else{
             $sql = "SELECT IdGia
            ,Numero
            ,TipoEmision
            ,FechaEmision
            ,FechaInicio
            ,FechaFinaliza
            ,Ruta
            ,IdAreaOrigen as AreaOrigen
            ,IdAreaDestino as AreaDestino
            ,LugarOrigen
            ,IdPersonaAutorizada as PersonaAutorizada
            ,TotalProductos
            ,IdVehiculo as Vehiculo
            ,IdUsuario as Usuario
            ,IdGia as listaDetalles
            FROM Gias
            WHERE Eliminado=0";
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
                    $res['mensaje']=$row['AreaOrigen']; 
                    $row['AreaOrigen']=getArea($row['AreaOrigen'],$dbConn);
                    $row['AreaDestino']=getArea($row['AreaDestino'],$dbConn);
                    $row['PersonaAutorizada']=getPersona($row['PersonaAutorizada'],$dbConn);
                    $row['Vehiculo']=getVehiculo($row['Vehiculo'],$dbConn);
                    $row['Usuario']=getUsuario($row['Usuario'],$dbConn);
                    $row['listaDetalles']=getDetalles($row['IdGia'],$dbConn);
                    
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

function getArea($id,$dbConn){
    $sql = "SELECT *
            FROM Areas
            WHERE IdArea=?";
            
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
function getVehiculo($id,$dbConn){
    $sql = "SELECT *
            FROM Vehiculos
            WHERE IdVehiculo=?";
            
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
function getUsuario($id,$dbConn){
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
    AND us.IdUsuario=?";
            
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
function getDetalles($id,$dbConn){
    $sql = "SELECT *
            FROM DetalleGia
            WHERE IdGia=?";
            
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
if ($_SERVER['REQUEST_METHOD'] == 'POST' && $auth) {
    
    try {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $decri= decrypt($input['value']);
        $obj= json_decode($decri, false);
       
        $sql = "INSERT INTO Gias
        (Numero
        ,TipoEmision
        ,FechaEmision
        ,FechaInicio
        ,FechaFinaliza
        ,Ruta
        ,IdAreaOrigen
        ,IdAreaDestino
        ,LugarOrigen
        ,IdPersonaAutorizada
        ,TotalProductos        
        ,IdVehiculo
        ,IdUsuario
        ,Eliminado)
  VALUES
        (?
        ,?
        ,?
        ,?
        ,?
        ,?
        ,?
        ,?
        ,?
        ,?
        ,?    
        ,?
        ,?
        ,0);
        SELECT SCOPE_IDENTITY() AS id;";
        //$res['res']=$decri; 
        $params = array($obj->Numero,
                        $obj->TipoEmision,
                        $obj->FechaEmision->date, 
                        $obj->FechaInicio->date,
                        $obj->FechaFinaliza->date,
                        $obj->Ruta,
                        $obj->AreaOrigen->IdArea,
                        $obj->AreaDestino->IdArea, 
                        $obj->LugarOrigen,
                        $obj->PersonaAutorizada->Id,
                        $obj->TotalProductos,
                        $obj->Vehiculo->IdVehiculo,
                        $obj->Usuario->IdUsuario
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
            $detalles=$obj->listaDetalles;
            for ($i = 0; $i < count($detalles); $i++) {
                IngresarDetalles($detalles[$i],$id,$dbConn);
            }
            $res['res']= encrypt($id,true);

            
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

function IngresarDetalles($det,$id,$dbConn){
    try{
    
        

    $sql = "INSERT INTO DetalleGia
    (Producto
    ,Cantidad
    ,IdGia)
    VALUES
    (?,?,?)";
           
    $params = array($det->Producto,
                    $det->Cantidad,
                    $id);
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
if ($_SERVER['REQUEST_METHOD'] == 'PUT' && $auth) {
    
    try {
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $decri= decrypt($input['value']);
        $obj= json_decode($decri, false);
       
        $sql = "UPDATE Gias
        SET 
           TipoEmision = ?
           ,FechaEmision = ?
           ,FechaInicio = ?
           ,Ruta = ?
           ,LugarOrigen = ?
           
      WHERE IdGia=?";
        //$res['res']=$decri; 
        $params = array($obj->TipoEmision,
                        $obj->FechaEmision->date, 
                        $obj->FechaInicio->date,
                        $obj->Ruta,
                        $obj->LugarOrigen,
                        $obj->IdGia
                    );

        $stmt = sqlsrv_query( $dbConn, $sql , $params );

           
        if (!$stmt){
             $res['estado']=false;
             $res['mensaje']=sqlsrv_errors();              
            $res['res']= json_encode($obj);
        }else{
           
            $res['mensaje']='Actualizacion Correcta';   

            
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
if ($_SERVER['REQUEST_METHOD'] == 'DELETE' && $auth) {
    
    try {
        
        $sql = "UPDATE Gias
        SET 
            Eliminado = 1
           
           
      WHERE IdGia=?";
        //$res['res']=$decri; 
        $params = array(
                     $_GET['id']
                    );

        $stmt = sqlsrv_query( $dbConn, $sql , $params );

           
        if (!$stmt){
             $res['estado']=false;
             $res['mensaje']=sqlsrv_errors();              
            $res['res']= json_encode($obj);
        }else{
           
            $res['mensaje']=$_GET['id'];   

            
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