// JavaScript Document
var state_code;
var state_locale;
var SKIP = 0;
var COUNT = 5;
var TOTAL = 0;
var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
function init(){
	state_code = request["state_code"];
	state_locale = request["state_locale"];
	if(state_code && state_locale){
		getStateInfo();
        getCityList();
	}
}

function getStateInfo(){
	if(!state_code || !state_locale){
        tek.macCommon.waitDialogShow(null, "未找到省/州标识", 1500 ,0);
        return;
    } 
    var setting = {opearateType: "获取省/州信息"};
    var sendData = {
    	objectName: "State",
    	action: "readInfo",
    	state_code: state_code,
    	state_locale: state_locale
    };
    var callback = {
    	beforeSend: function(){
    		$("#state-info").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
    	},
    	success: function(data){
    		var record = data["record"];
    		if(record){
    			$("#state-info").html("");
                //显示信息
                showStateInfo(record,data.right);
    		}else{
                $("#state-info").html("<div class='col-md-12 col-sm-12 text-center'>没有省/州信息！</div>")
            }
    	},
        error: function(data, errorMsg){
            $("#state-info").html(errorMsg);
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示信息内容
function showStateInfo(record, right){
    if(!record){
        return ;
    }

    var html = '';
    var field;

    if(record.state_name){
        field = record.state_name;
        html += '<h3>' + tek.dataUtility.stringToHTML(field.show || '');
    }
    if(record.state_fullname){
        field = record.state_fullname;
        html += '<span class="state_fullname text-right">' + tek.dataUtility.stringToHTML(field.show || '') + '</span>';
    }
    html += '</h3>';
    if(record.state_country){
        field = record.state_country;
        html += '<h5><a href="../country/read.html?country_code=' + record.state_country.value + '&country_locale='+ record.state_locale.value +'" target="_blank">' + tek.dataUtility.stringToHTML(field.show || '') + '</a></h5>'
    }
    html += '<div class="plan-details">'
        + '<ul class="list-unstyled">';

    var items = new Array("state_timezone", "state_areacode", "state_locale", "state_valid");
    for(var i in items){
        var item = items[i];
        if(!item){
            break;
        }
        if(record[item]){
            field = record[item];
            html += '<li>' + field.display + '<span class="pull-right">' + tek.dataUtility.stringToHTML(field.show || '') + '</span></li>';
        }
    }

    html += '</ul></div><div class="clearfix"></div>';
    html += '<div class="pull-right">';

    if(tek.right.isCanWrite(parseInt(right))){
        html += '<a class="btn btn-edit" target="_blank" href="edit.html?state_code=' 
            + record.state_code.value + '&state_locale='+ record.state_locale.value +'&show-close=1&refresh-opener=1">编辑</a>'
    }
    if(tek.right.isCanDelete(parseInt(right))){
        html += '<a class="btn btn-remove" href=javascript:removeState('
            + record.id +',"' + record.name + '","' + record.state_code.value + '","' + record.state_locale.value + '");>删除</a>';
    }
    
    html += '<a class="btn btn-go" href="javascript:refreshDivislon()">刷新下辖行政区域</a>'
        + '</div><div class="clearfix"></div>';
    
    var target = document.getElementById("state-info");
    if (target){
        target.insertAdjacentHTML('BeforeEnd', html);
    } 
}

//删除记录
function removeState(id,name,country_code, country_locale) {
  var params = {};
  params["objectName"] = "State";
  params["action"] = "removeInfo";
  params["state_code"] = state_code;
  params["state_locale"] = state_locale;

  tek.macList.ajaxURL = AjaxURL;

  tek.macList.removeInfo(id, name, params);
}

//获取市/区/县列表信息
function getCityList(){
    var target = document.getElementById('city_content');
    if(!target){
        return ;
    }
    var setting = {opearateType: "获取市/区/县列表信息"};
    var sendData = {
        objectName: "City",
        action: "getList",
        state_code: state_code,
        city_locale: state_locale,
        count: COUNT,
        skip: SKIP,
        order: "createTime",
        desc: 1
    };
    var callback = {
        beforeSend: function(){
            $("#city_content").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
        },
        success: function(data){
            TOTAL = parseInt(data.value);   //保存总数
            //显示下一页按钮
            if(TOTAL > COUNT){
                $("#more_page").removeClass("hidden");
            }

            var record = data["record"];
            if(record){
                $("#city_content").html("");

                //显示列表信息
                record = !record.length ? [record] : record;
                for(var i in record){
                    showCityList(record[i], data.right);
                }
            }else{
                $("#city_content").html("<div calss='col-md-12 col-sm-12 center'>没有市/区/县列表信息！</div>");
            }
        },
        error: function(data, errorMsg){
            $("#city_content").html(errorMsg);
        },
        complete: function(){
            //显示分页
            tek.turnPage.show("cityPage",SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示市区县列表信息
function showCityList(record, right){
    if(!record){
        return ;
    }

    var html = "";
    var field;
    html += "<tr>";
    
    var items = new Array("city_code","city_name","city_fullname","city_locale","city_valid")
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
        html += "<a class='btn btn-success' target='_blank' href='../city/read.html?city_code=" + record.city_code.value + "&city_locale="+ record.city_locale.value +"'>读取</a>"
    }
    html += "</td>";
    html += "</tr>";

    var target = document.getElementById("city_content");
    if(target){
        target.insertAdjacentHTML("BeforeEnd", html);
    }
}

//新建市区县信息
function addCity(){
    var url = tek.common.getRootPath() + "http/takall/city/add.html?state_code=" + state_code;
    url += "&state_locale=" + state_locale;
    url += "&show-close=1&refresh-opener=1";
    window.open(url);
}

//翻页 turn-page.js必须实现方法
tek.turnPage.turn = function (eleId, skip) {
    skip = parseInt(skip);
    if (!isFinite(skip) || skip < 0)
        return;

    SKIP = skip;
    getCityList();
    
};

//响应刷新事件
function refreshDivislon() {
    getCityList();
}