// JavaScript Document

var showClose;    // 是否关闭
var callbackURL;    // 回调地址
var updateOpener;    //是否刷新父页面

var accountID;
var myID;

function init() {
    $("#index_link").attr({"onclick":"goHome()","href":"javascript:;"});
    $("#site-location").html("登录密码");
    setPageName("修改密码");
    document.title = "修改密码";

    showClose = request["show-close"];
    if (showClose
            && (showClose == 1 || showClose == true))
        showClose = 1;
    else
        showClose = 0;

    callbackURL = request["callback-url"];
    if (callbackURL)
        callbackURL = decodeURIComponent(callbackURL);

    updateOpener = request["refresh-opener"];
    if (updateOpener
            && (updateOpener == 1 || updateOpener == true))
        updateOpener = 1;
    else
        updateOpener = 0;

    accountID = request["account_id"];
    myID = request["my"];

    tek.macEdit.initialDefaultButton("btn");
    getEditInfo();
}

//取得可修改字段
function getEditInfo()
{
    var param={};
    param["objectName"]="Account";
    param["action"]="getEdit";
    param["command"] = "password";
    if(accountID)
        param["account_id"]=accountID;
    if(myID)
        param["my"]=myID;
    $.ajax({
        type: "post",
        url: tek.common.getRootPath()+"servlet/account",
        dataType: "json",
        data: param,
        success: function(data){
            if (data.code==0){
                var record = data["record"];
                if((data.right&8)==8)  //有修改权限
                {
                    document.getElementById("outter").style.display = "block";
                }else{
                    tek.macCommon.waitDialogShow(null, "没有修改权限!", null, 2);
                    tek.macCommon.waitDialogHide(3000, "window.close()");
                    /*
                    $("#waiting-modal-dialog").modal("show",null,2);
                    waitingMessage("没有修改权限!");
                    timeCounting();*/
                }//end for record.right
            }else{
                //$("#waiting-modal-dialog").modal("show",null,2);
                /*
                var error=new StringBuffer();
                error.append(data.code);
                error.append(" - ");
                error.append(tek.dataUtility.stringToHTML(data.message));*/
                var error='';
                error+=data.code+' - '+tek.dataUtility.stringToHTML(data.message);
                tek.macCommon.waitDialogShow(null, error);
                tek.macCommon.waitDialogHide(3000);
                /*
                waitingMessage(error.toString());
                timeCounting();*/
            }//end for if (data.code==0)
        },
        error: function(request){
            //$("#waiting-modal-dialog").modal("show",null,2);
            var error=new StringBuffer();
            error.append("取得修改密码定义失败![");
            error.append(request.status);
            error.append(" - ");
            error.append(request.response);
            error.append("]");

            tek.macCommon.waitDialogShow(null,error, null, 2);
            tek.macCommon.waitDialogHide(3000);
            //tek.macCommon.waitDialogHide(3000, "window.close()");
            /*
            waitingMessage(error.toString());
            timeCounting();*/
        }
    });
}

//验证密码强度
function verifyPasswordStrong(input)
{
    $("#weak,#normal,#strong").css("background","#dde1df");
    var modes = 0;
    var inputString = input.value;
    var inputLen = input.value.length;
    var flag = 0;
    if (/\d/.test(inputString)) modes++; //数字
    if (/[a-z]/.test(inputString)||/[A-Z]/.test(input.value)) modes++; //小写
    if (/\W/.test(inputString)) modes++; //特殊字符

    if (inputLen > 8){
        if (inputLen > 10){
            if (modes>= 3)
            {
                flag = 1;
                $("#strong").css("background","#00EE00");//强密码00EE00
            }
            else
            {
                flag = 1;
                $("#normal").css("background","#EEAD0E");//中密码
            }
        }else {
            if (modes >= 3)
            {
                flag = 1;
                $("#normal").css("background","#EEAD0E");//中密码;
            }
        }//end for if (inputLen > 10)
    }else{
        if(modes >= 3)
        {
            flag = 1;
            $("#normal").css("background","#EEAD0E");//中密码;
        }
    }


    if(!flag)
    {
        $("#weak").css("background","#f87d7d");//弱密码
    }
    if(inputString == "")
    {
        $("#weak,#normal,#strong").css("background","#dde1df");
    }
}

function registerSafe(){
    var form = document.getElementById("register_form");
    if(!form){
        tek.macCommon.waitDialogShow(null,'页面设置有误,请和管理员联系', null, 2);
        tek.macCommon.waitDialogHide(3000);
        return;
    }

    var safePasswordText = form.pwd.value;
    var newpasswordText = form.password.value;
    var repasswordText = form.repassword.value;

    $("#pwdmessage").html("");
    if(!safePasswordText && safePasswordText == ""){
        $("#pwdmessage").html("请输入原密码！");
        $("#pwd").focus();
        $("#pwd").select();
        return;
    }

    if(!newpasswordText && newpasswordText == ""){
        $("#pwdmessage").html("请输入新密码！");
        $("#password").focus();
        $("#password").select();
        return;
    } else if(newpasswordText.length < 6 || newpasswordText.length > 24) {
        $("#pwdmessage").html("密码长度必须为6-24位！");
        $("#password").focus();
        $("#password").select();
        return;
    }

    if(!repasswordText && repasswordText == "") {
        $("#pwdmessage").html("请再次输入新密码！");
        $("#repassword").focus();
        $("#repassword").select();
        return;
    }else if(newpasswordText != repasswordText) {
        $("#pwdmessage").html("两次填写的密码不一致，请重新输入！");
        $("#repassword").focus();
        $("#repassword").select();
        return;
    }

    var warningstring = tek.dataUtility.isCertificatePassword(newpasswordText);
    if(warningstring == null){
        $("#pwdmessage").html("");
        submitPasswordInfo(safePasswordText,newpasswordText,repasswordText);
    }else
        $("#pwdmessage").html(warningstring);
}

//修改登录密码后提交数据
function submitPasswordInfo(safePasswordText,newpasswordText,repasswordText){
    //显示等待图层
    var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>  正在提交...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

    var mydata={};
    mydata["objectName"]="Account";
    mydata["action"]="setInfo";
    mydata["command"]="password";
    if(accountID)
        mydata["account_id"]=accountID;
    if(myID)
        mydata["my"]=myID;
    mydata["account_old"]=encodeURI(safePasswordText);//加encodeURI进行编码是为了给%等特殊字符转义
    mydata["account_password"]=encodeURI(newpasswordText);
    mydata["account_confirm"]=encodeURI(repasswordText);

    $.ajax({
        type: "post",
        url: tek.common.getRootPath()+"servlet/account",
        dataType: "json",
        data:mydata,
        success: function(data){
            if(data) {
                if (data.code==0) {
                    // 操作成功
                    if(updateOpener==1){
                        // 刷新父页面
                        tek.refresh.RefreshOpener();
                    }

                    if(showClose==1){
                        // 关闭
                        var timerMsg='';
                        timerMsg+="页面<font id='counter' color='red'></font>秒后自动关闭";
                        tek.macCommon.waitDialogShow('修改成功!',timerMsg, null, 2);
                        tek.macCommon.waitDialogHide(3000,'window.close()');
                        /*
                        var timerMsg=new StringBuffer();
                        timerMsg.append("页面<font id='counter' color='red'>");
                        timerMsg.append("</font>秒后自动关闭");
                        waitingMessage("修改成功!", timerMsg.toString());
                        timeCounting("window.close()");*/

                    } else if(callbackURL&&callbackURL.length>0) {
                        // 跳转
                        var timerMsg='';
                        timerMsg+="页面<font id='counter' color='red'></font>秒后自动跳转";
                        tek.macCommon.waitDialogShow('修改成功!',timerMsg, null, 2);
                        tek.macCommon.waitDialogHide(3000,"location.href='"+callbackURL+"';");
                        /*
                        var timerMsg=new StringBuffer();
                        timerMsg.append("页面<font id='counter' color='red'>");
                        timerMsg.append("</font>秒后自动跳转");
                        waitingMessage("修改成功!", timerMsg.toString());
                        timeCounting("location.href='"+callbackURL+"';");*/

                    } else {
                        var timerMsg='';
                        timerMsg+="页面<font id='counter' color='red'></font>秒后自动关闭";
                        tek.macCommon.waitDialogShow('修改成功!',timerMsg, null, 2);
                        tek.macCommon.waitDialogHide(3000);
                        /*
                        tek.macCommon.waitDialogShow('修改成功!','', null, 2);
                        tek.macCommon.waitDialogHide(3000);*/
                    }

                } else {
                    // 操作错误
                    var error='';
                    error+="<font color='red'>"+data.code+" - "+tek.dataUtility.stringToHTML(data.message)+"</font>";
                    tek.macCommon.waitDialogShow(null,error.toString(), null, 2);
                    tek.macCommon.waitDialogHide(3000);
                    /*
                    var error=new StringBuffer();
                    error.append("<font color='red'>");
                    error.append(data.code);
                    error.append(" - ");
                    error.append(stringToHTML(data.message));
                    error.append("</font>");
                    waitingMessage(error.toString());
                    timeCounting();*/
                }
            } else {
                tek.macCommon.waitDialogShow("<font color='red'>操作失败![data=null]</font>",null, null, 2);
                tek.macCommon.waitDialogHide(3000);
                /*
                waitingMessage("<font color='red'>操作失败![data=null]</font>");
                timeCounting();*/
            }
        },
        error: function(request) {
            var error='';
            error+="<font color='red'>修改失败!["+request.status+" - "+request.response+"]"+"</font>";
            tek.macCommon.waitDialogShow(null,error, null, 2);
            tek.macCommon.waitDialogHide(3000);

            /*
            var error=new StringBuffer();
            error.append("<font color='red'>");
            error.append("修改失败![");
            error.append(request.status);
            error.append(" - ");
            error.append(request.response);
            error.append("]");
            error.append("</font>");
            waitingMessage(error.toString());
            timeCounting();*/
        }
    });
}