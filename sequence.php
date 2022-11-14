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
		$monVal = $object["monVal"];
		$lastMonStamp = strtotime('-1 month', strtotime($monVal));
		$lastMon = date('Y-m', $lastMonStamp);
		$isCorrect = false;
		$isCorrect = ($monVal == "2022-10")? true : false;
		if(!$isCorrect){//如果前個月未排值日生，無法判斷這個月的第一個是誰
			$sql_lastSequence = "SELECT * FROM sequence WHERE `calender` LIKE "."'$lastMon%'";
			$result_lastSequence = mysqli_query($mydb_link, $sql_lastSequence);
			if (mysqli_num_rows($result_lastSequence) > 0){
				$arr_res["status"] = "last sequence data exist";
			}else{
				$arr_res["status"] = "last sequence no data";
				echo json_encode($arr_res);
				die();
				mysqli_close($mydb_link);
			}
		}
		$sql_sequence = "SELECT * FROM sequence WHERE `calender` LIKE "."'$monVal%'";
		$arr_res["sql_sequence"]= $sql_sequence;
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
		$sql_punish = "SELECT `name`, `punishtxt`, `pun_date` FROM punish WHERE  `pun_done` = 0  AND `pun_date` < "."'$mon"."-1' ORDER BY `pun_date` ASC";
		$sql_rep = "SELECT * FROM rep WHERE `rep_done` = 0 AND "."'$mon'"." > `rep_date`";
		$sql_incr = "SELECT * FROM incr WHERE `incr_mon` < "."'$mon'"." AND `incr_done` = 0";
		$result_employee = mysqli_query($mydb_link, $sql_employee);
		$result_punish = mysqli_query($mydb_link, $sql_punish);
		$result_rep = mysqli_query($mydb_link, $sql_rep);
		$result_incr = mysqli_query($mydb_link, $sql_incr);
		$arr_res["sql_punish"] = $sql_punish;
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
		$arr_res["pun"] = mysqli_num_rows($result_punish);
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
		$i=1;
		if(mysqli_num_rows($result_rep) > 0){
			while($row = mysqli_fetch_array($result_rep)){
				$arr_res["empname"][$i] = $row['empname'];
				$arr_res["rep_date"][$i] = $row['rep_date'];
				$arr_res["rep_name"][$i] = $row['rep_name'];
				$i++;
			}
			$arr_res["status"] = "rep success";
		}else{
			$arr_res["status"] = "rep no data";
		}
		$i=1;
		$arr_res["asdasd"] = mysqli_num_rows($result_incr);
		if(mysqli_num_rows($result_incr) > 0){
			while($row = mysqli_fetch_array($result_incr)){
				$arr_res["incr_name"][$i] = $row['incr_name'];
				$arr_res["incr_mon"][$i] = $row['incr_mon'];
				$arr_res["incr_done"][$i] = $row['incr_done'];
				$i++;
			}
			$arr_res["status"] = "incr success";
		}else{
			$arr_res["status"] = "incr no data";
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
		$year = $object["year"];
		$doneKey = $object["doneKey"];
		$replaceDone = $object["replaceDone"];
		$dataIncr = $object["dataIncr"];
		$emp_name = $object["emp_name"];

		for ($i=0; $i < count($calender_arr); $i++) { 
			$sql_insert[$i] = "INSERT INTO sequence (`calender`, `txt`, `punish`, `replace_emp`)";
			$sql_insert[$i] .= " VALUES( "."'$calender_arr[$i]'".", "."'$txt_arr[$i]'".", "."'$punish_arr[$i]'".", "."'$replace_emp_arr[$i]'".")";
			if(mysqli_query($mydb_link, $sql_insert[$i]) == TRUE){
				$arr_res["status"][$i] = "add success";
			} else {
				$arr_res["status"] = "add fail";	
			}
		}	

		for($i = 0; $i < count($dataIncr); $i++){
			$sql_update_incr_emp[$i] = "UPDATE incr SET `incr_done` = "."'$year-$mon'"." WHERE `incr_name` = "."'$dataIncr[$i]'"." AND `incr_done` = '0' LIMIT 1";
			$arr_res["sql_update_incr_emp"][$i] = $sql_update_incr_emp[$i];
			if(mysqli_query($mydb_link, $sql_update_incr_emp[$i]) == TRUE){
				$arr_res["status"] = "update incr success";
			}
		}
		$times = 0;
		for($i = 0; $i < count($replace_emp_arr); $i++){
			if(!empty($replace_emp_arr[$i])){
				$replcae_bol = (strpos($replace_emp_arr[$i], "代替"));
				$incr_bol = (strpos($replace_emp_arr[$i], "調用"));
				$replace_name[$i] = mb_substr($replace_emp_arr[$i], 0, -2);
				if($replcae_bol != false){ //代替
					$sql_update_replace_emp[$i] = "INSERT INTO rep (`empname`, `rep_date`, `rep_name`, `rep_done`)";
					$sql_update_replace_emp[$i] .= " VALUES("."'$replace_name[$i]'".", "."'$year-$mon'".", "."'$txt_arr[$i]代'".", '0')";
				}else if($incr_bol != false){//調用
					$sql_update_replace_emp[$i] = "INSERT INTO incr (`incr_name`, `incr_mon`, `incr_done`)";
					$sql_update_replace_emp[$i] .= " VALUES("."'$replace_name[$i]'".", "."'$year-$mon'".", '0')";
				}
				if(mysqli_query($mydb_link, $sql_update_replace_emp[$i]) === TRUE){
					$arr_res["status"] = "update replace success";
				} 
			}		
		}
		for($i = 0; $i < count($doneKey); $i++){
			if(!empty($doneKey[$i]) && !empty($replaceDone)){
				$sql_update_done[$i] = "UPDATE rep SET `rep_done` = "."'$year-$mon'"." WHERE `empname` = "."'$doneKey[$i]'"." AND `rep_name` = "."'$replaceDone[$i]'"; 
				if(mysqli_query($mydb_link, $sql_update_done[$i]) == TRUE){
					$arr_res["status"] = "update replace success";
				} 
			}
		}


		$lastEmp = $object["lastEmp"];
		$mon = $object["mon"];
		$sql_update_last_ind = "UPDATE employee SET `lastIndex` = "."$mon". " WHERE `emp_name` = "."'$lastEmp'";
		if(mysqli_query($mydb_link, $sql_update_last_ind) == TRUE){
			$arr_res["status"] = "update emp success";
		}
		
		if(!empty($object["punish_date_arr"])){
			$punish_date_arr = $object["punish_date_arr"];
			for ($j=0; $j < count($punish_date_arr); $j++) { 
				$sql_update_punish_done[$j] = "UPDATE punish SET `pun_done` = "."'$year-$mon'"." WHERE `name` = "."'$punish_date_arr[$j]'"." AND `pun_done` = 0 LIMIT 1";
				$arr_res["sql_update_punish_done"][$i] = $sql_update_punish_done;
				if(mysqli_query($mydb_link, $sql_update_punish_done[$j]) == TRUE){
					$arr_res["status"] = "update punish success";
				}
			}
		}	
		echo json_encode($arr_res);
		mysqli_close($mydb_link);
		
	}else if($object["pload"] == "delete"){
		$mon = $object["mon"];
		$year = $object["year"];
		$table_len = 12 - ($mon*1);
		for ($i=0; $i <= $table_len; $i++) { 
			$monVal = $object["monVal"];
			$del_ind = $mon + $i;
			$del_rep = strval($del_ind);
			$sql_delete_table[$i] = "DELETE FROM sequence WHERE `calender` >= "."'$monVal-01'";
			$arr_res["sql_delete_table"][$i] = $sql_delete_table[$i];
			// $sql_delete_punish[$i] = "DELETE FROM punish WHERE `pun_date` >= "."'$year-$mon-1'";
			$sql_delete_replace[$i] = "DELETE FROM rep WHERE `rep_date` >= "."'$year-$mon'";
			$sql_delete_incr[$i] = "DELETE FROM incr WHERE incr_mon >= "."'$year-$mon'";

			$sql_update_lastIndex[$i] = "UPDATE employee SET `lastIndex` = 0 WHERE `lastIndex` = "."'$del_ind'";
			$sql_update_punish[$i] = "UPDATE punish SET `pun_done` = 0 WHERE `pun_done` >= "."'$year-$mon'";
			$sql_replace_update[$i] = "UPDATE rep SET `rep_done` = 0 WHERE `rep_done` = "."'$year-$del_ind'";
			$sql_incr_update[$i] = "UPDATE incr SET `incr_done` = 0 WHERE `incr_done` >= "."'$year-$mon'";
			if(mysqli_query($mydb_link, $sql_delete_table[$i])){
				$arr_res["status"] = "delete success";
			}
			// if(mysqli_query($mydb_link, $sql_delete_punish[$i])){
			// 	$arr_res["status"] = "delete success";
			// }
			if(mysqli_query($mydb_link, $sql_delete_replace[$i])){
				$arr_res["status"] = "delete success";
			}
			if(mysqli_query($mydb_link, $sql_delete_incr[$i])){
				$arr_res["status"] = "delete success";
			}
			if(mysqli_query($mydb_link, $sql_update_lastIndex[$i]) == TRUE){
				$arr_res["status"] = "update success";
			}
			if(mysqli_query($mydb_link, $sql_update_punish[$i]) == TRUE){
				$arr_res["status"] = "update success";
			}
			if(mysqli_query($mydb_link, $sql_replace_update[$i]) == TRUE){
				$arr_res["status"] = "update success";
			}		
			if(mysqli_query($mydb_link, $sql_incr_update[$i]) == TRUE){
				$arr_res["status"] = "update success";
			}	
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}
?>