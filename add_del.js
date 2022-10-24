var ad_chgpage;
var ad_add_del;
var ad_startDate;
var ad_name;
var ad_title;
var ad_status;
var ad_confirm;
var up_confirm;
var sel_confirm;
var del_confirm;
var ad_stateInfo;
var ad_tbody;
var toSend = {};
var em_url = "http://localhost:8080/CleanSystem/employee.php";
var jsonString;
var ad_tableHTML = "";
const xmlhttp =new XMLHttpRequest();

var add_del_init = function () {
    console.log("add_del_init");
    ad_chgpage = document.querySelector("#ad_chgpage");
    ad_add_del = document.getElementById("ad_add_del");
    ad_startDate = document.getElementById("ad_startDate");
    ad_name = document.getElementById("ad_name");
    ad_title = document.getElementById("ad_title");
    ad_status = document.getElementById("ad_status");
    ad_confirm = document.getElementById("ad_confirm");
    up_confirm = document.getElementById("up_confirm");
    sel_confirm = document.getElementById("sel_confirm");
    del_confirm = document.getElementById("del_confirm");
    ad_stateInfo = document.getElementById("ad_stateInfo");
    ad_tbody = document.getElementById("ad_tbody");
    actionDB("init");
    ad_add_del.setAttribute("selected", true);
    ad_chgpage.addEventListener("change", ad_changePage, false);
    ad_confirm.addEventListener("click", function(){actionDB("add");});
    sel_confirm.addEventListener("click", function(){actionDB("select");});
    up_confirm.addEventListener("click", function(){actionDB("update")});
    del_confirm.addEventListener("click", function(){actionDB("delete")});


}

var actionDB = function(params) {
    switch(params){

        case "init":
            toSend = {pload: "init"};
            httpReqFun(toSend);
            break;

        case "add":
            var state = ad_status.checked?"在職":"離職";
            if(ad_startDate.value != "" && ad_name.value != ""){
                toSend ={
                    pload: "add",
                    startDate: ad_startDate.value,
                    name: ad_name.value,
                    title: ad_title.value,
                    state: state
                };   
                httpReqFun(toSend);
            }else{
                ad_stateInfo.innerText = "到職日或名字不得為空";
            }
            break;

        case "select":
            if(ad_name.value != ""){
                toSend ={
                    pload: "select",
                    name: ad_name.value
                };
                httpReqFun(toSend);
            }else{
                toSend = {pload: "init"};
                httpReqFun(toSend);
            }
            break;

        case "update":
            var state = ad_status.checked?"在職":"離職";
            // if(ad_startDate.value != "" && ad_name.value != ""){
            if(ad_name.value != ""){
                toSend ={
                    pload: "update",
                    startDate: ad_startDate.value,
                    name: ad_name.value,
                    title: ad_title.value,
                    state: state
                };   
                httpReqFun(toSend);
            }else{
                ad_stateInfo.innerText = "名字不得為空";
            }
            break;
        case "delete":
            if(ad_name.value != ""){
                toSend ={
                    pload: "delete",
                    name: ad_name.value,
                };   
                httpReqFun(toSend);
            }else{
                ad_stateInfo.innerText = "名字不得為空";
            }


    }
}

var httpReqFun = function (param){
    var arr_data;
    jsonString = JSON.stringify(param);
    xmlhttp.open("POST",em_url);
    xmlhttp.setRequestHeader("Content-Type","application/json");
    xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState === 4 && xmlhttp.status == 200){
            arr_data = JSON.parse(xmlhttp.responseText);
            setTimeout(function(){
                ad_stateInfo.innerText = "";
            },3000);
            if(arr_data["status"] == "add success" || arr_data["status"] == "update success" ||arr_data["status"] == "delete success"){
                actionDB("init");
                clearInput();
        
            }else if(arr_data["status"] == "success!"|| arr_data["status"] == "select success" || arr_data["status"] == "no data" || arr_data["status"] == "update fail"  || arr_data["status"] == "duplicate"){
                ad_stateInfo.innerText = arr_data["status"];
                parseAllData(arr_data);
            }        
        }
    }
    xmlhttp.send(jsonString);
}

var parseAllData = function (initData){
    ad_tableHTML = "";
    ad_tbody.innerHTML = "<tr class=first_tr><td>到職日</td><td>員工</td><td>職稱</td><td>狀態</td></tr>";
    if(initData["status"] != "update fail" && initData["status"] != "no data"){
        var data_size = Object.keys(initData["name"]).length;
        for(var j = 1; j <= data_size; j++){
            ad_tableHTML += "<tr class = datatr><td>"+initData.startdate[j]+"</td><td>"+initData.name[j]+"</td><td>"+initData.title[j]+"</td><td>"+initData.state[j]+"</td></tr>";
        }
        ad_tbody.innerHTML += ad_tableHTML;
        getAllElement();
    }
}

var ad_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
}

var clearInput = function (){
    ad_startDate.value = "";
    ad_name.value = "";
    var director = document.getElementById("director");
    director.setAttribute("selected", true);
    ad_status.checked = false;
}

var getAllElement = function (){
    var datatrCls = document.getElementsByClassName("datatr");
    for(var i = 0; i < datatrCls.length; i++) {
        datatrCls[i].addEventListener("mouseover", function(){
            this.style.backgroundColor = "gray";
        })
        datatrCls[i].addEventListener("mouseout", function(){
            this.style.backgroundColor = "white";
        })
    }
}
