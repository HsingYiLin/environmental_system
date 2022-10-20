var ad_chgpage;
var ad_add_del;
var ad_startDate;
var ad_name;
var ad_title;
var ad_status;
var ad_confirm;
var stateInfo;
var ad_tbody;
var toSend = {};
var em_url = "http://localhost:8080/CleanSystem/employee.php";
var jsonString;
var ad_tableHTML = "";
//在增加的時候會重複增加一次
//重整的時候不會
var add_del_init = function () {
    console.log("add_del_init");
    ad_chgpage = document.querySelector("#ad_chgpage");
    ad_add_del = document.getElementById("ad_add_del");
    ad_startDate = document.getElementById("ad_startDate");
    ad_name = document.getElementById("ad_name");
    ad_title = document.getElementById("ad_title");
    ad_status = document.getElementById("ad_status");
    ad_confirm = document.getElementById("ad_confirm");
    stateInfo = document.getElementById("stateInfo");
    ad_tbody = document.getElementById("ad_tbody");
    loadTable();
    ad_add_del.setAttribute("selected", true);
    ad_chgpage.addEventListener("change", ad_changePage, false);
    ad_confirm.addEventListener("click", ad_req_val);
}

var loadTable = function (){
    var row = "";
    toSend = {pload: "init"};
    jsonString = JSON.stringify(toSend);
    // console.log("dynamicTable",jsonString);
    const xmlhttp =new XMLHttpRequest();
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

var ad_req_val = function (){ 
    var state = ad_status.checked?"T":"F";
    var data = "";

    if(ad_startDate.value != "" && ad_name.value != ""){
        toSend ={
            pload: "add",
            startDate: ad_startDate.value,
            name: ad_name.value,
            title: ad_title.value,
            state: state
        };
        
        // keyInfo(toSend);
        jsonString = JSON.stringify(toSend);
        console.log(jsonString);
        const xhr = new XMLHttpRequest();//試試看遍全域
        xhr.open("POST",em_url);
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status == 200){
                data = xhr.responseText;
                loadFinish(data);
            }

        }
        xhr.send(jsonString);
    }else{
        loadFinish("到職日或名字不得為空");
    }    
}

var loadFinish = function (json){
    var arr_data = JSON.parse(json);
    // console.log("loadFinish",arr_data);
    stateInfo.innerText = arr_data["status"];
    setTimeout(function(){
        stateInfo.innerText = "";
    },3000);

    if(arr_data["status"] == "add success"){
        parseTable(toSend);
    }else if(arr_data["status"] == "init success"){
        parseAllData(arr_data);
    }
}

var parseTable = function (data){
    // var ad_tableHTML = "";
    // console.log("parseTable",data);
    console.log(data.name);
    ad_tableHTML += "<tr><td>"+data.startDate+"</td><td>"+data.name+"</td><td>"+data.title+"</td><td>"+data.state+"</td></tr>"
    ad_tbody.innerHTML += ad_tableHTML;
}

var parseAllData = function (initData){
    var data_size = Object.keys(initData["name"]).length;
    var init_tableHTML = "";
    for(var j = 0; j < data_size; j++){
        ad_tableHTML += "<tr><td>"+initData.startdate[j]+"</td><td>"+initData.name[j]+"</td><td>"+initData.title[j]+"</td><td>"+initData.state[j]+"</td></tr>";
    }
    ad_tbody.innerHTML += ad_tableHTML;
}

var ad_changePage = function (e) {
    window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
}