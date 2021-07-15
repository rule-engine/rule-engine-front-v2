import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

// 路由配置
const options = {
    routes: [
        {
            path: '/login',
            name: '登录页',
            component: () => import('@/pages/login')
        },
        {
            path: '*',
            name: '404',
            component: () => import('@/pages/exception/404'),
        },
        {
            path: '/403',
            name: '403',
            component: () => import('@/pages/exception/403'),
        },
        {
            path: '/',
            name: '首页',
            component: TabsView,
            redirect: '/login',
            children: [
                {
                    path: 'dashboard',
                    name: '控制台',
                    meta: {
                        icon: 'dashboard'
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'workplace',
                            name: '工作台',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/dashboard/workplace'),
                        },
                        {
                            path: 'analysis',
                            name: '监控',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/dashboard/analysis'),
                        }
                    ]
                },
                {
                    path: 'components',
                    name: '组件',
                    meta: {
                        icon: 'gold'
                    },
                    component: BlankView,
                    children: [
                        {
                            path: '/function',
                            name: '函数',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/components/function'),
                        },
                        // {
                        //     path: 'taskCard',
                        //     name: '任务卡片',
                        //     component: () => import('@/pages/components/TaskCard')
                        // },
                        // {
                        //     path: 'palette',
                        //     name: '颜色复选框',
                        //     component: () => import('@/pages/components/Palette')
                        // },
                        // {
                        //     path: 'table',
                        //     name: '高级表格',
                        //     component: () => import('@/pages/components/table')
                        // }
                    ]
                },
                {
                    path: 'rulemanagement',
                    name: '规则管理',
                    meta: {
                        icon: 'appstore'
                    },
                    component: BlankView,
                    children: [
                        {
                            path: '/generalrule',
                            name: '普通规则',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/rulemanagement/generalrule/list'),
                        },
                        // {
                        //     path: '/generalRuleDefinition',
                        //     name: '规则定义',
                        //     meta: {
                        //         invisible: true
                        //     },
                        //     component: () => import('@/pages/rulemanagement/generalrule/definition'),
                        // },
                        // {
                        //     path: '/generalRuleConfig',
                        //     name: '规则配置',
                        //     meta: {
                        //         invisible: true,
                        //         keepAlive:false
                        //
                        //     },
                        //     component: () => import('@/pages/rulemanagement/generalrule/config'),
                        // },
                        // {
                        //     path: '/generalRulePublish',
                        //     name: '规则发布',
                        //     meta: {
                        //         invisible: true
                        //     },
                        //     component: () => import('@/pages/rulemanagement/generalrule/publish'),
                        // },
                        {
                            path: '/generalRuleRouter/:ruleId',
                            name: '规则',
                            meta: {
                                invisible: true
                            },
                            component: () => import('@/pages/rulemanagement/generalrule/router'),
                        },
                        // {
                        //     path: 'ruleSet',
                        //     name: '规则集',
                        //     meta: {
                        //         page: {
                        //             closable: true
                        //         }
                        //     },
                        //     component: () => import('@/pages/rulemanagement/ruleset/list'),
                        // },
                        // {
                        //     path: 'decisionTable',
                        //     name: '决策表',
                        //     meta: {
                        //         page: {
                        //             closable: true
                        //         }
                        //     },
                        //     component: () => import('@/pages/rulemanagement/generalrule/list'),
                        // }
                    ]
                },
                {
                    path: 'settings',
                    name: '系统设置',
                    meta: {
                        icon: 'setting'
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'user',
                            name: '用户列表',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/settings/user')
                        },
                        {
                            path: 'workspace',
                            name: '工作空间',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/settings/workspace')
                        },
                    ]
                },
                {
                    name: '使用文档',
                    path: 'document',
                    meta: {
                        icon: 'file-word',
                        link: 'https://iczer.gitee.io/vue-antd-admin-docs/'
                    }
                }
            ]
        },
    ]
}

export default options
