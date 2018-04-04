/**
 * Created by zhangjiachao on 2015/11/27.
 * company: tekinfo
 */
/***************************************************************************************************
 * tek 通用方法
 *
 *-------------------------------------------------------------------------------------------------
 * tek.type 类型判断集合，返回boolean值
 *      isNull(v); -
 *      isUndefined(v); -
 *      isNumber(v); -
 *      isBoolean(v); -
 *      isString(v); -
 *      isDate(v); -
 *      isArray(v); -
 *      isFunction(v); -
 *      isObject(v); -
 *      isElement(v); - 是否为DOM的Element对象类型
 *      isRegexp(v); - 是否为正则表达式类型
 *      isPrimitive(v); - 是否为原始数据类型（String、Number、Boolean）
 *      isEmpty(v); - 是否为空对象（null和undefined和数组的长度为0或空字符串("") 返回true）
 *      isArguments(v); - 是否为参数管理器Arguments
 *      isIterable(v); - 是否为迭代序列（包含Array与Arguments）
 *
 * tek.Utils ipass工具箱
 *      clone(obj); - 克隆对象
 *      type(v); - 类型判断，返回数据类型的字符串形式 如：Number类型返回 'number'
 *      print(obj); - 对象遍历打印输出
 *      getDeviceSize(); - 获取设备尺寸{width, height}
 *      check(string, regexp); - 字符串校验，根据指定的正则表达式
 *      convert(num, originRadix, targetRadix); - 进制转化（只支持2/8/10/16之间相互转化）
 *      calculateFloat(num1, operator, num2, fractionDigits); - 运算浮点数（十进制）
 *      mergeForObject(target, obj1, ...); - 对象合并（把第二个及后面所有的对象参数合并到第一个对象target上，如果存在相同键，后面的覆盖前面的）
 *      getFromJSON(element); - 获取DOM元素（作为一个虚拟from表单）中所有的输入框数据
 *      encodeJSON(obj); - 对JSON数据进行编码（用 encodeURIComponent 编码）
 *      decodeJSON(obj); - 对JSON数据进行解码（用 decodeURIComponent 解码）
 *
 * tek.toast toast提示框
 *      show(msg, [options]); - toast显示  options.duration指定多长时间时间后自动隐藏
 *
 *
 ***************************************************************************************************/



(function() {

    // Create global tek obj and its namespaces
    window.tek = window.tek || {};
    window.tek.version = '1.0.1';

    // js 中数据类型判断 返回 boolean 类型值
    (function(tek, undefined){
        tek.type = {};

        //检测v的类型 辅助函数
        var type = function(v){
            return Object.prototype.toString.call(v);
        };

        /**
         * 是否为null 如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isNull = function(v){
            return v === null;
        };
        /**
         * 是否为undefined 如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isUndefined = function(v){
            return v === undefined;
        };
        /**
         * 是否为数字类型(为Number且不为正负无穷大数字) 如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isNumber = function(v){
            return typeof v === 'number' || isFinite(v);
        };
        /**
         * 是否为布尔值类型  如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isBoolean = function(v){
            return typeof v === 'boolean';
        };
        /**
         * 是否为字符串类型 如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isString = function(v){
            return typeof v === 'string';
        };
        /**
         * 是否为日期类型  如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {boolean}
         */
        tek.type.isDate = function(v){
            return type(v) === '[object Date]';
        };
        /**
         * 是否为数组对象类型  如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean} 结果
         */
        tek.type.isArray = function(v){
            return type(v) === '[object Array]';
        };
        /**
         * 是否为函数类型 如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isFunction = function(v){
            return type(v) === '[object Function]';
        };
        /**
         * 是否为对象类型
         * @param {Any} v 被检测的变量
         * @return {boolean}
         */
        tek.type.isObject = function(v){
            return !!v && type(v) === '[object Object]';
        };
        /**
         * 是否为DOM的Element对象类型
         * @param {Any} v 被检测的变量
         * @returns {boolean}
         */
        tek.type.isElement = function (v) {
            return !!v && typeof v === "object" && !!v.nodeName;
        };
        /**
         * 是否为正则表达式类型  如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isRegexp = function(v){
            return type(v) == '[object RegExp]';
        };
        /**
         * 是否为原始数据类型 如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isPrimitive = function(v){
            return tek.type.isString(v) || tek.type.isNumber(v) || tek.type.isBoolean(v);
        };
        /**
         * 是否为空对象 null和undefined和数组的长度为0或空字符串("") 如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @param {Boolean} [allowBlankStr] 默认false 空字符串认为是空对象 反之 空字符串不认为是空对象
         * @return {Boolean}
         */
        tek.type.isEmpty = function(v, allowBlankStr){
            return v === null || v === undefined || (tek.type.isArray(v) && !v.length) || (!allowBlankStr ? v === '' : false);
        };
        /**
         * 是否为参数管理器Arguments 如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isArguments = function(v){
            return  v !== undefined && v !== null && v.callee != undefined;
        };
        /**
         * 是否为迭代序列 包含Array与Arguments 如果是就返回true 如果不是就返回false
         * @param {Any} v 被检测的变量
         * @return {Boolean}
         */
        tek.type.isIterable = function(v){
            return tek.type.isArray(v) || tek.type.isArguments(v);
        };
    })(window.tek);

    // ipass工具箱
    window.tek.Utils = {};
    (function (Utils) {
        /**
         * 克隆对象
         * @param {Any} obj 要克隆的对象
         * @return {Any} 克隆好的对象
         */
        Utils.clone = function (obj) {
            var o;
            switch (typeof obj) {
                case 'undefined':
                    break;
                case 'string'   :
                    o = obj + '';
                    break;
                case 'number'   :
                    o = obj - 0;
                    break;
                case 'boolean'  :
                    o = obj;
                    break;
                case 'object'   :
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var k in obj) {
                                o[k] = this.clone(obj[k]);
                            }
                        }
                    }
                    break;
                default:
                    o = obj;
                    break;
            }
            return o;
        };

        /**
         * 类型判断，返回数据类型的字符串形式<br>
         *  数字类型:"number" <br>
         *  布尔类型:"boolean" <br>
         *  字符串类型:"string" <br>
         *  数组类型:"array"<br>
         *  日期类型:"date"<br>
         *  正则表达式类型:"regexp" <br>
         *  函数类型:"function"<br>
         *  对象类型:"object"<br>
         *  参数管理器类型:"arguments"<br>
         *  其他类型:"unknow"
         * @param {Any} v 被检测的变量
         * @return {String}
         */
        Utils.type = function(v){
            var result = "unknow";
            if (tek.type.isNumber(v)) {
                result = "number";
            }
            if (tek.type.isBoolean(v)) {
                result = "boolean";
            }
            if (tek.type.isString(v)) {
                result = "string";
            }
            if (tek.type.isArray(v)) {
                result = "array";
            }
            if (tek.type.isDate(v)) {
                result = "date";
            }
            if (tek.type.isRegexp(v)) {
                result = "regexp";
            }
            if (tek.type.isFunction(v)) {
                result = "function";
            }
            if (tek.type.isObject(v)) {
                result = "object";
            }
            if (tek.type.isArguments(v)) {
                result = "argumetns";
            }
            return result;
        };


        var LEVEL = {
            L: "LOG",
            E: "ERROR",
            W: "WARN",
            I: "INFO",
            D: "DEBUG"
        };
        /**
         * 对象遍历打印输出
         * @param {String} [level] 等级 [L,E,W,I,D] 默认 D
         * @param {Any} obj 遍历的对象
         * @return {String} obj对象的string信息 <对象类型>{对象值}
         */
        Utils.print = function(level, obj) {
            if (obj) {
                level = LEVEL[level.toUpperCase()] || LEVEL['D'];
            } else {
                obj = level;
                level = null;
            }

            var typeCheck = function (v) {
                var s = '';
                if (v === null) {
                    s = 'null';
                } else if (v === undefined) {
                    s = 'undefined';
                } else if (tek.type.isDate(v)) {
                    s = '[Date]' + v.toString();
                } else if (tek.type.isArray(v)) {
                    s = '[' + v.toString() + ']';
                } else if (tek.type.isFunction(v)) {
                    s = v.toString().match(/function( |[a-zA-Z0-3])*\(.*\)/ig)[0] + '{}';
                } else if (tek.type.isObject(v)) {
                    s = v.toString();
                } else {// string，number，boolean regexp
                    s = v;
                }
                return s;
            };

            var objType = this.type(obj);
            objType = objType.substring(0,1).toUpperCase() + objType.substring(1);

            var ss = '<' + objType + '>{ ';
            switch (objType) {
                case 'String':
                    ss += '"' + obj + '"';
                    break;
                case 'Function':
                    ss += obj.toString().match(/function( |[a-zA-Z0-3])*\(.*\)/ig)[0] + '{}';
                    break;
                case 'Array':
                case 'Object':
                case 'Argumetns':
                    for (var key in obj)
                        ss += key + ':' + typeCheck(obj[key]) + ', ';
                    ss = (ss.charAt(ss.length - 2) == ',') ? ss.substring(0, ss.length - 2) : ss;
                    break;
                default : //'Unknow' 'Number' 'Boolean' 'Date' 'Regexp'
                    ss += obj;
                    break;
            }
            ss += ' }';

            switch (level) {
                case 'LOG':
                    console.log(level + ' - ' + ss);
                    break;
                case 'ERROR':
                    console.error(level + ' - ' + ss);
                    break;
                case 'WARN':
                    console.warn(level + ' - ' + ss);
                    break;
                case 'INFO':
                    console.info(level + ' - ' + ss);
                    break;
                case 'DEBUG':
                    console.debug(level + ' - ' + ss);
                    break;
                default : break;
            }
            return ss;
        };

		/**
		 * 获取设备尺寸
		 * @returns {{width: (number|Number), height: (number|Number)}}
		 */
        Utils.getDeviceSize = function () {
            return {
                width: document.documentElement.clientWidth || window.innerWidth,
                height: document.documentElement.clientHeight || window.innerHeight
            };
        };

		/**
		 * 字符串校验，根据指定的正则表达式
		 * @param {String} string 要被校验的字符串
		 * @param {RegExp} regexp 校验规则（正则表达式）
		 * @returns {boolean} 成功返回true，否则返回false
		 */
		Utils.check = function (string, regexp) {
			if (tek.type.isString(string) && tek.type.isRegexp(regexp)) {
				return regexp.test(string);
			} else {
				return false;
			}
		};

		/**
		 * 进制转化（只支持2/8/10/16之间相互转化）
		 * @param {Number | String} num 要转化的数字，可以是数字字符串
		 * @param {Number} [originRadix] 要转化数字num的当前进制（默认10进制）
		 * @param {Number} [targetRadix] 被转化成的目标进制（默认10进制）
		 * @returns {string} 以字符串形式返回
		 */
		Utils.convert = function (num, originRadix, targetRadix) {
			if (tek.type.isEmpty(num))
				return num;
			
			if (tek.type.isUndefined(originRadix) || tek.type.isNull(originRadix) || originRadix == 0)
                originRadix = 10;
			if (tek.type.isUndefined(targetRadix) || tek.type.isNull(targetRadix) || targetRadix == 0)
				targetRadix = 10;

            originRadix = parseInt(originRadix);
			targetRadix = parseInt(targetRadix);

			if ((originRadix == 2 || originRadix == 8 || originRadix == 10 || originRadix == 16)
				&& (targetRadix == 2 || targetRadix == 8 || targetRadix == 10 || targetRadix == 16)) {
				var out = parseInt(num, originRadix);
				if (!isNaN(out)) {
					out = out.toString(targetRadix);
					switch (targetRadix) {
						case 2:
							break;
						case 8:
							out = "0" + out;
							break;
						case 10:
							break;
						case 16:
							out = (((out.length % 2) > 0) ? "0x0" : "0x") + out;
							break;
					}
				} else {
					out = out.toString();
				}
				return '' + out;
			} else {
				return '' + num;
			}
		};

        /**
         * 运算浮点数（十进制）
         * 计算的精度自动采用输入的num1、num2的最大的精度（小数点后的位数）运算
         *
         * @param {Number} num1 运算的第一个浮点数
         * @param {String} operator 运算符号，[+ - * /] 中的一个
         * @param {Number} num2 运算的第二个浮点数
         * @param {Number} [fractionDigits] 指定返回的数字的小数部分的位数，>=0的整数。如果不输入，或<0，返回实际运算结果
         * @returns {null | Number | String} 运算的浮点数
         */
        Utils.calculateFloat = function (num1, operator, num2, fractionDigits) {
            if (!isFinite(num1)) {
                //console.error('输入的运算浮点数 num1 不是一个有效数字。');
                return null;
            }
            num1 = parseFloat(num1);

            if (!isFinite(num2)) {
                //console.error('输入的运算浮点数 num2 不是一个有效数字。');
                return null;
            }
            num2 = parseFloat(num2);

            var p1 = '' + num1;
            p1 = p1.indexOf('.') > 0 ? p1.length - p1.indexOf('.') - 1 : 0;
            var p2 = '' + num2;
            p2 = p2.indexOf('.') > 0 ? p2.length - p2.indexOf('.') - 1 : 0;

            var precision = Math.max(parseInt(p1), parseInt(p2));
            precision = precision < 0 ? 0 : precision;
            precision = Math.pow(10, precision);

            num1 = parseInt(num1 * precision);
            num2 = parseInt(num2 * precision);

            var v = null;
            switch (operator) {
                case '+':
                    v = num1 + num2;
                    v /= precision;
                    break;
                case '-':
                    v = num1 - num2;
                    v /= precision;
                    break;
                case '*':
                    v = num1 * num2;
                    v /= precision * precision;
                    break;
                case '/':
                    v = num1 / num2;
                    break;
                default :
                    console.error('输入的运算符 operator=' + operator +' 无效。应该为 [+ - * /] 中的一个。');
                    break;
            }
            if (isFinite(fractionDigits) && fractionDigits >= 0)
                v = v.toFixed(parseInt(fractionDigits));
            return v;
        };

        /**
         * 对象合并（把第二个及后面所有的对象参数合并到第一个对象target上，如果存在相同键，后面的覆盖前面的）
         * @param {object} target 要合并到的对象
         * @param {Object} [obj1] 合并来源，多个对象的话 [, obj1][, obj2], ...
         * @returns {Object|null} 返回合并后的对象
         */
        Utils.mergeForObject = function (target, obj1) {
            if (arguments.length <= 0)
                return null;
            else if (arguments.length == 1)
                return target;
            else if (arguments.length > 1) {
                target = tek.type.isObject(target) ? target : {'_target': target};
                var l = arguments.length;
                for (var i = 0; i < l; i++) {
                    var o =  arguments[i];
                    if (!tek.type.isObject(o))
                        continue;
                    for (var key in o)
                        target[key] = o[key];
                }
                return target;
            }
        };

        /**
         * 获取DOM元素（作为一个虚拟from表单）中所有的输入框数据
         * （注意: checkbox 返回是数组类型）
         * @param {Element} element DOM元素
         * @returns {Object} 返回JSON格式的对象，可能为{}
         */
        Utils.getFromJSON = function (element) {
            var params = {};

            if (!element || !(element instanceof Element))
                return params;

            var nodeRegexp = /(INPUT|SELECT|TEXTAREA)/;
            var typeRegexp = /(button|reset|submit)/i; //input这些类型不处理

            var each = function (eles) {
                if (!eles || !eles.length)
                    return;

                for (var i = 0; i < eles.length; i++) {
                    var ele = eles[i];
                    if (!ele || !(ele instanceof Element))
                        continue;

                    if (nodeRegexp.test(ele.nodeName)) {
                        var type = ele.type, name = ele.name, value = ele.value;
                        if (type && !typeRegexp.test(type) && name) {
                            if (type == 'radio') {
                                params[name] = params[name] || '';
                                if (ele.checked)
                                    params[name] = value;
                            } else if (type == 'checkbox') {
                                params[name] = params[name] || [];
                                if (ele.checked)
                                    params[name].push(value);
                            } else {
                                params[name] = value;
                            }
                        }
                    } else {
                        if (ele.children && ele.children.length)
                            each(ele.children);
                    }
                }
            };

            each(element.childNodes);

            return params;
        };

        /**
         * 对JSON数据进行编码（用 encodeURIComponent 编码）
         * （注意：方法执行前会先拷贝一个obj对象，对拷贝的对象进行编码，不会破坏原数据）
         * @param {Object} obj 要进行编码的JSON数据
         * @returns {Object} 返回编码后的obj对象
         */
        Utils.encodeJSON = function (obj) {
            if (!tek.type.isObject(obj))
                return obj;

            var o = Utils.clone(obj);

            for (var k in o) {
                var v = o[k];
                if (!v)
                    continue;

                if (tek.type.isObject(v))
                    o[k] = Utils.encodeJSON(v);
                else if (tek.type.isString(v))
                    o[k] = encodeURIComponent(v);
            }

            return o;
        };

        /**
         * 对JSON数据进行解码（用 decodeURIComponent 解码）
         * （注意：方法执行前会先拷贝一个obj对象，对拷贝的对象进行解码，不会破坏原数据）
         * @param {Object} obj 要进行编码的JSON数据
         * @returns {Object} 返回编码后的obj对象
         */
        Utils.decodeJSON = function (obj) {
            if (!tek.type.isObject(obj))
                return obj;

            var o = Utils.clone(obj);

            for (var k in o) {
                var v = o[k];
                if (!v)
                    continue;

                if (tek.type.isObject(v))
                    o[k] = Utils.decodeJSON(v);
                else if (tek.type.isString(v))
                    o[k] = decodeURIComponent(v);
            }

            return o;
        };
    })(window.tek.Utils);


    (function (tek) {
        /**
         * 显示 toast 提示框
         * @type {{show: Function}}
         */
        tek.toast = {
            show: function (msg, options) {
                var duration = (options && options.duration && isNaN(duration)) ? options.duration : 3000;

                var ele = document.createElement('div');
                ele.innerHTML = msg;
                ele.style.cssText = "width:60%; min-width:150px; background:#000; opacity:0.65; height:40px; color:#fff; line-height:40px; text-align:center; border-radius:5px; position:fixed; top:70%; left:20%; z-index:999999; font-weight:bold;";
                document.body.appendChild(ele);
                setTimeout(function () {
                    var d = 0.5;
                    ele.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                    ele.style.opacity = '0';
                    setTimeout(function () {
                        document.body.removeChild(ele)
                    }, d * 1000);
                }, duration);
            }
        };

    })(window.tek);


})();
