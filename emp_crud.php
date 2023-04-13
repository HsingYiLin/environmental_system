<?php
	header("Content-Type: application/json");
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers:x-requested-with,content-type'); 
	$host = '172.105.241.230';
	$dbuser ='cfd_schedule_mysql';
	$dbpassword = 'schedule_winwin12!_mysql';
	$dbname = 'cfd_schedule_mysql';
	//測試
	// $host = 'localhost';
	// $dbuser ='root';
	// $dbpassword = 'a12345678';
	// $dbname = 'environtal_db';
	$mydb_link = mysqli_connect($host,$dbuser,$dbpassword,$dbname);

	if($mydb_link->connect_error){
		die('Connection failed: '.$mydb_link->connect_error);
	}

	$requestPayload = file_get_contents("php://input");
	$object = json_decode($requestPayload, true);
  	$arr_res =Array();
	
	if($object["pload"] == "init"){
		$sql_init = "SELECT * FROM employee WHERE `del` != 'D' ORDER BY `title`, `startdate` DESC";
		$result = mysqli_query($mydb_link, $sql_init);
		$i=1;
		if ($result->num_rows > 0) {
			while($row=mysqli_fetch_array($result)){
				$arr_res["emp_name"][$i]=$row['emp_name'];
				$arr_res["title"][$i]=$row['title'];
				$arr_res["state"][$i]=$row['state'];
				$arr_res["startdate"][$i]=$row['startdate'];
				$arr_res["qualify"][$i]=$row['qualify'];
				$i++;
			}
			$arr_res["status"] = "success!";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "add"){
		$startDate = $object["startDate"];
    	$emp_name = $object["emp_name"];
    	$title = $object["title"];
   	 	$state = $object["state"];
		$qualify = $object["qualify"];
		if($title == '其他') $qualify = 1;
		$sql_pre_add = "SELECT `emp_name` FROM employee WHERE `emp_name` =" ."'$emp_name'"." AND `del` != 'D'";
		$result_add = mysqli_query($mydb_link, $sql_pre_add);
		if (mysqli_num_rows($result_add) > 0) {
			$arr_res["status"] = "duplicate";
			echo json_encode($arr_res);
			die();
			mysqli_close($mydb_link);
		} 

		$sql_add = "INSERT INTO employee (`emp_name`, `title`, `state`, `startDate`, `qualify`) VALUES (" ."'$emp_name'". "," ."'$title'". "," ."'$state'". "," ."'$startDate'" . "," ."$qualify" . ")";
		if($mydb_link->query($sql_add) === TRUE){
			$arr_res["status"] = "add success";
		} else {
			$arr_res["status"] = "add fail";
			// $arr_res["error"] = $mydb_link->error;
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "select"){
		$emp_name = $object["emp_name"];
		$date = $object["date"];
		$title = $object["title"];
		$sql_select = "SELECT * FROM employee WHERE (`emp_name` LIKE" ."'%$emp_name%'" . " OR `startDate` = "."'$date'". " OR `title` = "."'$title'".") AND `del` != 'D'";
		$result_select = mysqli_query($mydb_link, $sql_select);
		$i=1;
		if ($result_select->num_rows > 0) {
			while($row=mysqli_fetch_assoc($result_select)){
				$arr_res["emp_name"][$i]=$row['emp_name'];
				$arr_res["title"][$i]=$row['title'];
				$arr_res["state"][$i]=$row['state'];
				$arr_res["startdate"][$i]=$row['startdate'];
				$arr_res["qualify"][$i]=$row['qualify'];	
				$i++;		
			}
			$arr_res["status"] = "success!";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "update"){
		$startDate = $object["startDate"];
    	$emp_name = $object["emp_name"];
    	$title = $object["title"];
   	 	$state = $object["state"];
		$qualify = $object["qualify"];
		$del = "";
		if($state == "離職") $del = "D";
		$sql_update = "UPDATE employee SET `title` =" ."'$title'"." ,`state` =" ."'$state'" . " ,`startDate` =" . "'$startDate'".", `qualify`="."$qualify".", `del`="."'$del'";
		$sql_update .= "WHERE `emp_name` =" ."'$emp_name'";
		if(mysqli_query($mydb_link, $sql_update)){
			$arr_res["status"] = "update success";
		}else{
			$arr_res["status"] = "update fail";
			$arr_res["error"] =mysqli_error($mydb_link);
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "delete"){
		$emp_name = $object["emp_name"];
		$sql_pre_delete = "SELECT `emp_name` FROM employee WHERE `emp_name` =" ."'$emp_name'"." AND `del` != 'D'";
		$result_pre_delete = mysqli_query($mydb_link, $sql_pre_delete);
		if (mysqli_num_rows($result_pre_delete) == 0) {
			$arr_res["status"] = "no data";
			echo json_encode($arr_res);
			die();
			mysqli_close($mydb_link);
		} 
		// $sql_delete_emp = "DELETE FROM employee WHERE `emp_name` =" ."'$emp_name'";
		$sql_delete_emp = "UPDATE employee SET `del` = 'D' WHERE `emp_name` =" ."'$emp_name'";
		$sql_delete_pun = "DELETE FROM punish WHERE `name` =" ."'$emp_name'";
		if(mysqli_query($mydb_link, $sql_delete_emp)){
			if (mysqli_num_rows($result_pre_delete) > 0) {
				mysqli_query($mydb_link, $sql_delete_pun);
			} 
			$arr_res["status"] = "delete success";
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);
		
	}
?>