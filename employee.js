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


//1.可以依日期篩選值日生表格填入資料(修改)
//2.可以依日期篩選值日生表格，根據checkbox放假，填入(國定假日、假日、清潔公司)
//方向錯了，init時。就要全部排好了，小調整在input調整
//dynamicTable前，code邏輯
//滿一個月
//剪輯組、清潔公司
//懲罰者
//其他用戶，從晚到至早到排


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

    dateObj =new Date()
    dynamicTable();
}

var dynamicTable = function (){
    var monObj;
    monObj = dateObj.getMonth();
    dateObj.setMonth(monObj + 1);
    dateObj.setDate(0);
    
    var tableLen = dateObj.getDate();
    var tableHTML="";
    var dateSort = ""
   
    for(var i =1; i<=tableLen; i++){
        dateObj.setDate(i);
        dateSort = monObj+1+"/"+dateObj.getDate()
        tableHTML +="<tr><td>"+dateSort+"</td><td class = dateName></td><td class = datePunish></td><td></td></tr>"
    }
    tbody1.innerHTML += tableHTML;

}

var em_changePage = function (e) {
        window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
}

var req_val = function (){
    actionDB("check");
    // var day_list = ['日', '一', '二', '三', '四', '五', '六'];
    // console.log("tmpDate",tmpDate);
    // var week = day_list[new Date(tmpDate).getDay()];
    // console.log("calDate",week);
}

var actionDB = function(params) {
    switch(params){
        case "check":
            console.log("check");
            em_toSend = {
                pload: "check",
                em_calender : em_calender.value,
                emp_name : em_name.value
            };
            httpReqFun(em_toSend);
            break;
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
            setTimeout(function(){
                // pun_stateInfo.innerText = "";
            },3000);
            if(arr_data["status"]="check"){
                loadFinish(arr_data);
            }      
        }
    }
    xmlhttp.send(jsonString);
}

var loadFinish = function (initData){
    if(initData["status"] == "check"){
        var deltaDay = (new Date(em_calender.value) - new Date(initData.startdate[1]))/(1000*3600*24)
        isQualify = (deltaDay >= 30)?true : false;
        if(isQualify){
            var tmpDate = em_calender.value.substring(8, 10);
            var dateName = document.getElementsByClassName("dateName");
            var datePunish = document.getElementsByClassName("datePunish");
            dateName[tmpDate-1].innerText = em_name.value;
            datePunish[tmpDate-1].innerText = em_txt.value;
        }else{
            em_stateInfo.innerHTML = em_name.value + "不符合值日生資格";
        }
    }
}


