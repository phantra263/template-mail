<template>
    <a-layout class="layout-cms">
        <a-layout-sider :trigger="null" collapsible class="custom-sider">
            <router-link class="logo" to="/">LOGO</router-link>
            <div style="padding: 10px;">
                <a-button type="primary" class="btn-refresh" @click="refreshPage">
                    <SyncOutlined />Làm mới
                </a-button>
                <a-input-search v-model:value="value" placeholder="Search mail..." style="width: 100%"
                    @search="onSearch" />
            </div>

            <a-menu theme="dark" mode="inline">
                <router-link v-for="(user, index) in listMail" class="ant-menu-item"
                    :class="{ 'ant-menu-item-selected': (route.params.user == user && route.name == 'detail mail') }"
                    exactActiveClass="ant-menu-item-selected" :to="{ path: `/mail/${user}` }" :key="index">
                    <span>{{ user }}</span>
                </router-link>
            </a-menu>

        </a-layout-sider>
        <a-layout class="content-right">
            <a-layout-header style="background: #fff; padding: 0">
                <div class="wrap-header">
                    <div class="control-left">
                        <MenuUnfoldOutlined class="menu-sp" v-if="flagMenu" @click="flagMenu = !flagMenu" />
                        <MailOutlined />
                        <h2 v-if="currentMail">{{ currentMail }}</h2>
                        <h2 v-else>Welcome to template mail</h2>
                    </div>


                    <div class="account">
                        <a-button type="primary" shape="circle" @click="showModal = true">
                            <template #icon>
                                <UserAddOutlined />
                            </template>
                        </a-button>
                        <span style="cursor: pointer; margin-left: 10px" @click="handleLogout"><logout-outlined
                                style="font-size: 12px; margin-right: 4px;" />Logout</span>
                    </div>
                </div>
            </a-layout-header>
            <a-layout-content :style="{ margin: '5px 5px', padding: '15px', background: '#fff', minHeight: '280px' }">
                <RouterView v-if="route.params.user" />

                <!-- TRANG CHỦ -->
                <div v-else class="home-empty">
                    <div data-v-4bb16a71="" id="envelope" class="relative mx-auto">
                        <svg data-v-4bb16a71="" style="width: 100%; height: calc(100vh - 200px)" class="h-56 w-56"
                            fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1035 832">
                            <path data-v-4bb16a71="" opacity=".1"
                                d="M601 95c-66-2-129-20-189-39S291 15 227 4c-42-6-90-7-123 11S61 64 55 93c-4 21-6 44 5 64 8 14 23 26 33 39 34 47 10 105-28 150-17 22-37 42-51 65s-19 49-8 72c12 23 40 40 70 53 61 24 133 31 203 35 156 9 313 5 469 1 57-1 115-2 172-10 32-4 64-10 87-26 29-20 36-54 17-80-33-42-123-52-146-98-13-25 0-52 19-76 39-49 105-93 108-149 2-39-29-78-78-97-51-19-122-17-160 15-39 33-107 46-166 44ZM514.5 831.6c160.604 0 290.8-13.118 290.8-29.3 0-16.182-130.196-29.3-290.8-29.3s-290.8 13.118-290.8 29.3c0 16.182 130.196 29.3 290.8 29.3Z"
                                fill="#6C63FF" style="transform: translate3d(0px, 10.167px, 0px);"></path>
                            <path data-v-4bb16a71="" d="M249 799s-13-73-61-109c-20-15-35-36-42-60l-5-34"
                                stroke="#535461" stroke-width="2" stroke-miterlimit="10"
                                style="transform: translate3d(0px, 10.8524px, 0px);"></path>
                            <path data-v-4bb16a71=""
                                d="M111 573c4 8 30 24 30 24s4-30 0-37c-4-8-14-12-23-8s-11 14-7 21Zm-3 55c8 5 39 4 39 4s-14-26-22-31-18-2-22 5-3 18 5 22Zm39 74c10 0 37-16 37-16s-27-16-36-16-17 7-17 16 7 16 16 16Zm43 49c9 2 39-9 39-9s-23-20-33-22-17 4-19 13 4 17 13 18Zm-10-132c-3 8-28 27-28 27s-7-29-3-38 12-12 21-9 13 12 10 20Zm49 59c-5 7-35 17-35 17s3-30 9-36c6-7 16-9 23-3 7 4 9 14 4 21l-1 1Zm40 63c-4 7-31 23-31 23s-3-30 2-38 14-11 22-7 12 14 7 22Z"
                                fill="#6C63FF" style="transform: translate3d(0px, 12.718px, 0px);"></path>
                            <path data-v-4bb16a71="" opacity=".25"
                                d="M111 573c4 8 30 24 30 24s4-30 0-37c-4-8-14-12-23-8s-11 14-7 21Zm-3 55c8 5 39 4 39 4s-14-26-22-31-18-2-22 5-3 18 5 22Zm39 74c10 0 37-16 37-16s-27-16-36-16-17 7-17 16 7 16 16 16Zm43 49c9 2 39-9 39-9s-23-20-33-22-17 4-19 13 4 17 13 18Zm-10-132c-3 8-28 27-28 27s-7-29-3-38 12-12 21-9 13 12 10 20Zm49 59c-5 7-35 17-35 17s3-30 9-36c6-7 16-9 23-3 7 4 9 14 4 21l-1 1Zm40 63c-4 7-31 23-31 23s-3-30 2-38 14-11 22-7 12 14 7 22Z"
                                fill="#000" style="transform: translate3d(0px, 12.123px, 0px);"></path>
                            <path data-v-4bb16a71="" d="M247 797s20-72-9-123c-11-22-16-46-12-70 2-12 5-23 10-34"
                                stroke="#535461" stroke-width="2" stroke-miterlimit="10"
                                style="transform: translate3d(0px, 11.509px, 0px);"></path>
                            <path data-v-4bb16a71=""
                                d="M218 538c0 9 18 33 18 33s16-25 15-34-8-16-17-15-16 7-16 16Zm-26 49c5 7 34 19 34 19s-1-30-7-37c-5-7-15-9-23-4a15.005 15.005 0 0 0-6.919 10.106A14.99 14.99 0 0 0 192 587Zm4 83c9 3 40-1 40-1s-17-25-26-28-18 0-22 7 0 18 8 22Zm18 61c8 5 39 7 39 7s-12-28-20-33-18-3-23 4-4 17 3 22h1Zm47-124c-6 6-37 13-37 13s7-29 13-35c7-7 17-7 24-1 6 6 7 15 1 22l-1 1Zm21 72c-9 4-40 2-40 2s15-26 23-30 19-1 23 6c5 8 2 18-6 22Zm9 73c-7 5-39 9-39 9s11-29 18-34 18-4 24 3a15 15 0 0 1-3 22Z"
                                fill="#6C63FF" style="transform: translate3d(0px, 13.2781px, 0px);"></path>
                            <path data-v-4bb16a71=""
                                d="M579 214 317 384l171 308c1 3 4 5 7 6l155 37c5 2 11-1 13-6l77-160 84-112-199-236a35 35 0 0 0-46-7Z"
                                fill="#DCDFED" style="transform: translate3d(0px, 15.1994px, 0px);"></path>
                            <path data-v-4bb16a71="" opacity=".1"
                                d="m827 459-1 1-49 65-1 2-33 44-66 136-2 4-9 19c-2 5-8 8-13 7l-155-38c-3-1-6-3-8-6l-15-27-2-4-107-194-1-2-45-81 5-3 41-27h1l87-56 5-4 122-79c15-10 35-7 46 7l91 107 4 5 67 78v1l33 39 4 5 1 1Z"
                                fill="#000" style="transform: translate3d(0px, 14.7654px, 0px);"></path>
                            <path data-v-4bb16a71="" opacity=".1"
                                d="m786 412-8 56-2 17-2 36v3l-7 188a11.999 11.999 0 0 1-14 11l-78-17h-1l-200-45-4-1-110-24 3-169v-6l1-51v-57l87-56 6-3c80 8 187 24 259 35l4 5 66 78Z"
                                fill="#000"></path>
                            <path data-v-4bb16a71=""
                                d="m795 346-9 66-9 60-2 17-2 36-7 191a11.999 11.999 0 0 1-14 11l-79-17-200-45-114-25 3-175 1-51 1-60v-62c19-1 50 1 87 5a5591.76 5591.76 0 0 1 344 49Z"
                                fill="#6C63FF"></path>
                            <path data-v-4bb16a71="" opacity=".1"
                                d="m820 452-43 20-215 106-199-164-41-33-5 3 45 81-3 175 114 25 15 27c1 3 4 5 7 6l155 37c5 2 11-1 13-6l10-19 78 17c7 2 13-2 15-9v-2l7-191 50-67v-1l-3-5Z"
                                fill="#000" style="transform: translate3d(0px, 14.3011px, 0px);"></path>
                            <path data-v-4bb16a71=""
                                d="m317 384-18 305c0 6 4 11 9 13l474 105a11.994 11.994 0 0 0 9.442-2.391A11.997 11.997 0 0 0 796 796l28-339-262 129-245-202Z"
                                fill="#DCDFED" style="transform: translate3d(0px, 13.8006px, 0px);"></path>
                            <path data-v-4bb16a71="" opacity=".1"
                                d="m303 696 246-151c7-5 17-3 23 3l220 257c1 1 1 0 0 0L303 696c-2 1-2 0 0 0Z" fill="#000"
                                style="transform: translate3d(0px, 15.9736px, 0px);"></path>
                            <path data-v-4bb16a71="" d="m304 696 244-147c8-5 18-3 24 4l218 251v3l-2 1-483-107-2-3 1-2Z"
                                fill="#E3E5F1" style="transform: translate3d(0px, 15.6014px, 0px);"></path>
                        </svg>
                        <div data-v-4bb16a71="" class="envelope-glowing"></div>
                    </div>
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>

    <!-- Modal create account -->
    <ModalCMS :showModal="showModal" @close-modal="handleCloseModal" :titleModal="''" class="modal-create-acc">
        <a-spin :spinning="loading">
            <h1>
                <span class="logo-modal">
                    <UserAddOutlined />
                </span>Tạo tài khoản
            </h1>
            <a-form ref="formRef" :model="formState" name="basic" autocomplete="off" @finish="onFinish">
                <a-form-item label="Email" name="mailname"
                    :rules="[{ required: true, message: 'Please input your email!' }]">
                    <a-input v-model:value="formState.mailname" style="width: 100%;" addon-after="@mmo-job.com" />
                </a-form-item>

                <div style="display: flex; justify-content: center">
                    <a-button html-type="button" @click="handleCloseModal">Hủy</a-button>
                    <a-button type="primary" html-type="submit" style="margin-left: 5px;">Tạo</a-button>
                </div>
            </a-form>
        </a-spin>
    </ModalCMS>
</template>
<script setup>
import {
    UserAddOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    SyncOutlined,
    SearchOutlined,
    MailOutlined
} from '@ant-design/icons-vue';
import { ref, reactive, onMounted, watch } from 'vue';
import Cookie from 'js-cookie';
import { useRoute, useRouter } from 'vue-router';
import LoginSrv from '../services/CMS/auth.service';
import ListMailSrv from '../services/CMS/mail.service';
import ModalCMS from '../components/ModalCMS.vue';
import { message } from 'ant-design-vue';


const router = useRouter();
const route = useRoute();
const showModal = ref(false);
const formRef = ref(null);
const loading = ref(false)
const flagMenu = ref(false);
const listMail = ref([]);
const currentMail = ref(route.params.user || '');
let formState = reactive({
    mailname: '',
});

let fetchParams = {
    page: 1
}

const refreshPage = () => {
    window.location.reload();
}

const handleLogout = async () => {
    await Cookie.remove("access_token");
    await Cookie.remove("refresh_token");
    router.push({ path: '/login' })
}

const getListMailName = async () => {
    try {
        const res = await ListMailSrv.getMailName(fetchParams);
        if (res.data?.msg == 'success') {
            listMail.value = res.data.data;
        }
    } catch (error) {
        console.error('Error fetching tag:', error);
    }
};


const onFinish = async () => {
    loading.value = true;
    const mailName = formState.mailname + '@mmo-job.com';
    try {
        const res = await ListMailSrv.createMail(mailName);
        if (res.data.msg == "success") {
            getListMailName();
            handleCloseModal();
            message.success('Tạo mail mới thành công!');
        }
    } catch (error) {
        console.error('Error fetching tag:', error.response?.data?.detail?.msg);
        message.error(error.response?.data?.detail?.msg);
    } finally {
        loading.value = false;
    }
}

const handleCloseModal = () => {
    showModal.value = false;
    resetFormValidation();
}

const resetFormValidation = () => {
    const form = formRef.value;
    form.resetFields();
};

onMounted(() => {
    getListMailName();
});

watch(() => route.params.user,
    async (newParam) => {
        currentMail.value = newParam;
    }
);
</script>
<style scoped lang="scss">
.ant-layout.ant-layout-has-sider {
    min-height: 100vh;
}

.custom-sider {
    position: fixed;
    left: 0;
    top: 0;
    width: 200px;
    height: 100vh;
    z-index: 10;

    @media screen and (max-width: 768px) {
        transform: translateX(-100%);
    }

    .ant-menu-item {
        display: block;
    }
}

.ant-layout .ant-layout-header {
    position: sticky;
    left: 0;
    top: 0;
    background: #fff;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    z-index: 1;
}

.trigger {
    font-size: 18px;
    padding: 0 15px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #Fff;
    font-weight: bold;
}

.site-layout .site-layout-background {
    background: #fff;
}

.content-right {
    margin-left: 200px;

    @media screen and (max-width: 768px) {
        margin-left: 0;
    }
}

.wrap-header {
    display: flex;
    justify-content: space-between;

    .control-left {
        display: flex;
        align-items: center;

        h2 {
            color: #0061f1;
            font-size: 18px;
        }

        .anticon {
            font-size: 14px;
            margin: 5px 9px 0;

        }
    }

    .account {
        margin-right: 15px;

        .name {
            margin-right: 5px;
            font-weight: bold;
        }
    }
}

.btn-refresh {
    background: #4caf50;
    width: 100%;
    margin-bottom: 10px;

    &:hover {
        background: #29592b;
    }
}

.modal-create-acc {
    h1 {
        font-size: 20px;
        text-align: center;
        margin-bottom: 20px;

        span {
            display: block;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #1890ff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: auto;
            color: #fff;
        }

    }
}
</style>
