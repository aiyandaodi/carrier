/***************************************************************************************************
 * 说明：
 *   该JS文件用于以目录树形式显示传入目录对象。使用ztree目录树显示。
 *   每个对象的目录树中，显示时够早了一个虚拟根节点（id 默认为 1），该节点数据库中并不存在，详情见 initTree() 方法中定义。
 *-------------------------------------------------------------------------------------------------
 * 使用方法：
 *   页面必须加载common/ztree/js/jquery.ztree.core-3.5.js、http/common/ztree/css/zTreeStyle/zTreeStyle.css文件
 *   页面必须加装tree.css文件。
 *   页面必须包含<ul id="ztree" class="ztree"></ul>用于显示目录树。id可以自定义，通过initTree参数传递。
 *   页面必须包含<div id="ztree-msg"></div>用于显示提示（错误）信息
 *   调用initTree()函数初始化并显示目录对象目录树。
 *
 /***************************************************************************************************/
//=====================================================Parameter=====================================
var _zTreeId;   //显示树容器的 DOM id
var _zTreeMsgId;    // 目录树错误提示 DOM id

var _catalogObjectName;   //指明当前使用的对象类型名（ObjectName）,默认为ObjectCatalog对象
var _catalogObject;    //当前传入的目录对象的名称（对应catalog_object字段）
var _catalogOwner;  //指明对象分类所有者（对应catalog_owner字段）

var _catalog_ownerName;	//_catalogOwner != 0 是取得所有者名字

var _root_code; //（默认的）根节点编码（如dewey：ZX000000 default：ZX，虚拟的节点，用于方便显示）

var _catalog_config;  //目录树配置
var _catalog_base;  //编码前缀
var _catalog_depth; //分级数
var _catalog_digit; //分级位数（大于0）
var _catalog_step;  //同级步长（默认：1）
var _catalog_tree;  //编码分级方式（'default'或'dewey'两种，默认 default）

var GLOBAL_REMARK = {};
var GLOBAL_CODE = {};


var openAllNode;    //展开全部节点

var ONCE_COUNT = 20;    //一次取得的记录数
//=====================================================Function=======================================
/**
 * 初始化当前目录对象目录树
 *
 * @param zTreeId 目录树容器id
 * @param zTreeMsgId 目录树错误提示容器id
 * @param catalogObjectName 对象类型名
 * @param catalogObject 所属对象
 * @param catalogOwner 所属用户
 * @param options 参数选项
 */
function initTree(zTreeId, zTreeMsgId, catalogObjectName, catalogObject, catalogOwner, options) {
    // 初始化一些必要参数
    _zTreeId = zTreeId;
    _zTreeMsgId = zTreeMsgId;

    _catalogObjectName = catalogObjectName || "ObjectCatalog";
    _catalogObject = catalogObject; //分类所属对象
    _catalogOwner = catalogOwner || "0"; //分类所有者

    _catalog_ownerName = null;

    _root_code = "";

    if (options) {
        openAllNode = (options && options["open-all"] && (options["open-all"] = true || options["open-all"] == 1)) ? true : false;
    }

    if (tek.type.isEmpty(_zTreeId) || tek.type.isEmpty(_zTreeMsgId) || tek.type.isEmpty(_catalogObjectName)
        || tek.type.isEmpty(_catalogObject) || _catalogOwner < 0)
        return;

    // 清空树显示区域
    var $zTree = $("#" + _zTreeId);
    $zTree.empty();

    // 初始化ztree的setting配置
    var setting = {
        view: {
            fontCss: getTreeFont,
            addHoverDom: null,
            removeHoverDom: null,
            selectedMulti: false
        },
        edit: {
            enable: false,
            editNameSelectAll: false,
            showRemoveBtn: null,
            showRenameBtn: null
        },
        data: {
            keep: {
                parent: true
            },
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeDrag: null,
            beforeEditName: null,
            beforeRemove: null,
            beforeRename: null,
            onClick: nodeClick,
            onExpand: nodeExpand,
            onRemove: null,
            onRename: null
        }
    };
    // 初始化ztree的treeNode节点数据
    var zTreeNodes = [{
        id: "1",
        code: _root_code,
        name: ((_catalogOwner == 0) ? "公共目录" : "私有目录") + (!!_catalogObject ? " [" + _catalogObject + "]" : ""),
        isParent: true,
        open: true
    }];
    // 初始化zTree
    $.fn.zTree.init($zTree, setting, zTreeNodes);

    // 获取树列表
    getTreeList();

    // 获取目录所有者名字
    if (!tek.type.isEmpty(_catalogOwner) && _catalogOwner != 0) {
        getCatalogOwnerName();
    }
}

// 获取树列表
function getTreeList() {
    //初始化配置参数
    initObjectOptionParam();
    // 获取option中相应配置参数
    getObjectOptionParam();

    // 校验允许公共目录还是私有目录
    if (!tek.type.isEmpty(_catalog_config)) {
        if (_catalog_config == '0x00' && _catalogOwner != 0) {
            var msg = "<div style='margin: 30px 0;'>该对象目录分类只允许定义<span style='color: red;'>公共目录</span> ！</div>";
            tek.macCommon.waitDialogShow(null, msg, null, 2);
            return;
        }
        if (_catalog_config == '0x01' && _catalogOwner == 0) {
            var msg = "<div style='margin: 30px 0;'>该对象目录分类只允许定义<span style='color: red;'>私有目录</span> ！</div>";
            tek.macCommon.waitDialogShow(null, msg, null, 2);
            return;
        }
    }

    // 校验编码配置参数通过，读取列表信息
    if (tek.type.isString(_catalog_base)
        && (tek.type.isNumber(_catalog_depth) && _catalog_depth > 0)
        && (tek.type.isNumber(_catalog_digit) && _catalog_digit > 0)
        && (tek.type.isNumber(_catalog_step) && _catalog_step > 0)
        && (_catalog_tree == 'default' || _catalog_tree == 'dewey')) {
        // 根节点（父节点）编码
        var rootCode = "";
        if (_catalog_tree == 'dewey') {
            rootCode = (function () {
                var s = _catalog_base;
                for (var i = 0; i < _catalog_depth * _catalog_digit; i++)
                    s += "0";
                return s;
            })();
        } else if (_catalog_tree == 'default') {
            rootCode = _catalog_base;
        }

        // 修改根节点的编码
        var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
        var rootNode = zTree.getNodeByParam("code", _root_code, null);
        rootNode.code = rootCode;
        _root_code = rootCode;

        // 获取对象分类列表
        getObjectCatalogList(_root_code);
    } else {
        var msg = "<div style='margin: 30px 0;'>该对象目录分类的编码配置参数不完善，请先 <a style='font-weight: 600;' href='javascript:addObjectOption();'>完善</a> ！</div>";
        tek.macCommon.waitDialogShow(null, msg, null, 2);
    }
}

// 添加编码配置参数
function addObjectOption() {
    tek.macCommon.waitDialogHide();
    $('#waiting_modal_dialog').on('hidden.bs.modal', function (e) {
        var url = tek.common.getRootPath() + "http/tekinfo/objectCatalog/admin/add-option.html?option_objectName=" + _catalogObject
            + "&show-close=1&refresh-opener=1";
        window.open(url, "_blank");
    });
}

// 获取目录所有者名字
function getCatalogOwnerName() {
    $.getJSON(tek.common.getRootPath() + "servlet/tobject", {
        objectName: "User",
        action: "readInfo",
        user_id: _catalogOwner
    }, function (data) {
        _catalog_ownerName = (data && data.record && data.record.name) ? data.record.name : "";
    });
}


//--------------------------------------------------------treeName setting----------------------------------------------
/**
 * 设置目录树字体
 *
 * @param treeId 对应 zTree 的 treeId
 * @param treeNode 需要设置自定义样式的节点 JSON 数据对象
 */
function getTreeFont(treeId, treeNode) {
    if (treeNode && treeNode.booking)
        return {
            'background-color': '#333',
            color: '#fff'
        };
    else
        return {};
}

/**
 * 响应节点被点击事件（回调）
 *
 * @param e 标准的 js event 对象
 * @param treeId 对应 zTree 的 treeId，便于用户操控
 * @param treeNode 被点击的节点 JSON 数据对象
 * @param clickFlag 节点被点击后的选中操作类型
 */
function nodeClick(e, treeId, treeNode, clickFlag) {
    var id = treeNode.id;

    $(".node-menu").remove();    // 删除所有节点操作菜单

    var nodeA = $("#" + treeNode.tId + "_a");
    if (!nodeA)
        return;

    // 没有目录对象
    var html = "<span id='" + treeNode.tId + "_menu' class='node-menu'>";
    if (treeNode.level == 0) {
        // 根节点（虚拟节点）
        if (tek.role.isCustomerService(myRole))
            html += "<a href='javascript:addObjectCatalog(\"" + id + "\", false);'>新建下级</a>";
    } else if (treeNode.level > 0) {
        if (tek.right.isCanCreate(treeNode.right)) {
            html +=  "<a href='javascript:addObjectCatalog(\"" + id + "\", true);'>新建同级</a>"
            + (!!treeNode.isParent ? "<a href='javascript:addObjectCatalog(\"" + id + "\", false);'>新建下级</a>" : "")
            + "<a href='javascript:editObjectCatalog(\"" + id + "\");'>修改</a>";
        }
        html += "<a href='javascript:readObjectCatalog(\"" + id + "\");'>读取</a>";
        if (tek.right.isCanCreate(treeNode.right)) {
            html += "<a href='javascript:forbidObjectCatalog(\"" + id + "\");'>" + (treeNode.booking ? '启用' : '禁用') + "</a>";
        }
        if (tek.user.isSupervisor(mySecurity)) {
            html += "<a href='javascript:removeObjectCatalog(\"" + id + "\");'>删除</a>";
        }
    }
    html += "</span>";

    nodeA.after(html);
}

//响应父节点被展开事件
function nodeExpand(e, treeId, treeNode) {
    if (!!treeNode.children)
        return;

    getObjectCatalogList(treeNode.code);
}


//--------------------------------------------------------对象配置-------------------------------------------------------
//初始化配置参数
function initObjectOptionParam() {
    _catalog_config = null;  //目录树配置
    _catalog_base = null;  //编码前缀
    _catalog_depth = 0; //分级数
    _catalog_digit = 0; //分级位数（大于0）
    _catalog_step = 0;  //同级步长（默认：1）
    _catalog_tree = 'default';  //编码分级方式（'default'或'dewey'两种，默认 default）
}

//获取option中相应配置参数
function getObjectOptionParam() {
    var setting = {async: false, operateType: "获取参数配置中相应配置参数"};
    var sendData = {objectName: _catalogObjectName, action: "readInfo", 'read-option': 1, catalog_object: _catalogObject};
    var callback = {
        success: function (data) {
            var record = data["record"];
            record = record || {};

            var value;
            if (record.catalog_config) {
                value = record.catalog_config.value;
                _catalog_config = (value == '0x00' || value == '0x01') ? value : "0x00";
            }
            if (record.catalog_base) {
                value = record.catalog_base.value;
                _catalog_base = !!value ? value : "";
            }
            if (record.catalog_depth) {
                value = record.catalog_depth.value;
                _catalog_depth = (value > 0) ? parseInt(value) : 0;
            }
            if (record.catalog_digit) {
                value = record.catalog_digit.value;
                _catalog_digit = (value > 0) ? parseInt(value) : 0;
            }
            if (record.catalog_step) {
                value = record.catalog_step.value;
                _catalog_step = (value > 0) ? parseInt(value) : 0;
            }
            if (record.catalog_tree) {
                value = record.catalog_tree.value;
                _catalog_tree = (value == 'default' || value == 'dewey') ? value : "default";
            }
        },
        error: function (data, msg) {
            alert(msg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}


//--------------------------------------------------------目录树读取 显示-------------------------------------------------
//取得目录对象列表
function getObjectCatalogList(parentCode, skip) {
    if (tek.type.isEmpty(parentCode, true))
        return;

    skip = (isNaN(skip) || skip < 0) ? 0 : skip;

    var setting = {operateType: "获取目录对象列表"};
    var sendData = {
        objectName: _catalogObjectName,
        action: "getList",
        catalog_object: _catalogObject,
        catalog_owner: _catalogOwner,
        'reference-code': parentCode,
        'show-tree': 1,
        'read-down': 1,
        order: "catalog_code",
        skip: skip,
        count: ONCE_COUNT
    };
    var callback = {
        success: function (data) {
            console.log(data)
            // 操作成功
            $("#" + _zTreeMsgId).html("");

            var records = data["record"];
            if (records) {
                records = tek.type.isArray(records) ? records : [records];

                for (var i in records) {
                    var record = records[i];
                    var code = record && record.catalog_code && record.catalog_code.value || '';
                    if (!record || !code)
                        continue;

                    // 检验鉴定，最后一级
                    if (_catalogObject == "OrganizationService1" && getDepthOfCode(parentCode) + 1 >= _catalog_depth) {
                        var show = getAppraisalCatalog(code);
                        if (!show)
                            continue;

                        record.catalog_name.show = show;
                        addObjectCatalogNode(record, data.right);
                    } else {
                        addObjectCatalogNode(record, data.right);
                    }
                }

                // 递归继续获取
                if (records.length >= sendData['count']) {
                    skip += records.length;
                    getObjectCatalogList(parentCode, skip);
                }
            }
        }, //end success: function(data)
        error: function (data, errorMsg) {
            $("#" + _zTreeMsgId).html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//获取检验鉴定目录（同步ajax请求）
function getAppraisalCatalog(code) {
    if (!code)
        return '';

    var show = '';

    var setting = {async: false};
    var sendData = {objectName: "AppraisalCatalog", action: "readInfo", catalog_code: code};
    var callback = {
        success: function (data) {
            var record = data['record'];
            if (record) {
                record = !record.length ? record : record[0];

                var unit = record.appraisal_catalog_unit && record.appraisal_catalog_unit.value || '';
                var min_price = record.appraisal_catalog_min && record.appraisal_catalog_min.value || '';
                var max_price = record.appraisal_catalog_max && record.appraisal_catalog_max.value || '';
                show = record.name + " " + unit + " " + min_price.split(".")[0] + " " + max_price.split(".")[0];
                // GLOBAL_REMARK[catalogId]
                var id = record.id;
                var remark_val = record.appraisal_catalog_remark && tek.dataUtility.stringToInputHTML(record.appraisal_catalog_remark.value) || "";
                // GLOBAL_REMARK["ct" + id] = remark_val;
                GLOBAL_CODE["code" + code] = remark_val;
            }
        },
        error: function (data, errMsg) {
            $("#" + _zTreeMsgId).html(errMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

    return show;
}

//添加节点
function addObjectCatalogNode(record, right) {
    var id = record.id;
    var code = record.catalog_code && record.catalog_code.value || '';
    var name = record.catalog_name && record.catalog_name.show || '';
    var booking = !!parseInt(record.booking && record.booking.value || '');
    var isParent = getDepthOfCode(code) >= 0 && getDepthOfCode(code) < _catalog_depth;
    var parentCode = getParentCode(code);

    if (parentCode == null)
        return;

    var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
    var parentNode = zTree.getNodeByParam("code", parentCode, null);
    var newNode = {
        id: id,
        code: code,
        pCode: parentCode,
        nname: name,
        name: code + ":" + name,
        booking: booking,
        right: right,
        isParent: isParent
    };
    zTree.addNodes(parentNode, newNode);

    //展开全部节点
    if (openAllNode && newNode.isParent) {
        getObjectCatalogList(newNode.code);
    }
}


//-------------------------------------------------------节点操作--------------------------------------------------------
//新建当前对象的目录树节点（addSame=true新建同级，false新建下级）
function addObjectCatalog(catalogId, addSame) {
    if (!catalogId)
        return;
    var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
    var referenceNode = zTree.getNodeByParam("id", catalogId, null);
    if (!referenceNode)
        return;

    var setting = {operateType: "获取目录对象列表"};
    var sendData = {
        objectName: "ObjectCatalog",
        action: "getNew",
        'reference-code': referenceNode.code,
        catalog_object: _catalogObject,
        catalog_owner: _catalogOwner
    };
    if (addSame)
        sendData["add-same"] = 1;
    else
        sendData["add-down"] = 1;

    var callback = {
        beforeSend: function () {
            $("#operate-modal-dialog").modal("show", null, 2);
            $("#operate-modal-dialog-title").html("新建目录");
            $("#operate-modal-dialog-body").html("<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在修改...");
        },
        success: function (data) {
            // 操作成功
            if (data.record) {
                showAddObjectCatalog(data.record);
            } else {
                $("#operate-modal-dialog-body").html("<span style='color: red;'>新建域为空!</apan>");
            }
        },
        error: function (data, errorMsg) {
            $("#operate-modal-dialog-body").html(errorMsg);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);

    var showAddObjectCatalog = function (record) {
        if (!record)
            return;

        if (record.catalog_code && record.catalog_code.value && record.catalog_code.value.length > 0) {
            var field;
            var html1 = "<form id='add_form' name='add_form' method='post' action='javascript:;'>";
            field = record.catalog_code;
            if (field) {
                html1 += "<div class='form-group'>"
                + "<label class='control-label' for='" + field.name + "'>" + field.display + "</label>"
                + "<input type='text' id='" + field.name + "' name='" + field.name + "' class='form-control' value='" + field.value + "' disabled='disabled'/>"
                + "<p class='help-block text-right' style='font-size: 1em;line-height: 1em;'>"
                + "编码方式：" + (_catalog_tree == "dewey" ? "杜威" : "默认")
                + "；前缀：" + (_catalog_base.length > 0 ? _catalog_base : "无")
                + "；划分层级数：" + _catalog_depth + "级；每一级位数：" + _catalog_digit + "位；步长：" + _catalog_step
                + "</p>"
                + "</div>";
            }
            field = record.catalog_name;
            if (field) {
                // 分类名称
                html1 += "<div class='form-group'>"
                + "<label class='control-label' for='" + field.name + "'>" + field.display + "</label>"
                + "<input type='text' id='" + field.name + "' name='" + field.name + "' class='form-control' value='" + field.value + "'/>"
                + "</div>";
            }
            var code = record.catalog_code && record.catalog_code.value || '';
            if (_catalogObject == "OrganizationService1" && getDepthOfCode(code) >= _catalog_depth) {
                var name = '';
                var unit = '';
                var min_price = '';
                var max_price = '';
                var remark = '';

                // 检验鉴定，最后一级
                html1 += "<div class='form-group'>"
                + "<label class='control-label' for='catalog_name-unit'>单位</label>"
                + "<input type='text' id='catalog_name-unit' name='catalog_name-unit' class='form-control' value='" + tek.dataUtility.stringToInputHTML(unit) + "'/>"
                + "</div>";

                // 最低基准价
                html1 += "<div class='form-group'>"
                + "<label class='control-label' for='catalog_name-min_price'>最低基准价</label>"
                + "<input type='text' id='catalog_name-min_price' name='catalog_name-min_price' class='form-control' value='" + tek.dataUtility.stringToInputHTML(min_price) + "'/>"
                + "</div>";

                // 最高基准价
                html1 += "<div class='form-group'>"
                + "<label class='control-label' for='catalog_name-max_price'>最高基准价</label>"
                + "<input type='text' id='catalog_name-max_price' name='catalog_name-max_price' class='form-control' value='" + tek.dataUtility.stringToInputHTML(max_price) + "'/>"
                + "</div>";

                // // 说明
                html1 += "<div class='form-group'>"
                     + "<label class='control-label' for='catalog_name-remark'>说明</label>"
                     // + "<input type='text' id='catalog_name-remark' name='catalog_name-remark' class='form-control' value='" + remark + "'/>"
                     + "<textarea type='text' id='catalog_name-remark' name='catalog_name-remark' class='form-control add-apprisal-remark' ></textarea>"
                     + "</div>";
            }
            html1 += "<div class='form-group row'>";
            field = record.catalog_object;
            if (field) {
                html1 += "<div class='col-xs-12 col-sm-6'>"
                + "<label class='control-label'>" + field.display + "：</label>"
                + "<span id='catalog_object'>" + _catalogObject + "</span>"
                + "</div>";
            }
            field = record.catalog_owner;
            if (field) {
                html1 += "<div class='col-xs-12 col-sm-6'>" +
                "<label class='control-label'>" + field.display + "：</label>"
                + "<span id='catalog_owner'>" + (_catalogOwner == 0 ? "<span class='label label-default'>公共</span>" : _catalog_ownerName) + "</span>"
                + "</div>";
            }
            html1 += "<div class='clearfix'></div>"
            + "</div>"
            + "</form>";
            $("#operate-modal-dialog-body").html(html1);
            $("#catalog_name-remark").val(tek.dataUtility.stringToInputHTML(remark));

            var html2 = "<button class='btn btn-success' onclick=\"submitAddObjectCatalog('add_form','" + catalogId + "'," + addSame + ");\">确 定</button>"
                + "<button type='button' class='btn btn-danger' data-dismiss='modal'>取 消</button>";
            $("#operate-modal-dialog-foot").html(html2);
        } else {
            $("#operate-modal-dialog-body").html("<span style='color: red;'>取得新建编码错误!</apan>");
        }
    }
}

//提交新建当前对象的目录树节点
function submitAddObjectCatalog(formId, catalogId, addSame) {
    var form = document.getElementById(formId);
    if (!form || tek.type.isEmpty(catalogId))
        return;
    var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
    var referenceNode = zTree.getNodeByParam("id", catalogId, null);
    if (!referenceNode)
        return;

    var code = form.catalog_code.value;
    var name = form.catalog_name.value;
    if (tek.type.isEmpty(code) || tek.type.isEmpty(name)) {
        tek.macCommon.waitDialogShow(null, "编码 或 分类名称 不能为空！");
        tek.macCommon.waitDialogHide(3000);
        return;
    }

    var isAppraisal = false; // 是否是检验鉴定（最后一级）
    var unit;
    var min_price;
    var max_price;
    var remark;

    if (_catalogObject == "OrganizationService1" && getDepthOfCode(code) >= _catalog_depth) {
        isAppraisal = true;

        if (form["catalog_name-unit"])
            unit = form["catalog_name-unit"].value;
        if (tek.type.isEmpty(unit)) {
            tek.macCommon.waitDialogShow(null, "单位不能为空！");
            tek.macCommon.waitDialogHide(3000);
            return;
        }

        if (form["catalog_name-min_price"])
            min_price = form["catalog_name-min_price"].value;
        if (tek.type.isEmpty(min_price)) {
            tek.macCommon.waitDialogShow(null, "最低基准价不能为空！");
            tek.macCommon.waitDialogHide(3000);
            return;
        }

        if (form["catalog_name-max_price"])
            max_price = form["catalog_name-max_price"].value;
        if (tek.type.isEmpty(max_price)) {
            tek.macCommon.waitDialogShow(null, "最高基准价不能为空！");
            tek.macCommon.waitDialogHide(3000);
            return;
        }

        if (parseInt(max_price) < parseInt(min_price)) {
            tek.macCommon.waitDialogShow(null, "最高基准价低于最低基准价");
            tek.macCommon.waitDialogHide(3000);
            return;
        }

        if(form["catalog_name-remark"]){
            remark=form["catalog_name-remark"].value;
        }

        if (tek.type.isEmpty(remark)) {
            tek.macCommon.waitDialogShow(null, "说明不能为空！");
            tek.macCommon.waitDialogHide(3000);
            return;
        }
    }

    // 操作成功
    var _showSuccess = function (data) {
        var newId = data.value;
        newId = (newId) ? newId.split("=")[1] : null;
        if (!newId) return;

        var isParent = (getDepthOfCode(code) >= 0 && getDepthOfCode(code) < _catalog_depth) ? true : false;
        var parentCode = getParentCode(code);
        if (parentCode == null)
            return;

        var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
        var parentNode = zTree.getNodeByParam("code", parentCode, null);
        var newNode = {
            id: newId,
            code: code,
            "pCode": parentCode,
            "nname": isAppraisal ? (name + " " + unit + " " + min_price + " " + max_price) : name,
            "name": isAppraisal ? (code + ":" + name + " " + unit + " " + min_price + " " + max_price) : (code + ":" + name),
            booking: false,
            right: data.right,
            isParent: isParent
        };
        zTree.addNodes(parentNode, newNode);

        $("#operate-modal-dialog").modal("hide");
        $("#operate-modal-dialog-body").html("");
        tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message));
        tek.macCommon.waitDialogHide(3000);
    };

    // 新建检验鉴定的目录
    var _addAppraisalCatalog = function (_data) {
        var setting = {operateType: "提交新建当前对象的目录树节点"};

        var params_val = tek.common.getSerializeObjectParameters("add_form");

        var sendData = {
            objectName: "AppraisalCatalog",
            action: "setInfo",
            catalog_code: code,
            appraisal_catalog_unit: params_val["catalog_name-unit"],
            appraisal_catalog_min: params_val["catalog_name-min_price"],
            appraisal_catalog_max: params_val["catalog_name-max_price"],
            appraisal_catalog_remark: params_val["catalog_name-remark"]
        };

        var callback = {
            success: function (data) {
                _showSuccess(_data);
                GLOBAL_CODE["code" + code] = decodeURIComponent(params_val["catalog_name-remark"]);
            },
            error: function (data, errorMsg) {
                tek.macCommon.waitDialogShow(null, errorMsg);
                tek.macCommon.waitDialogHide(3000);
            }
        };

        tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
    };

    // 提交操作开始
    var setting = {operateType: "提交新建当前对象的目录树节点"};
    var sendData = {
        objectName: _catalogObjectName,
        action: "addInfo",
        catalog_code: code,
        catalog_name: name,
        catalog_object: _catalogObject,
        catalog_owner: _catalogOwner,
        'reference-code': referenceNode.code
    };
    if (addSame == "true") {
        sendData["add-same"] = 1;
    } else {
        sendData["add-down"] = 1;
    }
    var callback = {
        beforeSend: function () {
            tek.macCommon.waitDialogShow(null, "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在提交...", null, 2);
        },
        success: function (data) {
            if (isAppraisal) {
                _addAppraisalCatalog(data);
            } else {
                _showSuccess(data);
            }
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//修改目录对象（名称）
function editObjectCatalog(catalogId) {
    if (!catalogId)
        return;
    var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
    var editNode = zTree.getNodeByParam("id", catalogId, null);
    if (!editNode)
        return;

    $("#operate-modal-dialog").modal("show");
    $("#operate-modal-dialog-title").html("修改名称");

    var name = editNode.nname;

    var isAppraisal = false; // 是否是检验鉴定（最后一级）
    var unit = '';
    var min_price = '';
    var max_price = '';
    var remark = '';
    if (_catalogObject == "OrganizationService1" && getDepthOfCode(editNode.code) >= _catalog_depth) {
        isAppraisal = true;

        var array = tek.dataUtility.stringToArray(editNode.nname, " ");
        if (array) {
            if (array.length > 0) {
                name = array[0];
                if (array.length > 1) {
                    unit = array[1];
                    if (array.length > 2) {
                        min_price = array[2];
                        if (array.length > 3) {
                            max_price = array[3];
                        }
                    }
                }
            }
        }
        // remark = GLOBAL_REMARK["ct" + catalogId] || "";
        remark = GLOBAL_CODE["code" + editNode.code];
    }

    var html1 = "<form id='edit_form'>";
    html1 += "<div class='form-group'>"
    + "<label class='control-label' for='catalog_name'>分类名称</label>"
    + "<input type='text' id='catalog_name' name='catalog_name' class='form-control' value='" + name + "'/>"
    + "</div>";

    if (isAppraisal) {
        // 单位
        html1 += "<div class='form-group'>"
        + "<label class='control-label' for='catalog_name-unit'>单位</label>"
        + "<input type='text' id='catalog_name-unit' name='catalog_name-unit' class='form-control' value='" + tek.dataUtility.stringToInputHTML(unit) + "'/>"
        + "</div>";

        // 最低基准价
        html1 += "<div class='form-group'>"
        + "<label class='control-label' for='catalog_name-min_price'>最低基准价</label>"
        + "<input type='text' id='catalog_name-min_price' name='catalog_name-min_price' class='form-control' value='" + (tek.dataUtility.stringToInputHTML(min_price) || 0) + "'/>"
        + "</div>";


        // 最高基准价
        html1 += "<div class='form-group'>"
        + "<label class='control-label' for='catalog_name-max_price'>最高基准价</label>"
        + "<input type='text' id='catalog_name-max_price' name='catalog_name-max_price' class='form-control' value='" + (tek.dataUtility.stringToInputHTML(max_price) || 0) + "'/>"
        + "</div>";

        // 说明
        html1 += "<div class='form-group'>"
             + "<label class='control-label' for='catalog_name-remark'>说明</label>"
             // + "<input type='text' id='catalog_name-remark' name='catalog_name-remark' class='form-control' value='" + remark + "'/>"
             // + "<textarea type='text' id='catalog_name-remark' name='catalog_name-remark' class='form-control edit-apprisal-remark' >"+ tek.dataUtility.stringToInputHTML(remark) +"</textarea>"
             + "<textarea type='text' id='catalog_name-remark' name='catalog_name-remark' class='form-control edit-apprisal-remark' ></textarea>"

             + "</div>";
    }

    html1 += "</form>";

    $("#operate-modal-dialog-body").html(html1);
    $("#catalog_name-remark").val(tek.dataUtility.stringToInputHTML(remark));

    var html2 = "<button class='btn btn-success' onclick=\"submitEditObjectCatalog('" + catalogId + "','" + editNode.nname + "',$('#catalog_name').val().trim());\">确 定</button>"
        + "<button type='button' class='btn btn-danger' data-dismiss='modal'>取 消</button>";
    $("#operate-modal-dialog-foot").html(html2);
}

//提交修改目录对象（名称）
function submitEditObjectCatalog(catalogId, oldName, newName) {
    if (!catalogId || newName == oldName)
        return;
    var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
    var editNode = zTree.getNodeByParam("id", catalogId, null);
    if (!editNode)
        return;

    if (tek.type.isEmpty(newName)) {
        tek.macCommon.waitDialogShow(null, "名称不能为空！");
        tek.macCommon.waitDialogHide(3000);
        return;
    }

    var isAppraisal = false; // 是否是检验鉴定（最后一级）
    var unit;
    var min_price;
    var max_price;
    var remark;

    if (_catalogObject == "OrganizationService1" && getDepthOfCode(editNode.code) >= _catalog_depth) {
        isAppraisal = true;

        var form = document.getElementById("edit_form");

        var params_val = tek.common.getSerializeObjectParameters("edit_form");

        if (form["catalog_name-unit"]) {
            unit = form["catalog_name-unit"].value;
            // unit = params_val["catalog_name-unit"];

            if (tek.type.isEmpty(unit)) {
                tek.macCommon.waitDialogShow(null, "单位不能为空！");
                tek.macCommon.waitDialogHide(3000);
                return;
            }
        }

        if (form["catalog_name-min_price"]) {
            min_price = params_val["catalog_name-min_price"];
            if (tek.type.isEmpty(min_price)) {
                tek.macCommon.waitDialogShow(null, "最低基准价不能为空！");
                tek.macCommon.waitDialogHide(3000);
                return;
            }
        }

        if (form["catalog_name-max_price"]) {
            max_price = params_val["catalog_name-max_price"];

            if (tek.type.isEmpty(max_price)) {
                tek.macCommon.waitDialogShow(null, "最高基准价不能为空！");
                tek.macCommon.waitDialogHide(3000);
                return;
            }
        }

        if (parseInt(max_price) < parseInt(min_price)) {
            tek.macCommon.waitDialogShow(null, "最高基准价低于最低基准价");
            tek.macCommon.waitDialogHide(3000);
            return;
        }

        if(form["catalog_name-remark"]){
            remark=params_val["catalog_name-remark"];
            // remark=form["catalog_name-remark"].value;


            if (tek.type.isEmpty(remark)) {
                tek.macCommon.waitDialogShow(null, "说明不能为空！");
                tek.macCommon.waitDialogHide(3000);
                return;
            }
        }
    }

    // 操作成功
    var _showSuccess = function (data) {
        var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
        var node = zTree.getNodeByParam("id", catalogId, null);

        if (isAppraisal)
            newName = newName + " " + unit + " " + min_price + " " + max_price;

        node.name = node.code + ":" + newName;
        node.nname = newName;
        zTree.updateNode(node);

        $("#operate-modal-dialog").modal("hide");
        $("#operate-modal-dialog-body").html("");
        tek.macCommon.waitDialogShow(null, "修改节点名成功!");
        tek.macCommon.waitDialogHide(3000);
    };

    // 新建检验鉴定的目录
    var _editAppraisalCatalog = function (_data) {
        var setting = {operateType: "提交新建当前对象的目录树节点"};
        var sendData = {
            objectName: "AppraisalCatalog",
            action: "setInfo",
            appraisal_catalog_unit: unit,
            appraisal_catalog_min: min_price,
            appraisal_catalog_max: max_price,
            appraisal_catalog_remark: remark,
            catalog_code: editNode.code
        };
        var callback = {
            success: function (data) {
                _showSuccess(_data);
                GLOBAL_CODE["code" + editNode.code] = decodeURIComponent(remark);
            },
            error: function (data, errorMsg) {
                tek.macCommon.waitDialogShow(null, errorMsg);
                tek.macCommon.waitDialogHide(3000);
            }
        };
        tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
    };

    // 提交操作开始
    var setting = {operateType: "提交修改当前对象的目录树节点名称"};
    var sendData = {
        objectName: _catalogObjectName,
        action: "setInfo",
        catalog_id: catalogId,
        catalog_name: encodeURIComponent(newName)
    };
    var callback = {
        beforeSend: function () {
            tek.macCommon.waitDialogShow(null, "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在修改...", null, 2);
        },
        success: function (data) {
            if (isAppraisal) {
                _editAppraisalCatalog(data);
            } else {
                _showSuccess(data);
            }
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//读取指定标识的目录对象
function readObjectCatalog(catalogId) {
    var url = tek.common.getRootPath() + "http/tekinfo/objectCatalog/read.html?catalog_id=" + catalogId + "&show-close=1&refresh-opener=1";
    window.open(url, "_blank");
}

//禁用（启用）指定标识的目录对象
function forbidObjectCatalog(catalogId) {
    if (!catalogId)
        return;
    var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
    var forbidNode = zTree.getNodeByParam("id", catalogId, null);
    if (!forbidNode)
        return;

    var forbid = window.confirm("确定" + (forbidNode.booking ? "启用" : "禁用") + "“" + forbidNode.name + "”?");
    if (!forbid)
        return;

    var setting = {operateType: "禁用/通过"};
    var sendData = {
        objectName: _catalogObjectName,
        action: "setInfo",
        catalog_id: catalogId,
        booking: forbidNode.booking ? 0 : 1
    };
    var callback = {
        beforeSend: function () {
            tek.macCommon.waitDialogShow(null, "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在删除...", null, 2);
        },
        success: function (data) {
            tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message));

            // 修改操作节点的所有子节点
            var booking = !forbidNode.booking;
            var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
            var children = zTree.getNodesByFilter(function (node, pCode) {
                return node.code.startsWith(pCode);
            }, false, forbidNode, forbidNode.code);
            children.unshift(forbidNode);
            for (var i = 0; i < children.length; i++) {
                var node = children[i];
                var nodeA = $("#" + node.tId + "_a");
                if (!nodeA)
                    continue;
                node.booking = booking;
                if (booking) {
                    nodeA.css({'background-color': '#333', color: '#fff'});
                } else {
                    nodeA.css({'background-color': '', color: ''});
                }
            }

            // 触发操作节点的点击事件
            $("#" + forbidNode.tId + "_a").click();
        },
        error: function (data, errorMsg) {
            tek.macCommon.waitDialogShow(null, errorMsg);
        },
        complete: function () {
            tek.macCommon.waitDialogHide(3000);
        }
    };
    tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
}

//删除指定标识的目录对象
function removeObjectCatalog(catalogId) {
    if (!catalogId)
        return;
    var zTree = $.fn.zTree.getZTreeObj(_zTreeId);
    var removeNode = zTree.getNodeByParam("id", catalogId, null);
    if (!removeNode)
        return;

    var remove = window.confirm("确定删除“" + removeNode.name + "”?");
    if (!remove)
        return;

    var isAppraisal = false; // 是否是检验鉴定（最后一级）
    if (_catalogObject == "OrganizationService1" && getDepthOfCode(removeNode.code) >= _catalog_depth)
        isAppraisal = true;

    // 删除检验鉴定的目录
    var _removeAppraisalCatalog = function () {
        var setting = {operateType: "提交新建当前对象的目录树节点"};
        var sendData = {objectName: "AppraisalCatalog", action: "removeInfo", catalog_code: removeNode.code};
        var callback = {
            success: function (data) {
                _removeObjectCatalog();
                delete GLOBAL_CODE["code" + removeNode.code];
            },
            error: function (data, errorMsg) {
                tek.macCommon.waitDialogShow(null, errorMsg);
                tek.macCommon.waitDialogHide(3000);
            }
        };
        tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
    };

    // 删除ObjectCatalog
    var _removeObjectCatalog = function () {
        var setting = {operateType: "提交修改当前对象的目录树节点名称"};
        var sendData = {objectName: _catalogObjectName, action: "removeInfo", catalog_id: catalogId};
        var callback = {
            success: function (data) {
                zTree.removeNode(removeNode);

                tek.macCommon.waitDialogShow(null, tek.dataUtility.stringToHTML(data.message));
                tek.macCommon.waitDialogHide(3000);
            },
            error: function (data, errorMsg) {
                tek.macCommon.waitDialogShow(null, errorMsg);
                tek.macCommon.waitDialogHide(3000);
            }
        };
        tek.common.ajax(tek.common.getRootPath() + "servlet/tobject", setting, sendData, callback);
    };

    // 删除操作开始
    if (isAppraisal) {
        tek.macCommon.waitDialogShow(null, "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在删除...", null, 2);
        _removeAppraisalCatalog();
    } else {
        tek.macCommon.waitDialogShow(null, "<img src='" + tek.common.getRootPath() + "http/images/waiting-small.gif'/> 正在删除...", null, 2);
        _removeObjectCatalog();
    }

}


//-----------------------------------------------通用函数（适用于本js文件）------------------------------------------------
//获取当前编码的父编码
function getParentCode(code) {
    // 参数合法性判断
    if (tek.type.isEmpty(code) || !tek.type.isString(code))
        return null;

    // 配置判断
    if (!tek.type.isString(_catalog_base) || _catalog_depth <= 0 || _catalog_digit <= 0 || _catalog_step <= 0)
        return null;

    var currentDepth = getDepthOfCode(code);
    if (currentDepth < 1)
        return null;

    var parentCode = "";

    if (_catalog_tree == "dewey") {
        var endIndex = _catalog_base.length + (currentDepth - 1) * _catalog_digit;
        parentCode += code.substring(0, endIndex);

        for (var i = 0; i < (_catalog_depth - currentDepth + 1) * _catalog_digit; i++) {
            parentCode += "0";
        }
    } else if (_catalog_tree == "default") {
        var endIndex = _catalog_base.length + (currentDepth - 1) * _catalog_digit;
        parentCode += code.substring(0, endIndex);
    }

    return parentCode;
}

//计算获取当前编码的级数（深度）
function getDepthOfCode(code) {
    // 参数合法性判断
    if (tek.type.isEmpty(code) || !tek.type.isString(code))
        return -1;

    // 编码code合法性判断
    if (_catalog_digit <= 0 || code.length < (_catalog_base.length + _catalog_digit)
        || code.substring(0, _catalog_base.length) != _catalog_base)
        return -1;

    // 去掉前缀
    if (code.substring(0, _catalog_base.length) == _catalog_base) {
        code = code.substring(_catalog_base.length);
    }

    // 计算级别数
    var dp = 0;
    if (_catalog_tree == "dewey") {
        // 取得每一级总编码，如digit=4，返回 0000
        var prefix = (function () {
            var s = "";
            for (var i = 0; i < _catalog_digit; i++)
                s += "0";
            return s;
        })();
        for (var toffset = 0; toffset < code.length; toffset += _catalog_digit) {
            if (code.substring(toffset, toffset + _catalog_digit) != prefix) {
                dp++;
            } else {
                break;
            }
        }
    } else if (_catalog_tree == "default") {
        dp = parseInt((code.length + _catalog_digit - 1) / _catalog_digit);
    }
    return dp;
}

//---------------------------------------------------------End----------------------------------------------------------