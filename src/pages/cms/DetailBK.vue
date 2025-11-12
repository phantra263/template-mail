<template>
    <div class="wrap-detail">
        <div class="title">
            <ArrowLeftOutlined @click="handleBack" />
            <h2>{{ mailDetail?.subject }}</h2>
        </div>
        <div class="infor-contact">
            <div class="infor-left">
                <b style="margin-bottom: 8px; display: inline-block;">{{ mailDetail?.from }}</b>
                <p>Tới:<span>Me</span></p>
            </div>
            <time>{{ mailDetail?.time }}</time>
        </div>

        <!-- file đính kèm -->
        <div class="attachment" v-if="mailDetail?.data && parseJSON(mailDetail?.data)?.attachments?.length > 0">
            <div @click="downloadFile(attachment)" class="btn-attach"
                v-for="(attachment, index) in parseJSON(mailDetail?.data)?.attachments" :key="index">
                <PaperClipOutlined />{{ attachment.filename }}
            </div>
        </div>

        <div class="content-mail">
            <div v-if="mailDetail?.data" v-html="extractString(parseJSON(mailDetail?.data)?.body)"></div>
        </div>
    </div>
</template>
<script setup>
import {
    ArrowLeftOutlined,
    PaperClipOutlined
} from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import ListMailSrv from '../../services/CMS/mail.service';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const mailDetail = ref({});
let fetchParams = {
    mail_id: route.params.id || '',
}
const getMailDetail = async () => {
    loading.value = true;
    try {
        const res = await ListMailSrv.getMailDetail(fetchParams);
        if (res.data?.msg == 'success') {
            mailDetail.value = res.data.data;
            console.log(parseJSON(mailDetail.value.data));
        }
    } catch (error) {
        console.error('Error fetching:', error);
    } finally {
        loading.value = false;
    }
};

const extractString = (originalString) => {
    const isDecoded = (str) => {
        try {
            return str === decodeURIComponent(escape(str));
        } catch (e) {
            return false;
        }
    };

    if (!isDecoded(originalString)) {
        try {
            originalString = decodeURIComponent(escape(originalString));
        } catch (e) {
            // Nếu có lỗi, trả về chuỗi gốc
            originalString = originalString;
        }
    }

    const boundary = '--- mail_boundary ---';
    const parts = originalString.split(boundary);
    let extractedString = '';
    if (parts.length > 1) {
        extractedString = parts[1].trim();
    }
    console.log(extractedString);
    return extractedString;
}

const handleBack = () => {
    router.back();
}
const parseJSON = (data) => {
    return JSON.parse(data);
}

const base64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
};
const createDownloadLink = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    return link;
};
const downloadFile = (mailAttachment) => {
    const blob = base64ToBlob(mailAttachment.payload, mailAttachment.mail_content_type);
    const link = createDownloadLink(blob, mailAttachment.filename);
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(link.href); // Release the memory after a short delay
    }, 100); // Delay of 100 milliseconds
}
onMounted(() => {
    getMailDetail();
});
</script>
<style lang="scss" scoped>
.title {
    margin-bottom: 10px;
    padding: 10px 0 20px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;

    @media screen and (max-width: 768px) {
        padding: 10px 0 10px 0;
    }

    .anticon {
        margin-right: 10px;
        cursor: pointer;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        text-align: center;
        line-height: 36px;
        display: inline-block;
        transition: all 0.2s;

        &:hover {
            background: #eee;
            transition: all 0.2s;
        }
    }
}

.infor-contact {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    time {
        font-size: 11px;
    }
}

.attachment {
    padding: 10px 0;
    display: flex;
    gap: 10px;

    .btn-attach {
        padding: 10px 15px;
        border-radius: 3px;
        display: inline-block;
        cursor: pointer;
        border: 1px solid #eee;

        &:hover {
            background: #eee;
        }
    }
}
</style>