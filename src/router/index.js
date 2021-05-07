import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/homepage'
        },
        {
            path: '/',
            component: () => import( /* webpackChunkName: "home" */ '../components/page/Home.vue'),
            meta: {
                title: '自述文件'
            },
            children: [{
                    path: '/homepage',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/HomePage.vue'),
                    meta: {
                        title: '系统首页',
                        permission: true
                    },
                   
                },
                {
                    path: '/equipment',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/Equipment.vue'),
                    meta: {
                        title: '设备管理'
                    }
                },
                {
                    path: '/organizationregister',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/OrganizationRegister.vue'),
                    meta: {
                        title: '企业注册'
                    }
                },
                {
                    path: '/organizationcensorlist',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/OrganizationCensorList.vue'),
                    meta: {
                        title: '企业已审核列表'
                    }
                },
                {
                    path: '/organizationuncensorlist',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/OrganizationUncensorList.vue'),
                    meta: {
                        title: '企业未审核列表'
                    }
                },
                {
                    path: '/organizationinfo',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/OrganizationInfo.vue'),
                    meta: {
                        title: '企业未审核列表'
                    }
                },
                {
                    path: '/projectlist',
                    component: () => import( /* webpackChunkName: "table" */ '../components/page/ProjectList.vue'),
                    meta: {
                        title: '项目浏览'
                    }
                },
                {
                    path: '/projectcensor',
                    component: () => import( /* webpackChunkName: "table" */ '../components/page/ProjectCensor.vue'),
                    meta: {
                        title: '项目审批'
                    }
                },
                {
                    path: '/projectreport',
                    component: () => import( /* webpackChunkName: "table" */ '../components/page/ProjectReport.vue'),
                    meta: {
                        title: '项目申报'
                    }
                },

                {
                    path: '/userlist',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/UserList.vue'),
                    meta: {
                        title: '用户列表',
                    }
                },
                {
                    path: '/usercensor',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/UserCensor.vue'),
                    meta: {
                        title: '用户审核',
                    }
                },
                {
                    path: '/usersetting',
                    component: () => import( /* webpackChunkName: "table" */ '../components/page/UserSetting.vue'),
                    meta: {
                        title: '用户设置'
                    }
                },
               
                {
                    path: '/equipmentyrj',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/EquipmentYRJ.vue'),
                    meta: {
                        title: '有人机',
                    }
                },
                {
                    path: '/equipmentwrj',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/EquipmentWRJ.vue'),
                    meta: {
                        title: '无人机',
                    }
                },
                {
                    path: '/equipmentdm',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/EquipmentDM.vue'),
                    meta: {
                        title: '地面设备',
                    }
                },
                
                {
                    path: '/ditu',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/Ditu.vue'),
                    meta: {
                        title: '地图'
                    }
                },
                {
                    path: '/tabs',
                    component: () => import( /* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: {
                        title: 'tab选项卡'
                    }
                },
                {
                    path: '/404',
                    component: () => import( /* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: {
                        title: '404'
                    }
                },
                {
                    path: '/403',
                    component: () => import( /* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: {
                        title: '403'
                    }
                },
            ]
        },
        {
            path: '/login',
            component: () => import( /* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '/organizationhomepage',
            component: () => import( /* webpackChunkName: "login" */ '../components/page/OrganizationHomePage.vue'),
            meta: {
                title: '机构信息'
            }
        },
        {
            path: '*',
            redirect: '/404'
        },
    ]
});