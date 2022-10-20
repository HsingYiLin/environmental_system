<?php
	header("Content-Type: application/json");
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers:x-requested-with,content-type'); 

	$host = 'localhost';
	$dbuser ='root';
	$dbpassword = 'a12345678';
	$dbname = 'mydb';
	$conn = mysqli_connect($host,$dbuser,$dbpassword,$dbname);

	if(!$conn){
		die('Could not connect: '.mysql_error());
	}

	$requestPayload = file_get_contents("php://input");
	$object = json_decode($requestPayload, true);

	$tb_name = "employee";

	if($object["pload"] == "add_del"){
		$startDate = $object["startDate"];
    	$name = $object["name"];
    	$title = $object["title"];
   	 	$state = $object["state"];
		// $sql = "INSERT INTO".$tb_name."(`name`, `title`, `state`, `startDate`) VALUES (".$name.",".$title.",".$state.",".$startDate.")";
		

		echo $object["startDate"];
		echo $object["name"];
		echo $object["title"];
		echo $object["state"];
	}else{
		$calender = $object["calender"];
   	 	$name = $object["name"];
		echo $object["calender"];
		echo $object["name"];
	}

// 	$con = mysql_connect("localhost", "hello", "321"); 
// if (!$con) 
// { 
// die('Could not connect: ' . mysql_error()); 
// }$db_selected = mysql_select_db("test_db", $con);if (!$db_selected) 
// { 
// die ("Can't use test_db : " . mysql_error()); 
// }mysql_close($con); 
	
	// $sql = "INSERT INTO".$tb_name."(".$name.",".$title2.",".$state.",".$startDate) VALUES (value1, value2, value3...)";

	

	// $param = @$_POST["param"];
	// if(isset($param)){
	// 	echo $param;
	// }else{
	// 	echo "找不到"
	// }

	// if ($result) {
	// 	// mysqli_num_rows方法可以回傳我們結果總共有幾筆資料
	// 	if (mysqli_num_rows($result)>0) {
	// 		// 取得大於0代表有資料
	// 		// while迴圈會根據資料數量，決定跑的次數
	// 		// mysqli_fetch_assoc方法可取得一筆值
	// 		while ($row = mysqli_fetch_assoc($result)) {
	// 			// 每跑一次迴圈就抓一筆值，最後放進data陣列中
	// 			$datas[] = $row;
	// 		}
	// 	}
	// }
	// else {
	// 	echo "{$sql} 語法執行失敗，錯誤訊息: " . mysqli_error($link);
	// }

	// if(!empty($result)){
	// 	print_r($datas);
	// }
	// else {
	// 	echo "查無資料";
	// }



?>
