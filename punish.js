var pu_chgpage;
var pun_punish;
var pun_calender;
var pun_name;
var pun_txt;
var pun_default;
var pun_sel_confirm;
var pun_ad_confirm;
var pun_up_confirm;
var pun_del_confirm;
var pun_stateInfo;
var pun_tbody;
var pun_toSend ={};
var pun_url = "http://localhost:8080/CleanSystem/punish.php";
const xmlhttp =new XMLHttpRequest();
// var pun_list ={};

//新增/修改懲罰
//顯示懲罰列表，可時間篩選
//計算懲罰結果、設定繳費狀況
var pun_init = function(){
    console.log("pun_init");
    pun_chgpage = document.querySelector("#pun_chgpage");
    pun_punish = document.getElementById("pun_punish");

    pun_calender = document.getElementById("pun_calender");
    pun_name = document.getElementById("pun_name");
    pun_txt = document.getElementById("pun_txt");

    pun_sel_confirm = document.getElementById("pun_sel_confirm");
    pun_ad_confirm = document.getElementById("pun_ad_confirm");
    pun_up_confirm = document.getElementById("pun_up_confirm");
    pun_del_confirm = document.getElementById("pun_del_confirm");

    pun_stateInfo = document.getElementById("pun_stateInfo");
    pun_tbody = document.getElementById("pun_tbody");
    actionDB("init");
    pun_punish.setAttribute("selected", true);
    pun_chgpage.addEventListener("change", pun_changePage, false);
    pun_ad_confirm.addEventListener("click", function(){actionDB("add");});
    pun_sel_confirm.addEventListener("click", function(){actionDB("select");});
    pun_up_confirm.addEventListener("click", function(){actionDB("update")});
    pun_del_confirm.addEventListener("click", function(){actionDB("delete")});
}

var actionDB = function(params) {
    var dateObj = new Date();
    var nowDate = dateObj.getFullYear() + "-" + (dateObj.getMonth()+1) + "-" + dateObj.getDate();
    switch(params){
        case "init":
            pun_toSend = {pload: "init"};
            httpReqFun(pun_toSend);
            break;

        case "add":
            if(pun_calender.value != "" && pun_name.value != "" && pun_txt.value !="" && pun_calender.value < nowDate){
                pun_toSend ={
                    pload: "add",
                    date: pun_calender.value,
                    name: pun_name.value,
                    punishtxt: pun_txt.value,
                };   
                httpReqFun(pun_toSend);
            }else{
                pun_stateInfo.innerText = "表格不得為空||日期錯誤";
            }
            break;

        case "select":
            if(pun_name.value != "" || pun_calender.value!=""){
                pun_toSend ={
                    pload: "select",
                    name: pun_name.value,
                    date: pun_calender.value
                };
                httpReqFun(pun_toSend);
            }else{
                pun_toSend = {pload: "init"};
                httpReqFun(pun_toSend);
            }
            break;

        case "update":
            if(pun_name.value != "" && pun_calender.value!=""){
                pun_toSend ={
                    pload: "update",
                    date: pun_calender.value,
                    name: pun_name.value,
                    punishtxt: pun_txt.value,
                };   
                httpReqFun(pun_toSend);
            }else{
                pun_stateInfo.innerText = "名字和日期不得為空";
            }
            break;

        case "delete":
            if(pun_name.value != "" && pun_calender.value!=""){
                pun_toSend ={
                    pload: "delete",
                    name: pun_name.value,
                    date: pun_calender.value
                };   
                httpReqFun(pun_toSend);
            }else{
                pun_stateInfo.innerText = "名字和日期不得為空";
            }
            break;
    }
}

var httpReqFun = function (param){
    var arr_data;
    jsonString = JSON.stringify(param);
    xmlhttp.open("POST",pun_url);
    xmlhttp.setRequestHeader("Content-Type","application/json");
    xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState === 4 && xmlhttp.status == 200){
            arr_data = JSON.parse(xmlhttp.responseText);
            setTimeout(function(){
                pun_stateInfo.innerText = "";
            },3000);
            if(arr_data["status"] == "add success" || arr_data["status"] == "update success" ||arr_data["status"] == "delete success" ||arr_data["status"] == "no data update"){
                actionDB("init");
                clearInput();
            }else if(arr_data["status"] == "success!" || arr_data["status"] == "select success"  || arr_data["status"] == "no data" || arr_data["status"] == "update fail" || arr_data["status"] == "duplicate"){
                pun_stateInfo.innerText = arr_data["status"];
                parseAllData(arr_data);
            }        
        }
    }
    xmlhttp.send(jsonString);
}

var parseAllData = function (initData){
    pun_tableHTML = "";
    pun_tbody.innerHTML = "<tr class=first_tr><td>受罰日期</td><td>值日生</td><td>懲罰原因</td><td>次數</td><td>罰金</td><td>倍率</td></tr>";
    if(initData["status"] != "update fail" && initData["status"] != "no data" && initData["status"] != "duplicate"){
        var data_size = Object.keys(initData["name"]).length;
        // console.log("initData",initData);
        for(var j = 1; j <= data_size; j++){
            if(initData.times[j] == initData.times[j+1] || j == data_size){
                pun_tableHTML += "<tr class = data_pun_tr  style = 'background-color :#FF7575';><td>"+initData.date[j]+"</td><td>"+initData.name[j]+"</td><td>"+initData.punishtxt[j]+"</td><td>"+initData.times[j]+"</td><td>"+initData.fine[j]+"</td><td>"+initData.odds[j]+"</td></tr>";
            }else{
                pun_tableHTML += "<tr class = data_pun_tr><td>"+initData.date[j]+"</td><td>"+initData.name[j]+"</td><td>"+initData.punishtxt[j]+"</td><td>"+initData.times[j]+"</td><td>"+initData.fine[j]+"</td><td>"+initData.odds[j]+"</td></tr>";

            }
        }

        
        

        pun_tbody.innerHTML += pun_tableHTML;
        // getAllElement();
    }
}

var pun_changePage = function (e) {
        window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
}

var clearInput = function (){
    var pun_default = document.getElementById("pun_default");
    pun_calender.value = "";
    pun_name.value = "";
    pun_default.setAttribute("selected", true);
    pun_txt.checked = false;
}
