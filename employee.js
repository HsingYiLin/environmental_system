var em_chgpage;
var em_employee;
var dateObj;
var monObj;
var em_startDate;
var em_calender;
var em_calender_val;
var em_name;
var em_name_val;
var em_title;
var em_title_val;
// var em_status;
// var em_status_val;
var em_confirm;
var on_off;
var holi_hide;
var tbody1;

//候補

var employ_init = function(){
    console.log("employ_init");
    em_chgpage = document.querySelector("#em_chgpage");
    em_employee = document.getElementById("em_employee");
    em_calender = document.getElementById("em_calender");
    em_name = document.getElementById("em_name");
    em_startDate = document.getElementById("em_startDate")
    em_title = document.getElementById("em_title");
    em_confirm = document.getElementById("em_confirm");
    // em_status = document.getElementById("em_status");
    on_off = document.getElementById("on_off");
    holi_hide = document.getElementById("holi_hide");
    tbody1 = document.getElementById("tbody1");

    em_employee.setAttribute("selected", true);
    em_chgpage.addEventListener("change", em_changePage, false);
    on_off.addEventListener("change", shutDown, false);
    em_confirm.addEventListener("click", req_val);

    dateObj =new Date()
    dynamicTable();
}

var dynamicTable = function (){
    // calDate();
    monObj = dateObj.getMonth();
    dateObj.setMonth(monObj + 1);
    dateObj.setDate(0);
    
    var tableLen = dateObj.getDate();
    var tableHTML="";
    var dateSort = ""
   
    for(var i =1; i<=tableLen; i++){
        dateObj.setDate(i);
        dateSort = monObj+1+"/"+dateObj.getDate()
        tableHTML +="<tr><td>"+dateSort+"</td><td></td><td></td></tr>"
    }
    tbody1.innerHTML += tableHTML;
    // tbody1.rows[1].cells[1].innerHTML = "六";
    // tbody1.rows[2].cells[1].innerHTML = "日";

}

var em_changePage = function (e) {
    // if(this.value == "punish"){
        window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
    // }
}

var req_val = function (){
    var em_url = "http://localhost:8080/CleanSystem/employee.php"
    console.log("on_off.value", on_off.value);
    var row = calDate();
    console.log("row",row);
    var toSend ={
        pload: "employee",
        calender: em_calender.value.substring(5, 10),
        name: em_name.value
    };
       
    keyInfo(toSend);
    const jsonString = JSON.stringify(toSend);
    console.log(jsonString);
    const xhr = new XMLHttpRequest();
    xhr.open("POST",em_url);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.send(jsonString); 
}

//當輸入日期，判斷禮拜幾，如果開關值為假日，呼叫shutDown()，點擊提交時，順便keyInfo()，根據值日生內容key，充當備註
//計算第幾行幾列
var calDate = function (){
    // var day_list = ['日', '一', '二', '三', '四', '五', '六'];
    tmpDate = em_calender.value.substring(8, 10);
    console.log("tmpDate",tmpDate);
    // var week = day_list[new Date(tmpDate).getDay()];
    // console.log("calDate",week);
   return tmpDate;
    

}

//呼叫calDate，計算在哪一行哪一列，輸入資料
var keyInfo = function(obj){
    // console.log("keyInfo",obj);
    // console.log("date",new Date(2022-10-8));
}

//接收開關資料，讓選單無效，值日生以下無效ex:display:none
//onchange 第二個value 監聽
var shutDown = function(e){
    // console.log(this.value);
    if(this.value == "holiday"){
        holi_hide.style.display = "none";
    }else{
        holi_hide.style.display = "";
    }
}

