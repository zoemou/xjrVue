import i18n from "@/lang";
export default {
  column: [{
    label:i18n.t('user.info.personalInfor'),
    prop: 'info',
    option: {
      submitText: '修改',
      size: 'small',
      labelWidth: 60,
      emptyText: false,
      column: [{
        label: i18n.t('user.info.headPortrait'),
        type: 'upload',
        listType: 'picture-img',
        propsHttp: {
          res: 'data.0'
        },
        canvasOption: {
          text: 'xjrsoft',
          ratio: 0.1
        },
        action: 'https://avueupload.91eic.com/upload/list',
        tip: i18n.t('user.info.tip'),
        span: 16,
        prop: 'img'
      }, {
        label:i18n.t('user.info.name'),
        span: 12,
        prop: 'name'
      }, {
        label: i18n.t('user.info.email'),
        row: true,
        span: 12,
        prop: 'yx'
      }, {
        label: i18n.t('user.info.remark'),
        type: 'textarea',
        span: 24,
        prop: 'ms'
      }]
    }
  }, 
  {
    label: i18n.t('user.info.funcPermission'),
    prop: 'permission'
  },
  {
    label: i18n.t('user.info.changePassword'),
    prop: 'password',
    option: {
      labelWidth: 70,
      size: 'small',
      submitText: '修改',
      emptyText: false,
      column: [{
        label: i18n.t('user.info.oldPassword'),
        span: 16,
        row: true,
        type: 'password',
        prop: 'oldpassword',
        rules: [{
            required: true,
            message: i18n.t('user.info.hintOldPassword'),
            trigger: "blur"
        }],
      }, {
        label: i18n.t('user.info.newPassword'),
        span: 16,
        row: true,
        type: 'password',
        prop: 'newpassword',
        rules: [{
            required: true,
            message:i18n.t('user.info.hintNewPassword'),
            trigger: "blur"
        }],
      }, {
        label: i18n.t('user.info.confirmPassword'),
        span: 16,
        row: true,
        type: 'password',
        prop: 'newpasswords'
      }]
    }
  }]
}
/*
 {
    label: '职位',
    span: 8,
    prop: 'zw'
  }, {
    label: '地址',
    span: 24,
    prop: 'dz'
  }, {
    label: '标签',
    span: 24,
    type: 'select',
    multiple: true,
    prop: 'bq',
    dicData: [{
      label: '善解人意',
      value: 1
    }, {
      label: '开朗乐观',
      value: 2
    }, {
      label: '真诚热情',
      value: 3
    }, {
      label: '心地善良',
      value: 4
    }, {
      label: '谦恭有礼',
      value: 5
    }, {
      label: '彬彬有礼',
      value: 6
    }]
  },{
    label: '公司',
    prop: 'gs',
    span: 8,
  }, {
    label: '部门',
    span: 8,
    prop: 'bm'
  }
*/