 var info_tw = function (str){
    var array = new Object();
    array["GENER SUCCESS"] = "生成成功!點擊儲存此列表將會保存下來";
    array["LIST EXISIT"] = "列表已存在";
    array["FORM BE EMPTY"] = "表格不得為空";
    array["UNSCHEDULED"] = "上個月未排值日生";
    array["SAVED"] = "已儲存";
    array["WRONG FORMAT"] = "格式錯誤!";
    array["DATE OF THE MON"] = "請輸入這個月的日期";
    array["WRONG DATE"] = "日期錯誤";
    array["NAME BE EMPTY"] = "名字不得為空";
    array["TITLE BE EMPTY"] = "職位不得為空";
    array["SUCCESS"] = "成功";
    array["NO DATA"] = "無資料";
    array["DUPLICATE"] = "資料重複";
    array["STARTDATE AND NAME BE EMPTY"] = "輸入框不得為空";
    array["LESS THAN ONE MONTH"] = "未滿一個月";
    array["DELETE"] = "刪除值日生表前，如果該月有代替、調用、開關設定，請先自行記錄!";
    array["EMP NO DATA"] = "請先往員工增修表新增員工";
    array["DEL SUCCESS"] = "刪除成功";
    array["UPDATE FAIL"] = "修改失敗(日期無法修改)"
    return array[str];
}