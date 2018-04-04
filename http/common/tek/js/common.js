/***************************************************************************************************
 * 说明：
 *   该JS文件实现常用的操作。
 * 要求：
 *   需要加载 jQuery.js、tool.js、dataUtility.js
 *-------------------------------------------------------------------------------------------------
 * window. 全局公共变量（参数）：
 *     myId; - 当前用户标识。
 *     myLogin; - 当前用户登录名
 *     myName; -  当前用户名
 *     myToken; - 当前用户授权码
 *     mySecurity; - 当前用户安全等级
 *     myRole; - 当前用户角色
 *     myType; - 当前用户类别
 *     myLatestedTime; - 当前用户最近一次登录时间
 *     myLatestedIp; - 当前用户最近一次登录IP
 *     myLoginTime; - 当前用户登录时间
 *     myLoginIp; - 当前用户登录IP
 *     myIcon; - 当前用户头像
 *     myCharset; - 当前语言
 *-------------------------------------------------------------------------------------------------
 * tek.common 公共函数：
 *     function tek.common.addFavorite(title, url); - 收藏。
 *     function tek.common.ajax(url, setting, sendData, callback); - AJAX操作。（所有与TekInfo服务器交互，都通过该函数执行）。
 *     function tek.common.appendRandomParam(url); - 在URL后面增加随机参数，保证浏览器不使用缓存页面。
 *     function tek.common.appendRequestParams(url,except); - 在url后面，追加request中的全部参数。
 *     function tek.common.appendURLParam(url, key, value); - 在url后面追加参数。
 *     function tek.common.baiduSearch(); - Baidu站内搜索。
 *     function tek.common.bingSearch(); - Bing站内搜索。
 *     function tek.common.callbackWithConfirm(callbackURL); - 返回到指定页面，在返回前确认。
 *     function tek.common.callPage(callUrl,callBackUrl); - 跳转到指定页面。
 *     function tek.common.closeWithConfirm(refreshFrame, charset); - 关闭当前页面，在关闭前确认。
 *     function tek.common.createForm(formId, charset); - 创建Form元素，并添加到body节点下。
 *     function tek.common.enforceProtocol(protocol); - 强制使用指定协议和端口访问（如果当前协议不是指定的协议，重定义指定的协议访问）。
 *     function tek.common.getBrowser(); - 取得浏览器类型版本对象。
 *     function tek.common.getDesignPx(pxl); - 根据屏幕比例，取得的点阵对应设计时需要的大小。
 *     function tek.common.getIframeScrollHeight(iframeElem); - 取得指定IFrame的自适应高度。
 *     function tek.common.getIpLocation(ip); - 取得指定IP所在地。
 *     function tek.common.getLanguage(); - 取得当前浏览器使用语言。
 *     function tek.common.getRealPx(pxl); - 根据屏幕比例，取得实际设置的点阵。
 *     function tek.common.getRelativePath(); - 取得当前页面相对于工程目录的相对路径。
 *     function tek.common.getRequest(); - 取得页面传递参数。（一般情况下，直接使用request参数即可）。
 *     function tek.common.getRequestParam(key,request,param); - 从request中查找指定参数，加入param中。
 *     function tek.common.getRequestParams(key,request,param,isObject); - 从request中查找指定参数，加入param中。
 *     function tek.common.getRequestString(); - 取得?后面的参数。
 *     function tek.common.getRootPath(); - 取得根URL（包含工程名）。
 *     function tek.common.getSerializeObjectParameters(id); - 取得串行化参数。
 *     function tek.common.getSerializeStringParameters(id); - 取得串行化参数。
 *     function tek.common.getTimeString(); - 返回当前时间（不包括日期）。
 *     function tek.common.getUser(errorFunc); - 取得当前用户的信息。
 *     function tek.common.getUserAgent(); - 取得浏览器类型。
 *     function tek.common.googleSearch(); - Google站内搜索。
 *     function tek.common.ipassLogin(); - 跳转到诠证通(ipass)系统登录。
 *     function tek.common.ipassRegister(callBackUrl); - 跳转到诠证通(ipass)系统注册。
 *     function tek.common.isIE(); - 当前浏览器是否是IE。
 *     function tek.common.isLoggedIn(); - 判断用户是否已经登录。
 *     function tek.common.isShowArea(area); - 判断给定id的控件是否在页面可视区域。
 *     function tek.common.logout(returnPage, errorFunc); - 注销当前用户。
 *     function tek.common.numberOnly(evt); - 判断键盘敲击键，必须是数字。
 *     function tek.common.sogouSearch(); - Sougou站内搜索。
 *     function tek.common.winClose(refreshFrame, charset); - 关闭当前页面（或窗口）。
 *-------------------------------------------------------------------------------------------------
 * 页面可选自定义方法：
 *     function tek.common.customGetUserSuccess(data);; - 自定义tek.common.getUser函数执行AJAX成功后，扩展处理。
 ***************************************************************************************************/

// 不推荐使用，后续版本删除
function StringBuffer() {
    this.__strings__ = "";
}

// 不推荐使用，后续版本删除
StringBuffer.prototype.append = function (str) {
    if ((str && str != 'undefined') || str == 0)
        this.__strings__ += str;
};

// 不推荐使用，后续版本删除
StringBuffer.prototype.toString = function () {
    return this.__strings__;
};

//判断给定字符串是否以str开始
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) === str;
    };
}

//判断给定字符串是否以str结束
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        return this.slice(-str.length) === str;
    };
}

//----------------------------------------------------------------------------------------------
(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义全局变量
    window.myId = null;
    window.myName = null;
    window.myLogin = null;
    window.myToken = null;
    window.mySecurity = null;
    window.myRole = null;
    window.myType = null;
    window.myLatestedTime = null;
    window.myLatestedIp = null;
    window.myLoginTime = null;
    window.myLoginIp = null;
    window.myIcon = null;
    window.myCharset = null;

    // 定义 common.js 中相关的参数、函数
    tek.common = {};
    (function (common) {
		
		 /**
         * 取得统一认证指定页面的URL
		 * @param {String} name - 参数名
         * @returns {String} 返回URL。
         */
        common.getAuthUrl = function (name) {
			var url;
			
			var ajaxURL=common.getRootPath()+"servlet/sys";
            var setting = {
				async: false
			};
            var sendData = {
                action: "getAuthUrl",
				"name": name,
            };
            
            var callback = {
                success: function (data) {
                    if(data)
                        url=data.value;
                },
	            error: function (data,message) {
                }
            };
            
            tek.common.ajax(ajaxURL, setting, sendData, callback);
			
			return url;
        }
		
        // 测试浏览器的发行版本
        var Browser = null;

        /**
         * 获取浏览器类型和版本
         * @returns {Object|null}
         */
        common.getBrowser = function () {
            if (!Browser) {
                Browser = {};
                var sAgent = navigator.userAgent.toLowerCase();
                var s;
                (s = sAgent.match(/rv:([\d.]+)\) like gecko/)) ? Browser.ie = s[1] :
                    (s = sAgent.match(/msie ([\d.]+)/)) ? Browser.ie = s[1] :
                        (s = sAgent.match(/edge\/([\d.]+)/)) ? Browser.edge = s[1] :
                            (s = sAgent.match(/firefox\/([\d.]+)/)) ? Browser.firefox = s[1] :
                                (s = sAgent.match(/chrome\/([\d.]+)/)) ? Browser.chrome = s[1] :
                                    (s = sAgent.match(/opera.([\d.]+)/)) ? Browser.opera = s[1] :
                                        (s = sAgent.match(/android.([\d.]+)/)) ? Browser.android = s[1] :
                                            (s = sAgent.match(/iphone.([\d.]+)/)) ? Browser.iphone = s[1] :
                                                (s = sAgent.match(/ipad.([\d.]+)/)) ? Browser.ipad = s[1] :
                                                    (s = sAgent.match(/version\/([\d.]+).*safari/)) ? Browser.safari = s[1] : 0;

                //以下进行测试
                /**
                 if(Browser.ie) document.write('IE: '+Browser.ie);
                 if(Browser.firefox) document.write('Firefox: '+Browser.firefox);
                 if(Browser.chrome) document.write('Chrome: '+Browser.chrome);
                 if(Browser.opera) document.write('Opera: '+Browser.opera);
                 if(Browser.safari) document.write('Safari: '+Browser.safari);
                 if(Browser.android) document.write('Android: '+Browser.android);
                 if(Browser.iphone) document.write('iPhone: '+Browser.iphone);
                 if(Browser.ipad) document.write('iPad: '+Browser.ipad);
                 **/
            }
            return Browser;
        };

        /**
         * 取得浏览器类型 ******************************************** 未使用
         * @return {Object} 浏览器类型，obj["explorer-type"]
         */
        common.getUserAgent = function () {
            var obj = {};
            var ua = navigator.userAgent.toLowerCase();

            var array = ua.match(/msie ([\d.]+)/);
            if (array && array.length > 0)
                obj["explorer-type"] = "IE";
            else {
                array = ua.match(/firefox\/([\d.]+)/);
                if (array && array.length > 0)
                    obj["explorer-type"] = "Firefox";
                else {
                    array = ua.match(/chrome\/([\d.]+)/);
                    if (array && array.length >= 2)
                        obj["explorer-type"] = "Chrome";
                    else {
                        array = ua.match(/opera\/([\d.]+)/);
                        if (array && array.length >= 2)
                            obj["explorer-type"] = "Opera";
                        else {
                            array = ua.match(/version\/([\d.]+)/);
                            if (array && array.length >= 2)
                                obj["explorer-type"] = "Safari";
                        } // end if(array && array.length>=2) else
                    } // end if(array && array.length>=2) else
                } // end if(array && array.length>0) else
            } // end if(array && array.length>0) else

            return obj;
        };

        /**
         * 判断是否是IE浏览器
         * @returns {boolean}
         */
        common.isIE = function () {
            return !!window.ActiveXObject || "ActiveXObject" in window;
        };

        /**
         * 获取浏览器使用的语言
         * @returns {String}
         */
        common.getLanguage = function () {
            if (navigator.browserLanguage)
                return navigator.browserLanguage.toLowerCase();
            else if (navigator.language)
                return navigator.language.toLowerCase();
            else if (navigator.systemLanguage)
                return navigator.systemLanguage.toLowerCase();
            else
                return "en";
        };

        /**
         * 从request中查找指定参数，加入param中
         * @param {String|Array} key - 匹配的参数键字符串或数组（如果参数键以“_”结束，表示以该字符串开头的参数键）
         * @param {Object} request - 地址栏参数，如果为空，自动调用GetRequest()方法
         * @param {Object|null} param - 原参数对象或URL字符串（如为空，自动创建参数对象返回）
         * @param {Boolean} isObject - 如果为true，自动加入“createTime”、“createIp”、“modifyTime”、“modifyIp”、“accessTime”、“accessIp”、“accessCount”关键字作为检索条件
         * @returns {Object} 返回检索后的参数对象或URL字符串。
         */
        common.getRequestParams = function (key, request, param, isObject) {
            if (!param)
                param = {};

            if (isObject) {
                if (!(key instanceof Array)) {
                    if (typeof(key) == "string") {
                        var arr = [];
                        arr.push(key);
                        key = arr;
                    } else
                        key = [];
                }

                key.push("createTime");
                key.push("createIp");
                key.push("modifyTime");
                key.push("modifyIp");
                key.push("accessTime");
                key.push("accessIp");
                key.push("accessCount");
            }

            if (typeof(key) == "string") {
                // 字符串
                param = common.getRequestParam(key, request, param);
            } else if (key instanceof Array) {
                for (var i in key) {
                    param = common.getRequestParam(key[i], request, param);
                }
            }

            return param;
        };

        /**
         * 从request中查找指定参数，加入param中
         * @param {String} key - 匹配的参数键字符串（如果参数键以“_”结束，表示以该字符串开头的参数键）
         * @param {Object} request - 地址栏参数，如果为空，自动调用GetRequest()方法
         * @param {Object|null} param - 原参数对象（如为空，自动创建参数对象返回）
         * @returns {Object} 返回检索后的参数对象。
         */
        common.getRequestParam = function (key, request, param) {
            if (!param)
                param = {};

            if (typeof(key) == "string") {
                // 字符串
                var flag = false;    // 是否模糊查询
                if (key.substring(key.length - 1) == "_")
                    flag = true;

                for (var name in request) {
                    if (flag) {
                        // 以“_”结尾，模糊查询
                        if (name.indexOf(key) == 0) {
                            if (typeof(param) == "string")
                                param = common.appendURLParam(param, name, request[name]);
                            else
                                param[name] = request[name];
                        }
                    } else {
                        if (name == key) {
                            if (typeof(param) == "string")
                                param = common.appendURLParam(param, name, request[name]);
                            else
                                param[name] = request[name];
                            break;
                        }
                    }
                } // end for(var name in request)
            } // end if(typeof(key)=="string")

            return param;
        };

        /**
         * 在url后面，追加request中的全部参数
         *
         * @param {String} url URL地址
         * @param {Array|String} except 排除的参数键数组（或字符串）
         */
        common.appendRequestParams = function (url, except) {
            if (!url)
                return;

            if (!window.request)
                window.request = common.getRequest();

            if (request) {
                for (var key in request) {
                    if (except) {
                        if ((typeof except) == "String") {
                            if (key == except)
                                continue;

                        } else {
                            for (var i in except) {
                                if (key == except[i])
                                    continue;
                            }
                        }
                    }

                    url = common.appendURLParam(url, key, request[key]);
                } // end for (var key in request)
            } // end if(request)

            return url;
        };

        /**
         * 在url后面追加参数
         *
         * @param {String} url URL地址
         * @param {String} key 追加的参数名
         * @param {Any} value 追加的参数值（未编码的）
         * @return {String} 返回追加后的URL字符串
         */
        common.appendURLParam = function (url, key, value) {
            if (!url || !key || key.length <= 0)
                return url;

            var str = url;

            var loc = url.lastIndexOf("?");
            if (loc >= 0) {
                if (loc < url.length - 1)
                    str += "&";
            } else {
                str += "?";
            }
            str += key + "=" + encodeURI(encodeURI(value));

            return str;
        };

        /**
         * AJAX操作（所有与TekInfo服务器交互，都通过该函数执行）
         * @param {String} url ajax访问地址。（不能为空）
         * @param {Object} setting 设置（可以为null，这时采用默认设置）
         *          setting["async"] - 是否异步。true或false。（默认为true）
         *          setting["type"] - 访问方式。post或get。（默认为post）
         *          setting["dataType"] - 数据类型。xml、html、json、jsonp、text等。（默认json）
         *          setting["operateType"] - 操作类型。字符串，方便获知何种操作（默认为""）
		 *          setting["debug-id"] - 单元测试id值
         * @param {Object} sendData 要提交的数据
         * @param {Object} callback 回调函数
         *          callback["beforeSend"] - 发送之前回调函数
         *          callback["success"] - 执行成功回调
         *          callback["error"] - 执行失败回调
         *          callback["complete"] - 执行完成后，最后回调
		 * @param {String} debug 测试内容
		 *          "waiting" - 加载页面的等待信息
		 *          "error" - ajax返回error
		 *          "code-error" - ajax返回data.code不为0
		 *          "record-0" - ajax返回没有数据（record）
		 *          "record-1" - ajax返回只有一条数据（record）
		 *          "field-null" - ajax返回field为空
		 *          "field-chinese" - ajax返回field值为中文
		 *          "field-html" - ajax返回field值包含HTML字符串
		 *          "field-newline" - ajax返回field值包含换行
		 *          "default" - 默认赋值
		 * @param {String} debug-id 测试与setting["debug-id"]值相同的AJAX操作
         */
        common.ajax = function (url, setting, sendData, callback) {
            if (!url || typeof(sendData) != "object" || typeof(callback) != "object")
                return console.error("tek.common.ajax() 传入的参数不完整！");

            var async = true, type = "post", dataType = "json";
            var operateType = "";
            if (setting && typeof(setting) == "object") {
                async = (setting["async"] == false || setting["async"] == "false") ? false : async;
                type = setting["type"] || type;
                dataType = setting["dataType"] || dataType;
                operateType = !!setting["operateType"] ? setting["operateType"] + "：" : operateType;
            }

            /***************** debug start *********************/
            var debug;
            if(setting && setting["nodebug"]!=1 && typeof(request)=="object" && request != null) {
              var debugId=request["debug-id"];
              if(debugId && debugId.length>0) {
                if(debugId==setting["debug-id"])
                  debug=request["debug"];
			  } else
                debug=request["debug"];
            }
            
            if(debug && debug.length>0) { 
              if(debug=="waiting")
                return;
              else if(debug=="error")
                url="tobject";
            }
            /***************** debug end *********************/
            
            var result = null;

            $.ajax({
                url: url, async: async, type: type, dataType: dataType, data: sendData,
                beforeSend: function () {
                    if (typeof(callback["beforeSend"]) == "function")
                        callback["beforeSend"]();
                },
                success: function (data) {
                    /***************** debug start *********************/
                    if(debug && debug.length>0) { 
                      if(debug=="code-error")
                        data.code=1;
                        data.message="测试";
                    }
                    /***************** debug start *********************/
                    
                    result = data;
                    if (data) {
                        if (data.code == 0) {
                            // 操作成功

                          /***************** debug start *********************/
                          if(debug && debug.length>0)
                            data=common.checkDebugData(debug, data);
                          /***************** debug end *********************/

                          if (typeof(callback["success"]) == "function")
                              callback["success"](data);
                        } else {
                            var errorMsg = "<font color='red'>" + operateType + "操作失败！[";// + data.code;
                            if (data.message)
                                errorMsg += tek.dataUtility.stringToHTML(data.message);
                            errorMsg += "]</font>";

                            if (typeof(callback["error"]) == "function")
                                callback["error"](data, errorMsg);
                        } // end if (data.code==0) else
                    } else {
                        var errorMsg = "<font color='red'>" + operateType + "操作失败！[data=null]</font>";
                        if (typeof(callback["error"]) == "function")
                            callback["error"](data, errorMsg);
                    } // end if(data) else
                }, //end success: function(data)
                error: function (request) {
                    var errorMsg = "<font color='red'>" + operateType + "操作错误！";
                    if (request) {
                        errorMsg += "[";
                        if (request.status)
                            errorMsg += request.status + "-";

                        errorMsg += request.response || request.statusText;
                        errorMsg += "]";
                    }
                    errorMsg += "</font>";

                    if (typeof(callback["error"]) == "function")
                        callback["error"](null, errorMsg);
                },
                complete: function () {
                    if (typeof(callback["complete"]) == "function")
                        callback["complete"](result);
                }
            });
        };

        /**
         * 获取当前用户的信息
         * @param {Function} errorFunc 自定义错误回调函数，function(data, message)（可以为空）
         */
        common.getUser = function (errorFunc) {
            //common.appendTestLabel();
            
            var setting = {async: false, operateType: "读取用户", nodebug: 1};

            var sendData = {action: "getMy"};

            var callback = {
                success: function (data) {
                    myCharset = data.my_charset;
                    myId = data.my_id;
                    myName = data.my_name;
                    myToken = data.my_token;
                    mySecurity = data.my_security;
                    myRole = data.my_role;
                    myType = data.my_type;
                    myLatestedIp = data.my_latestIp;
                    myLatestedTime = data.my_latestTime;
                    myLoginTime = data.my_loginTime;
                    myLoginIp = data.my_loginIp;
                    myIcon = data.my_icon;
                    
                    if(typeof(tek.common.customGetUserSuccess)=="function")
                      tek.common.customGetUserSuccess(data);
                },
                error: function (data, message) {
                    if (data)
                        myCharset = data.my_charset;
                    if (typeof(errorFunc) == "function")
                        errorFunc(data, message);
                }
            };

            common.ajax(common.getRelativePath() + "servlet/login", setting, sendData, callback);
        };

        /**
         * 添加测试标签
         */
        common.appendTestLabel = function () {
            var str="<font color='red'>当前系统为测试系统，连接测试数据库!</font>";
            var first=document.body.firstChild;//得到页面的第一个元素 
            if(first.innerHTML!=str) {
                var el = document.createElement('div')
                el.innerHTML=str;
                document.body.insertBefore(el,first);//在得到的第一个元素之前插入
            }
         };

        /**
         * 判断用户是否已经登录（根据全局参数myId判断）
         * @return 返回true或false
         */
        common.isLoggedIn = function () {
            var flag = false;

            if (!tek.type.isEmpty(myId) && tek.type.isString(myId) && myId != '0' && /^\d+$/g.test(myId))
                flag = true;		
            return flag;
        };

        /**
         * 注销当前用户
         * @param {String} returnPage 注销成功后，跳转页面URL
         * @param {Function} errorFunc 自定义错误回调函数，function(data, message)（可以为空）
         */
        common.logout = function (returnPage, errorFunc) {
            var setting = {async: false, operateType: "注销用户", nodebug: 1};

            var sendData = {action: "logout"};

            var callback = {
                success: function (data) {
                    myId = 0;
                    myName = null;
                    myLogin = null;
                    mySecurity = 0;
                    myLatestedIp = 0;
                    myLatestedTime = "";

                    var url = tek.type.isEmpty(returnPage) ? common.getRootPath() : returnPage;
                    window.open(url, "_self");
                },
                error: function (data, message) {
                    if (typeof(errorFunc) == "function")
                        errorFunc(data, message);
                }
            };

            common.ajax(common.getRootPath() + "servlet/login", setting, sendData, callback);
        };

        /**
         * 取得页面传递参数。（一般情况下，直接使用request参数即可）
         * @returns {Object} 参数的键值对对象
         */
        common.getRequest = function () {
            var url = location.search; //获取url中"?"符后的字串

            var theRequest = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
                }
            }

            return theRequest;
        };

        /**
         * 取得URL中?后面的参数
         * @returns {String}
         */
        common.getRequestString = function () {
            var str;
            var url = location.search; //获取url中"?"符后的字串
            var loc = url.indexOf("?");
            if (loc >= 0)
                str = url.substr(loc + 1);
            return str;
        };

        /**
         * 根据屏幕比例，取得的点阵对应设计时需要的大小
         * @param {Number} pxl 在屏幕显示的实际点数
         * @return {Number} 对应设计需要的点数
         **/
        common.getDesignPx = function (pxl) {
            if (window.devicePixelRatio && window.devicePixelRatio > 1)
                return pxl / window.devicePixelRatio;
            else
                return pxl;
        };

        /**
         * 根据屏幕比例，取得实际设置的点阵
         * @param {Number} pxl 期望在屏幕比例1:1显示的点阵大小
         * @return {Number} 实际在屏幕上显示的比例
         **/
        common.getRealPx = function (pxl) {
            if (window.devicePixelRatio)
                return pxl * window.devicePixelRatio;
            else
                return pxl;
        };

        /**
         * 判断给定id的控件是否在页面可视区域
         * @param {String} area div等控件标识id
         * @return {Boolean} 可视范围内为ture，否则为false
         **/
        common.isShowArea = function (area) {
            var div_id = document.getElementById(area);
            if (div_id) {
                var loc = $(div_id).offset().top;
                if (loc >= $(window).scrollTop() && loc < ($(window).scrollTop() + $(window).height())) {
                    return true;// alert("div在可视范围");
                }
            }
            return false;
        };

        /**
         * 跳转到指定页面
         * @param {String} callUrl 调用该页面
         * @param {String} callBackUrl 执行完成后返回的页面
         */
        common.callPage = function (callUrl, callBackUrl) {
            if (callUrl) {
                var form = document.getElementById("call_form");
                if (form == null)
                    form = common.createForm("call_form", myCharset);
                if (!form)
                    return;

                form.innerHTML = "";
                form.action = decodeURIComponent(callUrl);
                form.target = "_self";
                form.method = "get";
                if (common.isIE())
                    document.charset = "UTF-8";

                if (callBackUrl && callBackUrl != "undefined" && callBackUrl != "null") {
                    var callbackURL = document.createElement("input");
                    callbackURL.id = "callback-url";
                    callbackURL.name = "callback-url";
                    callbackURL.type = "hidden";
                    callbackURL.value = callBackUrl;

                    form.appendChild(callbackURL);
                } //end if(callbackURL && callbackURL!="undefined" && callbackURL!="null" )

                form.submit();
            } // end if(callUrl)
        };

        /**
         * 创建Form元素，并添加到body节点下
         * @param {String} formId 表单标识名
         * @param {String} charset 字符编码
         */
        common.createForm = function (formId, charset) {
            var form = document.createElement("form");
            form.id = formId;
            form.name = formId;
            form.method = "post";
            form.acceptCharset = charset;
            form.style.display = "none";
            if (navigator.userAgent.indexOf('MSIE') >= 0)
                document.charset = charset;
            document.body.appendChild(form);
            return form;
        };

        /**
         * 取得串行化参数
         * @param {String} id 串行化元素标识
         * @return {String} 返回串行化参数字符串
         */
        common.getSerializeStringParameters = function (id) {
            var param = $("#" + id).serialize();
            if(param)
                param=param.replace(/\+/g, "%20");//decodeURIComponent(array2[1].replace(/\+/g, "%20"));
            return param;
        };

        /**
         * 取得串行化参数
         * @param {String} id 串行化元素标识
         * @return {Object} 返回串行化参数对象。
         */
        common.getSerializeObjectParameters = function (id) {
            var param = common.getSerializeStringParameters(id);
            if (param) {
                var mydata = {};

                var array = param.split("&");
                for (var i = 0; i < array.length; i++) {
                    var array2 = array[i].split("=");

                    var old = mydata[array2[0]];
                    if (old && old.length > 0)
                        mydata[array2[0]] = old + ";" + array2[1];
                    else
                        mydata[array2[0]] = array2[1];
                }

                return mydata;
            }
        };

        /**
         * 在URL后面增加随机参数，保证浏览器不使用缓存页面
         * @param {String} url URL链接
         */
        common.appendRandomParam = function (url) {
            if (!url)
                return url;

            var loc = url.lastIndexOf("?");
            if (loc >= 0) {
                if (loc < url.length - 1)
                    url += "&";
            } else {
                url += "?";
            }
            url += "cache=" + Math.floor(Math.random() * 100000);

            return url;
        };

        /**
         * 取得指定IP所在地
         * @param {String} ip IP地址，如果为空，返回本机信息
         * @return {String} 返回所在地信息对象。（object["ip"] - IP地址；object["country"] - 国家）
         */
        common.getIpLocation = function (ip) {
            var obj;

            var urlstr = "http://api.wipmania.com/";
            if (ip)
                urlstr += "/" + ip;

            var setting = {async: false, dataType: "html", operateType: "获取位置", nodebug: 1};

            var sendData = {action: "agent", "redirect-url": urlstr};

            var callback = {
                success: function (data) {
                    var lip;
                    var lcountry;

                    if (data && (typeof(data) == "string")) {
                        var array = data.split("<br>");
                        if (array && array.length > 0) {
                            if (ip) {
                                // 指定IP
                                lip = ip;
                                if (array[0])
                                    lcountry = array[0];
                            } else {
                                // 未指定IP
                                if (array.length >= 2) {
                                    lip = array[0];
                                    lcountry = array[1];
                                }
                            }
                        } // end if(array && array.length)
                    } // end if(data && (typeof(data)=="string"))

                    obj = {};
                    if (lip)
                        obj["ip"] = lip;
                    if (lcountry)
                        obj["country"] = lcountry;
                },
                error: function (data, message) {
                }
            };

            common.ajax(common.getRootPath() + "servlet/sys", setting, sendData, callback);

            return obj;
        };

        /**
         * Google站内搜索
         * @param {String} word 搜索内容
         */
        common.googleSearch = function (word) {
            var url = "//www.google.com/search";
            url += "?ie=utf-8&oe=GB2312&hl=zh-CN&btnG=Google 搜索&q=" + word;
            window.open(url, "_blank");
        };

        /**
         * Bing站内搜索
         * @param {String} word 搜索内容
         */
        common.bingSearch = function (word) {
            var url = "//www.bing.com/search";
            url += "?q=" + word;
            window.open(url, "_blank");
        };

        /**
         * Baidu站内搜索
         * @param {String} word 搜索内容
         */
        common.baiduSearch = function (word) {
            var url = "//www.baidu.com/s";
            url += "?ie=utf-8&tn=baidu&wd=" + word;
            window.open(url, "_blank");
        };

        /**
         * Sougou站内搜索
         * @param {String} word 搜索内容
         */
        common.sogouSearch = function (word) {
            var form = document.createElement("form");
            form.action = "//www.sogou.com/web";
            form.target = "_blank";
            form.method = "get";

            var searchText = document.createElement("input");
            searchText.name = "query";
            searchText.type = "text";
            searchText.value = word;
            form.appendChild(searchText);

            var ie = document.createElement("input");
            ie.name = "ie";
            ie.type = "text";
            ie.value = "utf8";
            form.appendChild(ie);

            form.submit();
        };

        /**
         * 返回当前时间（不包括日期）
         * @returns {string} 形如00:00:00
         */
        common.getTimeString = function () {
            var sb = "";
            var hours, minutes, seconds;
            var intHours, intMinutes, intSeconds;
            var today = new Date();
            intHours = today.getHours();
            intMinutes = today.getMinutes();
            intSeconds = today.getSeconds();
            if (intHours == 0) {
                sb += "00";
            } else if (intHours < 10) {
                sb += "0" + intHours;
            } else {
                sb += intHours;
            }
            sb += ":";

            if (intMinutes == 0) {
                sb += "00";
            } else if (intMinutes < 10) {
                sb += "0" + intMinutes;
            } else {
                sb += intMinutes;
            }
            sb += ":";

            if (intSeconds == 10) {
                sb += "00";
            } else if (intSeconds < 10) {
                sb += "0" + intSeconds;
            } else {
                sb += intSeconds;
            }
            sb += " ";
            return sb;
        };

        /**
         * 关闭当前页面（或窗口）
         * @param {Boolean} [refreshFrame] 当前页面是弹出窗口时有效，表示是否刷新页面
         * @param {String} [charset] 字符集，refreshFrame为true时有效
         */
        common.winClose = function (refreshFrame, charset) {
            if (frameElement) {
                if (refreshFrame) {
                    // 刷新页面
                    if (typeof frameElement.api.opener.refreshWithWaiting == "function")
                        frameElement.api.opener.refreshWithWaiting(charset);
                    else if (typeof frameElement.api.opener.tek.refresh.refresh == "function")
                        frameElement.api.opener.tek.refresh.refresh(charset);
                    else
                        frameElement.api.opener.window.location.reload();
                } else {
                    // 不刷新页面，关闭弹出窗口。
                    frameElement.api.close();
                }
            } else {
                // 改进chrome，firefox等中window.close();不起作用
                //if (common.getBrowser().firefox || common.getBrowser().chrome) {
                //    window.location.href = "about:blank";
                //} else {
                    window.open("", "_self").close();
                //}
            }
        };

        /**
         * 关闭当前页面，在关闭前确认
         * @param {Boolean} [refreshFrame] 当前页面是弹出窗口时有效，表示是否刷新页面
         * @param {String} [charset] 字符集，refreshFrame为true时有效
         */
        common.closeWithConfirm = function (refreshFrame, charset) {
            var closeConfirm = confirm("确定关闭页面？");
            if (closeConfirm)
                common.winClose(refreshFrame, charset);
        };

        /**
         * 返回到指定页面，在返回前确认
         * @param {String} backURL 要返回页面的URL
         */
        common.callbackWithConfirm = function (backURL) {
            if (backURL) {
                var callbackConfirm = confirm("确定返回前一页面？");
                if (callbackConfirm)
                    location.href = backURL;
            }
        };

        /**
         * 取得指定IFrame的自适应高度
         * @param {Element} iframeElem iframe元素对象
         * @returns {Number} IFrame的自适应高度
         */
        common.getIframeScrollHeight = function (iframeElem) {
            if (!iframeElem)
                return 0;

            var bHeight = 0;
            if (iframeElem && iframeElem.contentWindow && iframeElem.contentWindow.document && iframeElem.contentWindow.document.body)
                bHeight = iframeElem.contentWindow.document.body.scrollHeight;
            var dHeight = 0;
            if (iframeElem && iframeElem.contentWindow && iframeElem.contentWindow.document && iframeElem.contentWindow.document.documentElement)
                dHeight = iframeElem.contentWindow.document.documentElement.scrollHeight;

            return Math.min(bHeight, dHeight);
        };

        // 当前页面根路径（包含工程名）
        var rootPath = null;

        /**
         * 取得根URL（包含工程名）
         * 例如：http://domain:port/rootname/
         * @return {String|null} 返回根URL。
         */
        common.getRootPath = function () {
            if (!rootPath) {
                var full = window.location.href;
				//alert("full="+full);
                if (full) {
                    var loc = full.indexOf("?");
                    if (loc && loc >= 0)
                        full = full.substring(0, loc);
                }
                var pathname = window.location.pathname;
				//alert("full1="+full+";pathname="+pathname);
                var sb = full.substring(0, full.lastIndexOf(pathname)) + "/";

                var p = pathname;
                if (p.charAt(0) == "/")
                    p = p.substring(1);
					
                var arr = p.split("/");
                if (arr && arr.length > 0) {
                    if (arr[0] != "" && arr[0] != "http" && arr[0] != "https" && (arr[0].indexOf(".") < 0 || p.charAt(p.length - 1) == "/")) {
                        sb += arr[0] + "/";
                    }
                }
				
                rootPath = sb;
            }

            return rootPath;
        };

        // 当前页面相对于工程目录的路径
        var relativePath = null;

        /**
         * 取得当前页面相对于工程目录的相对路径
         * 例如：当前页面路径为“/http/takall/index.html”，则返回“../”
         * @return {String|null} 返回相对的“../”字符串。
         */
        common.getRelativePath = function () {
            if (!relativePath) {
                var p = window.location.pathname;
                if (p.charAt(0) == "/")
                    p = p.substring(1);

                var sb = "";
                var first = true;
                var loc = 0;
                do {
                    loc = p.indexOf("/");
                    if (loc > 0) {
                        if (!first || p.substring(0, loc) == "http") {
                            sb += "../";
                        }
                        first = false;
                        p = p.substring(loc + 1);
                    }
                } while (loc > 0);
                relativePath = sb;
            }
            return relativePath;
        };

        /**
         * 收藏
         * @param {String} title 标题
         * @param {String} url URL地址
         */
        common.addFavorite = function (title, url) {
            try {
                window.external.addFavorite(url, title);
            } catch (e) {
                try {
                    window.sidebar.addPanel(title, url, "");
                }
                catch (e) {
                    alert("抱歉，您所使用的浏览器无法完成此操作。\r\n加入收藏失败，请使用Ctrl+D进行添加");
                }
            }
        };

        /**
         * 判断键盘敲击键，必须是数字
         * @param evt 事件
         */
        common.numberOnly = function (evt) {
            evt = evt || window.event;    //兼容IE和Firefox获得keyBoardEvent对象
            if (evt) {
                if ((evt.keyCode < 48 || evt.keyCode > 57) && evt.keyCode != 13)
                    evt.keyCode = 0;
            }
        };

        /**
         * 跳转到诠证通(ipass)系统登录
         */
        common.ipassLogin = function () {
            var form = document.getElementById("call_form");
            if (!form)
                form = common.createForm("call_form", "utf-8");

            if (form) {
                form.innerHTML = "";
                form.action = common.getRootPath() + "servlet/login?action=request";
                form.target = "_self";
                form.method = "post";

                document.charset = "UTF-8";

                var callback = document.createElement("input");
                callback.id = "callback-url";
                callback.name = "callback-url";
                callback.type = "text";

                if (callbackURL && callbackURL != "undefined" && callbackURL != "null")
                    callback.value = decodeURIComponent(callbackURL);
                else
                    callback.value = location.href;
                form.appendChild(callback);

                var errorParams = document.createElement("input");
                errorParams.id = "error-url";
                errorParams.name = "error-url";
                errorParams.type = "text";
                errorParams.value = location.href;
                form.appendChild(errorParams);

                form.submit();
            }
        };

        /**
         * 跳转到诠证通(ipass)系统注册
         * @param {String} callBackUrl 回调地址（如果为空，默认为当前页面）
         * @param {Function} errorFunc 错误回调函数
         */
        common.ipassRegister = function (callBackUrl, errorFunc) {
            var setting = {async: false, operateType: "诠证通(ipass)系统注册", nodebug: 1};

            var sendData = {action: "getAuthUrl", name: "register"};

            var callback = {
                success: function (data) {
                    if (!callback || callback == "")
                        callback = location.href;
                    common.callPage(data.value, callBackUrl);
                },
                error: function (data, message) {
                    if (typeof(errorFunc) == "function")
                        errorFunc(data, message);
                }
            };

            common.ajax(common.getRootPath() + "servlet/sys", setting, sendData, callback);
        };

        /**
         * 强制使用指定协议和端口访问（如果当前协议不是指定的协议，重定义指定的协议访问）
         * @param {String} protocol 协议名（"http:"或"https:"）
         * @param {Number|String|null} port 端口号（如"443"）
         * @return {Boolean} 如果需要跳转，返回true。
         */
        common.enforceProtocol = function (protocol, port) {
            if (tek.type.isEmpty(protocol))
                return false;

            if (protocol.charAt(protocol.length - 1) != ":")
                protocol += ":";
            if (!port)
                port = window.location.port;

            var originProtocol = window.location.protocol;
            if (protocol == originProtocol)
                return false;

            var newUrl = protocol + "://" + window.location.hostname + ":" + port;
            newUrl += window.location.pathname + window.location.search;

            location.href = newUrl;
            return true;
        };

        // debug测试：修改data数据
        common.checkDebugData=function(debug, data) {
          if(debug=="record-0") {
            data.value=0;
            data.record=null;
          }else if(debug=="record-1") {
            data.value=1;
            if(data.record)
              data.record=tek.type.isArray(data.record) ? data.record[0] : data.record;
          }else if(debug=="field-null" || debug=="field-chinese" || debug=="field-html" || debug=="field-newline" || debug=="default") {
            if(data.record) {
              if(data.record.length) {
                for(var i in data.record)
                  data.record[i]=common.debugField(debug, data.record[i]);
              } else {
                data.record=common.debugField(debug, data.record);
              }
            }
		  }
          
          return data;
        }
        
        // debug测试不返回字段信息
        common.debugField = function (debug, record) {
          if(!record)
            return record;

          if(debug=="field-null") {
            record.name=null;
          } else if(debug=="field-chinese") {
            record.name=record.name+"（测试）";
          } else if(debug=="field-html") {
            record.name=record.name+"<h1>测试</h1>";
          } else if(debug=="field-newline") {
          }

          for(var key in record) {
            if(typeof(record[key])=="object") {
              if(debug=="field-null") {
                record[key]=null;
              } else if(debug=="field-chinese") {
                if(record[key].format==0 || record[key].format==0x0B) {
                  record[key].value=record[key].value+"（测试）";
                  record[key].show=record[key].show+"（测试）";
                }
              } else if(debug=="field-html") {
                if(record[key].format==0 || record[key].format==0x0B) {
                  record[key].value=record[key].value+"<h1>测试</h1>";
                  record[key].show=record[key].show+"<h1>测试</h1>";
                }
              } else if(debug=="field-newline") {
                if(record[key].format==0 || record[key].format==0x0B) {
                  record[key].value=record[key].value+"\r\n测试";
                  record[key].show=record[key].show+"\r\n测试";
                }
              } else if(debug=="default") {
                var defaultValue=request["debug-"+key];
				if(defaultValue) {
				  record[key].value=defaultValue;
				  record[key].show=defaultValue;
				}
              }
            }
          }
          return record;
        }
    })(tek.common);

})();


//======================================================================================================================
//==========================注意：下面的代码为了兼容现有的函数调用暂时保留，后期修改完成后删除======================================
//=======================这个方法时旧版本的 tek.common.ajax(); --改--> tek.common.ajax2(); =================================
//======================================================================================================================

// AJAX操作（所有与TekInfo服务器交互，都通过该函数执行）
// params - 参数。
//          params["async"] - 是否异步。true或false。（默认为true）
//          params["type"] - 访问方式。post或get。（默认为post）
//          params["url"] - ajax访问地址。（不能为空）
//          params["params"] - 传递参数
//          params["success"] - 自定义返回data.code==0时调用的函数。function(data)（如果为空，执行默认操作）
//          params["error"] - 自定义返回data.code==0之外的情况时调用的函数。function(data,message)（如果为空，执行默认操作）
//          params["message"] - 提示信息前缀（如果为空，默认显示“操作成功”、“操作失败”、“操作错误”）
tek.common.ajax2 = function (params) {
    if (typeof(params) != "object")
        return;

    var async = true;
    if (params["async"] == false || params["async"] == "false")
        async = false;
    if (!params["type"])
        params["type"] = "post";

    $.ajax({
        async: async,
        type: params["type"],
        url: params["url"],
        dataType: "json",
        data: params["params"],

        error: function (request) {
            var msg = "<font color='red'>";
            if (params["message"] && params["message"].length > 0)
                msg += params["message"];
            msg += "操作错误!";
            if (request) {
                msg += "[";
                if (request.status)
                    msg += request.status + "-";
                if (request.response)
                    msg += request.response;
                msg += "]";
            }
            msg += "</font>";

            if (typeof(params["error"]) == "function") {
                // 自定义执行函数
                params["error"](null, msg);
            }
        },

        success: function (data) {
            if (data) {
                if (data.code == 0) {
                    // 操作成功
                    if (typeof(params["success"]) == "function") {
                        // 自定义执行函数
                        params["success"](data);
                    }

                } else {
                    // 操作错误
                    var msg = "<font color='red'>操作失败!";
                    //if(data.code)
                    //  msg.append(data.code);
                    //msg.append(" - ");
                    if (data.message)
                        msg += tek.dataUtility.stringToHTML(data.message);
                    msg += "</font>";

                    if (typeof(params["error"]) == "function") {
                        // 自定义执行函数
                        params["error"](data, msg);
                    }
                } // end if (data.code==0) else
                
            } else {
                var msg = "<font color='red'>操作失败![data=null]</font>";
                if (typeof(params["error"]) == "function") {
                    // 自定义执行函数
                    params["error"](data, msg);
                }
            } // end if(data) else
        } //end success: function(data)
    });
}


