// JavaScript Document
/**
 * Created by ZERO on 2016/9/12.
 */
/*************************************************************
 * Name: tag
 *  Belong to Page:
 *  Description: 对象标签分类操作js包。
 *      1、本包依赖于 jQuery.js、tool.js、common.js、dataUtility.js、user.js 文件
 *      2、标签列表的加载采用异步加载，所以特别注意
 *      3、该对象放在全局命名域tek下，调取可以直接使用tek.tag.xxx
 *      4、该包中添加、删除操作只对自定义标签有效
 *
 * -----------------------------------------------------------
 * 对象：tek.tag （该对象放在全局命名域tek下）
 *  属性：
 *      params - 包含必要参数
 *      option - 包含标签分类在ObjectOption中的参数配置
 *  方法：
 *      init([Object] params) - 初始化。params中必须包含object、owner两个参数
 *      getTags(callback) - 获取标签列表。回调函数传入标签列表数组
 *      getInstance() - 获取一个Tag实例对象
 *      getTagById([String] tagId) - 获取匹配的标签对象，根据id参数
 *      getTagsByParam([String] key, [Any] value) - 获取匹配的所有标签对象，根据参数
 *      isCanCreate() - 是否有创建权、
 *      getRight() - 获取权限
 *      addTag([String] tagName, [Function] success, [Function] error) - 添加标签
 *      remove([String] tagId, [Function] success, [Function] error) - 删除某一条标签记录
 *      removes([Array] tagIds, [Function] success, [Function] error) - 删除一组标签记录
 *
 *************************************************************/
(function () {
	// Create global tek obj and its namespaces
	window.tek = window.tek || {};

	// 标签分类对象：tek.tag
	window.tek.tag = {};
	(function (tag) {
		/**
		 * 参数
		 * @type {{objectName: string, object: string, owner: string, ONCE_COUNT: number, URL: string}}
		 */
		tag.params = {
			objectName: "ObjectTag", // 对象名
			object: "", // 所属对象名

			ONCE_COUNT: 20, // 每次请求读取记录条数
			URL: tek.common.getRootPath() + "servlet/tobject"
		};

		/**
		 * 当前对象的标签分类的参数配置选项
		 * @type {{count: number, enforce: number, private: number}}
		 */
		tag.option = {
			count: -1,  //允许标签最多数量（1-20之间任意整数值，-1无效）
			enforce: 0,  //是否强制使用标签分类（1表示目标对象必须选择标签分类，0表示不必须）
			private: 0 //是否允许私有标签定义（1表示允许，0表示不允许）
		};

		/**
		 * 初始化
		 * @param {Object} params
		 * @returns {{flag: (Boolean), message: (String)}} flag=true表示初始化成功，否则失败
		 */
		tag.init = function (params) {
			TAGS = [];
			//初始化配置参数
			initObjectOptionParam();

			var re = initParams(params);
			if (!re || !re.flag)
				return re;

			return {flag: true, message: "初始化成功！"}
		};

		//初始化配置参数
		function initObjectOptionParam() {
			tag.option.count = -1;
			tag.option.enforce = 0;
			tag.option.private = 0;
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

			tag.params.object = params.object;
			tag.params.owner = params.owner;
			//获取option中相应配置参数
			var re = getObjectOptionParam();

			if (re && re.flag === false)
				return {flag: false, message: re.message};

			// 校验编码配置参数
			if (!tek.type.isNumber(tag.option.count) || tag.option.count < 1 || tag.option.count > 20) {
				return {flag: false, message: "获取option中配置参数(tag_count)不合要求！"};
			}
			if (!tek.type.isNumber(tag.option.enforce) || (tag.option.enforce != 0 && tag.option.enforce != 1)) {
				return {flag: false, message: "获取option中配置参数(tag_enforce)不合要求！"};
			}
			if (!tek.type.isNumber(tag.option.private) || (tag.option.private != 0 && tag.option.private != 1)) {
				return {flag: false, message: "获取option中配置参数(tag_private)不合要求！"};
			}

			return {flag: true, message: "初始化 params 成功！"};
		}

		// 获取option中相应配置参数
		function getObjectOptionParam() {
			var re = {flag: false, message: ""};

			var sendData = {};
			sendData["objectName"] = tag.params.objectName;
			sendData["action"] = "readInfo";
			sendData["read-option"] = 1;
			sendData["tag_object"] = tag.params.object;

			$.ajax({
				async: false,
				type: "post",
				url: tag.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							var record = data["record"];
							record = record || {};

							if (record.tag_count) {
								var value = record.tag_count.value;
								tag.option.count = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
							}
							if (record.tag_enforce) {
								var value = record.tag_enforce.value;
								tag.option.enforce = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
							}
							if (record.tag_private) {
								var value = record.tag_private.value;
								tag.option.private = (!tek.type.isEmpty(value)) ? parseInt(value) : null;
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

		// 标签列表全局对象
		var TAGS = [];

		/**
		 * 标签记录模板
		 * @returns {{id: id值, code: 编码, name: 名称, object: 所属对象名, owner: 所有者id, language: 语言}}
		 * @constructor {Tag}
		 */
		var Tag = function () {
			this.id = "";     // id值（唯一）
			this.code = "";   // 编码（唯一）
			this.name = "";   // 名称（不唯一）
			this.object = ""; // 所属对象名（不唯一）
			this.owner = "";  // 所有者id，0表示公共（不唯一）
			this.language = "";   // 语言（不唯一）
		};

		/**
		 * 获取一个Tag实例对象
		 * @returns {Tag}
		 */
		function getInstance() {
			return new Tag();
		}

		/**
		 * 获取标签对象列表，执行回调
		 * @param {Object} callback 回调对象，包含成功回调方法、错误回调方法
		 *          callback["success"] 传入TAGS标签列表：success(TAGS);
		 *          callback["error"] 传入错误信息参数：error(errorMsg);
		 */
		tag.getTags = function (callback) {
			if (!callback)
				return;

			// 取得标签对象列表
			getObjectTagList(0,
				function () {
					if (typeof callback.success === "function") {
						callback.success(TAGS);
					}
				},
				function (errorMsg) {
					if (typeof callback.error === "function") {
						callback.error(errorMsg);
					}
				});

		};

		// 取得标签对象列表
		function getObjectTagList(skip, success, error) {
			skip = (isNaN(skip) || skip < 0) ? 0 : skip;
			var errorMsg = "", isSuccess = false;

			var sendData = {};
			sendData["objectName"] = tag.params.objectName;
			sendData["action"] = "getList";
			sendData["tag_object"] = tag.params.object;
			sendData["tag-choose"] = 1;

			sendData["order"] = "tag_owner,tag_code";
			sendData["skip"] = skip;
			sendData["count"] = tag.params.ONCE_COUNT;

			$.ajax({
				async: true,
				type: "post",
				url: tag.params.URL,
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
								saveObjectTag(records[i]);

							skip += records.length;
							if (data.value > skip)
								getObjectTagList(parentCode, skip, null, error);
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
		function saveObjectTag(record) {
			if (!record || !tek.type.isObject(record))
				return;

			var newTag = getInstance();
			newTag.id = record.id;
			newTag.code = !!record.tag_code ? record.tag_code.value : "";
			newTag.name = !!record.tag_name ? record.tag_name.value : "";
			newTag.object = !!record.tag_object ? record.tag_object.value : "";
			newTag.owner = !!record.tag_owner ? record.tag_owner.value : "0";
			newTag.language = !!record.tag_language ? record.tag_language.value : "";

			TAGS.push(newTag);
		}

		/**
		 * 获取匹配的标签对象，根据id参数
		 * @param {String} tagId Tag对象的id键值
		 * @returns {null | Tag}
		 */
		tag.getTagById = function (tagId) {
			var tags = this.getTagsByParam("id", tagId);
			return (tags.length && tags.length > 0) ? tags[0] : null;
		};

		/**
		 * 获取匹配的所有标签对象，根据参数
		 * @param {String} key Tag对象的参数键
		 * @param {Any} value 参数键对应值
		 * @returns {Array} length有可能为0
		 */
		tag.getTagsByParam = function (key, value) {
			var ts = [];

			if (!tek.type.isString(key) || !key)
				return ts;

			for (var i in TAGS) {
				if (TAGS[i][key] === value)
					ts.push(TAGS[i]);
			}

			return ts;
		};

		/**
		 * 检查是否可以创建标签
		 * @returns {Boolean}
		 */
		tag.isCanCreate = function () {
			return tek.right.isCanCreate(tag.getRight());
		};

		// 权限整型值
		var right = null;

		/**
		 * 获取权限
		 * @returns {Number} 返回权限的整型值
		 */
		tag.getRight = function () {
			if (typeof right != "number")
				right = getTagRight();

			return right;
		};

		// 获取标签权限（返回权限的Number值）
		function getTagRight() {
			var right = 0;
			var errorMsg = "";

			var sendData = {};
			sendData["objectName"] = tag.params.objectName;
			sendData["action"] = "getRight";
			sendData["tag_object"] = tag.params.object;

			$.ajax({
				async: false,
				type: "post",
				url: tag.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0 && isFinite(data.value)) {
							right = parseInt(data.value);
						} else {
							errorMsg = "获取当前用户对标签的权限，操作失败！" + data.code + " - " + data.message;
						}
					} else {
						errorMsg = "获取当前用户对标签的权限，操作失败！[data=null]";
					}
				},
				error: function (request) {
					errorMsg = "获取当前用户对标签的权限，操作错误！[" + request.status + " - " + request.statusText + "]";
				}
			});

			if (errorMsg)
				console.log(errorMsg);

			return right;
		}

		/**
		 * 添加标签
		 * @param {String} tagName 要添加的新标签的标签名
		 * @param {Function} success 成功回调，传入新建的标签对象
		 * @param {Function} error 失败回调，传入失败信息
		 */
		tag.addTag = function (tagName, success, error) {
			if (tek.type.isEmpty(tagName))
				return;

			var sendData = {};
			sendData["objectName"] = tag.params.objectName;
			sendData["action"] = "addInfo";
			sendData["tag_name"] = tagName;
			sendData["tag_object"] = tag.params.object;
			sendData["tag_owner"] = myId;

			$.ajax({
				async: true,
				type: "post",
				url: tag.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							var id = data.value.split("=")[1];
							// 获取新增的对象标签
							var newTag = getObjectTagById(id);
							// 新增的标签添加到TAGS中
							if (newTag && newTag.id) {
								var checkTag = tag.getTagById(newTag.id);
								if (!checkTag)
									TAGS.push(newTag);
							}

							if (typeof success == "function")
								success(newTag);
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
		 * 获取对象标签记录，根据id
		 * @param {String} id 标签记录id
		 * @returns {Tag | null}
		 */
		function getObjectTagById(id) {
			var newTag = null;

			var sendData = {};
			sendData["objectName"] = tag.params.objectName;
			sendData["action"] = "readInfo";
			sendData["tag_id"] = id;

			$.ajax({
				async: false,
				type: "post",
				url: tag.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data && data.code == 0) {
						var record = data["record"];
						if (record && tek.type.isObject(record)) {
							newTag = getInstance();
							newTag.id = record.id;
							newTag.code = !!record.tag_code ? record.tag_code.value : "";
							newTag.name = !!record.tag_name ? record.tag_name.value : "";
							newTag.object = !!record.tag_object ? record.tag_object.value : "";
							newTag.owner = !!record.tag_owner ? record.tag_owner.value : "0";
							newTag.language = !!record.tag_language ? record.tag_language.value : "";
						}
					}
				}
			});

			return newTag;
		}

		/**
		 * 删除某一条标签记录
		 * @param {String} tagId 要删除的标签记录的id值
		 * @param {Function} success 成功回调，传入删除的Tag对象
		 * @param {Function} error 失败回调，传入失败信息
		 */
		tag.remove = function (tagId, success, error) {
			if (tek.type.isEmpty(tagId))
				return;

			var sendData = {};
			sendData["objectName"] = tag.params.objectName;
			sendData["action"] = "removeInfo";
			sendData["tag_id"] = tagId;

			$.ajax({
				async: true,
				type: "post",
				url: tag.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							var id = data.value.split("=")[1];
							// 移除TAGS中的对应标签
							var deleteTag = tag.getTagById(id);
							if (deleteTag) {
								for (var i=0;i<TAGS.length;i++) {
									if (TAGS[i].id == deleteTag.id) {
										TAGS.splice(i, 1);
										break;
									}
								}
							}

							if (typeof success == "function")
								success(deleteTag);
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
		 * 删除一组标签记录
		 * @param {Array} tagIds 要删除的标签记录的id数组
		 * @param {Function} success 成功回调，传入删除的Tag对象数组
		 * @param {Function} error 失败回调，传入失败信息
		 */
		tag.removes = function (tagIds, success, error) {
			if (!tek.type.isArray(tagIds) || tagIds.length <= 0)
				return;

			var ids = "";
			for (var i in tagIds) {
				if (tek.type.isEmpty(tagIds[i]))
					continue;
				if (ids)
					ids += ";";
				ids += tagIds[i];
			}

			var sendData = {};
			sendData["objectName"] = tag.params.objectName;
			sendData["action"] = "removeList";
			sendData["object-ids"] = ids;

			$.ajax({
				async: true,
				type: "post",
				url: tag.params.URL,
				dataType: "json",
				data: sendData,
				success: function (data) {
					if (data) {
						if (data.code == 0) {
							// 移除TAGS中的对应标签

							var deleteTags = [];
							for (var i = 0; i<tagIds.length;i++) {
								var deleteTag = tag.getTagById(tagIds[i]);
								if (deleteTag) {
									for (var j=0;j<TAGS.length;j++) {
										if (TAGS[j].id == deleteTag.id) {
											deleteTags.push(TAGS[j]);
											TAGS.splice(i, 1);
											break;
										}
									}
								}
							}

							if (typeof success == "function")
								success(deleteTags);
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

	})(window.tek.tag);
})();

//-----------------------------------------------------End-------------------------------------