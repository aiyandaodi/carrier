
// 跳转到登录页面
function promptLogin() {
  if (parent != window) {
    parent.goLogin();
  } else {
    tek.macCommon.waitingMessage("<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' width='16'/> &nbsp;正在跳转到登录页面，请稍后...");
    $("#waiting-modal-dialog").modal("show",null,2);
    tek.common.ipassLogin();
  }
}

// 跳转到注册页面
function promptRegister() {
  if (parent != window)
    parent.goRegister();
  else {
    tek.macCommon.waitingMessage("<img src='"+tek.common.getRootPath()+"http/images/waiting-small.gif' width='16'/> &nbsp;正在跳转到注册页面，请稍后...");
    $("#waiting-modal-dialog").modal("show",null,2);

    tek.common.ipassRegister();
  }
}