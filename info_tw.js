 var info_tw = function (str){
    var array = new Object();
    array["GENER SUCCESS"] = "生成成功!點擊儲存此列表將會保存下來";
    array["LIST EXISIT"] = "列表已存在";
    array["FORM NOT BE EMPTY"] = "表格不得為空";
    array["UNSCHEDULED"] = "上個月未排值日生";
    array["SAVED"] = "已儲存";
    array["WRONG FORMAT"] = "格式錯誤!";
    array["DATE OF THE MON"] = "請輸入這個月的日期";
    array["WRONG DATE"] = "日期錯誤";
    array["NAME NOT BE EMPTY"] = "名字不得為空";
    array["NAME AND DATE NOT BE EMPTY"] = "名字和日期不得為空";
    array["SUCCESS"] = "成功";
    array["NO DATA"] = "無資料";
    array["DUPLICATE"] = "資料重複";
    array["STARTDATE AND NAME NOT BE EMPTY"] = "到職日或名字不得為空";
    array["LESS THAN ONE MONTH"] = "未滿一個月";
    array["DELETE"] = "會連該月及該月後的月份都刪除，如有設定代替、調用、開關設定請先記錄起來";
  
    return array[str];
}