/***************************************************************************************************
 * 说明：
 *   该JS文件用于获取显示服务器时间相关操作。
 * 要求：
 *   页面中需要 id="clientTime" 和 id="serverTime" 的DOM元素
 *   需要加载 common.js
 *------------------------------------------------------------------------------------------------
 * tek.serverTimer 公共参数&函数：
 *     serverTimer.handle; - 服务器时间显示循环句柄（用不控制循环）
 *
 *     function tek.serverTimer.showTime(); - 显示服务器时间
 *     function tek.serverTimer.show(); - 更新显示服务器时间
 ***************************************************************************************************/

(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义 serverTimer.js 中相关的参数、函数
    tek.serverTimer = {};
    (function (serverTimer) {
        /**
         * 获取客户端时间字符串
         * @return {String} 时间信息的字符串
         */
        function getClientTime() {
            var now = new Date();

            var year = now.getYear();
            year = (year < 1900) ? year + 1900 : year;

            var month = now.getMonth() + 1;
            month = (month < 10) ? "0" + month : "" + month;

            var date = now.getDate();
            date = (date < 10) ? "0" + date : "" + date;

            var hour = now.getHours();
            hour = (hour < 10) ? "0" + hour : "" + hour;

            var minute = now.getMinutes();
            minute = (minute < 10) ? "0" + minute : "" + minute;

            var second = now.getSeconds();
            second = (second < 10) ? "0" + second : "" + second;

            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }

        //服务器时间
        var serverDate;

        /**
         * 获取服务器端时间字符串
         * @return {String} 时间信息的字符串
         */
        function getServerTime() {
            var timeStr = "";

            if (!serverDate) {
                // 没有数据，从服务器获取
                $.ajax({
                    type: "post",
                    url: tek.common.getRelativePath() + "servlet/sys",
                    dataType: "json",
                    data: {action: "getServerTime"},
                    success: function (data) {
                        if (data.code == 0) {
                            //操作成功
                            serverDate = new Date();
                            serverDate.setTime(data.value);

                            var year = serverDate.getYear();
                            year = (year < 1900) ? year + 1900 : year;

                            var month = serverDate.getMonth() + 1;
                            month = (month < 10) ? "0" + month : "" + month;

                            var date = serverDate.getDate();
                            date = (date < 10) ? "0" + date : "" + date;

                            var hour = serverDate.getHours();
                            hour = (hour < 10) ? "0" + hour : "" + hour;

                            var minute = serverDate.getMinutes();
                            minute = (minute < 10) ? "0" + minute : "" + minute;

                            var second = serverDate.getSeconds();
                            second = (second < 10) ? "0" + second : "" + second;

                            timeStr = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
                        }
                    }
                });
            } else {
                // 已经存在，自动+1
                serverDate.setSeconds(serverDate.getSeconds() + 1);

                var year = serverDate.getYear();
                year = (year < 1900) ? year + 1900 : year;

                var month = serverDate.getMonth() + 1;
                month = (month < 10) ? "0" + month : "" + month;

                var date = serverDate.getDate();
                date = (date < 10) ? "0" + date : "" + date;

                var hour = serverDate.getHours();
                hour = (hour < 10) ? "0" + hour : "" + hour;

                var minute = serverDate.getMinutes();
                minute = (minute < 10) ? "0" + minute : "" + minute;

                var second = serverDate.getSeconds();
                second = (second < 10) ? "0" + second : "" + second;

                timeStr = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            }

            return timeStr;
        }

        /**
         * 显示服务器时间
         */
        serverTimer.showTime = function () {
            // 客户端时间
            var client = document.getElementById("clientTime");
            if (client)
                client.innerHTML = getClientTime();

            // 服务器时间
            var server = document.getElementById("serverTime");
            if (server)
                server.innerHTML = getServerTime();
        };

        // 服务器时间显示循环句柄（用于控制循环）
        serverTimer.handle;

        /**
         * 更新显示服务器时间
         */
        serverTimer.show = function () {
            serverTimer.showTime();
            serverTimer.handle = setInterval(tek.serverTimer.showTime, 1000);
        };

    })(tek.serverTimer);

})();
