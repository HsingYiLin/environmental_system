var pre_edit;
var monList;
var clean_comp;
var seq_edit;
var pre_confirm;
var seq_calender;
var seq_replace;
var replace_opt;
var seq_holiday;
var on_off;
var workDateForm;
var nationHoliday;
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
var table_days = "";
var last_emp = "";
var mon = "";
var year = "";
var isPreEdit = false;
var tableHTML="";
var dateSort;
var punish_date_arr = Array();
var replaceDone = Array();
var doneKey = Array();
var dataIncr = Array();
var increase_arr;
var arr_data;
var emp_data_size;
var dateSortTimeStamp, startText, startTimeStamp;
var setting_arr = ["六","日","清潔公司","剪輯組","元旦","春節","228連假","清明連假","勞動節","端午連假","中秋連假","國慶連假","放假",]


var sequence_init = function(){
    console.log("sequence_init");
    var seq_chgpage = document.querySelector("#seq_chgpage");
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
        var seq_sequence = document.getElementById("seq_sequence");
        var seq_modify = document.getElementById("seq_modify");
        var seq_save = document.getElementById("seq_save");
        var seq_clear = document.getElementById("seq_clear");
        seq_calender = document.getElementById("seq_calender");
        seq_replace = document.getElementById("seq_replace");
        replace_opt = document.getElementById("replace_opt");
        seq_holiday = document.getElementById("seq_holiday");
        on_off = document.getElementById("on_off");
        workDateForm = document.getElementById("workDateForm");
        nationHoliday = document.getElementById("nationHoliday");
        on_off.addEventListener("change", parseOptionList, false);
        seq_sequence.setAttribute("selected", true);
        seq_modify.addEventListener("click", req_val);
        seq_save.style.display = "";
        seq_save.addEventListener("click", function(){actionDB("create")});
        seq_clear.addEventListener("click",clearInput);
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
            // console.log(dataIncr);
            seq_toSend = {
                pload: "create",
                calender_arr: calender_arr,
                txt_arr: txt_arr,
                punish_arr: punish_arr,
                punish_date_arr: punish_date_arr,
                replace_emp_arr: replace_emp_arr,
                doneKey: doneKey,
                replaceDone: replaceDone,
                lastEmp: last_emp,
                mon: mon,
                year: year,
                tableName:year + mon,
                dataIncr: dataIncr,
                emp_name: arr_data.emp_name
            }  
            httpReqFun(seq_toSend);
            break;
        case "delete":
            console.log("delete");
            console.log(dataIncr);
            seq_toSend = {
                pload: "delete",
                tableName: monList.value.split("-").join(""),
                mon: monList.value.substring(5, 7),
                year: monList.value.substring(0, 4)
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
            
            console.log("arr_data",arr_data);            
            switch(arr_data["status"]){
                case "emp success":
                case "pun success":
                case "rep success":
                case "incr success":
                case "pun no data":
                case "rep no data":
                case "incr no data":
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
                case "update replace success":
                case "update incr success":
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
    if(data.empname != undefined){
        var empname_arr = Object.values(data.empname);
        var rep_name_arr = Object.values(data.rep_name);
    }
    if(data.incr_name != undefined){
        increase_arr = Object.values(data.incr_name);
    } 
    punish_date_arr = data.pun_date;
    //回傳初始
    var emp_data_ind = 1;
    var pun_data_ind = 1;
    var emptyColumn;
    var pun_data_size = 0;
    if (data.name != undefined) {
        pun_data_size = Object.keys(data["name"]).length;
    }
    emp_data_size = Object.keys(data["emp_name"]).length;
    
    //上個月輪到哪個人
    for(var n = 1; n <= emp_data_size; n++){
        if(data.lastIndex[n]*1 +1 == mon){
            emp_data_ind = ((n+1) > emp_data_size)?1 :(n+1);
            break;
        }
    }
    //順位:剪輯組(第一個完整禮拜)?剪輯組:懲罰者,兩者都沒有，其他職位員工
    for(var i=0; i < table_days; i++){
        //檢查該欄有無設定值
        for(var ind = 0; ind < setting_arr.length; ind++){
            emptyColumn = (setting_arr[ind] != dateName[i].innerText)?true:false;
            if(!emptyColumn)break;
        }
        //處罰
        if(emptyColumn && pun_data_size > 0 && pun_data_size >= pun_data_ind && dateName[i].innerText == ""){
            dateName[i].innerText = data.name[pun_data_ind];
            datePunish[i].innerText = data.pun_date[pun_data_ind].substring(5,7) + "/" + data.pun_date[pun_data_ind].substring(8,10) + data.punishtxt[pun_data_ind];           
            pun_data_ind ++;
        }
        dateSortTimeStamp = new Date((year+ "/" +dateSortCls[i].innerText).split('/').join('-')).getTime();//表格日期時間戳
        //排序
        if(emptyColumn && dateName[i].innerText == ""){
            for(emp_data_ind; emp_data_ind <= emp_data_size; emp_data_ind++){  
                startText = new Date(data.startdate[emp_data_ind]); 
                startTimeStamp = startText.setMonth(startText.getMonth() + 1);//員工報到時間戳
                var repBool = false;
                var incrBool = false;
                var rep_name = "";
                var incr_name = "";
                var rep_name_idx = undefined;
                var incr_name_idx = undefined;
                if(empname_arr !=undefined){
                    for(var j = 0; j < empname_arr.length; j++){
                        if( data.emp_name[emp_data_ind] == empname_arr[j]){
                            rep_name = rep_name_arr[j];
                            rep_name_idx = j;
                            repBool = true;
                            break;
                        }
                        repBool = false;
                    }
                }
                if(increase_arr !=undefined){
                    for(var r = 0; r < increase_arr.length; r++){
                        if( data.emp_name[emp_data_ind] == increase_arr[r]){
                            incr_name_idx = r;
                            incrBool = true;
                            break;
                        }
                        incrBool = false;
                    }
                }

                if(dateSortTimeStamp > startTimeStamp){ 
                    var sortLogic = {
                        1 : (repBool && incrBool ),//有替補 有調用 先塞替補塞完 再來會跳到3
                        2 : (repBool && !incrBool),//有替補 無調用 先塞替補塞完 再來會跳到4
                        3 : (!repBool && incrBool),//無替補 有調用 不塞 --玩跳到下一順位繼續檢查 等全部都等於0後跳到4
                        4 : (!repBool && !incrBool)
                    }
                    if(sortLogic[1]){
                        dateName[i].innerText = rep_name;
                        doneKey.push(empname_arr[rep_name_idx]);
                        replaceDone.push(rep_name_arr[rep_name_idx]);
                        empname_arr.splice(rep_name_idx, 1);
                        rep_name_arr.splice(rep_name_idx, 1);

                    }else if(sortLogic[2]){
                        dateName[i].innerText = rep_name;
                        doneKey.push(empname_arr[rep_name_idx]);
                        // console.log("doneKey",doneKey);
                        replaceDone.push(rep_name_arr[rep_name_idx]);
                        empname_arr.splice(rep_name_idx, 1);
                        rep_name_arr.splice(rep_name_idx, 1);

                    }else if(sortLogic[3]){
                        dataIncr.push(increase_arr[incr_name_idx]);
                        increase_arr.splice(incr_name_idx, 1);
                        if(emp_data_ind == emp_data_size)emp_data_ind = 1;
                        continue;

                    }else if(sortLogic[4]){
                        dateName[i].innerText = data.emp_name[emp_data_ind];

                    }
                    emp_data_ind ++;
                    if(emp_data_ind > emp_data_size)emp_data_ind = 1;
                    break;
                }
            }
        }
    }
    emp_data_ind = (emp_data_ind-1)==0?emp_data_size:emp_data_ind-1;
    last_emp = data.emp_name[emp_data_ind];
}


var dynamicTable = function (year, mon){
    var dateObj = new Date(year,mon,0);
    var cnt = 1; //第一個完整周
    var dateJudgeDate;
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

        if(mon % 2 !=0 && dateJudgeDate.getDay() == 1 && cnt == 1){
            for(var j =i; j < i+6; j++){
                if(dateName[j].innerText == "")dateName[j].innerText = "剪輯組";             
            }
            cnt ++;
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
    var rep_empname = arr_data.emp_name;
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
            4: ("holiday" == dayType && "holiday" == on_off.value),
            5: ("" == on_off.value)
        }
        var mustDo = {
            1: (seq_replace.value != "" && nameTxt.innerText != seq_replace.value && replace_opt.value != "" ),
            2: (seq_holiday.value != ""),
            3: (seq_replace.value == "")
        }

        dateSortTimeStamp = new Date(seq_calender.value).getTime();//表格日期時間戳
        if(modifySituation[1] && mustDo[1]){
            nameTxt.innerText == "";
            for(var i = 1; i <= emp_data_size; i++){
                if(seq_replace.value == arr_data.emp_name[i]){
                    startText = new Date(arr_data.startdate[i]); 
                    startTimeStamp = startText.setMonth(startText.getMonth() + 1);
                    if(dateSortTimeStamp > startTimeStamp){ 
                        replaceTxt.innerText = seq_replace.value + replace_opt.value;
                        sortData(arr_data); 
                        break;
                    }else{
                        seq_stateInfo.innerText = info_tw("LESS THAN ONE MONTH");
                    }
                }
            }
        }else if(modifySituation[2] && mustDo[2]){
            nameTxt.innerText = seq_holiday.value;
            nameTxt.style.backgroundColor = "#FFC1E0";
            replaceTxt.innerText = "";
            sortData(arr_data);
        }else if(modifySituation[3]){
            nameTxt.innerText = "";
            nameTxt.style.backgroundColor = "#66B3FF";
            for(var i = 1; i <= emp_data_size; i++){
                if(seq_replace.value == arr_data.emp_name[i]){
                    startText = new Date(arr_data.startdate[i]); 
                    startTimeStamp = startText.setMonth(startText.getMonth() + 1);
                    if(dateSortTimeStamp > startTimeStamp){ 
                        replaceTxt.innerText = seq_replace.value + replace_opt.value;
                        break;
                    }else{
                        seq_stateInfo.innerText = info_tw("LESS THAN ONE MONTH");
                    }
                }
            }
            sortData(arr_data); 
        }else if(modifySituation[4] && mustDo[2]){
            nameTxt.style.backgroundColor = "#FFC1E0";
            nameTxt.innerText = seq_holiday.value;
            replaceTxt.innerText = "";
            sortData(arr_data);
        }else if(modifySituation[5] && mustDo[3]){
            replaceTxt.innerText = "";
        }else{
            seq_stateInfo.innerText = info_tw("WRONG FORMAT");
        }
    }else{
        seq_stateInfo.innerText = info_tw("DATE OF THE MON");
    }
    setTimeout(function(){seq_stateInfo.innerText = ""}, 3000 )
}

var clearInput = function (){
    on_off.value = "";
    seq_replace.value = "";
    replace_opt.value = "";
    seq_holiday.value = "";
}

var seq_changePage = function (e){
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html");
}