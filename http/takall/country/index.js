// JavaScript Document
var SKIP = 0;	//列表起始值
var COUNT = 10;	//每页显示的个数
var TOTAL = 0;	

//初始化
function init(){
	//获取列表信息
	getCountryList();
}
function getCountryList(){
	var target = document.getElementById('country_content');
	if(!target){
		return ;
	}
	var setting = {operateType: "获取国家或地区信息列表"};
	var sendData = {
		objectName: "Country",
		action: "getList",
		count: COUNT,
		skip: SKIP,
		order: "createTime",
		desc: 1
	};
	var callback = {
		beforeSend: function(){
			$("#country_content").html("<div class='col-md-12 col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /></div>")
		},
		success: function(data){
			TOTAL = parseInt(data.value);   //保存总数
            //显示【下一页】按钮
            if (TOTAL > COUNT)
                $("#more_page").removeClass("hidden");
            
			var record = data["record"];
			if(record){
				$("#country_content").html("");
				//显示列表信息
				record = !record.length ? [record] : record;
				for(var i in record){
					showCountryList(record[i],data.right);
				}
			}else{
				$("#country_content").html("<div calss='col-md-12 col-sm-12 center'>没有国家或地区信息</div>")
			}
		},
		error: function(data, errorMsg){
			$("#country_content").html(errorMsg);
		},
		complete: function(){
			//显示分页
			tek.turnPage.show("countryPage",SKIP, COUNT, TOTAL, 5, false, false, false, false, null);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//显示信息
function showCountryList(record, right){
	if(!record){
		return ;
	}
	var html = "";
	var field;

	html += "<tr>";
	var items = new Array("country_code","country_name","country_fullname","country_timezone","country_areacode","country_locale","country_currency","country_valid")
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
		html += "<a class='btn btn-success' target='_blank' href='read.html?country_code=" + record.country_code.value + "&country_locale="+ record.country_locale.value +"'>读取</a>"
	}
	html += "</td>";
	html += "</tr>";

	var target = document.getElementById("country_content");
	if(target){
		target.insertAdjacentHTML("BeforeEnd", html);
	}
}