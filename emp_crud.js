var emp_chgpage;
var emp_crud;
var emp_startDate;
var emp_name;
var emp_title;
var emp_status;
var add_confirm;
var up_confirm;
var sel_confirm;
var del_confirm;
var emp_stateInfo;
var emp_tbody;
var toSend = {};
var emp_url = "http://localhost:8080/CleanSystem/emp_crud.php";
var jsonString;
var emp_tableHTML = "";
const xmlhttp =new XMLHttpRequest();

var emp_crud_init = function () {
    console.log("emp_crud_init");
    emp_chgpage = document.querySelector("#emp_chgpage");
    emp_crud = document.getElementById("emp_crud");
    emp_startDate = document.getElementById("emp_startDate");
    emp_name = document.getElementById("emp_name");
    emp_title = document.getElementById("emp_title");
    emp_status = document.getElementById("emp_status");
    add_confirm = document.getElementById("add_confirm");
    up_confirm = document.getElementById("up_confirm");
    sel_confirm = document.getElementById("sel_confirm");
    del_confirm = document.getElementById("del_confirm");
    emp_stateInfo = document.getElementById("emp_stateInfo");
    emp_tbody = document.getElementById("emp_tbody");
    actionDB("init");
    emp_crud.setAttribute("selected", true);
    emp_chgpage.addEventListener("change", emp_changePage, false);
    add_confirm.addEventListener("click", function(){actionDB("add");});
    sel_confirm.addEventListener("click", function(){actionDB("select");});
    up_confirm.addEventListener("click", function(){actionDB("update")});
    del_confirm.addEventListener("click", function(){actionDB("delete")});
}

var actionDB = function(params) {
    var dateObj = new Date();
    var nowDate = dateObj.getFullYear() + "-" + (dateObj.getMonth()+1) + "-" + dateObj.getDate();
    switch(params){
        case "init":
            toSend = {pload: "init"};
            httpReqFun(toSend);
            break;
        case "add":
            var state = emp_status.checked?"在職":"離職";
            if(emp_startDate.value != "" && emp_name.value != "" && emp_startDate.value < nowDate){
                toSend ={
                    pload: "add",
                    startDate: emp_startDate.value,
                    emp_name: emp_name.value,
                    title: emp_title.value,
                    state: state
                };   
                httpReqFun(toSend);
            }else{
                emp_stateInfo.innerText = "到職日或名字不得為空||日期錯誤";
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
                emp_stateInfo.innerText = "名字不得為空";
            }
            break;
        case "delete":
            if(emp_name.value != ""){
                toSend ={
                    pload: "delete",
                    emp_name: emp_name.value,
                };   
                httpReqFun(toSend);
            }else{
                emp_stateInfo.innerText = "名字不得為空";
            }
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
            },3000);
            if(arr_data["status"] == "add success" || arr_data["status"] == "update success" ||arr_data["status"] == "delete success"){
                actionDB("init");
                clearInput();
        
            }else if(arr_data["status"] == "success!"|| arr_data["status"] == "select success" || arr_data["status"] == "no data" || arr_data["status"] == "update fail"  || arr_data["status"] == "duplicate"){
                emp_stateInfo.innerText = arr_data["status"];
                parseAllData(arr_data);
            }        
        }
    }
    xmlhttp.send(jsonString);
}

var parseAllData = function (initData){
    emp_tableHTML = "";
    emp_tbody.innerHTML = "<tr class=first_tr><td>到職日</td><td>員工</td><td>職稱</td><td>狀態</td></tr>";
    if(initData["status"] != "update fail" && initData["status"] != "no data" && initData["status"] != "duplicate"){
        var data_size = Object.keys(initData["emp_name"]).length;
        for(var j = 1; j <= data_size; j++){
            emp_tableHTML += "<tr class = datatr><td>"+initData.startdate[j]+"</td><td>"+initData.emp_name[j]+"</td><td>"+initData.title[j]+"</td><td>"+initData.state[j]+"</td></tr>";
        }
        emp_tbody.innerHTML += emp_tableHTML;
        getAllElement();
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

var getAllElement = function (){
    var datatrCls = document.getElementsByClassName("datatr");
    for(var i = 0; i < datatrCls.length; i++) {
        datatrCls[i].addEventListener("mouseover", function(){
            this.style.backgroundColor = "#BEBEBE";
        })
        datatrCls[i].addEventListener("mouseout", function(){
            this.style.backgroundColor = "#FFFFFF";
        })
    }
}