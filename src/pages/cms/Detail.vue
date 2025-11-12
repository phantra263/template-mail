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
            <div v-if="mailDetail?.data" class="email-body-content" v-html="sanitizedEmailBody"></div>
        </div>
    </div>
</template>
<script setup>
import {
    ArrowLeftOutlined,
    PaperClipOutlined
} from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import ListMailSrv from '../../services/CMS/mail.service';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const mailDetail = ref({});

const fetchParams = { mail_id: route.params.id || '' };

const getMailDetail = async () => {
    loading.value = true;
    try {
        const res = await ListMailSrv.getMailDetail(fetchParams);
        if (res.data?.msg === 'success') {
            mailDetail.value = res.data.data;
        }
    } catch (error) {
        console.error('Error fetching:', error);
    } finally {
        loading.value = false;
    }
};

// ==================== FIX UTF-8 BỊ DECODE SAI (TIẾNG VIỆT, THÁI, NHẬT...) ====================
const fixUtf8Misinterpreted = (str) => {
    if (!str || typeof str !== 'string') return str;

    // Phát hiện các ký tự Latin-1 bị nhầm (Ã, ª, º, ¸, ¹, etc.)
    if (/[\u00C0-\u00FF][\u0080-\u00BF]/.test(str) || /Ã[-¿]/.test(str)) {
        try {
            // Chuyển từng ký tự thành byte Latin-1 → decode UTF-8 đúng
            const bytes = Uint8Array.from(str, c => c.charCodeAt(0) & 0xFF);
            return new TextDecoder('utf-8').decode(bytes);
        } catch (e) {
            console.warn('UTF-8 fix failed:', e);
        }
    }
    return str;
};

// ==================== PARSE MULTIPART EMAIL (ƯU TIÊN HTML) ====================
const parseMultipart = (body, contentType) => {
    if (!contentType || !contentType.includes('multipart')) return body;

    const boundaryMatch = contentType.match(/boundary="?([^";]+)"?/i);
    if (!boundaryMatch) return body;

    const boundary = boundaryMatch[1];
    const regex = new RegExp(`--${boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\r?\\n|--)`, 'g');
    const parts = body.split(regex).filter(part => part && !part.match(/^--$/));

    let html = '';
    let text = '';

    for (const part of parts) {
        const headerEnd = part.search(/\r?\n\r?\n/);
        if (headerEnd === -1) continue;

        const headers = part.substring(0, headerEnd).toLowerCase();
        const content = part.substring(headerEnd + 4);

        if (headers.includes('text/html')) {
            html = content;
            break; // Ưu tiên HTML → dừng ngay
        } else if (headers.includes('text/plain') && !text) {
            text = content;
        }
    }

    return html || text || body;
};

// ==================== ESCAPE HTML (CHỐNG XSS) ====================
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// ==================== EXTRACT BODY → HTML AN TOÀN ====================
const extractString = (rawData) => {
    if (!rawData) return '';

    let parsed;
    try {
        parsed = JSON.parse(rawData);
    } catch {
        return `<pre class="email-pre">${fixUtf8Misinterpreted(rawData)}</pre>`;
    }

    let body = parsed.body || '';
    const contentType = parsed['content-type'] || '';

    // Bước 1: Sửa lỗi encoding (hỗ trợ tiếng Việt, Thái, Nhật...)
    body = fixUtf8Misinterpreted(body);

    // Bước 2: Nếu là multipart → ưu tiên lấy phần HTML
    if (contentType.includes('multipart')) {
        const extracted = parseMultipart(body, contentType);
        if (extracted.includes('<html') || extracted.includes('<table') || extracted.includes('<a ')) {
            // Nếu là HTML → trả về luôn (đã escape)
            return `<div class="email-html">${extracted}</div>`;
        } else {
            // Nếu chỉ có text → dùng <pre>
            body = extracted;
        }
    }

    // Bước 3: Plain text → dùng <pre> để giữ xuống dòng
    return `<pre class="email-pre">${escapeHtml(body)}</pre>`;
};

// ==================== SANITIZE HTML (CHỐNG XSS) ====================
const sanitizedEmailBody = computed(() => {
    if (!mailDetail.value?.data) return '';

    let html = extractString(mailDetail.value.data);

    // Nếu là HTML thật → loại bỏ script, event, iframe
    if (html.includes('<div class="email-html"')) {
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        html = html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        html = html.replace(/javascript:/gi, '');
        html = html.replace(/<iframe[^>]*>/gi, '');
        html = html.replace(/<link[^>]*>/gi, '');
    }

    return html;
});

// ==================== HELPER FUNCTIONS ====================
const parseJSON = (data) => {
    try { return JSON.parse(data); } catch { return null; }
};

const base64ToBlob = (base64, contentType) => {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
};

const downloadFile = (attachment) => {
    try {
        const blob = base64ToBlob(attachment.payload, attachment.mail_content_type);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = attachment.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Download failed:', err);
    }
};

const handleBack = () => router.back();

onMounted(getMailDetail);
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
    flex-wrap: wrap;

    .btn-attach {
        padding: 10px 15px;
        border-radius: 3px;
        display: inline-block;
        cursor: pointer;
        border: 1px solid #eee;
        transition: background 0.2s;

        &:hover {
            background: #eee;
        }

        .anticon {
            margin-right: 5px;
        }
    }
}

.content-mail {
    padding: 20px 0;
    min-height: 200px;
}

/* Reset styles cho nội dung email */
.email-body-content {
    padding: 0;
    background: none;
    border: none;
}

.email-pre {
    white-space: pre-wrap;
    /* Giữ xuống dòng + wrap text */
    word-wrap: break-word;
    /* Ngắt từ dài */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14.5px;
    line-height: 1.7;
    color: #1a1a1a;
    margin: 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    overflow-x: auto;

    /* Tự động bôi đậm mã OTP nếu có */
    strong {
        font-weight: 600;
        color: #d32f2f;
    }

    /* Link tự động bấm được */
    a {
        color: #0066cc;
        text-decoration: underline;
        word-break: break-all;
    }

    a:hover {
        text-decoration: none;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .email-pre {
        padding: 15px;
        font-size: 14px;
    }
}
</style>