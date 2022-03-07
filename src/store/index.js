import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框的内容
    inputValue: 'aaa',
    // 下一个 id
    nextId: 5,
    // 视图关键字
    viewKey: 'all'
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    // 为 store 中的 inputValue 赋值
    setInputValue(state, val) {
      state.inputValue = val
    },
    // 添加列表项
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据 id 删除列表项
    removeItem(state, id) {
      // 方法一  filter() 过滤
      // state.list = state.list.filter((item) => item.id !== id)
      // 方法二
      // 1. 根据 id 查找对应项索引
      const i = state.list.findIndex((x) => x.id === id)
      // 2. 根据索引删除对应项
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 修改列表项的选中状态
    changeStatus(state, params) {
      // 1.根据 id 查找对应项索引
      const i = state.list.findIndex((x) => x.id === params.id)
      // 2.根据索引修改对应项选中状态
      if (i !== -1) {
        state.list[i].done = params.status
      }
    },
    // 清除已完成的任务
    cleanDone(state) {
      state.list = state.list.filter((x) => x.done === false)
    },
    // 修改视图的关键字
    changeViewKey(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList(context) {
      axios.get('/list.json').then(({ data }) => {
        console.log(data)
        context.commit('initList', data)
      })
    }
  },
  getters: {
    unDoneLength(state) {
      return state.list.filter((x) => x.done === false).length
    },
    infolist(state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter((x) => !x.done)
      }
      if (state.viewKey === 'done') {
        return state.list.filter((x) => x.done)
      }
      return state.list
    }
  }
})
