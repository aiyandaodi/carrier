// JavaScript Document
// JavaScript Document
function init(){

    /**  **/
    if(typeof popmenu_start == "function"){
        popmenu_start();
    }

    /**  **/
    //showMessage("t="+typeof isTouchScreenDevice );
    if(typeof isTouchScreenDevice == "function"){
        isTouchScreenDevice();
    }

    /****/
    addCnzzYmeng();
    addBaiduTongji();
}


function promptAdd(){
    var str='<a href="javascript:submitAdd();" class="btn btn-success">确认</a>'
        + '&nbsp;&nbsp;'
        + '<a href="javascript:closePrompt();" class="btn btn-primary">返回</a>';

    showMessage(str);
}

function submitAdd(){
    alert("ok");
}
function closePrompt(){
    window.open('read.html');
}