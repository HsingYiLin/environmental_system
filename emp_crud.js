var emp_startDate;
var emp_name;
var emp_title;
var emp_status;
var del_val;
var emp_stateInfo;
var emp_tbody;
var toSend = {};
var emp_url = "https://schedule.cfd888.info/CleanSystem/emp_crud.php";
var jsonString;
const xmlhttp =new XMLHttpRequest();

var emp_crud_init = function () {
    actionDB("init");
    emp_startDate = $("#emp_startDate");
    emp_name = $("#emp_name");
    emp_title = $("#emp_title");
    emp_status = document.getElementById("emp_status");
    emp_stateInfo = $("#emp_stateInfo");
    emp_stateInfo.css("color", "#CE0000")
    emp_tbody = document.getElementById("emp_tbody");
    $("#add_confirm").click(function(){actionDB("add")});
    $("#up_confirm").click(function(){actionDB("update")});
    $("#sel_confirm").click(function(){actionDB("select")});
    $("#clear_confirm").click(function(){clearInput()});
}

var actionDB = function(params) {
    var dateObj = new Date();
    var nowDate = new Date(dateObj.getFullYear() + "-" + (dateObj.getMonth()+1) + "-" + dateObj.getDate());
    switch(params){
        case "init":
            toSend = {pload: "init"};
            httpReqFun(toSend);
            break;
        case "add":
            var state = emp_status.checked?"在職":"離職";
            if(emp_startDate.val() != "" && emp_name.val() != "" && new Date(emp_startDate.val()) < nowDate && emp_title.val() != ""){
                toSend ={
                    pload: "add",
                    startDate: emp_startDate.val(),
                    emp_name: emp_name.val(),
                    title: emp_title.val(),
                    state: state
                };   
                httpReqFun(toSend);
            }else{
                emp_stateInfo.text(info_tw("INPUT BE EMPTY"));
            }
            break;
        case "select":
            if(emp_name.val() != "" || emp_startDate.val() != "" || emp_title.val() != ""){
                toSend ={
                    pload: "select",
                    emp_name: emp_name.val(),
                    date: emp_startDate.val(),
                    title: emp_title.val()
                };
                httpReqFun(toSend);
            }else{
                toSend = {pload: "init"};
                httpReqFun(toSend);
            }
            break;
        case "update":
            var state = emp_status.checked?"在職":"離職";
            if(emp_name.val() != ""  && new Date(emp_startDate.val()) < nowDate && emp_title.val() != ""){
                toSend ={
                    pload: "update",
                    startDate: emp_startDate.val(),
                    emp_name: emp_name.val(),
                    title: emp_title.val(),
                    state: state
                };   
                httpReqFun(toSend);
            }else{
                emp_stateInfo.text(info_tw("NAME BE EMPTY") + " | " + info_tw("TITLE BE EMPTY") + " | " + info_tw("WRONG DATE"));
            }
            break;
        case "delete":
            console.log("delete");
            toSend ={
                pload: "delete",
                emp_name: del_val,
            };   
            httpReqFun(toSend);
            break;
    }
}

var httpReqFun = function (param){
    var arr_data;
    jsonString = JSON.stringify(param);
    xmlhttp.open("POST",emp_url);
    xmlhttp.setRequestHeader("Content-Type","application/json");
    xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState === 4 && xmlhttp.status == 200){
            arr_data = JSON.parse(xmlhttp.responseText);
            setTimeout(function(){
                emp_stateInfo.text("");
            },5000);
              
            switch(arr_data["status"]){
                case "add success":
                case "update success":
                case "delete success":
                    actionDB("init");
                    clearInput();
                    break;
                case "success!":
                    emp_stateInfo.text(info_tw("SUCCESS"));
                    parseAllData(arr_data);
                    break;
                case "no data":
                    emp_stateInfo.text(info_tw("NO DATA"));
                    parseAllData(arr_data);
                    break;
                case "update fail":
                case "duplicate":
                    emp_stateInfo.text(info_tw("DUPLICATE"));
                    parseAllData(arr_data);
                    break;
            }  
        }
    }
    xmlhttp.send(jsonString);
}

var parseAllData = function (initData){
    var emp_tableHTML = "";
    emp_tbody.innerHTML = "<tr class='table-success justify-content-center'><td class='col-3'>到職日</td><td class='col-2'>員工</td><td class='col-2'>職稱</td><td class='col-2'>狀態</td><td class='col-3'></td></tr>";
    if(initData["status"] != "update fail" && initData["status"] != "no data" && initData["status"] != "duplicate"){
        var data_size = Object.keys(initData["emp_name"]).length;
        for(var j = 1; j <= data_size; j++){
            emp_tableHTML += "<tr class='justify-content-center'><td class=''>"+initData.startdate[j]+"</td><td class=''>"+initData.emp_name[j]+"</td><td class=''>"+initData.title[j]+"</td><td class=''>"+initData.state[j]+"</td>";
            emp_tableHTML += "<td class=''><button class='btn btn-outline-success btn-sm fw-bold' type='button' onclick='updInner(this)'>選取</button>"
            emp_tableHTML += "&nbsp&nbsp<button type='button' class='btn btn-outline-success btn-sm fw-bold' data-bs-toggle='modal' data-bs-target='#exampleModal' onclick='del(this)'>刪除</button></td></tr>"
        }
    }
    emp_tbody.innerHTML += emp_tableHTML;
}

var emp_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
}

var clearInput = function (){
    emp_startDate.val("");
    emp_name.val("");
    emp_title.val("");
    emp_status.checked = false;
}

var del = function (obj){
    var del_str = obj.parentNode.parentNode.innerText;
    var del_td_arr = del_str.split(/\t/);
    var modalOK = $("#modalOK");
    var modalText = $("#modalText");
    del_val = del_td_arr[1];
    modalText.text(del_td_arr[0]+", "+del_td_arr[1]+", "+del_td_arr[2]+", "+del_td_arr[3]);
    modalOK.click(function(){
        actionDB("delete");
        $(this).off("click");
    });
}

var updInner = function (obj){
    var upd_str = obj.parentNode.parentNode.innerText;
    var upd_td_arr = upd_str.split(/\t/);
    var upd_starDate = upd_td_arr[0];
    var upd_name = upd_td_arr[1];
    var upd_title = upd_td_arr[2];
    var upd_state = upd_td_arr[3];
    upd_state = (upd_state == "在職")? true : false;
    emp_startDate.val(upd_starDate);
    emp_name.val(upd_name);
    emp_title.val(upd_title);
    emp_status.checked = upd_state;
}