export default {
    "type": "MapEngine",
    "title": "地图组件",
    "props": {
        "assist": {
            title: '区块辅助',
            header: '区块筛选辅助工具',
            content: ""
        },
        asyncData: "mapEngine"
    },
    "config": {
        "asyncData": {
            "text": "异步数据",
            enum: [
                'mapEngine'
            ]
        },
    }
}