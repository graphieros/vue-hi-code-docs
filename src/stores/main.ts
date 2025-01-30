import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
    const isDarkMode = ref(true);
    const isCopy = ref(false);
    const downloads = ref([]);
    const stars = ref(0);
    const screenWidth = ref(0);

    function copy() {
        isCopy.value = true;
        setTimeout(() => {
            isCopy.value = false;
        }, 600);
    }

    return {
        isDarkMode,
        isCopy,
        copy,
        downloads,
        stars,
        screenWidth
    }
})