// JavaScript Document
var total = 0;	//收藏条数
var SELETED_ITEM=null;
function init(){
	/** 载入页面顶部信息 **/
	$("#tekinfo_banner").load(tek.common.getRootPath() + "http/ican/html/owner.html",function(){
		$.getScript(tek.common.getRootPath() + "http/ican/html/owner.js",function(){
			if(typeof initHeader == "function"){
				initHeader();
			}
		});
		
		$("#favorite").addClass("active");
		
		$("#tekinfo_banner").css("position","relative");
		$("#tekinfo_banner").show();
	});

	getFavoriteSetList();	//读取收藏集信息
	
	//获取公告信息
	getSubjectList(4,"subject_notice");
}
//读取收藏集信息
function getFavoriteSetList(){
	var setting = {operateType: "获取收藏集信息"};
	var sendData = {
		objectName: "FavoriteSet",
		action: "getList",
		favorite_set_owner: myId
	};
	var callback = {
		beforeSend: function () {
			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>正在获取数据...</div>";
			$("#favorite_set_name").html(html);
		},
		success: function (data) {
			var record = data["record"];
			if (record) {
				$("#favorite_set_name").html('')
				record = !record.length ? [record] : record;
				for(var i in record){
					showFavoriteSetInfo(record[i], data.right);
				}
			} else {
				$("#favorite_set_name").html("尚未添加收藏集！");
			}
		},
		error: function (data, errorMsg) {
			$("#favorite_set_name").html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback); 
}
//显示收藏夹
function showFavoriteSetInfo(record, right){
	if(!record){
		return ;
	}
	
	var html = '';
	var field ;
	html += '<div class="ui-item clearfix">'
		+ '<div class="ui-rcontent clearfix">'
		+ '<div class="pull-right">';
	if(tek.right.isCanWrite(parseInt(right))){
		html += '<a class="pull-right" href="edit.html?favorite_set_id=' + record.id + '&show-close=1&refresh-opener=1"><i class="fa fa-edit"></i></a>';
	}
	if(tek.right.isCanDelete(parseInt(right))){
		html += '<a class="pull-right" href="javascript" onclick=removeFavoriteSet("' + record.id + '")><i class="fa fa-trash"></i></a>';
	}
	html += '</div>';
	html += '<div class="pull-left">';
	if(record.favorite_set_color){
		field = record.favorite_set_color;
		html += '<span style="background-color: #' + field.value + ';" id="color-' + record.id + '"><span>';
	}
	html += '</div>';
	if(record.name){
		html += '<h4><a href="javascript:;" onclick=readFavoriteSet("' + record.id + '")>' + tek.dataUtility.stringToHTML(record.name) + '</a></h4>';
	}
	getTotalFavorite(record.id);

	html += '<p>' + total + '条内容</p>';
	html += '</div></div>';

	var target = document.getElementById("favorite_set_name");
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	} 
}

//获取收藏夹内容总条数
function getTotalFavorite(setId){
	var setting = {async:false, operateType: '获取列表下收藏总数'};
	var sendData = {
		objectName: 'Favorite',
		action: 'getTotal',
		favorite_set_id: setId
	};
	var callback = {
		success: function(data){
			if(data.code == 0){
				total = data.value;
			}
		},
		error: function(data, errorMsg){

		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}
//添加收藏夹
function addFavoriteSet(){
	var url = tek.common.getRootPath() + 'http/ican/favorite/add-set.html?show-close=1&refresh-opener=1';
	window.open(url);
}
//读取收藏夹信息
function readFavoriteSet(setId){
	var setting = {operateType: '读取收藏夹信息'};
	var sendData = {
		objectName: 'FavoriteSet',
		action: 'readInfo',
		favorite_set_id: setId
	};
	var callback = {
		success: function(data){
			var right = data.right;
			var record = data['record'];
			if(record){

				if(record.favorite_set_color){
					var html = '<span style="background:#' + record.favorite_set_color.show + '"></span>'
				}
					$("#favoriteSet-title").html(html + tek.dataUtility.stringToHTML(record.name));
			}
			

			$(".back-favoriteSet").removeClass('hide');
			$("#favoriteSet_info").addClass('hide');
			$("#favorite-info").removeClass('hide');

			
			if(tek.right.isCanWrite(parseInt(right))){
				$('.favorite-edit').removeClass('hide');
				$('.favorite-edit').attr('href', 'edit.html?favorite_set_id='+setId+'&show-close=1&refresh-opener=1');
			}
			if(tek.right.isCanDelete(parseInt(right))){
				$('.favorite-remove').removeClass('hide');
				$('.favorite-remove').attr('onclick', 'removeFavoriteSet("' + setId + '")');
			}
			getListFavorite(setId);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}
//删除收藏夹
function removeFavoriteSet(setId){
	var setting = {operateType: '删除收藏夹'};
	var sendData = {
		objectName: 'FavoriteSet',
		action: 'removeInfo',
		favorite_set_id: setId
	};
	var callback = {
		beforeSend: function () {
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 请稍候!</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
		
			
			setTimeout(function () {
				//刷新页面
				location.reload();
			}, 2000);
			
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null,errorMsg);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

//获取收藏信息
function getListFavorite(setId){
	if(!setId){
		return ;
	}
	var setting = {operateType: "获取收藏夹下收藏信息"};
	var sendData = {
		objectName: 'Favorite',
		action: 'getList',
		favorite_set_id: setId
	}
	var callback = {
		success: function(data){
			var record = data["record"];
			if (record) {
				record = !record.length ? [record] : record;
				for(var i in record){
					showFavoriteInfo(record[i]);
				}
			} else {
				$("#favorite_name").html("尚未添加收藏！");
			}
		},
		error: function (data, errorMsg) {
			$("#favorite_name").html(errorMsg);
		}
	};

	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback); 
}
//显示收藏
function showFavoriteInfo(record){
	if(!record){
		return ;
	}
	
	var html = '';
	var field ;
	var linkId;
	var linkName
	html += '<div class="ui-item clearfix" id="ui-item-' + record.id + '">'
		+ '<div class="ui-rcontent clearfix">';
	html += '<h4>';
	if(record.favorite_linkId){
		linkId = record.favorite_linkId.value;
	}
	if(record.favorite_linkName){
		linkName = record.favorite_linkName.value;
	}
	if(record.name){
		html += '<a href="javascript:;" onclick=readFavorite("' + linkId + '","' + linkName + '")>' + tek.dataUtility.stringToHTML(record.name) + '</a>';
	}
	html += '<div class="pull-right "><a class="operateBtn" href="javascript:;" onclick=removeFavorite("' + record.id + '")>取消收藏</a></div>'
	html +='<div class="clearfix"></div></h4>'
	html += '</div></div>';

	var target = document.getElementById("favorite_name");
	if (target){
		target.insertAdjacentHTML('BeforeEnd', html);
	} 
}
//返回收藏夹
function backFavoriteSet(){
	$(".back-favoriteSet").addClass('hide');
	$("#favoriteSet_info").removeClass('hide');
	$("#favorite-info").addClass('hide');
	$("#favorite_name").html('');
}

//取消收藏
function removeFavorite(id){
	var target = document.getElementById('ui-item-' + id);
	if (!target){
		return;
	}
	var setting = {operateType: '删除收藏'};
	var sendData = {
		objectName: 'Favorite',
		action: 'removeInfo',
		favorite_id: id
	};
	var callback = {
		beforeSend: function () {
			var msg = "<p class='text-center' ><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' /> 请稍候!</p>";
			tek.macCommon.waitDialogShow(null, msg);
		},
		success: function (data) {
			tek.macCommon.waitDialogShow(null, "<p class='text-center' >" + data.message + "</p>");
			
			target.remove();
			
			
			
		},
		error: function (data, errorMsg) {
			tek.macCommon.waitDialogShow(null,errorMsg);
		},
		complete: function () {

			setTimeout(function () {
				//等待图层隐藏
				tek.macCommon.waitDialogHide();
			}, 2000);
		}
	};
	tek.common.ajax(tek.common.getRootPath() + 'servlet/tobject', setting, sendData, callback);
}

//查看收藏信息
function readFavorite(linkId, linkName){
	if(!linkId || !linkName){
		return ;
	}

	var url = selectObjectType(linkName);	//查找关联对象

	if(url){
		url = tek.common.getRootPath() + url + '?' + linkName.toLowerCase() + '_id=' + linkId;
	}
	window.open(url);
}

function selectObjectType(linkName){
	if(!linkName){
		return ;
	}
	var url;
	switch(linkName){
		case 'Interaction': 
			url = 'http/takall/interaction/read.html';
			break;
		case 'Certificates':
			url = 'http/imark/certificates/read.html';
			break;
	}
	return url;
}

function sortType(){
	window.location.reload();
}
function sortName(index){
	$(index).parent().addClass('active');
	$(index).parent().siblings('li').removeClass('active');
}
//过滤类型
function filterType(index){
	var type=$(index).html();
	var favorates=$('.table tbody tr:nth-child(odd) td:first-child a');
	$('.table tbody tr:nth-child(odd) td:first-child a').each(function(index, element) {
        if($(element).html()!=type){
			$(element).parents('tr').css('display','none');
		}
		else{
			$(element).parents('tr').removeAttr('display');
			}
    });
}
//为删除按钮绑定事件
function deleteInit(){
	$('.right-delete').on('click',function(){
		SELETED_ITEM=this;
		delFavorate();
	})
}
//删除收藏
function delFavorate(index){
	var str='<p>是否确认删除？</p>'
		+ '<a href="javascript:submitDel();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
		
	showMessage(str);
}
//确认删除
function submitDel(){
	$(SELETED_ITEM).parent().parent('tr').next('tr').remove();
	$(SELETED_ITEM).parent().parent('tr').remove();
	closePrompt();
	alert('success');
}



//获取主题公告信息
function getSubjectList(type,target){
	var ajaxURL = tek.common.getRootPath() + "servlet/tobject";
	var setting = {operateType: "获取主题信息"};
	var params = {};
	params["objectName"] = "Subject";
	params["action"] = "getList";
	params["skip"] = 0;
	params["order"] = "createTime";
	params["desc"] = 1;
	params["count"] = 5;
	params["subject_type"] = type;
	
	
	var callback = {
		beforeSend: function(){
			$("#target").append("<div id='waiting-img' class='col-md-12 text-center col-sm-12'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' />正在加载数据...</div>");
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
						showSubjectInfo(record[i],target);
					}
				}else{
					$("#target").html("<div class='col-md-12 col-sm-12 center'>没有主题信息！</div>");
				}
			}
		},
		error: function(data, errorMsg){
			$("#target").html(errorMsg);
		}
	};
	
	tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, params, callback);
}

//显示主题信息
function showSubjectInfo(record,target){
	if(!record){
		return ;
	}
	var html = "";
	var field;
	html += '<div class="item">';
	if(target == "subject_notice"){
		html += '<h3><a href="' + tek.common.getRootPath() + 'http/takall/subject/read-notice.html?subject_id=' + record.id + '" target="_blank">' + record.name + '</a></h3>'
	}
	else if(target == "subject_question"){
		html += '<h3><a href="' + tek.common.getRootPath() + 'http/takall/subject/read-qa.html?subject_id=' + record.id + '" target="_blank">' + record.name + '</a></h3>'
	} 
	html += '<div class="meta">';
	if(record.createTime){
		field = record.createTime.show || '';
		html += '<i class="fa fa-calendar"></i>' + tek.dataUtility.stringToHTML(field) + '&nbsp;&nbsp;';
	}
	if(record.subject_owner){
		field = record.subject_owner.show || '';
		html += '<i class="fa fa-user"></i></i>' + tek.dataUtility.stringToHTML(field);
	}
	if(record.subject_summary){
		field = record.subject_summary.show || '';
		html += '<p>' + tek.dataUtility.stringToHTML(field) + '</p>'
	}
	html += '</div>';
	
	var target = document.getElementById(target);
	if(target){
		target.insertAdjacentHTML("BeforeEnd",html);
	}
}



//slide收藏说明初始化
function slideInit(){
	$('.table tbody tr td:nth-child(2)').click(function(e){
		e.preventDefault();
		$(this).parent().next('tr').slideToggle(200);
	});
}
//检索
function inputSearch(){
	$('.ui-list form').fadeToggle(200);
}