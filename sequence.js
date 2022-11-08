var seq_chgpage;
var pre_edit;
var monList;
var clean_comp;
var seq_edit;
var pre_confirm;
var seq_sequence;
var seq_calender;
var seq_replace;
var replace_opt;
var seq_holiday;
var on_off;
var workDateForm;
var nationHoliday;
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
var arr_data;
var emp_data_size;
var replace_arr;

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
        (monList.value == "")?seq_stateInfo.innerText = info_tw("FORM NOT BE EMPTY"):actionDB("dataExist");
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
        seq_replace = document.getElementById("seq_replace");
        replace_opt = document.getElementById("replace_opt");
        seq_holiday = document.getElementById("seq_holiday");
        seq_modify = document.getElementById("seq_modify");
        seq_save = document.getElementById("seq_save");
        on_off = document.getElementById("on_off");
        workDateForm = document.getElementById("workDateForm");
        nationHoliday = document.getElementById("nationHoliday");
        on_off.addEventListener("change", parseOptionList, false);
        seq_sequence.setAttribute("selected", true);
        seq_modify.addEventListener("click", req_val);
        seq_save.style.display = "";
        seq_save.addEventListener("click", function(){actionDB("create")});
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
            console.log("create");
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
                tableName:year + mon,
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
    // var arr_data;
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
                    year = monList.value.substring(0,4);
                    mon = monList.value.substring(5,7);
                    dynamicTable(year, mon);
                    sortData(arr_data);
                    seq_stateInfo.innerText = info_tw("GENER SUCCESS");
                    break;
                case "sequence data exist":
                    parseTable(arr_data);
                    seq_stateInfo.innerText = info_tw("LIST EXISIT");
                    pre_confirm.remove();                    
                    break;
                case "sequence no data":
                    isPreEdit = (monList.value != "" && clean_comp.value != "")? true:false;
                    seq_stateInfo.innerText = info_tw("FORM NOT BE EMPTY");
                    createTable(isPreEdit);
                    break;
                case "last sequence no data":
                    seq_stateInfo.innerText = info_tw("UNSCHEDULED");
                    break;
                case "delete success":
                case "update success":
                    window.location.reload();
                    break;
                case "update emp success":
                case "update punish success":
                    sequence_init();
                    seq_stateInfo.innerText = info_tw("SAVED");
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
    console.log("sortData");
    punish_date_arr = data.pun_date;
    var increase_arr = data.increase_emp;
    var dateJudgeDate;
    var cnt = 1; //第一個完整周
    var pun_data_size = 0;
    var dateSortTimeStamp, startText, startTimeStamp;
    if (data.name != undefined) {
        pun_data_size = Object.keys(data["name"]).length;
    }
    emp_data_size = Object.keys(data["emp_name"]).length;
    var emp_data_ind = 1; //emp的第一筆
    var pun_data_ind = 1; //pun的第一筆
    //上個月輪到哪個人
    for(var n = 1; n <= emp_data_size; n++){
        if(data.lastIndex[n]*1 +1 == mon){
            emp_data_ind = ((n+1) > emp_data_size)?1 :(n+1);
            break;
        }
    }
    
    var replace_ind = [];
    var replace_txt;
    var replace_name;
    var tmp_ind = 0 ;
    for(var k = 1; k <= emp_data_size; k++){
        replace_txt = data.replace_emp[k].split(",");
        replace_txt.pop();
        if(replace_txt != ""){
            replace_name = data.emp_name[k];
            replace_ind[replace_name] = 0
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
        increase_arr = data.increase_emp[emp_data_ind]

        var isPass = (dateName[i].innerText != "六" && dateName[i].innerText != "日" && dateName[i].innerText != "清潔公司"  && dateName[i].innerText != "剪輯組" && dateName[i].innerText != "元旦" && dateName[i].innerText != "春節" && dateName[i].innerText != "228連假" && dateName[i].innerText != "清明連假" && dateName[i].innerText != "勞動節" && dateName[i].innerText != "端午連假" && dateName[i].innerText != "中秋連假" && dateName[i].innerText != "國慶連假" && dateName[i].innerText != "放假")?true:false
        if(isPass && pun_data_size > 0 && pun_data_size >= pun_data_ind){
            dateName[i].innerText = data.name[pun_data_ind];
            datePunish[i].innerText = data.pun_date[pun_data_ind].substring(5,7) + "/" + data.pun_date[pun_data_ind].substring(8,10) + data.punishtxt[pun_data_ind];           
            pun_data_ind ++;
        }
        dateSortTimeStamp = new Date((year+ "/" +dateSortCls[i].innerText).split('/').join('-')).getTime();//表格日期時間戳
        if(isPass){
            for(emp_data_ind  ; emp_data_ind <= emp_data_size; emp_data_ind++){
                startText = new Date(data.startdate[emp_data_ind]); 
                startTimeStamp = startText.setMonth(startText.getMonth() + 1);//員工報到時間戳
                if(dateSortTimeStamp > startTimeStamp){
                    var replace_tmp = data.replace_emp[emp_data_ind].split(",");
                    replace_tmp.pop();
                    if(replace_tmp != ""){
                        tmp_ind = replace_ind[data.emp_name[emp_data_ind]]++;
                        dateName[i].innerText = (tmp_ind<replace_tmp.length)?replace_tmp[tmp_ind]:data.emp_name[emp_data_ind];
                    }else{
                        dateName[i].innerText = data.emp_name[emp_data_ind];
                    }
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
}


var dynamicTable = function (year, mon){
    var dateObj = new Date(year,mon,0);
    table_days = dateObj.getDate();
    for(var i =1; i<=table_days; i++){
        dateSort = mon+"/"+i;
        tableHTML +="<tr><td class = dateSortCls>"+dateSort+"</td><td class = dateName></td><td class = datePunish></td><td class = dateReplace></td></tr>"
    }
    seq_tbody.innerHTML += tableHTML;

    dateSortCls = document.getElementsByClassName("dateSortCls");
    dateName = document.getElementsByClassName("dateName");
    datePunish = document.getElementsByClassName("datePunish"); 
    dateReplace = document.getElementsByClassName("dateReplace");    
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
            case "元旦":
            case "春節":
            case "228連假":
            case "清明連假":
            case "勞動節":
            case "端午連假":
            case "中秋連假":
            case "國慶連假":
            case "放假":
                dateName[i].style.backgroundColor = "#FFC1E0";
        }
    }
    seq_delete.style.display = "";
    seq_delete.addEventListener("click", function () {actionDB("delete");} )  
}

var parseOptionList = function(){
    seq_replace.innerHTML = "<option value=></option>";
    if(this.value == "holiday"){
        nationHoliday.style.display = "";
        workDateForm.style.display = "none";
    }else if(this.value == "work"){
        nationHoliday.style.display = "none";
        workDateForm.style.display = "";
        var empList = arr_data.emp_name;
        for (var i = 1; i <= emp_data_size; i++) {
            seq_replace.innerHTML += "<option value="+empList[i]+">"+ empList[i] +"</option>"
        }
    }else{
        nationHoliday.style.display = "none";
        workDateForm.style.display = "none";
    }
}

var req_val = function (){
    var numTd = seq_calender.value.substring(8, 10)*1;
    var calenderDate = seq_calender.value.substring(0, 7)
    var replaceTxt =  dateReplace[numTd-1];
    var nameTxt = dateName[numTd-1];
    var dayType = (new Date(seq_calender.value).getDay() == 6 || new Date(seq_calender.value).getDay() == 0)?"holiday": "work";
    if(monList.value == calenderDate){
        var modifySituation = {
            1: ("work" == dayType && "work" == on_off.value),
            2: ("work" == dayType && "holiday" == on_off.value),
            3: ("holiday" == dayType && "work" == on_off.value),
            4: ("holiday" == dayType && "holiday" == on_off.value)
        }
        var mustDo = {
            1: (seq_replace.value != "" && nameTxt.innerText != seq_replace.value && replace_opt.value != "" ),
            2: (seq_holiday.value != "")
        }
        if(modifySituation[1] && mustDo[1]){
            // nameTxt.innerText == "";
            replaceTxt.innerText = seq_replace.value + replace_opt.value;
            sortData(arr_data);
        }else if(modifySituation[2] && mustDo[2]){
            nameTxt.innerText = seq_holiday.value;
            nameTxt.style.backgroundColor = "#FFC1E0";
            replaceTxt.innerText = "";
            sortData(arr_data);
        }else if(modifySituation[3]){
            nameTxt.innerText = "";
            nameTxt.style.backgroundColor = "#66B3FF";
            replaceTxt.innerText = seq_replace.value + replace_opt.value;
            sortData(arr_data);
        }else if(modifySituation[4] && mustDo[2]){
            nameTxt.style.backgroundColor = "#FFC1E0";
            nameTxt.innerText = seq_holiday.value;
            replaceTxt.innerText = "";
            sortData(arr_data);
        }else{
            seq_stateInfo.innerText = info_tw("WRONG FORMAT");
        }
    }else{
        seq_stateInfo.innerText = info_tw("DATE OF THE MON");
    }
    setTimeout(function(){seq_stateInfo.innerText = ""}, 3000 )
}

var seq_changePage = function (e){
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html");
}