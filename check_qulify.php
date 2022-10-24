<?php
	header("Content-Type: application/json");
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers:x-requested-with,content-type'); 
	$host = 'localhost';
	$dbuser ='root';
	$dbpassword = 'a12345678';
	$dbname = 'enviroment_db';
	$mydb_link = mysqli_connect($host,$dbuser,$dbpassword,$dbname);

	if($mydb_link->connect_error){
		die('Connection failed: '.$mydb_link->connect_error);
	}

	$requestPayload = file_get_contents("php://input");
	$object = json_decode($requestPayload, true);
  	$arr_res =Array();

      if($object["pload"] == "check"){
    	$emp_name = $object["emp_name"];
		$sql_check = "SELECT `emp_name`,`startdate` FROM employee WHERE `emp_name` =" ."'$emp_name'";
		$result = mysqli_query($mydb_link, $sql_check);
		$i=1;
		if ($result->num_rows > 0) {
			while($row=mysqli_fetch_array($result)){
				$arr_res["emp_name"][$i]=$row['emp_name'];
				$arr_res["startdate"][$i]=$row['startdate'];
				$i++;
			}
			$arr_res["status"] = "check!";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);

	}
?>