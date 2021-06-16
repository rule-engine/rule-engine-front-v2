<template>
  <div @mouseenter="changeActive($event)" @mouseleave="removeActive($event)">
    <VueDragResize  class="core" :isActive="true"
                   :w="200" :h="200" v-on:resizing="resize" v-on:dragging="resize">
      <h3>Hello World!</h3>
      <p>{{ top }} х {{ left }} </p>
      <p>{{ width }} х {{ height }}</p>
    </VueDragResize>
  </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize';
//demo
export default {
  name: 'Drag',

  components: {
    VueDragResize
  },

  data() {
    return {
      width: 0,
      height: 0,
      top: 0,
      left: 0
    }
  },

  methods: {
    resize(newRect) {
      this.width = newRect.width;
      this.height = newRect.height;
      this.top = newRect.top;
      this.left = newRect.left;
    },
    changeActive($event) {
      $event.currentTarget.className = 'move';
    },
    removeActive($event) {
      $event.currentTarget.className = '';
    }
  }
}
</script>
<style>

.move {
  cursor: move;
}
</style>
