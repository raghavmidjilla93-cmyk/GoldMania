function removeAllRowsFromTable_top3() {
    //alert("11");
    $("#gvData_top3").empty();
}
function removeAllRowsFromTable() {
    //alert("11");
    $("#gvData").empty();
}

function gvData_Trending() {
    $("#gvData_Trending").empty();

}


function gvDataCoins_Trending() {
    $("#gvDataCoins").empty();
}

function gvData_Trending_Fetch() {
    $("#gvData_Trending_Fetch").empty();
}

/*function gvdataCoins_Fetch() {
$("#gvdataCoins_Fetch").empty();
}*/
//Silver Rates
function removeAllRowsFromTable_gvData_SilverRates() {
    $("#gvData_SilverRates").empty();
}

function gvData_Trending_gvData_Trending_SilverRates() {
    $("#gvData_Trending_SilverRates").empty();

}

function gvData_Trending_gvData_Trending_GoldRates() {
    $("#gvData_Trending_GoldRates").empty();

}



function gvData_Gold_Silver_INR_coinss() {
    $("#gvData_Gold_Silver_INR_coinss").empty();
}





function callBuySell(scripCode, scripName) {

    //alert(scripCode);
    //alert(scripName);
    //startSpinner();

    sessionStorage.scripname = scripName;
    sessionStorage.scripcode = scripCode;

    window.location.href = "www/BuySell.htm";

}

function fnStartClock() {

    try {
        //CallWebServiceFromJqueryLiveRateMessage();
        //alert("fnStartClock");
        CallWebServiceFromJquery();

        oInterval = setInterval("CallWebServiceFromJquery()", 500);
        CallWebServiceFromJqueryMarquee();
        var timerMarquee = setInterval("CallWebServiceFromJqueryMarquee()", 30000);
    }
    catch (e) {
        // alert("fnStartClock" + e);
    }
}

function refreshData() {
//    CallWebServiceFromJquery();

//    CallWebServiceFromJqueryGoldCoins();

//    CallWebServiceFromJquerySilverCoins();
}

function fnStopClock() {
    try {
        clearInterval(oInterval);
    }
    catch (e) {
        //  alert("fnStopClock" + e);
    }
}
function fnStartClock_1() {

    try {
        //startSpinner();
        CallWebServiceFromJqueryLiveRateMessage();
        //startSpinner();
        
        CallWebServiceFromJqueryGoldCoins();
        oInterval_1 = setInterval("CallWebServiceFromJqueryGoldCoins()", 500); //500
        // setInterval("resetLiveRateTable_coins()", 10000); //500  
        //float_Message();
    }
    catch (e) {
        // alert("fnStartClock" + e);
    }
}


function fnStartClock_2() {

    try {
        //startSpinner();
        CallWebServiceFromJqueryLiveRateMessage();
        CallWebServiceFromJquerySilverCoins();
        oInterval_2 = setInterval("CallWebServiceFromJquerySilverCoins()", 500); //500
        // setInterval("resetLiveRateTable_Silver()", 10000); //500  
        //float_Message();
    }
    catch (e) {
        // alert("fnStartClock" + e);
    }
}



function fnStopClock_1() {
    try {
        clearInterval(oInterval_1);
    }
    catch (e) {
        //  alert("fnStopClock" + e);
    }
}


function fnStopClock_2() {
    try {
        clearInterval(oInterval_2);
    }
    catch (e) {
        //  alert("fnStopClock" + e);
    }
}


function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function updateTime() {
    var d = new Date();
    var x = document.getElementById("cur_time");
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    x.innerHTML = h + ":" + m + ":" + s;
}
var maxRows = 0;
var oldData;
var oldData01;
var oldData02;
var oldData03;
var screenFontSize = 14;
var oldDataTop;
var oldDataGoldCoins;
var oldDataSilverCoins;
var counterRefresh = 0;
var showOnce = "0";
var showOnce_silver = "0";
var showOnce_coins = "0";
var oldData_Gold_silver_INR_coins;
var oldDataMCX;
var SwiperHeading;
var oldDataTrending_SilverRates;
//Spotttttttttttttttttttt
function CallWebServiceFromJquery() {
    try {


        var template = localStorage.defaultScripTemplateId;

        if (TemplateID) {
            template = TemplateID;
        }
        // alert(template);

        // alert("http://bulliontradingbcast.chirayusoft.com:7767/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/" + template);
        $.ajax({
            type: "GET",
            url: "https://" + localStorage.ipAddressBCast + ":" + localStorage.step3StreamingPort + "/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/" + template,
            dataType: "text",
            crossDomain: true,
            processData: false,
            success: OnSuccess,
            error: OnError,
            cache: false
        });
    }
    catch (e) {
        //alert("CallWebServiceFromJquery " + e);
    }

}

var myColor_Background = "#0d1539";
var Color_ForeColor = "#000";
var Color_ScriptColor = "#141e46";

var Script_Font_LiveRatesCoins = "22px";
var Change_ScriptNameFont = "13px";


//Spottttttttttttttttttt
function OnSuccess(data, status) {
    //alert(data);
    try {
        //updateTime();
        //stopSpinner();


        var messagesDesktopp = "";
        messagesDesktopp = data.split("\n");
        //alert(messagesDesktopp.length);
        if (typeof oldData != 'undefined') {

        }
        else {
            //alert("1");
            oldData = data.toString();
        }
        var messagesOldDesktop = oldData.split("\n");

        if (typeof messagesDesktopp != 'undefined') {
            if (maxRows == 0) {
                maxRows = messagesDesktopp.length;
            }

            removeAllRowsFromTable_top3();
            removeAllRowsFromTable();

            var zebra = "";


            var zebra_top3 = document.getElementById("gvData_top3");
            zebra = document.getElementById("gvData"); //Desktopppppppppppppppppppppppppppp

            var trow = "";
            var trow_top3 = "";
            //GOLD
            var retDesktop = "";
            retDesktop = messagesDesktopp[0].split("\t");
            //alert(retDesktop.length);
            var oldRetDesktop = "";
            var trowString = "";
            var trowString_top3 = "";
            oldRetDesktop = messagesOldDesktop[0].split("\t");

            if (typeof retDesktop[2] != 'undefined') {

                trowString_top3 = trowString_top3 + "<td ><table class=\"table1001\" style=\"\"><tr><td align=\"center\" style=\"width: %;\">";

                if (retDesktop[4] > oldRetDesktop[4]) {
                    trowString_top3 = trowString_top3 + "<td align=\"center\" style=\"padding-left: 10px;padding-right: 10px;\"><table  width=\"100%\" id=\"gold\" class=\"goldd\" style=\"\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align:center !Important;font-size: 16px;font-weight:600;\">" + retDesktop[2] + "</td></tr><tr><td id=\"" + retDesktop[1] + "BUY\" style=\"color:#FFFFFF;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:green;\">" + retDesktop[4] + "</span></td></tr>" +
                                                 "<tr>" +
                                                     "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:green;\">" + retDesktop[5] + "</span></td>" +
                                                 "</tr>" +
                                                "</table>";
                }
                else if (retDesktop[4] < oldRetDesktop[4]) {
                    trowString_top3 = trowString_top3 + "<td align=\"center\" style=\"padding-left: 10px;padding-right: 10px;\"><table  width=\"100%\" id=\"gold\" class=\"goldd\" style=\"\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align:center !Important;font-size: 16px;font-weight:600;\">" + retDesktop[2] + "</td></tr><tr><td id=\"" + retDesktop[1] + "BUY\" style=\"color:#FFFFFF;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:red;\">" + retDesktop[4] + "</span></td></tr>" +
                                                 "<tr>" +
                                                     "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:green;\">" + retDesktop[5] + "</span></td>" +
                                                 "</tr>" +
                                                "</table></td>";
                }
                else {
                    trowString_top3 = trowString_top3 + "<td align=\"center\" style=\"padding-left: 10px;padding-right: 10px;\"><table  width=\"100%\" id=\"gold\" class=\"goldd\" style=\"\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align:center !Important;font-size: 16px;font-weight:600;\">" + retDesktop[2] + "</td></tr><tr><td id=\"" + retDesktop[1] + "BUY\" style=\"color:#FFFFFF;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:#BB7C33;\">" + retDesktop[4] + "</span></td></tr>" +
                                                 "<tr>" +
                                                     "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:green;\">" + retDesktop[5] + "</span></td>" +
                                                 "</tr>" +
                                              "</table></td>";
                }

                trowString_top3 = trowString_top3 + "</td>";

                //}
            }
            //SILVER
            retDesktop = messagesDesktopp[1].split("\t");
            oldRetDesktop = messagesOldDesktop[1].split("\t");
            if (typeof retDesktop[2] != 'undefined') {

                if (retDesktop[4] > oldRetDesktop[4]) {

                    trowString_top3 = trowString_top3 + "<td align=\"center\" style=\"width: %;border-left: 1px solid #E4AF26;border-right: 1px solid #E4AF26;padding-left: 10px;padding-right: 10px;\"><table  width=\"100%\" id=\"silver\" class=\"goldd\" style=\"\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + retDesktop[2] + "</td></tr><tr><td id=\"" + retDesktop[1] + "BUY\" style=\"color:#FFFFFF;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:green;\">" + retDesktop[4] + "</span></td></tr>" +
                         "<tr>" +
                             "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:green;\">" + retDesktop[5] + "</span></td>" +
                         "</tr>" +
                    "</table></td>";

                }
                else if (retDesktop[4] < oldRetDesktop[4]) {
                    trowString_top3 = trowString_top3 + "<td align=\"center\" style=\"width: %;border-left: 1px solid #E4AF26;border-right: 1px solid #E4AF26;padding-left: 10px;padding-right: 10px;\"><table  width=\"100%\" id=\"silver\" class=\"goldd\" style=\"\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + retDesktop[2] + "</td></tr><tr><td id=\"" + retDesktop[1] + "BUY\" style=\"color:#ebaf4c;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:red;\">" + retDesktop[4] + "</span></td></tr>" +
                             "<tr>" +
                                 "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:green;\">" + retDesktop[5] + "</span></td>" +
                             "</tr>" +
                            "</table></td>";
                }
                else {
                    trowString_top3 = trowString_top3 + "<td align=\"center\" style=\"width: %;border-left: 1px solid #E4AF26;border-right: 1px solid #E4AF26;padding-left: 10px;padding-right: 10px;\"><table  width=\"100%\" id=\"silver\" class=\"goldd\" style=\"\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + retDesktop[2] + "</td></tr><tr><td id=\"" + retDesktop[1] + "BUY\" style=\"color:#ebaf4c;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:#BB7C33;\">" + retDesktop[4] + "</span></td></tr>" +
                         "<tr>" +
                             "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:green;\">" + retDesktop[5] + "</span></td>" +
                         "</tr>" +
                    "</table></td>";
                }

            }
            //INR
            retDesktop = messagesDesktopp[2].split("\t");
            oldRetDesktop = messagesOldDesktop[2].split("\t");
            if (typeof retDesktop[2] != 'undefined') {
                var trowString_top3;
                //if (deletedScrips[2] != "0") {
                if (retDesktop[4] > oldRetDesktop[4]) {


                    trowString_top3 = trowString_top3 + "<td style=\"width:%;padding-left: 10px;padding-right: 10px;\" align=\"center\"><table id=\"inr\" class=\"goldd\" width=\"100%\" style=\"\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + retDesktop[2] + "</td></tr><tr><td id=\"" + retDesktop[1] + "BUY\" style=\"color:#BB7C33;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:green;\">" + retDesktop[4] + "</span></td></tr>" +
                                                 "<tr>" +
                                                     "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:green;\">" + retDesktop[5] + "</span></td>" +
                                                 "</tr>" +
                    "</table></td>"

                }
                else if (retDesktop[4] < oldRetDesktop[4]) {

                    trowString_top3 = trowString_top3 + "<td style=\"width:%;padding-left: 10px;padding-right: 10px;\" align=\"center\"><table id=\"inr\" class=\"goldd\" width=\"100%\" style=\"\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + retDesktop[2] + "</td></tr><tr><td id=\"" + retDesktop[1] + "BUY\" style=\"color:#BB7C33;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:red;\">" + retDesktop[4] + "</span></td></tr>" +
                                                 "<tr>" +
                                                     "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:green;\">" + retDesktop[5] + "</span></td>" +
                                                 "</tr>" +
                    "</table></td>";
                }
                else {

                    trowString_top3 = trowString_top3 + "<td style=\"width:%;padding-left: 10px;padding-right: 10px;\" align=\"center\"><table id=\"inr\" class=\"goldd\" width=\"100%\" style=\"\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + retDesktop[2] + "</td></tr><tr><td id=\"" + retDesktop[1] + "BUY\" style=\"color:#FFFFFF;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:#BB7C33\">" + retDesktop[4] + "</span></td></tr>" +
                                                 "<tr>" +
                                                     "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:green;\">" + retDesktop[5] + "</span></td>" +
                                                 "</tr>" +
                    "</table></td>";
                }


                //}
            }

            trowString_top3 = trowString_top3 + "</tr></table>";







            trowString = trowString + "<table class=\"tt_33\" width=\"100%\" style=\"margin-top:0%;margin-bottom:0%;border-collapse:separate;padding-top:2%;\"> " +
                                                        " <tr style=\"margin-top:;\"> " +
                                                            " <td style=\"padding: 0px 0px 0;\"> " +
                                                                "<table  width=\"100%\" style=\"margin-bottom:1%;background:#E4AF26;border-radius:10px;box-shadow: 0px 1px 3px 0px #000;\"> " +
                                                                "<tr>" +
                                                                    "<td width=\"30%\" style=\"font-size: 16px;color:#ebaf4c;font-weight:BOLD;padding: 10px 0px 10px 0px;text-align:center; \">  " +
            //	"<span>PRODUCT</span>" +                                   
                                                                    "</td>" +
                                                                    "<td width=\"30%\" style=\"font-size: 16px;padding:5px 3px;color:#000;font-weight:BOLD;text-align:center; \" > GOLD" +
            //    "<span>BUY</span>" +
                                                                    "</td>" +

                                                                    "<td width=\"30%\" style=\"font-size: 16px;padding:5px 3px ;color:#ebaf4c;font-weight:BOLD;text-align:center; \" >" +
            //      "<span>SELL</span>" +
                                                                    "</td>" +

            // "<td width=\"25%\" style=\"font-size: 16px;padding:5px 3px;color:#000;font-weight:BOLD;text-align:center; \" >" +
            //     "<span>H/L</span>" +
            // "</td>" +

            //                                                                "<td style=\"width:20%; text-align: center !Important\" >" +
            //                                                                    "<span></span>" +
            //                                                                "</td>" +

            //"<td style=\"width:15%; text-align: center !Important\" >" +
            //   "<span>L</span>" +
            //"</td>" +
                                                                    "</tr>" +
                                                                "</table>"
            "</td>" +
                                                            "</tr>" +
            //Second Row
                                                                 " <tr> " +
                                                              " <td style=\"\"> ";
            //messages.length
            //messages.length for (var i = 5; i < messagesDesktopp.length; i++) {
            for (var i = 5; i < messagesDesktopp.length; i++) {
                //var ret = jQuery.parseJSON(messages[i]);
                var ret = messagesDesktopp[i].split("\t");
                var oldRet;


                oldRet = messagesOldDesktop[i].split("\t");

                var background1 = "transparent";


                if (ret[2].toLowerCase().includes("gold")) {
                    background1 = "transparent";
                }

                else if (ret[2].toLowerCase().includes("silver")) {


                    background1 = "transparent";
                }
                else {
                    background1 = "transparent";
                }

                if (typeof ret[1] != 'undefined') {
                    if (ret[2].toLowerCase().includes("gold")) {
                        // background1 = "transparent";
                    
                    if (ret[3] > oldRet[3]) {

                        trowString = trowString +
                        //"<table width=\"100%\"><tr><td onclick=\"callBuySell('" + ret[1] + "')\" >" +
                                    "<table class=\"res_mob_font_width\"  width=\"100%\" style=\"border-collapse:separate;\"> " +
                                        "<tr onclick=\"callBuySell('" + ret[1] + "','" + ret[2] + "');\" style=\"text-align: center;\"> " +
                                            "<td class=\"buy_sell_label\" style=\"width:50%;padding: 5px 0px 5px 10px;text-align:center;font-weight:600;color:#000;text-transform:uppercase;background:" + background1 + ";\">" + ret[2] + "</td> " +
                                            "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                                            "<span id=\"mainspan\" style=\"padding-bottom:0 !important; padding:0px 3px;font-size: 22px;  color:#FFF;font-weight:600;background:green;border-radius:0px;\">" + ret[3] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:red;font-weight:600;padding-bottom:0 !important;\"><br> L : " + ret[6] + "</span>" +
                                            "</td>";

                    }
                    else if (ret[3] < oldRet[3]) {

                        trowString = trowString +
                        //                                "<table width=\"100%\">"+
                        //                                    "<tr>"+
                        //                                        "<td>"+
                                    "<table class=\"res_mob_font_width\" width=\"100%\" style=\"border-collapse:separate;\">" +
                                        "<tr onclick=\"callBuySell('" + ret[1] + "','" + ret[2] + "');\"  style=\"text-align: center;\">" +
                                            "<td class=\"buy_sell_label\" style=\"width:50%;padding: 5px 0px 5px 10px;text-align:center;font-weight:600;color:#000;text-transform:uppercase;background:" + background1 + ";\">" + ret[2] + "</td>" +
                                            "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                                            "<span id=\"mainspan\" style=\" padding:0px 3px;padding-bottom:0 !important; font-size: 22px;  color:#FFF;font-weight:600;background:red;border-radius:0px;\">" + ret[3] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:red;font-weight:600;padding-bottom:0 !important;\"><br> L : " + ret[6] + "</span>" +
                                            "</td>";

                    }
                    else {
                        trowString = trowString +
                        //                                    "<table width=\"100%\">"+
                        //                                        "<tr>"+
                        //                                            "<td>"+
                                        "<table class=\"res_mob_font_width\" width=\"100%\" style=\"border-collapse:separate;\">" +
                                            "<tr onclick=\"callBuySell('" + ret[1] + "','" + ret[2] + "');\"  style=\"text-align: center;\">" +
                                                "<td class=\"buy_sell_label\" style=\"width:50%;padding: 5px 0px 5px 10px;text-align:center;font-weight:600;color:#000;text-transform:uppercase;background:" + background1 + ";\">" + ret[2] + "</td>" +
                                                "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                                                "<span id=\"mainspan\" style=\"  padding:0px 3px;font-size: 22px; color:#000;font-weight:600;padding-bottom:0 !important;\">" + ret[3] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:red;font-weight:600;padding-bottom:0 !important;\"><br> L : " + ret[6] + "</span>" +
                                                "</td>";

                    }





                    //For Sell

                    if (ret[4] > oldRet[4]) {

                        trowString = trowString +
                                "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                                "<span id=\"mainspan\" style=\" padding:0px 3px;font-size: 22px; color:#FFF;font-weight:600;background:green;border-radius:0px;padding-bottom:0 !important;\">" + ret[4] + "</span>" + //<br/><span style=\"color:#8ce08c;\">H : " + ret[5] + "</span>
                "<span style=\"padding: 5px;font-size: 12px;color:#00d600;font-weight:600;padding-bottom:0 !important;\"><br> H : " + ret[5] + "</span>" +
                                "</td>";
                    }
                    else if (ret[4] < oldRet[4]) {

                        trowString = trowString +

                                            "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                        //"<span style=\"font-size: 17px;background-color:#d0161e;border-radius:10px;color:#FFF;font-weight:700\">" + sellSmall + "</span>
                                            "<span id=\"mainspan\" style=\" padding:0px 3px;font-size: 22px; color:#FFF;padding-bottom:0 !important;font-weight:600;background:red;border-radius:0px;\">" + ret[4] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:#00d600;font-weight:600;padding-bottom:0 !important;\"><br>  H : " + ret[5] + "</span>" +
                                            "</td>";

                    }
                    else {
                        trowString = trowString +

                                                "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                        //<span style=\"font-size: 17px; padding:1px 5px;padding: 3px;font-weight:600;color:#FFF\">" + sellSmall + "</span>
                                                "<span id=\"mainspan\" style=\"font-size: 22px;  padding:0px 3px;font-weight:600;color:#000;padding-bottom:0 !important;\">" + ret[4] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:#00d600;font-weight:600;\"><br> H : " + ret[5] + "</span>" +
                                                "</td>";
                    }



                    //trowString = trowString + "</td></tr></table>";
                    // trowString = trowString + "<td style=\"width: 25%;\"><span style=\"text-align: center !Important;font-size: 16px !important;color:#fff;\">" + ret[5] + "</span> / <span style=\"text-align: center !Important;font-size: 16px !important;color:#fff;\">" + ret[6] + "</span></td>";
                    trowString = trowString + "</tr></table>";
                    

                    //}

                }
            }
                oldData = data.toString();

            }
            trowString = trowString + "</td></tr></table>"; //</td></tr>


            trowString = trowString + "<table class=\"tt_33\" width=\"100%\" style=\"margin-top:0%;margin-bottom:0%;border-collapse:separate;\"> " +
                                                        " <tr style=\"margin-top:;\"> " +
                                                            " <td style=\"padding: 0px 0px 0;\"> " +
                                                                "<table  width=\"100%\" style=\"margin-bottom:1%;background:#E4AF26;border-radius:10px;box-shadow: 0px 1px 3px 0px #000;\"> " +
                                                                "<tr>" +
                                                                    "<td width=\"30%\" style=\"font-size: 16px;color:#ebaf4c;font-weight:BOLD;padding: 10px 0px 10px 0px;text-align:center; \">  " +
            //	"<span>PRODUCT</span>" +                                   
                                                                    "</td>" +
                                                                    "<td width=\"30%\" style=\"font-size: 16px;padding:5px 3px;color:#000;font-weight:BOLD;text-align:center; \" > SILVER" +
            //    "<span>BUY</span>" +
                                                                    "</td>" +

                                                                    "<td width=\"30%\" style=\"font-size: 16px;padding:5px 3px ;color:#ebaf4c;font-weight:BOLD;text-align:center; \" >" +
            //      "<span>SELL</span>" +
                                                                    "</td>" +

            // "<td width=\"25%\" style=\"font-size: 16px;padding:5px 3px;color:#000;font-weight:BOLD;text-align:center; \" >" +
            //     "<span>H/L</span>" +
            // "</td>" +

            //                                                                "<td style=\"width:20%; text-align: center !Important\" >" +
            //                                                                    "<span></span>" +
            //                                                                "</td>" +

            //"<td style=\"width:15%; text-align: center !Important\" >" +
            //   "<span>L</span>" +
            //"</td>" +
                                                                    "</tr>" +
                                                                "</table>"
            "</td>" +
                                                            "</tr>" +
            //Second Row
                                                                 " <tr> " +
                                                              " <td style=\"\"> ";
            //messages.length
            //messages.length
            for (var i = 6; i < messagesDesktopp.length; i++) {
                //var ret = jQuery.parseJSON(messages[i]);
                var ret = messagesDesktopp[i].split("\t");
                var oldRet;


                oldRet = messagesOldDesktop[i].split("\t");

                var background1 = "transparent";


                if (ret[2].toLowerCase().includes("gold")) {
                    background1 = "transparent";
                }

                else if (ret[2].toLowerCase().includes("silver")) {


                    background1 = "transparent";
                }
                else {
                    background1 = "transparent";
                }

                if (typeof ret[1] != 'undefined') {

                    if (ret[2].toLowerCase().includes("silver")) {    

                    if (ret[3] > oldRet[3]) {

                        trowString = trowString +
                        //"<table width=\"100%\"><tr><td onclick=\"callBuySell('" + ret[1] + "')\" >" +
                                    "<table class=\"res_mob_font_width\"  width=\"100%\" style=\"border-collapse:separate;\"> " +
                                        "<tr onclick=\"callBuySell('" + ret[1] + "','" + ret[2] + "');\" style=\"text-align: center;\"> " +
                                            "<td class=\"buy_sell_label\" style=\"width:50%;padding: 5px 0px 5px 10px;text-align:center;font-weight:600;color:#000;text-transform:uppercase;background:" + background1 + ";\">" + ret[2] + "</td> " +
                                            "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                                            "<span id=\"mainspan\" style=\"padding-bottom:0 !important; padding:0px 3px;font-size: 22px;  color:#FFF;font-weight:600;background:green;border-radius:0px;\">" + ret[3] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:red;font-weight:600;padding-bottom:0 !important;\"><br> L : " + ret[6] + "</span>" +
                                            "</td>";

                    }
                    else if (ret[3] < oldRet[3]) {

                        trowString = trowString +
                        //                                "<table width=\"100%\">"+
                        //                                    "<tr>"+
                        //                                        "<td>"+
                                    "<table class=\"res_mob_font_width\" width=\"100%\" style=\"border-collapse:separate;\">" +
                                        "<tr onclick=\"callBuySell('" + ret[1] + "','" + ret[2] + "');\"  style=\"text-align: center;\">" +
                                            "<td class=\"buy_sell_label\" style=\"width:50%;padding: 5px 0px 5px 10px;text-align:center;font-weight:600;color:#000;text-transform:uppercase;background:" + background1 + ";\">" + ret[2] + "</td>" +
                                            "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                                            "<span id=\"mainspan\" style=\" padding:0px 3px;padding-bottom:0 !important; font-size: 22px;  color:#FFF;font-weight:600;background:red;border-radius:0px;\">" + ret[3] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:red;font-weight:600;padding-bottom:0 !important;\"><br> L : " + ret[6] + "</span>" +
                                            "</td>";

                    }
                    else {
                        trowString = trowString +
                        //                                    "<table width=\"100%\">"+
                        //                                        "<tr>"+
                        //                                            "<td>"+
                                        "<table class=\"res_mob_font_width\" width=\"100%\" style=\"border-collapse:separate;\">" +
                                            "<tr onclick=\"callBuySell('" + ret[1] + "','" + ret[2] + "');\"  style=\"text-align: center;\">" +
                                                "<td class=\"buy_sell_label\" style=\"width:50%;padding: 5px 0px 5px 10px;text-align:center;font-weight:600;color:#000;text-transform:uppercase;background:" + background1 + ";\">" + ret[2] + "</td>" +
                                                "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                                                "<span id=\"mainspan\" style=\"  padding:0px 3px;font-size: 22px; color:#000;font-weight:600;padding-bottom:0 !important;\">" + ret[3] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:red;font-weight:600;padding-bottom:0 !important;\"><br> L : " + ret[6] + "</span>" +
                                                "</td>";

                    }





                    //For Sell

                    if (ret[4] > oldRet[4]) {

                        trowString = trowString +
                                "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                                "<span id=\"mainspan\" style=\" padding:0px 3px;font-size: 22px; color:#FFF;font-weight:600;background:green;border-radius:0px;padding-bottom:0 !important;\">" + ret[4] + "</span>" + //<br/><span style=\"color:#8ce08c;\">H : " + ret[5] + "</span>
                "<span style=\"padding: 5px;font-size: 12px;color:#00d600;font-weight:600;padding-bottom:0 !important;\"><br> H : " + ret[5] + "</span>" +
                                "</td>";
                    }
                    else if (ret[4] < oldRet[4]) {

                        trowString = trowString +

                                            "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                        //"<span style=\"font-size: 17px;background-color:#d0161e;border-radius:10px;color:#FFF;font-weight:700\">" + sellSmall + "</span>
                                            "<span id=\"mainspan\" style=\" padding:0px 3px;font-size: 22px; color:#FFF;padding-bottom:0 !important;font-weight:600;background:red;border-radius:0px;\">" + ret[4] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:#00d600;font-weight:600;padding-bottom:0 !important;\"><br>  H : " + ret[5] + "</span>" +
                                            "</td>";

                    }
                    else {
                        trowString = trowString +

                                                "<td style=\"width:25%;text-align: center !Important;padding-bottom:0 ;\">" +
                        //<span style=\"font-size: 17px; padding:1px 5px;padding: 3px;font-weight:600;color:#FFF\">" + sellSmall + "</span>
                                                "<span id=\"mainspan\" style=\"font-size: 22px;  padding:0px 3px;font-weight:600;color:#000;padding-bottom:0 !important;\">" + ret[4] + "</span>" +
                "<span style=\"padding: 5px;font-size: 12px;color:#00d600;font-weight:600;\"><br> H : " + ret[5] + "</span>" +
                                                "</td>";
                    }



                    //trowString = trowString + "</td></tr></table>";
                    // trowString = trowString + "<td style=\"width: 25%;\"><span style=\"text-align: center !Important;font-size: 16px !important;color:#fff;\">" + ret[5] + "</span> / <span style=\"text-align: center !Important;font-size: 16px !important;color:#fff;\">" + ret[6] + "</span></td>";
                    trowString = trowString + "</tr></table>";

                    }

                }
                oldData = data.toString();

            }
            trowString = trowString + "</td></tr></table>"; //</td></tr>

            //third table
            //trowString_top3 = trowString_top3 + "<table class=\"tt_33\" width=\"100%\" style=\"\"> " +
            " <tr > " +
                                                " <td style=\"\"> " +
                                                    "<table class=\"heading\" width=\"100%\" style=\"margin-left:0%;\"> " +
                                                    "<tr>" +
                                                        "<td width=\"50%\" style=\"font-size: 16px;color:#ebaf4c;font-weight:BOLD;padding: 10px 0px 10px 0px;text-align:center;\">" +
            												"<span>FUTURE</span>" +
                                                        "</td>" +
                                                        "<td width=\"25%\" style=\"font-size: 16px;padding:5px 3px;color:#ebaf4c;font-weight:BOLD;text-align:center;\" >" +
                                                            "<span>BID</span>" +
                                                        "</td>" +

                                                        "<td width=\"25%\" style=\"font-size: 16px;padding:5px 3px;color:#ebaf4c;font-weight:BOLD;text-align:center;\" >" +
                                                            "<span>ASK</span>" +
                                                        "</td>" +

            //                                                                "<td style=\"width:20%; text-align: center !Important\" >" +
            //                                                                    "<span></span>" +
            //                                                                "</td>" +

            //"<td style=\"width:15%; text-align: center !Important\" >" +
            //   "<span>LOW</span>" +
            //"</td>" +
                                                        "</tr>" +
                                                    "</table>"
            "</td>" +
                                                "</tr>" +
            //Second Row
                                                     " <tr> " +
                                                  " <td> ";
//            //messages.length
//            for (var i = 3; i < 4; i++) {
//                //var ret = jQuery.parseJSON(messages[i]);
//                var ret = messagesDesktopp[i].split("\t");
//                var oldRet;

//                //gold coasting
//                oldRet = messagesOldDesktop[i].split("\t");

//                if (typeof ret[2] != 'undefined') {

//                    trowString_top3 = trowString_top3 + "<table class=\"table1001\" style=\"margin-top: 3%;\"><tr><td align=\"center\" style=\"width:50%;\">";

//                    if (ret[3] > oldRet[3]) {
//                        trowString_top3 = trowString_top3 + "<table  width=\"100%\" class=\"goldd\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align:center !Important;font-size: 100%;\">" + ret[2] + "</td></tr><tr><td id=\"" + ret[1] + "BUY\" style=\" color:#BB7C33;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:#00a650;\">" + ret[3] + "</span>";
//                        // <span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + retDesktop[5] + " | L: " + retDesktop[6] + "</span></td></tr>" +
//                        //                                                        "<tr>" +
//                        //                                                            "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                        "</tr>" +
//                        // "</table>";
//                    }
//                    else if (ret[3] < oldRet[3]) {
//                        trowString_top3 = trowString_top3 + "<table  width=\"100%\" class=\"goldd\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align:center !Important;font-size: 100%;\">" + ret[2] + "</td></tr><tr><td id=\"" + ret[1] + "BUY\" style=\"color:#BB7C33;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:red;\">" + ret[3] + "</span>";
//                        // <span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + retDesktop[5] + " | L: " + retDesktop[6] + "</span></td></tr>" +
//                        //                                                                    "<tr>" +
//                        //                                                                        "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                                    "</tr>" +
//                        // "</table>";
//                    }
//                    else {
//                        trowString_top3 = trowString_top3 + "<table  width=\"100%\" class=\"goldd\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align:center !Important;font-size: 100%;\">" + ret[2] + "</td></tr><tr><td id=\"" + ret[1] + "BUY\" style=\"color:#BB7C33;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\">" + ret[3] + "</span>";
//                        // <span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + retDesktop[5] + " | L: " + retDesktop[6] + "</span></td></tr>" +
//                        //                                                                    "<tr>" +
//                        //                                                                        "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                                    "</tr>" +
//                        // "</table>";
//                    }


//                    if (ret[4] > oldRet[4]) {
//                        trowString_top3 = trowString_top3 + " | <span class=\"top5span\" style=\"color:#BB7C33;\">" + ret[4] + "</span><span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + ret[5] + " | L: " + ret[6] + "</span></td></tr>" +
//                        //                                                        "<tr>" +
//                        //                                                            "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                        "</tr>" +
//                                                        "</table>";
//                    }
//                    else if (ret[4] < oldRet[4]) {
//                        trowString_top3 = trowString_top3 + " | <span class=\"top5span\" style=\"color:red;\">" + ret[4] + "</span><span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + ret[5] + " | L: " + ret[6] + "</span></td></tr>" +
//                        //                                                                    "<tr>" +
//                        //                                                                        "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                                    "</tr>" +
//                                                "</table>";
//                    }
//                    else {
//                        trowString_top3 = trowString_top3 + " | <span class=\"top5span\">" + ret[4] + "</span><span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + ret[5] + " | L: " + ret[6] + "</span></td></tr>" +
//                        //                                                                    "<tr>" +
//                        //                                                                        "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                                    "</tr>" +
//                                              "</table>";
//                    }

//                    trowString_top3 = trowString_top3 + "</td>";

//                    //}
//                }

//                //SILVER COSTING
//                var ret = messagesDesktopp[4].split("\t");
//                var oldRet;
//                //ret = messagesDesktop[4].split("\t");
//                //oldRet = messagesOldDesktop[4].split("\t");
//                if (typeof ret[2] != 'undefined') {
//                    var trowString_top3;
//                    //if (deletedScrips[2] != "0") {

//                    if (ret[3] > oldRet[3]) {
//                        trowString_top3 = trowString_top3 + "<td style=\"width:50%;\" align=\"center\"><table  width=\"100%\" class=\"goldd\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align:center !Important;font-size: 100%;\">" + ret[2] + "</td></tr><tr><td id=\"" + ret[1] + "BUY\" style=\" color:#BB7C33;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:#BB7C33;\">" + ret[3] + "</span>";
//                        // <span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + retDesktop[5] + " | L: " + retDesktop[6] + "</span></td></tr>" +
//                        //                                                        "<tr>" +
//                        //                                                            "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                        "</tr>" +
//                        // "</table>";
//                    }
//                    else if (ret[3] < oldRet[3]) {
//                        trowString_top3 = trowString_top3 + "<td style=\"width:50%;\" align=\"center\"><table  width=\"100%\" class=\"goldd\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align:center !Important;font-size: 100%;\">" + ret[2] + "</td></tr><tr><td id=\"" + ret[1] + "BUY\" style=\"color:#BB7C33;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\" style=\"color:red;\">" + ret[3] + "</span>";
//                        // <span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + retDesktop[5] + " | L: " + retDesktop[6] + "</span></td></tr>" +
//                        //                                                                    "<tr>" +
//                        //                                                                        "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                                    "</tr>" +
//                        // "</table>";
//                    }
//                    else {
//                        trowString_top3 = trowString_top3 + "<td style=\"width:50%;\" align=\"center\"><table  width=\"100%\" class=\"goldd\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align:center !Important;font-size: 100%;\">" + ret[2] + "</td></tr><tr><td id=\"" + ret[1] + "BUY\" style=\"color:#BB7C33;text-align: center !Important;font-size: 20px;\"><span class=\"top5span\">" + ret[3] + "</span>";
//                        // <span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + retDesktop[5] + " | L: " + retDesktop[6] + "</span></td></tr>" +
//                        //                                                                    "<tr>" +
//                        //                                                                        "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                                    "</tr>" +
//                        // "</table>";
//                    }


//                    if (ret[4] > oldRet[4]) {
//                        trowString_top3 = trowString_top3 + " | <span class=\"top5span\" style=\"color:#BB7C33;\">" + ret[4] + "</span><span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + ret[5] + " | L: " + ret[6] + "</span></td></tr>" +
//                        //                                                        "<tr>" +
//                        //                                                            "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                        "</tr>" +
//                                                        "</table>";
//                    }
//                    else if (ret[4] < oldRet[4]) {
//                        trowString_top3 = trowString_top3 + " | <span class=\"top5span\" style=\"color:red;\">" + ret[4] + "</span><span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + ret[5] + " | L: " + ret[6] + "</span></td></tr>" +
//                        //                                                                    "<tr>" +
//                        //                                                                        "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                                    "</tr>" +
//                                                "</table>";
//                    }
//                    else {
//                        trowString_top3 = trowString_top3 + " | <span class=\"top5span\">" + ret[4] + "</span><span style=\"font-size: 10px;border-radius:10px;color:#000;font-weight:500;display: block;\">H: " + ret[5] + " | L: " + ret[6] + "</span></td></tr>" +
//                        //                                                                    "<tr>" +
//                        //                                                                        "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:red;\">" + retDesktop[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#00a650;\">" + retDesktop[5] + "</span></td>" +
//                        //                                                                    "</tr>" +
//                                              "</table>";
//                    }

//                    trowString_top3 = trowString_top3 + "</td>";

//                    //}
//                }

//                oldData = data.toString();

//            }

            trow = $(trowString);
            trow.prependTo(zebra);



            trow_top3 = $(trowString_top3);
            trow_top3.prependTo(zebra_top3);



        }
        if (counterRefresh == 0) {
            //myScroll.refresh();
            counterRefresh = counterRefresh + 1;
        }
        oldData = data.toString();
        //OnSuccessMobileTop(data, status);

    }
    catch (e) {
        //alert("OnSuccess" + e);
        oldData = data.toString();
        //alert(oldData);
    }




}
function OnError(request, status, error) {
    //alert("Webservice Error: " + request.statusText + " " + error);
}


//#################nnnnnnnnnnnnnnnnn###############start#################
//#################nnnnnnnnnnnnnnnnn###############start#################
//#################nnnnnnnnnnnnnnnnn###############start#################




function OnError_SilverRates(request, status, error) {
    //alert("Webservice Error: " + request.statusText + " " + error);
}


function CallWebServiceFromJquerySilverCoins() {
    try {

        //urlLink = "http://mobiletradingbroadcast.arihantspot.com:7777/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/silver";
        
        //alert('CallWebServiceFromJquery');
        $.ajax({
            type: "GET",
            url: "https://" + localStorage.ipAddressBCast + ":" + localStorage.step3StreamingPort + "/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/tippusonifuture", // + localStorage.coinsScripTemplateId,
            dataType: "text",
            crossDomain: true,
            processData: false,
            success: Success2_Trending_SilverRates,
            error: OnError_SilverRates,
            cache: false
        });
    }
    catch (e) {
        //alert("CallWebServiceFromJquery " + e);
    }
}




function Success2_Trending_SilverRates(data, status) {
    //alert(data);
    try {
        //alert("1");
        var messagesDesktopp = "";
        messagesDesktopp = data.split("\n");

        if (typeof oldDataTrending_SilverRates != 'undefined') {
        }
        else {
            oldDataTrending_SilverRates = data.toString();
        }
        var messagesOldDesktop = oldDataTrending_SilverRates.split("\n");

        if (typeof messagesDesktopp != 'undefined') {
            if (maxRows == 0) {
                maxRows = messagesDesktopp.length;
            }

            gvData_Trending_gvData_Trending_SilverRates();
            var zebra1_SilverRates = "";
            zebra1_SilverRates = document.getElementById("gvData_Trending_SilverRates"); //Trending Lower Portion
            var trow1_SilverRates = "";
            var trowString = "";

            var retDesktop = "";
            retDesktop = messagesDesktopp[0].split("\t");

            if (typeof retDesktop[1] != 'undefined') {
                //alert(retDesktop[3] + '-->' + oldRetDesktop[3]);

                //                if (LiveRateMessage != "") {
                //                    trowString = trowString + "<tr>" +
                //	                                            "<td>" +
                //                                                    "<table width=\"100%\" border=\"0\">" +
                //                                                        "<tr>" +
                //                                                            "<td style=\"padding: 5px 0px 10px;text-align:center\">" + LiveRateMessage + "</td>" +
                //								                        "</tr>" +
                //                                                    "</table>" +
                //                                                "</td>" +
                //                                            "</tr>";
                //                }


                trowString = trowString + "<table width=\"100%\"> " +
//                                                  " <tr> " +
//                                                     " <td> " +
//                                                         "<table  width=\"100%\"> " +
//                                                            "<tr style=\"background-color:grey;\">" +
//                                                               "<td style=\"width:50%; text-align: left !Important;color:#ffffff;font-size: 16px !Important;font-weight:bold;\">" +
//                //"<span>PRODUCT</span>" +
//                                                               "</td>" +
//                                                               "<td style=\"width:25%; text-align: center !Important;color:#ffffff;font-size: 16px !Important;font-weight:bold;\" >" +
//                                                                    "<span>995</span>" +
//                                                               "</td>" +

//                                                                "<td style=\"width:25%; text-align: center !Important;color:#ffffff;font-size: 16px !Important;font-weight:bold;\" >" +
//                                                                    "<span>999</span>" +
//                                                               "</td>" +

//                //"<td style=\"width:15%; text-align: center !Important\" >" +
//                //    "<span>HIGH</span>" +
//                //"</td>" +

//                //"<td style=\"width:15%; text-align: center !Important\" >" +
//                //   "<span>LOW</span>" +
//                //"</td>" +
//                                                             "</tr>" +
//                                                           "</table>"
//                "</td>" +
//                                                        "</tr>" +
                //Second Row
                                                     " <tr> " +
                                                  " <td> ";
                //messagesDesktopp.length
                for (var i = 0; i < messagesDesktopp.length; i++) {
                    //var retDesktop = jQuery.parseJSON(messages[i]);
                    var retDesktop = messagesDesktopp[i].split("\t");
                    var oldRetDesktop;

                    oldRetDesktop = messagesOldDesktop[i].split("\t");
                    if (typeof retDesktop[1] != 'undefined') {

                        //if (deletedScrips[i] != "0") {
                        var buySmall = "";
                        var buyLarge = "";
                        var sellSmall = "";
                        var sellLarge = "";

                        if (retDesktop[3].length == 5) {
                            buySmall = retDesktop[3].substring(0, 2);
                            buyLarge = retDesktop[3].substring(2, 5);
                            buySmall = "";
                            buyLarge = retDesktop[3];
                        }
                        else {

                            buySmall = "";
                            buyLarge = retDesktop[3];

                        }

                        if (retDesktop[4].length == 5) {
                            sellSmall = retDesktop[4].substring(0, 2);
                            sellLarge = retDesktop[4].substring(2, 5);
                            sellSmall = "";
                            sellLarge = retDesktop[4];
                        }
                        else {

                            sellSmall = "";
                            sellLarge = retDesktop[4];

                        }

                        if (retDesktop[3] > oldRetDesktop[3]) {

                            trowString = trowString +
                            //"<table width=\"100%\"><tr><td onclick=\"callBuySell('" + retDesktop[1] + "')\" >" +
                                            "<table class=\"res_mob_font_width\"  width=\"100%\" style=\"border-bottom: 1px solid #ebaf4c;margin-top:10px\"> " +
                                                "<tr onclick=\"callBuySell('" + retDesktop[1] + "','" + retDesktop[2] + "');\" style=\"text-align: center;\"> " +
                                                    "<td class=\"buy_sell_label\" style=\"width:50%; text-align: left !Important;color:#000;font-size: " + Change_ScriptNameFont + ";\">" + retDesktop[2] + "</td> " +
                                                    "<td id=\"" + retDesktop[1] + "BUYSILVER\" style=\"width:25%;text-align: center !Important;\"><span style=\"font-size: large !Important;color:#00D600;\">" + buySmall + "</span><span style=\"font-size: " + Script_Font_LiveRatesCoins + " !Important;color:#00D600;\">" + buyLarge + "</span><br/><span style=\"color:red;\">L : " + retDesktop[6] + "</span></td>";

                        }
                        else if (retDesktop[3] < oldRetDesktop[3]) {

                            trowString = trowString +
                            //                                "<table width=\"100%\">"+
                            //                                    "<tr>"+
                            //                                        "<td>"+
                                            "<table class=\"res_mob_font_width\" width=\"100%\" style=\"border-bottom: 1px solid ##ebaf4c;margin-top:10px\">" +
                                                "<tr onclick=\"callBuySell('" + retDesktop[1] + "','" + retDesktop[2] + "');\"  style=\"text-align: center;\">" +
                                                    "<td class=\"buy_sell_label\" style=\"width:50%; text-align: left !Important;font-size:;color:#000; " + Change_ScriptNameFont + ";\">" + retDesktop[2] + "</td>" +
                                                    "<td id=\"" + retDesktop[1] + "BUYSILVER\" style=\"width:25%;text-align: center !Important;\"><span style=\"font-size: large !Important;color:red;\">" + buySmall + "</span><span style=\"font-size: " + Script_Font_LiveRatesCoins + " !Important;color:red;\">" + buyLarge + "</span><br/><span style=\"color:red;\">L : " + retDesktop[6] + "</span></td>"

                        }
                        else {
                            trowString = trowString +
                            //                                    "<table width=\"100%\">"+
                            //                                        "<tr>"+
                            //                                            "<td>"+
                                                "<table class=\"res_mob_font_width\" width=\"100%\" style=\"border-bottom: 1px solid #ebaf4c;margin-top:10px\">" +
                                                    "<tr onclick=\"callBuySell('" + retDesktop[1] + "','" + retDesktop[2] + "');\"  style=\"text-align: center;\">" +
                                                        "<td class=\"buy_sell_label\" style=\"width:50%;text-align: left !Important;font-size: ;color:#000;" + Change_ScriptNameFont + ";\">" + retDesktop[2] + "</td>" +
                                                        "<td id=\"" + retDesktop[1] + "BUYSILVER\" style=\"width:25%;text-align: center !Important;\"><span style=\"font-size: large !Important;color:#000;\">" + buySmall + "</span><span style=\"font-size: " + Script_Font_LiveRatesCoins + " !Important;color:#000;\">" + buyLarge + "</span><br/><span style=\"color:red;\">L : " + retDesktop[6] + "</span></td>"

                        }





                        //For Sell

                        if (retDesktop[4] > oldRetDesktop[4]) {

                            trowString = trowString +


                                                    "<td id=\"" + retDesktop[1] + "SELLSILVER\" style=\"width:25%;text-align: center !Important;\"><span style=\"font-size: large !Important;color:#00D600;\">" + sellSmall + "</span><span style=\"font-size: " + Script_Font_LiveRatesCoins + " !Important;color:#00D600;\">" + sellLarge + "</span><br/><span style=\"color:green;\">H : " + retDesktop[5] + "</span></td> " +
                            /*  "<td style=\"width:15%;text-align: center !Important;font-size: large;color:#00D600;\">" + retDesktop[4] + "</td> " +
                            "<td style=\"width:15%;text-align: center !Important;font-size: large;color:red;\">" + retDesktop[5] + "</td>" +
                            */
                                                "</tr> " +
                                            "</table>"
                        }
                        else if (retDesktop[4] < oldRetDesktop[4]) {

                            trowString = trowString +
                            //                                "<table width=\"100%\">"+
                            //                                    "<tr>"+
                            //                                        "<td>"+

                                                    "<td id=\"" + retDesktop[1] + "SELLSILVER\" style=\"width:25%;text-align: center !Important;\"><span style=\"font-size: large !Important;color:red;\">" + sellSmall + "</span><span style=\"font-size: " + Script_Font_LiveRatesCoins + " !Important;color:red;\">" + sellLarge + "</span><br/><span style=\"color:green;\">H : " + retDesktop[5] + "</span></td>" +
                            /*"<td style=\"width:15%;text-align: center !Important;font-size: large;color:#00D600;\">" + retDesktop[4] + "</td> " +
                            "<td style=\"width:15%;text-align: center !Important;font-size: large;color:red;\">" + retDesktop[5] + "</td>" +
                            */
                                                  "</tr>" +
                                              "</table>"
                        }
                        else {
                            trowString = trowString +
                            //                                    "<table width=\"100%\">"+
                            //                                        "<tr>"+
                            //                                            "<td>"+

                                                        "<td id=\"" + retDesktop[1] + "SELLSILVER\" style=\"width:25%;text-align: center !Important;\"><span style=\"font-size: large !Important;color:#000;\">" + sellSmall + "</span><span style=\"font-size: " + Script_Font_LiveRatesCoins + " !Important;color:#000;\">" + sellLarge + "</span><br/><span style=\"color:green;\">H : " + retDesktop[5] + "</span></td>" +
                            /* "<td style=\"width:15%;text-align: center !Important;font-size: large;color:#00D600;\">" + retDesktop[4] + "</td> " +
                            "<td style=\"width:15%;text-align: center !Important;font-size: large;color:red;\">" + retDesktop[5] + "</td>" +
                            */
                                                     "</tr>" +
                                                 "</table>"
                        }

                        //trowString = trowString + "</td></tr></table>";


                        //}

                    }
                    oldDataTrending_SilverRates = data.toString(); //Monank Change

                }
                trowString = trowString + "</td></tr></table>"; //</td></tr>
                //                trow = $(trowString);
                //                trow.prependTo(zebra);


            } //End If



        } // End -> if (typeof messagesDesktopp != 'undefined') {



        trowString = trowString + "<br>"; //</td></tr>

        trow1_SilverRates = $(trowString);
        trow1_SilverRates.prependTo(zebra1_SilverRates);
        //alert(oldData_Gold_silver_INR_coins);
        //oldDataTrending_SilverRates = data.toString();


    }
    catch (e) {
        // alert("OnSuccess : " + e);
        oldDataTrending_SilverRates = data.toString();
        //alert(oldData_Gold_silver_INR_coins);
    }


}


//function OnSuccess_SilverRates(data, status) {
//    // alert(data);
//    try {
//        //stopSpinner();
//        var messages = data.split("\n");


//        if (typeof oldDataSilverCoins != 'undefined') {

//        }
//        else {
//            // alert("1");
//            oldDataSilverCoins = data.toString();
//        }
//        var messagesOld = oldDataSilverCoins.split("\n");

//        if (typeof messages != 'undefined') {
//            if (maxRows == 0) {
//                maxRows = messages.length;
//            }

//            removeAllRowsFromTable_gvData_SilverRates();

//            var zebra_SilverRates = document.getElementById("gvData_SilverRates");

//            var trow_SilverRates;

//            var trowString = "";


//            //GOLD
//            var ret = messages[0].split("\t");
//            var oldRet;
//            var trowString = "";
//            oldRet = messagesOld[0].split("\t");
//            if (typeof ret[1] != 'undefined') {


//                trowString = trowString + "<table class=\"table1001\" style=\"background:#ffd438;padding-top: 10px;\"><tr><td align=\"center\" style=\"width:33%;padding-top: 0px !important;border-right:1px solid #000;\">";

//                // alert(retDesktop[3] + '-->' + oldRetDesktop[3]);
//                if (ret[3] > oldRet[3]) {
//                    trowString = trowString +

//						   "<table  width=\"100%\" class=\"goldd\" id=\"gold\" ><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + ret[2] + "</td></tr><tr><td style=\" color:#000;text-align: center !Important;font-size: 18px;font-weight:600;\"><span class=\"top5span\" style=\"color:green;\">" + ret[3] + "</span></td></tr>" +
//                    // "<tr>" +
//                    // "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:#000;\">L:" + ret[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#000;\">H:" + ret[5] + "</span></td>" +
//                    // "</tr>" +
//                                                "</table>";


//                    "<table width=\"100%\" class=\"goldd goldd1\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr ><td class=\"sell\" style=\"background-color:green; color:white;text-align:center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:green; color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table>"
//                }
//                else if (ret[3] < oldRet[3]) {
//                    trowString = trowString +
//						   "<table  width=\"100%\" class=\"goldd \" id=\"gold\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + ret[2] + "</td></tr><tr><td style=\"color:#000;text-align: center !Important;font-size: 18px;font-weight:600;\"><span class=\"top5span\" style=\"color:red;\">" + ret[3] + "</span></td></tr>" +
//                    // "<tr>" +
//                    // "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:#000;\">L:" + ret[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#000;\">H:" + ret[5] + "</span></td>" +
//                    // "</tr>" +
//                                                "</table>";
//                    "<table width=\"100%\" class=\"goldd goldd1\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr ><td class=\"sell\" style=\"background-color:red; color:white;text-align:center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table>"
//                }
//                else {
//                    trowString = trowString +
//						   "<table  width=\"100%\" class=\"goldd \" id=\"gold\"><tr style=\"\"><td class=\"sell\" style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + ret[2] + "</td></tr><tr><td style=\"color:#000;text-align: center !Important;font-size: 18px;font-weight:600;\"><span class=\"top5span\" style=\"color:#000;\">" + ret[3] + "</span></td></tr>" +
//                    // "<tr>" +
//                    // "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:#000;\">L:" + ret[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#000;\">H:" + ret[5] + "</span></td>" +
//                    // "</tr>" +
//                                              "</table>";
//                    "<table width=\"100%\" class=\"goldd goldd1\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr ><td class=\"sell\" style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #000;text-align:center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #000;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table>"
//                }

//                trowString = trowString + "</td>";



//            }
//            //SILVER
//            ret = messages[1].split("\t");
//            oldRet = messagesOld[1].split("\t");
//            if (typeof ret[1] != 'undefined') {


//                if (ret[3] > oldRet[3]) {

//                    trowString = trowString +
//						   "<td align=\"center\" style=\"width:33%;padding-top: 0px !important;border-right:1px solid #000;\"><table  width=\"100%\" class=\"goldd \" id=\"gold\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + ret[2] + "</td></tr><tr><td style=\"color:#000;text-align: center !Important;font-size: 18px;font-weight:600;\"><span class=\"top5span\" style=\"color:green;\">" + ret[3] + "</span></td></tr>" +
//                    // "<tr>" +
//                    // "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:#000;\">L : " + ret[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#000;\">H : " + ret[5] + "</span></td>" +
//                    // "</tr>" +
//                    "</table></td>";
//                    "<td align=\"center\" style=\"width: 33%;\"><table  width=\"100%\" class=\"goldd\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-color:green;color:white;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:green;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"

//                }
//                else if (ret[3] < oldRet[3]) {
//                    trowString = trowString +
//						   "<td align=\"center\" style=\"width:33%;padding-top: 0px !important;border-right:1px solid #000;\"><table  width=\"100%\" class=\"goldd \" id=\"gold\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + ret[2] + "</td></tr><tr><td style=\"color:#000;text-align: center !Important;font-size: 18px;font-weight:600;\"><span class=\"top5span\" style=\"color:red;\">" + ret[3] + "</span></td></tr>" +
//                    // "<tr>" +
//                    // "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:#000;\">L : " + ret[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#000;\">H : " + ret[5] + "</span></td>" +
//                    // "</tr>" +
//                            "</table></td>";
//                    "<td align=\"center\" style=\"width: 33%;\"><table  width=\"100%\" class=\"goldd\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"
//                }
//                else {
//                    trowString = trowString +
//						   "<td align=\"center\" style=\"width:33%;padding-top: 0px !important;border-right:1px solid #000;\"><table  width=\"100%\" class=\"goldd \" id=\"gold\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + ret[2] + "</td></tr><tr><td style=\"color:#000;text-align: center !Important;font-size: 18px;font-weight:600;\"><span class=\"top5span\" style=\"color:#000;\">" + ret[3] + "</span></td></tr>" +
//                    // "<tr>" +
//                    // "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:#000;\">L : " + ret[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#000;\">H : " + ret[5] + "</span></td>" +
//                    // "</tr>" +
//                    "</table></td>";
//                    "<td align=\"center\" style=\"width: 33%;\"><table  width=\"100%\" class=\"goldd\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #000;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #000;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"
//                }


//            }
//            //INR
//            ret = messages[2].split("\t");
//            oldRet = messagesOld[2].split("\t");
//            if (typeof ret[2] != 'undefined') {
//                var trowString;

//                //For Rates
//                if (ret[3] > oldRet[3]) {


//                    trowString = trowString +
//"<td style=\"width:33%;padding-top: 0px !important;\" align=\"center\"><table class=\"goldd \" id=\"gold\" width=\"100%\" ><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + ret[2] + "</td></tr><tr><td style=\"color:#000;text-align: center !Important;font-size: 18px;font-weight:600;\"><span class=\"top5span\" style=\"color:#000;\">" + ret[3] + "</span></td></tr>" +
//                    //"<tr>" +
//                    //  "<td style=\"color: #000;text-align: center //!Important;\"><span class=\"bloc_GS\" //style=\"color:#000;\">L : " + ret[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#000;\">H : " + ret[5] + "</span></td>" +
//                    // "</tr>" +
//                    "</table></td>"
//                    "<td style=\"width:33%;\" align=\"center\"><table class=\"goldd\" width=\"100%\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-color:green;color:white;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:green;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"

//                }
//                else if (ret[3] < oldRet[3]) {

//                    trowString = trowString +
//						   "<td style=\"width:33%;padding-top: 0px !important;\" align=\"center\"><table class=\"goldd \" id=\"gold\" width=\"100%\" ><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + ret[2] + "</td></tr><tr><td style=\"color:#000;text-align: center !Important;font-size: 18px;font-weight:600;\"><span class=\"top5span\" style=\"color:red;\">" + ret[3] + "</span></td></tr>" +
//                                                             "<tr>" +
//                    // "<td style=\"color: #000;text-align: center !Important;\"><span class=\"bloc_GS\" style=\"color:#000;\">L : " + ret[6] + "</span> | <span class=\"bloc_GS\" style=\"color:#000;\">H : " + ret[5] + "</span></td>" +
//                                                             "</tr>" +
//                    "</table></td>";
//                    "<td style=\"width:33%;\" align=\"center\"><table class=\"goldd\" width=\"100%\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"
//                }
//                else {

//                    trowString = trowString +
//						   "<td style=\"width:33%;padding-top: 0px !important;\" align=\"center\"><table class=\"goldd \" id=\"gold\" width=\"100%\"><tr><td style=\"color:#000;text-align: center !Important;font-size: 16px;font-weight:600;\">" + ret[2] + "</td></tr><tr><td style=\"color:#000;text-align: center !Important;font-size: 18px;font-weight:600;\"><span class=\"top5span\" style=\"color:#000\">" + ret[3] + "</span></td></tr>" +
//                    //"<tr>" +
//                    //  "<td style=\"color: #000;text-align: center //!Important;\"><span class=\"bloc_GS\" //style=\"color:#000;\">L : " + ret[6] + "</span> | //<span class=\"bloc_GS\" style=\"color:#000;\">H //: " + ret[5] + "</span></td>" +
//                    // "</tr>" +
//                    "</table></td>";
//                    "<td style=\"width:33%;\" align=\"center\"><table class=\"goldd\" width=\"100%\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #000;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #000;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"
//                }



//            }

//            trowString = trowString + "</tr>";








//            trowString = trowString;
//            trow_SilverRates = $(trowString);
//            trow_SilverRates.prependTo(zebra_SilverRates);
//            oldDataSilverCoins = data.toString();

//        }

//        if (counterRefresh == 0) {
//            //myScroll.refresh();
//            counterRefresh = counterRefresh + 1;
//        }


//        Success2_Trending_SilverRates(data, status); //OnSuccess2 Function 2

//    }
//    catch (e) {
//        //alert("OnSuccess" + e);
//    }


//}



//Gold Rates Monank ###########################################################################################
function CallWebServiceFromJqueryGoldCoins() {
    try {


        //alert("http://" + localStorage.ipAddressBCast + ":" + localStorage.step3StreamingPort + "/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/" + localStorage.coinsScripTemplateId);

        //alert('CallWebServiceFromJquery');
        $.ajax({
            type: "GET",
            //url: urlLink,
            //url: "https://" + localStorage.ipAddressBCast + ":" + localStorage.step3StreamingPort + "/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/srbullion",
            //url: "https://" + localStorage.ipAddressBCast + ":" + localStorage.step3StreamingPort + "/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/" + localStorage.coinsScripTemplateId,
            url: "https://" + localStorage.ipAddressBCast + ":" + localStorage.step3StreamingPort + "/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/tippusoniretail",
            dataType: "text",
            crossDomain: true,
            processData: false,
            success: OnSuccess_GoldRates,
            error: OnError_GoldRates,
            cache: false
        });
    }
    catch (e) {
        //alert("CallWebServiceFromJquery " + e);
    }
}



function OnSuccess_GoldRates(data, status) {
    //alert(data);
    try {
        //stopSpinner();
        //        var messages = data.split("\n");


        //        if (typeof oldDataGoldCoins != 'undefined') {

        //        }
        //        else {
        //            //alert("1");
        //            oldDataGoldCoins = data.toString();
        //        }
        //        var messagesOld = oldDataGoldCoins.split("\n");

        //        if (typeof messages != 'undefined') {
        //            if (maxRows == 0) {
        //                maxRows = messages.length;
        //            }

        //            removeAllRowsFromTable_gvData_GoldRates();

        //            var zebra_GoldRates = document.getElementById("gvData_GoldRates");

        //            var trow_GoldRates;

        //            var trowString = "";


        //            //GOLD
        //            var ret = messages[0].split("\t");
        //            var oldRet;
        //            var trowString = "";
        //            oldRet = messagesOld[0].split("\t");
        //            if (typeof ret[1] != 'undefined') {


        //                trowString = trowString + "<tr><td align=\"center\" style=\"width: 33%;\">";

        //                //alert(retDesktop[3] + '-->' + oldRetDesktop[3]);
        //                if (ret[3] > oldRet[3]) {
        //                    trowString = trowString + "<table width=\"100%\" class=\"goldd\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr ><td class=\"sell\" style=\"background-color:#00D600; color:white;text-align:center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:#00D600; color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table>"
        //                }
        //                else if (ret[3] < oldRet[3]) {
        //                    trowString = trowString + "<table width=\"100%\" class=\"goldd\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr ><td class=\"sell\" style=\"background-color:red; color:white;text-align:center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table>"
        //                }
        //                else {
        //                    trowString = trowString + "<table width=\"100%\" class=\"goldd\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr ><td class=\"sell\" style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #FFF;text-align:center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #FFF;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table>"
        //                }

        //                trowString = trowString + "</td>";



        //            }
        //            //Gold
        //            ret = messages[1].split("\t");
        //            oldRet = messagesOld[1].split("\t");
        //            if (typeof ret[1] != 'undefined') {


        //                if (ret[3] > oldRet[3]) {

        //                    trowString = trowString + "<td align=\"center\" style=\"width: 33%;\"><table  width=\"100%\" class=\"goldd\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-color:#00D600;color:white;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:#00D600;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"

        //                }
        //                else if (ret[3] < oldRet[3]) {
        //                    trowString = trowString + "<td align=\"center\" style=\"width: 33%;\"><table  width=\"100%\" class=\"goldd\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"
        //                }
        //                else {
        //                    trowString = trowString + "<td align=\"center\" style=\"width: 33%;\"><table  width=\"100%\" class=\"goldd\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #FFF;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #FFF;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"
        //                }


        //            }
        //            //INR
        //            ret = messages[2].split("\t");
        //            oldRet = messagesOld[2].split("\t");
        //            if (typeof ret[2] != 'undefined') {
        //                var trowString;

        //                //For Rates
        //                if (ret[3] > oldRet[3]) {


        //                    trowString = trowString + "<td style=\"width:33%;\" align=\"center\"><table class=\"goldd\" width=\"100%\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-color:#00D600;color:white;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:#00D600;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"

        //                }
        //                else if (ret[3] < oldRet[3]) {

        //                    trowString = trowString + "<td style=\"width:33%;\" align=\"center\"><table class=\"goldd\" width=\"100%\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-color:red;color:white;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"
        //                }
        //                else {

        //                    trowString = trowString + "<td style=\"width:33%;\" align=\"center\"><table class=\"goldd\" width=\"100%\" style=\"border-radius: 5px;border-collapse: separate;border-spacing: 0 5px;\"><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #FFF;text-align: center !Important;font-size: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;\">" + ret[2] + "</td></tr><tr><td style=\"background-image: linear-gradient(to right, #646ffc, #726bfc, #8664fc, #8e62fd, #9372f0);color: #FFF;text-align: center !Important;font-size: x-large;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;\">" + ret[3] + "</td></tr></table></td>"
        //                }



        //            }

        //            trowString = trowString + "</tr>";








        //            trowString = trowString;
        //            trow_GoldRates = $(trowString);
        //            trow_GoldRates.prependTo(zebra_GoldRates);
        //            oldDataGoldCoins = data.toString();

        //        }

        //        if (counterRefresh == 0) {
        //            //myScroll.refresh();
        //            counterRefresh = counterRefresh + 1;
        //        }

        
        Success2_Trending_GoldRates(data, status); //OnSuccess2 Function 2

    }
    catch (e) {
        //alert("OnSuccess" + e);
    }


}
function OnError_GoldRates(request, status, error) {
    //alert("Webservice Error: " + request.statusText + " " + error);
}





function Success2_Trending_GoldRates(data, status) {
    //alert(data);
    try {
        
        var messages = "";
        messages = data.split("\n");

        if (typeof oldDataTrending_GoldRates != 'undefined') {
        }
        else {
            oldDataTrending_GoldRates = data.toString();
        }
        var messagesOld = oldDataTrending_GoldRates.split("\n");

        if (typeof messages != 'undefined') {
            if (maxRows == 0) {
                maxRows = messages.length;
            }

            gvData_Trending_gvData_Trending_GoldRates();
            
            var zebra1_GoldRates = "";
            zebra1_GoldRates = document.getElementById("gvData_Trending_GoldRates"); //Trending Lower Portion
            var trow1_GoldRates = "";
            var trowString = "";

            var ret = "";
            ret = messages[0].split("\t");
            
            if (typeof ret[1] != 'undefined') {
                //alert(ret[3] + '-->' + oldRet[3]);

                trowString = trowString + "<table width=\"100%\"> " +
//                                                  " <tr> " +
//                                                     " <td> " +
//                                                         "<table  width=\"100%\" style=\"background: #8c8c8c;color: #FFF;margin-bottom: 5px;\"> " +
//                                                            "<tr>" +
//                                                               "<td style=\"width:50%;\">" +

//                                                               "</td>" +
//                                                               "<td style=\"width:25%; text-align: center !Important;padding: 5px 3px;font-weight: 700;\" >" +
//                                                                    "<span>995</span>" +
//                                                               "</td>" +

//                                                                "<td style=\"width:25%; text-align: center !Important;font-weight: 700;\" >" +
//                                                                    "<span>999</span>" +
//                                                               "</td>" +

//                //"<td style=\"width:15%; text-align: center !Important\" >" +
//                //    "<span>HIGH</span>" +
//                //"</td>" +

//                //"<td style=\"width:15%; text-align: center !Important\" >" +
//                //   "<span>LOW</span>" +
//                //"</td>" +
//                                                             "</tr>" +
//                                                           "</table>"
//                "</td>" +
//                                                        "</tr>" +
                //Second Row
                                                     " <tr> " +
                                                  " <td> ";

                
                //alert(messagesDesktopp.length);
                for (var i = 0; i < messages.length; i++) {


                    //var retDesktop = jQuery.parseJSON(messages[i]);
                    var retDesktop = messages[i].split("\t");
                    var oldRetDesktop;

                    oldRetDesktop = messagesOld[i].split("\t");
                    if (typeof retDesktop[1] != 'undefined') {

                        //if (deletedScrips[i] != "0") {
                        var buySmall = "";
                        var buyLarge = "";
                        var sellSmall = "";
                        var sellLarge = "";

                        if (retDesktop[2].length == 5) {
                            buySmall = retDesktop[3].substring(0, 2);
                            buyLarge = retDesktop[3].substring(2, 5);
                            buySmall = "";
                            buyLarge = retDesktop[3];
                        }
                        else {

                            buySmall = "";
                            buyLarge = retDesktop[3];

                        }

                        if (retDesktop[3].length == 5) {
                            sellSmall = retDesktop[4].substring(0, 2);
                            sellLarge = retDesktop[4].substring(2, 5);
                            sellSmall = "";
                            sellLarge = retDesktop[4];
                        }
                        else {

                            sellSmall = "";
                            sellLarge = retDesktop[4];

                        }

                        if (retDesktop[3] > oldRetDesktop[3]) {

                            trowString = trowString +
                            //"<table width=\"100%\"><tr><td onclick=\"callBuySell('" + retDesktop[1] + "')\" >" +
                                            "<table class=\"res_mob_font_width\"  width=\"100%\" style=\"border-bottom: 0px solid #FFD700;\"> " +
                                                "<tr onclick=\"javascript:callBuySell('" + retDesktop[1] + "')\" style=\"text-align: center;\"> " +
                                                    "<td class=\"buy_sell_label\" style=\"color:#000;width:50%; text-align: left !Important;font-size:" + Change_ScriptNameFont + ";padding: 15px 5px 15px 10px;font-weight:600;\">" + retDesktop[2] + "</td> " + // small;
                                                    "<td style=\"width:25%;text-align: center !Important;\"><span style=\"padding:1px 5px;font-size: 20px !Important;color:#00D600;font-weight:600;\">" + buySmall + "</span><span style=\"padding:1px 5px;font-size: 20px !Important;color:#00D600;font-weight:600;\">" + buyLarge + "</span></td>"; //<br/><span style=\"color:red;\">L : " + retDesktop[5] + "</span>

                        }





                        else if (retDesktop[3] < oldRetDesktop[3]) {

                            trowString = trowString +
                            //                                "<table width=\"100%\">"+
                            //                                    "<tr>"+
                            //                                        "<td>"+
                                            "<table class=\"res_mob_font_width\" width=\"100%\" style=\"border-bottom: 0px solid #FFD700;\">" +
                                                "<tr onclick=\"javascript:callBuySell('" + retDesktop[1] + "')\"  style=\"text-align: center;\">" +
                                                    "<td class=\"buy_sell_label\" style=\"color:#000;width:50%; text-align: left !Important;font-size: " + Change_ScriptNameFont + ";padding: 15px 5px 15px 10px;font-weight:600;\">" + retDesktop[2] + "</td>" +
                                                    "<td style=\"width:25%;text-align: center !Important;\"><span style=\"padding:1px 5px;font-size: 20px !Important;color:red;font-weight:600;\">" + buySmall + "</span><span style=\"padding:1px 5px;font-size: 20px !Important;color:red;font-weight:600;\">" + buyLarge + "</span></td>" //<br/><span style=\"color:red;\">L : " + retDesktop[5] + "</span>

                        }
                        else {
                            trowString = trowString +
                            //                                    "<table width=\"100%\">"+
                            //                                        "<tr>"+
                            //                                            "<td>"+
                                                "<table class=\"res_mob_font_width\" width=\"100%\" style=\"border-bottom: 0px solid #FFD700;\">" +
                                                    "<tr onclick=\"javascript:callBuySell('" + retDesktop[1] + "')\"  style=\"text-align: center;\">" +
                                                        "<td class=\"buy_sell_label\" style=\"color:#000;width:50%;text-align: left !Important;font-size: " + Change_ScriptNameFont + ";padding: 15px 5px 15px 10px;font-weight:600;\">" + retDesktop[2] + "</td>" +
                                                        "<td style=\"width:25%;text-align: center !Important;\"><span style=\"padding:1px 5px;font-size: 20px !Important;color:#000;font-weight:600;\">" + buySmall + "</span><span style=\"padding:1px 5px;font-size: 20px !Important;color:#000;font-weight:600;\">" + buyLarge + "</span></td>" //<br/><span style=\"color:red;\">L : " + retDesktop[5] + "</span>

                        }





                        //For Sell

                        if (retDesktop[4] > oldRetDesktop[4]) {

                            trowString = trowString +


                                                    "<td style=\"width:25%;text-align: center !Important;\"><span style=\"padding:1px 5px;font-size: 20px !Important;font-weight:600;color:#00D600;\">" + sellSmall + "</span><span style=\"padding:1px 5px;font-size: 20px !Important;color:#00d600;font-weight:600;\">" + sellLarge + "</span></td> " + //<br/><span style=\"color:green;\">H : " + retDesktop[4] + "</span>
                            /*  "<td style=\"width:15%;text-align: center !Important;font-size: large;color:#00D600;\">" + retDesktop[4] + "</td> " +
                            "<td style=\"width:15%;text-align: center !Important;font-size: large;color:red;\">" + retDesktop[5] + "</td>" +
                            */
                                                "</tr> " +
                                            "</table>"
                        }
                        else if (retDesktop[4] < oldRetDesktop[4]) {

                            trowString = trowString +
                            //                                "<table width=\"100%\">"+
                            //                                    "<tr>"+
                            //                                        "<td>"+

                                                    "<td style=\"width:25%;text-align: center !Important;\"><span style=\"padding:1px 5px;font-size: 20px !Important;color:red;font-weight:600;\">" + sellSmall + "</span><span style=\"padding:1px 5px;font-size: 20px !Important;color:red;font-weight:600;\">" + sellLarge + "</span></td>" + //<br/><span style=\"color:green;\">H : " + retDesktop[4] + "</span>
                            /*"<td style=\"width:15%;text-align: center !Important;font-size: large;color:#00D600;\">" + retDesktop[4] + "</td> " +
                            "<td style=\"width:15%;text-align: center !Important;font-size: large;color:red;\">" + retDesktop[5] + "</td>" +
                            */
                                                  "</tr>" +
                                              "</table>"
                        }
                        else {
                            trowString = trowString +
                            //                                    "<table width=\"100%\">"+
                            //                                        "<tr>"+
                            //                                            "<td>"+

                                                        "<td style=\"width:25%;text-align: center !Important;\"><span style=\"padding:1px 5px;font-size: 20px !Important;color:#000;font-weight:600;\">" + sellSmall + "</span><span style=\"padding:1px 5px;font-size: 20px !Important;color:#000;font-weight:600;\">" + sellLarge + "</span></td>" + //<br/><span style=\"color:green;\">H : " + retDesktop[4] + "</span>
                            /* "<td style=\"width:15%;text-align: center !Important;font-size: large;color:#00D600;\">" + retDesktop[4] + "</td> " +
                            "<td style=\"width:15%;text-align: center !Important;font-size: large;color:red;\">" + retDesktop[5] + "</td>" +
                            */
                                                     "</tr>" +
                                                 "</table>"
                        }

                        //trowString = trowString + "</td></tr></table>";


                        //}

                    }
                    oldDataTrending_GoldRates = data.toString();

                }
                trowString = trowString + "</td></tr></table>"; //</td></tr>
                //                trow = $(trowString);
                //                trow.prependTo(zebra);


            } //End If



        } // End -> if (typeof messagesDesktopp != 'undefined') {



        trowString = trowString + "<br>"; //</td></tr>



        //trowString = trowString + "<br><br><br><br><br><br><br><br><br>"; //</td></tr>

        trow1_GoldRates = $(trowString);
        trow1_GoldRates.prependTo(zebra1_GoldRates);
        //alert(oldData_Gold_Gold_INR_coins);
        oldDataTrending_GoldRates = data.toString();

        //OnSuccessGCSC_Gold(data, status); //OnSuccess2 Function 2

    }
    catch (e) {
        // alert("OnSuccess : " + e);
        oldDataTrending_GoldRates = data.toString();
        //alert(oldData_Gold_Gold_INR_coins);
    }


}

$(document).ready(function () {
    CallWebServiceFromJqueryLiveRateMessage();
    fnStartClock();
});




function CallWebServiceFromJqueryMarquee() {
    try {
        //alert("CallWebServiceFromJqueryMarquee");
        $.ajax({
            type: "GET",
            // url: "https://" + localStorage.webPanel + "/WebServiceGetMarquee.asmx/getMarquee?username=" + localStorage.appnameWithMiniadminId,
            url: localStorage.ticker1 + localStorage.appnameWithMiniadminId + "/" + "tickerlist1" + localStorage.tickerr1,
            dataType: "text",
            crossDomain: true,
            processData: false,
            success: OnSuccessMarquee,
            error: OnErrorMarquee,
            cache: false
        });
    }
    catch (e) {
        //alert("CallWebServiceFromJqueryMarquee " + e);
    }


}




function OnSuccessMarquee(data, status) {
    //alert(data);
    try {

        var message = data;
        message = message.replace('|','');
        message = message.replace('|','');
        message = message.replace('|','');
        message = message.replace('|','');

        if (typeof message != 'undefined') {

            removeAllRowsFromMarquee();

            var zebra = document.getElementById("marqueeData");
            var trow;
            var trowString = "";
            trowString = trowString + message;

            //trow = $(trowString);
            //trow.prependTo(zebra);

            $("#marqueeData").html(trowString);
            $('.marquee').marquee({
                //speed in milliseconds of the marquee
                duration: 8000,
                //gap in pixels between the tickers
                gap: 50,
                //time in milliseconds before the marquee will start animating
                delayBeforeStart: 0,
                //'left' or 'right'
                direction: 'left',
                //true or false - should the marquee be duplicated to show an effect of continues fL
                duplicated: true,
                pauseOnHover: true
            });
        }


    }
    catch (e) {
        // alert("OnSuccessMarquee" + e);
    }


}



function OnErrorMarquee(request, status, error) {
    //alert("Webservice Error: " + request.statusText);
}

function removeAllRowsFromMarquee() {

    $("#marqueeData").empty();

}

var convert = function (convert) {

    return $("<span />", { html: convert }).text();

};

