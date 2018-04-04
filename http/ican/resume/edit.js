var winWidth = 0;
var CHANGE_WIDTH=768;

function init(){
	
    getWidth();
    if(winWidth < CHANGE_WIDTH){
        $('#summernote_phone').summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            lang:'zh-CN',
            focus: true,
            airMode: true
        });
    }else {
        $('#summernote_pc').summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            lang: 'zh-CN',
            focus: true                  // set focus to editable area after initializing summernote
        });
    }
	noteInit();
}

function getWidth(){
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if(winWidth < CHANGE_WIDTH){
        $('#pc').hide();
        $('#phone').show();
        $('#summernote_phone').summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            lang:'zh-CN',
            focus: true,
            airMode: true
        });
    }else{
        $('#pc').show();
        $('#phone').hide();
    }
}
window.onresize = getWidth;
function submitDocument(){
	alert("提交！");
	goBack();
}
function goBack(){
	window.location.href='read.html';
}
function noteInit(){
	var str='本人性格开朗，为人细心，做事一丝不苟，能吃苦耐劳，工作脚踏实地，有较强的责任心，具有团队合作精神，又具有较强的独立工作能力，思维活跃。能熟练运用Windows Office Word、Excel、XXX等应用软件，能根据XXX的需求，完成面XXXX工作，具备良好的XXXX意识，极强的沟通能力与谈判能力；在XXXX中提出专业的意见和产品及供应商资讯，提出可行性方案建议，跟进解决XXXX问题；具备团队协作精神，有责任心、人品好、思想端正；具备一定的文件管理能';
	$('.note-editable,#summernote_phone .note-editable p').html(str);
}