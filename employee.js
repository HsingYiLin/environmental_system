var em_chgpage;
var pre_edit;
var monList;
var clean_comp;
var em_edit;
var pre_confirm;

var em_employee;
var dateObj;
var em_calender;
var on_off;
var em_name;
var em_txt;
var workDateForm;
var em_confirm;
var em_stateInfo;
var em_tbody;
var seq_Url = "http://localhost:8080/CleanSystem/sequence.php";
const xmlhttp =new XMLHttpRequest();
var em_toSend = {};
var dateName;
var datePunish;
var parseStr = "";
var daysLen = "";
var year = 2022;
var month = 9;
var isPreEdit = false;
var tableHTML="";
//邏輯交給後段判斷
//前端負責表格修改的部分
//前端修改的部分整張存入資料庫

var employ_init = function(){
    console.log("employ_init");
    em_chgpage = document.querySelector("#em_chgpage");
    pre_edit = document.getElementById("pre_edit");
    monList = document.getElementById("monList");
    clean_comp = document.getElementById("clean_comp");
    em_edit = document.getElementById("em_edit");
    pre_confirm  = document.getElementById("pre_confirm");
    em_tbody = document.getElementById("em_tbody");
    em_chgpage.addEventListener("change", em_changePage, false);
    em_edit.style.display = "none";
    dateObj =new Date();
    dynamicTable();
    pre_confirm.addEventListener("click", function(){
        isPreEdit = (monList.value != "" && clean_comp.value != "")? true:false;
        if(isPreEdit){
            em_edit.style.display = "";
            pre_edit.style.display = "none";
            actionDB("init");
            
            em_employee = document.getElementById("em_employee");
            em_calender = document.getElementById("em_calender");
            em_name = document.getElementById("em_name");
            em_confirm = document.getElementById("em_confirm");
            em_stateInfo = document.getElementById("em_stateInfo");
            on_off = document.getElementById("on_off");
            em_txt = document.getElementById("em_txt");
            workDateForm = document.getElementById("workDateForm");
    
            em_employee.setAttribute("selected", true);
            em_confirm.addEventListener("click", req_val);
    
            dynamicTable();
            var tmp = judgeDate(year,month);
            console.log(tmp);
            dateName = document.getElementsByClassName("dateName");
            datePunish = document.getElementsByClassName("datePunish"); 
            parseTable();
        }
    })
    
}

var dynamicTable = function (){
    var dateSort = "", arr_data;
    em_tbody.innerHTML = "<tr class=first_tr><td>日期</td><td class = dateName>值日生</td><td class = datePunish>懲罰</td><td>候補</td></tr>"
    var monObj;
    monObj = dateObj.getMonth();
    dateObj.setMonth(monList.value.substring(8, 10) + 1);
    dateObj.setDate(0);
    daysLen = dateObj.getDate();
    if(arr_data != undefined){
        for(var i =1; i<=daysLen; i++){
            dateObj.setDate(i);
            dateSort = monObj+1+"/"+dateObj.getDate();
            tableHTML +="<tr><td>"+dateSort+"</td><td class = dateName></td><td class = datePunish></td><td></td></tr>"
        }
        em_tbody.innerHTML += tableHTML;
    }
}

var actionDB = function(params) {
    // var tmpDate = em_calender.value.substring(8, 10);

    switch(params){
        case "init":
            console.log(monList.value);
            em_toSend = {
                pload: "init",
                mon: monList.value,
                days: daysLen
            }   
            httpReqFun(em_toSend);
    }
}

var httpReqFun = function (param){
    var arr_data;
    jsonString = JSON.stringify(param);
    xmlhttp.open("POST",seq_Url);
    xmlhttp.setRequestHeader("Content-Type","application/json");
    xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState === 4 && xmlhttp.status == 200){
            arr_data = JSON.parse(xmlhttp.responseText);
            setTimeout(function(){
                // pun_stateInfo.innerText = "";
            },3000);
           if(arr_data["status"]=="success!"){
                sortData(arr_data);
                
            }      
        }
    }
    xmlhttp.send(jsonString);
}

var sortData = function(data){
    console.log("sortData",data);
    console.log(data["emp_name"]);
}


var parseTable = function (intent){    
    // for(date2=1; date2 <= daysLen; date2++){
    //     var dateJudgeDate2 = new Date(year,month, date2);
    //     dataNameEl =dateName[date2-1];
    //     switch(dateJudgeDate2.getDay()){
    //         case 0:
    //             dataNameEl.innerText = "日";
    //             dataNameEl.style.backgroundColor = "#FFD1A4";
    //             break;
    //         case 6:
    //             dataNameEl.innerText = "六";
    //             dataNameEl.style.backgroundColor = "#FFD1A4";
    //             break;
    //         case 4:
    //             dataNameEl.innerText = "清潔公司";
    //             dataNameEl.style.backgroundColor = "#E0E0E0";
    //             break;
    //     }
    // }
}

//判斷第一個完整禮拜&六日
var judgeDate = function(y,m){
    var retObj = Array();
    var isFirstMon = true;
    for(var i=1; i <= daysLen; i++){
        var dateJudgeDate1 = new Date(y, m, i);
        if(isFirstMon && dateJudgeDate1.getDay() == 1){
            retObj[i] = 1;
            isFirstMon = false;
        }
    }
    return retObj;
}

var judgeHoliday = function (){

}

var req_val = function (){
    var tmpDate = em_calender.value.substring(8, 10);
    dateName[tmpDate-1].innerText = em_name.value;
    datePunish[tmpDate-1].innerText = em_txt.value;
}

var loadFinish = function (initData){ 
    var tmpDate = em_calender.value.substring(8, 10);
    console.log("loadFinish");
    dateName[tmpDate-1].innerText = em_name.value;
    datePunish[tmpDate-1].innerText = em_txt.value;
}

var em_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html");
}