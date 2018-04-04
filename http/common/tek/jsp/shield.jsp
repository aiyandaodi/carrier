<!--
实现蒙版等待界面效果的界面。
相关文件：../js/shield.js

使用时注意以下几点：
1、启动等待界面调用startWaiting()函数。
2、停止等待界面调用endWaiting()函数。
-->

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html; charset=utf-8" %>

<script src="<%= request.getContextPath() + "/http/common/js/shield.js" %>"></script>

<!-- 透明层 -->
<div id="shield" style="position:absolute; background-color:#9CF; display:none;"></div>
<!-- 等待图片 -->
<img id="waitingImg" src="<%= request.getContextPath() + "/http/images/waiting.gif" %>" style="position:absolute; display:none;"/>
