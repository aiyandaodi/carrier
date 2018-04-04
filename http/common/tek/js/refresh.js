/***************************************************************************************************
 * 说明：
 *   该JS文件实现刷新相关的操作。
 * 要求：
 *   需要加载 common.js、dataUtility.js、core.js
 *-------------------------------------------------------------------------------------------------
 * tek.refresh公共参数&函数：
 *     function tek.refresh.refresh(charset); - 刷新。
 *     function tek.refresh.refreshOpener(charset, func); - 刷新opener页面。
 *-------------------------------------------------------------------------------------------------
 * 页面可选自定义方法：
 *     function tek.refresh.customRefresh(charset); - 自定义刷新方法
 ***************************************************************************************************/

(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义 refresh.js 中相关的参数、函数
    tek.refresh = {};
    (function (refresh) {
        /**
         * 刷新
         * @param {String} [charset] 字符集值
         */
        refresh.refresh = function (charset) {
            // 刷新父页面
            if (typeof updateOpener == "undefined") {
                var req = tek.common.getRequest() || {};
                var ref = req["refresh-opener"];
                window.updateOpener = (ref == 1 || ref == true) ? 1 : 0;
            }

            if (updateOpener == 1) {
                var code = "tek.refresh.refreshOpener("
                    + (!!charset ? "'" + charset + "'" : "")
                    + ");";

                setTimeout(code, 500);
            }

            // 刷新当前页面
            if (typeof tek.refresh.customRefresh == "function") {
                // 存在自定义刷新函数
                tek.refresh.customRefresh(charset);
            } else {
                setTimeout("window.location.reload();", 500);
            }
        };

        /**
         * 刷新opener页面
         * @param {String} [charset] 字符集值
         * @param {Function} [func] 刷新函数名（例如“refresh()”，不包含window.opener）
         */
        refresh.refreshOpener = function (charset, func) {
            if (frameElement && frameElement.api) {
                // 弹出框刷新父页面
                if (func && eval("typeof(frameElement.api.opener." + func + ")") == "function")
                    eval("frameElement.api.opener." + func);
                else if (frameElement.api.opener.refreshWithWaiting)
                    frameElement.api.opener.refreshWithWaiting(charset);
                else if (frameElement.api.opener.tek.refresh.refresh)
                    frameElement.api.opener.tek.refresh.refresh(charset);
                else
                    frameElement.api.opener.window.location.reload();

            } else {
                if (window.opener) {
                    if (window.opener != window) {
                        // window.opener刷新
                        if (func && eval("typeof(window.opener." + func + ")") == "function") {
                            eval("window.opener." + func + "();");
                        } else if (typeof(window.opener.tek.refresh.refresh) == "function") {
                            // 执行tekRefresh()刷新
                            window.opener.tek.refresh.refresh(charset);

                        } else {
                            window.opener.location.reload();

                        } // end  if (typeof(window.opener.refresh)=="function") else
                    } // end if(window.opener!=window)

                } else if (parent != window) {
                    // parent刷新
                    if (func && eval("typeof(parent." + func + ")") == "function") {
                        eval("parent." + func);
                    } else if (typeof(parent.tek.refresh.refresh) == "function") {
                        // 执行refresh()刷新
                        parent.tek.refresh.refresh(charset);
                    } else {
                        parent.location.reload();

                    } // end  if (typeof(window.opener.refresh)=="function") else
                } // end if(window.opener) else
            } // end if(frameElement) else
        };

    })(tek.refresh);

})();
