var seq_chgpage;
var pre_edit;
var monList;
var clean_comp;
var seq_edit;
var pre_confirm;
var clean_comp;
var seq_sequence;
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
var pun_data_ind = 1; //pun的第一筆
var emp_data_ind = 1; //emp的第一筆

var sequence_init = function(){
    console.log("sequence_init");
    seq_chgpage = document.querySelector("#seq_chgpage");
    pre_edit = document.getElementById("pre_edit");
    monList = document.getElementById("monList");
    clean_comp = document.getElementById("clean_comp");
    seq_edit = document.getElementById("seq_edit");
    pre_confirm  = document.getElementById("pre_confirm");
    seq_tbody = document.getElementById("seq_tbody");
    seq_chgpage.addEventListener("change", seq_changePage, false);
    seq_edit.style.display = "none";
    clean_comp = document.getElementById("clean_comp");

    dynamicTable();
    pre_confirm.addEventListener("click", function(){
        isPreEdit = (monList.value != "" && clean_comp.value != "")? true:false;
        if(isPreEdit){
            seq_edit.style.display = "";
            pre_edit.style.display = "none";
            
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
    
            actionDB("init");
        }
    })
    
}

var actionDB = function(params) {
    switch(params){
        case "init":
            seq_toSend = {
                pload: "init",
                mon: monList.value
                // days: daysLen
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
                replace_emp_arr: replace_emp_arr,
                lastEmp: last_emp,
                mon: mon,
                tableName:year + mon
            }  
            httpReqFun(seq_toSend);
            break;
        }
}

var httpReqFun = function (param){
    // console.log("httpReqFun",param);
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
            console.log("arr_data",arr_data);
            if(arr_data["emp_status"] == "employee success!" && arr_data["pun_status"] == "punish success!" || arr_data["pun_status"] == "punish no data"){
                sortData(arr_data);
            }
        }
    }
    xmlhttp.send(jsonString);
}

var sortData = function(data){
   year = monList.value.substring(0,4);
    mon = monList.value.substring(5,7);
    dynamicTable(year, mon);//整個月表格

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
    var tmp =1;

    //順位:
    //剪輯組(第一個完整禮拜)?剪輯組:懲罰者
    //兩者都沒有，其他職位員工
    for(var i=0; i < table_days; i++){
        dateJudgeDate = new Date(year +"-"+ mon + "-"+ (i+1));
        if(mon % 2 !=0 && dateJudgeDate.getDay() == 1 && cnt == 1){
            for(var j =i; j < i+6; j++){
                dateName[j].innerText = "剪輯組";
            }
            cnt ++;
        }
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

        if(dateName[i].innerText == "" && pun_data_size > 0 && pun_data_size >= pun_data_ind){
            dateName[i].innerText = data.name[pun_data_ind];
            // punish_arr.push(data.pun_date[pun_data_ind]);
            datePunish[i].innerText = data.pun_date[pun_data_ind].substring(5,7) + "/" + data.pun_date[pun_data_ind].substring(8,10) + data.punishtxt[pun_data_ind];
            pun_data_ind ++;
        }

        dateSortTimeStamp = new Date((year+ "/" +dateSortCls[i].innerText).split('/').join('-')).getTime();//表格日期時間戳
        if(dateName[i].innerText == ""){
            for( emp_data_ind = tmp ; emp_data_ind <= emp_data_size; emp_data_ind++){
                startText = new Date(data.startdate[emp_data_ind]); 
                startTimeStamp = startText.setMonth(startText.getMonth() + 1);//員工報到時間戳
                if(dateSortTimeStamp > startTimeStamp){
                    dateName[i].innerText = data.emp_name[emp_data_ind];
                    tmp = emp_data_ind + 1;
                    if(tmp > emp_data_size){
                        tmp = 1;
                    }
                    
                    break;
                }
                tmp = emp_data_ind + 1;
                if(tmp > emp_data_size){
                    tmp = 1;
                }
            }
        }     
    }
    last_emp = data.emp_name[emp_data_ind];
    actionDB("create");
}

var dynamicTable = function (year, mon){
    seq_tbody.innerHTML = "<tr class=first_tr><td>日期</td><td>值日生</td><td>懲罰</td><td>候補</td></tr>"
    if(isPreEdit){
        var dateObj = new Date(year,mon,0);
        table_days = dateObj.getDate();
        for(var i =1; i<=table_days; i++){
            dateSort = mon+"/"+i;
            // dateSort_arr.push(dateSort);
            tableHTML +="<tr><td class = dateSortCls>"+dateSort+"</td><td class = dateName></td><td class = datePunish></td><td class = dateReplace></td></tr>"
        }
        // console.log(dateSort_arr);

        seq_tbody.innerHTML += tableHTML;
    }  
}

var req_val = function (){
    var tmpDate = seq_calender.value.substring(8, 10);
    dateName[tmpDate].innerText = seq_name.value;
    datePunish[tmpDate].innerText = seq_txt.value;
}

var seq_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html");
}