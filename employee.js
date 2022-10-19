var em_chgpage;
var tbody1;
var em_employee;
var curDate;
var curMonth;
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
var req_arr = Array();
//候補

var employ_init = function(){
    console.log("employ_init");
    em_chgpage = document.querySelector("#em_chgpage");
    em_employee = document.getElementById("em_employee");
    em_start = document.getElementById("em_start")
    em_calender = document.getElementById("em_calender");
    em_name = document.getElementById("em_name");
    em_title = document.getElementById("em_title");
    em_confirm = document.getElementById("em_confirm");
    em_status = document.getElementById("em_status");


    em_employee.setAttribute("selected", true);
    em_chgpage.addEventListener("change", em_changePage, false);
    em_confirm.addEventListener("click", req_val)
    dynamicTable();
}

var dynamicTable = function (){
    curDate = new Date();
    curMonth = curDate.getMonth();
    curDate.setMonth(curMonth + 1);
    curDate.setDate(0);
    
    var tableLen = curDate.getDate();
    var tableHTML="";
    var dateSort = ""
   
    tbody1 = document.getElementById("tbody1");
    for(var i =1; i<=tableLen; i++){
        curDate.setDate(i);
        dateSort = curMonth+1+"/"+curDate.getDate()
        tableHTML +="<tr><td>"+dateSort+"</td><td></td><td></td><td></td><td></td></tr>"
    }
    tbody1.innerHTML += tableHTML;
    tbody1.rows[1].cells[1]. innerHTML = "六";
}

var em_changePage = function (e) {
    console.log("em_changePage");
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

    const jsonString = JSON.stringify(toSend);
    console.log(jsonString);
    const xhr = new XMLHttpRequest();
    xhr.open("POST",em_url);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.send(jsonString); 
}

