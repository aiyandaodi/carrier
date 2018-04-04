// JavaScript Document
var SELECTED_ITEM=null;
function init(){
	/** 载入页面顶部信息 **/
	$("#tekinfo_banner").load(tek.common.getRootPath() + "http/ican/html/owner.html",function(){
		$.getScript(tek.common.getRootPath() + "http/ican/html/owner.js",function(){
			if(typeof initHeader == "function"){
				initHeader();
			}
		});
		
		$("#social").addClass("active");
		
		$("#tekinfo_banner").css("position","relative");
		$("#tekinfo_banner").show();
	});
	
	deleteInit();
	
	
}
function closePrompt(){
	closeMessage();
}
//为删除按钮绑定事件
function deleteInit(){
	$('.right-delete').on('click',function(){
		SELECTED_ITEM=this;
		var str='<p>是否确认删除？</p>'
		+ '<a href="#" onClick="javascript:sureDelete()" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
		showMessage(str);
	})
}
//确认删除
function sureDelete(){
	$(SELECTED_ITEM).parents('tr').remove();
	showMessage('删除成功');
}
//点击编辑
function editInit(index){
		if($('#editInput').length<1){
			SELECTED_ITEM=index;
			var obj=$(index).parent().prev('td');
			var str=obj.children('a').html();
			obj.html('<input type="text" id="editInput" value="'+str+'">');
			$(index).html('保存');
			$(index).attr('onClick','javascript:ifSaveEdit()');
			$(index).after(' <a href="#" class="btn btn-info right-cancel" onClick="javascript:window.location.reload()">取消</a>')
		}
		else{
			showError('请先保存或取消正在编辑的内容。。');
		}
}
//提示是否保存编辑
function ifSaveEdit(){
	var str='<p>是否确认修改？</p>'
		+ '<a href="javascript:sureEdit();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
	showMessage(str);
}
//确认保存编辑内容
function sureEdit(){
	var str=$(SELECTED_ITEM).parent().prev('td').children('input').val();
	$(SELECTED_ITEM).parent().prev('td').html('<a href="#">'+str+'</a>');
	var strHref=$(SELECTED_ITEM).siblings('.right-read').attr('href');
	$(SELECTED_ITEM).parent().prev('td').children('a').attr('href',strHref);
	$(SELECTED_ITEM).html('编辑');
	$(SELECTED_ITEM).attr('onClick','javascript:editInit(this)');
	$(SELECTED_ITEM).parents('td').children('.right-cancel').remove();
	showMessage('修改成功');
}
//新建社交账号
function addSocial(){
	var str='<h4>添加社交账号:</h4>'
		+ '<form class="form-horizontal" style="max-width:500px" role="form">'
		+ '<div class="form-group">'
		+ '<label class="control-label col-sm-3">名称</label><div class="col-sm-9"><input type="text" class="form-control" id="socialName" placeholder="豆瓣？微信？facebook？" required></div>'
		+ '</div>'
		+ '<div class="form-group">'
		+ '<label class="control-label col-sm-3">账号</label><div class="col-sm-9"><input type="text" class="form-control" id="socialNumber" placeholder="请输入你的账号" required></div>'
		+ '</div>'
		+ '<button onClick="javascript:sureAdd();" class="btn btn-success" id="btnSureAdd">确认</button>'
		+ '&nbsp;&nbsp;'
		+ '<button onClick="javascript:closePrompt();" class="btn btn-primary">返回</button>'
		+ '</form>';
	showMessage(str);
	$('#message-modal-dialog').css('z-index',10880);
}
//确认添加
function sureAdd(){
	var name=$('#socialName').val();
	var number=$('#socialNumber').val();
	var str='<tr>'
            	+'<td>'+name+'</td>'
                +'<td><a href="#">'+number+'</a></td>'
                +'<td>'
					+'<a href="#" class="btn btn-success right-read">读取</a> '
					+'<a href="#" class="btn btn-warning right-write" onClick="javascript:editInit(this)">编辑</a> '
					+'<a href="#" class="btn btn-danger right-delete">删除</a>'
                +'</td>'
            +'</tr>';
	if(name!=null&&name!=""&&number!=null&&number!=""){
		$('.table tbody').append(str);
		deleteInit();
		showMessage('添加成功');
	}
	else{
		showError('名称或账号不能为空');
	}
}
//删除全部账号
function deleteAll(){
	var str='<p>是否确认删除全部账号？</p>'
		+ '<a href="#" onClick="javascript:sureDeleteAll()" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
		showMessage(str);
		$('#message-modal-dialog').css('z-index',10880);
}
function sureDeleteAll(){
	$('.table tbody tr').remove();
	showMessage('全部删除成功');
}