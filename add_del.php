<?php
	header("Content-Type: application/json");
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers:x-requested-with,content-type'); 

	$host = 'localhost';
	$dbuser ='root';
	$dbpassword = 'a12345678';
	$dbname = 'mydb';
	$link = mysqli_connect($host,$dbuser,$dbpassword,$dbname);
	if(!$link){
		echo "DB unconnect!";
	}
	$tb_name = "employee"
	$requestPayload = file_get_contents("php://input");
	$object = json_decode($requestPayload, true);
    $startDate = $object["startDate"];
    $name = $object["name"];
    $title = $object["title"];
    $state = $object["state"];

    // $sql = "INSERT INTO".$tb_name."(".$name.",".$title2.",".$state.",".$startDate) VALUES (value1, value2, value3...)";

	echo $start,$name,$title,$state;
	
    
	
	

	



?>
