<template>
    <Drawer v-bind="NiceModal.antdDrawer(modal)" :title="props.title">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </Drawer>
</template>

<script setup lang="ts">
import { Drawer } from "ant-design-vue";
import NiceModal from "@pingtou/nice-modal-vue";

const props = defineProps<{ title: string }>();

const modal = NiceModal.useModal();
</script>
