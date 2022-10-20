var ad_chgpage;
var ad_add_del;
var ad_startDate;
var ad_name;
var ad_title;
var ad_state;
var ad_confirm;

var add_del_init = function () {
    console.log("add_del_init");
    ad_chgpage = document.querySelector("#ad_chgpage");
    ad_add_del = document.getElementById("ad_add_del");
    ad_startDate = document.getElementById("ad_startDate");
    ad_name = document.getElementById("ad_name");
    ad_title = document.getElementById("ad_title");
    ad_state = document.getElementById("ad_state");
    ad_confirm = document.getElementById("ad_confirm");

    ad_add_del.setAttribute("selected", true);
    ad_chgpage.addEventListener("change", ad_changePage, false);
    ad_confirm.addEventListener("click", ad_req_val);

}

var ad_changePage = function (e) {
    // if(this.value == "ad_del"){
        window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
    // }
}

var ad_req_val = function (){
    var em_url = "http://localhost:8080/CleanSystem/employee.php"
    var toSend ={
        pload: "add_del",
        startDate: ad_startDate.value.substring(5, 10),
        name: ad_name.value,
        title: ad_title.value,
        state: ad_state.checked
    };
    
    // keyInfo(toSend);
    const jsonString = JSON.stringify(toSend);
    console.log(jsonString);
    const xhr = new XMLHttpRequest();
    xhr.open("POST",em_url);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.send(jsonString); 
}