<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="logo">林业有害生物防治质量智能监控平台</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img v-if="this.role == 0" class="qqq" src="../../assets/img/user/youke.png" />
                    <img v-else-if="this.role == 1" class="qqq" src="../../assets/img/user/guanli.png" />
                    <img v-else-if="this.role == 2" class="qqq" src="../../assets/img/user/shuju.png" />
                    <img v-else-if="this.role == 4" class="qqq" src="../../assets/img/user/jianguan.png" />
                    <img v-else-if="this.role == 8" class="qqq" src="../../assets/img/user/jianli.png" />
                    <img v-else class="qqq" :src="TxImg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ name }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
// import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            fullscreen: false,
            name: '',
            message: 2,
            Img: null,
            imgUrl: '',
            role: null
        };
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.role = data.role
        if (data.entity) {
            this.Img = false;
            this.name = data.user.username;
            this.imgUrl = data.entity.logo;
        } else {
            this.Img = true;
            this.name = data.user.username;
        }
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                window.sessionStorage.removeItem('name');
                this.$router.push('/login');
            }
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    margin-left: 50px;
    float: left;
    width: 600px;
    font-size: 30px;
    line-height: 100px;
    color: fff;
    font-weight: 700;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 100px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.header {
    background-image: url(../../assets/img/banner1.jpg);
    background-size: cover;
}
</style>
