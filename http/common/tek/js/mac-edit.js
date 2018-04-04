/***************************************************************************************************
 * 说明：
 *   该JS文件用于使用macadmin-5.0样式生成的标准化对象编辑页面。
 * 要求：
 *   需要加载 tool.js、common.js、dataUtility.js、mac-common.js、core.js、refresh.js
 *-------------------------------------------------------------------------------------------------
 * tek.macEdit 公共参数&函数：
 *     function tek.macEdit.initialButton(parentId); - 初始化底部按钮（提交）
 *     function tek.macEdit.initialDefaultButton(parentId); - 初始化默认的底部按钮（提交）
 *     function tek.macEdit.getEdit(ajaxURL, sendData, items, parentId); - 取得编辑域
 *     function tek.macEdit.showReadMessage(msg, parent); - 在编辑元素内显示信息
 *     function tek.macEdit.defaultOperation(data, items, parent); - 生成默认输入框
 *     function tek.macEdit.getEditUI(record, items); - 使用mac样式生成编辑页面的字符串
 *     function tek.macEdit.appendEditField(field, record); - 使用mac样式追加指定域的编辑框的字符串
 *     function tek.macEdit.appendDefaultEditField(field, record); - 使用mac样式追加指定域的默认形式的编辑框的字符串
 *     function tek.macEdit.appendNameField(field); - 使用mac样式追加编辑页面域名的字符串
 *     function tek.macEdit.appendTextField(field); - 使用mac样式追加编辑页面文本输入框的字符串
 *     function tek.macEdit.appendTextAreaField(field); - 使用mac样式追加编辑页面多行文本输入框的字符串
 *     function tek.macEdit.appendPasswordField(field); - 使用mac样式追加编辑页面密码输入框的字符串
 *     function tek.macEdit.appendDetailPasswordField(field); - 使用mac样式追加编辑页面密码输入框的字符串（显示密码强度）
 *     function tek.macEdit.checkPasswordStrong(inputEle); - 检查密码强度
 *     function tek.macEdit.appendSingleField(field); - 使用mac样式追加编辑页面单选框的字符串
 *     function tek.macEdit.appendCheckboxField(field); - 使用mac样式追加编辑页面多选框的字符串
 *     function tek.macEdit.clickCheckbox(inputEle); - 点击数值型多选框
 *     function tek.macEdit.appendSelectField(field); - 使用mac样式追加编辑页面下拉框的字符串
 *     function tek.macEdit.appendDatetimeField(field); - 使用mac样式追加编辑页面时间输入框的字符串
 *     function tek.macEdit.appendObjectField(field); - 使用mac样式追加编辑页面对象输入框的字符串
 *     function tek.macEdit.changeObjectOption(event, fieldname, val); - 响应检索对象信息（延迟调用tek.macEdit.searchObjectOption函数）
 *     function tek.macEdit.searchObjectOption(fieldname, val); - 检索输入对象信息
 *     function tek.macEdit.appendObjectOptionRecord(record, fieldname); - 追加对象选项信息
 *     function tek.macEdit.selectObjectOption(fieldname, id, name); - 选择对象查询结果的处理
 *     function tek.macEdit.editInfo(ajaxURL, sendData); - 提交编辑信息
 *-------------------------------------------------------------------------------------------------
 * 页面可选自定义方法：
 *     function tek.macEdit.initialCustomButton(); - 自定义底部按钮。（如果不定义该函数，将显示默认按钮）
 *     function tek.macEdit.customOperation(data,parent); - 自定义的编辑页面。（如果不定义该函数，将显示默认的编辑页面）
 *     function tek.macEdit.appendCustomEditField(field,record); - 自定义域显示。如果为空，自动调用默认实现
 *     function tek.macEdit.getObjectOptionParam(fieldname); - 自定义取得fieldname字段的对象列表信息的ajax调用参数（如果存在对象域，需要实现该函数）
 *     function tek.macEdit.getObjectOptionUrl(fieldname); - 自定义取得fieldname字段的对象列表信息的ajax调用url（如果存在对象域，需要实现该函数）
 *     function tek.macEdit.customSelectObjectOption(fieldname,id,name); - 自定义选择对象查询结果的处理。
 *     function tek.macEdit.customEditInfoSuccess(data); - 自定义提交成功后的处理。
 *     function tek.macEdit.checkCallbackURL(url,data); - 自定义检查回调地址的操作。返回修正后的回调地址
 ***************************************************************************************************/

(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义 mac-edit.js 中相关的参数、函数
    tek.macEdit = {};
    (function (macEdit) {
        /**
         * 初始化底部按钮（提交）
         * @param {String} parentId 父元素标识
         */
        macEdit.initialButton = function (parentId) {
            if (typeof macEdit.initialCustomButton == "function") {
                // 执行页面自定义的初始化按钮函数
                macEdit.initialCustomButton(parentId);
            } else {
                macEdit.initialDefaultButton(parentId);
            }
        };

        /**
         * 初始化默认的底部按钮（提交）
         * @param {String} parentId 父元素标识
         */
        macEdit.initialDefaultButton = function (parentId) {
            var html = "<button type='submit' id='submitBtn' class='btn btn-danger'>提交</button>";

            if (showClose === 1) {
                //显示关闭按钮
                html += "<button type='button' id='closeBtn' class='btn btn-info' onclick='tek.common.closeWithConfirm();'>关闭</button>";
            } else if (!tek.type.isEmpty(callbackURL)) {
                //显示返回按钮
                html += "<button type='button' id='callbackBtn' class='btn btn-success' onclick='tek.common.callbackWithConfirm(callbackURL)'>返回</button>";
            } else {
                // 显示“提交”、“重置”
                html += "<button type='reset' class='btn btn-success'>重置</button>";
            }

            $("#" + parentId).html(html);
        };

        /**
         * 取得编辑域
         * @param {String} ajaxURL 取得列表信息的Servlet地址
         * @param {object} sendData 取得列表信息参数对象
         * @param {Array} items 显示字段数组
         * @param {String} parentId 显示信息的父元素ID
         */
        macEdit.getEdit = function (ajaxURL, sendData, items, parentId) {
            var parent = document.getElementById(parentId);
            if (tek.type.isEmpty(ajaxURL) || !tek.type.isArray(items) || items.length <= 0 || !tek.type.isElement(parent))
                return;

            // 显示读取数据等待框
            var html = "<img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...";
            macEdit.showReadMessage(html, parent);

            var setting = {
				"debug-id": "edit"
			};//operateType: "取得编辑域"};

            var callback = {
                success: function (data) {
                    parent.innerHTML = "";
                    // 自定义操作
                    if (typeof macEdit.customOperation == "function") {
                        // 自定义输入框
                        macEdit.customOperation(data, items, parent);
                    } else {
                        // 默认输入框
                        macEdit.defaultOperation(data, items, parent);
                    }
                },
                error: function (data, message) {
                    parent.innerHTML = "";
                    macEdit.showReadMessage(message, parent);
                }
            };

            tek.common.ajax(ajaxURL, setting, sendData, callback);
        };

        /**
         * 在编辑元素内显示信息
         * @param {String} msg 显示信息
         * @param {Element} parent 父元素
         */
        macEdit.showReadMessage = function (msg, parent) {
            if (!msg || !parent)
                return;

            parent.innerHTML = "<div class='loading center loading-style'>" + msg + "</div>";
        };

        /**
         * 生成默认输入框
         * @param {Object} data AJAX返回数据
         * @param {Array} items 显示字段数组
         * @param {Element} parent 父元素
         */
        macEdit.defaultOperation = function (data, items, parent) {
            // 显示编辑框
            var record = data["record"];
            if (record) {
                record = tek.type.isArray(record) ? record[0] : record;

                parent.innerHTML = macEdit.getEditUI(record, items);
            }
        };

        /**
         * 使用mac样式生成编辑页面的字符串
         * @param {Object} record 从Servlet取得的对象信息
         * @param {Array} items 显示字段数组
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.getEditUI = function (record, items) {
            var html = "";

            if (!record || !items || items.length <= 0)
                return html;

            for (var i = 0; i < items.length; i++)
                html += macEdit.appendEditField(record[items[i]], record);

            return html;
        };

        /**
         * 使用mac样式追加指定域的编辑框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @param {Object} record 从Servlet取得的对象信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendEditField = function (field, record) {
            var html = "";
            if ((typeof macEdit.appendCustomEditField) == "function") {
                // 执行页面自定义的初始化按钮函数
                html = macEdit.appendCustomEditField(field, record);
            } else {
                html = macEdit.appendDefaultEditField(field, record);
            }
            return html;
        };

        /**
         * 使用mac样式追加指定域的默认形式的编辑框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @param {Object} record 从Servlet取得的对象信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendDefaultEditField = function (field, record) {
            var html = "";
            if (!tek.type.isObject(field) || tek.type.isEmpty(field.name))
                return html;

            var fieldname = field.name;    //域名

            html += "<div id='" + fieldname + "-form-group' class='form-group'>"
                + macEdit.appendNameField(field)
                + "<div class='col-xs-9'>";

            var format = field.format;
            if (format == 2 || format == 16) {
                // 单选
                html += macEdit.appendSingleField(field);
            } else if (format == 32 || format == 33) {
                // 多选
                html += macEdit.appendCheckboxField(field);
            } else if (format == 18 || format == 20) {
                // 下拉框
                html += macEdit.appendSelectField(field);
            } else if (format == 8 || format == 9) {
                // 日期
                html += macEdit.appendDatetimeField(field);
            } else if (format == 10) {
                // 时间
                //printTime(field, print);
            } else if (format == 0x01) {
                // 密码
                html += macEdit.appendPasswordField(field);
            } else if (format == 128) {
                // 对象
                html += macEdit.appendObjectField(field);
            } else if (format == 40) {
                // 文件
                //printBlob(field, print);
            } else if (format == 11) {
                // 多行文本
                html += macEdit.appendTextAreaField(field);
            } else {
                // 单行文本
                html += macEdit.appendTextField(field);
            }
            html += "</div></div>";

            return html;
        };

        /**
         * 使用mac样式追加编辑页面域名的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendNameField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名
            var display = field.display || "&nbsp;";    //本地化域名

            // 去掉了 .control-label
            html += "<label class='col-xs-3' style='overflow:hidden' for='" + fieldname + "'>" + display + "</label>";

            return html;
        };

        /**
         * 使用mac样式追加编辑页面文本输入框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendTextField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名
            var value = !!field.value ? tek.dataUtility.stringToInputHTML(field.value) : "";    //域显示值

            html += "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + value + "'/>";

            return html;
        };

        /**
         * 使用mac样式追加编辑页面多行文本输入框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendTextAreaField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;
            var value = !!field.value ? tek.dataUtility.stringToInputHTML(field.value) : "";    //域显示值

            html += "<textarea id='" + fieldname + "' name='" + fieldname + "' class='form-control'"
                + ((field.editable && field.editable == "false") ? " disabled='disabled'" : "")
                + ">" + value + "</textarea>";

            return html;
        };

        /**
         * 使用mac样式追加编辑页面密码输入框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendPasswordField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名

            html += "<input type='password' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value=''" + "/>";

            return html;
        };

        /**
         * 使用mac样式追加编辑页面密码输入框的字符串（显示密码强度）
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendDetailPasswordField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名

            html += "<input type='password' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value=''"
                + " placeholder='支持字符：数字、字母及常用符号'" + " onkeyup='tek.macEdit.checkPasswordStrong(this);'/>"
                + "<div>" + "密码强度&nbsp;"
                + "<span id='weak' style='background-color:#dde1df;font-size:12px'>&nbsp;&nbsp;&nbsp;&nbsp;弱&nbsp;&nbsp;&nbsp;&nbsp;</span>"
                + "<span id='normal' style='background-color:#dde1df;font-size:12px'>&nbsp;&nbsp;&nbsp;&nbsp;中&nbsp;&nbsp;&nbsp;&nbsp;</span>"
                + "<span id='strong' style='background-color:#dde1df;font-size:12px'>&nbsp;&nbsp;&nbsp;&nbsp;强&nbsp;&nbsp;&nbsp;&nbsp;</span>"
                + "</div>";

            return html;
        };

        /**
         * 检查密码强度
         * @param {Element} inputEle 密码输入框DOM对象
         */
        macEdit.checkPasswordStrong = function (inputEle) {
            $("#weak,#normal,#strong").css("background", "#dde1df");

            if (!tek.type.isElement(inputEle))
                return;

            var password = inputEle.value;
            if (password && password != "") {
                var strong = tek.dataUtility.getPasswordStrong(password);
                switch (strong) {
                    case 1:
                        //中密码
                        $("#normal").css("background", "#EEAD0E");
                        break;
                    case 2:
                        //强密码
                        $("#strong").css("background", "#00EE00");
                        break;
                    default:
                        //弱密码
                        $("#weak").css("background", "#f87d7d");
                        break;
                } // end switch(strong)
            }
        };

        /**
         * 使用mac样式追加编辑页面单选框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendSingleField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名
            var value = field.value;    //域值
            var selects = field.selects;
            var shows = field.shows;
            if (!selects || selects.length <= 0 || !shows || shows.length <= 0 || selects.length != shows.length)
                return html;

            for (var i = 0; i < selects.length; i++) {
                if (!selects[i] || selects[i].length <= 0 || !shows[i] || shows[i].length <= 0)
                    continue;

                html += "<div class='col-xs-6' style=' overflow:hidden; padding:0px 5px'>"
                    + "<input type='radio' class='col-xs-1' style='width:15%; float:left;' " + " id='" + fieldname + "-" + selects[i]
                    + "' name='" + fieldname + "'" + " value='" + selects[i] + "'"
                    + (selects[i] == value ? " checked='checked'" : "") + "/>"
                    + "<label class='col-xs-11'  style='float:left;width:85%;text-align:left;overflow:hidden' for='" + fieldname + "-" + selects[i] + "'>"
                    + shows[i]
                    + "</label>"
                    + "</div>";
            }

            return html;
        };

        /**
         * 使用mac样式追加编辑页面多选框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendCheckboxField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名
            var value = field.value;    //域值
            var selects = field.selects;
            var shows = field.shows;
            if (!selects || selects.length <= 0 || !shows || shows.length <= 0 || selects.length != shows.length)
                return html;

            var type = tek.type.isNumber(value) ? 1 : 0;    // 0-字符串型；1-数值型

            for (var i = 0; i < selects.length; i++) {
                if (!selects[i] || selects[i].length <= 0 || !shows[i] || shows[i].length <= 0)
                    continue;

                html += "<div class='col-xs-6' style=' overflow:hidden; padding:0px 5px'>"
                    + "<input type='checkbox' class='col-xs-1' style='width:15%; float:left;' " + " id='" + fieldname + "-" + selects[i]
                    + "' name='" + fieldname + "'" + " value='" + selects[i] + "'"
                    + ((selects[i] == value || (type == 1 && selects[i] != 0 && ((value & selects[i]) == selects[i]))) ? " checked='checked'" : "")
                    + (type == 1 ? " onclick='tek.macEdit.clickCheckbox(this)'" : "") + "/>"
                    + "<label class='col-xs-11'  style='float:left; width:85%; overflow:hidden' for='" + fieldname + "-" + selects[i] + "'>"
                    + shows[i]
                    + "</label>"
                    + "</div>";
            }

            return html;
        };

        /**
         * 点击数值型多选框
         * @param {Element} inputEle 多选输入框DOM对象
         */
        macEdit.clickCheckbox = function (inputEle) {
            if (!tek.type.isElement(inputEle))
                return;

            var p = inputEle.parentNode.parentNode;
            if (!p)
                return;

            var arr = $(p).find("input[type='checkbox']");
            if (arr && arr.length > 0) {
                var selValue = inputEle.value;
                for (var i = 0; i < arr.length; i++) {
                    if (selValue == 0) {
                        if (arr[i].value != 0)
                            arr[i].checked = "";
                        else
                            arr[i].checked = "checked";
                    } else {
                        if (arr[i].value == 0)
                            arr[i].checked = "";
                    }
                }
            }
        };

        /**
         * 使用mac样式追加编辑页面下拉框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendSelectField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名
            var value = field.value;    //域值
            var selects = field.selects;
            var shows = field.shows;
            if (!selects || selects.length <= 0 || !shows || shows.length <= 0 || selects.length != shows.length)
                return html;

            html += "<select id='" + fieldname + "'" + " name='" + fieldname + "' class='form-control'" + ">";

            for (var i = 0; i < selects.length; i++) {
                if (!selects[i] || selects[i].length <= 0 || !shows[i] || shows[i].length <= 0)
                    continue;

                html += "<option value='" + selects[i] + "' class='form-control'"
                    + (((i == 0 && tek.type.isEmpty(value)) || selects[i] == value) ? " selected='selected'" : "") + ">"
                    + shows[i]
                    + "</option>";
            }

            html += "</select>";

            return html;
        };

        /**
         * 使用mac样式追加编辑页面时间输入框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendDatetimeField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;
            var show = !!field.show ? tek.dataUtility.stringToInputHTML(field.show) : "";

            // calender/all.js 中的方法：calendarShow()
            html += "<input type='text' id='" + fieldname + "' name='" + fieldname + "' class='form-control' value='" + show + "' onfocus='calendarShow(this);'/>";

            return html;
        };

        /**
         * 使用mac样式追加编辑页面对象输入框的字符串
         * @param {Object} field 从Servlet取得的对象域信息
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendObjectField = function (field) {
            var html = "";
            if (!field || !field.name)
                return html;

            var fieldname = field.name;    //域名
            var show = !!field.show ? tek.dataUtility.stringToInputHTML(field.show) : "";    //域显示值

            html += "<input type='hidden' id='" + fieldname + "' class='form-control' value='" + field.value + "'/>"
                + "<input type='text' id='" + fieldname + "-input' class='form-control dropdown-toggle' value='" + show
                + "' data-toggle='dropdown' autocomplete='off'"
                + ((field.editable && field.editable == "false")
                        ? " disabled='disabled'"
                        : " onFocus='tek.macEdit.changeObjectOption(event,\"" + fieldname + "\",this.value);'"
                                + " onKeyUp='tek.macEdit.changeObjectOption(event,\"" + fieldname + "\",this.value);'")
                + "/>"
                + "<ul id='" + fieldname + "-option' class='dropdown-menu col-xs-12' style='margin-left:15px;'></ul>";

            return html;
        };

        // 自动检索时间戳
        var searchTimeStamp = 0;

        /**
         * 响应检索对象信息（延迟调用tek.macEdit.searchObjectOption函数）
         * @param {Event} event 事件
         * @param {String} fieldname 域名
         * @param {String} val 检索值
         */
        macEdit.changeObjectOption = function (event, fieldname, val) {
            event = event || window.event;
            if (event) {
                searchTimeStamp = event.timeStamp;
                setTimeout(function () {    //设时延迟0.5s执行
                    if (searchTimeStamp - event.timeStamp == 0)
                        macEdit.searchObjectOption(fieldname, val);
                }, 500);
            }
        };

        /**
         * 检索输入对象信息
         * @param {String} fieldname 域名
         * @param {String} val 检索值
         */
        macEdit.searchObjectOption = function (fieldname, val) {
            if (val && val.length > 0) {
                $("#" + fieldname + "-option").show();

                var loadingImg = "<li class='center'><img src='" + tek.common.getRelativePath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...</li>";
                $("#" + fieldname + "-option").html(loadingImg);

                var sendData;
                if (typeof tek.macEdit.getObjectOptionParam == "function")
                    sendData = tek.macEdit.getObjectOptionParam(fieldname);

                var ajaxURL;
                if (typeof tek.macEdit.getObjectOptionUrl == "function")
                    ajaxURL = tek.macEdit.getObjectOptionUrl(fieldname);
                if (!ajaxURL)
                    ajaxURL = tek.common.getRootPath() + "servlet/tobject";

                if (!sendData || !ajaxURL) {
                    $("#" + fieldname + "-option").html("<li class='center'><font color='red'>无法得到检索参数!</font></li>");
                    return;
                }

                var maxcount = 5;
                sendData["count"] = maxcount;
				if (val.lastIndexOf(")")>=val.length-1) {
					var loc=val.lastIndexOf("(");
					if(loc>=0)
					  val=val.substring(0, loc);
				}
                sendData["quick-search"] = encodeURIComponent(val);

                var setting = {};//operateType: "检索输入信息"};

                var callback = {
                    success: function (data) {
                        // 操作成功
                        var records = data["record"];
                        if (records) {
                            // 对象数组化
                            records = tek.type.isArray(records) ? records : [records];

                            var html = "";
                            for (var i in records)
                                html += macEdit.appendObjectOptionRecord(records[i], fieldname);

                            // 检索结果多余maxcount，显示“...”
                            if (records.length > maxcount)
                                html += "<li>...</li>";

                            $("#" + fieldname + "-option").html(html);
                        } else {
                            $("#" + fieldname + "-option").html("<li class='center'>没有数据!</li>");
                        }
                    },
                    error: function (data, message) {
                        $("#" + fieldname + "-option").html(message);
                    }
                };

                tek.common.ajax(ajaxURL, setting, sendData, callback);
            } else {
                $("#" + fieldname).val("0");
                $("#" + fieldname + "-option").hide();
            }
        };

        /**
         * 追加对象选项信息
         * @param {Object} record 从Servlet取得的对象信息
         * @param {String} fieldname 域名
         * @return {String} 拼接后的html字符串，可能是""
         */
        macEdit.appendObjectOptionRecord = function (record, fieldname) {
            var html = "";

            if (record && record.id && record.name) {
                html += "<li><a href='#' onClick='tek.macEdit.selectObjectOption(\"" + fieldname + "\", \"" + record.id + "\", \"" + record.name + "\")'>"
                    + record.name + "</a></li>";
            }

            return html;
        };

        /**
         * 选择对象查询结果的处理
         * @param {String} fieldname 执行对象查询的字段名
         * @param {String} id 选择的对象信息标识
         * @param {String} name 选择的对象信息名称
         */
        macEdit.selectObjectOption = function (fieldname, id, name) {
            $("#" + fieldname + "-input").val(name);
            $("#" + fieldname).val(id);
            $("#" + fieldname + "-option").hide();

            if (typeof tek.macEdit.customSelectObjectOption == "function")
                tek.macEdit.customSelectObjectOption(fieldname, id, name);
        };

        /**
         * 提交编辑信息
         * @param {String} ajaxURL 取得列表信息的Servlet地址
         * @param {object} sendData 取得列表信息参数对象
         */
        macEdit.editInfo = function (ajaxURL, sendData) {
            //显示等待图层
            var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在提交...";
            tek.macCommon.waitDialogShow(null, html, null, 2);

            var setting = {};//operateType: "提交编辑信息"};

            var callback = {
                success: function (data) {
                    // 自定义操作
                    if (typeof macEdit.customEditInfoSuccess == "function") {
                        // 自定义输入框
                        macEdit.customEditInfoSuccess(data);
                    } else {
                        macEdit.defaultEditInfoSuccess(data);
                    }
                },
                error: function (data, message) {
                    tek.macCommon.waitDialogShow(null, message);
                }
            };

            tek.common.ajax(ajaxURL, setting, sendData, callback);
        };

        /**
         * 默认提交成功后的处理
         * @param {object} data JSON数据
         */
        macEdit.defaultEditInfoSuccess = function (data) {
            // 默认操作成功的处理。
            if (typeof updateOpener != "undefined" && updateOpener == 1) {
                // 刷新父页面
                tek.refresh.refreshOpener();
            }
            if (typeof showClose != "undefined" && showClose == 1) {
                // 关闭
                var timer = "页面<font id='counter' color='red'></font>秒后自动关闭";
                tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message), timer, 2);
                tek.macCommon.waitDialogHide(3000, "window.close()");
            } else if (typeof callbackURL != "undefined" && !!callbackURL) {
                // 跳转
                var timer = "页面<font id='counter' color='red'></font>秒后自动跳转";
                tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message), timer, 2);
                if (typeof(tek.macEdit.checkCallbackURL) == "function")
                    tek.macEdit.callbackURL = tek.macEdit.checkCallbackURL(callbackURL, data);
                tek.macCommon.waitDialogHide(3000, "location.href='" + callbackURL + "'");
            } else {
                tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message));
            } // end if else
        };
        
    })(tek.macEdit);

})();
