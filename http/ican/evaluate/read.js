// JavaScript Document
// JavaScript Document
var TEMP_ELE = null;
function init(){
	/** 载入页面顶部信息 **/
	$("#tekinfo_banner").load(tek.common.getRootPath() + "http/ican/html/owner.html",function(){
		$.getScript(tek.common.getRootPath() + "http/ican/html/owner.js",function(){
			if(typeof initHeader == "function"){
				initHeader();
			}
		});
		
		$("#evaluate").addClass("active");
		
		$("#tekinfo_banner").css("position","relative");
		$("#tekinfo_banner").show();
	});
	
	
	proInit();
	trash();
	pencil();
	
	/** 载入弹出菜单 **/
	$("#tekinfo_popmenu").load(tek.common.getRootPath() + "http/vip/html/i-readmenu.html",function(){
		$.getScript(tek.common.getRootPath() + "http/vip/html/i-readmenu.js",function(){
			//alert("initReadmenu="+(typeof initReadmenu));
			if(typeof initReadmenu == "function"){
				initReadmenu();
			}
		});
	});


}

function closePrompt(){
	closeMessage();
}

//评价进度条初始化
function proInit(){
	$(".pro-content h4").each(function(){
				var max = $(this).attr("data-valuemax");
				$(this).prop('Counter', 0 ).animate({ width: max + "%", Counter: max }, {			//Min value 0 and Max value attribute value	
					duration: 1000,
					easing: 'swing',
					step: function () {
						$(this).parents('.pro-item').siblings('.actions').children('input').val(Math.ceil(this.Counter));
					  $(this).children("span").text(Math.ceil(this.Counter) + "%");		//Count Number
					}
				});
			});
}

//添加input初始化
function rangeInit(name){
	if(name!=null){
		$('#eval-name').val(name);
	}
	$('#eval-level').change(function(){
		var eval=$('#eval-level').val();
		$('#eval-show').html(eval+'%');
	})
}
//为删除按钮绑定事件
function trash(){
	$(".trash").on("click",function(){
		TEMP_ELE = this;
		delItem();	
	});
}
//删除评价
function delItem(){	
	var str='<p>是否删除该评价？</P>'+'<a href="javascript:sureRemove();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
	showMessage(str);
}
//确认删除
function sureRemove(){
	$(TEMP_ELE).parent().parent(".ui-item").remove();
	closeMessage();
	alert('delete');
}
//为修改按钮绑定事件
function pencil(){
	$('.done').on('click',function(){
		TEMP_ELE = this;
		editItem();
	})
}
//修改评价
function editItem(){
	var str='<p>是否修改该评价？</P>'+'<a href="javascript:sureEdit();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';
	showMessage(str);
}

//确认修改评价
function sureEdit(){
	var newEval=$(TEMP_ELE).siblings('input').val();
	$(TEMP_ELE).parent().siblings('div').children('div').children('h4').attr('data-valuemax',newEval);
	closeMessage();
	proInit();
}

//添加评价
function addEval(index){
	var str='<form>'
            +'<label>评价名称：</label><span id="msg"></span>'
            +'<input type="text" class="form-control" id="eval-name">'
            +'<label>评价等级：</label><span id="eval-show">50%</span>'
            +'<input type="range" class="form-control" id="eval-level" step="10" max="100" min="0" oninput="OnInput (event)" onpropertychange="OnPropChanged (event)">'
           	+'<button type="button" class="btn btn-primary" id="eval-ok" onClick="javascript:submitEval()">确定</button>'
            +'<button type="button" class="btn btn-default" data-dismiss="modal"  id="eval-cancel">取消</button>'
            +'</form>';
	var name="";	
	showMessage(str);
	if(index!=null){
		name=$(index).children('span').html();
		rangeInit(name);
	}	
}
function submitEval(){
	var colors=['red','lblue','green','yellow','purple','rose','primary'];
	var evalName=$('#eval-name').val();
	if(evalName==""){
		$('#msg').css('color','red');
		$('#msg').html('名称不能为空');
		return;
	}
	var evalLevel=$('#eval-level').val();
	var index=Math.floor(Math.random()*7);
	var newItem=document.createElement('div');
	newItem.setAttribute('class','ui-item clearfix');
	newItem.innerHTML='<div class="pro-item clearfix">'
      //             +'<h3 class="bg-'+colors[index]+'"><a href="#">'+evalName
				  // +'</a></h3>'
                  +'<div class="pro-content">'
                   + evalName +'<h4 class="bg-'+colors[index]+'"  data-valuemax="'+evalLevel+'" ><span></span></h4>'					
                   +'</div>'
                +'</div>'
                +'<div class="actions">'
				   +'<input type="number" step="10" max="100" min="0" value="50"> '
                   +'<a href="#" class="done"  onClick="javascript:editItem()"><i class="fa fa-pencil"></i></a> '
                   +'<a href="#" class="trash" onClick="javascript:delItem()"><i class="fa fa-trash"></i></a>'
                +'</div>';
	
               
	$('.ui-172 .ui-content').append(newItem);
	proInit();
	trash();
	pencil();
	$("#message-modal-dialog").modal('hide');
}
//检索
function inputSearch(){
	$('.ui-list form').fadeToggle(200);
}
//监听等级条度百分比变化
/*function OnInput(event){
	$('#eval-show').html(event.target.value+'%');
}*/

function OnPropChanged(event){
	console.log(event)
}