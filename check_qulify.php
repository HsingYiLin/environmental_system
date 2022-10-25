<?php
	header("Content-Type: application/json");
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers:x-requested-with,content-type'); 
	$host = 'localhost';
	$dbuser ='root';
	$dbpassword = 'a12345678';
	$dbname = 'enviroment_db';
	$mydb_link = mysqli_connect($host,$dbuser,$dbpassword,$dbname);

	if($mydb_link->connect_error){
		die('Connection failed: '.$mydb_link->connect_error);
	}

	$requestPayload = file_get_contents("php://input");
	$object = json_decode($requestPayload, true);
  	$arr_res =Array();

    if($object["pload"] == "init"){
        $sql_init = "SELECT `title` FROM employee WHERE `title` = '剪輯組' GROUP BY `title`";
        $result = mysqli_query($mydb_link, $sql_init);
        $i=1;
        if ($result->num_rows > 0) {
            while($row=mysqli_fetch_assoc($result)){
                $arr_res["title"][$i]=$row['title'];
                $i++;
            }
            $arr_res["status"] = "success!";
		}else{
			$arr_res["status"] = "no data";
		}
        $arr_res["result"] = $result;
		echo json_encode($arr_res,true);

    }else if($object["pload"] == "check"){
    	$emp_name = $object["emp_name"];
		$sql_check = "SELECT `emp_name`,`startdate` FROM employee WHERE `emp_name` =" ."'$emp_name'"."AND `emp_name` != '剪輯組'";
		$result = mysqli_query($mydb_link, $sql_check);
		$i=1;
		if ($result->num_rows > 0) {
			while($row=mysqli_fetch_array($result)){
				$arr_res["emp_name"][$i]=$row['emp_name'];
				$arr_res["startdate"][$i]=$row['startdate'];
				$i++;
			}
			$arr_res["status"] = "check!";
		}else{
			$arr_res["status"] = "no data";
		}
		echo json_encode($arr_res);

	}
?>