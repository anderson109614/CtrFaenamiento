<?php
ob_start();
include("../coneccion.php");
$dbConn =  connect($db);
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        //if (isset($_GET['nom'])) {
            $sql = "SELECT * FROM Perfiles";
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
    echo json_encode($pila);

           // echo json_encode($sql->fetchAll());
	    
	
        //}  
    } catch (Exception $e) {
        echo 'Excepción capturada: ',  $e->getMessage(), "\n";
    }
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    try {
        //$input = $_POST;
        $input = (array) json_decode(file_get_contents('php://input'), TRUE);
        $sql = "UPDATE
        data_usuarios
    SET
        usuario_ultimoingreso=now(),
        usuario_intentos=:intentos
    WHERE
        usuario_id=:usrId";
        $statement = $dbConn->prepare($sql);
        $statement->bindValue(':intentos', $input['usuario_intentos']);
        $statement->bindValue(':usrId', $input['usuario_id']);
              
        // bindAllValues($statement, $input,-1);
        $statement->execute();
        header("HTTP/1.1 200 OK");
        echo json_encode($input);
        
    } catch (Exception $e) {
        echo 'Excepción capturada: ',  $e->getMessage(), "\n";
    }

}


header('Content-type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: *');
ob_end_flush();
?>