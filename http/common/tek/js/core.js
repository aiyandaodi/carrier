/***************************************************************************************************
 * 说明：
 *   该JS文件是系统的核心js，所有页面都应该加载。
 * 要求：
 *   需要加载common.js
 *-------------------------------------------------------------------------------------------------
 * window. 全局公共变量（参数）：
 *     request - 请求参数对象。
 *     showClose - 是否关闭当前页面。
 *     callbackURL - 回调地址。
 *     updateOpener - 是否刷新父页面。
 *-------------------------------------------------------------------------------------------------
 * tek.core 公共函数：
 *     function tek.core.getURLRequest(); - 取得当前当前URL中的request。
 *     function tek.core.goBack(); - 回前一页（如果未定义callbackURL，返回主页）。
 *     function tek.core.goHome(); - 跳转到Home主页。
 ***************************************************************************************************/

(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义全局变量
    window.request = null;         // 请求的request对象
    window.showClose = null;       // 是否关闭当前页面
    window.callbackURL = null;     // 回调地址
    window.updateOpener = null;    // 是否刷新父页面
    window.updateOpenerFunc = null;// 刷新父页面调用的函数名

    // 定义 core.js 中相关的参数、函数
    tek.core = {};
    (function (core) {
        /**
         * 取得当前当前URL中的request
         */
        core.getURLRequest = function () {
            request = tek.common.getRequest() || {};

            // 是否关闭
            showClose = request["show-close"];
            showClose = (showClose && (showClose == 1 || showClose == true)) ? 1 : 0;
            // 回调地址
            callbackURL = request["callback-url"];
            callbackURL = !!callbackURL ? decodeURIComponent(callbackURL) : callbackURL;
            // 是否刷新父页面
            updateOpener = request["refresh-opener"];
            updateOpener = (updateOpener && (updateOpener == 1 || updateOpener == true)) ? 1 : 0;
            // 刷新父页面调用的函数名
            updateOpenerFunc = request["refresh-opener-func"];
        };

        /**
         * 回前一页（如果未定义callbackURL，返回主页）
         */
        core.goBack = function () {
            if (parent && parent != self) {
                if (typeof(parent.tek.refresh.refreshOpener) == "function") {
                    parent.tek.refresh.refreshOpener();
                    return;
                }
            }

            var url = (callbackURL && callbackURL.length > 0) ? decodeURIComponent(callbackURL) : tek.common.getRootPath();

            self.location = url;
        };

        /**
         * 跳转到Home主页
         */
        core.goHome = function () {
            self.location = tek.common.getRootPath();
        };

    })(tek.core);

})();
