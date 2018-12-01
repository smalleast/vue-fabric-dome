/**
 * 全局事件常量, 用于跨多级组件的事件传递
 * https://github.com/jser-club/vue-event-proxy
 *
 * @author Hooks Zhang
 */
const prefix = 'global:'

export default {
  // 保存
  SAVE: `${prefix}SAVE`,
  // 保存并退出
  SAVE_AND_EXIT: `${prefix}SAVE_AND_EXIT`,
  // 放弃此次编辑
  GIVE_UP: `${prefix}GIVE_UP`,
  // 撤销
  UNDO: `${prefix}UNDO`,
  // 重做
  REDO: `${prefix}REDO`,
  // 改变画布状态树
  CHANGE_CANVAS_STATE: `${prefix}CHANGE_CANVAS_STATE`,
  // 分享
  SHARE: `${prefix}SHARE`,
  // 导出
  EXPORT: `${prefix}EXPORT`,
  // 添加素材到画布
  ADD_TO_CANVAS: `${prefix}ADD_TO_CANVAS`,
  // 选中画布中某一元素
  SELECTION: `${prefix}SELECTION`,
  // 折叠或展开侧边栏
  FOLD_OR_UNFLOD_ASIDE: `${prefix}FOLD_OR_UNFLOD_ASIDE`,
  // 更新拼图属性
  UPDATE_BOARD_PROPERTY: `${prefix}PUT_BOARD`,
  // 获取拼图信息
  GET_BOARD: `${prefix}GET_BOARD`,
  // 修改画布比例
  CHANGE_CANVAS_RATIO: `${prefix}CHANGE_CANVAS_RATIO`,
  // 加载画布数据
  LOAD_CANVAS_DATA: `${prefix}LOAD_CANVAS_DATA`,
  // 打开添加到收藏对话框
  OPEN_DIALOG_ADD_TO_FAVORITES: `${prefix}OPEN_DIALOG_ADD_TO_FAVORITES`,
  // 刷新收藏的单品
  REFRESH_FAVORITE_PRODUCT: `${prefix}REFRESH_FAVORITE_PRODUCT`,
  // 打开编辑产品对话框
  OPEN_DIALOG_EDIT_PRODUCT: `${prefix}OPEN_DIALOG_EDIT_PRODUCT`,
  // 获得画布中的产品列表
  GET_CANVAS_PRODUCT_LIST: `${prefix}GET_CANVAS_PRODUCT_LIST`,
  // 刷新我的设计
  REFRESH_DESIGNS: `${prefix}REFRESH_DESIGNS`,
  // 打开选择产品规格对话框
  OPEN_DIALOG_SELECT_SPEC: `${prefix}OPEN_DIALOG_SELECT_SPEC`,
  // 打开拼图表单对话框
  OPEN_DIALOG_BOARD_FORM: `${prefix}OPEN_DIALOG_BOARD_FORM`,
  // 获得当前正在编辑的拼图数据
  GET_CURRENT_BOARD_DATA: `${prefix}GET_CURRENT_BOARD_DATA`
}
