var pu_chgpage;
var pun_punish;

var pun_init = function(){
    console.log("pun_init");
    pun_chgpage = document.querySelector("#pun_chgpage");
    pun_punish = document.getElementById("pun_punish");
    pun_punish.setAttribute("selected", true);
    pun_chgpage.addEventListener("change", pun_changePage, false);
}

var pun_changePage = function (e) {
    // console.log("pun_changePage");
    if(this.value == "employee"){
        window.location.replace("C:/xampp/htdocs/CleanSystem/"+this.value+".html")
    }
}