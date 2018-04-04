// JavaScript Document
function init(){
	
}

function closePrompt(){
	closeMessage();
}
//收藏
function addFavorate(index){
	$(index).children('i').attr('class','fa fa-star').css('color','#FFDF00');
	$(index).attr('onClick','javascript:cancelFavorate(this)');
}
//取消收藏
function cancelFavorate(index){
	var str=$(index).siblings('a').children('i').attr('class');
	str=str.substr(str.indexOf('e')+1);
	$(index).children('i').attr('class','fa fa-star-o '+str);
	$(index).attr('onClick','javascript:addFavorate(this)');
}
//分享
function addShare(){
	var str='<p>分享理由：</p>'
		+'<form>'
		+'<textarea class="form-control" style="resize:vertical">O(∩_∩)O分享一个岗位给大家~</textarea><p></p>'
		+'<a href="javascript:submitShare();" class="btn btn-success">确认</a>'
		+ '&nbsp;&nbsp;'
		+ '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>'
		+'</form>';
	showMessage(str);
}
function submitShare(){
	showMessage('分享成功');	
}