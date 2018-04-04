// JavaScript Document
var SKIP = 0;
var COUNT = 5;
var TOTAL = 0;
var country_code;
var country_locale;
var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";

function init(){
	country_code = request["country_code"];
	country_locale = request["country_locale"];
	if(country_code && country_locale){
        //读取国家或地区信息
		getCountryInfo();

        //获取省/州列表信息
        getStatesList();
	}
}

function getCountryInfo(){
	if(!country_code || !country_locale){
        tek.macCommon.waitDialogShow(null, "未找到国家或地区标识", 1500 ,0);
        return;
    } 
    var setting = {opearateType: "获取读取信息"};
    var sendData = {
    	objectName: "Country",
    	action: "readInfo",
    	country_code: country_code,
    	country_locale: country_locale
    };
    var callback = {
    	beforeSend: function(){
    		$("#country-info").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
    	},
    	success: function(data){
    		var record = data["record"];
            if(record){
                $("#country-info").html("");
                //显示信息
                showCountryInfo(record, data.right);
            }else{
                $("#country-info").html("<div class='col-md-12 col-sm-12 text-center'>没有国家或地区信息!</div>")
            }
    	},
        error: function(data, errorMsg){
            $("#country-info").html(errorMsg);
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

function showCountryInfo(record, right){
    if(!record){
        return ;
    }
    var html = '';
    var field;

    if(record.country_name){
        field = record.country_name;
        html += '<h3>' + tek.dataUtility.stringToHTML(field.show || '');
    }
    if(record.country_fullname){
        field = record.country_fullname;
        html += '<span class="country_fullname text-right">' + tek.dataUtility.stringToHTML(field.show || '') + '</span>'
    }
    html += '</h3>'
        + '<div class="plan-details">'
        + '<ul class="list-unstyled">';
    var items = new Array("country_code", "country_timezone", "country_areacode", "country_currency", "country_locale", "country_valid");
    
    for(var i in items){
        var item = items[i];
        if(!item){
            break;
        };
        if(record[item]){
            field = record[item];
            html += '<li>' + field.display + '<span class="pull-right">' + tek.dataUtility.stringToHTML(field.show || '') + '</span></li>';
        }
    }

    html += '</ul></div><div class="clearfix"></div>';
    html += '<div class="pull-right">';

    if(tek.right.isCanWrite(parseInt(right))){
        html += '<a class="btn btn-edit" target="_blank" href="edit.html?country_code=' 
            + record.country_code.value + '&country_locale='+ record.country_locale.value +'&show-close=1&refresh-opener=1">编辑</a>'
    }
    if(tek.right.isCanDelete(parseInt(right))){
        html += '<a class="btn btn-remove" href=javascript:removeCountry('
            + record.id +',"' + record.name + '","' + record.country_code.value + '","' + record.country_locale.value + '");>删除</a>';
    }
    
    html += '<a class="btn btn-go" href="javascript:refreshDivislon()">刷新下辖行政区域</a>'
        + '</div><div class="clearfix"></div>';
    
    var target = document.getElementById("country-info");
    if (target){
        target.insertAdjacentHTML('BeforeEnd', html);
    }
}

//删除记录
function removeCountry(id,name,country_code, country_locale) {
  var params = {};
  params["objectName"] = "Country";
  params["action"] = "removeInfo";
  params["country_code"] = country_code;
  params["country_locale"] = country_locale;

  tek.macList.ajaxURL = AjaxURL;

  tek.macList.removeInfo(id, name, params);
}

//获取省/州列表信息
function getStatesList(){
    var target = document.getElementById('state_content');
    if(!target){
        return ;
    }
    var setting = {operateType: "获取省/州列表信息"};
    var sendData = {
        objectName: "State",
        action: "getList",
        country_code: country_code,
        state_locale: country_locale,
        count: COUNT,
        skip: SKIP,
        order: "createTime",
        desc: 1
    };
    var callback = {
        beforeSend: function(){
            $("#state_content").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>")
        },
        success: function(data){
            TOTAL = parseInt(data.value);   //保存总数
            //显示【下一页】按钮
            if (TOTAL > COUNT)
                $("#more_page").removeClass("hidden");
            
            var record = data["record"];
            if(record){
                $("#state_content").html("");
                //显示列表信息
                record = !record.length ? [record] : record;
                for(var i in record){
                    showStateList(record[i],data.right);
                }
            }else{
                $("#state_content").html("<div calss='col-md-12 col-sm-12 center'>没有省/州列表信息！</div>")
            }
        },
        error: function(data, errorMsg){
            $("#state_content").html(errorMsg);
        },
        complete: function(){
            //显示分页
            tek.turnPage.show("statePage",SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
//显示省/州列表信息
function showStateList(record, right){
    if(!record){
        return ;
    }
    var html = "";
    var field;
    html += "<tr>";
    var items = new Array("state_code","state_name","state_fullname","state_shortname","state_areacode","state_timezone","state_country","state_locale", "state_valid")
    for(var i in items){
        var item = items[i];
        html +="<td>";
        if(record[item]){
            field = record[item];
            html += tek.dataUtility.stringToHTML(field.show || '');
        }
        html += "</td>";
    }
    html += "<td>";
    if(tek.right.isCanRead(parseInt(right))){
        html += "<a class='btn btn-success' target='_blank' href='../state/read.html?state_code=" + record.state_code.value + "&state_locale="+ record.state_locale.value +"'>读取</a>"
    }
    html += "</td>";
    html += "</tr>";

    var target = document.getElementById("state_content");
    if(target){
        target.insertAdjacentHTML("BeforeEnd", html);
    }
}

//新建省州信息
function addState(){
    var url = tek.common.getRootPath() + "http/takall/state/add.html?country_code=" + country_code;
    url += "&country_locale=" + country_locale;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}

//翻页 turn-page.js必须实现方法
tek.turnPage.turn = function (eleId, skip) {
    skip = parseInt(skip);
    if (!isFinite(skip) || skip < 0)
        return;

    SKIP = skip;
    getStatesList();
    
};

//响应刷新事件
function refreshDivislon() {
    getStatesList();
}