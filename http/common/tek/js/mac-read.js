/***************************************************************************************************
 * 说明：
 *   该JS文件用于使用macadmin-5.0样式生成的标准化对象读取页面。
 * 要求：
 *   需要加载 tool.js、common.js、dataUtility.js、mac-common.js、core.js
 *------------------------------------------------------------------------------------------------
 * tek.macRead 公共参数&函数：
 *     function tek.macRead.readInfo(ajaxURL, sendData, items, parentId); - 读取对象信息使用mac样式显示
 *     function tek.macRead.getDefaultReadUI(record, items, parent); - 使用mac样式生成默认读取页面的字符串
 *     function tek.macRead.appendDefaultReadField(field, record); - 使用mac样式追加指定域的默认读取框的字符串
 *     function tek.macRead.removeInfo(ajaxURL, sendData, name) - 删除信息
 *     function tek.macRead.showReadMessage(msg, parent) - 在编辑元素内显示信息
 *-------------------------------------------------------------------------------------------------
 * 页面可选自定义方法：
 *     function tek.macRead.customOperation(data); - 自定义数据操作。例如：处理按钮等。
 *     function tek.macRead.getCustomReadUI(record,items,parent); - 使用mac样式生成默认读取页面的字符串
 *     function tek.macRead.appendCustomReadField(field, record); - 使用mac样式生成默认读取页面的字符串
 ***************************************************************************************************/

(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义 mac-read.js 中相关的参数、函数
    tek.macRead = {};
    (function (macRead) {
        /**
         * 读取对象信息
         * @param {String} ajaxURL 取得列表信息的Servlet地址
         * @param {object} sendData 取得列表信息参数对象
         * @param {Array} items 显示字段数组
         * @param {String} parentId 显示信息的父元素ID
         */
        macRead.readInfo = function (ajaxURL, sendData, items, parentId) {
            var parent = document.getElementById(parentId);
            if (tek.type.isEmpty(ajaxURL) || !tek.type.isArray(items) || items.length <= 0 || !tek.type.isElement(parent))
                return;

            // 显示读取等待
            var html = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...";
            macRead.showReadMessage(html, parent);

            var setting = {};//operateType: "读取对象信息"};

            var callback = {
                success: function (data) {
                    parent.innerHTML = "";
                    // 自定义操作
                    if (typeof(tek.macRead.customOperation) == "function")
                        tek.macRead.customOperation(data);

                    // 显示数据
                    var record = data["record"];
                    if (record) {
                        record = tek.type.isArray(record) ? record[0] : record;

                        if (typeof(tek.macRead.getCustomReadUI) == "function") {
                            // 默认输入框
                            tek.macRead.getCustomReadUI(record, items, parent);
                        } else {
                            // 自定义输入框
                            tek.macRead.getDefaultReadUI(record, items, parent);
                        }
                    } else {
                        macRead.showReadMessage("没有数据!", parent);
                    }
                },
                error: function (data, message) {
                    parent.innerHTML = "";
                    macRead.showReadMessage(message, parent);
                }
            };

            tek.common.ajax(ajaxURL, setting, sendData, callback);
        };

        /**
         * 使用mac样式生成默认读取页面的字符串
         * @param {Object} record 从Servlet取得的对象信息
         * @param {Array} items 显示的字段数组
         * @param {Element} parent 显示信息的元素
         */
        macRead.getDefaultReadUI = function (record, items, parent) {
            if (!record || !items || items.length <= 0 || !parent)
                return null;

            var html = "";
            for (var i = 0; i < items.length; i++) {
                if (typeof(tek.macRead.appendCustomReadField) == "function") {
                    // 自定义输入框
                    html += tek.macRead.appendCustomReadField(record[items[i]], record);
                } else {
                    // 默认输入框
                    html += tek.macRead.appendDefaultReadField(record[items[i]], record);
                }
            }

            parent.innerHTML = html;
        };

        /**
         * 使用mac样式追加指定域的默认读取框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @param {Object} record 从Servlet取得的对象信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macRead.appendDefaultReadField = function (field, record) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名
            var display = field.display || "&nbsp;";    //本地化域名
            var show = !!field.show ? tek.dataUtility.stringToHTML(field.show) : "";    //域显示值

            html += "<div id='" + fieldname + "' class='form-group'>"
                + "<label class='control-label col-xs-5 col-lg-5'>" + display + "</label>"
                + "<div class='col-xs-7 col-lg-7' style='padding-top:7px;word-break:break-all;'>"
                + "<span>" + show + "</span>"
                + "</div>"
                + "</div>";

            return html;
        };

        /**
         * 删除信息
         * @param {String} ajaxURL 服务器URL
         * @param {Object} sendData ajax要提交的参数
         * @param {String} name 删除的信息名称
         */
        macRead.removeInfo = function (ajaxURL, sendData, name) {
            var str = "确定删除"
                + ((name && name.length > 0) ? " '" + name + "' " : "")
                + "?";

            var remove = window.confirm(str);
            if (!remove)
                return;

            //显示等待图层
			var html = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在删除...";
            tek.macCommon.waitDialogShow(null, html, null, 2);

            var setting = {async: false};//, operateType: "删除信息"};

            var callback = {
                success: function (data) {
                    // 操作成功

                    if (typeof updateOpener != "undefined" && updateOpener == 1) {
                        // 刷新父页面
                        tek.refresh.refreshOpener();
                    }

                    if (typeof showClose != "undefined" && showClose == 1) {
                        // 关闭
                        tek.macCommon.waitDialogShow(null, "删除成功!", "页面<font id='counter' color='red'></font>秒后自动关闭", 2);
                        tek.macCommon.waitDialogHide(3000, "window.close()");

                    } else if (typeof callbackURL != "undefined" && !!callbackURL) {
                        // 跳转
                        tek.macCommon.waitDialogShow(null, "删除成功!", "页面<font id='counter' color='red'></font>秒后自动跳转", 2);
                        tek.macCommon.waitDialogHide(3000, "location.href='" + callbackURL + "';");

                    } else {
                        tek.macCommon.waitDialogShow("删除成功!");
                        tek.macCommon.waitDialogHide(3000);
                    }
                },
                error: function (data, message) {
                    tek.macCommon.waitDialogShow(null, message);
                }
            };

            tek.common.ajax(ajaxURL, setting, sendData, callback);
        };

        /**
         * 在编辑元素内显示信息
         * @param {String} msg 消息字符串
         * @param {Element}  parent 显示信息的DOM元素
         */
        macRead.showReadMessage = function (msg, parent) {
            if (!msg || !tek.type.isElement(parent))
                return;

            parent.innerHTML = "<div class='loading center loading-style'>" + msg + "</div>";
        };

    })(tek.macRead);

})();
