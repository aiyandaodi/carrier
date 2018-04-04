/***************************************************************************************************
 * 说明：
 *   该JS文件实现基本的文件相关的操作，net.tekinfo.file.FileUtility中的方法在本JS中实现。
 * 要求：
 *   需要加载 tools.js、dataUtility.js
 *-------------------------------------------------------------------------------------------------
 * 公共参数&函数：
 *     function tek.fileUtility.getFileName(filePath); - 取得文件名。
 *     function tek.fileUtility.getFilePrefix(fileName); - 取得文件名的前缀。
 *     function tek.fileUtility.getFileSuffix(fileName); - 取得文件名的后缀。
 ***************************************************************************************************/

(function () {
    // 创建全局变量 tek 作为命名空间
    window.tek = window.tek || {};

    // 定义 fileUtility.js 中相关的参数、函数
    tek.fileUtility = {};
    (function (fileUtility) {

        /**
         * 从文件完整路径中，取得文件名。如果是无效值，返回null。
         * @param {String} filePath 文件路径
         * @return {String} 返回文件名
         */
        fileUtility.getFileName = function (filePath) {
            if ((typeof(filePath)!="string") || filePath.length<=0)
              return null;
            
            var fileName=filePath.replace(/\\/g, "/");
            var loc=fileName.lastIndexOf("/");
            if(loc>-1)
              fileName=fileName.substring(loc+1);
            
            return fileName;
        };

        /**
         * 取得文件名的前缀。如果是无效值，返回null。
         * @param {String} fileName 文件名
         * @return {String} 返回文件名前缀
         */
        fileUtility.getFilePrefix = function (fileName) {
            if ((typeof(fileName)!="string") || fileName.length<=0)
              return null;
            
            fileName=fileUtility.getFileName(fileName);
            if ((typeof(fileName)!="string") || fileName.length<=0)
              return null;

            var loc = fileName.lastIndexOf(".");
            if (loc > -1)
              fileName=fileName.substring(0, loc);
            
            return fileName;
        };

        /**
         * 取得文件名后缀。如果是无效值，返回""。
         * @param {String} fileName 文件名
         * @param {boolean} point 是否包含“.”（默认为false）
         * @return {String} 返回文件名前缀
         */
        fileUtility.getFileSuffix = function (fileName, point) {
          if ((typeof(fileName)!="string") || fileName.length<=0)
            return null;

          fileName=fileUtility.getFileName(fileName);
          if ((typeof(fileName)!="string") || fileName.length<=0)
              return null;

          var suffix;

          var loc = fileName.lastIndexOf(".");
          if (loc > -1)
            suffix=fileName.substring(0, (point ? loc : loc + 1));
          else
            suffix="";
          return suffix;
        };

    })(tek.fileUtility);

})();
