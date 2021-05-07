<template>
    <div class="container">
        <!-- <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px; width:1500px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list1" @click="yhy">
                        上次登录时间：
                        <span>2019-11-01</span>
                    </div>
                    <div class="user-info-list1">
                        上次登录地点：
                        <span>东莞</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>-->
    </div>
</template>

<script>
import Schart from 'vue-schart';
export default {
    name: 'homepage',
    data() {
        return {
            role: '',
            name: '',
            accessKey: ''
        };
    },
    components: {
        Schart
    },
    created() {
        var data = JSON.parse(window.sessionStorage.getItem('name'));
        this.name = data.username;

        var key = JSON.parse(window.sessionStorage.getItem('key'));
        this.accessKey = key.response;
    },
    methods: {
        async yhy() {
            const res = await this.$http.post('user/getRole', {
                accessKey: 1096695754
            });
            const data = await this.$http.post('user/getInfo', {
                accessKey: 1096695754
            });
            console.log(data.data);
            console.log(res.data);
        }
        //更新信息
        // async updata() {
        //     await this.$http
        //         .post('http://192.168.25.24:8080/SFZZ/user/updata', {
        //             accessKey: -427931347,
        //             name: '萨其马',
        //             phone: 1597438930,
        //             mail: 'zrr@xu.co',
        //             annotation: 'demoData'
        //         })
        //         .then(res => {
        //             console.log(res);
        //         });
        // }
    }
};
</script>

<style scoped>
.container {
    background: url(../../assets/img/timg.jpg);
    background-size: 100% 100%;
}
</style>
