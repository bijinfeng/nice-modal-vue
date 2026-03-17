# @pingtou/nice-modal-vue

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

**[@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react) 的 Vue 版本。**

@pingtou/nice-modal-vue 是一个将 Vue.js 弹窗组件转化为 Promise API 的实用库。

[English](./README.md) | 简体中文

一个优雅的 Vue 弹窗状态管理解决方案。

## 特性

- 🎯 简单直观的 API
- 🔄 基于 Promise 的弹窗操作
- 🎨 框架无关，兼容任意 UI 库
- ⚡️ 轻量无依赖
- 📦 完善的 TypeScript 支持

## 快速上手

### 安装

```bash
# 使用 yarn
$ yarn add @pingtou/nice-modal-vue

# 或使用 npm
$ npm install @pingtou/nice-modal-vue
```

### 创建你的弹窗组件
借助 NiceModal，你可以轻松创建独立的弹窗组件。只需像普通组件一样编写，并用 `NiceModal.create` 包裹即可。例如，以下代码展示了如何结合 [Ant Design Vue](https://antdv.com/) 创建弹窗：

```html
<!-- my-modal.vue -->
<template>
  <Modal
    v-model:open="modal.visible"
    :title="title"
    @ok="handleConfirm"
    @cancel="handleCancel"
    :after-close="modal.remove"
  >
    {{ content }}
  </Modal>
</template>

<script setup>
import { Modal } from 'ant-design-vue'
import NiceModal from '@pingtou/nice-modal-vue'

defineProps(['title', 'content'])

const modal = NiceModal.useModal()

const handleCancel = () => {
  modal.reject('cancel')
  modal.hide()
}

const handleConfirm = () => {
  modal.resolve('confirm')
  modal.hide()
}
</script>
```

```js
// my-modal.js
import NiceModal from '@pingtou/nice-modal-vue'
import _MyModal from './my-modal.vue'

export const MyModal = NiceModal.create(_MyModal)
```

- 弹窗为非受控组件，可在组件内部随时隐藏。
- 通过 `NiceModal.create` 创建的高阶组件，确保组件在可见前不会被执行。
- 可调用 `modal.remove` 从组件树中移除弹窗，保留过渡动画。

### 如何使用弹窗组件

#### 用 Provider 包裹应用
NiceModal 需要全局管理弹窗状态，首先用 Provider 包裹你的应用：

```html
<!-- App.vue -->
<template>
  <NiceModalProvider>
    <router-view />
  </NiceModalProvider>
</template>

<script setup>
import NiceModal from '@pingtou/nice-modal-vue';
const NiceModalProvider = NiceModal.Provider
</script>
```

#### 通过组件调用弹窗

```js
import NiceModal from '@pingtou/nice-modal-vue';
import { MyModal } from './my-modal';

async function showModal() {
  try {
    const res = await NiceModal.show(MyModal, {
      title: '标题',
      content: '内容',
    })
    console.log('结果:', res)
  } catch (error) {
    console.log('取消:', error)
  }
}
```

#### 通过 id 调用弹窗

```js
import NiceModal from '@pingtou/nice-modal-vue';
import { MyModal } from './my-modal';

NiceModal.register('my-modal', MyModal);

async function showModal() {
  try {
    const res = await NiceModal.show('my-modal', {
      title: '标题',
      content: '内容',
    })
    console.log('结果:', res)
  } catch (error) {
    console.log('取消:', error)
  }
}
```

#### useModal 钩子的用法

`useModal` 钩子不仅可在弹窗组件内部使用，也可在任意组件中通过传入 id 或组件使用：

```js
import NiceModal from '@pingtou/nice-modal-vue';
import { MyModal } from './my-modal';

NiceModal.register('my-modal', MyModal);
const modal = NiceModal.useModal('my-modal');
// 或直接传组件
const modal = NiceModal.useModal(MyModal);

modal.show({ title: '标题', content: '内容' });
modal.hide();
```

#### 直接声明弹窗组件（无需 register）

你也可以像普通组件一样直接在模板中声明弹窗：

```html
<template>
  <div class="app">
    <h1>Nice Modal 示例</h1>
    <div class="demo-buttons">
      <button @click="showModal">Antd Vue 弹窗</button>
    </div>
    <MyModal id="my-modal" name="Nate" />
  </div>
</template>

<script setup>
import NiceModal from '@pingtou/nice-modal-vue';
import { MyModal } from './my-modal';

const showModal = () => {
  NiceModal.show('my-modal')
};
</script>
```

#### Promise API

除了通过 props 交互，还可以直接用 Promise 方式处理弹窗结果：

```js
NiceModal.show(AddUserModal)
  .then(() => {
    // 在弹窗组件中调用 modal.resolve(payload) 时会触发
    fetchUsers()
  })
  .catch(err => {
    // 在弹窗组件中调用 modal.reject(error) 时会触发
  });
```

#### 兼容任意 UI 库

NiceModal 提供生命周期方法管理弹窗状态。你可以用 `useModal` 钩子返回的 modal handler 绑定任意 UI 库的弹窗组件：

- `modal.visible`：弹窗可见性
- `modal.hide`：隐藏弹窗
- `modal.remove`：从组件树移除弹窗，通常在过渡动画后调用

#### Ant Design Vue 辅助方法

为方便绑定，NiceModal 提供了 Ant Design Vue 的辅助方法：

```html
<template>
  <Modal v-bind="NiceModal.antdModal(modal)" />
  <Drawer v-bind="NiceModal.antdDrawer(modal)" />
</template>

<script setup>
import { Modal, Drawer } from 'ant-design-vue';
import NiceModal from '@pingtou/nice-modal-vue';
const modal = useModal();
</script>
```

你可以覆盖辅助方法返回的属性，例如：

```html
<template>
  <Modal v-bind="NiceModal.antdModal(modal)" @ok="handleSubmit" />
</template>

<script setup>
const handleSubmit = () => {
  doSubmit().then(() => {
    modal.hide();
  });
}
</script>
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@pingtou/nice-modal-vue?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@pingtou/nice-modal-vue
[npm-downloads-src]: https://img.shields.io/npm/dm/@pingtou/nice-modal-vue?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@pingtou/nice-modal-vue
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@pingtou/nice-modal-vue?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@pingtou/nice-modal-vue
[license-src]: https://img.shields.io/github/license/bijinfeng/nice-modal-vue.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/bijinfeng/nice-modal-vue/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@pingtou/nice-modal-vue
