<script setup lang="ts">
import NiceModal from "@pingtou/nice-modal-vue";
import { Button, Space } from "ant-design-vue";

import { AntdModal, AntdDrawer } from "./modals";

const NiceModalProvider = NiceModal.Provider;

const openModal = () => {
    NiceModal.show(AntdModal, { title: "Antd Modal" });
};

const openDrawer = () => {
    NiceModal.show(AntdDrawer, { title: "Antd Drawer" });
};
</script>

<template>
    <NiceModalProvider>
        <Space>
            <Button @click="openModal">Open Modal</Button>
            <Button @click="openDrawer">Open Drawer</Button>
        </Space>
    </NiceModalProvider>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
