/***************************************************************************************************
 * 说明：
 *   该JS文件实现基本的数据转换等操作，net.tekinfo.util.DataUtility中的方法在本JS中实现。
 * 要求：
 *   需要加载 tool.js
 *-------------------------------------------------------------------------------------------------
 * 公共参数&函数：
 *     function tek.dataUtility.checkIpAddress(ip); - 检验一个ip地址的字符串是否合法。
 *     function tek.dataUtility.checkLoadHTML(html); - 修正加载的HTML页面代码。
 *     function tek.dataUtility.dateToString(date, format); - Date转换为指定日期格式的字符串。
 *     function tek.dataUtility.getDays(start, end); - 取得指定时间段内包含的日期。
 *     function tek.dataUtility.getMaxTimeInMillis(year, month, day); - 取得指定年月日的最大毫秒数。
 *     function tek.dataUtility.getMimeProperty(type, key); - 取出MIME格式的指定属性。
 *     function tek.dataUtility.getMimeType(type); - 取得MIME类型中的MIME类型字符串。
 *     function tek.dataUtility.getMinTimeInMillis(year, month, day); - 取得指定年月日的最小毫秒数。
 *     function tek.dataUtility.getPasswordStrong(password); - 取得密码强度等级。
 *     function tek.dataUtility.getSubstring(str, length, appendStr); - 取得指定字节长度的字符串。
 *     function tek.dataUtility.ipToLong(ipStr); - IP地址转换为相应的长整数。
 *     function tek.dataUtility.isCertificateEmail(email); - 指定字符串是否是合法格式的电子邮箱。
 *     function tek.dataUtility.isCertificatePhone(phone); - 指定字符串是否是合法格式的电话号码。
 *     function tek.dataUtility.isWebPage(name); - 指定文件是否是网页页面。
 *     function tek.dataUtility.longToIp(ipLong); - 长整数转换为相应的IP地址。
 *     function tek.dataUtility.numberOnly(evt); - 判断键盘敲击键，必须是数字。
 *     function tek.dataUtility.objectCopy = function (source, target); - 复制source对象。
 *     function tek.dataUtility.stringToArray(str, delim); - 按指定分隔符分割字符串。
 *     function tek.dataUtility.stringToBoolean(str); - 字符串转换为boolean。
 *     function tek.dataUtility.stringToDate(dateStr, format); - 字符串日期转换为Date。
 *     function tek.dataUtility.stringToHash(str, delim, delim2); - 将字符串按指定分隔符转换成哈希表。
 *     function tek.dataUtility.stringToHTML(str); - 将字符串转换为HTML显示格式的字符串。
 *     function tek.dataUtility.stringToInt(str); - 将字符串转换为整形。如果是无效数值，返回0。
 *     function tek.dataUtility.stringToInputHTML(str); - 将字符串转换为输入框的value字符串。
 *     function tek.dataUtility.stringToMaxDate(dateStr, format); - 字符串日期转换为Date最大值。
 *     function tek.dataUtility.stringToMinDate(dateStr, format); - 字符串日期转换为Date最小值。
 ***************************************************************************************************/

(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义 dataUtility.js 中相关的参数、函数
    tek.dataUtility = {};
    (function (dataUtility) {

        /**
         * 将字符串转换为整形。如果是无效数值，返回0
         * @param {String} str 字符串
         * @return {Number} 返回数值
         */
        dataUtility.stringToInt = function (str) {
            if (!str || typeof str != "string")
                return 0;

            var n = parseInt(str);
            return isNaN(n) ? 0 : n;
        };

        /**
         * 按指定分隔符分割字符串
         * @param {String} str 字符串
         * @param {String} [delim] 分隔符（如果为空，默认以";"分割）
         * @return {Array} 返回字符串数组
         */
        dataUtility.stringToArray = function (str, delim) {
            if (!str || typeof str != "string")
                return null;

            delim = delim || ";";

            var array = [];

            while (str.length > 0) {
                var index = str.indexOf(delim);
                if (index >= 0) {
                    var s = str.substring(0, index);
                    //if(s && s.length>0)
                    //  array.push(s);
                    if (!s || s.length <= 0)
                        s = "";
                    array.push(s);
                    str = str.substring(index + 1);

                } else {
                    array.push(str);
                    break;
                }
            } // end while (str.length>0)

            return array;
        };

        /**
         * 字符串转换为boolean（如果值包含“true”或为整形1，返回true；否则，返回false）
         * @param {String} str 字符串
         * @return {Boolean}
         */
        dataUtility.stringToBoolean = function (str) {
            var p = parseInt(str);
            return !!str && typeof str == "string" && (str.toLowerCase().indexOf("true") >= 0 || (!isNaN(p) && p > 0));
        };

        /**
         * 将字符串按指定分隔符转换成哈希表
         * @param {String} str 字符串
         * @param {String} delim 分隔符（如果为空，默认以";"分割）
         * @param {String} delim2 key、value分隔符（如果为空，默认以"="分割）
         * @return {Object} 返回字符串键值对
         */
        dataUtility.stringToHash = function (str, delim, delim2) {
            if (!str || typeof str != "string")
                return null;

            delim = delim || ";";
            delim2 = delim2 || "=";

            var hash = {};

            while (str.length > 0) {
                var index = str.indexOf(delim);
                if (index >= 0) {
                    var s = str.substring(0, index);
                    if (s && s.length > 0) {
                        var loc = s.indexOf(delim2);
                        if (loc > 0)
                            hash[s.substring(0, loc)] = s.substring(loc + delim2.length);
                    }
                    str = str.substring(index + delim.length);
                } else {
                    var loc = str.indexOf(delim2);
                    if (loc > 0)
                        hash[str.substring(0, loc)] = str.substring(loc + delim2.length);
                    break;
                }
            } // end while (str.length>0)

            return hash;
        };

        /**
         * 取出MIME格式的指定属性
         * 例如 type="text/plain;charset=GBK"，key="charset"时,返回"GBK"
         * @param {String} type MIME格式的字符串
         * @param {String} key 指定属性键（大小写不敏感）
         * @return {String|null} 属性值
         */
        dataUtility.getMimeProperty = function (type, key) {
            if (!type || typeof type != "string" || !key || typeof key != "string")
                return null;

            var value;

            var array = dataUtility.stringToArray(type, ";");
            for (var i = 0; i < array.length; i++) {
                if (!array[i] || array[i].length <= 0)
                    continue;

                var loc = array[i].indexOf("=");
                if (loc > 0 && key == array[i].substring(0, loc)) {
                    value = array[i].substring(loc + 1);
                    break;
                }
            }

            if (value) {
                if (value.startsWith("\""))
                    value = value.substring(1, value.length());
                if (value.endsWith("\""))
                    value = value.substring(0, value.length() - 1);
            }

            return value;
        };

        /**
         * 取得MIME类型中的MIME类型字符串
         * 例如:
         *      type="text/plain;charset=GBK",返回"text/plain"
         *      type="image/jpeg;charset=UTF-8",返回"image/jpeg"
         * @param {String} type MIME格式的字符串
         * @return {String|null} 返回MIME类型字符串或null
         */
        dataUtility.getMimeType = function (type) {
            var mime = null;

            if (!!type && typeof type == "string") {
                var loc = type.indexOf(";");
                if (loc > 0)
                    mime = type.substring(0, loc);
            }

            return mime;
        };

        /**
         * 取得指定字节长度的字符串
         * 如果length大于str的字节长度，返回str；否则，返回length字节长度的字符串
         * 当length长度在中文字节的第一个字节，则取length-1长度的字符串
         * @param {String} str 字符串
         * @param {Number} length 截取长度
         * @param {String} [appendStr] 截取后字符串追加的字符串（如"..."）
         * @return {String|null} 返回截取后的字符串
         */
        dataUtility.getSubstring = function (str, length, appendStr) {
            if (!str || typeof str != "string")
                return null;

            var newStr = "";

            var index = 0;
            for (var i = 0; i < str.length; i++) {
                var s = str.substring(i, i + 1);

                var ch = str.charCodeAt(i);
                if (ch > 127 || ch == 94)
                    index += 2;
                else
                    index += 1;

                if (index <= length)
                    newStr += (s);
                else {
                    if (appendStr)
                        newStr += (appendStr);
                    break;
                }
            } // end for (int i = 0; i < str.length(); i++)

            return newStr;
        };

        /**
         * 将字符串转换为HTML显示格式的字符串。<br/>
         * 1、\r\n替换为&lt;br/&gt;<br/>
         * 2、\n替换为&lt;br/&gt;<br/>
         * 3、空格替换为&nbsp;<br/>
         * 4、单引号替换为&prime;<br/>
         * 5、双引号替换为&Prime;<br/>
         * 6、“<”替换为&lt;<br/>
         * 7、“>”替换为&gt;<br/>
         *
         * @param {String} str 字符串
         * @return {String} 返回HTML显示字符串
         */
        dataUtility.stringToHTML = function (str) {
            if (!str || typeof str != "string")
                return str;

            str = str.replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\r\n/g, "<br/>")
                .replace(/\n/g, "<br/>")
                .replace(/ /g, "&nbsp;")
                .replace(/'/g, "&prime;")
                .replace(/"/g, "&Prime;");

            return str;
        };

        /**
         * 将HTML显示格式的字符串转换为普通文本字符串。<br/>
         * 1、&lt;替换为<    <br/>
         * 2、&gt;替换为>    <br/>
         * 3、<br/>替换为\n    <br/>
         * 4、&nbsp;替换为空格    <br/>
         * 5、&prime;替换为'    <br/>
         * 6、&Prime;替换为"    <br/>
         *
         * @param {String} str HTML显示格式字符串
         * @return {String} 返回普通文本字符串
         */
        dataUtility.htmlToString = function (str) {
            if (!str || typeof str != "string")
                return str;

            str = str.replace(/<br>/g, "\r\n")
                .replace(/<br\/>/g, "\r\n")
                .replace(/&nbsp;/g, " ")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&prime;/g, "'")
                .replace(/&Prime;/g, "\"");

            return str;
        };

        /**
         * 将字符串转换为输入框的value字符串。<br/>
         * 1、单引号替换为&prime;<br/>
         * 2、双引号替换为&Prime;<br/>
         *
         * @param {String} str 字符串
         * @return {String} 返回HTML显示字符串
         */
        dataUtility.stringToInputHTML = function (str) {
            if (!str || typeof str != "string")
                return str;

            str = str.replace(/'/g, "&prime;")
                .replace(/"/g, "&Prime;");

            return str;
        };

        /**
         * 字符串日期转换为Date
         * @param {String} dateStr 时间字符串
         * @param {String} format 日期格式
         * @return {Date|null} 返回Date
         */
        dataUtility.stringToDate = function (dateStr, format) {
            if (!dateStr || typeof dateStr != "string" || !format || dateStr.length != format.length)
                return null;

            var year, month, date, hour, minute, second, milli;

            // 年
            var loc = format.indexOf("yyyy");
            if (loc >= 0)
                year = parseInt(dateStr.substring(loc, loc + 4));

            if (!year)
                return null;

            // 月
            loc = format.indexOf("MM");
            if (loc > 0)
                month = parseInt(dateStr.substring(loc, loc + 2));
            else
                month = 1;

            // 日
            loc = format.indexOf("dd");
            if (loc > 0)
                date = parseInt(dateStr.substring(loc, loc + 2));
            else
                date = 1;

            // 时
            loc = format.indexOf("HH");
            if (loc > 0)
                hour = parseInt(dateStr.substring(loc, loc + 2));
            else
                hour = 0;

            // 分
            loc = format.indexOf("mm");
            if (loc > 0)
                minute = parseInt(dateStr.substring(loc, loc + 2));
            else
                minute = 0;

            // 秒
            loc = format.indexOf("ss");
            if (loc > 0)
                second = parseInt(dateStr.substring(loc, 2));
            else
                second = 0;

            return dataUtility.getDate(year, month, date, hour, minute, second, 0);
        };

        /**
         * 字符串日期转换为Date最小值
         * @param {String} dateStr 时间字符串
         * @param {String} format 日期格式
         * @return {Date|null} 返回Date
         */
        dataUtility.stringToMinDate = function (dateStr, format) {
            var d = dataUtility.stringToDate(dateStr, format);
            if (!tek.type.isDate(d))
                return null;

            var year = d.getFullYear();
            var month = 1;
            var date = 1;
            var hour = 0;
            var minute = 0;
            var second = 0;

            if (format.indexOf("yyyy") + 4 == format.length) {
            } else if (format.indexOf("MM") + 2 == format.length) {
                month = d.getMonth();
            } else if (format.indexOf("dd") + 2 == format.length) {
                month = d.getMonth();
                date = d.getDate();
            } else if (format.indexOf("HH") + 2 == format.length) {
                month = d.getMonth();
                date = d.getDate();
                hour = d.getHours();
            } else if (format.indexOf("mm") + 2 == format.length) {
                month = d.getMonth();
                date = d.getDate();
                hour = d.getHours();
                minute = d.getMinutes();
            } else if (format.indexOf("ss") + 2 == format.length) {
                month = d.getMonth();
                date = d.getDate();
                hour = d.getHours();
                minute = d.getMinutes();
                second = d.getSeconds();
            }

            return dataUtility.getDate(year, month, date, hour, minute, second, 0);
        };

        /**
         * 字符串日期转换为Date最大值
         * @param {String} dateStr 时间字符串
         * @param {String} format 日期格式
         * @return {Date|null} 返回Date
         */
        dataUtility.stringToMaxDate = function (dateStr, format) {
            var d = dataUtility.stringToDate(dateStr, format);
            if (!tek.type.isDate(d))
                return null;

            var year = d.getFullYear();
            var month = 12;
            var date = 31;
            var hour = 23;
            var minute = 99;
            var second = 99;

            if (format.indexOf("yyyy") + 4 == format.length) {
            } else if (format.indexOf("MM") + 2 == format.length) {
                month = d.getMonth();
            } else if (format.indexOf("dd") + 2 == format.length) {
                month = d.getMonth();
                date = d.getDate();
            } else if (format.indexOf("HH") + 2 == format.length) {
                month = d.getMonth();
                date = d.getDate();
                hour = d.getHours();
            } else if (format.indexOf("mm") + 2 == format.length) {
                month = d.getMonth();
                date = d.getDate();
                hour = d.getHours();
                minute = d.getMinutes();
            } else if (format.indexOf("ss") + 2 == format.length) {
                month = d.getMonth();
                date = d.getDate();
                hour = d.getHours();
                minute = d.getMinutes();
                second = d.getSeconds();
            }

            return dataUtility.getDate(year, month, date, hour, minute, second, 999);
        };

        /**
         * 取得指定年月日的最小毫秒数
         * @param {Number} year 年
         * @param {Number} month 月份，1-12（如果为空，返回年份最小值）
         * @param {Number} date 一月中的天数，1-31
         * @return {Number|null} 返回毫秒数
         */
        dataUtility.getMinTimeInMillis = function (year, month, date) {
            if (typeof year != "number")
                return null;

            if (typeof month == "number") {
                if (typeof date != "number")
                    date = 1;
            } else {
                month = 1;
                date = 1;
            }

            var d = dataUtility.getDate(year, month, date, 0, 0, 0, 0);

            return tek.type.isDate(d) ? d.getTime() : 0;
        };

        /**
         * 取得指定年月日的最大毫秒数
         * @param {Number} year 年
         * @param {Number} month 月份，1-12（如果为空，返回年份最小值）
         * @param {Number} date 一月中的天数，1-31
         * @return {Number|null} 返回毫秒数
         */
        dataUtility.getMaxTimeInMillis = function (year, month, date) {
            if (typeof year != "number")
                return null;

            if (typeof month == "number") {
                if (typeof date != "number")
                    date = 1;
            } else {
                month = 12;
                date = 31;
            }

            var d = dataUtility.getDate(year, month, date, 23, 59, 59, 999);

            return tek.type.isDate(d) ? d.getTime() : 0;
        };

        /**
         * 获取日期（缺省的参数，采用系统当前时间的对应值）
         * @param {Number} [yyyy] 年份，大于1970的整数
         * @param {Number} [MM] 月份，1~12之间的整数
         * @param {Number} [dd] 天数，1~31之间整数，月份的有效天数
         * @param {Number} [HH] 小时，0~23之间整数
         * @param {Number} [mm] 分钟，0~59之间整数
         * @param {Number} [ss] 秒数，0~59之间整数
         * @param {Number} [SSS] 毫秒，0~999之间整数
         * @return {Date}
         */
        dataUtility.getDate = function (yyyy, MM, dd, HH, mm, ss, SSS) {
            var sct = new Date();
            var d = {
                yyyy: sct.getFullYear(),
                MM: sct.getMonth() + 1,
                dd: sct.getDate(),
                HH: sct.getHours(),
                mm: sct.getMinutes(),
                ss: sct.getSeconds(),
                SSS: sct.getMilliseconds()
            };
            yyyy = (yyyy === null || yyyy === undefined) ? d.yyyy : yyyy;
            MM = (MM === null || MM === undefined) ? d.MM : MM;
            dd = (dd === null || dd === undefined) ? d.dd : dd;
            HH = (HH === null || HH === undefined) ? d.HH : HH;
            mm = (mm === null || mm === undefined) ? d.mm : mm;
            ss = (ss === null || ss === undefined) ? d.ss : ss;
            SSS = (SSS === null || SSS === undefined) ? d.SSS : SSS;

            if (isNaN(yyyy)) {
                yyyy = d.yyyy;
                console.warn("输入的不是合法年份");
            }
            yyyy = parseInt(yyyy);
            if (yyyy < 1970) {
                yyyy = d.yyyy;
                console.warn("年份应该大于1970年");
            }

            if (isNaN(MM)) {
                MM = d.MM;
                console.warn("输入的不是合法月份");
            }
            MM = parseInt(MM);
            if (MM < 1 || MM > 12) {
                MM = d.MM;
                console.warn("月份应该是1~12之间");
            }

            if (isNaN(dd)) {
                dd = d.dd;
                console.warn("输入的不是合法天数");
            }
            dd = parseInt(dd);
            var totalDays = new Date(yyyy, MM, 0).getDate();
            if (dd < 1 || dd > totalDays) {
                dd = d.dd;
                console.warn("天数应该是1~" + totalDays + "之间");
            }

            if (isNaN(HH)) {
                HH = d.HH;
                console.warn("输入的不是合法小时");
            }
            HH = parseInt(HH);
            if (HH < 0 || HH > 23) {
                HH = d.HH;
                console.warn("小时应该是0~23之间");
            }

            if (isNaN(mm)) {
                mm = d.mm;
                console.warn("输入的不是合法分钟");
            }
            mm = parseInt(mm);
            if (mm < 0 || mm > 59) {
                mm = d.mm;
                console.warn("分钟应该是0~59之间");
            }

            if (isNaN(ss)) {
                ss = d.ss;
                console.warn("输入的不是合法秒数");
            }
            ss = parseInt(ss);
            if (ss < 0 || ss > 59) {
                ss = d.ss;
                console.warn("秒数应该是0~59之间");
            }

            if (isNaN(SSS)) {
                SSS = d.SSS;
                console.warn("输入的不是合法毫秒");
            }
            SSS = parseInt(SSS);
            if (SSS < 0 || SSS > 999) {
                SSS = d.SSS;
                console.warn("毫秒应该是0~999之间");
            }

            return new Date(yyyy, MM - 1, dd, HH, mm, ss, SSS);
        };

        /**
         * Date转换为指定日期格式的字符串。
         * @param {Date} date 日期
         * @param {String} [format] 转换格式（如果为空，默认为“yyyy-MM-dd HH:mm:ss”）
         * @return {String|null} 返回日期字符串
         */
        dataUtility.dateToString = function (date, format) {
            if (!tek.type.isDate(date) || !tek.type.isString(format))
                return null;

            format = format || "yyyy-MM-dd HH:mm:ss";

            // 年
            if (format.indexOf("yyyy") >= 0) {
                format = format.replace("yyyy", date.getFullYear());
            } else if (format.indexOf("yy") >= 0) {
                var year = date.getFullYear();
                if (typeof year == "number")
                    year = year % 100;
                format = format.replace("yy", year);
            }

            // 月
            if (format.indexOf("MM") >= 0) {
                var month = date.getMonth() + 1;
                if (month < 10)
                    month = "0" + month;
                format = format.replace("MM", month);
            }

            // 日
            if (format.indexOf("dd") >= 0) {
                var day = date.getDate();
                if (day < 10)
                    day = "0" + day;
                format = format.replace("dd", day);
            }

            // 时
            if (format.indexOf("HH") >= 0) {
                var hour = date.getHours();
                if (hour < 10)
                    hour = "0" + hour;
                format = format.replace("HH", hour);
            }

            // 分
            if (format.indexOf("mm") >= 0) {
                var minute = date.getMinutes();
                if (minute < 10)
                    minute = "0" + minute;
                format = format.replace("mm", minute);
            }

            // 秒
            if (format.indexOf("ss") >= 0) {
                var second = date.getSeconds();
                if (second < 10)
                    second = "0" + second;
                format = format.replace("ss", second);
            }

            return format;
        };

        /**
         * 取得指定时间段内包含的日期。
         * @param {Date|Number} start 起始日期（可以是long或Date）
         * @param {Date|Number} end 结束日期（可以是long或Date）
         * @return {Array} 返回包含的日期Date数组
         */
        dataUtility.getDays = function (start, end) {
            // 起始日期
            if (tek.type.isDate(start)) {
                start = start.getTime();
            } else if (tek.type.isNumber(start)) {
            } else {
                return null;
            }

            // 结束日期
            if (tek.type.isDate(end)) {
                end = end.getTime();
            } else if (tek.type.isNumber(end)) {
            } else {
                return null;
            }

            if (start > end)
                return null;

            var date = [];
            for (; start < end; start += 86400000)
                date.push(new Date(start));
            date.push(new Date(start));

            return date;
        };

        /**
         * 检验一个ip地址的字符串是否合法
         * @param {String} ip ip地址的字符串
         * @return {Boolean} 合法true,失败false
         */
        dataUtility.checkIpAddress = function (ip) {
            if (!ip || typeof ip != "string")
                return fakse;

            var array = dataUtility.stringToArray(ip.trim(), ".");
            if (!tek.type.isArray(array) || array.length != 4)
                return false;

            for (var i = 0; i < array.length; i++) {
                if (array[i].match(/[^\d]+/))
                    return false;
            }

            return true;
        };

        /**
         * IP地址转换为相应的长整数
         * @param {String} ipStr 字符串表示的IP地址。
         * @return {Number} 如果正确返回>=0的长整数，失败返回-1
         */
        dataUtility.ipToLong = function (ipStr) {
            var lip = -1;

            if (dataUtility.checkIpAddress(ipStr)) {
                lip = 0;

                var array = dataUtility.stringToArray(ipStr.trim(), ".");

                var count = 3;
                for (var i = 0; i < 4; i++) {
                    var value = parseInt(array[i]);
                    for (var j = 0; j < count; j++)
                        value *= 0x100;
                    lip += value;
                    count--;
                }
            }

            return lip;
        };

        /**
         * 长整数转换为相应的IP地址。
         * @param {Number} ipLong 表示的long型IP地址
         * @return {String} 如果失败返回null。
         */
        dataUtility.longToIp = function (ipLong) {
            var ipAddress = "";

            if (tek.type.isNumber(ipLong) && ipLong > -1) {
                for (var i = 3; i >= 0; i--) {
                    var count = 1;
                    for (var j = 0; j < i; j++)
                        count *= 0x100;

                    ipAddress += Math.floor(ipLong / count);
                    if (i != 0)
                        ipAddress += ".";
                    ipLong = ipLong % count;
                } // end for(int i=3; i>=0; i--)

                if (!dataUtility.checkIpAddress(ipAddress))
                    ipAddress = null;
            }

            return ipAddress;
        };

        /**
         * 复制source对象。
         * 如果target属性已经存在，将被source属性值覆盖。
         *
         * @param source
         *           源对象
         * @param target
         *           目标对象（如果为空，自动创建一个对象）
         * @return 返回赋值后的的对象。
         */
        dataUtility.objectCopy = function (source, target) {
            if(!source)
              return target;
            
            if(!target)
              target={};
            
            for (var key in source)
              target[key]=source[key];
          
            return target;
        };
        
        /**
         * 指定文件是否是网页页面
         * 包括：html、htm、xhtml、jsp、asp、aspx、php等
         * @param {String} fileName 文件名
         * @return {Boolean} 是返回true，否则false
         */
        dataUtility.isWebPage = function (fileName) {
            var flag = false;

            if (fileName && typeof fileName == "string") {
                var loc = fileName.lastIndexOf(".");

                if (loc > 0 && (loc + 1) < fileName.length) {
                    var suffix = fileName.substring(loc + 1).toLowerCase();
                    if (suffix == "html" || suffix == "htm" || suffix == "xhtml"
                        || suffix == "jsp" || suffix == "asp" || suffix == "aspx"
                        || suffix == "php")
                        flag = true;
                } // end if (loc > 0)
            } // end if (fileName != null)

            return flag;
        };

        /**
         * 指定文件是否是图片
         * @param {String} fileName 文件名
         * @return {Boolean} 是返回true，否则false
         */
        dataUtility.isPictureFile = function (fileName) {
            var flag = false;

            if (fileName && typeof fileName == "string") {
                var loc = fileName.lastIndexOf(".");

                if (loc > 0 && (loc + 1) < fileName.length) {
                    var suffix = fileName.substring(loc + 1).toLowerCase();
                    if (suffix == "bmp" || suffix == "gif"
                        || suffix == "jpg" || suffix == "jpeg" || suffix == "jpe"
                        || suffix == "png" || suffix == "pns")
                        flag = true;
                } // end if (loc > 0)
            } // end if (fileName != null)

            return flag;
        };

        /**
         * 取得密码强度等级。
         * @param {String} password 密码
         * @return {Number} 返回密码强度（0 - 弱； 1 - 中； 2 - 强）
         */
        dataUtility.getPasswordStrong = function (password) {
            var strong = 0;
            if (!password || password == "")
                return strong;

            var type = 0;    // 字符类型
            if (/\d/.test(password))
                type++;  //数字
            if (/[a-z]/.test(password))
                type++;  //小写字母
            if (/[A-Z]/.test(password))
                type++;  // 大写字母
            if (/\W/.test(password))
                type++; //非字母数字

            var diff = dataUtility.getDiffCharCount(password);    // 不同字符数
            var length = password.length;

            if (length < 6) {
                strong = 0;
            } else if (length >= 6 && length < 10) {
                if (type > 3 && diff >= 8)
                    strong = 1;
                else
                    strong = 0;
            } else {
                // 密码长度大于10
                if (type > 2) {
                    if (diff >= 8)
                        strong = 2;
                    else
                        strong = 1;
                } else if (type == 2) {
                    if (diff >= 8)
                        strong = 1;
                    else
                        strong = 0;
                } else {
                    strong = 0;
                }
            }

            return strong;
        };

        /**
         * 取得字符串中包含的不同字符的数量
         * @param {String} str 字符串
         * @return {Number} 返回不同字符的数量
         */
        dataUtility.getDiffCharCount = function (str) {
            if (!str || typeof str != "string")
                return 0;

            var s = "";

            for (var i = 0; i < str.length; i++) {
                var ch = str.charAt(i);
                if (s.indexOf(ch) < 0)
                    s += ch;
            }

            return s.length;
        };

        /**
         * 判断密码是否合法
         * @param {String} password 密码
         * @return {String|null} 合法返回null，否则返回提示信息
         */
        dataUtility.isCertificatePassword = function (password) {
            var initial = "密码不符合规则,首位必须为字母或数字！";
            var sameAlp = "密码不符合规则,不能使用单一字符！";
            var seriesAlp = "密码不符合规则,不能为顺序字符！";
            var Num = "密码不符合规则,不能全部为数字！";

            //全部重复
            var repeat = true;
            // 连续字符
            var series = true;

            var len = password.length;
            var first = password.charAt(0);
            for (var i = 1; i < len; i++) {
                repeat = repeat && password.charAt(i) == first;
                series = series && password.charCodeAt(i) == password.charCodeAt(i - 1) + 1;
            }

            if (!(/^(\w)/.test(password)))//必须以数字、大小写字母或'_'开头
                return initial;
            else if (/^[0-9]{6,24}$/.test(password))//	密码位数10~24位
                return Num;
            else if (repeat)  //全部重复
                return sameAlp;
            else if (series)  // 连续字符
                return seriesAlp;
            else
                return null;
        };

        /**
         * 指定字符串是否是合法格式的电子邮箱
         * @param {String} email 电子邮箱
         * @return {Boolean} 合法返回true，否则false
         */
        dataUtility.isCertificateEmail = function (email) {
            var reg = /^([a-zA-Z0-9]+[-|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-|_|.]?)*[a-zA-Z0-9]+\.[a-z]+$/;
            return !!email && typeof email == "string" && reg.test(email);
        };

        /**
         * 指定字符串是否是合法格式的电话号码
         * @param {String} phone 电话号码
         * @return {Boolean} 合法返回true，否则false
         */
        dataUtility.isCertificatePhone = function (phone) {
            var reg = /^([\(]?\+[\d]{2,3}[\)]?[-|]?[\s]*)?([\(]?[\d]{1,4}[\)]?[-]?[\s]*)?[\d*#pP]+$/;
            return !!phone && typeof phone == "string" && reg.test(phone);
        };

        /**
         * 修正加载的HTML页面代码
         * 1、只保留 <body> 内的编码
         * 2、删除 <script> 代码
         *
         * @param {String} html HTML代码
         * @return {String} 返回修正后的字符串
         */
        dataUtility.checkLoadHTML = function (html) {
            if (!html || typeof html != "string")
                return html;

            // 去除<body>之外的字符串
            var loc = html.indexOf("<body");
            if (loc > 0) {
                html = html.substring(loc + 5);
                loc = html.indexOf(">");
                if (loc >= 0)
                    html = html.substring(loc + 1);

                loc = html.lastIndexOf("</body>");
                if (loc >= 0)
                    html = html.substring(0, loc);
            } // end if(loc>0)
            // 去除<script>
            var start = 0;
            var end = 0;
            while ((start = html.indexOf("<script")) >= 0) {
                end = html.indexOf("</script>");

                if (end > start) {
                    var str = html.substring(0, start) + html.substring(end + 9);
                    html = str;
                } else
                    break;
            } // end while((loc=html.indexOf("<script")>=0)

            return html;
        };

    })(tek.dataUtility);

})();


//======================================================================================================================
//==========================注意：下面的代码为了兼容现有的函数调用暂时保留，后期修改完成后删除======================================
//===========================================类型判断使用 tek.type.isXxx（）；===============================================
//======================================================================================================================
/**
 * 变量是否为空
 *
 * @param p
 *           变量
 * @return 如果为空，返回true；否则，返回false。
 */
tek.dataUtility.isNull=function(p) {
  if (p==undefined || p==null || p=="undefined" || p=="")
    return true;
  else
    return false;
}
