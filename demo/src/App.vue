<template>
  <div>
    <input :value="currentDate" type="date" @change="setDate" />
    Current value is: {{ selectedDay }}
    <button @click="controls.previous()"> Prev </button>
    <div v-for="day in selectedDateRange" :key="day.toISOString()"> 
      {{ day }}
    </div>
    <button @click="controls.next()"> Next </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useDatePager } from '../../src'

export default defineComponent({
  name: 'App',
  setup() {
    const { selectedDay, controls, selectedDateRange } = useDatePager({
      nextMode: 'day'
    })

    const currentDate = computed(() => selectedDay.value.toISOString().slice(0, 10))
    const setDate = (e: Event) => {
      const target = e.target as HTMLInputElement
      const date = new Date(Date.parse(target.value))
      controls.setDay(date);
    }
    return {
      currentDate,
      setDate,
      selectedDay,
      controls,
      selectedDateRange
    }
  }
})
</script>
