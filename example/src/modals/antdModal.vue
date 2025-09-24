<template>
    <Modal v-bind="NiceModal.antdModal(modal)" :title="props.title">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </Modal>
</template>

<script setup lang="ts">
import { Modal } from "ant-design-vue";
import NiceModal from "@pingtou/nice-modal-vue";

const props = defineProps<{ title: string }>();

const modal = NiceModal.useModal();
</script>
