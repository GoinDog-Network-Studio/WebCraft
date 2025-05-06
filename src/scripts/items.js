Draggable.Items['title'] = {
    label: "标题",
    attribute: [
        {
            "type": "choice",
            'id': "tag",
            "label": "类型",
            "choices": [
                {
                    "label": "一级",
                    "value": "h1"
                },
                {
                    "label": "二级",
                    "value": "h2"
                },
                {
                    "label": "三级",
                    "value": "h3"
                },
                {
                    "label": "四级",
                    "value": "h4"
                },
                {
                    "label": "五级",
                    "value": "h5"
                },
                {
                    "label": "六级",
                    "value": "h6"
                }
            ],
            "value": "h1"
        },
        {
            "type": "text",
            'value': "Hello, WebCraft!",
            "label": "文本",
            "id": "innerText"
        },
        {
            "type": "stylesheet",
            "label": "样式(CSS)",
            "id": "css",
            "value": []
        }
    ]
}
Draggable.Items['p'] = {
    label: "文本段落",
    attribute: [
        {
            "type": "text",
            'value': "Hello, WebCraft!",
            "label": "文本",
            "id": "innerText"
        },
        {
            "type": "stylesheet",
            "label": "样式(CSS)",
            "id": "css",
            "value": []
        }
    ]
}
Draggable.Items['button'] = {
    label: "按钮",
    attribute: [
        {
            "type": "text",
            "value": 'Click Here',
            "label": "文本",
            "id": "innerText"
        },
        {
            "type": "stylesheet",
            "label": "样式(CSS)",
            "id": "css",
            "value": []
        }
    ]
}
Draggable.Items['input'] = {
    label: "输入框",
    attribute: [
        {
            "type": "text",
            "value": 'Input here!',
            "label": "提示语",
            "id": "placeholder"
        },
        {
            "type": "text",
            "value": 'Hello, Input!',
            "label": "默认值",
            "id": "value"
        },
        {
            "type": "stylesheet",
            "label": "样式(CSS)",
            "id": "css",
            "value": []
        },{
            "type": "choice",
            'id': "category",
            "label": "类型",
            "choices": [
                {
                    "label": "文本",
                    "value": "text"
                },
                {
                    "label": "时间（年月日时分秒 UTC）",
                    "value": "datetime"
                },
                {
                    "label": "时间（年月日时分秒）",
                    "value": "datetime-local"
                },
                {
                    "label": "日期（年月日）",
                    "value": "date"
                },
                {
                    "label": "日期（年月）",
                    "value": "month"
                },
                {
                    "label": "时间（时分秒）",
                    "value": "time"
                },
                {
                    "label": "数字",
                    "value": "number"
                },
                {
                    "label": "颜色",
                    "value": "color"
                },
                {
                    "label": "密码",
                    "value": "password"
                }
            ],
            "value": "text"
        }
    ]
}