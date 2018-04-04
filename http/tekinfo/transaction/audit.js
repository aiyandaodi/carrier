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

var isContinueLoad = true;		//是否可以继续

var searchs; // 快速检索域，数组
var searchFormIndex = 1; //指明检索的输入表单
var quickSearch = ""; //快速检索
//=====================================================Function===============================
//--------------------------------------------初始化----------------------------------------
function init() {
	if (tek.common.isLoggedIn()) {
		if (tek.role.isAuditor(parseInt(mySecurity))) {
			// 初始化参数
			initParams();

			// 读取Transaction的列表信息
			readListInfo();
		} else {
			tek.macCommon.waitDialogShow(null, "<p style='color: red;'>你没有【审核】权限！</p>");
		}
	} else {
		tek.macCommon.waitDialogShow(null, "<p>请你先登录！</p>");
	}
}

//----------------------------------------------------------------------------------------
// 初始化参数
function initParams() {
	//显示页码信息
	$("#transaction_page").html(tek.turnPage.getPagination(0, 0, 0));

	//排序字段
	order = "transaction_latestTime";
	//排序方式
	desc = 0;

	//快速查询字段
	searchs = [];    // 快速检索域
	searchs.push("transaction_name");
	searchs.push("transaction_summary");
	searchs.push("transaction_tags");
	searchs.push("transaction_owner");

	//瀑布流参数初始化
	flowInitParams("transaction_cards");
}

//---------------------------------------------读取并显示Transaction--------------------------------------------
// 读取Transaction的列表信息
function readListInfo() {
	if (isContinueLoad) {
		isContinueLoad = false; //继续加载暂时设置为false，防止重复加载
	} else {
		return;
	}

	order = order || "transaction_latestTime";
	desc = (desc == 0 || desc == 1) ? desc : 0;
	//快速查询
	quickSearch = (searchFormIndex == 1) ? $("nav input[name='searchText']").val().trim() : $("#start_box input[name='searchText']").val().trim();

	var setting = {operateType: "获取问答列表"};
	var sendData = {
		objectName: "Transaction",
		action: "getList",
		authorPage: 1, //说明是审计页面
		count: COUNT,
		skip: SKIP,
		order: order,
		desc: desc,
		'quick-search': encodeURIComponent(quickSearch || "")
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...</div>";
			$("#ajax_load_div").removeClass("hide").html(html);
		},
		success: function (data) {
			TOTAL = parseInt(data.value);

			var records = data["record"];
			if (records) {
				records = !records.length ? [records] : records;
				// 显示信息
				showRecordsInfo(records);
			} else {
				$("#transaction_cards").html("没有数据记录");
			};

		},
		error: function (data, errorMsg) {
			$("#ajax_load_div").html(errorMsg).removeClass("hide");
		},
		complete: function () {
			$("#ajax_load_div").addClass("hide");

			$("#transaction_page").html(tek.turnPage.getPagination(SKIP, COUNT, TOTAL));

			// 如果是检索
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
			}
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

// 显示信息
function showRecordsInfo(records) {
	if (!tek.type.isArray(records)) return;

	var elem = document.getElementById("transaction_cards");
	for (var i in records) {
		showTransactionCard(records[i], elem, quickSearch);
	}

	//刷新瀑布流显示
	flowFlushDisplay();
}

// 快速查询
function quickSearchFormSubmit(index) {
	SKIP = 0;

	isContinueLoad = true;

	searchFormIndex = parseInt(index);

	$("#transaction_cards").html("");

	readListInfo()
}

// 检索提问（没有检索到想要问答）
function searchAskQuestion() {
	var searchText = $("#searchText").val().trim();
	if (tek.type.isEmpty(searchText)) {
		$("#searchForm button[type='submit']").removeClass("hide");
		$("#searchForm button[type='button']").addClass("hide");
		return;
	}

	var url = tek.common.getRelativePath() + "http/tekinfo/transaction/add.html?transaction_type=0x10&transaction_name=" + searchText;
	window.open(url, "_blank");
}


//--------------------------card way----------------
// 以卡片方式显示
function showTransactionCard(record, target, searchKeyword) {
	if (!tek.type.isObject(record) || tek.type.isEmpty(target))
		return;

	var html = "<div class='flow-item-box'>"
			//<!--标题-->
		+ "<span class='title btn-group box-title'>"
		+ "<a target='_blank' href='read.html?transaction_id=" + (record.id || "") + "'>"
		+ quickSearchKeywordFilter(record.transaction_name, searchs, searchKeyword)
		+ "</a>"
		+ "</span>";

	//<!--发布者头像-->
	var ownerValue = "";
	var ownerShow = "";
	if (record.transaction_owner) {
		ownerValue = record.transaction_owner.value;
		ownerShow = record.transaction_owner.show;
	}
	html += "<span class='img-circle box-owner-icon'>"
		+ "<a target='_blank' href='" + tek.common.getRootPath() + "http/tekinfo/user/read.html?user_id=" + ownerValue + "' title='" + ownerShow + "'>"
		+ "<img class='img-circle' id='owner_icon_" + (record.id || "") + "' width='100%' height='100%' src='' alt='' >"
		+ "</a>"
		+ "</span>"

		+ "<div class='box-owner-stype'>"
			//<!--发布者-->
		+ "<div class='box-owner'>" + ownerShow + "</div>"

			//<!--类型-->
		+ "<div class='box-type'><i class='fa fa-bookmark'></i>"
		+ (!!record.transaction_type ? quickSearchKeywordFilter(record.transaction_type, searchs, searchKeyword) : "")
		+ "</div>"

		+ "</div>" // end .box-owner-stype

			//<!--标签-->
		+ "<div class='box-tags'><i class='fa fa-tag' title='标签'></i>";
	if (record.transaction_tags) {
		var subjectTags = quickSearchKeywordFilter(record.subject_tags, searchs, searchKeyword);
		if (subjectTags) {
			var array = subjectTags.split(";");
			for (var i = 0; i < array.length; i++) {
				if (array[i]) {
					if (isTagSelected(array[i])) {
						html += "<span class='tag-selected'>" + array[i] + "</span>";
					} else {
						html += "<span onclick='selectTag(this.innerHTML);'>" + array[i] + "</span>";
					}
				}
			} //end for(var i = 0;i < array.length;i++)
		} //end if(subjectTags)
	} //end if(record.subject_tags)
	html += "</div>"

			//<!--概要-->
		+ "<div class='box-summary'>" + (!!record.transaction_summary ? record.transaction_summary.show : "") + "</div>"

			//<!--图片-->
		+ "<div class='box-image'>"
			//if (xxx)
			//	+"<img id='xxx' src='#' width='100%'>");
		+ "</div>"

		+ "<div class='box-foot'>"
			//<!--访问数-->
		+ "<span class='scattered-info' title='访问数'><i class='fa fa-eye'></i>"
		+ ((record.accessCount && record.accessCount.show) ? record.accessCount.show : "0")
		+ "</span>"

			//<!--解答数-->
		+ "<span class='scattered-info' title='"
		+ ((record.transaction_type.value < 0x70) ? "解答数" : "处理数")
		+ "'><i class='fa fa-comments'></i>"
		+ ((record.transaction_answerCount && record.transaction_answerCount.show) ? record.transaction_answerCount.show : "0")
		+ "</span>"

			//<!--评级-->
		+ "<span class='scattered-info' title='平均评价'><i class='fa fa-star'></i>"
		+ ((record.transaction_evaluate && record.transaction_evaluate.show) ? record.transaction_evaluate.show : "0.0")
		+ "</span>"

			//<!--时间-->
		+ "<span class='box-time'>";
	if (record.transaction_end && record.transaction_end.show) {
		html += timeCalculate(record.transaction_end.value) + "前 结束";
	} else if (record.transaction_latestTime && record.transaction_latestTime.show) {
		html += timeCalculate(record.transaction_latestTime.value) + "前 更新";
	} else if (record.transaction_start && record.transaction_start.show) {
		html += timeCalculate(record.transaction_start.value) + "前 创建";
	}
	html += "</span>"

		+ "</div>"; //end .box-foot

	//审核类型标志
	if (record.transaction_status) {
		if (record.transaction_status.value == 0) {
			html += "<i class='fa fa-heart' style='position: absolute;top: 5px;left: 5px;font-size: 8px;color: #4DBB55;'></i>";
		} else if (record.transaction_status.value == 1) {
			if (record.transaction_latestTime && record.transaction_latestTime.value) {
				var latestTime = parseInt(record.transaction_latestTime.value);
				var isOver30Days = (new Date().getTime() - new Date(latestTime).getTime()) / 24 * 60 * 60 * 1000 > 30 ? true : false;
				if (isOver30Days && (record.transaction_end && tek.type.isEmpty(record.transaction_end.show))) {
					html += "<i class='fa fa-heart' style='position: absolute;top: 5px;left: 5px;font-size: 8px;color: #FF4343;'></i>";
				}
			} // if (record.transaction_end && record.transaction_end.value)
		} else {
		}
	}

	html += "</div>"; //end flow-item-box

	//插入HTML文本
	target.insertAdjacentHTML('BeforeEnd', html);

	//获取发布者的头像
	getTransactionOwnerIcon(record.id, ownerValue, ownerShow);
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
			if (!tek.type.isEmpty(data.value))
				$("#owner_icon_" + transactionId).attr('src', data.value);
		},
		error: function (data, errorMsg) {
		}
	};
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//-------------------------------------------------下一页-----------------------------------------
// 加载下一页
function nextPage() {
	SKIP = SKIP + COUNT;
	SKIP = SKIP > TOTAL ? TOTAL : SKIP;

	if (SKIP >= TOTAL) {
		$("#next_page").addClass("hide");
		isContinueLoad = false;
	} else {
		$("#next_page").removeClass("hide");
		isContinueLoad = true;
	}
	readListInfo();
}


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