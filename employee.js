var em_chgpage;
var em_employee;
var dateObj;
var em_calender;
var on_off;
var em_name;
var em_txt;
var em_confirm;
var tbody1;

//1.可以依日期篩選值日生表格填入資料
//2.可以依日期篩選值日生表格，根據checkbox放假，填入(國定假日、假日、清潔公司)


var employ_init = function(){
    console.log("employ_init");
    em_chgpage = document.querySelector("#em_chgpage");
    em_employee = document.getElementById("em_employee");
    em_calender = document.getElementById("em_calender");
    em_name = document.getElementById("em_name");
    em_confirm = document.getElementById("em_confirm");
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
    var em_url = "http://localhost:8080/CleanSystem/employee.php"
    calDate();
}

//計算第幾行幾列
var calDate = function (){
    console.log("em_calender.value", em_calender.value);
    tmpDate = em_calender.value.substring(8, 10);
    var dateName = document.getElementsByClassName("dateName");
    var datePunish = document.getElementsByClassName("datePunish");

    dateName[tmpDate-1].innerText = em_name.value;
    console.log(em_txt.value);
    datePunish[tmpDate-1].innerText = em_txt.value;

    em_calender.value
    on_off.value
    em_name.value
    em_txt.value

    // var day_list = ['日', '一', '二', '三', '四', '五', '六'];
    console.log("tmpDate",tmpDate);
    // var week = day_list[new Date(tmpDate).getDay()];
    // console.log("calDate",week);
   return ;
    

}


