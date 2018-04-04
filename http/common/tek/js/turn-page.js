/***************************************************************************************************
 * 说明：
 *   该JS文件用于显示分页信息。
 * 要求：
 *   需要加载 tool.js、common.js、dataUtility.js、mac-common.js
 *------------------------------------------------------------------------------------------------
 * tek.turnPage 公共参数&函数：
 *     function tek.turnPage.show(ulId, skip, count, total, groupCount, noPage, noTotal, noTurn, noGroup, name); - 显示分页信息
 *     function tek.turnPage.getPagination(skip, count, total); - 获取页码html信息文本（形如：2/3页 共13条）
 *     function tek.turnPage.getCurrentPageNumber(skip, count); - 取得当前页码
 *     function tek.turnPage.getTotalPageNumber(total, count); - 取得总页数
 *-------------------------------------------------------------------------------------------------
 * 页面需要实现的操作方法：
 *     function tek.turnPage.turn(ulId, skip); - 翻页。取得skip数量之后的信息。
 ***************************************************************************************************/

(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义 turn-page.js 中相关的参数、函数
    tek.turnPage = {};
    (function (turnPage) {
        /**
         * 显示翻页按钮（盒子要配置 class='pagination'）
         * @param {String} ulId 显示翻页信息的ul标签的ID
         * @param {Number} skip 当前跳过信息数
         * @param {Number} count 一页显示信息数量
         * @param {Number} total 信息总数（默认 0）
         * @param {Number} [groupCount] 每组显示的页数（默认 10）
         * @param {Boolean} [noPage] 不显示页数（默认 false）
         * @param {Boolean} [noTotal] 不显示总数（默认 false）
         * @param {Boolean} [noTurn] 不显示翻页（默认 false）
         * @param {Boolean} [noGroup] 不显示分组翻页（默认 false）
         * @param {String} name 唯一标识，用于区分一个页面多个翻页控件
         */
        turnPage.show = function (ulId, skip, count, total, groupCount, noPage, noTotal, noTurn, noGroup, name) {
            if (tek.type.isEmpty(ulId) || !tek.type.isNumber(skip) || !tek.type.isNumber(count))
                return;

            var elem = document.getElementById(ulId);
            if (!elem)
                return;

            elem.innerHTML = "";

            total = (isFinite(total) && total > 0) ? parseInt(total) : 0;

            var currentPage = turnPage.getCurrentPageNumber(skip, count);    // 当前页号
            var totalPage = turnPage.getTotalPageNumber(total, count);    // 总页数

            groupCount = (isFinite(groupCount) && groupCount > 0) ? parseInt(groupCount) : 10;

            var remain = currentPage % groupCount;
            var startPage, endPage;
            if (remain != 0) {
                startPage = currentPage - remain + 1;
                endPage = currentPage + groupCount - remain;
                if (endPage > totalPage)
                    endPage = totalPage;
            } else {
                startPage = currentPage - groupCount + 1;
                endPage = currentPage;
            }
            if (startPage <= 0)
                startPage = 1;
            if (endPage <= 0)
                endPage = 1;

            // 页号
            var html = "<li style='float:left'><div style='padding: 6px 12px;line-height: 1.5;'>"
                + ((noPage != true) ? currentPage + "/" + totalPage + "页" : "")
                + ((noTotal != true) ? "&nbsp;共" + total + "条" : "")
                + "</div></li>";

            if (noTurn != true) {
                // 显示翻页信息
                if (noGroup != true && startPage > groupCount) {
                    // 上一组
                    var prevGroupSkip = (startPage - 2) * count;
                    prevGroupSkip = (prevGroupSkip >= 0) ? prevGroupSkip : 0;

                    html += "<li title='上一组'" + " style='cursor:pointer' onClick='tek.turnPage.turn(\"" + ulId + "\"," + prevGroupSkip + ");'>"
                        + "<span>&laquo;</span>"
                        + "</li>";
                }

                if (total > count) {
                    if (currentPage > 1) {
                        // 上一页
                        var prevSkip = (currentPage - 2) * count;
                        prevSkip = (prevSkip >= 0) ? prevSkip : 0;

                        html += "<li title='上一页'" + " style='cursor:pointer' onClick='tek.turnPage.turn(\"" + ulId + "\"," + prevSkip + ");'>"
                            + "<span>&lsaquo;</span>"
                            + "</li>";
                    }

                    if (noGroup != true) {
                        // 当前组页码
                        for (var i = startPage; i <= endPage; i++) {
                            var currentSkip = (i - 1) * count;

                            html += "<li"
                                + (i == currentPage ? " class='active'" : " style='cursor:pointer' onClick='tek.turnPage.turn(\"" + ulId + "\"," + currentSkip + ");'")  // 当前页与非当前页
                                + ">"
                                + "<a>" + i + "</a>"
                                + "</li>";
                        }
                    }

                    if (currentPage < totalPage) {
                        // 下一页
                        var nextSkip = currentPage * count;

                        html += "<li title='下一页'" + " style='cursor:pointer' onClick='tek.turnPage.turn(\"" + ulId + "\"," + nextSkip + ");'>"
                            + "<span>&rsaquo;</span>"
                            + "</li>";
                    }
                } // end if(total>count)

                if (noGroup != true && endPage < totalPage) {
                    // 下一组
                    var nextGroupSkip = endPage * count;

                    html += "<li title='下一组'" + " style='cursor:pointer' onClick='tek.turnPage.turn(\"" + ulId + "\"," + nextGroupSkip + ");'>"
                        + "<span>&raquo;</span>"
                        + "</li>";
                }
            } // end if(noTurn!=true)

            elem.innerHTML = html;
        };

        /**
         * 获取页码html信息文本（形如：2/3页 共13条）
         * @param {Number} skip 当前跳过信息数
         * @param {Number} count 一页显示信息数量
         * @param {Number} total 信息总数（默认 0）
         * @returns {string} 包含页码的html文本，可能为""
         */
        turnPage.getPagination = function (skip, count, total) {
            var html = "";

            if (!tek.type.isNumber(skip) || !tek.type.isNumber(count))
                return html;

            total = (isFinite(total) && total > 0) ? parseInt(total) : 0;

            var currentPage = turnPage.getCurrentPageNumber(skip, count);    // 当前页号
            var totalPage = turnPage.getTotalPageNumber(total, count);    // 总页数

            // 页号
            html = "<li style='float:left'><div style='padding: 6px 12px;line-height: 1.5;'>"
                + currentPage + "/" + totalPage + "页&nbsp;共" + total + "条"
                + "</div></li>";

            return html
        };

        /**
         * 取得当前页号（skip=0时，默认页码为1）
         * @param {Number} skip 当前跳过信息数
         * @param {Number} count 一页显示信息数量
         * @return {Number}
         */
        turnPage.getCurrentPageNumber = function (skip, count) {
            if (!isFinite(skip) || ! isFinite(count))
                return 1;
            skip = parseInt(skip);
            skip = skip < 0 ? 0 : skip;
            count = parseInt(count);
            count = count <= 0 ? 1 : count;

            return Math.floor(skip / count) + 1;    // 当前页号
        };

        /**
         * 取得总页数（total=0时，默认页码为1）
         * @param total 信息总数
         * @param count 一页显示信息数量
         * @return {Number}
         */
        turnPage.getTotalPageNumber = function (total, count) {
            if (!isFinite(total) || ! isFinite(count))
                return 1;
            total = parseInt(total);
            total = total < 0 ? 0 : total;
            count = parseInt(count);
            count = count <= 0 ? 1 : count;

            return total <= 0 ? 1: parseInt((total + count - 1) / count);    // 总页数
        };

    })(tek.turnPage);

})();
