import * as clipboard from '@/utils/clipboard'
import {Notification, MessageBox, Message} from 'element-ui'
import Clipboard from 'clipboard';

export default clipboard


export function clipboard(e, code) {
  const clipboard = new Clipboard(e.target, {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: () => code
  });
  clipboard.on('success', (e) => {
    clipboard.off('error');
    clipboard.off('success');
    clipboard.destroy()
    Message({
      message: '复制成功',
      type: 'success'
    });
  });
  clipboard.on('error', (e) => {
    console.log(e);
    clipboard.off('error');
    clipboard.off('success');
    clipboard.destroy()
    Message({
      message: '该浏览器不支持此方式复制',
      type: 'success'
    });
  });
  clipboard.onClick(e)
}
