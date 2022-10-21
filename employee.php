<?php
	header("Content-Type: application/json");
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers:x-requested-with,content-type'); 

	$host = 'localhost';
	$dbuser ='root';
	$dbpassword = 'a12345678';
	$dbname = 'mydb';
	$mydb_link = mysqli_connect($host,$dbuser,$dbpassword,$dbname);
	if($mydb_link->connect_error){
		die('Connection failed: '.$mydb_link->connect_error);
	}

	$requestPayload = file_get_contents("php://input");
	$object = json_decode($requestPayload, true);
  	$arr_res =Array();

	if($object["pload"] == "add"){
		$startDate = $object["startDate"];
    	$name = $object["name"];
    	$title = $object["title"];
   	 	$state = $object["state"];

		$sql_sel = "SELECT `name` FROM employee WHERE `name` =" ."'$name'";
		$result = mysqli_query($mydb_link, $sql_sel);
		if (mysqli_num_rows($result) > 0) {
			$arr_res["status"] = "duplicate";
			echo json_encode($arr_res);
			die();
		} 
		
		$sql_add = "INSERT INTO employee (`name`, `title`, `state`, `startDate`) VALUES (" ."'$name'". "," ."'$title'". "," ."'$state'". "," ."'$startDate'". ")";
		if($mydb_link->query($sql_add) === TRUE){
			$arr_res["status"] = "add success";
			echo json_encode($arr_res);
		} else {
  			echo "Error: " . $sql_add . "<br>" . $mydb_link->error;
		}

	}else if($object["pload"] == "init"){
		$sql_init = "SELECT * FROM employee";
		$result = mysqli_query($mydb_link, $sql_init);
		$i=1;
		if ($result->num_rows > 0) {
			while($row=mysqli_fetch_array($result)){
				$arr_res["name"][$i]=$row['name'];
				$arr_res["title"][$i]=$row['title'];
				$arr_res["state"][$i]=$row['state'];
				$arr_res["startdate"][$i]=$row['startdate'];
				$i++;
			}
			$arr_res["status"] = "success!";
			echo json_encode($arr_res);
		}else{
			$arr_res["status"] = "no data";
			echo json_encode($arr_res);
		}
	}
?>