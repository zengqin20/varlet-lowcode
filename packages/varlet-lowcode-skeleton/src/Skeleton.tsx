import type { ComputedRef, Ref } from 'vue'
import { defineComponent, ref, computed } from 'vue'
import { AppBar, Icon, Space } from '@varlet/ui'
import { pluginsManager } from '@varlet/lowcode-core'
import { SkeletonLayouts, SkeletonPlugin } from '@varlet/lowcode-core/src/modules/plugins'
import '@varlet/ui/es/app-bar/style/index.js'
import '@varlet/ui/es/icon/style/index.js'
import '@varlet/ui/es/space/style/index.js'
import './skeleton.less'

export default defineComponent({
  name: 'Skeleton',
  setup() {
    const plugins = pluginsManager.exportSkeletonPlugins()
    const sidebarPinned = ref(false)
    const sidebarComponentName: Ref<string | undefined> = ref()

    const toggleSidebarComponent = (name: string) => {
      sidebarComponentName.value = name === sidebarComponentName.value ? undefined : name
    }

    const sidebarComponent: ComputedRef<JSX.Element | null> = computed(() => {
      if (!sidebarComponentName.value) return null
      const _plugin = plugins.find((plugin) => plugin.name === sidebarComponentName.value)
      const RenderPlugin = _plugin!.component

      const RenderLabel: () => JSX.Element = () => {
        return (
          <Space justify='space-between'>
            {_plugin?.label && <div>{_plugin?.label}</div>}
            <Icon
              onClick={() => {
                sidebarPinned.value = !sidebarPinned.value
              }}
              name='pin-outline'
            ></Icon>
          </Space>
        )
      }

      return (
        <div
          class={`skeleton__sidebar-component ${sidebarPinned.value && 'skeleton__sidebar-component--pinned'}`}
        >
          <RenderLabel />
          <RenderPlugin />
        </div>
      )
    })

    const pickerComponents = (layout: SkeletonLayouts) => {
      const _plugins: SkeletonPlugin[] = plugins.filter((plugin) => plugin.layout === layout)

      if (!_plugins || _plugins.length === 0) {
        throw new Error(`${layout} is not a valid layout`)
      }

      if (layout.includes('header')) {
        return (
          <Space>
            {_plugins.map(({ component: Component }: SkeletonPlugin) => (
              <Component />
            ))}
          </Space>
        )
      }

      if (layout.includes('sidebar')) {
        return (
          <Space direction='column'>
            {_plugins.map(({ icon: iconName, name }: SkeletonPlugin) =>
              typeof iconName === 'string' ? (
                <Icon name={iconName} onClick={() => toggleSidebarComponent(name)} />
              ) : (
                <iconName onClick={() => toggleSidebarComponent(name)} />
              )
            )}
          </Space>
        )
      }

      return null
    }

    const RenderHeader: () => JSX.Element = () => {
      const Left = pickerComponents(SkeletonLayouts.HEADER_LEFT)
      const Center = pickerComponents(SkeletonLayouts.HEADER_CENTER)
      const Right = pickerComponents(SkeletonLayouts.HEADER_RIGHT)

      return (
        <AppBar title-position='center'>
          {{
            left: () => Left,
            default: () => Center,
            right: () => Right,
          }}
        </AppBar>
      )
    }

    const RenderContent: () => JSX.Element = () => {
      const Top = pickerComponents(SkeletonLayouts.SIDEBAR_TOP)
      const Bottom = pickerComponents(SkeletonLayouts.SIDEBAR_BOTTOM)

      return (
        <div class="skeleton__content">
          <div class="skeleton__sidebar">
            <Space direction="column" align="center" justify="space-between">
              {Top}
              {Bottom}
            </Space>
            {sidebarComponent.value}
          </div>
          <div class="drawing-board">drawing-board</div>
        </div>
      )
    }

    return () => {
      return (
        <div class="main">
          <div class="skeleton">
            <RenderHeader />
            <RenderContent />
          </div>
        </div>
      )
    }
  },
})
