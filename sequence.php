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

	if($object["pload"] == "dataExist"){
		$tableName = $object["tableName"];
		$latTableName = $tableName*1 - 1;
		$isCorrect = false;
		$sql_sequence = "SELECT * FROM sequence"."$tableName";
		$isCorrect = ($tableName == "202209")? true : false;
		if(!$isCorrect){//如果前個月未排值日生，無法判斷這個月的第一個是誰
			$sql_latTable = "SELECT * FROM sequence"."$latTableName";
			$result_lastSequence = mysqli_query($mydb_link, $sql_latTable);
			if (mysqli_num_rows($result_lastSequence) > 0){
				$arr_res["status"] = "last sequence data exist";
			}else{
				$arr_res["status"] = "last sequence no data";
				echo json_encode($arr_res);
				die();
				mysqli_close($mydb_link);
			}
		}

		$result_sequence = mysqli_query($mydb_link, $sql_sequence);
		$i=1;
		if (mysqli_num_rows($result_sequence) > 0){
			while($row = mysqli_fetch_array($result_sequence)){
				$arr_res["calender"][$i] = $row['calender'];
				$arr_res["txt"][$i] = $row['txt'];
				$arr_res["punish"][$i] = $row['punish'];
				$arr_res["replace_emp"][$i] = $row['replace_emp'];
				$i++;
			}
			$arr_res["status"] = "sequence data exist";
		}else{
			$arr_res["status"] = "sequence no data";
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);
	
	}else if($object["pload"] == "init"){
		$mon = $object["mon"];
		$mon_str = substr($mon, 5, 2);
		$year_str = substr($mon, 0, 4);
		$month_days  = cal_days_in_month(CAL_GREGORIAN, date($mon_str), date($year_str));
		$max_date = $year_str . $mon_str . $month_days;
		$sql_employee = "SELECT * FROM employee WHERE `title` = '其他' AND `state` = '在職'";
		$sql_employee .= " AND "."'$max_date'". " >= DATE_ADD(`startdate`, INTERVAL 1 MONTH) ORDER BY `startdate` DESC";
		$sql_punish = "SELECT `name`, `punishtxt`, `pun_date` FROM punish WHERE  `done` = 0  AND `pun_date` < "."'$mon-1'"." ORDER BY `pun_date` ASC";
		$arr_res["sql_punish"] = $sql_punish;
		$result_employee = mysqli_query($mydb_link, $sql_employee);
		$result_punish= mysqli_query($mydb_link, $sql_punish);
		$i=1;
		if (mysqli_num_rows($result_employee) > 0){
			while($row = mysqli_fetch_array($result_employee)){
				$arr_res["emp_name"][$i] = $row['emp_name'];
				$arr_res["startdate"][$i] = $row['startdate'];
				$arr_res["lastIndex"][$i] = $row['lastIndex'];
				$i++;
			}
			$arr_res["status"] = "emp success";
		}else{
			$arr_res["status"] = "emp no data";
			die();
			mysqli_close($mydb_link);
		}
		$i=1;
		if (mysqli_num_rows($result_punish) > 0) {
			while($row = mysqli_fetch_array($result_punish)){
				$arr_res["name"][$i] = $row['name'];
				$arr_res["punishtxt"][$i] = $row['punishtxt'];
				$arr_res["pun_date"][$i] = $row['pun_date'];
				$i++;
			}
			$arr_res["status"] = "pun success";
		}else{
			$arr_res["status"] = "pun no data";
		}
		
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "create"){
		$calender_arr = $object["calender_arr"];
		$txt_arr = $object["txt_arr"];
		$punish_arr = $object["punish_arr"];
		$replace_emp_arr = $object["replace_emp_arr"];
		$lastEmp = $object["lastEmp"];
		$mon = $object["mon"];
		$tableName = $object["tableName"];

		for ($i=0; $i < count($calender_arr); $i++) { 
			$sql_insert[$i] = "INSERT INTO sequence"."$tableName"." (`calender`, `txt`, `punish`, `replace_emp`)";
			$sql_insert[$i] .= " VALUES( "."'$calender_arr[$i]'".", "."'$txt_arr[$i]'".", "."'$punish_arr[$i]'".", "."'$replace_emp_arr[$i]'".")";
			if(mysqli_query($mydb_link, $sql_insert[$i]) == TRUE){
				$arr_res["status"][$i] = "add success";
			} else {
				$arr_res["status"] = "add fail";	
			}
		}	

		if(!empty($object["lastEmp"])){
			$lastEmp = $object["lastEmp"];
			$mon = $object["mon"];
			$sql_update_last_ind = "UPDATE employee SET `lastIndex` = "."'$mon'". " WHERE `emp_name` = "."'$lastEmp'";
			if(mysqli_query($mydb_link, $sql_update_last_ind) == TRUE){
				$arr_res["status"] = "update emp success";
			}
		}	
		
		if(!empty($object["punish_date_arr"])){
			$punish_date_arr = $object["punish_date_arr"];
			for ($j=1; $j <= count($punish_date_arr); $j++) { 
				$sql_update_punish_done[$j] = "UPDATE punish SET `done` = '1' WHERE `pun_date` = "."'$punish_date_arr[$j]'";
				if(mysqli_query($mydb_link, $sql_update_punish_done[$j]) == TRUE){
					$arr_res["status"] = "update punish success";
				}
			}
		}	
		echo json_encode($arr_res);
		mysqli_close($mydb_link);
		
	}else if($object["pload"] == "delete"){
		$mon = $object["mon"];
		$table_len = 12 - ($mon*1);
		for ($i=0; $i <= $table_len; $i++) { 
			$tableName = $object["tableName"];
			$mon = $object["mon"];
			$tableName = $tableName + $i;
			$mon = $mon + $i;
			$sql_delete_table[$i] = "DELETE FROM sequence"."$tableName";
			$sql_update_lastIndex[$i] = "UPDATE employee SET `lastIndex` = '0' WHERE `lastIndex` = "."'$mon'";
			$arr_res["sql_update_lastIndex"][$i] = $sql_update_lastIndex[$i] ;
			if(mysqli_query($mydb_link, $sql_delete_table[$i])){
				$arr_res["status"] = "delete success";
			}
			if(mysqli_query($mydb_link, $sql_update_lastIndex[$i]) == TRUE){
				$arr_res["status"] = "update success";
			}
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}
?>