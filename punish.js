var pun_calender;
var pun_name;
var pun_txt;
var pun_stateInfo;
var pun_tbody;
var del_name;
var del_pun_calender;
var pun_toSend ={};
var pun_url = "http://localhost:8080/CleanSystem/punish.php";
const xmlhttp =new XMLHttpRequest();

var pun_init = function (){
    console.log("pun_init");
    // var pun_chgpage = document.querySelector("#pun_chgpage");
    var pun_punish = document.getElementById("pun_punish");
    pun_calender = document.getElementById("pun_calender");
    pun_name = document.getElementById("pun_name");
    pun_txt = document.getElementById("pun_txt");
    var pun_sel_confirm = document.getElementById("pun_sel_confirm");
    var pun_ad_confirm = document.getElementById("pun_ad_confirm");
    var pun_up_confirm = document.getElementById("pun_up_confirm");
    pun_stateInfo = document.getElementById("pun_stateInfo");
    pun_stateInfo.style.color = "#CE0000";
    pun_tbody = document.getElementById("pun_tbody");
    var pun_clear = document.getElementById("pun_clear");
    actionDB("init");
    // pun_punish.setAttribute("selected", true);
    // pun_chgpage.addEventListener("change", pun_changePage, false);
    pun_ad_confirm.addEventListener("click", function(){actionDB("add");});
    pun_sel_confirm.addEventListener("click", function(){actionDB("select");});
    pun_up_confirm.addEventListener("click", function(){actionDB("update")});
    pun_clear.addEventListener("click", clearInput);
}

var actionDB = function(params) {
    var dateObj = new Date();
    var nowDate = new Date(dateObj.getFullYear() + "-" + (dateObj.getMonth()+1) + "-" + dateObj.getDate());
    switch(params){
        case "init":
            pun_toSend = {pload: "init"};
            httpReqFun(pun_toSend);
            break;
        case "add":
            if(pun_calender.value != "" && pun_name.value != "" && pun_txt.value !="" && new Date(pun_calender.value) < nowDate){
                pun_toSend ={
                    pload: "add",
                    date: pun_calender.value,
                    name: pun_name.value,
                    punishtxt: pun_txt.value,
                };   
                httpReqFun(pun_toSend);
            }else{
                pun_stateInfo.innerText = info_tw("FORM BE EMPTY") + "||" + info_tw("WRONG DATE");
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
                pun_stateInfo.innerText = info_tw("NAME BE EMPTY");
            }
            break;
        case "delete":
            pun_toSend ={
                pload: "delete",
                name: del_name,
                date: del_pun_calender
            };   
            httpReqFun(pun_toSend);
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
            },5000);
            // console.log("arr_data",arr_data); 
            switch(arr_data["status"]){
            case "add success":
            case "update success":
            case "delete success":
            case "no data update":
                actionDB("init");
                clearInput();
                break;
            case "success!":
            case "select success":
                pun_stateInfo.innerText = info_tw("SUCCESS");
                parseAllData(arr_data);
                break;
            case "no data":
                pun_stateInfo.innerText = info_tw("NO DATA");
                break;
            case "date duplicate":
                pun_stateInfo.innerText = info_tw("DUPLICATE");
                break;
            }  
        }
    }
    xmlhttp.send(jsonString);
}

var parseAllData = function (initData){
    pun_tbody.innerHTML = "<tr class='table-success justify-content-center'><td class='col-2'>受罰日期</td><td class='col-1'>值日生</td><td class='col-2'>懲罰原因</td><td class='col-1'>次數</td><td class='col-1'>罰金</td><td class='col-1'>倍率</td><td class='col-1'>進度</td><td class='col-3'></td></tr>";
    pun_tableHTML = "";
    var pun_done = "";
        var data_size = Object.keys(initData["name"]).length;
        for(var j = 1; j <= data_size; j++){
            pun_done = (initData.pun_done[j] != 0)?"完成":"";
            //以次數判斷，要付清哪一欄的錢。
            //1.EX: a(5/7 6/16 7/6) & b(6/16 7/6 8/24)，a.5/7 b沒包括到，須結清。b後面還有筆數，待清 ....等於。
            //2.最後一筆，需結清，不確定後面還有沒有筆數....最大長度。
            //3.Ex:c(6/16 7/7 8/24 9/8) & d(8/24 9/8 10/7)，d為最後一筆，必須結清，d沒包括到7/6(7/8基準日)，所以c須結清....大於。
            if(initData.times[j]*1 >= initData.times[j+1]*1 || j == data_size){
                pun_tableHTML += "<tr class='justify-content-center' style='background-color :#FF7575';><td>"+initData.date[j]+"</td><td>"+initData.name[j]+"</td>";
                pun_tableHTML += "<td>"+initData.punishtxt[j]+"</td><td>"+initData.times[j]+"</td><td>"+initData.fine[j]+"</td><td>"+initData.odds[j]+"</td><td>"+ pun_done +"</td>";
            }else{
                pun_tableHTML += "<tr class='justify-content-center'><td>"+initData.date[j]+"</td><td>"+initData.name[j]+"</td>";
                pun_tableHTML += "<td>"+initData.punishtxt[j]+"</td><td>"+initData.times[j]+"</td><td>"+initData.fine[j]+"</td><td>"+initData.odds[j]+"</td><td>"+ pun_done +"</td>";
            }
            pun_tableHTML += "<td style='width:110px'><button type='button' class='btn btn-outline-success btn-sm mb-1' onclick='upd(this)'>選取</button>"
            pun_tableHTML += "&nbsp&nbsp<button type='button' class='btn btn-outline-success btn-sm' data-bs-toggle='modal' data-bs-target='#exampleModal' onclick='del(this)'>刪除</button></td></tr>"

        }
        pun_tbody.innerHTML += pun_tableHTML;
}

var pun_changePage = function (e) {
        window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
}

var clearInput = function (){
    var pun_default = document.getElementById("pun_default");
    pun_calender.value = "";
    pun_name.value = "";
    pun_default.setAttribute("selected", true);
    pun_txt.value = "";
}

var del = function (obj){
    var del_str = obj.parentNode.parentNode.innerText;
    var del_td_arr = del_str.split(/\t/);
    var modalPunOK = document.getElementById("modalPunOK");
    var modalPunText = document.getElementById("modalPunText");
    del_pun_calender = del_td_arr[0];
    del_name = del_td_arr[1];
    modalPunText.innerText = del_td_arr[0]+", "+del_td_arr[1]+", "+del_td_arr[2]
    modalPunOK.addEventListener("click",function(){
        actionDB("delete");
    })
}

var upd = function (obj){
    var upd_str = obj.parentNode.parentNode.innerText;
    var upd_td_arr = upd_str.split(/\t/);
    var upd_pun_calender = upd_td_arr[0];
    var upd_name = upd_td_arr[1];
    var upd_punishtxt = upd_td_arr[2];
    pun_calender.value = upd_pun_calender;
    pun_name.value = upd_name;
    pun_txt.value = upd_punishtxt;
}