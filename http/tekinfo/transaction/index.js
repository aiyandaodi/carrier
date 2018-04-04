// JavaScript Document
/**************************************************
 *    事务首页面 index.js
 *
 *
 *
 **************************************************/
//=====================================================Parameter=============================
var order; // 排序字段
var desc; // 排序方式

var COUNT = 10; //每页查询数量
var SKIP = 0; //页面已经跳过的数量
var TOTAL = 0; //总数
var currentPage;
var totalPage;
var isContinueLoad = false;		//是否可以继续

var searchs; // 快速检索域，数组
var searchFormIndex = 1; //指明检索的输入表单
var quickSearch = ""; //快速检索
var transactionType;
var transaction_status;
//=====================================================Function===============================
//--------------------------------------------初始化----------------------------------------
function init() {
	// 显示新建按钮
	$("#addTransactionBtn").show(0);
	transaction_status = request["transaction_status"];
	// 初始化参数
	initParams();

	// 读取Transaction的列表信息
	readListInfo(null, SKIP);
		
	getSubjectList();
	
}

function openItem(id){
	$(".ui-item span.ui-icon-"+id).click(function(e){
		e.preventDefault();
		if($(this).find("i").hasClass("fa-angle-down")){		//Icon Class Angel Down
//			$(this).next(".ui-details").slideDown(400);		//Slide Down
			$(".ui-details-"+id).slideDown(400);
			$(this).find("i").removeClass("fa-angle-down");		//Remove Icon Class Angel Down
			$(this).find("i").addClass("fa-angle-up");		//Add Icon Class Angel Up
		}else{
//			$(this).next(".ui-details").slideUp(400);			//Slide Up
			$(".ui-details-"+id).slideUp(400);
			$(this).find("i").removeClass("fa-angle-up");		//Remove Icon Class Angel Up
			$(this).find("i").addClass("fa-angle-down");		//Add Icon Class Angel Down
		}
	});
}
				
//----------------------------------------------------------------------------------------
// 初始化参数
function initParams() {
	//显示页码信息
//	$("#transaction_page").html(tek.turnPage.getPagination(0, 0, 0));

	//排序字段
	order = "transaction_latestTime";
	//排序方式
	desc = 1;

	//快速查询字段
	searchs = [];    // 快速检索域
	searchs.push("transaction_name");
	searchs.push("transaction_summary");
	searchs.push("transaction_tags");
	searchs.push("transaction_owner");

	//瀑布流参数初始化
//	flowInitParams("transaction_cards");
}

//-----------------------------------------------header中操作-----------------------------------------
// 新建问答
function addTransaction() {
	window.open(tek.common.getRootPath() + "http/tekinfo/transaction/add.html?show-close=1&refresh-opener=1&refresh-opener-func=refreshTransaction", '_blank');
}

//标签显示切换开关
function toggleTags() {
	if ($("#tag_menu").is(":hidden")) {
		$("#toggle_tags").css("background-color", "#CCC");
	} else {
		$("#toggle_tags").css("background-color", "#F8F8F8");
	}

	$("#tag_menu").toggle(500);
}

//目录显示切换开关
function toggleCatalog() {

	if ($("#catalog_menu").is(":hidden")) {
		$("#toggle_catalog").css("background-color", "#CCC");
	} else {
		$("#toggle_catalog").css("background-color", "#F8F8F8");
	}

	$("#catalog_menu").toggle(500);
}

//---------------------------------------------读取并显示Transaction--------------------------------------------
// 读取Transaction的列表信息
function readListInfo(transactionType,skip) {
	/*if (isContinueLoad) {
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
	} else {
		return;
	}*/

	order = order || "transaction_latestTime";
	desc = (desc == 0 || desc == 1) ? desc : 0;
	//快速查询
	//quickSearch = (searchFormIndex == 1) ? $("nav input[name='searchText']").val() : $("#start_box input[name='searchText']").val();\
    quickSearch = $("#search_text").val();

	var setting = {operateType: "获取问答列表"};
	var sendData = {
		objectName: "Transaction",
		action: "getList",
		indexPage: 1, //说明是索引页面
		count: COUNT,
		skip: skip,
		order: order,
		desc: desc,
		'quick-search': encodeURIComponent(quickSearch || "")
	};
	if(transaction_status){
		sendData['transaction_status'] = transaction_status;
		}
	if(transactionType){
		sendData['transaction_type'] = transactionType;
	}
	var callback = {
		beforeSend: function () {
			var html = "<div id='waiting-img' class='center'><img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...</div>";
			$("#transaction_cards").append(html);
		},
		success: function (data) {
			TOTAL = parseInt(data.value);
			
			$("#waiting-img").remove();
			var records = data["record"];
			if (records) {
				records = !records.length ? [records] : records;
				// 显示信息
				showRecordsInfo(records);
				
				//显示分页
                showCustomListTurn(skip,data);
			} else {
				$("#transaction_cards").html("没有数据记录");
			}
		},
		error: function (data, errorMsg) {
			$("#ajax_load_div").html(errorMsg).removeClass("hide");
		},
		complete: function () {
			$("#ajax_load_div").addClass("hide");

//			$("#transaction_page").html(tek.turnPage.getPagination(SKIP, COUNT, TOTAL));

			if (SKIP + COUNT >= TOTAL) {
				$("#more_page").addClass("hide");
				isContinueLoad = false;
			} else {
				$("#more_page").removeClass("hide");
				isContinueLoad = true;
			}

			/*/ 如果是检索
			if (tek.type.isEmpty(quickSearch)) {
				if (searchFormIndex == 1) {
					$("nav #searchForm button[type='submit']").removeClass("hide");
					$("nav #searchForm button[type='button']").addClass("hide");
				} else {
					$("#start_box #searchForm button[type='submit']").removeClass("hide");
					$("#start_box #searchForm button[type='button']").addClass("hide");
				}
			} else {
				if (searchFormIndex == 1) {
					$("nav #searchForm button[type='submit']").addClass("hide");
					$("nav #searchForm button[type='button']").removeClass("hide");
				} else {
					$("#start_box #searchForm button[type='submit']").addClass("hide");
					$("#start_box #searchForm button[type='button']").removeClass("hide");
				}
			}*/
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示信息
function showRecordsInfo(records) {
	if (!tek.type.isArray(records)) return;

	var elem = document.getElementById("transaction_cards");
	for (var i in records){
		showTransactionCard(records[i], elem, quickSearch);
	}
}
/**
 * 显示默认的列表翻页按钮
 *
 * @param data
 *           检索结果
 */
function showCustomListTurn(skip,data) {
    var elem=document.getElementById("page");
    if (!elem)
        return;

    elem.innerHTML="";
    count=parseInt(COUNT);
    if(!count)
        count=0;
    var total=parseInt(data.value);
    if(!total)
        total=0;

    //显示页码html信息文本
    elem.innerHTML = tek.turnPage.getPagination(skip,count,total);

	
    currentPage = tek.turnPage.getCurrentPageNumber(skip,count);
    totalPage = tek.turnPage.getTotalPageNumber(total,count);

    if(currentPage<totalPage){
        isContinueLoad = true;
        $("#more_page").removeClass("hidden");   //加载瀑布流完成后显示下一页按
        $("#ajax-load-div").addClass("hidden");
    }else{
        isContinueLoad = false;
        $("#more_page").addClass("hidden");
        $("#ajax-load-div").removeClass("hidden");
    }
	
}
//下一页按钮，翻到下一页
function morePage(){
    if(currentPage<totalPage) {
        if(!$("#transaction_cards").is(":visible"))
            $(".wminimize").click();

        isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
        $("#page").removeClass("hidden");
        changePage(null,(currentPage*count));
    }else{
        $("#ajax-load-div").removeClass("hidden");
        $("#page").addClass("hidden");
        $("#more_page").addClass("hidden");
    }
			
}
function changePage(id, skip){
    //questionData["skip"]=skip;
    readListInfo(transactionType, skip);
}
// 快速查询
function quickSearchFormSubmit(index) {
	SKIP = 0;

	isContinueLoad = true;

	//searchFormIndex = parseInt(index);

	$("#transaction_cards").html("");

	readListInfo(null, SKIP)
}

// 检索提问（没有检索到想要问答）
function searchAskQuestion() {
	var searchText = $("#searchText").val();
	if (tek.type.isEmpty(searchText)) {
		$("#searchForm button[type='submit']").removeClass("hide");
		$("#searchForm button[type='button']").addClass("hide");
		return;
	}

	var url = tek.common.getRelativePath() + "http/tekinfo/transaction/add.html?transaction_type=0x10&transaction_name=" + searchText;
	window.open(url, "_blank");
}


//选择类型
function selectTranasctionType(typeValue) {
	typeValue = parseInt(typeValue);
	var type = queryTranactionType(typeValue);
	//$("#transaction_object_type > span:eq(1) > a > span").removeClass(typeColors).addClass(type.color).text(type.name);
	transactionType = typeValue;
	$("#transaction_cards").html('');
	readListInfo(transactionType,0);
}
//查询类型名
function queryTranactionType(typeValue) {
	var color, name, fa_;
	switch (parseInt(typeValue)) {
		case 16: 	//提问
			color = "lblue";
			name = "提问";
			fa_ = "fa-question-circle";
			break;
		case 32: 	//工单
			color = "orange";
			name = "工单";
			fa_ = "fa-file-text";
			break;
		case 128: 	//咨询
			color = "green";
			name = "咨询";
			fa_ = "fa-envelope-o";
			break;
		case 64: 	//投诉
			color = "red";
			name = "投诉";
			fa_ = "fa-warning";
			break;
		case 65: 	//举报
			color = "rose";
			name = "举报";
			fa_ = "fa-flag-o";
			break;
		case 129: 	//建议
			color = "blue";
			name = "建议";
			fa_ = "fa-edit";
			break;
		default:
			color = "brown";
			name = "选择类型";
			break;
	}

	return {color: color, name: name, fa_: fa_};
}

//--------------------------card way----------------
// 以卡片方式显示
function showTransactionCard(record, target, searchKeyword) {
	if (!tek.type.isObject(record) || tek.type.isEmpty(target))
		return;
	var html = '';
	var field;
	html += '<div class="ui-item">'
		+ '<a href="read.html?transaction_id=' + record.id + '" target="_blank" class="clearfix ui-heading">'
		+ '<span class="ui-left">';
	if(record.transaction_type){
		field = record.transaction_type.value;
		var type = queryTranactionType(field);
		
		html += '<span class="badge badge-' + type.color + '"><i class="fa ' + type.fa_ + '"></i></span>'
	}
	html += record.name + '</span>'
		+ '<span class="ui-right clearfix">';
	//获取头像
	var ownerValue = "";
	var ownerShow = "";
		
	if(record.transaction_owner){
		ownerValue = record.transaction_owner.value;
		ownerShow = record.transaction_owner.show;

		field = record.transaction_owner.show || '';

		html += '<img alt="" class="img-responsive" id="owner_icon_' + record.id + '" src="" />'
		html += '<span class="ui-heading">' + tek.dataUtility.stringToHTML(field) + '</span>'
	}
	html += '<span class="ui-icon ui-icon-' + record.id + '"><i class="fa fa-angle-down"></i></span>'
		+ '</span>'
		+ '</a>'
	if(record.transaction_summary){
		field = record.transaction_summary.show || '';
		html += '<div class="ui-details ui-details-' + record.id + '"><p>' + tek.dataUtility.stringToHTML(field) + '</p></div>';
	}
	html += '</div>';
	
	
	//插入HTML文本
	target.insertAdjacentHTML('BeforeEnd', html);
	//获取发布者头像
	getTransactionOwnerIcon(record.id, ownerValue, ownerShow);
	
	openItem(record.id);
	
}

// 获取发布者的头像
function getTransactionOwnerIcon(transactionId, userId, userName) {
	var setting = {operateType: "获取发布者头像"};
	var sendData = {
		objectName: "User",
		action: "getIcon",
		user_id: userId
	};
	var callback = {
		success: function (data) {
			if (!tek.type.isEmpty(data.value)){
				$("#owner_icon_" + transactionId).attr('src', data.value);
			}else{
				//$("#owner_icon_" + transactionId).attr('src', tek.common.getRootPath()+'http/images/happy.png');
			}
				
		},
		error: function (data, errorMsg) {
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}
//获取主题公告信息
function getSubjectList(){
	var ajaxURL = tek.common.getRootPath() + "servlet/tobject";
	var setting = {operateType: "获取主题信息"};
	var params = {};
	params["objectName"] = "Subject";
	params["action"] = "getList";
	params["skip"] = 0;
	params["order"] = "createTime";
	params["desc"] = 1;
	params["count"] = 5;
	params["subject_type"] = 4;
	
	
	var callback = {
		beforeSend: function(){
			$("#subject_notice").append("<div id='waiting-img' class='col-md-12 text-center col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />正在加载数据...</div>");
		},
		success: function(data){
			//alert($("#subject_content").html())
			if(data.code == 0){
				var record = data["record"];
				if(record){
					$("#waiting-img").remove();
					record = !record.length ? [record] : record;
					for(var i in record){
						//显示主题信息
						showSubjectInfo(record[i]);
					}
				}else{
					$("#subject_notice").html("<div class='col-md-12 col-sm-12 center'>没有主题信息！</div>");
				}
			}
		},
		error: function(data, errorMsg){
			$("#subject_notice").html(errorMsg);
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
}

//显示主题信息
function showSubjectInfo(record){
	if(!record){
		return ;
	}
	var html = "";
	var field;
	
	html += '<div class="item">'
		+ '<h3><a href="' + tek.common.getRootPath() + 'http/takall/subject/read-notice.html?subject_id=' + record.id + '" target="_blank">' + record.name + '</a></h3>'
		+ '<div class="meta">';
	if(record.createTime){
		field = record.createTime.show || '';
		html += '<i class="fa fa-calendar"></i><a href="#">' + tek.dataUtility.stringToHTML(field) + '</a>&nbsp;';
	}
	if(record.subject_owner){
		field = record.subject_owner.show || '';
		html += '<i class="fa fa-user"></i></i> <a href="#">' + tek.dataUtility.stringToHTML(field) + '</a>'
	}
	if(record.subject_summary){
		field = record.subject_summary.show || '';
		html += '<p>' + tek.dataUtility.stringToHTML(field) + '</p>'
	}
	html += '</div>';
	
	var target = document.getElementById("subject_notice");
	if(target){
		target.insertAdjacentHTML("BeforeEnd",html);
	}
}

//-------------------------------------------------下一页-----------------------------------------


//------------------------------------------------------通用函数（适用于本js文件）-------------------------------
//快速检索字段凸显过滤函数
// checkRecordIteam：被检查的record字段对象；searchRecordItemArray：检索record字段数组；keyword：检索关键字
function quickSearchKeywordFilter(checkRecordItem, searchRecordItemArray, keyword) {
	if (!searchRecordItemArray || toString.apply(searchRecordItemArray) !== "[object Array]" || !keyword || keyword == "undefined")
		return checkRecordItem.show;

	for (var i = 0; i < searchRecordItemArray.length; i++) {
		if (checkRecordItem.name == searchRecordItemArray[i]) {
			var reg = new RegExp(keyword, "gi");
			var replaceText = "<font color='#F00'>" + keyword + "</font>";
			return checkRecordItem.show.replace(reg, replaceText);
		}
	}
	return checkRecordItem.show;
}

// 时间估算
function timeCalculate(dateLong) {
	dateLong = parseInt(dateLong);
	if (dateLong <= 0) return "0 分钟";

	var now = (new Date()).getTime();
	var date = (new Date(dateLong)).getTime();

	if (now < date) return "0 分钟";
	diff = parseInt((now - date) / 1000);

	var t = "";
	if ((diff = parseInt(diff / 60)) && diff < 60) {
		t += diff + " 分钟";
	} else if ((diff = parseInt(diff / 60)) && diff < 24) {
		t += diff + " 小时";
	} else if ((diff = parseInt(diff / 24)) && diff < 30) {
		t += diff + " 天";
	} else if ((diff = parseInt(diff / 30)) && diff < 12) {
		t += diff + " 月";
	} else if ((diff = parseInt(diff / 12)) && diff >= 0) {
		t += diff + " 年";
	}

	return t;
}


//-----------------------------------------------------End-------------------------------------