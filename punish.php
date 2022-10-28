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
		$sql_init = "SELECT * FROM punish ORDER BY `name`,`pun_date` ASC";
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

		//是否符合值日生資格
		$sql_pre_add = "SELECT * FROM employee ";
		$sql_pre_add .= " WHERE `emp_name` =" ."'$name'" . " AND `state` = '在職' AND `title` = '其他' ";
		$sql_pre_add .= "AND "."'$date'". " >= DATE_ADD(`startdate`, INTERVAL 1 MONTH)";
		$result_add = mysqli_query($mydb_link, $sql_pre_add);
		if (mysqli_num_rows($result_add) == 0) {
            $arr_res["status"] = "no data";
            echo json_encode($arr_res);
            die();
			mysqli_close($mydb_link);
		}

		//日期不能重複
		// $sql_duplicate = "SELECT `name`, `pun_date` FROM punish WHERE `name` = "."'$name'" ." AND `pun_date` = "."'$date'";
		// $result_duplicate = mysqli_query($mydb_link, $sql_duplicate);
		// if (!empty($result_duplicate)) {
        //     $arr_res["status"] = "date duplicate";
        //     echo json_encode($arr_res);
        //     die();
		// 	mysqli_close($mydb_link);
		// }

		//起始罰金
		$init_fine = 10;
		//計算此筆員工前三個月有幾筆
		$sql_cnt_add = "SELECT COUNT(`name`) as cnt FROM punish";
		$sql_cnt_add .= " WHERE `name`= "."'$name'"." AND `pun_date` > DATE_SUB("."'$date'".", INTERVAL 3 MONTH) AND `pun_date` < "."'$date'";
		$result_cnt_add = mysqli_query($mydb_link, $sql_cnt_add);
		
		$row_add = mysqli_fetch_assoc($result_cnt_add);
		$cnt_data_add = $row_add["cnt"]+1;//包括此筆新增
		$odds_add = pow(2, $cnt_data_add-1);
		$fine_data_add = $init_fine * $odds_add;		
		$sql_add = "INSERT INTO punish (`name`, `punishtxt`, `pun_date`, `fine`, `times`, `odds` )";
		$sql_add .= " VALUES (" ."'$name'". ", " ."'$punishtxt'". ", " ."'$date'".", " ."'$fine_data_add'".", " ."'$cnt_data_add'".", " ."'$odds_add'".")";
		if($mydb_link->query($sql_add) === TRUE){
			$arr_res["status"] = "add success";
		}

		//計算此筆如果是途中插入，此筆後面有幾筆要更新
		$sql_cnt_update = "SELECT `pun_date`, `fine`, `times`, `odds` FROM punish";
		$sql_cnt_update .= " WHERE `name` = "."'$name'" . " AND `pun_date` >" ."'$date'" . " AND `pun_date` < DATE_ADD("."'$date'".", INTERVAL 3 MONTH)";
		$result_cnt_update = mysqli_query($mydb_link, $sql_cnt_update);
		if(!empty($result_cnt_update)){
			$i = 1;
			while($row_update = mysqli_fetch_assoc($result_cnt_update)){
				$date_update[$i] = $row_update["pun_date"];
				$fine_data_update[$i] = $row_update["fine"] * 2;
				$times_update[$i]= $row_update["times"] + 1;
				$odds_update[$i] = $row_update["odds"] * 2;
				$sql_update_add = "UPDATE punish SET fine = "."$fine_data_update[$i]".", times = "."$times_update[$i]".", odds = "."$odds_update[$i]";
				$sql_update_add .=" WHERE `name` = "."'$name'" . " AND `pun_date` = " ."'$date_update[$i]'";
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
		$sql_select = "SELECT * FROM punish WHERE `name` =" ."'$name'"." AND `pun_date` = "."'$date'";
		$sql_select .= " OR `name` = "."'$name'"." OR `pun_date` = "."'$date'"." ORDER BY `name`,`pun_date` ASC";
		$result_select = mysqli_query($mydb_link, $sql_select);
		$i=1;
		if ($result_select->num_rows > 0) {
			while($row=mysqli_fetch_assoc($result_select)){
				$arr_res["name"][$i]=$row['name'];
				$arr_res["punishtxt"][$i]=$row['punishtxt'];
				$arr_res["date"][$i]=$row['pun_date'];
				$arr_res["fine"][$i]=$row['fine'];
				$arr_res["times"][$i]=$row['times'];
				$arr_res["odds"][$i]=$row['odds'];

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
		$sql_update = "UPDATE punish SET `punishtxt` =" ."'$punishtxt'" . "WHERE `name` =" ."'$name'"." AND `pun_date` ="."'$date' ";
		if(mysqli_query($mydb_link, $sql_update) && $mydb_link->affected_rows > 0){
			$arr_res["status"] = "update success";
		}else{
			$arr_res["status"] = "update fail";
			$arr_res["error"] =mysqli_error($mydb_link);
		}
		echo json_encode($arr_res);
		mysqli_close($mydb_link);

	}else if($object["pload"] == "delete"){
		$name = $object["name"];
		$date = $object["date"];
		$sql_pre_delete = "SELECT `name` FROM punish WHERE `name` =" ."'$name'"." AND `pun_date` ="."'$date' ";
		$result_pre_delete = mysqli_query($mydb_link, $sql_pre_delete);
		$arr_res["sql_pre_delete"] = $sql_pre_delete;
		if (mysqli_num_rows($result_pre_delete) == 0) {
			$arr_res["status"] = "no data";
			echo json_encode($arr_res);
			die();
			mysqli_close($mydb_link);
		} 
		$sql_delete = "DELETE FROM punish WHERE `name` =" ."'$name'"." AND `pun_date` ="."'$date' ";
		if(mysqli_query($mydb_link, $sql_delete)){
			$arr_res["status"] = "delete success";
		}

		//起始罰金
		$init_fine = 10;
		$sql_cnt_update = "SELECT `pun_date`, `fine`, `times`, `odds` FROM punish";
		$sql_cnt_update .= "  WHERE `name` = "."'$name'" . " AND `pun_date` >" ."'$date'" . " AND `pun_date` < DATE_ADD("."'$date'".", INTERVAL 3 MONTH)";
		$result_cnt_update = mysqli_query($mydb_link, $sql_cnt_update);
		
		if(!empty($result_cnt_update)){
			$i = 1;
			while($row_update = mysqli_fetch_assoc($result_cnt_update)){
				$date_update[$i] = $row_update["pun_date"];
				$fine_data_update[$i] = $row_update["fine"] / 2;
				$times_update[$i]= $row_update["times"] - 1;
				$odds_update[$i] = $row_update["odds"] / 2;
				$sql_update_add = "UPDATE punish SET fine = "."$fine_data_update[$i]".", times = "."$times_update[$i]".", odds = "."$odds_update[$i]";
				$sql_update_add .=" WHERE `name` = "."'$name'" . " AND `pun_date` = " ."'$date_update[$i]'";
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
    }
?>