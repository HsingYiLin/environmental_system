var seq_chgpage;
var pre_edit;
var monList;
var clean_comp;
var seq_edit;
var pre_confirm;

var seq_sequence;
var dateObj;
var seq_calender;
var on_off;
var seq_name;
var seq_txt;
var workDateForm;
var seq_confirm;
var seq_stateInfo;
var seq_tbody;
var seq_Url = "http://localhost:8080/CleanSystem/sequence.php";
const xmlhttp =new XMLHttpRequest();
var seq_toSend = {};
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

var sequence_init = function(){
    console.log("employ_init");
    seq_chgpage = document.querySelector("#seq_chgpage");
    pre_edit = document.getElementById("pre_edit");
    monList = document.getElementById("monList");
    clean_comp = document.getElementById("clean_comp");
    seq_edit = document.getElementById("seq_edit");
    pre_confirm  = document.getElementById("pre_confirm");
    seq_tbody = document.getElementById("seq_tbody");
    seq_chgpage.addEventListener("change", seq_changePage, false);
    seq_edit.style.display = "none";
    dateObj =new Date();
    dynamicTable();
    pre_confirm.addEventListener("click", function(){
        isPreEdit = (monList.value != "" && clean_comp.value != "")? true:false;
        if(isPreEdit){
            seq_edit.style.display = "";
            pre_edit.style.display = "none";
            actionDB("init");
            
            seq_sequence = document.getElementById("seq_sequence");
            seq_calender = document.getElementById("seq_calender");
            seq_name = document.getElementById("seq_name");
            seq_confirm = document.getElementById("seq_confirm");
            seq_stateInfo = document.getElementById("seq_stateInfo");
            on_off = document.getElementById("on_off");
            seq_txt = document.getElementById("seq_txt");
            workDateForm = document.getElementById("workDateForm");
    
            seq_sequence.setAttribute("selected", true);
            seq_confirm.addEventListener("click", req_val);
    
            dynamicTable();
            // var tmp = judgeDate(year,month);
            // console.log(tmp);
            dateName = document.getElementsByClassName("dateName");
            datePunish = document.getElementsByClassName("datePunish"); 
            parseTable();
        }
    })
    
}

var dynamicTable = function (){
    var dateSort = "", arr_data;
    seq_tbody.innerHTML = "<tr class=first_tr><td>日期</td><td class = dateName>值日生</td><td class = datePunish>懲罰</td><td>候補</td></tr>"
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
        seq_tbody.innerHTML += tableHTML;
    }
}

var actionDB = function(params) {
    // var tmpDate = seq_calender.value.substring(8, 10);

    switch(params){
        case "init":
            console.log(monList.value);
            seq_toSend = {
                pload: "init",
                mon: monList.value,
                days: daysLen
            }   
            httpReqFun(seq_toSend);
    }
}

var httpReqFun = function (param){
    console.log("httpReqFun",param);
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
    var tmpDate = seq_calender.value.substring(8, 10);
    dateName[tmpDate-1].innerText = seq_name.value;
    datePunish[tmpDate-1].innerText = seq_txt.value;
}

var loadFinish = function (initData){ 
    var tmpDate = seq_calender.value.substring(8, 10);
    console.log("loadFinish");
    dateName[tmpDate-1].innerText = seq_name.value;
    datePunish[tmpDate-1].innerText = seq_txt.value;
}

var seq_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html");
}