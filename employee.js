var em_chgpage;
var em_employee;
var dateObj;
var em_calender;
var on_off;
var holidaysDiv;
var em_name;
var em_txt;
var workDateForm;
var cleanComp;
var em_confirm;
var em_stateInfo;
var tbody1;
var chk_url = "http://localhost:8080/CleanSystem/sequence.php";
const xmlhttp =new XMLHttpRequest();
var em_toSend = {};
var isQualify = false;
var dateName;
var datePunish;
var parseStr = "";
var tableLen;
var year = 2022;
var month = 9;
//邏輯交給後段判斷
//前端負責表格修改的部分
//前端修改的部分整張存入資料庫

var employ_init = function(){
    console.log("employ_init");
    actionDB("init");
    em_chgpage = document.querySelector("#em_chgpage");
    em_employee = document.getElementById("em_employee");
    em_calender = document.getElementById("em_calender");
    em_name = document.getElementById("em_name");
    holidaysDiv = document.getElementById("holidaysDiv");
    cleanComp = document.getElementById("cleanComp");
    em_confirm = document.getElementById("em_confirm");
    em_stateInfo = document.getElementById("em_stateInfo");
    on_off = document.getElementById("on_off");
    em_txt = document.getElementById("em_txt");
    workDateForm = document.getElementById("workDateForm");
    tbody1 = document.getElementById("tbody1");

    em_employee.setAttribute("selected", true);
    em_chgpage.addEventListener("change", em_changePage, false);
    on_off.addEventListener("change", formChg);
    em_confirm.addEventListener("click", req_val);

    dateObj =new Date();
    dynamicTable();
    var tmp = judgeDate(year,month);
    console.log(tmp);
    dateName = document.getElementsByClassName("dateName");
    datePunish = document.getElementsByClassName("datePunish"); 
    parseTable();

}

var dynamicTable = function (){
    var monObj;
    monObj = dateObj.getMonth();
    dateObj.setMonth(monObj + 1);
    dateObj.setDate(0);
    tableLen = dateObj.getDate();
    var tableHTML="", dateSort = ""
    for(var i =1; i<=tableLen; i++){
        dateObj.setDate(i);
        dateSort = monObj+1+"/"+dateObj.getDate();
        tableHTML +="<tr><td>"+dateSort+"</td><td class = dateName></td><td class = datePunish></td><td></td></tr>"
    }
    tbody1.innerHTML += tableHTML;

}

var actionDB = function(params) {
    switch(params){
        case "init":
            em_toSend = {
                pload: "init"
            }   
            httpReqFun(em_toSend);
    }
}

var parseTable = function (intent){    
    for(date2=1; date2 <= tableLen; date2++){
        var dateJudgeDate2 = new Date(year,month, date2);
        dataNameEl =dateName[date2-1];
        switch(dateJudgeDate2.getDay()){
            case 0:
                dataNameEl.innerText = "日";
                dataNameEl.style.backgroundColor = "#FFD1A4";
                break;
            case 6:
                dataNameEl.innerText = "六";
                dataNameEl.style.backgroundColor = "#FFD1A4";
                break;
            case 4:
                dataNameEl.innerText = "清潔公司";
                dataNameEl.style.backgroundColor = "#E0E0E0";
                break;
        }
    }
}

//判斷第一個完整禮拜&六日
var judgeDate = function(y,m){
    var retObj = Array();
    var isFirstMon = true;
    for(var i=1; i <= tableLen; i++){
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



var httpReqFun = function (param){
    var arr_data;
    jsonString = JSON.stringify(param);
    xmlhttp.open("POST",chk_url);
    xmlhttp.setRequestHeader("Content-Type","application/json");
    xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState === 4 && xmlhttp.status == 200){
            arr_data = JSON.parse(xmlhttp.responseText);
            console.log("httpReqFun",arr_data);
            setTimeout(function(){
                // pun_stateInfo.innerText = "";
            },3000);
            if(arr_data["status"]=="check"){
                loadFinish(arr_data);
            }else if(arr_data["status"]=="success!"){
                parseStr =arr_data.title[1]
                parseTable();
            }      
        }
    }
    xmlhttp.send(jsonString);
}

var loadFinish = function (initData){ 
    var tmpDate = em_calender.value.substring(8, 10);
    console.log("loadFinish");
    dateName[tmpDate-1].innerText = em_name.value;
    datePunish[tmpDate-1].innerText = em_txt.value;
}

var formChg = function (){
    if(on_off.value == "holiday"){
        holidaysDiv.style.display = "";
        workDateForm.style.display = "none";
    }else{
        holidaysDiv.style.display = "none";
        workDateForm.style.display = "";
    }
}

var em_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html");
}