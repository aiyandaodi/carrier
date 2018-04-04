/***************************************************************************************************
 * 说明：
 *   该JS文件用于用户的 用户类型、角色、权限  的判断
 *-------------------------------------------------------------------------------------------------
 * tek.user 用户类型判断公共函数：
 *     function tek.user.isSupervisor(userSecurity); - 是否具有“超级管理员”权限账号。
 *     function tek.user.isNormal(userSecurity); - 是否是“普通”账号。
 *     function tek.user.isApply(userSecurity); - 是否是“申请”账号。
 *     function tek.user.isStop(userSecurity); - 是否是“禁止”用户。
 *-------------------------------------------------------------------------------------------------
 * tek.role 用户角色判断公共函数：
 *     function tek.role.isNormal(role); - 用户角色，是否属于“普通用户”。
 *     function tek.role.isUserManager(role); - 用户角色，是否属于“用户管理员”。
 *     function tek.role.isRightManager(role); - 用户角色，是否属于“权限管理员”。
 *     function tek.role.isComptroller(role); - 用户角色，是否属于“审计员”。
 *     function tek.role.isAuditor(role); - 用户角色，是否属于“审核员”。
 *     function tek.role.isCustomerService(role); - 用户角色，是否属于“客服人员”。
 *     function tek.role.isCustom(role); - 用户角色，是否属于“自定义角色”。
 *     function tek.role.isSystem(role) - 用户角色，是否是后台系统用户角色。（只判断角色，不判断安全等级）
 *     function tek.role.isManager(role) - 用户角色，是否是管理角色。
 *-------------------------------------------------------------------------------------------------
 * tek.right权限判断公共函数：
 *     function tek.right.isCanList(right); - 权限认证：指定权限是否有列表权。
 *     function tek.right.isCanRead(right); - 权限认证：指定权限是否有读权。
 *     function tek.right.isCanCreate(right); - 权限认证：指定权限是否有创建权。
 *     function tek.right.isCanWrite(right); - 权限认证：指定权限是否有写权。
 *     function tek.right.isCanDelete(right); - 权限认证：指定权限是否有删除权。
 *     function tek.right.isCanReadBlob(right); - 权限认证：指定权限是否有读BLOB权。
 *     function tek.right.isCanWriteBlob(right); - 权限认证：指定权限是否有写Blob权。
 *     function tek.right.isCanAdmin(right); - 权限认证：指定权限是否有管理权。
 ***************************************************************************************************/
(function () {
	// 创建全局变量 tek 作为命名空间
	window.tek = window.tek || {};

	// 定义 user.js 中“用户类型”相关的参数、函数
	tek.user = {};
	(function (user) {
		/**
		 * 是否具有“超级管理员”权限账号
		 * @param {Number} userSecurity 用户类型权限
		 * @return {Boolean}
		 */
		user.isSupervisor = function (userSecurity) {
			return isNumber(userSecurity) && userSecurity >= 0xF0;
		};

		/**
		 * 是否具有“普通用户”权限账号
		 * @param {Number} userSecurity 用户类型权限
		 * @return {Boolean}
		 */
		user.isNormal = function (userSecurity) {
			return isNumber(userSecurity) && userSecurity >= 0x10;
		};

		/**
		 * 是否具有“第三方用户”权限账号
		 * @param {Number} userSecurity 用户类型权限
		 * @return {Boolean}
		 */
		user.isThirdParty = function (userSecurity) {
			return isNumber(userSecurity) && userSecurity>0 && ((userSecurity & 0x01) == 0x01);
		};

		/**
		 * 是否是“申请”权限账号
		 * @param {Number} userSecurity 用户类型权限
		 * @return {Boolean}
		 */
		user.isApply = function (userSecurity) {
			return isNumber(userSecurity) && userSecurity == 0;
		};

		/**
		 * 是否是“禁止”权限账号
		 * @param {Number} userSecurity 用户类型权限
		 * @return {Boolean}
		 */
		user.isStop = function (userSecurity) {
			return isNumber(userSecurity) && userSecurity < 0;
		};

	})(tek.user);

	// 定义 user.js 中“用户角色”相关的参数、函数
	tek.role = {};
	(function (role) {
		/**
		 * 用户角色，是否属于“普通用户”
		 * @param {Number} role 用户角色
		 * @return {Boolean}
		 */
		role.isNormal = function (role) {
			return isNumber(role) && (role <= 0x00);
		};

		/**
		 * 用户角色，是否属于“用户管理员”
		 * @param {Number} role 用户角色
		 * @return {Boolean}
		 */
		role.isUserManager = function (role) {
			return isNumber(role) && role>0 && ((role & 0x01) == 0x01);
		};

		/**
		 * 用户角色，是否属于“权限管理员”
		 * @param {Number} role 用户角色
		 * @return {Boolean}
		 */
		role.isRightManager = function (role) {
			return isNumber(role) && role>0 && ((role & 0x02) == 0x02);
		};

		/**
		 * 用户角色，是否属于“审计员”
		 * @param {Number} role 用户角色
		 * @return {Boolean}
		 */
		role.isComptroller = function (role) {
			return isNumber(role) && role>0 && ((role & 0x04) == 0x04);
		};

		/**
		 * 用户角色，是否属于“审核员”
		 * @param {Number} role 用户角色
		 * @return {Boolean}
		 */
		role.isAuditor = function (role) {
			return isNumber(role) && role>0 && ((role & 0x08) == 0x08);
		};

		/**
		 * 用户角色，是否属于“客服人员”
		 * @param {Number} role 用户角色
		 * @return {Boolean}
		 */
		role.isCustomerService = function (role) {
			return isNumber(role) && role>0 && ((role & 0x10) == 0x10);
		};

		/**
		 * 用户角色，是否属于“自定义角色”
		 * @param {Number} role 用户角色
		 * @return {Boolean}
		 */
		role.isCustom = function (role) {
			return isNumber(role) && role>0 && ((role & 0x100) == 0x100);
		};

        /**
         * 用户角色，是否是后台系统用户角色。（只判断角色，不判断安全等级）。
         * 包括：“用户管理员”、“权限管理员”、“审计员”、“审核员”。
         *
         * @param {Number} role 用户角色
         * @return {Boolean}
         */
        role.isSystem = function (role) {
            return tek.role.isUserManager(role)
                || tek.role.isRightManager(role)
                || tek.role.isComptroller(role)
                || tek.role.isAuditor(role);
        };

        /**
         * 用户角色，是否是管理角色。
         * 包括：“用户管理员”、“权限管理员”、“审计员”、“审核员”、“客服人员”。
         *
         * @param {Number} role 用户角色
         * @return {Boolean}
         */
        tek.role.isManagerRole = function (role) {
            return tek.role.isSystem(role) || tek.role.isCustomerService(role);
        }

	})(tek.role);

	// 定义 user.js 中“用户权限”相关的参数、函数
	tek.right = {};
	(function (right) {
		/**
		 * 权限认证：指定权限是否有列表权
		 * @param {Number} right 指定权限值
		 * @return {Boolean}
		 */
		right.isCanList = function (right) {
			return isNumber(right) && right>0 && (right & 0x01) == 0x01;
		};

		/**
		 * 权限认证：指定权限是否有读权
		 * @param {Number} right 指定权限值
		 * @return {Boolean}
		 */
		right.isCanRead = function (right) {
			return isNumber(right) && right>0 && (right & 0x02) == 0x02;
		};

		/**
		 * 权限认证：指定权限是否有创建权
		 * @param {Number} right 指定权限值
		 * @return {Boolean}
		 */
		right.isCanCreate = function (right) {
			return isNumber(right) && right>0 && (right & 0x04) == 0x04;
		};

		/**
		 * 权限认证：指定权限是否有写权
		 * @param {Number} right 指定权限值
		 * @return {Boolean}
		 */
		right.isCanWrite = function (right) {
			return isNumber(right) && right>0 && (right & 0x08) == 0x08;
		};

		/**
		 * 权限认证：指定权限是否有删除权
		 * @param {Number} right 指定权限值
		 * @return {Boolean}
		 */
		right.isCanDelete = function (right) {
			return isNumber(right) && right>0 && (right & 0x10) == 0x10;
		};

		/**
		 * 权限认证：指定权限是否有读BLOB权
		 * @param {Number} right 指定权限值
		 * @return {Boolean}
		 */
		right.isCanReadBlob = function (right) {
			return isNumber(right) && right>0 && (right & 0x20) == 0x20;
		};

		/**
		 * 权限认证：指定权限是否有写Blob权
		 * @param {Number} right 指定权限值
		 * @return {Boolean}
		 */
		right.isCanWriteBlob = function (right) {
			return isNumber(right) && right>0 && (right & 0x40) == 0x40;
		};

		/**
		 * 权限认证：指定权限是否有管理权
		 * @param {Number} right 指定权限值
		 * @return {Boolean}
		 */
		right.isCanAdmin = function (right) {
			return isNumber(right) && right>0 && (right & 0x80) == 0x80;
		};

	})(tek.right);

	/**
	 * 是否是有效Number类型（仅用于本js文件的内部使用）
	 * @param {Any} v 被检测的变量
	 * @return {Boolean} 字符串形式的数字也返回true
	 */
	var isNumber = function (v) {
		var flag = isFinite(v); //typeof v === 'number' && isFinite(v);
		if (!flag)
			console.error("用于用户类型、角色、权限判断的参数不是一个有效的数字类型");
		return flag;
	};

})();


//======================================================================================================================
//==========================注意：下面的代码为了兼容现有的函数调用暂时保留，后期修改完成后删除======================================
//======================================================================================================================
//------------------------------start 用户等级 -------------------------------

/**
* function tek.user.isAdminUser(userSecurity) - 是否具有“管理员”权限账号
* function tek.user.isAuditor(userSecurity) - 是否具有“审核员”权限账号。
* function tek.user.isNormalUser(userSecurity) - 是否是“普通”账号。
* function tek.user.isRegisterUser(userSecurity) - 是否是“注册”账号
* function tek.user.isApplyUser(userSecurity)	- 是否是“申请”账号。
* function tek.user.isStopUser(userSecurity) - 是否是“禁止”用户。
* function tek.user.isAccountUser(userSecurity) - 是否是“统一认证系统”登录认证账号
*/

tek.user = tek.user || {};
/**
 * 是否具有“管理员”权限账号。
 *
 * @param userSecurity
 *            用户等级值
 * @return 返回true或false。
 */
tek.user.isAdminUser = function (userSecurity) {
	if (userSecurity >= 0x40)
		return true;
	else
		return false;
}

/**
 * 是否具有“审核员”权限账号。
 *
 * @param userSecurity
 *            用户等级值
 * @return 返回true或false。
 */
tek.user.isAuditor = function (userSecurity) {
	if (userSecurity >= 0x20)
		return true;
	else
		return false;
}

/**
 * 是否是“普通”账号。
 *
 * @param userSecurity
 *            用户等级值
 * @return 返回true或false。
 */
tek.user.isNormalUser = function (userSecurity) {
	if (userSecurity >= 0x10)
		return true;
	else
		return false;
}

/**
 * 是否是“注册”账号。
 *
 * @param userSecurity
 *            用户等级值
 * @return 返回true或false。
 */
tek.user.isRegisterUser = function (userSecurity) {
	if (userSecurity == 0x01)
		return true;
	else
		return false;
}

/**
 * 是否是“申请”账号。
 *
 * @param userSecurity
 *            用户等级值
 * @return 返回true或false。
 */
tek.user.isApplyUser = function (userSecurity) {
	if (userSecurity == 0)
		return true;
	else
		return false;
}

/**
 * 是否是“禁止”用户。
 *
 * @param userSecurity
 *            用户等级值
 * @return 返回true或false。
 */
tek.user.isStopUser = function (userSecurity) {
	if (userSecurity < 0)
		return true;
	else
		return false;
}

/**
 * 是否是统一认证系统的登录认证账号
 *
 * @param userSecurity
 *            用户等级值
 * @return 返回true或false。
 */
tek.user.isAccountUser = function (userSecurity) {
	if (userSecurity != 0x01)
		return true;
	else
		return false;
}
//----------------------------- end 用户等级 ---------------------------------

//------------------------------角色判断------------------------------------
/**
* function tek.role.isNormalRole(role) - 用户角色，是否属于“普通用户”。
* function tek.role.isUserManagerRole(role) - 用户角色，是否属于“用户管理员”。
* function tek.role.isRightManagerRole(role) - 用户角色，是否属于“权限管理员”。
* function tek.role.isComptrollerRole(role) - 用户角色，是否属于“审计员”。
* function tek.role.isAuditorRole(role) - 用户角色，是否属于“审核员”。
* function tek.role.isCustomerServiceRole(role) - 用户角色，是否属于“客服人员”。
* function tek.role.isSystemRole(role) - 用户角色，是否是后台系统用户角色。（只判断角色，不判断安全等级）
* function tek.role.isManagerRole(role) - 用户角色，是否是管理角色。
*/
tek.role = tek.role || {};

/**
 * 用户角色，是否属于“普通用户”。
 *
 * @param role
 *            用户角色
 * @return 如果是，返回true；否则，返回false。
 */
tek.role.isNormalRole = function (role) {
	return tek.type.isNumber(role) && right>0 && (role <= 0);
}

/**
 * 用户角色，是否属于“用户管理员”。
 *
 * @param role
 *            用户角色
 * @return 如果是，返回true；否则，返回false。
 */
tek.role.isUserManagerRole = function (role) {
    return tek.type.isNumber(role) && role>0 && ((role & 0x01) == 0x01);
}

/**
 * 用户角色，是否属于“权限管理员”。
 *
 * @param role
 *            用户角色
 * @return 如果是，返回true；否则，返回false。
 */
tek.role.isRightManagerRole = function (role) {
	return tek.type.isNumber(role) && role>0 && ((role & 0x02) == 0x02);
}

/**
 * 用户角色，是否属于“审计员”。
 *
 * @param role
 *            用户角色
 * @return 如果是，返回true；否则，返回false。
 */
tek.role.isComptrollerRole = function (role) {
	return tek.type.isNumber(role) && role>0 && ((role & 0x04) == 0x04);
}

/**
 * 用户角色，是否属于“审核员”。
 *
 * @param role
 *            用户角色
 * @return 如果是，返回true；否则，返回false。
 */
tek.role.isAuditorRole = function (role) {
    return tek.type.isNumber(role) && role>0 && ((role & 0x08) == 0x08);
}

/**
 * 用户角色，是否属于“客服人员”。
 *
 * @param role
 *            用户角色
 * @return 如果是，返回true；否则，返回false。
 */
tek.role.isCustomerServiceRole = function (role) {
	return tek.type.isNumber(role) && role>0 && ((role & 0x10) == 0x10);
}

/**
 * 用户角色，是否是后台系统用户角色。（只判断角色，不判断安全等级）。
 * 包括：“用户管理员”、“权限管理员”、“审计员”或“审核员”。
 *
 * @param role
 *            用户角色
 * @return 如果是，返回true；否则，返回false。
 */
tek.role.isSystemRole = function (role) {
	return tek.role.isUserManagerRole(role)
			|| tek.role.isRightManagerRole(role)
			|| tek.role.isComptrollerRole(role)
			|| tek.role.isAuditorRole(role);
}

/**
 * 用户角色，是否是管理角色。
 * 包括：“用户管理员”、“权限管理员”、“审计员”或“审核员”、“客服人员”。
 *
 * @param role
 *            用户角色
 * @return 如果是，返回true；否则，返回false。
 */
tek.role.isManagerRole = function (role) {
	return tek.role.isSystemRole(role) || tek.role.isCustomerServiceRole(role);
}
