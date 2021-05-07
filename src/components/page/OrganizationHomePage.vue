<template>
    <div style="background: #eee">
        <div class="top">
            <div class="topTitle">
                <span>国家林业和草原局森林和草原病虫害防治总站</span><br />
                <span>林业有害生物防治质量智能监控平台</span>
            </div>
        </div>
        <div class="main">
            <el-card style="width: 100%">
                <br />
                <h1 style="text-align: center; color: #1c64a0; font-family: '微软雅黑', '宋体', tahoma, arial, Verdana, sans-serif">
                    <span id="forestry_title" class="h1title" style="font-family: '微软雅黑', '宋体', tahoma, arial, Verdana, sans-serif">{{
                        this.info.name
                    }}</span>
                    <br />
                    <br />
                </h1>
                <div style="text-align: center; font-size: 14px">
                    <span class="pd20"> 联系人：{{ this.info.contact }}</span>
                    <span class="pd20"> 联系电话：{{ this.info.phone }}</span>
                    <span class="pd20">联系邮箱：{{ this.info.email }}</span>
                    <span class="pd20">联系地址：{{ this.info.address }}</span>
                </div>
                <el-divider></el-divider>
                <div style="text-align: center; height: 300px">
                    <img style="width: 50%; height: 100%" :src="info.logo" alt="" />
                </div>
                <div class="content" v-html="html">
                </div>
            </el-card>
        </div>
        <!-- <div class="footer">
            <div style="height: 30px; background-color: #289c3a; margin-top: 30px"></div>
            <div class="bottom"></div>
        </div> -->
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            info: '',
            html:''
        };
    },
    created() {
        // var data = this.$route.query.data;
        var data = JSON.parse(window.sessionStorage.getItem('homepageinfo'));
        this.info = data;
        this.formatText();
    },
    methods: {
        formatText(str) {
            var atStr = this.info.description
            var dataAt = atStr.replace(/(\r\n)|(\n)|(\r)/g, '<br>');
            this.html = dataAt
        }
    }
};
</script>


<style scoped>
.top {
    height: 200px;
    background-image: url(../../assets/img/banner3.png);
    background-size: cover;
}
.topTitle {
    font-size: 28px;
    color: aliceblue;
    padding: 0 15%;
    font-weight: 700;
    line-height: 50px;
    padding-top: 50px;
}

.main {
    background-color: #fff;
    padding: 30px 20%;
    display: flex;
}
.pd20 {
    padding: 0 20px;
}

.title {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    border-right: 0 none transparent;
    border-top: 0 none transparent;
    border-bottom: 0 none transparent;
    border-left: 0 none transparent;
    border-radius: 0px;
    background-color: #289c3a;
    background-image: none;
    background-repeat: repeat;
    background-position: 0 0;
}
.bottom {
    height: 300px;
    background-color: #289c3a;
    padding: 0 400px;
}
.content {
    text-indent: 2em;
    width: 60%;
    margin: 30px auto;
    letter-spacing:2px;
    font-size:14px
}
</style>