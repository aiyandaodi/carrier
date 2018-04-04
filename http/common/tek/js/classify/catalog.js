// JavaScript Document
/**
 * Created by ZERO on 2016/9/12.
 */
/*************************************************************
 * Name: catalog
 *  Belong to Page:
 *  Description: 对象目录分类操作js包。
 *      1、本包依赖于 jQuery.js、tool.js、common.js、dataUtility.js 文件
 *      2、目录树的加载采用异步加载，所以特别注意
 *      3、该对象放在全局命名域tek下，调取可以直接使用tek.catalog.xxx
 *
 *  说明：
 *      1、编码方式（option.tree）是杜威（Dewey），层级（node.level）等于深度（option.depth），node.isParent=false，其他为true；
 *         否侧，node.children存在子节点，node.isParent=true，其他为false。
 *
 * -----------------------------------------------------------
 * 对象：tek.catalog （该对象放在全局命名域tek下）
 *  属性：
 *      params - 包含必要参数
 *      option - 包含目录分类在ObjectOption中的参数配置
 *  方法：
 *      init([Object] params, [Object] setting) - 初始化。params中必须包含object、owner两个参数
 *      getInstance() - 获取一个Node实例对象。
 *      getNodes() - 获取节点对象。回调函数传入nodes参数
 *      getNodeByParam([String] key, [Any] value) - 获取匹配的第一个节点对象，根据参数。
 *      getNodesByParam([String] key, [Any] value) - 获取匹配的所有节点对象，根据参数
 *      addNodes([Node] newNode) - 添加节点。参数为Node对象
 *
 *************************************************************/
(function () {
	// Create global tek obj and its namespaces
	window.tek = window.tek || {};

	// 目录分类对象：tek.catalog
	window.tek.catalog = {};
	(function (ct) {
		/**
		 * 参数
		 * @type {{objectName: string, object: string, owner: string, ONCE_COUNT: number, URL: string}}
		 */
		ct.params = {
			objectName: "ObjectCatalog", // 对象名
			object: "", // 所属对象名
			owner: "", // 所有者id

			ONCE_COUNT: 50, // 每次请求读取记录条数
			select: "catalog_code,catalog_name,catalog_object,booking", // 获取信息
			URL: tek.common.getRootPath() + "servlet/tobject"
		};

		/**
		 * 当前对象的目录分类的参数配置选项
		 * @type {{config: null, base: null, depth: number, digit: number, step: number, tree: null}}
		 */
		ct.option = {
			config: null,  //目录树配置
			base: null,  //编码前缀
			depth: 0, //分级数（大于0整数）
			digit: 0, //分级位数（大于0整数）
			step: 0,  //同级步长（大于0整数）
			tree: null  //编码分级方式（'default'或'dewey'两种，默认 default）
		};

		/**
		 * 设置
		 * @type {{load: {async: boolean}, callback: {success: null, error: null}}}
		 * @private
		 */
		var _setting = {
			// ajax读取目录树数据
			load: {
				async: true, // 是否是异步加载，默认true（是）
                isAll: false // 是否获取所有（这里指的是禁用的目录，false获取非禁用的目录树，true获取禁用与非禁用的目录树）
			},
			// 回调函数
			callback: {
				success: null, // 成功回调
				error: null // 错误回调
			}
		};

		/**
		 * 初始化
		 * @param {Object} params
		 * @param {Object} setting
		 * @returns {{flag: (Boolean), message: (String)}} flag=true表示初始化成功，否则失败
		 */
		ct.init = function (params, setting) {
			NODE = [];
			//初始化配置参数
			initObjectOptionParam();

			var re = initParams(params);
			if (!re || !re.flag)
				return re;

			re = initSetting(setting);
			if (!re || !re.flag)
				return re;

			return {flag: true, message: "初始化成功！"}
		};

		// 初始化参数
		function initParams(params) {
			if (!params || !tek.type.isObject(params))
				return {flag: false, message: "请传入json形式的 params 参数！"};

			if (tek.type.isEmpty(params.object) || tek.type.isEmpty(params.owner))
				return {flag: false, message: "params 参数中，所属对象(object)为空或所有者(owner)为空。"};
			if (!tek.type.isString(params.object) || !tek.type.isString(params.owner))
				return {flag: false, message: "params 参数中，所属对象(object)和所有者(owner)值要是字符串。"};

			ct.params.object = params.object;
			ct.params.owner = params.owner;
			//获取option中相应配置参数
			var re = getObjectOptionParam();

			if (re && re.flag === false)
				return {flag: false, message: re.message};

			// 校验允许公共目录还是私有目录
			if (tek.type.isEmpty(ct.option.config)) {
				return {flag: false, message: "获取option中配置参数(catalog_config)为空！"};
			} else {
				if (ct.option.config == '0x00' && ct.params.owner != 0) {
					return {flag: false, message: "该对象目录分类只允许定义公共目录！"};
				}
				if (ct.option.config == '0x01' && ct.params.owner == 0) {
					return {flag: false, message: "该对象目录分类只允许定义私有目录！"};
				}

				// 校验编码配置参数
				if (!tek.type.isString(ct.option.base)) {
					return {flag: false, message: "获取option中配置参数(catalog_base)不合要求！"};
				}
				if (!tek.type.isNumber(ct.option.depth) || ct.option.depth <= 0) {
					
					return {flag: false, message: "获取option中配置参数(catalog_depth)不合要求！"};
				}
				if (!tek.type.isNumber(ct.option.digit) || ct.option.digit <= 0) {
					return {flag: false, message: "获取option中配置参数(catalog_digit)不合要求！"};
				}
				if (!tek.type.isNumber(ct.option.step) || ct.option.step <= 0) {
					return {flag: false, message: "获取option中配置参数(catalog_step)不合要求！"};
				}
				if (ct.option.tree != 'default' && ct.option.tree != 'dewey') {
					return {flag: false, message: "获取option中配置参数(catalog_tree)不合要求！"};
				}

				return {flag: true, message: "初始化 params 成功！"};
			}
		}

		// 初始化设置
		function initSetting(setting) {
			if (!setting || !tek.type.isObject(setting))
				return {flag: false, message: "请传入json形式的 setting 参数！"};

			if (setting.load) {
                _setting.load.async = !!setting.load.async;

                _setting.load.isAll = !!setting.load.isAll;
            }

			if (setting.callback) {
				if (tek.type.isFunction(setting.callback.success))
					_setting.callback.success = setting.callback.success;
				if (tek.type.isFunction(setting.callback.error))
					_setting.callback.error = setting.callback.error;
			}

			return {flag: true, message: "初始化 setting 成功！"};
		}

		//初始化配置参数
		function initObjectOptionParam() {
			ct.option.config = null;
			ct.option.base = null;
			ct.option.depth = 0;
			ct.option.digit = 0;
			ct.option.step = 0;
			ct.option.tree = null;
		}

		// 获取option中相应配置参数
		function getObjectOptionParam() {
			var re = {flag: false, message: ""};

			var sendData = {};
			sendData["objectName"] = ct.params.objectName;
			sendData["action"] = "readInfo";
			sendData["read-option"] = 1;
			sendData["catalog_object"] = ct.params.object;

			$.ajax({
				async: false,
				type: "post",
				url: ct.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						console.log(data)
						if (data.code == 0) {
							var record = data["record"];
							record = record || {};

							if (record.catalog_config) {
								var value = record.catalog_config.value;
								ct.option.config = (value == '0x00' || value == '0x01') ? value : "0x00";
							}
							if (record.catalog_base) {
								var value = record.catalog_base.value;
								ct.option.base = !!value ? value : "";
							}
							if (record.catalog_depth) {
								var value = record.catalog_depth.value;
								ct.option.depth = (value > 0) ? parseInt(value) : 0;
							}
							if (record.catalog_digit) {
								var value = record.catalog_digit.value;
								ct.option.digit = (value > 0) ? parseInt(value) : 0;
							}
							if (record.catalog_step) {
								var value = record.catalog_step.value;
								ct.option.step = (value > 0) ? parseInt(value) : 0;
							}
							if (record.catalog_tree) {
								var value = record.catalog_tree.value;
								ct.option.tree = (value == 'default' || value == 'dewey') ? value : "default";
							}

							re.flag = true;
							re.message = "获取option中相应配置参数，操作成功。"
						} else {
							re.message = data.code + " - " + tek.dataUtility.stringToHTML(data.message);
						}
					} else {
						re.message = "操作失败![data=null]";
					}
				},
				error: function (request) {
					re.message = "执行失败![" + request.status + " - " + request.statusText + "]";
				}
			});

			return re;
		}

		// 目录结构全局对象
		var NODE = [];

		/**
		 * 节点模板
		 * @returns {{id: id值, code: 编码, pCode: 父节点编码, name: 名称, object: 所属对象名, owner: 所有者id, level: 层级, isParent: 是否是父目录, children: 子节点对象}}
		 * @constructor {Node}
		 */
		var Node = function () {
			this.id = "";     // id值（唯一）
			this.code = "";   // 编码（唯一）
			this.pCode = "";  // 父节点编码（不唯一）
			this.name = "";   // 名称（不唯一）
			this.object = ""; // 所属对象名（不唯一）
			this.owner = "";  // 所有者id，0表示公共（不唯一）
			this.level = 0;   // 层级（不唯一）
			this.booking = false;   // 是否是禁用的（不唯一）
			this.right = 0;   // 权限值（不唯一）
			this.isParent = false; // 是否是父目录，true-父目录，false-叶子目录（不唯一）
			this.children = [];   // 子节点对象
		};

		/**
		 * 获取一个Node实例对象
		 * @returns {Node}
		 */
		ct.getInstance = function () {
			return new Node();
		};

		/**
		 * 获取节点对象，执行回调，success 传入node对象参数，error 传入错误信息参数
		 */
		ct.getNodes = function () {
            // 如果NODE中数据已经存在，就无需再次获取
            if (NODE && NODE.length) {
                if (typeof _setting.callback.success === "function") {
                    _setting.callback.success(NODE);
                }
                return;
            }

			// 构造一个虚拟的根父节点编码
			var rootCode = "";
			if (ct.option.tree == 'dewey') {
				rootCode = ct.option.base;
				for (var i = 0; i < ct.option.depth * ct.option.digit; i++)
					rootCode += "0";
			} else if (ct.option.tree == 'default') {
				rootCode = ct.option.base;
			}

			// 取得目录对象列表
			getObjectCatalogList(rootCode, 0,
				function () {
					if (typeof _setting.callback.success === "function") {
						_setting.callback.success(NODE);
					}
				},
				function (errorMsg) {
					if (typeof _setting.callback.error === "function") {
						_setting.callback.error(errorMsg);
					}
				});

		};

		/**
		 * 获取匹配的第一个节点对象，根据参数
		 * @param {String} key Node对象的参数键
		 * @param {Any} value 参数键对应值
		 * @returns {null | Node}
		 */
		ct.getNodeByParam = function (key, value) {
			var n = null;
			var recursiveQuery = function (nodes) {
				if (!tek.type.isArray(nodes) || nodes.length <= 0)
					return;
				for (var i in nodes) {
					if (nodes[i][key] === value) {
						n = nodes[i];
					} else {
						if (nodes[i].children.length > 0)
							recursiveQuery(nodes[i].children);
					}

					if (!!n)
						return;
				}
			};

			if (tek.Utils.type(key) === "string" && !!key && (value != null && value != undefined))
				recursiveQuery(NODE);

			return n;
		};

		/**
		 * 获取匹配的所有节点对象，根据参数
		 * @param {String} key Node对象的参数键
		 * @param {Any} value 参数键对应值
         * @param {Node} [originNode] 要查询的源节点（在此节点中查询筛选，为空时在NODE中查询）
		 * @returns {Array} length有可能为0
		 */
		ct.getNodesByParam = function (key, value, originNode) {
			var ns = [];
			var recursiveQuery = function (nodes) {
				if (!tek.type.isArray(nodes) || nodes.length <= 0)
					return;
				for (var i in nodes) {
					if (nodes[i][key] === value)
						ns.push(nodes[i]);

					if (nodes[i].children.length > 0)
						recursiveQuery(nodes[i].children);
				}
			};

			if (tek.Utils.type(key) === "string" && !!key && (value != null && value != undefined)) {
                if (originNode && originNode.constructor === Node)
                    recursiveQuery([originNode]);
                else
                    recursiveQuery(NODE);
            }

			return ns;
		};

		/**
		 * 添加节点
		 * @param {Node} newNode 要添加的新节点
		 * @returns {boolean}
		 */
		ct.addNodes = function (newNode) {
			if (newNode.constructor !== Node)
				return true;

			if (newNode.level == 1) {
				NODE.push(newNode);
				return true;
			} else {
				if (!!newNode.pCode) {
					var pNode = ct.getNodeByParam("code", newNode.pCode);
					if (!!pNode) {
						pNode.children.push(newNode);
                        if (ct.option.tree != 'dewey')
                            pNode.isParent = true;
						return true;
					}
				}
				return false;
			}
		};


		// 取得目录对象列表
		function getObjectCatalogList(parentCode, skip, success, error) {
			if (tek.type.isEmpty(parentCode, true))
				return;

			skip = (isNaN(skip) || skip < 0) ? 0 : skip;
			var errorMsg = "", isFinish = false;

			var sendData = {};
			sendData["objectName"] = ct.params.objectName;
			sendData["action"] = "getList";
			sendData["catalog_object"] = ct.params.object;
			sendData["catalog_owner"] = ct.params.owner;
			sendData["reference-code"] = parentCode;
			sendData["show-tree"] = 1;
			sendData["read-all-down"] = 1;
            if (!_setting.load.isAll)
                sendData["booking"] = 0;

			sendData["order"] = "catalog_code";
			sendData["skip"] = skip;
			sendData["count"] = ct.params.ONCE_COUNT;

			$.ajax({
				async: _setting.load.async,
				type: "post",
				url: ct.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							// 操作成功
							var records = data["record"];
							if (records) {
								records = tek.type.isArray(records) ? records : [records];

								for (var i in records)
									saveObjectCatalogNode(records[i], data.right);
								
								if (records.length >= sendData["count"]) {
									skip += records.length;
									getObjectCatalogList(parentCode, skip, success, error);
								} else {
									isFinish = true;
								}
							}
						} else {
							// 操作错误
							errorMsg = data.code + " - " + tek.dataUtility.stringToHTML(data.message);
						}
					} else {
						// 操作失败
						errorMsg = "操作失败![data=null]";
					} // end if (data) else
				}, //end success: function(data)
				error: function (request) {
					errorMsg = "执行失败![" + request.status + " - " + request.statusText + "]";
				},
				complete: function () {
					if (isFinish && typeof success === "function") {
						success();
					}
					if (!isFinish && !!errorMsg && typeof error === "function") {
						error(errorMsg);
					}
				}
			});
		}

		// 保存节点
		function saveObjectCatalogNode(record, right) {
			if (!record || !tek.type.isObject(record) || !record.catalog_code)
				return;

			var newNode = new Node();
			newNode.id = record.id;
			newNode.code = record.catalog_code.value;
			newNode.pCode = getParentCode(newNode.code);
			newNode.name = !!record.catalog_name ? record.catalog_name.value : "";
			//newNode.object = !!record.catalog_object ? record.catalog_object.value : "";
			//newNode.owner = !!record.catalog_owner ? record.catalog_owner.value : "0";
			newNode.level = getDepthOfCode(newNode.code);
			newNode.booking = record.booking && record.booking.value == 1 ? true : false;
			newNode.right = parseInt(right);
            newNode.isParent = ct.option.tree == 'dewey' ? !!(newNode.level >= 0 && newNode.level < ct.option.depth) : false;

			ct.addNodes(newNode);
		}

		// 获取当前编码的父编码
		function getParentCode(code) {
			// 参数合法性判断
			if (tek.type.isEmpty(code) || !tek.type.isString(code))
				return null;

			// 配置判断
			if (!tek.type.isString(ct.option.base) || ct.option.depth <= 0 || ct.option.digit <= 0 || ct.option.step <= 0)
				return null;

			var currentDepth = getDepthOfCode(code);
			if (currentDepth < 1)
				return null;

			var parentCode = "";

			if (ct.option.tree == "dewey") {
				var endIndex = ct.option.base.length + (currentDepth - 1) * ct.option.digit;
				parentCode += code.substring(0, endIndex);

				for (var i = 0; i < (ct.option.depth - currentDepth + 1) * ct.option.digit; i++) {
					parentCode += "0";
				}
			} else if (ct.option.tree == "default") {
				var endIndex = ct.option.base.length + (currentDepth - 1) * ct.option.digit;
				parentCode += code.substring(0, endIndex);
			}

			return parentCode;
		}

		// 计算获取当前编码的级数（深度，最小为1级）
		function getDepthOfCode(code) {
			// 参数合法性判断
			if (tek.type.isEmpty(code) || !tek.type.isString(code))
				return -1;

			// 编码code合法性判断
			if (ct.option.digit <= 0 || code.length < (ct.option.base.length + ct.option.digit)
				|| code.substring(0, ct.option.base.length) != ct.option.base)
				return -1;

			// 去掉前缀
			if (code.substring(0, ct.option.base.length) == ct.option.base) {
				code = code.substring(ct.option.base.length);
			}

			// 计算级别数
			var dp = 0;
			if (ct.option.tree == "dewey") {
				// 取得每一级总编码，如digit=4，返回 0000
				var prefix = (function () {
					var s = "";
					for (var i = 0; i < ct.option.digit; i++)
						s += "0";
					return s;
				})();
				for (var toffset = 0; toffset < code.length; toffset += ct.option.digit) {
					if (code.substring(toffset, toffset + ct.option.digit) != prefix) {
						dp++;
					} else {
						break;
					}
				}
			} else if (ct.option.tree == "default") {
				dp = parseInt((code.length + ct.option.digit - 1) / ct.option.digit);
			}
			return dp;
		}

	})(window.tek.catalog);
})();

//-----------------------------------------------------End-------------------------------------