module.exports = class rbac {
  _user = null;
  _options = {
    admin: [
      {
        path: "/.*",
        type: "allow",
        methods: "any",
      },
    ]
  }

  constructor(user, options) {
    this._user = user;
    if (options) {
      this._options = Object.assign(this._options, options);
    }
  }

  /**
   * 判断是某个角色
   * @param {object} user 
   * @param {string} role 
   * @param {string} key 
   * @returns {bool}
   */
  isRole(role, key = 'roles') {
    if (this._user) {
      let roles = this._user[key] ?? [];
      return roles.includes(role);
    }
    return false;
  }
  /**
   * 判断是否有权限
   * @param {object} user 
   * @param {string} path 
   * @param {string} method 
   * @param {string} key 
   * @returns {bool}
   */
  access(path, method, key = 'roles') {
    let allowed = [];
    let denied = [];
    for (let role in this._options) {
      if (this.isRole(role, key)) {
        let roles = this._options[role];
        for (let i in roles) {
          let item = roles[i];
          if (item.type == 'allow') {
            allowed.push(item);
          } else {
            denied.push(item);
          }
        }
      }
    }

    //匹配不允许的
    for (let i in denied) {
      let item = denied[i];
      if (item.path.match(new RegExp('^' + path + '$', 'i')) && (item.methods == 'any' || item.methods == 'all' || item.methods.match(new RegExp(method, 'i')))) {
        return false;
      }
    }

    //匹配允许的
    for (let i in allowed) {
      let item = allowed[i];
      if (item.path.match(new RegExp('^' + path + '$', 'i')) && (item.methods == 'any' || item.methods == 'all' || item.methods.match(new RegExp(method, 'i')))) {
        return true;
      }
    }

    //不允许
    return false;
  }
}