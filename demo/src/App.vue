<script lang="ts" setup>
import { computed } from 'vue'
import { PAGER_MODES, useDatePager } from '../../src'

const { selectedDay, controls, selectedSpan } = useDatePager({
  nextMode: PAGER_MODES.WEEK
})

const currentDate = computed(() => selectedDay.value.toISOString().slice(0, 10))
const setDate = (e: Event) => {
  const target = e.target as HTMLInputElement
  const time = target.value.split('-').map((n) => parseInt(n))
  const date = new Date(time[0], time[1] - 1, time[2])
  controls.setDay(date)
}
</script>

<template>
  <div>
    <input :value="currentDate" type="date" placeholder="yyyy-mm-dd" @change="setDate" />
    The selected day is: {{ selectedDay }}
    <button @click="controls.previous()">Prev</button>
    <div v-for="day in selectedSpan" :key="day.toISOString()">
      {{ day }}
    </div>
    <button @click="controls.next()">Next</button>
  </div>
</template>
