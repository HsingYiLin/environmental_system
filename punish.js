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
var pun_toSend
var pun_url = "http://localhost:8080/CleanSystem/punish.php";
const xmlhttp =new XMLHttpRequest();

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
    switch(params){

        case "init":
            console.log("init");
            pun_toSend = {pload: "init"};
            httpReqFun(pun_toSend);
            break;

        case "add":
            console.log("add");
            if(pun_calender.value != "" && pun_name.value != "" && pun_txt.value !=""){
                pun_toSend ={
                    pload: "add",
                    date: pun_calender.value,
                    name: pun_name.value,
                    punishtxt: pun_txt.value,
                };   
                httpReqFun(pun_toSend);
            }else{
                // pun_stateInfo.innerText = "表格不得為空";
            }
            break;

        case "select":
            if(pun_name.value != ""){
                pun_toSend ={
                    pload: "select",
                    name: pun_name.value
                };
                httpReqFun(pun_toSend);
            }else{
                pun_toSend = {pload: "init"};
                httpReqFun(pun_toSend);
            }
            break;

        case "update":
            if(pun_name.value != ""){
                pun_toSend ={
                    pload: "update",
                    date: pun_calender.value,
                    name: pun_name.value,
                    punishtxt: pun_txt.value,
                    state: state
                };   
                httpReqFun(pun_toSend);
            }else{
                // pun_stateInfo.innerText = "名字不得為空";
            }
            break;
        // case "delete":
        //     console.log("delete");
        //     if(ad_name.value != ""){
        //         console.log("delete enter");
        //         pun_toSend ={
        //             pload: "delete",
        //             name: ad_name.value,
        //         };   
        //         httpReqFun(pun_toSend);
        //     }else{
        //         // pun_stateInfo.innerText = "名字不得為空";
        //     }


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
        
            if(arr_data["status"] == "add success" || arr_data["status"] == "update success" ||arr_data["status"] == "delete success"){
                actionDB("init");
                clearInput();
            }else if(arr_data["status"] == "success!" || arr_data["status"] == "select success"  || arr_data["status"] == "no data" || arr_data["status"] == "duplicate"){
                pun_stateInfo.innerText = arr_data["status"];
                parseAllData(arr_data);
            }        
        }
    
    }
    xmlhttp.send(jsonString);
}

var parseAllData = function (initData){
    pun_tableHTML = "";
    pun_tbody.innerHTML = "<tr class=first_tr><td>受罰日期</td><td>值日生</td><td>懲罰原因</td><td>次數</td><td>罰金</td></tr>";
    if(initData["status"] != "update fail" && initData["status"] != "no data"){
        var data_size = Object.keys(initData["name"]).length;
        for(var j = 1; j <= data_size; j++){
            pun_tableHTML += "<tr class = datatr><td>"+initData.date[j]+"</td><td>"+initData.name[j]+"</td><td>"+initData.punishtxt[j]+"</td><td></td><td></td></tr>";
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
