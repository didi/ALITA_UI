export default {
  type: "div",
  title: "通用布局块",
  isNativeDom: true,
  isContainer: true,
  props: {
    style: {
      minHeight: 520,
      padding: "20px",
      overflow: 'auto'
    }
  },
  config: {
    style: {
      padding: {
        text: "内间距",
        type: "boundary"
      },
      margin: {
        text: "外边距",
        type: "boundary"
      },
      backgroundColor: {
        text: "背景色",
        type: "color"
      },
    }

  }
}