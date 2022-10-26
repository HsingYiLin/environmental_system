<?php
	header("Content-Type: application/json");
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers:x-requested-with,content-type'); 
	$host = 'localhost';
	$dbuser ='root';
	$dbpassword = 'a12345678';
	$dbname = 'environtal_db';
	$mydb_link = mysqli_connect($host,$dbuser,$dbpassword,$dbname);

	if($mydb_link->connect_error){
		die('Connection failed: '.$mydb_link->connect_error);
	}

	$requestPayload = file_get_contents("php://input");
	$object = json_decode($requestPayload, true);
  	$arr_res =Array();

    if($object["pload"] == "init"){
		$mon = $object["mon"];
		$days = $object["days"];

		$sql_init = "SELECT `emp_name`, `startdate` FROM employee WHERE `title` = '其他' AND `state` = '在職' AND `startdate` <" . "'$mon" . "-1' ORDER BY `startdate` DESC";
		$sql_init
		$result = mysqli_query($mydb_link, $sql_init);
		$i=1;
		if ($result->num_rows > 0) {
			while($row=mysqli_fetch_array($result)){
				$arr_res["emp_name"][$i]=$row['emp_name'];
				$arr_res["startdate"][$i]=$row['startdate'];
				$i++;
			}
			$arr_res["status"] = "success!";
		}else{
			$arr_res["status"] = "no data";
		}
		// $arr_res["sql"] = $sql_init;
		echo json_encode($arr_res);
	}
?>