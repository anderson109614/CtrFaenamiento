<?php

$db = [
    'host' => 'localhost',
    'username' => 'analista1',
    'password' => 'Us3r/4nt4.20&+',
    'db' => 'esfloserv_web' 
];
  //Abrir conexion a la base de datos
  function connect($db)
  {
      try {
        $serverName = "DESKTOP-I9NQ813\SQLEXPRESS"; //serverName\instanceName
        //$connectionInfo = array( "Database"=>"dbName", "UID"=>"userName", "PWD"=>"password");
        $connectionInfo = array( "Database"=>"db_CFaenamiento");
        $conn = sqlsrv_connect( $serverName, $connectionInfo);
        return $conn;
      } catch (Exception  $exception) {
          exit($exception->getMessage());
      }
  }
  


?>