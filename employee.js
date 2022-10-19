var em_chgpage;
var tbody1;
var em_employee;
var dateObj;
var monObj;
var em_start;
var em_calender;
var em_calender_val;
var em_name;
var em_name_val;
var em_title;
var em_title_val;
var em_status;
var em_status_val;
var em_confirm;
var on_off;
var holi_hide;
//候補

var employ_init = function(){
    console.log("employ_init");
    em_chgpage = document.querySelector("#em_chgpage");
    em_employee = document.getElementById("em_employee");
    em_calender = document.getElementById("em_calender");
    em_name = document.getElementById("em_name");
    em_start = document.getElementById("em_start")
    em_title = document.getElementById("em_title");
    em_confirm = document.getElementById("em_confirm");
    em_status = document.getElementById("em_status");
    on_off = document.getElementById("on_off");
    holi_hide = document.getElementById("holi_hide");
    em_employee.setAttribute("selected", true);
    em_chgpage.addEventListener("change", em_changePage, false);
    // console.log("on_off",on_off);
    on_off.addEventListener("change", shutDown, false);
    em_confirm.addEventListener("click", req_val);
    // dateObj = new Date();
    dynamicTable();
}

var dynamicTable = function (){
    calDate();
    monObj = dateObj.getMonth();
    dateObj.setMonth(monObj + 1);
    dateObj.setDate(0);
    
    var tableLen = dateObj.getDate();
    var tableHTML="";
    var dateSort = ""
   
    tbody1 = document.getElementById("tbody1");
    for(var i =1; i<=tableLen; i++){
        dateObj.setDate(i);
        dateSort = monObj+1+"/"+dateObj.getDate()
        tableHTML +="<tr><td>"+dateSort+"</td><td></td><td></td><td></td><td></td></tr>"
    }
    tbody1.innerHTML += tableHTML;
    tbody1.rows[1].cells[1]. innerHTML = "六";
}

var em_changePage = function (e) {
    if(this.value == "punish"){
        window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
    }
}

var req_val = function (){
    var em_url = "http://localhost:8080/CleanSystem/employee.php"
    const toSend = {
        start: em_start.value.substring(5, 10),
        calender: em_calender.value.substring(5, 10),
        name: em_name.value,
        title: em_title.value,
        status: em_status.checked
    }
    keyInfo(toSend);
    const jsonString = JSON.stringify(toSend);
    console.log(jsonString);
    const xhr = new XMLHttpRequest();
    xhr.open("POST",em_url);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.send(jsonString); 
}

//當輸入日期，判斷禮拜幾，如果開關值為假日，呼叫shutDown()，點擊提交時，順便keyInfo()，根據值日生內容key，充當備註
var calDate = function (y,m,d){
    dateObj =new Date()
    var week = new Date("2022/10/20").getDay();
    // console.log("calDate",week);
   
    

}

//呼叫calDate，計算在哪一行哪一列，輸入資料
var keyInfo = function(obj){
    // console.log("keyInfo",obj);
    // console.log("date",new Date(2022-10-8));
}

//接收開關資料，讓選單無效，值日生以下無效ex:display:none
//onchange 第二個value 監聽
var shutDown = function(e){
    console.log(this.value);
    if(this.value == "holiday"){
        holi_hide.style.display = "none";
    }else{
        holi_hide.style.display = "";
    }
}

