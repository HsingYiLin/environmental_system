var seq_chgpage;
var pre_edit;
var monList;
var clean_comp;
var seq_edit;
var pre_confirm;
var seq_sequence;
var seq_calender;
var on_off;
// var seq_name;
// var seq_txt;
var workDateForm;
var seq_modify;
var seq_save;
var seq_delete;
var seq_stateInfo;
var seq_tbody;
var seq_Url = "http://localhost:8080/CleanSystem/sequence.php";
const xmlhttp =new XMLHttpRequest();
var seq_toSend = {};
var dateSortCls;
var dateName;
var datePunish;
var dateReplace;
var parseStr = "";
var table_days = "";
var last_emp = "";
var mon = "";
var year = "";
var isPreEdit = false;
var tableHTML="";
var dateSort;
var punish_date_arr = Array();

var sequence_init = function(){
    console.log("sequence_init");
    seq_chgpage = document.querySelector("#seq_chgpage");
    pre_edit = document.getElementById("pre_edit");
    monList = document.getElementById("monList");
    clean_comp = document.getElementById("clean_comp");
    seq_edit = document.getElementById("seq_edit");
    pre_confirm  = document.getElementById("pre_confirm");
    seq_tbody = document.getElementById("seq_tbody");
    seq_delete = document.getElementById("seq_delete");
    seq_chgpage.addEventListener("change", seq_changePage, false);
    clean_comp = document.getElementById("clean_comp");
    seq_stateInfo = document.getElementById("seq_stateInfo");
    seq_stateInfo.style.color = "#CE0000";
    pre_confirm.addEventListener("click", function () {
        (monList.value == "")?seq_stateInfo.innerText = "表格不得為空!":actionDB("dataExist");
    }) 
    pre_edit.style.display = "";     
    seq_edit.style.display = "none";
}

var createTable = function(isPreEdit){
    if(isPreEdit){
        actionDB("init");
        seq_edit.style.display = "";
        pre_edit.style.display = "none";     
        seq_sequence = document.getElementById("seq_sequence");
        seq_calender = document.getElementById("seq_calender");
        // seq_name = document.getElementById("seq_name");
        seq_modify = document.getElementById("seq_modify");
        seq_save = document.getElementById("seq_save");
        on_off = document.getElementById("on_off");
        // seq_txt = document.getElementById("seq_txt");
        workDateForm = document.getElementById("workDateForm");
        seq_sequence.setAttribute("selected", true);
        seq_modify.addEventListener("click", req_val);
        seq_save.style.display = "";
    }
}

var actionDB = function(params) {
    switch(params){
        case "dataExist":
            seq_toSend ={
                pload: "dataExist",
                tableName: monList.value.split("-").join("")
            }
            httpReqFun(seq_toSend);
            break;
        case "init":
            seq_toSend = {
                pload: "init",
                mon: monList.value,
            }   
            httpReqFun(seq_toSend);
            break;
        case "create":
            var punish_arr = Array();
            var calender_arr = Array();
            var txt_arr = Array();
            var replace_emp_arr = Array();
            for (var i = 0; i < table_days; i++) {
                calender_arr.push((year+ "/" +dateSortCls[i].innerText).split('/').join('-'));
                txt_arr.push(dateName[i].innerText);
                punish_arr.push(datePunish[i].innerText);
                replace_emp_arr.push(dateReplace[i].innerText);
            }
            seq_toSend = {
                pload: "create",
                calender_arr: calender_arr,
                txt_arr: txt_arr,
                punish_arr: punish_arr,
                punish_date_arr: punish_date_arr,
                replace_emp_arr: replace_emp_arr,
                lastEmp: last_emp,
                mon: mon,
                tableName:year + mon
            }  
            httpReqFun(seq_toSend);
            break;
        case "delete":
            seq_toSend = {
                pload: "delete",
                tableName: monList.value.split("-").join(""),
                mon: monList.value.substring(5, 7)
            }
            httpReqFun(seq_toSend);
            break;
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
            // setTimeout(function(){
            //     seq_stateInfo.innerText = "";
            // },8000);
            console.log("arr_data",arr_data);            
            switch(arr_data["status"]){
                case "emp success":
                case "pun success":
                case "pun no data":
                    sortData(arr_data);
                    seq_stateInfo.innerText = "生成成功!點擊儲存此列表將會保存下來";
                    break;
                case "sequence data exist":
                    parseTable(arr_data);
                    seq_stateInfo.innerText = "列表已存在!";
                    pre_confirm.remove();                    
                    break;
                case "sequence no data":
                    isPreEdit = (monList.value != "" && clean_comp.value != "")? true:false;
                    seq_stateInfo.innerText = "表格不得為空!";
                    createTable(isPreEdit);
                    break;
                case "last sequence no data":
                    seq_stateInfo.innerText = "上個月未排值日生!";
                    break;
                case "delete success":
                case "update success":
                    window.location.reload();
                    break;
                case "update emp success":
                case "update punish success":
                    sequence_init();
                    seq_stateInfo.innerText = "已儲存!";
                    pre_confirm.style.display = "none";
                    seq_delete.style.display = "";
                    seq_delete.addEventListener("click", function () {actionDB("delete")});
                    break;
            }
        }
    }
    xmlhttp.send(jsonString);
}

var sortData = function(data){
    // console.log(data);
    year = monList.value.substring(0,4);
    mon = monList.value.substring(5,7);
    dynamicTable(year, mon);
    punish_date_arr =data.pun_date;
    dateSortCls = document.getElementsByClassName("dateSortCls");
    dateName = document.getElementsByClassName("dateName");
    datePunish = document.getElementsByClassName("datePunish"); 
    dateReplace = document.getElementsByClassName("dateReplace");

    var dateJudgeDate;
    var cnt = 1; //第一個完整周
    var pun_data_size = 0;
    var dateSortTimeStamp, startText, startTimeStamp;
    if (data.name != undefined) {
        pun_data_size = Object.keys(data["name"]).length;
    }
    var emp_data_size = Object.keys(data["emp_name"]).length;
    var emp_data_ind = 1; //emp的第一筆
    var pun_data_ind = 1; //pun的第一筆
    //上個月輪到哪個人
    for(var n = 1; n <= emp_data_size; n++){
        if(data.lastIndex[n]*1 +1 == mon){
            emp_data_ind = ((n+1) > emp_data_size)?1 :(n+1);
            break;
        }
    }
    //順位:
    //剪輯組(第一個完整禮拜)?剪輯組:懲罰者
    //兩者都沒有，其他職位員工
    for(var i=0; i < table_days; i++){
        dateJudgeDate = new Date(year +"-"+ mon + "-"+ (i+1));
        if(mon % 2 !=0 && dateJudgeDate.getDay() == 1 && cnt == 1){
            for(var j =i; j < i+6; j++){
                if(dateName[j].innerText == "")dateName[j].innerText = "剪輯組";             
            }
            cnt ++;
        }
        
        if(dateName[i].innerText == "" && pun_data_size > 0 && pun_data_size >= pun_data_ind){
            dateName[i].innerText = data.name[pun_data_ind];
            datePunish[i].innerText = data.pun_date[pun_data_ind].substring(5,7) + "/" + data.pun_date[pun_data_ind].substring(8,10) + data.punishtxt[pun_data_ind];           
            pun_data_ind ++;
        }
        dateSortTimeStamp = new Date((year+ "/" +dateSortCls[i].innerText).split('/').join('-')).getTime();//表格日期時間戳
        if(dateName[i].innerText == ""){
            for(emp_data_ind  ; emp_data_ind <= emp_data_size; emp_data_ind++){
                startText = new Date(data.startdate[emp_data_ind]); 
                startTimeStamp = startText.setMonth(startText.getMonth() + 1);//員工報到時間戳
                if(dateSortTimeStamp > startTimeStamp){
                    dateName[i].innerText = data.emp_name[emp_data_ind];
                    emp_data_ind += 1;
                    if(emp_data_ind > emp_data_size){
                        emp_data_ind = 1;
                    }
                    break;
                }
                if(emp_data_ind > emp_data_size){
                    emp_data_ind = 1;
                }
            }
        }     
    }
    emp_data_ind = (emp_data_ind-1)==0?emp_data_size:emp_data_ind-1;
    last_emp = data.emp_name[emp_data_ind];
    seq_save.addEventListener("click", function(){actionDB("create")});
}

var dynamicTable = function (year, mon){
    var dateObj = new Date(year,mon,0);
    table_days = dateObj.getDate();
    for(var i =1; i<=table_days; i++){
        dateSort = mon+"/"+i;
        tableHTML +="<tr><td class = dateSortCls>"+dateSort+"</td><td class = dateName></td><td class = datePunish></td><td class = dateReplace></td></tr>"
    }
    seq_tbody.innerHTML += tableHTML;

    dateName = document.getElementsByClassName("dateName");
    console.log(dateName[1]);
    for(var i=0; i < table_days; i++){
        dateJudgeDate = new Date(year +"-"+ mon + "-"+ (i+1));
        switch(dateJudgeDate.getDay()){
            case 0:
                dateName[i].innerText = "日";
                dateName[i].style.backgroundColor = "#FFD1A4";
                break;
            case 6:
                dateName[i].innerText = "六";
                dateName[i].style.backgroundColor = "#FFD1A4";
                break;
            case clean_comp.value * 1:
                dateName[i].innerText = "清潔公司";
                dateName[i].style.backgroundColor = "#E0E0E0";
                break;
        }
    }
    
}

var parseTable = function (data){
    table_days = pun_data_size = Object.keys(data["calender"]).length;
    for(var i=1; i <= table_days; i++){
        tableHTML +="<tr><td class = dateSortCls>"+data.calender[i].substring(5, 10).split("-").join("/")+"</td><td class = dateName>"+data.txt[i]+"</td>";
        tableHTML +="<td class = datePunish>"+data.punish[i]+"</td><td class = dateReplace>"+data.replace_emp[i]+"</td></tr>";
    }
    seq_tbody.innerHTML += tableHTML;
    dateName = document.getElementsByClassName("dateName");
    for(var i=0; i < table_days; i++){
        switch(dateName[i].innerText){
            case "日":
                dateName[i].style.backgroundColor = "#FFD1A4";
                break;
            case "六":
                dateName[i].style.backgroundColor = "#FFD1A4";
                break;
            case "清潔公司":
                dateName[i].style.backgroundColor = "#E0E0E0";
                break;
        }
    }
    seq_delete.style.display = "";
    seq_delete.addEventListener("click", function () {actionDB("delete");} )  
}

var req_val = function (){
    var tmpDate = seq_calender.value.substring(8, 10);
    console.log(dateName[1]);
}

var seq_changePage = function (e){
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html");
}