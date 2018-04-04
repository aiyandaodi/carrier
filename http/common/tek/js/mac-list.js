/***************************************************************************************************
 * 说明：
 *   该JS文件用于使用macadmin-5.0样式生成的标准化列表页面。
 * 要求：
 *   需要加载 tool.js、common.js、dataUtility.js、turn-page.js、mac-common.js
 *------------------------------------------------------------------------------------------------
 * tek.macList 公共参数：
 *     var tek.macList.PAGE_COUNT - 默认一页显示数量。
 *     var tek.macList.GROUP_COUNT - 默认一次显示页数。
 *     var macList.ajaxURL - 取得列表信息的Servlet地址
 *     var macList.params - 当前参数
 *     var macList.columns - 显示的域名数组
 *     var macList.searchs - 快速查询字段数组
 *     var macList.groupCount - 一组显示页数
 *     var macList.ascendingPath - 正序图标路径
 *     var macList.descendingPath - 倒序图标路径
 *     var macList.selected - 当前页选中的列表信息标识数组
 *     var macList.allIds - 当前页所有列表信息标识数组
 * tek.macList 公共方法：
 *     function tek.macList.getList(); - 使用当前设置的参数取得对象列表信息
 *     function tek.macList.showData(data); - 显示数据
 *     function tek.macList.showListRecords(records, data); - 列表形式显示信息记录
 *     function tek.macList.showListColumns(record); - 显示列名
 *     function tek.macList.showListInfo(record, data, parent); - 添加一条列表数据
 *     function tek.macList.appendListField(field, record, data); - 追加列数据
 *     function tek.macList.appendDefaultListField(field, record, data); - 追加普通列数据
 *     function tek.macList.showDefaultListTurn(data); - 显示默认的列表翻页按钮
 *     function tek.macList.columnMouseOver(ele); - 鼠标移入列标签
 *     function tek.macList.columnMouseOut(ele); - 鼠标移出列标签
 *     function tek.macList.selParent(ele, e); - 选择信息（父盒子元素响应）
 *     function tek.macList.sel(ele, e); - 选择信息（多选框元素响应）
 *     function tek.macList.changeOrder(order); - 按指定列排序
 *     function tek.macList.customRefresh(); - 刷新列表数据
 *     function tek.macList.removeInfo(id, name, ajaxParams); - 删除指定标识的信息
 *     function tek.macList.removeList(ajaxParams); - 批量删除选中的用户记录
 *     function tek.macList.removeCheck(removeCount); - 删除数据后，如果当前页没有数据，调整参数，显示前一页数据
 *     function tek.macList.quickSearchEnter(event) - 快速检索文本框敲击键盘事件处理（输入“回车”，执行快速检索操作）
 *     function tek.macList.quickSearch(searchText); - 快速查询包含text字符串的信息
 *------------------------------------------------------------------------------------------------
 * 页面必须要初始化的参数：
 *     id="table-msg" - 显示列表信息的标签ID
 *     id="table-infos" - 显示列表数据的标签ID
 *     id="table-columns" - 显示列表列名的标签ID
 *    
 *     tek.macList.ajaxURL - 取得列表信息的URL路径。例如："../../tobject"
 *     tek.macList.params - 用于Ajax操作取得列表信息的参数。例如：
 *                              params["objectName"]="ObjectTag";
 *                              params["action"]="getList";
 *                              params["skip"]=0;    当前跳过信息数
 *                              params["count"]=tek.macList.PAGE_COUNT;   一次取得信息最大数
 *     tek.macList.columns - 显示列数组。例如：
 *                               columns.push('tag_code');
 *                               columns.push('tag_name');
 *                               columns.push('tag_owner');
 *     tek.macList.searchs - 可快速检索的域名数组
 *                               searchs.push("tag_code");
 *                               searchs.push("tag_name");
 *                               searchs.push("tag_object");
 *------------------------------------------------------------------------------------------------
 * 页面需要实现的操作方法：
 *     function tek.macList.appendListOperation(record,data); - 生成指定行信息的“操作”按钮（如果没有操作，可以不实现）。
 *     function tek.macList.refreshList() - 自定义刷新页面（如果不实现，调用默认函数）。
 *------------------------------------------------------------------------------------------------
 * 页面可选自定义方法：
 *     function tek.macList.customOtherOperation(data); - 自定义其他操作（在生成列表完成后调用）。
 *     function tek.macList.showCustomListRecords(records, data); - 自定义列表显示样式。
 *     function tek.macList.showCustomListTurn(data) - 自定义翻页按钮显示样式。
 *     function tek.macList.customIsCanOrder(fieldname) - 自定义指定列是否支持排序（如果不实现，默认全部支持）。
 *     function tek.macList.appendCustomListField(field, record, data); - 自定义列单元格显示。如果不实现，自动调用默认函数。
 ***************************************************************************************************/

(function () {
	// 创建全局变量 tek 作为命名空间
	window.tek = window.tek || {};

	// 定义 mac-list.js 中相关的参数、函数
	tek.macList = {};
	(function (macList) {
		macList.PAGE_COUNT = 10;    //默认一页显示数量
		macList.GROUP_COUNT = 10;    // 默认一次显示组数

		macList.ajaxURL;    //取得列表信息的Servlet地址
		macList.params = {};    // 当前参数
		macList.columns = [];    // 显示的域名数组
		macList.searchs = [];    // 快速查询字段数组
		macList.groupCount = macList.GROUP_COUNT;    // 一组显示页数

		macList.ascendingPath = tek.common.getRootPath() + "/http/images/view-sort-ascending.png";    // 正序图标路径
		macList.descendingPath = tek.common.getRootPath() + "/http/images/view-sort-descending.png";    // 倒序图标路径

		macList.selected = [];    //选中的对象标识
		macList.allIds = [];    //当前页的所有对象标识

		/**
		 * 取得对象列表信息
		 */
		macList.getList = function () {
			macList.selected = [];
			macList.allIds = [];

			macList.params = macList.params || {};

			if (typeof tek.macList.showCustomListRecords != "function") {
				var infoElem = document.getElementById("table-infos");
				if (infoElem)
					infoElem.innerHTML = "";
			}

			var html = "<div class='center'><img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/>&nbsp;正在获取数据...</div>";
			$("#table-msg").html(html);

			var setting = {};//operateType: "取得对象列表信息"};

			var callback = {
				success: function (data) {
					// 操作成功
					macList.showData(data);

					// 自定义其他操作
					if (typeof tek.macList.customOtherOperation == "function")
						tek.macList.customOtherOperation(data);
				},
				error: function (data, message) {
					$("#table-msg").html(message);
				}
			};

			tek.common.ajax(macList.ajaxURL, setting, macList.params, callback);
		};

		/**
		 * 显示数据
		 * @param {Object} data 服务器Servlet返回的数据结果
		 */
		macList.showData = function (data) {
			// 清空原数据
			$("#table-msg").html("");

			// 显示列表信息记录
			if (typeof tek.macList.showCustomListRecords == "function") {
				// 自定义显示列表信息记录
				tek.macList.showCustomListRecords(data['record'], data);
			} else {
				tek.macList.showListRecords(data['record'], data);
			}

			// 设置翻页按钮
			if ((typeof tek.macList.showCustomListTurn) == "function") {
				// 自定义翻页按钮
				tek.macList.showCustomListTurn(data);
			} else {
				// 默认翻页按钮
				tek.macList.showDefaultListTurn(data);
			}
		};

		/**
		 * 列表形式显示信息记录
		 * @param {Array} records 列表信息记录数组
		 * @param {Object} data 服务器Servlet返回的数据结果
		 */
		macList.showListRecords = function (records, data) {
			// 取得record并数组化
			var records = records || data["record"];
			if (!records) {
				$("#table-msg").html("没有数据!");
				return;
			}
			records = tek.type.isArray(records) ? records : [records];

			if (!tek.type.isArray(records) || records.length <= 0) {
				$("#table-msg").html("没有数据!");
				return;
			}

			// 1、设置列名行
			macList.showListColumns(records[0]);

			// 2、设置排序
			for (var i in macList.columns) {
				var elem = document.getElementById("img_" + macList.columns[i]);
				if (!elem)
					continue;

				if (macList.params["order"] == macList.columns[i]) {
					elem.style.display = "";

					var desc = macList.params["desc"];
					if (desc == 1 || desc == "1" || desc == "true" || desc == true)
						elem.src = macList.descendingPath;
					else
						elem.src = macList.ascendingPath;
				} else
					elem.style.display = "none";
			} // end for(var i in columns)

			// 3、显示记录信息
			var elem = document.getElementById("table-infos");
			if (!elem)
				return;

			for (var i in records)
				macList.showListInfo(records[i], data, elem);
		};

		/**
		 * 显示列名
		 * @param {Object} record 数据记录
		 */
		macList.showListColumns = function (record) {
			var tr = document.getElementById("table-columns");
			if (!tr)
				return;

			if (tr.innerHTML.length > 0) {
				var elem = document.getElementById("select-all");
				if (elem)
					elem.checked = "";
				return;
			}

			var html = "";

			// 选择框
			html += "<th id='column-first-title' class='column-first' style='cursor:pointer' onMouseOver='tek.macList.columnMouseOver(this);' onMouseOut='tek.macList.columnMouseOut(this);' onClick='tek.macList.selParent(this);'>"
				+ "<input value='0' id='select-all' type='checkbox' onclick='tek.macList.sel(this, event)'/>"
				+ "</th>";

			if (!tek.type.isArray(macList.columns) || macList.columns.length <= 0) {
				// 未定义显示列，显示所有列
				for (var name in record) {
					if (record[name] && record[name].display)
						macList.columns.push(record[name].name);
				}
			}

			for (var i in macList.columns) {
				if (!macList.columns[i])
					continue;

				var field = record[macList.columns[i]];
				if (!field)
					continue;

				html += "<th id='column-" + macList.columns[i] + "-title' class='column-" + macList.columns[i] + "'";

				if ((typeof tek.macList.customIsCanOrder != "function") || tek.macList.customIsCanOrder(macList.columns[i]))
					html += " style='cursor:pointer' onClick=\"tek.macList.changeOrder('" + macList.columns[i] + "');\"";

				html += " onMouseOver='tek.macList.columnMouseOver(this);' onMouseOut='tek.macList.columnMouseOut(this);'>"
					+ "<img height='20px' src='' id='img_" + macList.columns[i] + "'/>"
					+ field.display;

				if (tek.type.isArray(macList.searchs)) {
					for (var j = 0; j < tek.macList.searchs.length; j++) {
						if (macList.searchs[j] === field["name"]) {
							html += "<i class='fa fa-search fa-search-th' title='该列可快速检索'></i>";
							break;
						}
					}
				}
				html += "</th>";
			}

			html += "<th id='column-last-title' class='column-last'>操作</th>";

			tr.insertAdjacentHTML('BeforeEnd', html);
		};

		/**
		 * 添加一条列表数据
		 * @param {Object} record 信息
		 * @param {Object}data 服务器返回的数据
		 * @param {Element} parent 显示信息的父元素
		 */
		macList.showListInfo = function (record, data, parent) {
			var id = record.id;
			var name = record.name;

			// 设置allIds
			var exist = false;
			for (var i = 0; i < macList.allIds.length; i++) {
				if (macList.allIds[i] == id) {
					exist = true;
					break;
				}
			}
			if (!exist)
				macList.allIds.push(id);

			var html = "<tr>"
				+ "<td class='column-first' style='cursor:pointer' onclick='tek.macList.selParent(this, event);'>"
				+ "<input value='" + id + "' id='select" + id + "' type='checkbox' onclick='tek.macList.sel(this, event)'>"
				+ "</td>";

			// 列信息
			for (var i in macList.columns)
				html += macList.appendListField(record[macList.columns[i]], record, data);

			// 操作
			html += "<td class='column-last'>"
				+ ((typeof tek.macList.appendListOperation == "function") ? tek.macList.appendListOperation(record, data) : "&nbsp;")
				+ "</td>"

				+ "</tr>";

			parent.insertAdjacentHTML('BeforeEnd', html);
		};

		/**
		 * 追加列数据
		 * @param {Object} field 列数据
		 * @param {Object} record 数据记录
		 * @param {Object} data 服务器返回的数据
		 * @return {String} 拼接后的html字符串，可能是""
		 */
		macList.appendListField = function (field, record, data) {
			var html = "";
			if (!field)
				return html;

			html += "<td class='column-" + field.name + "'>";

			if ((typeof tek.macList.appendCustomListField) == "function") {
				// 自定义列信息
				html += tek.macList.appendCustomListField(field, record, data);
			} else {
				html += tek.macList.appendDefaultListField(field, record, data);
			}

			html += "</td>";

			return html;
		};

		/**
		 * 追加普通列数据
		 * @param {Object} field 列数据
		 * @param {Object} record 数据记录
		 * @param {Object} data 服务器返回的数据
		 * @return {String} 拼接后的html字符串，可能是""
		 */
		macList.appendDefaultListField = function (field, record, data) {
			//模糊查询
			var fieldName = field.name;
			var show = field.show;

			var qs = decodeURIComponent(macList.params["quick-search"]);
			if (qs && qs.length > 0 && tek.macList.searchs && show && show.length > 0) {
				var arr = tek.dataUtility.stringToArray(qs, " ");
				if (arr && arr.length > 0) {
					for (var j in macList.searchs) {
						if (fieldName != macList.searchs[j])
							continue;

						var rep = [];
						for (var k in arr) {
							var loc = -1;
							while ((loc = show.toLowerCase().indexOf(arr[k].toLowerCase())) >= 0) {
								var str = show.substring(0, loc) + "#";
								for (var m = 0; m < (rep.length); m++)
									str += "*";
								str += "#" + show.substring(loc + arr[k].length);

								var s = "<font color='#FF0000'>" + show.substring(loc, loc + arr[k].length) + "</font>";
								rep.push(s);

								show = str;
							}
						} // endfor(var k in arr)

						for (var n = 0; n < rep.length; n++) {
							var key = "#";
							for (var m = 0; m < n; m++)
								key += "*";
							key += "#";
							show = show.replace(key, rep[n]);
						}

						break;
					} // end for(var k in arr)
				} // end if(arr && arr.length>0)
			} // end if(qs && qs.length>0 && searchs && show.length>0)

			return show;
		};

		/**
		 * 显示默认的列表翻页按钮
		 * @param {Object} data 服务器返回的数据
		 */
		macList.showDefaultListTurn = function (data) {
			var skip = macList.params["skip"];
			if (!skip) {
				skip = 0;
				macList.params["skip"] = skip;
			}

			var count = macList.params["count"];
			if (!count) {
				count = macList.PAGE_COUNT;
				macList.params["count"] = count;
			}

			tek.turnPage.show("page", skip, count, data.value, macList.groupCount);
		};

		/**
		 * 鼠标移入列标签
		 * @param {Element} ele 列元素
		 */
		macList.columnMouseOver = function (ele) {
			if (tek.type.isElement(ele))
				$(ele).css("background", "#f3f3f3");
		};

		/**
		 * 鼠标移出列标签
		 * @param {Element} ele 列元素
		 */
		macList.columnMouseOut = function (ele) {
			if (tek.type.isElement(ele))
				$(ele).css("background", "");
		};

		/**
		 * 选择信息（父盒子元素响应）
		 * @param {Element} ele checkbox的父节点。
		 * @param {Event} e 操作事件
		 */
		macList.selParent = function (ele, e) {
			if (!tek.type.isElement(ele))
				return;

			var children = ele.getElementsByTagName("input");
			if (children && children.length > 0) {
				for (var i in children) {
					if (children[i] && children[i].type == "checkbox") {
						children[i].checked = !children[i].checked ? "checked" : "";
						macList.sel(children[i], e);
						break;
					}
				}
			}
		};

		/**
		 * 选择信息（多选框元素响应）
		 * @param {Element} ele checkbox组件
		 * @param {Event} e 操作事件
		 */
		macList.sel = function (ele, e) {
			if (!tek.type.isElement(ele))
				return;

			if (ele.value == "0") {
				//全部
				for (var i = 0; i < macList.allIds.length; i++) {
					if (!macList.allIds[i])
						continue;

					var index = isArrayContain(macList.selected, macList.allIds[i]);
					if (ele.checked) {
						if (index < 0)
							macList.selected.push(macList.allIds[i]);
						var inp = document.getElementById("select" + macList.allIds[i]);
						if (inp)
							inp.checked = "checked";

					} else {
						if (index >= 0)
							delete macList.selected[index];
						var inp = document.getElementById("select" + tek.macList.allIds[i]);
						if (inp)
							inp.checked = "";
					}
				} // end for (var i=0; i<tek.macList.allIds.length; i++)
			} else {
				// 指定info
				var index = isArrayContain(macList.selected, ele.value);
				if (ele.checked) {
					if (index < 0)
						macList.selected.push(ele.value);
				} else {
					if (index >= 0)
						delete macList.selected[index];
				}
			} // end if(ele.value=="0") else

			e = e || window.event;    //兼容IE和Firefox获得keyBoardEvent对象
			if (e && e.stopPropagation)
				e.stopPropagation();
			else if (window && window.event && window.event.cancelBubble)
				window.event.cancelBubble = true;
		};

		/**
		 * 按order列排序。
		 * @param {String} order 排序字段名
		 */
		macList.changeOrder = function (order) {
			if (macList.params["order"] == order) {
				var oldDesc = macList.params["desc"];
				if (oldDesc == 1 || oldDesc == "1" || oldDesc == true || oldDesc == "true")
					macList.params["desc"] = 0;
				else
					macList.params["desc"] = 1;
			} else {
				macList.params["desc"] = 0;
			}

			macList.params["order"] = order;

			macList.getList();
		};

		/**
		 * 刷新列表数据
		 */
		macList.customRefresh = function () {
			var elem = document.getElementById("table-infos");
			if (elem)
				elem.innerHTML = "";

			if (typeof(tek.macList.refreshList) == "function")
				tek.macList.refreshList();
			else
				macList.getList();
		};

		/**
		 * 删除指定标识的信息
		 * @param {String} id 删除标识（必须是字符串）
		 * @param {String} name 删除名称
		 * @param {Object} ajaxParams ajax提交的参数
		 */
		macList.removeInfo = function (id, name, ajaxParams) {
			if (!macList.ajaxURL || !ajaxParams) {
				return tek.macCommon.waitDialogShow(null, "未指定URL或参数！");
			}

			var remove = window.confirm("确定删除“" + name + "”?");
			if (!remove)
				return;

			var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif' width='16'/> &nbsp;正在删除...";
			tek.macCommon.waitDialogShow(null, html, null, 2);

			var setting = {};//operateType: "删除指定标识的信息"};

			var callback = {
				success: function (data) {
					macList.removeCheck(1);
					macList.getList();
				},
				error: function (data, message) {
					tek.macCommon.waitDialogShow(null, message);
				},
				complete: function () {
					tek.macCommon.waitDialogHide(1500);
				}
			};

			tek.common.ajax(macList.ajaxURL, setting, ajaxParams, callback);
		};

		/**
		 * 批量删除选中的记录
		 * @param {Object} ajaxParams ajax提交的参数
		 */
		macList.removeList = function (ajaxParams) {
			if (!macList.ajaxURL || !ajaxParams) {
				return tek.macCommon.waitDialogShow(null, "未指定URL或参数！");
			}

			if (!macList.selected || macList.selected.length <= 0) {
				return tek.macCommon.waitDialogShow(null, "没有选中待删除记录!");
			}

			var objectIds = "";
			var count = 0;
			for (var i = 0; i < macList.selected.length; i++) {
				if (macList.selected[i] && macList.selected[i] > 0) {
					if (count > 0)
						objectIds += ";";
					objectIds += macList.selected[i];
					count++;
				}
			}
			ajaxParams["object-ids"] = objectIds;

			var remove = window.confirm("确定删除选中的" + count + "条信息？");
			if (!remove)
				return;

			var html = "<img src='" + tek.common.getRootPath() + "http/images/waiting.gif' width='16'/> &nbsp;正在删除...";
			tek.macCommon.waitDialogShow(null, html, null, 2);

			var setting = {};//operateType: "批量删除选中的信息"};

			var callback = {
				success: function (data) {
					macList.removeCheck(data.value);
					macList.getList();
				},
				error: function (data, message) {
					tek.macCommon.waitDialogShow(null, message);
				},
				complete: function () {
					tek.macCommon.waitDialogHide(1500);
				}
			};

			tek.common.ajax(macList.ajaxURL, setting, ajaxParams, callback);
		};

		/**
		 * 删除数据后，如果当前页没有数据，调整参数，显示前一页数据
		 * @param {Number} removeCount 成功删除的数据条数
		 */
		macList.removeCheck = function (removeCount) {
			removeCount = parseInt(removeCount);
			if (!isFinite(removeCount) || removeCount <= 0)
				return;

			if (macList.allIds && macList.allIds.length == removeCount && macList.params["skip"] > 0) {
				// 显示前一页
				var preSkip = macList.params["skip"] - macList.params["count"];

				macList.params["skip"] = preSkip < 0 ? 0 : preSkip;
			}
		};

		/**
		 * 快速检索文本框敲击键盘事件处理。（如果输入“回车”，执行快速检索操作）
		 * @param {Event} event 键盘敲击事件
		 */
		macList.quickSearchEnter = function (event) {
			event = event || window.event;    //兼容IE和Firefox获得keyBoardEvent对象
			var key = event.keyCode ? event.keyCode : event.which;
			if (key == 13) {
				macList.quickSearch($("#quickSearchKey").val());
				if (window && window.event && window.event.returnValue)
					window.event.returnValue = false;
			}
			if (event && event.stopPropagation)
				event.stopPropagation();
			else if (window && window.event && window.event.cancelBubble)
				window.event.cancelBubble = true;
		};

		/**
		 * 快速检索
		 * @param {String} searchText 快速检索内容
		 */
		macList.quickSearch = function (searchText) {
			macList.params["skip"] = 0;
			macList.params["quick-search"] = encodeURIComponent(searchText);

			macList.getList();
		};

	})(tek.macList);

	/**
	 * array数组中是否包含v （内部方法，不对外暴露）
	 * @param {Array} array 数组
	 * @param {String} v 元素id值
	 * @return {Number} 如果包含，返回数组下标，否则返回-1。
	 */
	var isArrayContain = function (array, v) {
		if (!array || !v)
			return -1;

		for (var i = 0; i < array.length; i++) {
			if (array[i] == v)
				return i;
		}

		return -1;
	};

})();


$(function($) {

	// turn-page.js必须实现方法
	// 页面自定义了这个函数，这里不再定义；页面没有定义，采用这里的默认定义这个函数
	if (!!tek && !!tek.turnPage && typeof tek.turnPage.turn != 'function') {
		tek.turnPage.turn = function (eleId, skip) {
			skip = parseInt(skip);
			if (!isFinite(skip) || skip < 0)
				return;

			tek.macList.params.skip = skip;
			tek.macList.getList();
		};
	}
});
