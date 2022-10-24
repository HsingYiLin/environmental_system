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

    if($object["pload"] == "init"){
		$sql_init = "SELECT * FROM punish";
		$result = mysqli_query($mydb_link, $sql_init);
		$i=1;
		if ($result->num_rows > 0) {
			while($row=mysqli_fetch_array($result)){
				$arr_res["date"][$i]=$row['date'];
				$arr_res["name"][$i]=$row['name'];
				$arr_res["punishtxt"][$i]=$row['punishtxt'];
				$arr_res["times"][$i]=$row['times'];
                $arr_res["fine"][$i]=$row['fine'];

				$i++;
			}
			$arr_res["status"] = "success!";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);

	}else if($object["pload"] == "add"){
		$date = $object["date"];
    	$name = $object["name"];
    	$punishtxt = $object["punishtxt"];
		$sql_sel = "SELECT `name` FROM punish WHERE `name` =" ."'$name'";
		$result = mysqli_query($mydb_link, $sql_sel);
		if (mysqli_num_rows($result) > 0) {
			$arr_res["status"] = "duplicate";
			echo json_encode($arr_res);
			die();
		} 

		$sql_add = "INSERT INTO punish (`name`, `punishtxt`, `date`) VALUES (" ."'$name'". "," ."'$punishtxt'". "," ."'$date'".")";
		if($mydb_link->query($sql_add) === TRUE){
			$arr_res["status"] = "add success";
		} else {
			$arr_res["status"] = "add fail";
            // $arr_res["error"] = $mydb_link->error;
            // $arr_res["sql"] = $sql_add;
		}
		echo json_encode($arr_res);
	}else if($object["pload"] == "select"){
		$name = $object["name"];
		$sql_sel2 = "SELECT * FROM punish WHERE `name` =" ."'$name'";
		$result2 = mysqli_query($mydb_link, $sql_sel2);
		$i=1;
		if ($result2->num_rows > 0) {
			while($row=mysqli_fetch_assoc($result2)){
				$arr_res["name"][$i]=$row['name'];
				$arr_res["punishtxt"][$i]=$row['punishtxt'];
				$arr_res["date"][$i]=$row['date'];
				$i++;		
			}
			$arr_res["status"] = "select success";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);

	}
?>