<template>
    <div class="wrap-modal">
        <img src="https://github.githubassets.com/images/modules/site/home/hero-glow.svg" alt="Glowing universe"
            class="js-warp-hide position-absolute overflow-hidden home-hero-glow events-none">

        <a-form ref="formRef" :model="formState" :class="{ 'flag': flagSignUp }" class="modal" @finish="onFinish">
            <h1>Welcome to Template Mail!
                <br /> Let's create easy mail...
            </h1>

            <label for=" username">Enter your username*</label>
            <a-form-item name="usename" :rules="[{ required: true, message: 'Please input your username!' }]">
                <a-input v-model:value="formState.usename" />
            </a-form-item>

            <label for="password">Enter your password*</label>
            <a-form-item name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
                <a-input v-model:value="formState.password" />
            </a-form-item>

            <div class="form-control">
                <!-- <button @click="flag()" type="button" class="btn-left" v-if="!flagSignUp">Sign Up</button>
                <button @click="flag()" type="button" class="btn-left" v-else="flagSignUp">Sign In</button> -->
                <button type="submit">Continute</button>
            </div>
        </a-form>

        <div class="signup-space">
            <div class="signup-stars"></div>
            <div class="signup-stars"></div>
            <div class="signup-stars"></div>
            <div class="signup-stars"></div>
            <div class="signup-stars"></div>
            <div class="signup-stars"></div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Cookie from 'js-cookie';
import { message } from 'ant-design-vue';
import LoginSrv from '../../services/CMS/auth.service';
import axios from 'axios';

const loading = ref(false);
const flagSignUp = ref(false);
const router = useRouter();
const formState = reactive({
    usename: '',
    password: ''
});
const onFinish = async (values) => {
    loading.value = true;
    try {
        const res = await LoginSrv.login(values);
        console.log(res.data);
        if (res.data.msg == "success") {
            message.success('Login success!');
            await Cookie.set("access_token", `Bearer ${res.data.data.access_token}`);
            await Cookie.set("refresh_token", `${res.data.data.refresh_token}`);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.access_token}`;
        }
    } catch (error) {
        message.error('Sai thông tin đăng nhập');
        console.error('Error fetching tag:', error);
    } finally {
        loading.value = false;
        router.push({ path: '/' });
    }
};
const flag = () => {
    flagSignUp.value = !flagSignUp.value;
    resetFormValidation();
}

const resetFormValidation = () => {
    const form = formRef.value;
    form.resetFields();
};
</script>

<style scoped lang="scss">
.page-login {
    min-height: 100vh;
    display: flex;
    background-image: url('../assets/tecnology.jpg');
    background-size: cover;

    @media screen and (max-width: 768px) {
        padding: 0 15px;
    }

    .wrap-content {
        max-width: 550px;
        margin: auto;
        width: 100%;
        border: 1px solid #eee;
        padding: 20px;
        background: #236871;
        border-radius: 10px;

        h1 {
            text-align: center;
            color: #fff;
        }
    }

    .form-login {
        width: 100%;

        .ant-form-item {
            margin-bottom: 10px;
        }

        :deep(.ant-form-item-label > label) {
            color: #fff;
        }
    }
}

.wrap-modal {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #040d21;
    perspective: 1000px;

    .modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #202637;
        background-color: #0c162d;
        padding: 1.5rem;
        border-radius: 6px;
        width: 500px;
        z-index: 2;
        transform-style: preserve-3d;
        transition: transform 0.6s;

        @media screen and (max-width: 600px) {
            width: 90%;
        }

        &.flag {
            transform: translate(-50%, -50%) rotateY(360deg);
        }

        h1 {
            color: #8193b2;
            font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
            animation: type 5s steps(60, end) infinite;
            overflow: hidden;
            width: 100%;
            white-space: nowrap;
            font-size: 20px;
            margin-bottom: 20px !important;
            display: block;
        }

        label {
            color: #00cfc8;
            margin-bottom: 10px;
            display: inline-block;
            font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
        }

        .ant-input {
            border-radius: 6px;
            margin-right: 3px;
            padding: 5px 12px;
            border: 1px solid #035af0;
            flex: 1;
            background-color: #0c162d;
            color: #fff;
            font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
        }

        .form-control {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            button {
                color: #627597;
                background: none;
                border-color: #627597;
                padding: 5px 12px;
                font-size: 14px;
                line-height: 20px;
                border: 1px solid #8193b2;
                border-radius: 6px;
                cursor: pointer
            }
        }
    }
}

.signup-space,
.signup-stars {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
}

.signup-stars:nth-child(1) {
    background-position: 10% 90%;
    animation-delay: 0s;
}

.signup-stars {
    background-image: radial-gradient(2px 2px at 50px 200px, #eee, rgba(0, 0, 0, 0)), radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)), radial-gradient(3px 4px at 120px 40px, #ddd, rgba(0, 0, 0, 0));
    background-repeat: repeat;
    background-size: 250px 250px;
    opacity: 0;
    animation: zoom 10s infinite;
}

.signup-stars:nth-child(2) {
    background-position: 20% 50%;
    background-size: 270px 500px;
    animation-delay: .3s;
}

.signup-stars:nth-child(3) {
    background-position: 40% -80%;
    animation-delay: 1.2s;
}

.signup-stars:nth-child(4) {
    background-position: -20% -30%;
    transform: rotate(60deg);
    animation-delay: 2.5s;
}

.signup-stars:nth-child(5) {
    background-image: radial-gradient(2px 2px at 10px 100px, #eee, rgba(0, 0, 0, 0)), radial-gradient(2px 2px at 20px 10px, #fff, rgba(0, 0, 0, 0)), radial-gradient(3px 4px at 150px 40px, #ddd, rgba(0, 0, 0, 0));
    background-position: 80% 30%;
    animation-delay: 4s;
}

.signup-stars:nth-child(6) {
    background-position: 50% 20%;
    animation-delay: 6s;
}

.home-hero-glow {
    position: absolute;
    pointer-events: none;
    overflow: hidden;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    object-fit: cover;
    transform: translate(-50%, -50%);
}

@keyframes type {
    from {
        width: 0;
    }
}

@keyframes zoom {
    0% {
        opacity: 0;
        transform: scale(0.5);
        transform: rotate(5deg);
        animation-timing-function: ease-in;
    }

    85% {
        opacity: 1;
    }

    100% {
        opacity: .2;
        transform: scale(2.2);
    }
}
</style>