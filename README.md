# @pingtou/nice-modal-vue

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

**Vue version of [@ebay/nice-modal-react](https://github.com/eBay/nice-modal-react).**

@pingtou/nice-modal-vue is a utility library that converts Vue.js modal components into Promise-based APIs.

English | [简体中文](./README.zh-CN.md)

An elegant Vue modal state management solution.

## Features

- 🎯 Simple and intuitive API
- 🔄 Promise-based modal operations
- 🎨 Framework agnostic - works with any UI library
- ⚡️ Lightweight, zero dependencies
- 📦 Full TypeScript support

## Usage

### Installation

```bash
# with yarn
yarn add @pingtou/nice-modal-vue

# or with npm
npm install @pingtou/nice-modal-vue
```

### Create Your Modal Component
With NiceModal you can create a separate modal component easily. It's just the same as creating a normal component but wrapping it with high order component by `NiceModal.create`. For example, the below code shows how to create a dialog with [Ant Design Vue](https://antdv.com/):

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
import { NiceModal } from '@pingtou/nice-modal-vue'

import _MyModal from './my-modal.vue'

export const MyModal = NiceModal.create(_MyModal)
```

From the code, we can see:
* The modal is uncontrolled. You can hide your modal inside the component regardless of where it is shown.
* The high order component created by `NiceModal.create` ensures your component is not executed before it becomes visible.
* You can call `modal.remove` to remove your modal component from the React component tree to reserve transitions.

Next, let's see how to use the modal.

### Using Your Modal Component
There are very flexible APIs for you to manage modals. See below for the introduction.

#### Embed your application with `NiceModal.Provider`:
Since we will manage the status of modals globally, the first thing is embedding your app with NiceModal provider, for example:

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

#### Using the modal by component
You can control a nice modal by the component itself.

```js
import NiceModal from '@pingtou/nice-modal-vue';
import { MyModal } from './my-modal'; // created by above code

async function showModal() {
  try {
    const res = await NiceModal.show(MyModal, {
      title: '标题',
      content: '内容',
    })
    console.log('结果:', res)
  }
  catch (error) {
    console.log('取消:', error)
  }
}
```

#### Use the modal by id
You can also control a nice modal by id:

```js
import NiceModal from '@pingtou/nice-modal-vue';
import { MyModal } from './my-modal'; // created by above code

// If you use by id, you need to register the modal component.
// Normally you create a modals.js file in your project
// and register all modals there.
NiceModal.register('my-modal', MyModal);

async function showModal() {
  try {
    const res = await NiceModal.show('my-modal', {
      title: '标题',
      content: '内容',
    })
    console.log('结果:', res)
  }
  catch (error) {
    console.log('取消:', error)
  }
}
```


#### Use modal with the hook
The `useModal` hook can not only be used inside a modal component but also any component by passing it a modal id/component:

```js
import NiceModal from '@pingtou/nice-modal-vue';
import { MyModal } from './my-modal'; // created by above code

NiceModal.register('my-modal', MyModal);
//...
// if you use with id, you need to register it first
const modal = NiceModal.useModal('my-modal');
// or if with component, no need to register
const modal = NiceModal.useModal(MyModal);
//...
modal.show({
  title: '标题',
  content: '内容',
}); // show the modal
modal.hide(); // hide the modal
//...
```

#### Declare your modal instead of `register`
The nice modal component you created can be also used as a normal component by JSX, then you don't need to register it. For example:

```html
<template>
  <div class="app">
    <h1>Nice Modal Examples</h1>
    <div class="demo-buttons">
      <button @click="showModal">Antd Vue Modal</button>
    </div>
    <MyModal id="my-modal" name="Nate" />
  </div>
</template>

<script setup>
import NiceModal from '@pingtou/nice-modal-vue';
import { MyModal } from './my-modal'; // created by above code

const showModal = () => {
  // Show a modal with arguments passed to the component as props
  NiceModal.show('my-modal')
};
</script>
```

#### Using promise API

Besides using props to interact with the modal from the parent component, you can do more easily by promise. For example, we have a user list page with an add user button to show a dialog to add user. After user is added the list should refresh itself to reflect the change, then we can use below code:

```js
NiceModal.show(AddUserModal)
  .then(() => {
    // When call modal.resolve(payload) in the modal component
    // it will resolve the promise returned by `show` method.
    // fetchUsers will call the rest API and update the list
    fetchUsers()
  })
  .catch(err=> {
    // if modal.reject(new Error('something went wrong')), it will reject the promise
  }); 
```

#### Using with any UI library
NiceModal provides lifecycle methods to manage the state of modals. You can use modal handler returned by `useModal` hook to bind any modal-like component to the state. Below are typical states and methods you will use:

* ***modal.visible**: the visibility of a modal.
* ***modal.hide**: will hide the modal, that is, change `modal.visible` to false.
* ***modal.remove**: remove the modal component from the tree so that your modal's code is not executed when it's invisible. Usually, you call this method after the modal's transition.

Based on these properties/methods, you can easily use NiceModal with any modal-like component provided by any UI libraries.

#### Using help methods
As you already saw, we use code similar with below to manage the modal state:

```html
<template>
  <Modal
    :open="modal.visible"
    title="Hello Antd"
    @ok="modal.hide"
    @cancel="modal.hide"
    :after-close="modal.remove"
  >
    Hello NiceModal!
  </Modal>
</template>

<script setup>
import { Modal } from 'ant-design-vue';
import NiceModal from '@pingtou/nice-modal-vue';

const modal = useModal();
</script>
```

It binds `visible` property to the `modal` handler, and uses `modal.hide` to hide the modal when close button is clicked. And after the close transition it calls `modal.remove` to remove the modal from the dom node.

For every modal implementation, we always need to do these bindings manually. So, to make it easier to use we provided helper methods for Ant Design Vue.

```html
<template>
  <!-- For ant-design-vue -->
  <Modal v-bind="NiceModal.antdModal(modal)" />
  <Drawer v-bind="NiceModal.antdDrawer(modal)" />
</template>

<script setup>
import { Modal, Drawer } from 'ant-design-vue';
import NiceModal from '@pingtou/nice-modal-vue';

//...
const modal = useModal();
</script>
```

These helpers will bind modal's common actions to correct properties of the component. However, you can always override the property after the helper's property. For example:

```html
<template>
  <!-- For ant-design-vue -->
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

In the example, the `onOk` property will override the result from `antdModal` helper.

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