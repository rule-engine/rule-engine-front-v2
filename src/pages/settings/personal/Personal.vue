<template>
    <page-layout>
        <a-card title="个人中心" :bordered="false">
            <a-form-model ref="form" :model="form" :label-col="{span: 4}"
                          :wrapper-col="{span: 4}">
                <a-form-model-item label="姓名" prop="name">
                    <a-input readOnly :value="form.username" >
                    </a-input>
                </a-form-model-item>

                <a-form-model-item label="性别" prop="sex">
                    <a-radio :value="form.sex" label="男">男</a-radio>
                    <a-radio :value="form.sex" label="女">女</a-radio>
                </a-form-model-item>

                <a-form-model-item label="电子邮箱" prop="email">
                    <a-input readOnly :value="form.email" >
                    </a-input>
                </a-form-model-item>
                <a-form-model-item label="手机号" prop="phone">
                    <a-input readOnly :value="form.phone" >
                    </a-input>
                </a-form-model-item>

                <a-upload
                class="avatar-uploader"
                action="#"
                accept=".jpg,.png"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImg"
                >
                    <img v-if="form.avatar" :src="form.avatar" class="avatar" alt="avatar">
                </a-upload>
            </a-form-model>
        </a-card>
    </page-layout>
</template>

<script>
    import {mapGetters} from 'vuex'
    import PageLayout from "@/layouts/PageLayout";
    import {getUserInfo,uploadAvatar} from '@/services/user'


    export default {
        name: "Personal",
        computed: {
            ...mapGetters('account', ['user']),
        },
        components: {PageLayout},
        data() {
            return {
                form: {
                    id: null,
                    avatar: require("@/assets/img/avatar.jpg"),
                    username: null,
                    sex: null,
                    email: null,
                    phone: null,
                },
            }
        },
        created() {
            getUserInfo().then(this.afterGetUserInfo)
        },
        methods: {

            afterGetUserInfo(res) {
                if (res.data.code === 200) {
                    this.form = res.data.data
                    if (res.data.data.avatar==null){
                        console.log("xxxxxxxx",res.data);
                        this.form.avatar = require("@/assets/img/avatar.jpg")
                    }
                    console.log("yonghuxinxi",res.data);
                }
            },

            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            uploadImg(file) {
                uploadAvatar(file).then(res => {
                    console.log("tttttt",res)
                })
            },



        },

    }
</script>

<style lang="less" scoped>


</style>