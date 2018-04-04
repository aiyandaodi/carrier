// JavaScript Document
// JavaScript Document
var city_code;
var city_locale;
var AjaxURL = tek.common.getRelativePath() + "servlet/tobject";
function init(){
	city_code = request["city_code"];
	city_locale = request["city_locale"];
	if(city_code && city_locale){
		getCityInfo();
	}
}

function getCityInfo(){
	if(!city_code || !city_locale){
        tek.macCommon.waitDialogShow(null, "未找到市/区/县标识", 1500 ,0);
        return;
    } 
    var setting = {opearateType: "获取市/区/县信息"};
    var sendData = {
    	objectName: "City",
    	action: "readInfo",
    	city_code: city_code,
    	city_locale: city_locale
    };
    var callback = {
    	beforeSend: function(){
    		$("#city-info").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>");
    	},
    	success: function(data){
    		var record = data["record"];
    		if(record){
    			$("#city-info").html("");
                //显示信息
                showCityInfo(record,data.right);
    		}else{
                $("#city-info").html("<div class='col-md-12 col-sm-12 text-center'>没有市/区/县信息！</div>")
            }
    	},
        error: function(data, errorMsg){
            $("#city-info").html(errorMsg);
        }
    };

    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示信息内容
function showCityInfo(record, right){
    if(!record){
        return ;
    }

    var html = '';
    var field;

    if(record.city_name){
        field = record.city_name;
        html += '<h3>' + tek.dataUtility.stringToHTML(field.show || '');
    }
    if(record.city_fullname){
        field = record.city_fullname;
        html += '<span class="city_fullname text-right">' + tek.dataUtility.stringToHTML(field.show || '') + '</span>';
    }
    html += '</h3>';
    if(record.city_country){
        field = record.city_country;
        html += '<h5><a href="../country/read.html" target="_blank">' + tek.dataUtility.stringToHTML(field.show || '') + '</a></h5>'
    }
    html += '<div class="plan-details">'
        + '<ul class="list-unstyled">';
    var items = new Array( "city_state", "city_locale", "city_valid");
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
        html += '<a class="btn btn-edit" target="_blank" href="edit.html?city_code=' 
            + record.city_code.value + '&city_locale='+ record.city_locale.value +'&show-close=1&refresh-opener=1">编辑</a>'
    }
    if(tek.right.isCanDelete(parseInt(right))){
        html += '<a class="btn btn-remove" href=javascript:removeCity('
            + record.id +',"' + record.name + '","' + record.city_code.value + '","' + record.city_locale.value + '");>删除</a>';
    }
    
  /*  html += '<a class="btn btn-go" href="javascript:refreshDivislon()">刷新下辖行政区域</a>'*/
      html += '</div><div class="clearfix"></div>';
    
    var target = document.getElementById("city-info");
    if (target){
        target.insertAdjacentHTML('BeforeEnd', html);
    } 
}

//删除记录
function removeCity(id,name,country_code, country_locale) {
  var params = {};
  params["objectName"] = "City";
  params["action"] = "removeInfo";
  params["city_code"] = city_code;
  params["city_locale"] = city_locale;

  tek.macList.ajaxURL = AjaxURL;

  tek.macList.removeInfo(id, name, params);
}
