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
		$sql_employee = "SELECT * FROM employee WHERE `title` = '其他' AND `state` = '在職'";
		$sql_employee .= " AND '2022-10-31' >= DATE_ADD(`startdate`, INTERVAL 1 MONTH) ORDER BY `startdate` DESC";
		$sql_punish = "SELECT `name`, `punishtxt`, `pun_date` FROM punish WHERE `pun_date` NOT LIKE "."'$mon%'"." ORDER BY `pun_date` ASC";
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
		$sql_init_last_ind = " UPDATE employee SET `lastIndex` = '0'";
		if(mysqli_query($mydb_link,$sql_init_last_ind) == TRUE){
			$arr_res["status"] = "update init success";
		}
		if(!empty($object["lastEmp"])){
			$lastEmp = $object["lastEmp"];
			$mon = $object["mon"];
			$sql_update_last_ind = "UPDATE employee SET `lastIndex` = "."'$mon'". " WHERE `emp_name` = "."'$lastEmp'";
			if(mysqli_query($mydb_link,$sql_update_last_ind) == TRUE){
				$arr_res["status"] = "update success";
			}
		}
		echo json_encode($arr_res);

	}
	//console.log(1%12);//1
    //console.log(2%12);//2
    //console.log(3%12);//3
    //console.log(4%12);//4
    // console.log(5%12);//5
    // console.log(6%12);//6
    // console.log(7%12);//7
    // console.log(8%12);//8
    // console.log(9%12);//9
    // console.log(10%12);//10
    // console.log(11%12);//11
    // console.log(12%12);//0
    // console.log(13%12);//1
    // console.log(14%12);//2
?>