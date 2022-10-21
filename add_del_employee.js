var ad_chgpage;
var ad_add_del;
var ad_startDate;
var ad_name;
var ad_title;
var ad_status;
var ad_confirm;
var up_confirm;
var sel_confirm;
var stateInfo;
var ad_tbody;
var toSend = {};
var em_url = "http://localhost:8080/CleanSystem/employee.php";
var jsonString;
var ad_tableHTML = "";
var director;
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
    stateInfo = document.getElementById("stateInfo");
    ad_tbody = document.getElementById("ad_tbody");
    director = document.getElementById("director");
    loadTable();
    ad_add_del.setAttribute("selected", true);
    ad_chgpage.addEventListener("change", ad_changePage, false);
    ad_confirm.addEventListener("click", addReqVal);
    // up_confirm.addEventListener("click", updateReqVal);
    // sel_confirm.addEventListener("click", selelectReqVal);

}

var loadTable = function (){
    toSend = {pload: "init"};
    jsonString = JSON.stringify(toSend);
    // console.log("dynamicTable",jsonString);
    // const xmlhttp =new XMLHttpRequest();
    xmlhttp.open("POST" ,em_url);
    xmlhttp.setRequestHeader("Content-Type","application/json");
    xmlhttp.onreadystatechange = () =>{
        if(xmlhttp.readyState === 4 && xmlhttp.status == 200){
            data = xmlhttp.responseText;
            loadFinish(data);
        }
    }
    xmlhttp.send(jsonString);
}

var addReqVal = function (){ 
    var state = ad_status.checked?"在職":"離職";
    var data = "";

    if(ad_startDate.value != "" && ad_name.value != ""){
        toSend ={
            pload: "add",
            startDate: ad_startDate.value,
            name: ad_name.value,
            title: ad_title.value,
            state: state
        };
        
        jsonString = JSON.stringify(toSend);
        console.log(jsonString);
        // xmlhttp = new XMLHttpRequest();//試試看遍全域
        xmlhttp.open("POST",em_url);
        xmlhttp.setRequestHeader("Content-Type","application/json");
        xmlhttp.onreadystatechange = () => {
            if(xmlhttp.readyState === 4 && xmlhttp.status == 200){
                data = xmlhttp.responseText;
                loadFinish(data);
            }
        }
        xmlhttp.send(jsonString);
    }else{
        stateInfo.innerText = "到職日或名字不得為空";
    }    
}

// var updateReqVal = function (e){
//     toSend = {
//         pload: "update",
//         startDate: ad_startDate.value,
//         name: ad_name.value,
//         title: ad_title.value,
//         state: state
//     };
//     // console.log(toSend);

// var selelectReqVal = function (){
//     if(ad_name.value != ""){
//         toSend ={
//             pload: "select",
//             name: ad_name.value,
//         };
        
//         jsonString = JSON.stringify(toSend);
//         console.log(jsonString);
//         xmlhttp = new XMLHttpRequest();//試試看遍全域
//         xmlhttp.open("POST",em_url);
//         xmlhttp.setRequestHeader("Content-Type","application/json");
//         xmlhttp.onreadystatechange = () => {
//             if(xmlhttp.readyState === 4 && xmlhttp.status == 200){
//                 data = xmlhttp.responseText;
//                 loadFinish(data);
//             }
//         }
//         xmlhttp.send(jsonString);
//     }else{
//         stateInfo.innerText = "到職日或名字不得為空";
//     }    
// }

var loadFinish = function (json){
    var arr_data = JSON.parse(json);
    console.log("loadFinish",arr_data);

    setTimeout(function(){
        stateInfo.innerText = "";
    },3000);

    if(arr_data["status"] == "add success"){
        // parseTable(toSend);
        loadTable();
        clearInput();
    }else if(arr_data["status"] == "success!"){
        stateInfo.innerText = arr_data["status"];
        parseAllData(arr_data);
    }else if(arr_data["status"] == "duplicate"){
        stateInfo.innerText = arr_data["status"];
    }
}

var parseAllData = function (initData){
    ad_tableHTML = "";
    ad_tbody.innerHTML = "<tr class=first_tr><td>到職日</td><td>員工</td><td>職稱</td><td>狀態</td></tr>";
    var data_size = Object.keys(initData["name"]).length;
    for(var j = 1; j <= data_size; j++){
        ad_tableHTML += "<tr class = datatr><td>"+initData.startdate[j]+"</td><td>"+initData.name[j]+"</td><td>"+initData.title[j]+"</td><td>"+initData.state[j]+"</td></tr>";
    }
    ad_tbody.innerHTML += ad_tableHTML;
    getAllElement();
}

var ad_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
}

var clearInput = function (){
    ad_startDate.value = "";
    ad_name.value = "";
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

// var parseTable = function (data){
//     clearInput();
//     ad_tableHTML = "";
//     // console.log("parseTable",data);
//     ad_tableHTML += "<tr ><td>"+data.startDate+"</td><td>"+data.name+"</td><td>"+data.title+"</td><td>"+data.state+"</td></tr>"
//     ad_tbody.innerHTML += ad_tableHTML;
// }