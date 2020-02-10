export default {
    type: "CombinedFilter",
    title: "抽屉",
    isContainer: true,
    wrap: true,
    props: {
      visible: true,
      title: "标题",
      width: 500,
    },
    config: {
      title: {
        text: "标题"
      },
      width: {
        text: "宽度"
      }
    }
  }