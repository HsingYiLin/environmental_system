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
		$arr_res["lastMon"] = $lastMon;
		$isCorrect = false;
		$isCorrect = ($monVal == "2023-03")? true : false;
		if(!$isCorrect){//如果前個月未排值日生，無法判斷這個月的第一個是誰
			$sql_lastSequence = "SELECT * FROM sequence WHERE `calender` LIKE "."'$lastMon%'";
			$result_lastSequence = mysqli_query($mydb_link, $sql_lastSequence);
			if (mysqli_num_rows($result_lastSequence) == 0){
				$arr_res["status"] = "UNSCHEDULED";
				echo json_encode($arr_res);
				die();
				mysqli_close($mydb_link);
			}
		}
		$sql_del_btn = "SELECT `calender` FROM sequence  ORDER BY `calender` DESC LIMIT 1";
		$result_del_btn = mysqli_query($mydb_link, $sql_del_btn);
		$i=1;
		if (mysqli_num_rows($result_del_btn) > 0){
			while($row = mysqli_fetch_array($result_del_btn)){
				$arr_res["lastCalender"][$i] = $row['calender'];
				$i++;
			}
			$arr_res["status"] = "LAST EXISIT";
		}

		$sql_sequence = "SELECT * FROM sequence WHERE `calender` LIKE "."'$monVal%'";
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
			$arr_res["status"] = "LIST EXISIT";
		}else{
			$arr_res["status"] = "FORM BE EMPTY";
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);
	
	}else if($object["pload"] == "init"){
		$mon = $object["mon"];
		$tmp_mon = (substr($mon,5,2)*1)-1;
		$tmp_mon = ($tmp_mon == 0)? 12 : $tmp_mon;
		$table_mon = ($tmp_mon).'m';
		$mon_str = substr($mon, 5, 2);
		$year_str = substr($mon, 0, 4);
		$month_days  = cal_days_in_month(CAL_GREGORIAN, date($mon_str), date($year_str));
		$max_date = $year_str . $mon_str . $month_days;
		$sql_employee = "SELECT * FROM employee WHERE `title` = '其他' AND `state` = '在職' AND `del` != 'D'";
		$sql_employee .= " AND "."'$max_date'". " >= DATE_ADD(`startdate`, INTERVAL 1 MONTH) ORDER BY `startdate` DESC";
		$sql_emp_last = "SELECT `emp_name`, `$table_mon` from employee WHERE `title` = '其他' AND `state` = '在職' AND `del` != 'D'";
		$sql_emp_last .= " AND "."'$max_date'". " >= DATE_ADD(`startdate`, INTERVAL 1 MONTH) ORDER BY `startdate` DESC";
		$sql_punish = "SELECT `name`, `punishtxt`, `pun_date` FROM punish WHERE  `pun_done` = 0  AND `pun_del` != 'D' AND `pun_date` < "."'$mon"."-1' ORDER BY `pun_date` ASC";
		$sql_rep = "SELECT * FROM rep WHERE `rep_done` = 0 AND "."'$mon'"." > `rep_date`";
		$sql_incr = "SELECT * FROM incr WHERE `incr_mon` < "."'$mon'"." AND `incr_done` = 0";
		$result_employee = mysqli_query($mydb_link, $sql_employee);
		$result_emp_last = mysqli_query($mydb_link, $sql_emp_last);
		$result_punish = mysqli_query($mydb_link, $sql_punish);
		$result_rep = mysqli_query($mydb_link, $sql_rep);
		$result_incr = mysqli_query($mydb_link, $sql_incr);
		$i=1;
		if (mysqli_num_rows($result_employee) > 0){
			while($row = mysqli_fetch_array($result_employee)){
				$arr_res["emp_name"][$i] = $row['emp_name'];
				$arr_res["startdate"][$i] = $row['startdate'];
				$i++;
			}
			$arr_res["status"] = "GENER SUCCESS";
		}else{
			$arr_res["status"] = "EMP NO DATA";
			die();
			mysqli_close($mydb_link);
		}
		$i=1;
		if (mysqli_num_rows($result_emp_last) > 0){
			while($row = mysqli_fetch_array($result_emp_last)){
				$arr_res["lastIndex"][$i] = $row[$table_mon];
				$i++;
			}
			$arr_res["status"] = "GENER SUCCESS";
		}else{
			$arr_res["status"] = "EMP NO DATA";
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
			$arr_res["status"] = "GENER SUCCESS";
		}else{
			$arr_res["status"] = "GENER SUCCESS";
		}
		$i=1;
		if(mysqli_num_rows($result_rep) > 0){
			while($row = mysqli_fetch_array($result_rep)){
				$arr_res["empname"][$i] = $row['empname'];
				$arr_res["rep_date"][$i] = $row['rep_date'];
				$arr_res["rep_name"][$i] = $row['rep_name'];
				$i++;
			}
			$arr_res["status"] = "GENER SUCCESS";
		}else{
			$arr_res["status"] = "GENER SUCCESS";
		}
		$i=1;
		if(mysqli_num_rows($result_incr) > 0){
			while($row = mysqli_fetch_array($result_incr)){
				$arr_res["incr_name"][$i] = $row['incr_name'];
				$arr_res["incr_mon"][$i] = $row['incr_mon'];
				$arr_res["incr_done"][$i] = $row['incr_done'];
				$i++;
			}
			$arr_res["status"] = "GENER SUCCESS";
		}else{
			$arr_res["status"] = "GENER SUCCESS";
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

		for ($i=0; $i < count($calender_arr); $i++) { 
			$sql_insert[$i] = "INSERT INTO sequence (`calender`, `txt`, `punish`, `replace_emp`)";
			$sql_insert[$i] .= " VALUES( "."'$calender_arr[$i]'".", "."'$txt_arr[$i]'".", "."'$punish_arr[$i]'".", "."'$replace_emp_arr[$i]'".")";
			if(mysqli_query($mydb_link, $sql_insert[$i]) == TRUE){
				$arr_res["status"][$i] = "SAVED";
			} else {
				$arr_res["status"] = "add fail";
				$arr_res["error"] = mysqli_error($mydb_link);	
				die();
				mysqli_close($mydb_link);
			}
		}	

		for($i = 0; $i < count($dataIncr); $i++){
			$sql_update_incr_emp[$i] = "UPDATE incr SET `incr_done` = "."'$year-$mon'"." WHERE `incr_name` = "."'$dataIncr[$i]'"." AND `incr_done` = '0' LIMIT 1";
			if(mysqli_query($mydb_link, $sql_update_incr_emp[$i]) == TRUE){
				$arr_res["status"] = "SAVED";
			}
		}

		$times = 0;
		for($i = 0; $i < count($replace_emp_arr); $i++){
			if(!empty($replace_emp_arr[$i])){
				$replcae_bol = (strpos($replace_emp_arr[$i], "代替"));
				$incr_bol = (strpos($replace_emp_arr[$i], "調用"));
				$replace_name[$i] = mb_substr($replace_emp_arr[$i], 0, -2);
				if($replcae_bol != false){ //代替
					$txt_arr[$i] = (strpos($txt_arr[$i], "代") != false)?$txt_arr[$i] : $txt_arr[$i]."代";
					$sql_update_replace_emp[$i] = "INSERT INTO rep (`empname`, `rep_date`, `rep_name`, `rep_done`)";
					$sql_update_replace_emp[$i] .= " VALUES("."'$replace_name[$i]'".", "."'$year-$mon'".", "."'$txt_arr[$i]'".", '0')";
				}else if($incr_bol != false){//調用
					$sql_update_replace_emp[$i] = "INSERT INTO incr (`incr_name`, `incr_mon`, `incr_done`)";
					$sql_update_replace_emp[$i] .= " VALUES("."'$replace_name[$i]'".", "."'$year-$mon'".", '0')";
				}
				if(mysqli_query($mydb_link, $sql_update_replace_emp[$i]) === TRUE){
					$arr_res["status"] = "SAVED";
				} 
			}		
		}

		for($i = 0; $i < count($doneKey); $i++){
			if(!empty($doneKey[$i]) && !empty($replaceDone)){
				$sql_update_done[$i] = "UPDATE rep SET `rep_done` = "."'$year-$mon'"." WHERE `empname` = "."'$doneKey[$i]'"." AND `rep_name` = "."'$replaceDone[$i]'"; 
				if(mysqli_query($mydb_link, $sql_update_done[$i]) == TRUE){
					$arr_res["status"] = "SAVED";
				} 
			}
		}

		$repTorep = $object["repTorep"];
		if(count($repTorep) > 0){
			for($k=0; $k < count($repTorep); $k++){
				$sql_update_rep_to_rep[$k] = "UPDATE rep SET `rep_done` = '0' WHERE `rep_name` = "."'$repTorep[$k]'"." AND `rep_done` = "."'$year-$mon'"." LIMIT 1";
				if(mysqli_query($mydb_link, $sql_update_rep_to_rep[$k]) == TRUE){
					$arr_res["status"] = "SAVED";
				}
			}
		}

		$lastEmp = $object["lastEmp"];
		$mon = $object["mon"]*1;
		$table_mon = $mon.'m';
		$sql_update_last_ind_empty = "UPDATE employee SET `$table_mon` = '' WHERE `$table_mon` != ''";
		$sql_update_last_ind = "UPDATE employee SET `$table_mon` = "."'$year-$mon'". " WHERE `emp_name` = "."'$lastEmp'"." AND `del` != 'D'";
		if(mysqli_query($mydb_link, $sql_update_last_ind_empty) == TRUE){
			$arr_res["status"] = "SAVED";
		}
		if(mysqli_query($mydb_link, $sql_update_last_ind) == TRUE){
			$arr_res["status"] = "SAVED";
		}
		
		$isInvalid_name_arr = Array();
		$isInvalid_date_arr = Array();
		$txt_arr = $object["txt_arr"];
		if(!empty($object["punish_date_arr"])){
			for($i=0; $i<count($calender_arr); $i++){
				if(!empty($punish_arr[$i]) && !empty($replace_emp_arr[$i]) && mb_substr($replace_emp_arr[$i],-2,2) == '代替' ){
					array_push($isInvalid_name_arr, $txt_arr[$i]);
					array_push($isInvalid_date_arr, substr($punish_arr[$i],0,2)."-".substr($punish_arr[$i],3,2));
				}
			}
			$mon = $object["mon"];
			$punish_date_arr = $object["punish_date_arr"];
			for ($j=0; $j < count($punish_date_arr); $j++) { 
				$sql_update_punish_done[$j] = "UPDATE punish SET `pun_done` = "."'$year-$mon'"." WHERE `name` = "."'$punish_date_arr[$j]'"." AND `pun_del` != 'D' AND `pun_done` = 0 AND `pun_del` != 'D' LIMIT 1";
				if(mysqli_query($mydb_link, $sql_update_punish_done[$j]) == TRUE){
					$arr_res["status"] = "SAVED";
				}
			}
			if(!empty($isInvalid_name_arr) && !empty($isInvalid_date_arr)){
				for ($i=0; $i<count($isInvalid_name_arr) ; $i++) { 
					$sql_update_punish_invalid[$i] =  "UPDATE punish SET `pun_done` = '' WHERE `name` = "."'$isInvalid_name_arr[$i]'"." AND `pun_del` != 'D' AND `pun_date` LIKE "."'%$isInvalid_date_arr[$i]'"." LIMIT 1";
					if(mysqli_query($mydb_link, $sql_update_punish_invalid[$i]) == TRUE){
						$arr_res["status"] = "SAVED";
					}
				}
			}
		}	
		echo json_encode($arr_res);
		mysqli_close($mydb_link);
		
	}else if($object["pload"] == "delete"){
		$monVal = $object["monVal"];
		$year = substr($monVal,0,4);
		$mon = substr($monVal,5,2);

		$table_mon = $mon.'m';

		$sql_delete_sequence = "DELETE FROM sequence WHERE `calender` LIKE "."'$monVal%'";
		$sql_delete_replace = "DELETE FROM rep WHERE `rep_date` = "."'$year-$mon'";
		$sql_delete_incr = "DELETE FROM incr WHERE incr_mon = "."'$year-$mon'";
		$sql_update_lastIndex = "UPDATE employee SET `$table_mon` = '' WHERE `$table_mon` != ''";
		$sql_update_punish = "UPDATE punish SET `pun_done` = '' WHERE `pun_done` = "."'$year-$mon'"." AND `pun_del` != 'D'";
		$sql_replace_update = "UPDATE rep SET `rep_done` = 0 WHERE `rep_done` = "."'$year-$mon'";
		$sql_incr_update = "UPDATE incr SET `incr_done` = 0 WHERE `incr_done` = "."'$year-$mon'";

	
		if(mysqli_query($mydb_link, $sql_delete_sequence))$arr_res["status"] = "DEL SUCCESS";
		if(mysqli_query($mydb_link, $sql_delete_replace))$arr_res["status"] = "DEL SUCCESS";
		if(mysqli_query($mydb_link, $sql_delete_incr))$arr_res["status"] = "DEL SUCCESS";
		if(mysqli_query($mydb_link, $sql_update_lastIndex) == TRUE)$arr_res["status"] = "DEL SUCCESS";
		if(mysqli_query($mydb_link, $sql_update_punish) == TRUE)$arr_res["status"] = "DEL SUCCESS";
		if(mysqli_query($mydb_link, $sql_replace_update) == TRUE)$arr_res["status"] = "DEL SUCCESS";		
		if(mysqli_query($mydb_link, $sql_incr_update) == TRUE)$arr_res["status"] = "DEL SUCCESS";
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}
?>