/***************************************************************************************************
 * 说明：
 *   该JS文件用于使用macadmin-5.0样式生成的页面的基本操作。
 * 要求：
 *   需要HTML页面包含id="waiting_modal_dialog"标签的等待图层。
 *   需要加载 common.js
 *-------------------------------------------------------------------------------------------------
 * 公共函数：
 *     function tek.macCommon.waitDialogShow(title, body, timer, isAutoClose); - 等待图层显示
 *     function tek.macCommon.waitDialogHide(time); - 等待图层隐藏
 *     function tek.macCommon.waitDialogOn(eventType, eventCallback); - 等待图层注入响应事件
 *     function tek.macCommon.commonAjax(params); - 通用AJAX操作（所有与TekInfo服务器交互的通用方式，都通过该函数执行）
 ***************************************************************************************************/

(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义 mac-common.js 中相关的参数、函数
    tek.macCommon  = {};
    (function (macCommon) {
        /**
         * 等待图层（bootstrap的模态框）显示 （模态框ID="waiting_modal_dialog"）
         * @param {String} [title] head中标题
         * @param {String} [body] body中信息
         * @param {String} [timer] timer中倒计时信息（计时数字标签id='counter'，如：<font id='counter' color='red'>3</font>）
         * @param {Number} [isAutoClose] 是否点击灰框关闭，默认0，取值[0,1,2]：0-自动关闭，1-提示关闭，2-禁止关闭
         */
        macCommon.waitDialogShow = function (title, body, timer, isAutoClose) {
            if (title)
                $("#waiting-modal-dialog-title").html(title);

            if (body)
                $("#waiting-modal-dialog-body").html(body);

			if (timer)
            	$("#waiting-modal-dialog-timer").html(timer);

            var val = parseInt(isAutoClose);
            val = (isFinite(val) && (val === 0 || val === 1 || val === 2)) ? val : 0;

            var $wait = $("#waiting-modal-dialog");
            $wait.modal("show", null, val);
        };

        /**
         * 等待图层（bootstrap的模态框）隐藏 （模态框ID="waiting_modal_dialog"）
         * 如果id="counter"存在，显示倒计时秒数
         * @param {Number} [time] 延迟隐藏毫秒时间（省略或非数字，立即隐藏）
         * @param {String} [statement] 倒计时结束时执行的语句，可以为空
         */
        macCommon.waitDialogHide = function (time, statement) {
            if (!$("#waiting-modal-dialog").length)
                return;

            var dialogHide = function () {
                $("#waiting-modal-dialog").modal("hide");
                $("#waiting-modal-dialog-title").html("&nbsp");
                $("#waiting-modal-dialog-body").empty();
                $("#waiting-modal-dialog-timer").empty();

                if (statement)
                    eval(statement);
            };

            time = parseInt(time);
            if (isFinite(time) && time > 0) {
                if ($("#counter").length) {
                    var timing = function (seconds) {
                        $("#counter").html(seconds);
                        if (seconds > 0) {
                            setTimeout(timing, 1000, --seconds);
                        } else {
                            setTimeout(dialogHide, 200);
                        }
                    };
                    timing(parseInt(time / 1000));
                } else {
                    setTimeout(dialogHide, time);
                }
            } else {
                dialogHide();
            }
        };

        /**
         * 等待图层（bootstrap的模态框）注入响应事件 （模态框ID="waiting_modal_dialog"）
         * @param {String} eventType 事件类型，支出参数如下：
         *          'show' - show() 方法调用之后立即触发该事件
         *          'shown' - 此事件在模态框已经显示出来（并且同时在 CSS 过渡效果完成）之后被触发
         *          'hide' - hide() 方法调用之后立即触发该事件
         *          'hidden' - 此事件在模态框被隐藏（并且同时在 CSS 过渡效果完成）之后被触发
         * @param {Function} eventCallback 响应事件的回调函数，传入 event 对象
         */
        macCommon.waitDialogOn = function (eventType, eventCallback) {
            if ((eventType === 'show' || eventType === 'shown' ||eventType === 'hide' ||eventType === 'hidden') && typeof eventCallback == 'function')

                $('#waiting_modal_dialog').on(eventType + '.bs.modal', function (event) {
                    eventCallback(event);
                });
        };

        /**
         * AJAX操作（所有与TekInfo服务器交互，都通过该函数执行）
         * 操作流程：
         *      1、显示等待信息；
         *      2、调用tek.common.ajax函数访问服务器；
         *      3、如果操作错误，提示错误信息；
         *      4、执行自定义操作。
         * @param {String} url ajax访问地址。（不能为空）
         * @param {Object} setting 设置（可以为null，这时采用默认设置）
         *          setting["async"] - 是否异步。true或false。（默认为true）
         *          setting["type"] - 访问方式。post或get。（默认为post）
         *          setting["dataType"] - 数据类型。xml、html、json、jsonp、text等。（默认json）
         *          setting["operateType"] - 操作类型。字符串，方便获知何种操作（默认为""）
         * @param {Object} sendData 要提交的数据
         * @param {Object} callback 回调函数
         *          callback["beforeSend"] - 发送之前回调函数
         *          callback["success"] - 执行成功回调
         *          callback["error"] - 执行失败回调
         *          callback["complete"] - 执行完成后，最后回调
         */
        macCommon.commonAjax = function (url, setting, sendData, callback) {
            if (!url || typeof sendData != "object" || typeof callback != "object")
                return;

            var html = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在操作...";
            macCommon.waitDialogShow(null, html, null, 2);

            var fs = callback["success"];
            callback["success"] = function (data) {
                if (typeof(fs) == "function") {
                    // 自定义执行函数
                    fs(data);
                } else {
                    $("#waiting_modal_dialog").modal("hide");
                }
            };

            var es = callback["error"];
            callback["error"] = function (data, message) {
                if (typeof es == "function") {
                    // 自定义执行函数
                    es(data, message);
                } else {
                    if (typeof params["appendError"] == "function")
                        params["appendError"](data);
                    macCommon.waitDialogShow(null, message, null);
                }
            };

            tek.common.ajax(url, setting, sendData, callback);
        };

    })(tek.macCommon);

})();


//======================================================================================================================
//==========================注意：下面的代码为了兼容现有的函数调用暂时保留，后期修改完成后删除======================================
//================这个方法时旧版本的 tek.macCommon.commonAjax(); --改--> tek.macCommon.commonAjax2(); ======================
//======================================================================================================================

// 通用AJAX操作（所有与TekInfo服务器交互的通用方式，都通过该函数执行）
// 操作流程：
//     1、显示等待信息；
//     2、调用tek.common.ajax函数访问服务器；
//     3、如果操作错误，提示错误信息；
//     4、执行自定义操作。
// params - 参数。
//          params["async"] - 是否异步。true或false。（默认为true）
//          params["type"] - 访问方式。post或get。（默认为post）
//          params["url"] - ajax访问地址。（不能为空）
//          params["params"] - 传递参数
//          params["success"] - 自定义返回data.code==0时调用的函数。function(data)，需要手动调用$("#waiting-modal-dialog").modal("hide");关闭弹出框（如果为空，执行默认操作）
//          params["error"] - 自定义返回data.code==0之外的情况时调用的函数。function(data,message)，需要手动调用$("#waiting-modal-dialog").modal("hide");关闭弹出框（如果为空，执行默认操作）
//          params["appendError"] - 自定义返回data.code==0之外的情况时，默认操作执行后调用的函数。function(data)（可以为空）
//          params["message"] - 提示信息前缀（如果为空，默认显示“操作成功”、“操作失败”、“操作错误”）
tek.macCommon.commonAjax2=function(params) {
  if (typeof(params)!="object")
    return;

  var html = "<img src='"+tek.common.getRelativePath()+"http/images/waiting-small.gif' width='16'/>  正在操作...";
    tek.macCommon.waitDialogShow(null, html, null, 2);

  var fs=params["success"];
  params["success"]=function(data) {
      if(typeof(fs)=="function") {
        // 自定义执行函数
        fs(data);
      } else {
        $("#waiting-modal-dialog").modal("hide");
      }
  };
  
  var es=params["error"];
  params["error"]=function(data,message) {
      if(typeof(es)=="function") {
        // 自定义执行函数
        es(data,message);
      } else {
        if(typeof(params["appendError"])=="function")
          params["appendError"](data);
          tek.macCommon.waitDialogShow(null, message, null, 2);
      }
  },
  
  tek.common.ajax2(params);
}
