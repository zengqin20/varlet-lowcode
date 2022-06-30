import { defineComponent , ref } from 'vue'
import './index.less'
import HeaderPath from '../playground/settersPlugins/headerPath.vue'
import HeaderTabs from '../playground/settersPlugins/headerTabs.vue'
import Empty from './empty'

const isDom = ref(false)

isDom.value = true
export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    return () => {
      return (
        <div class="varlet-lowcode-setters">
          <div class="varlet-lowcode-setters-content">
            {isDom.value ? <HeaderPath /> : null}
            {isDom.value ? <HeaderTabs /> : null}
            {isDom.value ? null : <Empty />}
          </div>
        </div>
      )
    }
  },
})
