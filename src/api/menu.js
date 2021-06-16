import {
  post,
  get
} from '@/utils/request';

const BASE = '/menu'
export const menuTree = () => {
  return post(BASE + '/menuTree')
}
