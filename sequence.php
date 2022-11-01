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
		$mon_str = substr($mon, 5, 2);
		$year_str = substr($mon, 0, 4);
		$month_days  = cal_days_in_month(CAL_GREGORIAN, date($mon_str), date($year_str));
		$max_date = $year_str . $mon_str . $month_days;
		$sql_employee = "SELECT * FROM employee WHERE `title` = '其他' AND `state` = '在職'";
		$sql_employee .= " AND "."'$max_date'". " >= DATE_ADD(`startdate`, INTERVAL 1 MONTH) ORDER BY `startdate` DESC";
		$sql_punish = "SELECT `name`, `punishtxt`, `pun_date` FROM punish WHERE  `done` = 0  AND `pun_date` NOT LIKE "."'$mon%'"." ORDER BY `pun_date` ASC";
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
			$arr_res["emp_status"] = "employee success!";
		}else{
			$arr_res["emp_status"] = "employee no data";
		}
		$i=1;
		if (mysqli_num_rows($result_punish) > 0) {
			while($row = mysqli_fetch_array($result_punish)){
				$arr_res["name"][$i] = $row['name'];
				$arr_res["punishtxt"][$i] = $row['punishtxt'];
				$arr_res["pun_date"][$i] = $row['pun_date'];
				$i++;
			}
			$arr_res["pun_status"] = "punish success!";
		}else{
			$arr_res["pun_status"] = "punish no data";
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);
	}else if($object["pload"] == "lastEmp"){
		// $sql_init_last_ind = " UPDATE employee SET `lastIndex` = '0'";
		// if(mysqli_query($mydb_link,$sql_init_last_ind) == TRUE){
			$arr_res["status"] = "update init success";
		// }
		// if(!empty($object["lastEmp"])){
		// 	$lastEmp = $object["lastEmp"];
		// 	$mon = $object["mon"];
		// 	$punishList = $object["punishList"];
		// 	$punishDate = $object["punishDate"];
		// 	$sql_update_last_ind = "UPDATE employee SET `lastIndex` = "."'$mon'". " WHERE `emp_name` = "."'$lastEmp'";
		// 	if(mysqli_query($mydb_link, $sql_update_last_ind) == TRUE){
		// 		$arr_res["status"] = "update punish success";
		// 	}
			// foreach($punishDate as $date){
			// 	$sql_update_punish_done = "UPDATE punish SET `done` = 1 WHERE `pun_date` = "."'$date'";
			// 	if(mysqli_query($mydb_link, $sql_update_punish_done) == TRUE){
			// 		$arr_res["status"] = "update punish success";
			// 	}
			// }
		// }
		echo json_encode($arr_res);

	}
?>