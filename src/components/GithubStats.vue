<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { VueUiXy } from "vue-data-ui/vue-ui-xy";
import { VueUiIcon } from "vue-data-ui/vue-ui-icon";
import "vue-data-ui/style.css"
import { useMainStore } from "@/stores/main";

const step = ref(0);

const data = ref([
    {
        name: 'Daily downloads',
        series: [],
        type: 'line',
        useArea: true,
        color: '#559AD3',
        useTag: 'end'
    }
]);

const xAxisLabels = ref([]);

const store = useMainStore();
const isDarkMode = computed(() => store.isDarkMode);


watch(() => isDarkMode.value, () => {
    step.value += 1;
})

const start = ref("2025-01-27");
const lastDate = ref(new Date(Date.now()));

const end = computed(() => {
    const day = lastDate.value.getDate();
    const month = lastDate.value.getMonth() + 1;
    const year = lastDate.value.getFullYear();
    return `${year}-${String(month).length === 1 ? `0${month}` : month}-${String(day).length === 1 ? `0${day}` : day}`;
});

const url = computed(() => {
    return `https://api.npmjs.org/downloads/range/${start.value}:${end.value}/vue-ui-code`;
});

const config = computed(() => {
    return {
        chart: {
            padding: {
                left: 24,
            },
            backgroundColor: isDarkMode.value ? '#1A1A1A' : '#FAFAFA',
            color: isDarkMode.value ? '#CD9077' : '#1A1A1A',
            grid: {
                showHorizontalLines: false,
                stroke: isDarkMode.value ? '#CD9077' : '#E1E5E8',
                frame: {
                    show: false,
                    stroke: isDarkMode.value ? '#CD9077' : '#E1E5E8',
                },
                labels: {
                    color: isDarkMode.value ? '#CD9077' : '#1A1A1A',
                    fontSize: 24,
                    xAxisLabels: {
                        show: true,
                        values: xAxisLabels.value,
                        showOnlyAtModulo: 7,
                        color: isDarkMode.value ? '#CD9077' : '#1A1A1A',
                        fontSize: 20
                    },
                }
            },
            highlighter: {
                color: isDarkMode.value ? '#CD9077' : '#1A1A1A',
                useLine: true
            },
            legend: { show: false },
            title: {
                textAlign: 'left',
                paddingLeft: 24,
                color: isDarkMode.value ? '#559AD3' : '#1A1A1A',
                text: 'Daily downloads',
                subtitle: {
                    text: 'Last 120 days',
                    color: isDarkMode.value ? '#CD9077' : '#8A8A8A',
                }
            },
            tooltip: { show: false },
            userOptions: {
                buttons: {
                    labels: false,
                    pdf: false,
                    table: false,
                }
            },
            zoom: {
                highlightColor: '#559AD3',
                color: isDarkMode.value ? '#CD9077' : '#1A1A1A',
                focusOnDrag: true,
                minimap: { 
                    show: true,
                    selectedColor: '#559AD3',
                    indicatorColor: isDarkMode.value ? '#CD9077' : '#1A1A1A',
                },
                preview: {
                    fill: '#CD907720',
                    stroke: '#CD9077',
                    strokeDasharray: 4
                }
            }
        },
        line: {
            radius: 6,
            useGradient: false,
            dot: {
                useSerieColor: false,
                fill: '#1A1A1A',
                strokeWidth: 3,
            },
            tag: {
                followValue: true,
                formatter: ({ value, config }) => {
                    return `
                        <div style="display:flex;align-items:center;gap:4px">
                            <span style="font-variant-numeric: tabular-nums; display:flex;align-items:center;gap:4px;color: black">
                                <span style="font-size: 10px;">
                                    ${xAxisLabels.value[config.seriesIndex]}: 
                                </span>
                                <b>${value.toFixed(0)}</b>
                            </span>
                        </div>
                    `
                }
            },
        }
    }
})

onMounted(() => {
    fetch(url.value, {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    })
    .then((response) => {
        return response.json();
    })
    .then(json => {
        xAxisLabels.value = json.downloads.map(d => d.day).slice(-120, -1)
        data.value[0].series = json.downloads.map(d => d.downloads).slice(-120, -1)

        console.log(data.value)
    })
    .catch(err => {
        //
    })
    .finally(() => step.value += 1)
})

</script>

<template>
    <VueUiXy :dataset="data" :config="config" :key="step">
        <template #menuIcon="{ isOpen }">
            <VueUiIcon :name="isOpen ? 'close' : 'knobs'" :stroke="isDarkMode ? '#CD9077' : '#1A1A1A'"/>    
        </template>
    </VueUiXy>
</template>

<style>
.vue-data-ui-zoom {
    max-width: 450px;
    margin: 0 auto;
    margin-top: 12px;
}
.vue-data-ui-refresh-button {
    top: -8px !important;
    left: calc(100% + 36px) !important;
}
</style>