<template>
    <div ref="wrapperRef" :class="['relative w-full overflow-visible', wrapperClass]">
        <label v-if="label" :for="inputId" :class="['block mb-1', labelClass]">
            {{ label }}
        </label>

        <component :is="isTextarea ? 'textarea' : 'input'" :id="inputId" ref="inputRef" v-model="model" v-bind="$attrs"
            :style="{ fontSize }" :class="['w-full border p-2 rounded', inputClass]" @input="handleInput"
            @paste="handlePaste" />

        <div class="absolute inset-0 pointer-events-none">
            <span v-for="b in bubbles" :key="b.id" :class="['bubble', bubbleClass]" :style="{
                top: b.y + 'px',
                left: b.x + 'px',
                animationDuration: duration + 'ms',
                color: b.color,
                fontSize,
            }">
                {{ b.char }}
            </span>
        </div>

        <div ref="mirrorRef" class="invisible-mirror"></div>
    </div>
</template>

<script setup>
import { ref, reactive, nextTick, onBeforeUnmount } from 'vue';

const props = defineProps({
    animationOffsetY: { type: Number, default: 60 },
    bubbleClass: { type: String, default: '' },
    bubbleOffset: { type: Number, default: 40 },
    color: { type: String, default: '#000' },
    duration: { type: Number, default: 800 },
    fontSize: { type: String, default: '16px' },
    ignoredKeys: { type: Array, default: () => [] },
    inputClass: { type: String, default: '' },
    inputClass: { type: String, default: '' },
    isTextarea: { type: Boolean, default: false },
    label: { type: String, default: '' },
    labelClass: { type: String, default: '' },
    rainbow: { type: Boolean, default: false },
    wrapperClass: { type: String, default: '' },
});

const wrapperRef = ref(null)
const model = defineModel({ type: String, default: '' });
const inputRef = ref(null);
const mirrorRef = ref(null);
const bubbles = reactive([]);
const removalTimers = new Map();
let nextId = 0;

const animOffsetY = ref((-props.animationOffsetY) + 'px')

function createUid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

const inputId = ref(createUid());

async function handleInput(e) {
    await nextTick();

    const el = inputRef.value;
    const char = e.data;

    if (!char || char.length !== 1 || props.ignoredKeys.includes(char)) {
        updateMirror(el, mirrorRef.value);
        return
    }

    updateMirror(el, mirrorRef.value);

    const caretSpan = mirrorRef.value.querySelector('#caret');
    const caretRect = caretSpan.getBoundingClientRect();

    const wrapperRect = wrapperRef.value.getBoundingClientRect()
    const x = caretRect.left - wrapperRect.left
    const y = caretRect.top - wrapperRect.top

    const id = nextId += 1;

    let color = props.color;

    if (props.rainbow) {
        color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    }

    bubbles.push({ id, char, x, y, color });

    const timer = setTimeout(() => {
        const idx = bubbles.findIndex(b => b.id === id);
        if (idx !== -1) bubbles.splice(idx, 1);
        removalTimers.delete(id);
    }, props.duration);

    removalTimers.set(id, timer);
}

async function handlePaste(e) {
    const pasted = e.clipboardData.getData('text')
    if (!pasted) return

    await nextTick()

    const el = inputRef.value
    const mirror = mirrorRef.value
    const val = el.value
    const end = el.selectionStart
    const start = end - pasted.length

    const style = getComputedStyle(el)
    mirror.style.boxSizing = style.boxSizing
    mirror.style.width = style.width
    mirror.style.height = style.height
    mirror.style.overflow = style.overflow
    mirror.style.overflowWrap = style.overflowWrap || 'normal'
    mirror.style.wordBreak = style.wordBreak || 'normal'
    mirror.style.padding = style.padding
    mirror.style.border = style.border
    mirror.style.font = style.font
    mirror.style.lineHeight = style.lineHeight
    mirror.style.whiteSpace = style.whiteSpace
    mirror.style.position = 'absolute'
    mirror.style.top = el.offsetTop + 'px'
    mirror.style.left = el.offsetLeft + 'px'
    mirror.style.wordWrap = style.whiteSpace === 'pre-wrap' ? 'break-word' : 'normal'

    const before = val.slice(0, start).replace(/\n$/, '\n\u200b')
    const inserted = Array.from(val.slice(start, end))
        .map((c, i) => `<span class="paste-char" data-index="${i}">${c}</span>`)
        .join('')
    const after = val.slice(end)
    mirror.innerHTML = before + inserted + '<span id="caret">\u200b</span>' + after

    // 3) sync scroll
    mirror.scrollTop = el.scrollTop
    mirror.scrollLeft = el.scrollLeft

    const wrapperRect = wrapperRef.value.getBoundingClientRect()
    mirror.querySelectorAll('.paste-char').forEach(span => {
        const idx = +span.dataset.index
        const rect = span.getBoundingClientRect()
        const x = rect.left - wrapperRect.left
        const y = rect.top - wrapperRect.top

        const id = ++nextId
        let color = props.color
        if (props.rainbow) {
            color = `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)})`
        }
        bubbles.push({ id, char: span.textContent, x, y, color })

        const t = setTimeout(() => {
            const i = bubbles.findIndex(b => b.id === id)
            if (i !== -1) bubbles.splice(i, 1)
            removalTimers.delete(id)
        }, props.duration)
        removalTimers.set(id, t)
    })

    await nextTick()
    updateMirror(el, mirror)
}

onBeforeUnmount(() => {
    for (const t of removalTimers.values()) {
        clearTimeout(t);
    }
    removalTimers.clear();
})

function updateMirror(el, mirror) {
    const style = getComputedStyle(el);
    const val = el.value;
    const pos = el.selectionStart;

    mirror.style.boxSizing = style.boxSizing;
    mirror.style.width = style.width;
    mirror.style.height = style.height;
    mirror.style.overflow = style.overflow;
    mirror.style.overflowWrap = style.overflowWrap || 'normal';
    mirror.style.wordBreak = style.wordBreak || 'normal';
    mirror.style.padding = style.padding;
    mirror.style.border = style.border;
    mirror.style.position = 'absolute';
    mirror.style.top = el.offsetTop + 'px';
    mirror.style.left = el.offsetLeft + 'px';
    mirror.style.font = style.font;
    mirror.style.lineHeight = style.lineHeight;
    mirror.style.whiteSpace = style.whiteSpace;
    mirror.style.wordWrap = style.whiteSpace === 'pre-wrap' ? 'break-word' : 'normal';

    const before = val.slice(0, pos).replace(/\n$/, '\n\u200b');
    const after = val.slice(pos);
    mirror.innerHTML = before + '<span id="caret">\u200b</span>' + after;
    mirror.scrollTop = el.scrollTop;
    mirror.scrollLeft = el.scrollLeft;
}
</script>

<style scoped>
.bubble {
    position: absolute;
    opacity: 1;
    animation-name: floatUp;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
    pointer-events: none;
    user-select: none;
    white-space: pre;
}

@keyframes floatUp {
    from {
        transform: translateY(0);
        opacity: 1;
    }

    to {
        transform: translateY(v-bind(animOffsetY));
        opacity: 0;
    }
}

.invisible-mirror {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
}
</style>
