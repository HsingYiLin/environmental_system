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
		$sql_init = "SELECT * FROM employee ORDER BY  `title`,`startdate` ASC";
		$result = mysqli_query($mydb_link, $sql_init);
		$i=1;
		if ($result->num_rows > 0) {
			while($row=mysqli_fetch_array($result)){
				$arr_res["emp_name"][$i]=$row['emp_name'];
				$arr_res["title"][$i]=$row['title'];
				$arr_res["state"][$i]=$row['state'];
				$arr_res["startdate"][$i]=$row['startdate'];
				$i++;
			}
			$arr_res["status"] = "success!";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);

	}else if($object["pload"] == "add"){
		$startDate = $object["startDate"];
    	$emp_name = $object["emp_name"];
    	$title = $object["title"];
   	 	$state = $object["state"];
		$sql_sel = "SELECT `emp_name` FROM employee WHERE `emp_name` =" ."'$emp_name'";
		$result = mysqli_query($mydb_link, $sql_sel);
		if (mysqli_num_rows($result) > 0) {
			$arr_res["status"] = "duplicate";
			echo json_encode($arr_res);
			die();
		} 

		$sql_add = "INSERT INTO employee (`emp_name`, `title`, `state`, `startDate`) VALUES (" ."'$emp_name'". "," ."'$title'". "," ."'$state'". "," ."'$startDate'". ")";
		if($mydb_link->query($sql_add) === TRUE){
			$arr_res["status"] = "add success";
		} else {
			$arr_res["status"] = "add fail";
			// $arr_res["error"] = $mydb_link->error;
            // $arr_res["sql"] = $sql_add;		
		}
		echo json_encode($arr_res);

	}else if($object["pload"] == "select"){
		$emp_name = $object["emp_name"];
		$sql_sel2 = "SELECT * FROM employee WHERE `emp_name` =" ."'$emp_name'";
		$result2 = mysqli_query($mydb_link, $sql_sel2);
		$i=1;
		if ($result2->num_rows > 0) {
			while($row=mysqli_fetch_assoc($result2)){
				$arr_res["emp_name"][$i]=$row['emp_name'];
				$arr_res["title"][$i]=$row['title'];
				$arr_res["state"][$i]=$row['state'];
				$arr_res["startdate"][$i]=$row['startdate'];	
				$i++;		
			}
			$arr_res["status"] = "select success";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);

	}else if($object["pload"] == "update"){
		$startDate = $object["startDate"];
    	$emp_name = $object["emp_name"];
    	$title = $object["title"];
   	 	$state = $object["state"];
		$sql_up = "UPDATE employee SET `title` =" ."'$title'"." ,`state` =" ."'$state'" . " ,`startDate` =" . "'$startDate'" . "WHERE `emp_name` =" ."'$emp_name'";

		if(mysqli_query($mydb_link, $sql_up) && $mydb_link->affected_rows > 0){
			$arr_res["status"] = "update success";
		}else{
			$arr_res["status"] = "update fail";
			// $arr_res["error"] =mysqli_error($mydb_link);
		}
		echo json_encode($arr_res);
	}else if($object["pload"] == "delete"){
		$emp_name = $object["emp_name"];
		$sql_sel3 = "SELECT `emp_name` FROM employee WHERE `emp_name` =" ."'$emp_name'";
		$result = mysqli_query($mydb_link, $sql_sel3);
		if (mysqli_num_rows($result) == 0) {
			$arr_res["status"] = "no data";
			echo json_encode($arr_res);
			die();
		} 
		$sql_del = "DELETE FROM employee WHERE `emp_name` =" ."'$emp_name'";
		if(mysqli_query($mydb_link, $sql_del)){
			$arr_res["status"] = "delete success";
		}
		echo json_encode($arr_res);
	}

?>