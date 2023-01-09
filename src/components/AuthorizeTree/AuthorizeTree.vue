<template>
    <div class="main-container">
        <el-row style="margin-bottom: 10px">
            <el-col :span="24">
                <el-button size="mini" @click="copyAuthority">复用已有权限</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="tree-box">
                    <div class="title">
                        <span>系统功能</span>
                    </div>
                    <div class="tree">
                        <el-tree
                                :data="moduleList"
                                show-checkbox
                                default-expand-all
                                node-key="F_ModuleId"
                                :default-checked-keys="moduleAuthorizes"
                                ref="moduleTree"
                                highlight-current
                                :props="moduleProps"
                                @check-change="moduleCheckChange">
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="tree-box">
                    <div class="title">
                        <span>按钮权限</span>
                    </div>
                    <div class="tree">
                        <el-tree
                                :data="buttonList"
                                show-checkbox
                                default-expand-all
                                node-key="F_ModuleId"
                                :default-checked-keys="buttonAuthorizes"
                                ref="buttonTree"
                                highlight-current
                                :props="moduleProps"
                                @check-change="buttonCheckChange">
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="tree-box">
                    <div class="title">
                        <span>字段权限</span>
                    </div>
                    <div class="tree">
                        <el-tree
                                :data="columnList"
                                show-checkbox
                                default-expand-all
                                node-key="F_ModuleId"
                                :default-checked-keys="columnAuthorizes"
                                ref="columnTree"
                                highlight-current
                                :props="moduleProps"
                                @check-change="columnCheckChange">
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="tree-box">
                    <div class="title">
                        <span>表单权限</span>
                    </div>
                    <div class="tree">
                        <el-tree
                                :data="formList"
                                show-checkbox
                                default-expand-all
                                node-key="F_ModuleId"
                                :default-checked-keys="formAuthorizes"
                                ref="formTree"
                                highlight-current
                                :props="moduleProps"
                                @check-change="formCheckChange">
                        </el-tree>
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-dialog v-dialogDrag :close-on-click-modal="false" title="复用已有权限" :append-to-body="true" :visible.sync="dialogVisible" width="80%"
                   :before-close="closeDialog">

            <user-authorize v-if="objectType === '2'" @userAuthorizeData="getUserAuthorizeData"></user-authorize>
            <role-authorize v-if="objectType === '1'" @roleAuthorizeData="getRoleAuthorizeData"></role-authorize>

            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="closeDialog">取 消</el-button>
                <el-button size="mini" type="primary" @click="closeDialog">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {getModulesAll, getAuthorizes} from '@/api/organization/index'

    export default {
        name: "AuthorizeTree",
        props: {
            objectType: {
                type: String,
            },
            objectId: {
                type: String,
            },
        },
        data() {
            return {
                buttonList: [],
                columnList: [],
                formList: [],
                moduleList: [],
                buttonListClone: [],
                columnListClone: [],
                formListClone: [],
                moduleAuthorizes: [],
                buttonAuthorizes: [],
                columnAuthorizes: [],
                formAuthorizes: [],
                moduleProps: {
                    children: 'children',
                    label: 'F_FullName'
                },
                dialogVisible: false,
            }
        },
        created() {
            this.getModulesAll();
            this.getAuthorizes(this.objectType, this.objectId)
        },
        methods: {
            getModulesAll() {
                getModulesAll().then(res => {
                    this.moduleList = res.data.data.moduleList

                    this.buttonList = this.treeData(res.data.data.buttonList)
                    this.columnList = this.treeData(res.data.data.columnList)
                    this.formList = this.treeData(res.data.data.formList)

                    this.buttonListClone = [...this.treeData(res.data.data.buttonList)]
                    this.columnListClone = [...this.treeData(res.data.data.columnList)]
                    this.formListClone = [...this.treeData(res.data.data.formList)]

                    // this.treeData(res.data.data.buttonList);
                    // this.treeData(res.data.data.columnList);
                    // this.treeData(res.data.data.formList);
                })
            },
            getAuthorizes(type, id) {
                getAuthorizes(type, id).then(res => {
                    this.moduleAuthorizes = res.data.data[0]
                    this.buttonAuthorizes = res.data.data[1]
                    this.columnAuthorizes = res.data.data[2]
                    this.formAuthorizes = res.data.data[3]
                })
            },
            moduleCheckChange(data, checked, indeterminate) {
                this.$refs.buttonTree.setCheckedNodes(this.$refs.moduleTree.getCheckedNodes());
                this.$refs.columnTree.setCheckedNodes(this.$refs.moduleTree.getCheckedNodes());
                this.$refs.formTree.setCheckedNodes(this.$refs.moduleTree.getCheckedNodes());



                if (checked !== true && indeterminate !== true) {

                    this.filterData(data, this.buttonList)
                    this.filterData(data, this.columnList)
                    this.filterData(data, this.formList)

                } else {
                    this.buttonList = [...this.buttonListClone]
                    this.columnList = [...this.columnListClone]
                    this.formList = [...this.formListClone]
                }
                this.allCheckChange()
            },
            filterData(data, arr) {
                arr.forEach((item, index) => {
                    if (item.F_ModuleId === data.F_ModuleId) {
                        arr.splice(index, 1);
                    } else {
                        if (item.children && item.children.length ) {
                            this.filterData(data, item.children)
                        }
                    }
                })
                return arr
            },
            treeData(data) {
                data.forEach(item => {
                    if (item.F_ModuleButtonId) {
                        item.F_ModuleId = item.F_ModuleButtonId;
                    } else if (item.F_ModuleColumnId) {
                        item.F_ModuleId = item.F_ModuleColumnId;
                    } else if (item.F_ModuleFormId) {
                        item.F_ModuleId = item.F_ModuleFormId;
                    } else {
                        if (item.children.length) {
                            this.treeData(item.children)
                        }
                    }
                })
                return data
            },
            /* 获取复用权限 */
            getUserAuthorizeData(data) {
                this.moduleAuthorizes = data
            },
            getRoleAuthorizeData(data) {
                this.moduleAuthorizes = data
            },
            copyAuthority() {
                this.dialogVisible = true
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            buttonCheckChange() {
                this.allCheckChange()
            },
            columnCheckChange() {
                this.allCheckChange()
            },
            formCheckChange() {
                this.allCheckChange()
            },
            allCheckChange() {
                let buttonJson = this.$refs.buttonTree.getCheckedKeys().concat(this.$refs.buttonTree.getHalfCheckedKeys())
                let columnJson = this.$refs.columnTree.getCheckedKeys().concat(this.$refs.columnTree.getHalfCheckedKeys())
                let formJson = this.$refs.formTree.getCheckedKeys().concat(this.$refs.formTree.getHalfCheckedKeys())
                let moduleJson = this.$refs.moduleTree.getCheckedKeys().concat(this.$refs.moduleTree.getHalfCheckedKeys())

                let obj = {'moduleJson':moduleJson,'buttonJson':buttonJson,'columnJson':columnJson,'formJson':formJson}

                this.$emit('AuthorizeData',obj)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .main-container {
        height: 100%;
        padding: 0 10px;
    }

    .tree-box {

        height: 666px;
        border-top: 1px solid #E9E9E9;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        box-sizing: border-box;
    }

    .tree-box .title {
        height: 40px;
        padding: 5px 20px;
        font-size: 14px;
        line-height: 30px;
        font-weight: bold;
        background: #fff;
        border: 1px solid #E9E9E9;
        border-top: none;
        border-bottom: none;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        box-sizing: border-box;
    }

    .tree-box .tree {
        height: calc(100% - 40px);
        padding: 20px;
        background: #fff;
        border: 1px solid #E9E9E9;
        overflow-y: auto;
        box-sizing: border-box;
    }
@media screen and (max-width: 1370px) {
	  .tree-box{
		height: 420px;
	   }   
	} 		
</style>