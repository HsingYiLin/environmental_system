var em_chgpage;
var em_employee;
var dateObj;
var em_calender;
var on_off;
var em_name;
var em_txt;
var em_confirm;
var em_stateInfo;
var tbody1;
var chk_url = "http://localhost:8080/CleanSystem/check_qulify.php";
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
    em_chgpage = document.querySelector("#em_chgpage");
    em_employee = document.getElementById("em_employee");
    em_calender = document.getElementById("em_calender");
    em_name = document.getElementById("em_name");
    em_confirm = document.getElementById("em_confirm");
    em_stateInfo = document.getElementById("em_stateInfo");
    on_off = document.getElementById("on_off");
    em_txt = document.getElementById("em_txt");
    tbody1 = document.getElementById("tbody1");

    em_employee.setAttribute("selected", true);
    em_chgpage.addEventListener("change", em_changePage, false);
    em_confirm.addEventListener("click", req_val);

    dateObj =new Date();
    actionDB("init");
    dynamicTable();
    dateName = document.getElementsByClassName("dateName");
    datePunish = document.getElementsByClassName("datePunish");

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

var parseTable = function (){
    var clipdate = judgeDate(year,month);
    console.log("clipdate",clipdate);
    var i = clipdate["firstWeek"];
    var weekLen = clipdate["firstWeek"]+4;
    for(i; i <= weekLen; i++){
        dateName[i-1].innerText = parseStr;
    }
    var date2 = 1;
    for(date2; date2 <= tableLen; date2++){
        var dateJudgeDate2 = new Date(year,month, date2);
        switch(dateJudgeDate2.getDay()){
            case 6:
                dateName[date2-1].innerText = "六";
                break;
            case 0:
                dateName[date2-1].innerText = "日";
                break;
            case 4:
                dateName[date2-1].innerText = "清潔公司";
                break;
        }
    }
}

//first full week date range & sat sun
var judgeDate = function(y,m){
    var date1 =1;
    var retObj = [];
    for(date1; date1 <= 7; date1++){
        var dateJudgeDate1 = new Date(y, m, date1);
        if([dateJudgeDate1.getDay()] == 1){
            retObj["firstWeek"] = date1;
            break;
        }
    }
    date1 =1;
    for(date1; date1 <= tableLen; date1++){
        var dateJudgeDate2 = new Date(y, m, date1);
        if([dateJudgeDate2.getDay()] == 6){
            retObj["saturday"+date1] = dateJudgeDate2.getDate();
        }else if([dateJudgeDate2.getDay()] == 0){
            retObj["sunday"+date1] = dateJudgeDate2.getDate();
        }
    }
    return retObj;
}

var judgeHoliday = function (){

}

var req_val = function (){
    var tmpDate = em_calender.value.substring(8, 10);
    dateName[tmpDate-1].innerText = em_name.value;
    datePunish[tmpDate-1].innerText = em_txt.value;}

var actionDB = function(params) {
    switch(params){
        // case "check":
        //     console.log("check");
        //     em_toSend = {
        //         pload: "check",
        //         em_calender : em_calender.value,
        //         emp_name : em_name.value
        //     };
        //     httpReqFun(em_toSend);
        //     break;
        case "init":
            em_toSend = {
                pload: "init"
            }   
            httpReqFun(em_toSend);
    }
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
                parseStr = arr_data.title[1];
                parseTable();
            }      
        }
    }
    xmlhttp.send(jsonString);
}

var loadFinish = function (initData){
    // if(initData["status"] == "check!"){
    //     var deltaDay = (new Date(em_calender.value) - new Date(initData.startdate[1]))/(1000*3600*24)
    //     isQualify = (deltaDay >= 30)?true : false;
    //     if(isQualify){
            var tmpDate = em_calender.value.substring(8, 10);
            console.log("loadFinish");
            dateName[tmpDate-1].innerText = em_name.value;
            datePunish[tmpDate-1].innerText = em_txt.value;
        // }else{
        //     em_stateInfo.innerHTML = em_name.value + "不符合值日生資格";
        // }
//     }
}

var em_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html");
}