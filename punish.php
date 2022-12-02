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
		$sql_init = "SELECT * FROM punish WHERE `pun_del` != 'D' ORDER BY `name`, `pun_date` ASC";
		$result_init = mysqli_query($mydb_link, $sql_init);
		$i=1;
		if ($result_init->num_rows > 0) {
			while($row=mysqli_fetch_array($result_init)){
				$arr_res["date"][$i]=$row['pun_date'];
				$arr_res["name"][$i]=$row['name'];
				$arr_res["punishtxt"][$i]=$row['punishtxt'];
				$arr_res["times"][$i]=$row['times'];
                $arr_res["fine"][$i]=$row['fine'];
                $arr_res["odds"][$i]=$row['odds'];
				$arr_res["pun_done"][$i]=$row['pun_done'];
				$i++;
			}
			$arr_res["status"] = "success!";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "add"){
		$date = $object["date"];
    	$name = $object["name"];
    	$punishtxt = $object["punishtxt"];

		if($name == "剪輯組"){
			$name = "剪輯組";
		}else{
			//是否符合值日生資格
			$sql_pre_add = "SELECT * FROM employee ";
			$sql_pre_add .= " WHERE `emp_name` =" ."'$name'" . " AND `state` = '在職' AND `title` = '其他'";
			$sql_pre_add .= " AND "."'$date'"." >= DATE_ADD(`startdate`, INTERVAL 1 MONTH)";
			$result_add = mysqli_query($mydb_link, $sql_pre_add);
			if (mysqli_num_rows($result_add) == 0) {
				$arr_res["status"] = "no data";
				echo json_encode($arr_res);
				die();
				mysqli_close($mydb_link);
			}
		}

		//檢查是否有同人同日期
		$sql_check_duplicate = "SELECT COUNT(*) as cnt FROM punish WHERE `name` = "."'$name'"." AND `pun_date` = "."'$date'"." AND `pun_del` != 'D'";
		$result_check = mysqli_query($mydb_link, $sql_check_duplicate);
		$row_data = mysqli_fetch_assoc($result_check);
		if($row_data["cnt"] > 0){
			$arr_res["status"] = "date duplicate";
			echo json_encode($arr_res);
			die();
			mysqli_close($mydb_link);
		}
		
		//起始罰金
		$init_fine = 300;
		//計算此筆員工前三個月有幾筆
		$sql_cnt_add = "SELECT COUNT(`name`) as cnt FROM punish WHERE `name`= "."'$name'"." AND `pun_del` != 'D'";
		$sql_cnt_add .= " AND `pun_date` > DATE_SUB("."'$date'".", INTERVAL 3 MONTH) AND `pun_date` < "."'$date'";
		$result_cnt_add = mysqli_query($mydb_link, $sql_cnt_add);
		$row_add = mysqli_fetch_assoc($result_cnt_add);
		$cnt_data_add = $row_add["cnt"]+1;//包括此筆新增
		$odds_add = pow(2, $cnt_data_add-1);
		$fine_data_add = $init_fine * $odds_add;		
		$sql_add = "INSERT INTO punish (`name`, `punishtxt`, `pun_date`, `fine`, `times`, `odds`, `pun_done` )";
		$sql_add .= " VALUES (" ."'$name'". ", " ."'$punishtxt'". ", " ."'$date'".", " ."'$fine_data_add'".", " ."'$cnt_data_add'".", " ."'$odds_add'".", '')";
		if($mydb_link->query($sql_add) === TRUE){
			$arr_res["status"] = "add success";
		}

		//計算此筆如果是途中插入，此筆後面有幾筆要更新
		$sql_cnt_update = "SELECT * FROM punish WHERE `name` = "."'$name'" . " AND `pun_del` != 'D'";
		$sql_cnt_update .= " AND `pun_date` > "."'$date'"." AND `pun_date` < DATE_ADD("."'$date'".", INTERVAL 3 MONTH)";
		$arr_res["sql_cnt_update"] = $sql_cnt_update;
		$result_cnt_update = mysqli_query($mydb_link, $sql_cnt_update);
		if(!empty($result_cnt_update)){
			$i = 1;
			while($row_update = mysqli_fetch_assoc($result_cnt_update)){
				$date_update[$i] = $row_update["pun_date"];
				$fine_data_update[$i] = $row_update["fine"] * 2;
				$times_update[$i]= $row_update["times"] + 1;
				$odds_update[$i] = $row_update["odds"] * 2;
				$sql_update_add = "UPDATE punish SET fine = "."$fine_data_update[$i]".", times = "."$times_update[$i]".", odds = "."$odds_update[$i]";
				$sql_update_add .=" WHERE `name` = "."'$name'" . " AND `pun_del` != 'D' AND `pun_date` = " ."'$date_update[$i]'";
				if(mysqli_query($mydb_link, $sql_update_add) && $mydb_link->affected_rows > 0){
					$arr_res["status"] = "update success";
				}else{
					$arr_res["status"] = "update fail";
				}
				$i++;
			}
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "select"){
		$name = $object["name"];
		$date = $object["date"];
		$sql_select = "SELECT * FROM punish WHERE (`name` =" ."'$name' OR `pun_date` = "."'$date'".") AND `pun_del` != 'D' ORDER BY `name`,`pun_date` ASC";
		$result_select = mysqli_query($mydb_link, $sql_select);
		$i=1;
		if ($result_select->num_rows > 0) {
			while($row=mysqli_fetch_assoc($result_select)){
				$arr_res["name"][$i] = $row['name'];
				$arr_res["punishtxt"][$i] = $row['punishtxt'];
				$arr_res["date"][$i] = $row['pun_date'];
				$arr_res["fine"][$i] = $row['fine'];
				$arr_res["times"][$i] = $row['times'];
				$arr_res["odds"][$i] = $row['odds'];
				$arr_res["pun_done"][$i] = $row['pun_done'];
				$i++;		
			}
			$arr_res["status"] = "select success";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "update"){
    	$date = $object["date"];
    	$name = $object["name"];
   	 	$punishtxt = $object["punishtxt"];
		$punolddate = $object["punolddate"];
		$punoldtxt = $object["punoldtxt"];
		$sql_startdate = "SELECT `startdate` FROM employee WHERE `emp_name` = "."'$name'";
		$result_startdate = mysqli_query($mydb_link, $sql_startdate);
		$startdate = Array();
		$i=1;
		if ($result_startdate->num_rows > 0){
			while($row=mysqli_fetch_array($result_startdate)){
				$startdate[$i] = $row['startdate'];
				$i++;
			}
		}
		//變更前 後三個月做除法減法
		$sql_pre_select = "SELECT * FROM punish WHERE `name` = "."'$name'"."AND `pun_del` != 'D' AND `pun_date` > "."'$punolddate'";
		$sql_pre_select .= " AND `pun_date` < DATE_ADD("."'$punolddate'".", INTERVAL 3 MONTH)";
		$result_pre_select = mysqli_query($mydb_link, $sql_pre_select);
		if(!empty($result_pre_select)){
			$i = 1;
			while($row_select = mysqli_fetch_assoc($result_pre_select)){
				$date_select[$i] = $row_select["pun_date"];
				$fine_data_select[$i] = $row_select["fine"] / 2;
				$times_select[$i]= $row_select["times"] - 1;
				$odds_select[$i] = $row_select["odds"] / 2;
				$sql_pre_update = "UPDATE punish SET fine = "."$fine_data_select[$i]".", times = "."$times_select[$i]".", odds = "."$odds_select[$i]";
				$sql_pre_update .=" WHERE `name` = "."'$name'" . " AND `pun_del` != 'D' AND `pun_date` = " ."'$date_select[$i]'";
				if(mysqli_query($mydb_link, $sql_pre_update) && $mydb_link->affected_rows > 0){
					$arr_res["status"] = "update success";
				}else{
					$arr_res["status"] = "update fail";
				}
				$i++;
			}
		}

		//判斷變更位子前面有幾筆 做修改
		$init_fine = 300;
		$cnt_data_update = 0;
		$odds_update = 0;
		$fine_data_update = 0;
		$sql_cnt_update = "SELECT COUNT(`name`) as cnt FROM punish WHERE `name`= "."'$name'"." AND `pun_del` != 'D'";
		$sql_cnt_update .= " AND `pun_date` != "."'$punolddate'"." AND `pun_date` > DATE_SUB("."'$date'".", INTERVAL 3 MONTH) AND `pun_date` < "."'$date'";
		$result_cnt_update = mysqli_query($mydb_link, $sql_cnt_update);
		$row_update = mysqli_fetch_assoc($result_cnt_update);
		$cnt_data_update = $row_update["cnt"]+1;//包括此筆新增
		$odds_update = pow(2, $cnt_data_update-1);
		$fine_data_update = $init_fine * $odds_update;
		$sql_update = "UPDATE punish SET `punishtxt` = "."'$punishtxt'".", `pun_date` = "."'$date'".", `fine` = "."'$fine_data_update'".", `times` = "."'$cnt_data_update'".", `odds` = "."'$odds_update'";
		$sql_update .= " WHERE `name` = "."'$name'"." AND `pun_date` = "."'$punolddate'"." AND `punishtxt` = "."'$punoldtxt'"." AND `pun_del` != 'D'";
		$sql_update .= " AND "."'$date'". " >= DATE_ADD("."'$startdate[1]'".", INTERVAL 1 MONTH)";
		if(mysqli_query($mydb_link, $sql_update) && $mydb_link->affected_rows > 0){
			$arr_res["status"] = "update success";
		}else{
			$arr_res["status"] = "update fail";
			$arr_res["error"] = mysqli_error($mydb_link);
		}

		// 計算此筆如果是途中插入，此筆後面有幾筆要更新
		$sql_cnt_update = "SELECT * FROM punish WHERE `name` = "."'$name'" . " AND `pun_del` != 'D'";
		$sql_cnt_update .= " AND `pun_date` > "."'$date'"." AND `pun_date` < DATE_ADD("."'$date'".", INTERVAL 3 MONTH)";
		$result_cnt_update = mysqli_query($mydb_link, $sql_cnt_update);
		if(!empty($result_cnt_update)){
			$i = 1;
			while($row_update = mysqli_fetch_assoc($result_cnt_update)){
				$date_update[$i] = $row_update["pun_date"];
				$fine_data_update2[$i] = $row_update["fine"] * 2;
				$times_update2[$i]= $row_update["times"] + 1;
				$odds_update2[$i] = $row_update["odds"] * 2;
				$sql_update_add = "UPDATE punish SET fine = "."$fine_data_update2[$i]".", times = "."$times_update2[$i]".", odds = "."$odds_update2[$i]";
				$sql_update_add .=" WHERE `name` = "."'$name'" . " AND `pun_del` != 'D' AND `pun_date` = " ."'$date_update[$i]'";
				if(mysqli_query($mydb_link, $sql_update_add) && $mydb_link->affected_rows > 0){
					$arr_res["status"] = "update success";
				}else{
					$arr_res["status"] = "update fail";
				}
				$i++;
			}
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "delete"){
		$name = $object["name"];
		$date = $object["date"];
		$sql_pre_delete = "SELECT `name` FROM punish WHERE `name` =" ."'$name'"." AND `pun_del` != 'D' AND `pun_date` ="."'$date' ";
		$result_pre_delete = mysqli_query($mydb_link, $sql_pre_delete);
		if (mysqli_num_rows($result_pre_delete) == 0) {
			$arr_res["status"] = "no data";
			echo json_encode($arr_res);
			die();
			mysqli_close($mydb_link);
		} 

		$sql_delete = "UPDATE punish SET `pun_del` = 'D' WHERE `name` =" ."'$name'"." AND `pun_date` ="."'$date'";
		if(mysqli_query($mydb_link, $sql_delete)){
			$arr_res["status"] = "delete success";
		}

		//起始罰金
		$init_fine = 300;
		$sql_cnt_update = "SELECT `pun_date`, `fine`, `times`, `odds` FROM punish";
		$sql_cnt_update .= "  WHERE `name` = "."'$name'"." AND `pun_del` != 'D' AND `pun_date` >" ."'$date'" . " AND `pun_date` < DATE_ADD("."'$date'".", INTERVAL 3 MONTH)";
		$result_cnt_update = mysqli_query($mydb_link, $sql_cnt_update);
		if(!empty($result_cnt_update)){
			$i = 1;
			while($row_update = mysqli_fetch_assoc($result_cnt_update)){
				$date_update[$i] = $row_update["pun_date"];
				$fine_data_update[$i] = $row_update["fine"] / 2;
				$times_update[$i]= $row_update["times"] - 1;
				$odds_update[$i] = $row_update["odds"] / 2;
				$sql_update_add = "UPDATE punish SET fine = "."$fine_data_update[$i]".", times = "."$times_update[$i]".", odds = "."$odds_update[$i]";
				$sql_update_add .=" WHERE `name` = "."'$name'" . " AND `pun_date` = " ."'$date_update[$i]'"." AND `pun_del` != 'D'";
				if(mysqli_query($mydb_link, $sql_update_add) && $mydb_link->affected_rows > 0){
					$arr_res["status"] = "update success";
				}else{
					$arr_res["status"] = "update fail";
				}
				$i++;
			}
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);
	
    }else if($object["pload"] == "opt"){
		$sql_employee = "SELECT `emp_name` FROM employee WHERE `title` = '其他' AND `state` = '在職' AND `del` != 'D' ORDER BY `startdate` DESC";
		$i=1;
		$result_opt = mysqli_query($mydb_link, $sql_employee);
		if ($result_opt->num_rows > 0) {
			while($row=mysqli_fetch_array($result_opt)){
				$arr_res["emp_name"][$i] = $row['emp_name'];
				$i++;
			}
			$arr_res["status"] = "opt success";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);
	}
?>