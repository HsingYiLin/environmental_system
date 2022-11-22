var emp_startDate;
var emp_name;
var emp_title;
var emp_status;
var sel_confirm;
var del_val;
var emp_stateInfo;
var emp_tbody;
var toSend = {};
var emp_url = "http://localhost:8080/CleanSystem/emp_crud.php";
var jsonString;
var emp_tableHTML = "";
const xmlhttp =new XMLHttpRequest();

var emp_crud_init = function () {
    actionDB("init");
    // var emp_chgpage = document.querySelector("#emp_chgpage");
    var emp_crud = document.getElementById("emp_crud");
    var add_confirm = document.getElementById("add_confirm");
    var up_confirm = document.getElementById("up_confirm");
    var clear_confirm = document.getElementById("clear_confirm");
    emp_startDate = document.getElementById("emp_startDate");
    emp_name = document.getElementById("emp_name");
    emp_title = document.getElementById("emp_title");
    emp_status = document.getElementById("emp_status");
    sel_confirm = document.getElementById("sel_confirm");
    emp_stateInfo = document.getElementById("emp_stateInfo");
    emp_stateInfo.style.color = "#CE0000";
    emp_tbody = document.getElementById("emp_tbody");
    emp_crud.setAttribute("selected", true);
    // emp_chgpage.addEventListener("change", emp_changePage, false);
    add_confirm.addEventListener("click", function(){actionDB("add");});
    sel_confirm.addEventListener("click", function(){actionDB("select");});
    up_confirm.addEventListener("click", function(){actionDB("update")});
    clear_confirm.addEventListener("click", clearInput);
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
            if(emp_startDate.value != "" && emp_name.value != "" && new Date(emp_startDate.value) < nowDate){
                toSend ={
                    pload: "add",
                    startDate: emp_startDate.value,
                    emp_name: emp_name.value,
                    title: emp_title.value,
                    state: state
                };   
                httpReqFun(toSend);
            }else{
                emp_stateInfo.innerText = info_tw("STARTDATE AND NAME BE EMPTY");
            }
            break;
        case "select":
            if(emp_name.value != "" || emp_startDate.value != ""){
                toSend ={
                    pload: "select",
                    emp_name: emp_name.value,
                    date: emp_startDate.value
                };
                httpReqFun(toSend);
            }else{
                toSend = {pload: "init"};
                httpReqFun(toSend);
            }
            break;
        case "update":
            var state = emp_status.checked?"在職":"離職";
            if(emp_name.value != ""){
                toSend ={
                    pload: "update",
                    startDate: emp_startDate.value,
                    emp_name: emp_name.value,
                    title: emp_title.value,
                    state: state
                };   
                httpReqFun(toSend);
            }else{
                emp_stateInfo.innerText = info_tw("NAME BE EMPTY");
            }
            break;
        case "delete":
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
                emp_stateInfo.innerText = "";
            },5000);
              
            switch(arr_data["status"]){
                case "add success":
                case "update success":
                case "delete success":
                    actionDB("init");
                    clearInput();
                    break;
                case "success!":
                    emp_stateInfo.innerText = info_tw("SUCCESS");
                    parseAllData(arr_data);
                    break;
                case "no data":
                    emp_stateInfo.innerText = info_tw("NO DATA");
                    break;
                case "update fail":
                case "duplicate":
                    emp_stateInfo.innerText = info_tw("DUPLICATE");
                    parseAllData(arr_data);
                    break;
            }  
        }
    }
    xmlhttp.send(jsonString);
}

var parseAllData = function (initData){
    emp_tableHTML = "";
    emp_tbody.innerHTML = "<tr class='table-success justify-content-center'><td class='col-3'>到職日</td><td class='col-2'>員工</td><td class='col-2'>職稱</td><td class='col-2'>狀態</td><td class='col-3'></td></tr>";
    if(initData["status"] != "update fail" && initData["status"] != "no data" && initData["status"] != "duplicate"){
        var data_size = Object.keys(initData["emp_name"]).length;
        for(var j = 1; j <= data_size; j++){
            emp_tableHTML += "<tr class = 'justify-content-center'><td class=''>"+initData.startdate[j]+"</td><td class=''>"+initData.emp_name[j]+"</td><td class=''>"+initData.title[j]+"</td><td class=''>"+initData.state[j]+"</td>";
            emp_tableHTML += "<td class=''><button class='btn btn-outline-success btn-sm' type='button' onclick='updInner(this)'>選取</button>"
            emp_tableHTML += "&nbsp&nbsp<button type='button' class='btn btn-outline-success btn-sm' data-bs-toggle='modal' data-bs-target='#exampleModal' onclick='del(this)'>刪除</button></td></tr>"
        }
        emp_tbody.innerHTML += emp_tableHTML;
    }
}

var emp_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
}

var clearInput = function (){
    emp_startDate.value = "";
    emp_name.value = "";
    var director = document.getElementById("director");
    director.setAttribute("selected", true);
    emp_status.checked = false;
}

var del = function (obj){
    var del_str = obj.parentNode.parentNode.innerText;
    var del_td_arr = del_str.split(/\t/);
    var modalOK = document.getElementById("modalOK");
    var modalText = document.getElementById("modalText");
    del_val = del_td_arr[1];
    modalText.innerText = del_td_arr[0]+", "+del_td_arr[1];
    modalOK.addEventListener("click",function(){
        actionDB("delete");
    })
}

var updInner = function (obj){
    var upd_str = obj.parentNode.parentNode.innerText;
    var upd_td_arr = upd_str.split(/\t/);
    var upd_starDate = upd_td_arr[0];
    var upd_name = upd_td_arr[1];
    var upd_title = upd_td_arr[2];
    var upd_state = upd_td_arr[3];
    upd_state = (upd_state == "在職")? true : false;
    emp_startDate.value = upd_starDate;
    emp_name.value = upd_name;
    emp_title.value = upd_title;
    emp_status.checked = upd_state;
}