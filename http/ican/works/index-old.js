// JavaScript Document
function init(){

    /** ���뵯���˵� **/
    if(typeof popmenu_start == "function"){
        popmenu_start();
    }

    /** ���봥���¼� **/
    //showMessage("t="+typeof isTouchScreenDevice );
    if(typeof isTouchScreenDevice == "function"){
        isTouchScreenDevice();
    }

    /**����ͳ�ƴ���**/
    addCnzzYmeng();
    addBaiduTongji();
    addWidgetOperation();
}
