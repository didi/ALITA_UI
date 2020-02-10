export default {
    "type": "Brand",
    "title": "广告位",
    "props": {
        "style": {
            "span": [6, 6, 6, 6],
            "backgroundImage": [
                'linear-gradient(rgb(253, 141, 0), rgb(255, 164, 29))',
                'linear-gradient(rgb(71, 176, 75), rgb(83, 206, 86))',
                'linear-gradient(rgb(253, 141, 0), rgb(255, 164, 29))',
                'linear-gradient(rgb(71, 176, 75), rgb(83, 206, 86))'
            ],
            minHeight: 20,
            padding: "20px",
            height: 200
        },
        "asyncData": "brands"
    },
    "config": {
        "asyncData": {
            "text": "异步数据",
            enum: [
                'brands'
            ]
        },

    }
}