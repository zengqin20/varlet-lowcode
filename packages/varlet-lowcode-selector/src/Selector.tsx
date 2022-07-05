import { eventsManager } from '@varlet/lowcode-core'
import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref } from 'vue'
import PluginRender from './PluginRender'

export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    const initStyle: CSSProperties = {
      border: '2px solid red',
      boxSizing: 'border-box',
      position: 'absolute',
      pointerEvents: 'none',
    }
    const selectorStyles: Ref<CSSProperties[] | undefined> = ref([])

    function computedSelectorStyles(id: string) {
      const nodes = document.querySelectorAll(`#${id}`)

      if (nodes && nodes.length > 0) {
        const _nodes = Array.from(nodes)
        selectorStyles.value = _nodes.map((node: Element) => {
          const { top, left, width, height } = node.getBoundingClientRect()
          const _style: CSSProperties = {
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`,
          }
          return { ..._style, ...initStyle }
        })
      }
    }

    onMounted(() => {
      eventsManager.on('schema-click', computedSelectorStyles)
    })

    onUnmounted(() => {
      eventsManager.off('schema-click', computedSelectorStyles)
    })

    return () => {
      return (
        selectorStyles.value &&
        selectorStyles.value.map((style: CSSProperties, i: number) => {
          return (
            <div key={Symbol(style.toString())} style={style}>
              {style && i === selectorStyles.value!.length - 1 && <PluginRender />}
            </div>
          )
        })
      )
    }
  },
})
