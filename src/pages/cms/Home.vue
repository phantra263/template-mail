<template>
    <div class="list-mail" v-if="route.params.user">
        <h1 class="title-page">Hộp thư đến</h1>
        <a-list class="demo-loadmore-list" :loading="initLoading" item-layout="horizontal" :data-source="listMail">
            <template #loadMore v-if="!fullData">
                <div v-if="!initLoading && !loading"
                    :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
                    <a-button @click="onLoadMore">loading more</a-button>
                </div>
            </template>
            <template #renderItem="{ item }">
                <a-list-item>
                    <RouterLink :to="{ path: `/mail/${item.to}/${item.id}` }"
                        style="display: flex;width: 100%; align-items: center;">
                        <a-skeleton avatar :title="false" :loading="!!item.loading" active>
                            <a-list-item-meta :description="item.subject">
                                <template #title>
                                    <span>{{ item.from }}</span>
                                </template>
                            </a-list-item-meta>
                            <time style="font-size: 11px; color: #000; margin-left: 10px;">00:12 Th 3, 14 thg 5</time>
                        </a-skeleton>
                    </RouterLink>
                </a-list-item>
            </template>
        </a-list>
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ListMailSrv from '../../services/CMS/mail.service';

const route = useRoute();
const initLoading = ref(true);
const loading = ref(false);
const listMail = ref([]);
const fullData = ref([false]);
let fetchParams = {
    mailname: route.params.user || '',
    page: 1
}


const getListMail = async () => {
    initLoading.value = false;
    loading.value = true;
    try {
        const res = await ListMailSrv.getListMail(fetchParams);
        if (res.data?.msg == 'success') {
            if (res.data.data.length > 0) {
                listMail.value = [...listMail.value, ...res.data.data];
            } else fullData.value = true;

        }
    } catch (error) {
        console.error('Error fetching tag:', error);
    } finally {
        loading.value = false;
    }
};

const onLoadMore = () => {
    fetchParams.page = fetchParams.page + 1;
    getListMail();
};

onMounted(() => {
    getListMail();
});
watch(() => route.params.user,
    async (newUser) => {
        listMail.value = [];
        fetchParams = {
            mailname: newUser,
            page: 1
        }
        getListMail();
    }
);
</script>
<style lang="scss" scoped>
.demo-loadmore-list {
    min-height: 350px;
}

#app .list-mail {
    .title-page {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 15px;
    }

    .ant-list-split .ant-list-item {
        border-radius: 5px;

        &:hover {
            background: #e7eaed;
        }
    }
}
</style>