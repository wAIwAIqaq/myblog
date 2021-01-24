import Vue from 'vue';
import { Icon, Button, Message, Notification, MessageBox } from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.use(Icon)
Vue.use(Button)
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
Vue.prototype.$confirm = MessageBox.confirm
Vue.component(CollapseTransition.name, CollapseTransition)