/**
 * vue-shortkey
 * Key list https://github.com/iFgR/vue-shortkey#key-list
 */
const MAC_OS = {
  ZOOM: {
    label: '⌘ + 滚轮',
    key: 'metaKey'
  },
  UNDO: {
    label: '⌘ Z',
    key: ['meta', 'z']
  },
  REDO: {
    label: '⌘ ⇧ Z',
    key: ['meta', 'shift', 'z']
  },
  EDIT: {
    label: '编辑单品，⌘ E',
    key: ['meta', 'e']
  },
  DELETE: {
    label: '删除，⌘ Backspace',
    key: ['meta', 'backspace']
  },
  CLONE: {
    label: '复制，⌘ D',
    key: ['meta', 'd']
  },
  FLIP_X: {
    label: '水平翻转，⌘ M',
    key: ['meta', 'm']
  },
  LAYER_UP: {
    label: '⌘ ↑',
    key: ['meta', 'arrowup']
  },
  LAYER_DOWN: {
    label: '⌘ ↓',
    key: ['meta', 'arrowdown']
  },
  LAYER_TOP: {
    label: '⌘ ⇧ ↑',
    key: ['meta', 'shift', 'arrowup']
  },
  LAYER_BOTTOM: {
    label: '⌘ ⇧ ↓',
    key: ['meta', 'shift', 'arrowdown']
  }
}

const WINDOWS_AND_LINUX = {
  ZOOM: {
    label: 'ctrl + 滚轮',
    key: 'ctrlKey'
  },
  UNDO: {
    label: 'Ctrl + Z',
    key: ['ctrl', 'z']
  },
  REDO: {
    label: 'Ctrl + Shift + Z',
    key: ['ctrl', 'shift', 'z']
  },
  EDIT: {
    label: '编辑单品，Ctrl + E',
    key: ['ctrl', 'e']
  },
  DELETE: {
    label: '删除，Ctrl + Backspace',
    key: ['ctrl', 'backspace']
  },
  CLONE: {
    label: '复制，Ctrl + D',
    key: ['ctrl', 'd']
  },
  FLIP_X: {
    label: '水平翻转，Ctrl + M',
    key: ['ctrl', 'm']
  },
  LAYER_UP: {
    label: 'Ctrl + ↑',
    key: ['ctrl', 'arrowup']
  },
  LAYER_DOWN: {
    label: 'Ctrl + ↓',
    key: ['ctrl', 'arrowdown']
  },
  LAYER_TOP: {
    label: 'Ctrl + Shift + ↑',
    key: ['ctrl', 'shift', 'arrowup']
  },
  LAYER_BOTTOM: {
    label: 'Ctrl + Shift + ↓',
    key: ['ctrl', 'shift', 'arrowdown']
  }
}

/**
 * 获得当前操作系统快捷键列表
 * 支持 MacOS, Windows, Linux
 */
function localization () {
  if (window.navigator.platform.includes('Mac')) {
    return MAC_OS
  }

  return WINDOWS_AND_LINUX
}

export default localization()
