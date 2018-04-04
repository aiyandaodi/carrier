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
}





