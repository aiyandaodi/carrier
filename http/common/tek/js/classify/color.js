// JavaScript Document
/**
 * Created by ZERO on 2016/9/12.
 */
/*************************************************************
 * Name: color
 *  Belong to Page:
 *  Description: 对象颜色分类操作js包。
 *      1、本包依赖于 jQuery.js、tool.js、common.js、dataUtility.js、user.js 文件
 *      2、颜色列表的加载采用异步加载，所以特别注意
 *      3、该对象放在全局命名域tek下，调取可以直接使用tek.color.xxx
 *      4、该包中添加、删除操作只对自定义颜色有效
 *
 * -----------------------------------------------------------
 * 对象：tek.color （该对象放在全局命名域tek下）
 *  属性：
 *      params - 包含必要参数
 *      option - 包含颜色分类在ObjectOption中的参数配置
 *  方法：
 *      init([Object] params) - 初始化。params中必须包含object、owner两个参数
 *      getColors(callback) - 获取颜色列表。回调函数传入颜色列表数组
 *      getInstance() - 获取一个Color实例对象
 *      getColorById([String] colorId) - 获取匹配的颜色对象，根据id参数
 *      getColorsByParam([String] key, [Any] value) - 获取匹配的所有颜色对象，根据参数
 *      isCanCreate() - 是否有创建权、
 *      getRight() - 获取权限
 *      addColor([String] colorName, {String} value, [Function] success, [Function] error) - 添加颜色
 *      remove([String] colorId, [Function] success, [Function] error) - 删除某一条标签记录
 *      removes([Array] colorIds, [Function] success, [Function] error) - 删除一组标签记录
 *
 *************************************************************/
(function () {
	// Create global tek obj and its namespaces
	window.tek = window.tek || {};

	// 颜色分类对象：tek.color
	window.tek.color = {};
	(function (color) {
		/**
		 * 参数
		 * @type {{objectName: string, object: string, owner: string, ONCE_COUNT: number, URL: string}}
		 */
		color.params = {
			objectName: "ObjectColor", // 对象名
			object: "", // 所属对象名

			ONCE_COUNT: 20, // 每次请求读取记录条数
			URL: tek.common.getRootPath() + "servlet/tobject"
		};

		/**
		 * 当前对象的颜色分类的参数配置选项
		 * @type {{enforce: number, private: number}}
		 */
		color.option = {
			enforce: 0,  //是否强制使用颜色分类（1表示目标对象必须选择颜色分类，0表示不必须）
			private: 0 //是否允许私有颜色定义（1表示允许，0表示不允许）
		};

		/**
		 * 初始化
		 * @param {Object} params
		 * @returns {{flag: (Boolean), message: (String)}} flag=true表示初始化成功，否则失败
		 */
		color.init = function (params) {
			COLORS = [];
			//初始化配置参数
			initObjectOptionParam();

			var re = initParams(params);
			if (!re || !re.flag)
				return re;

			return {flag: true, message: "初始化成功！"}
		};

		//初始化配置参数
		function initObjectOptionParam() {
			color.option.enforce = 0;
			color.option.private = 0;
		}

		// 初始化参数
		function initParams(params) {
			if (!params || !tek.type.isObject(params))
				return {flag: false, message: "请传入json形式的 params 参数！"};

			if (tek.type.isEmpty(params.object))
				return {flag: false, message: "params 参数中，所属对象(object)为空。"};
			if (!tek.type.isString(params.object))
				return {flag: false, message: "params 参数中，所属对象(object)值要是字符串。"};
			if (params.owner == 0)
				return {flag: false, message: "params 参数中，所有者(owner)值不能为'0'。"};

			color.params.object = params.object;
			color.params.owner = params.owner;
			//获取option中相应配置参数
			var re = getObjectOptionParam();

			if (re && re.flag === false)
				return {flag: false, message: re.message};

			// 校验编码配置参数
			if (!tek.type.isNumber(color.option.enforce) || (color.option.enforce != 0 && color.option.enforce != 1)) {
				return {flag: false, message: "获取option中配置参数(color_enforce)不合要求！"};
			}
			if (!tek.type.isNumber(color.option.private) || (color.option.private != 0 && color.option.private != 1)) {
				return {flag: false, message: "获取option中配置参数(color_private)不合要求！"};
			}

			return {flag: true, message: "初始化 params 成功！"};
		}

		// 获取option中相应配置参数
		function getObjectOptionParam() {
			var re = {flag: false, message: ""};

			var sendData = {};
			sendData["objectName"] = color.params.objectName;
			sendData["action"] = "readInfo";
			sendData["read-option"] = 1;
			sendData["color_object"] = color.params.object;

			$.ajax({
				async: false,
				type: "post",
				url: color.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							var record = data["record"];
							record = record || {};

							if (record.color_enforce) {
								var value = record.color_enforce.value;
								color.option.enforce = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
							}
							if (record.color_private) {
								var value = record.color_private.value;
								color.option.private = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
							}

							re.flag = true;
							re.message = "获取option中相应配置参数，操作成功。"
						} else {
							re.message = "操作失败！" + data.code + " - " + tek.dataUtility.stringToHTML(data.message);
						}
					} else {
						re.message = "操作失败！[data=null]";
					}
				},
				error: function (request) {
					re.message = "操作错误！[" + request.status + " - " + request.statusText + "]";
				}
			});

			return re;
		}

		// 颜色列表全局对象
		var COLORS = [];

		/**
		 * 颜色记录模板
		 * @returns {{id: id值, code: 编码, name: 名称, object: 所属对象名, owner: 所有者id, value: 颜色HEX值}}
		 * @constructor {Color}
		 */
		var Color = function () {
			this.id = "";     // id值（唯一）
			this.code = "";   // 编码（唯一）
			this.name = "";   // 名称（不唯一）
			this.object = ""; // 所属对象名（不唯一）
			this.owner = "";  // 所有者id，0表示公共（不唯一）
			this.value = "";   // 颜色HEX值（不唯一）
		};

		/**
		 * 获取一个Color实例对象
		 * @returns {Color}
		 */
		function getInstance() {
			return new Color();
		}

		/**
		 * 获取颜色对象列表，执行回调
		 * @param {Object} callback 回调对象，包含成功回调方法、错误回调方法
		 *          callback["success"] 传入COLORS颜色列表：success(COLORS);
		 *          callback["error"] 传入错误信息参数：error(errorMsg);
		 */
		color.getColors = function (callback) {
			if (!callback)
				return;

			// 取得颜色对象列表
			getObjectColorList(0,
				function () {
					if (typeof callback.success === "function") {
						callback.success(COLORS);
					}
				},
				function (errorMsg) {
					if (typeof callback.error === "function") {
						callback.error(errorMsg);
					}
				});

		};

		// 取得颜色对象列表
		function getObjectColorList(skip, success, error) {
			skip = (isNaN(skip) || skip < 0) ? 0 : skip;
			var errorMsg = "", isSuccess = false;

			var sendData = {};
			sendData["objectName"] = color.params.objectName;
			sendData["action"] = "getList";
			sendData["color_object"] = color.params.object;
			sendData["color-choose"] = 1;

			sendData["order"] = "color_owner,color_code";
			sendData["skip"] = skip;
			sendData["count"] = color.params.ONCE_COUNT;

			$.ajax({
				async: true,
				type: "post",
				url: color.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							// 操作成功
							isSuccess = true;
							var records = data["record"];
							records = (!records) ? [] : (tek.type.isArray(records) ? records : [records]);

							for (var i in records)
								saveObjectColor(records[i]);

							skip += records.length;
							if (data.value > skip)
								getObjectColorList(parentCode, skip, null, error);
						} else {
							errorMsg = "操作失败！" + data.code + " - " + tek.dataUtility.stringToHTML(data.message);
						}
					} else {
						errorMsg = "操作失败！[data=null]";
					}
				},
				error: function (request) {
					errorMsg = "操作错误！[" + request.status + " - " + request.statusText + "]";
				},
				complete: function () {
					if (isSuccess && typeof success === "function") {
						success();
					}
					if (!isSuccess && typeof error === "function") {
						error(errorMsg);
					}
				}
			});
		}

		// 保存节点
		function saveObjectColor(record) {
			if (!record || !tek.type.isObject(record))
				return;

			var newColor = getInstance();
			newColor.id = record.id;
			newColor.code = !!record.color_code ? record.color_code.value : "";
			newColor.name = !!record.color_name ? record.color_name.value : "";
			newColor.object = !!record.color_object ? record.color_object.value : "";
			newColor.owner = !!record.color_owner ? record.color_owner.value : "0";
			newColor.value = !!record.color_value ? record.color_value.value : "";

			COLORS.push(newColor);
		}

		/**
		 * 获取匹配的颜色对象，根据id参数
		 * @param {String} colorId Color对象的id键值
		 * @returns {null | Color}
		 */
		color.getColorById = function (colorId) {
			var colors = this.getColorsByParam("id", colorId);
			return (colors.length && colors.length > 0) ? colors[0] : null;
		};

		/**
		 * 获取匹配的所有颜色对象，根据参数
		 * @param {String} key Color对象的参数键
		 * @param {Any} value 参数键对应值
		 * @returns {Array} length有可能为0
		 */
		color.getColorsByParam = function (key, value) {
			var ts = [];

			if (!tek.type.isString(key) || !key)
				return ts;

			for (var i in COLORS) {
				if (COLORS[i][key] === value)
					ts.push(COLORS[i]);
			}

			return ts;
		};

		/**
		 * 检查是否可以创建颜色
		 * @returns {Boolean}
		 */
		color.isCanCreate = function () {
			return tek.right.isCanCreate(color.getRight());
		};

		// 权限整型值
		var right = null;

		/**
		 * 获取权限
		 * @returns {Number} 返回权限的整型值
		 */
		color.getRight = function () {
			if (typeof right != "number")
				right = getColorRight();

			return right;
		};

		// 获取颜色权限（返回权限的Number值）
		function getColorRight() {
			var right = 0;
			var errorMsg = "";

			var sendData = {};
			sendData["objectName"] = color.params.objectName;
			sendData["action"] = "getRight";
			sendData["color_object"] = color.params.object;

			$.ajax({
				async: false,
				type: "post",
				url: color.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0 && isFinite(data.value)) {
							right = parseInt(data.value);
						} else {
							errorMsg = "获取当前用户对颜色的权限，操作失败！" + data.code + " - " + data.message;
						}
					} else {
						errorMsg = "获取当前用户对颜色的权限，操作失败！[data=null]";
					}
				},
				error: function (request) {
					errorMsg = "获取当前用户对颜色的权限，操作错误！[" + request.status + " - " + request.statusText + "]";
				}
			});

			if (errorMsg)
				console.log(errorMsg);

			return right;
		}

		/**
		 * 添加颜色
		 * @param {Color} colorName 要添加的新颜色的颜色名
		 * @param {Function} success 成功回调，传入新建的颜色对象
		 * @param {Function} error 失败回调，传入失败信息
		 */
		color.addColor = function (colorName, value,  success, error) {
			if (tek.type.isEmpty(colorName) || tek.type.isEmpty(value))
				return;

			var sendData = {};
			sendData["objectName"] = color.params.objectName;
			sendData["action"] = "addInfo";
			sendData["color_name"] = colorName;
			sendData["color_object"] = color.params.object;
			sendData["color_owner"] = myId;
			sendData["color_value"] = value;

			$.ajax({
				async: true,
				type: "post",
				url: color.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							var id = data.value.split("=")[1];
							// 获取新增的对象颜色
							var newColor = getObjectColorById(id);
							// 新增的颜色添加到COLORS中
							if (newColor && newColor.id) {
								var checkColor = color.getColorById(newColor.id);
								if (!checkColor)
									COLORS.push(newColor);
							}

							if (typeof success == "function")
								success(newColor);
						} else {
							var errorMsg = "操作失败！" + data.code + " - " + tek.dataUtility.stringToHTML(data.message);
							if (typeof error == "function")
								error(errorMsg);
						}
					} else {
						var errorMsg = "操作失败！[data=null]";
						if (typeof error == "function")
							error(errorMsg);
					}
				},
				error: function (request) {
					var errorMsg = "操作错误！[" + request.status + " - " + request.statusText + "]";
					if (typeof error == "function")
						error(errorMsg);
				}
			});
		};

		/**
		 * 获取对象颜色记录，根据id
		 * @param {String} id 颜色记录id
		 * @returns {Color | null}
		 */
		function getObjectColorById(id) {
			var newColor = null;

			var sendData = {};
			sendData["objectName"] = color.params.objectName;
			sendData["action"] = "readInfo";
			sendData["color_id"] = id;

			$.ajax({
				async: false,
				type: "post",
				url: color.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data && data.code == 0) {
						var record = data["record"];
						if (record && tek.type.isObject(record)) {
							newColor = getInstance();
							newColor.id = record.id;
							newColor.code = !!record.color_code ? record.color_code.value : "";
							newColor.name = !!record.color_name ? record.color_name.value : "";
							newColor.object = !!record.color_object ? record.color_object.value : "";
							newColor.owner = !!record.color_owner ? record.color_owner.value : "0";
							newColor.value = !!record.color_value ? record.color_value.value : "";
						}
					}
				}
			});

			return newColor;
		}

		/**
		 * 删除某一条颜色记录
		 * @param {String} colorId 要删除的颜色记录的id值
		 * @param {Function} success 成功回调，传入删除的Color对象
		 * @param {Function} error 失败回调，传入失败信息
		 */
		color.remove = function (colorId, success, error) {
			if (tek.type.isEmpty(colorId))
				return;

			var sendData = {};
			sendData["objectName"] = color.params.objectName;
			sendData["action"] = "removeInfo";
			sendData["color_id"] = colorId;

			$.ajax({
				async: true,
				type: "post",
				url: color.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							var id = data.value.split("=")[1];
							// 移除COLORS中的对应颜色
							var deleteColor = color.getColorById(id);
							if (deleteColor) {
								for (var i=0;i<COLORS.length;i++) {
									if (COLORS[i].id == deleteColor.id) {
										COLORS.splice(i, 1);
										break;
									}
								}
							}

							if (typeof success == "function")
								success(deleteColor);
						} else {
							var errorMsg = "操作失败！" + data.code + " - " + tek.dataUtility.HTML(data.message);
							if (typeof error == "function")
								error(errorMsg);
						}
					} else {
						var errorMsg = "操作失败！[data=null]";
						if (typeof error == "function")
							error(errorMsg);
					}
				},
				error: function (request) {
					var errorMsg = "操作错误！[" + request.status + " - " + request.statusText + "]";
					if (typeof error == "function")
						error(errorMsg);
				}
			});
		};

		/**
		 * 删除一组颜色记录
		 * @param {Array} colorIds 要删除的颜色记录的id数组
		 * @param {Function} success 成功回调，传入删除的Color对象数组
		 * @param {Function} error 失败回调，传入失败信息
		 */
		color.removes = function (colorIds, success, error) {
			if (!tek.type.isArray(colorIds) || colorIds.length <= 0)
				return;

			var ids = "";
			for (var i in colorIds) {
				if (tek.type.isEmpty(colorIds[i]))
					continue;
				if (ids)
					ids += ";";
				ids += colorIds[i];
			}

			var sendData = {};
			sendData["objectName"] = color.params.objectName;
			sendData["action"] = "removeList";
			sendData["object-ids"] = ids;

			$.ajax({
				async: true,
				type: "post",
				url: color.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							// 移除COLORS中的对应颜色

							var deleteColors = [];
							for (var i = 0; i<colorIds.length;i++) {
								var deleteColor = color.getColorById(colorIds[i]);
								if (deleteColor) {
									for (var j=0;j<COLORS.length;j++) {
										if (COLORS[j].id == deleteColor.id) {
											deleteColors.push(COLORS[j]);
											COLORS.splice(i, 1);
											break;
										}
									}
								}
							}

							if (typeof success == "function")
								success(deleteColors);
						} else {
							var errorMsg = "操作失败！" + data.code + " - " + tek.dataUtility.stringToHTML(data.message);
							if (typeof error == "function")
								error(errorMsg);
						}
					} else {
						var errorMsg = "操作失败！[data=null]";
						if (typeof error == "function")
							error(errorMsg);
					}
				},
				error: function (request) {
					var errorMsg = "操作错误！[" + request.status + "-" + request.statusText + "]";
					if (typeof error == "function")
						error(errorMsg);
				}
			});
		};

	})(window.tek.color);
})();

//-----------------------------------------------------End-------------------------------------