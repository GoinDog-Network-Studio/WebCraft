var appendValue = function (target, onChange = () => { }, value) {
    var input = document.createElement("input");
    input.setAttribute("type", "number")
    input.style.width = "50%"
    var units = document.createElement("select");
    units.style.width = "50%"
    supportedUnits.forEach(unit => {
        var unitName = unit['name'];
        var identify = unit['identify'];
        var opt = document.createElement("option");
        opt.innerText = unitName;
        opt.value = identify;
        if (value.indexOf(identify) != -1) {
            input.setAttribute("value", Number(value.replace(identify, "")))
            opt.selected = 'true';
        }
        units.appendChild(opt);
    })
    input.addEventListener("input", event => {
        if (input.value == "") {
            input.value = 0;
        }
        target.setAttribute("value", input.value + units.value)
        onChange(event)
    })
    target.appendChild(input)
    units.addEventListener("change", event => {
        target.setAttribute("value", input.value + units.value)
        onChange(event);
    })
    
    target.setAttribute("value", input.value + units.value)

    target.appendChild(units)
}
var supportedUnits = [
    {
        "name": "厘米",
        "identify": "cm"
    },
    {
        "name": "毫米",
        'identify': "mm"
    },
    {
        "name": "英寸",
        'identify': "in"
    },
    {
        "name": "磅",
        "identify": "pt"
    },
    {
        "name": "像素",
        "identify": "px"
    },
    {
        "name": "元素文字尺寸比",
        "identify": "em"
    },
    {
        "name": "页面文字尺寸比",
        "identify": "rem"
    },
    {
        "name": "页面高度比",
        "identify": "vh"
    },
    {
        "name": "页面宽度比",
        "identify": "vw"
    },
    {
        "name": "%(相对上级元素)",
        "identify": "%"
    }
]
var supportedStyle = [
    {
        "name": "背景颜色",
        "identify": "background-color",
        "parser": (value, changeToDo = () => { }) => {
            var element = document.createElement("input");
            element.type = 'color';
            element.setAttribute("value", value)
            element.classList.add("valueElement")
            element.addEventListener("input", () => {
                changeToDo(element.value)
            });
            return element
        },
        "defVal": "#ffffff"
    },
    {
        "name": "文字颜色",
        "identify": "color",
        "parser": (value, changeToDo = () => { }) => {
            var element = document.createElement("input");
            element.type = 'color';
            element.setAttribute("value", value)
            element.classList.add("valueElement")
            element.addEventListener("input", () => {
                changeToDo(element.value)
            })
            return element
        },
        "defVal": "#ffffff"
    },
    {
        "name": "字体大小",
        "identify": "font-size",
        "parser": (value = "", changeToDo = () => { }) => {
            var area = document.createElement("div")
            area.classList.add("attrValGroup");
            var input = document.createElement("input");
            input.setAttribute("type", "number")
            input.style.width = "50%"
            input.addEventListener("input", event => {
                area.setAttribute("value", input.value + units.value);
                changeToDo(area.getAttribute("value"))
                Draggable.onChange();
            })
            area.appendChild(input);
            var units = document.createElement("select");
            units.style.width = "50%"
            supportedUnits.forEach(unit => {
                var unitName = unit['name'];
                var identify = unit['identify'];
                var opt = document.createElement("option");
                opt.innerText = unitName;
                opt.value = identify;
                if (value.indexOf(identify) != -1) {
                    input.setAttribute("value", Number(value.replace(identify, "")))
                    opt.selected = 'true';
                }
                units.appendChild(opt);
            })
            units.addEventListener("change", event => {
                area.setAttribute("value", input.value + units.value);
                changeToDo(area.getAttribute("value"))
                Draggable.onChange();
            })
            area.appendChild(units);
            return area;
        },
        "defVal": "10px"
    },
    {
        "name": "边框圆角半径",
        "identify": "border-radius",
        "parser": (value = "", changeToDo = () => { }) => {
            var area = document.createElement("div")
            area.classList.add("attrValGroup");
            var settings_button = document.createElement("button");
            settings_button.addEventListener("click", (event) => {
                var WebCraftWindow = document.getElementsByClassName("WebCraft_PopWindow")[0];
                WebCraftWindow.innerHTML = `
                <div class="background"></div>
                <div class="window_area">
                    <h1>边框圆角  设置</h1>
                    <div class="center_area">
                        <div class="content">
                            <div class="target"></div>
                            <div id="leftTop" class="changing_area">
                    
                            </div>
                            <div id="leftBottom" class="changing_area">

                            </div>
                            <div id="rightTop" class="changing_area">

                            </div>
                            <div id="rightBottom" class="changing_area">

                            </div>
                        </div>
                    </div>
                    <p id="tips">Tips: 点击窗口外的区域（黑色遮罩）即可关闭此窗口</p>
                </div>
                `;
                
                let values = value.split(" ");
                WebCraftWindow.children[0].addEventListener("click", event => {
                    WebCraftWindow.style.display = 'none';
                })
                var leftTop = values[0];
                var leftBottom = values[1];
                var rightTop = values[2];
                var rightBottom = values[3];
                let radiusValue = `${leftTop} ${rightTop} ${rightBottom} ${leftBottom}`;
                var input_areas = WebCraftWindow.children[1].children[1].children[0].children;
                input_areas[0].style.borderRadius = radiusValue;
                for (let i = 0; i < input_areas.length; i++) {
                    let input_area = input_areas[i];
                    if (i != 0) {
                        appendValue(input_area, () => {
                            for (let i_ = 0; i_ < input_areas.length; i_++) {
                                const element = input_areas[i_];
                                switch (element.id) {
                                    case "leftTop":
                                        leftTop = element.getAttribute("value")
                                        break;
                                    case "leftBottom":
                                        leftBottom = element.getAttribute("value")
                                        break;
                                    case "rightTop":
                                        rightTop = element.getAttribute("value")
                                        break;
                                    case "rightBottom":
                                        rightBottom = element.getAttribute("value")
                                        break;
    
                                    default:
                                        break;
                                }
                            }
                            radiusValue = `${leftTop} ${rightTop} ${rightBottom} ${leftBottom}`;
                            input_areas[0].style.borderRadius = radiusValue;
                            changeToDo(radiusValue)
                        }, values[i-1])
                    }
                }
                WebCraftWindow.style.display = 'flex';
                WebCraftWindow.querySelector(".target").innerHTML = "";
            })

            settings_button.style.display = 'flex';
            settings_button.style.justifyContent = 'center';
            settings_button.style.alignItems = 'center';
            settings_button.style.background = 'none';
            settings_button.style.border = 'none';
            settings_button.innerHTML = `<img src='./src/images/settings.svg' style="height: 60%"/>`
            area.appendChild(settings_button);
            return area;
        },
        "defVal": "10px 10px 10px 10px"
    },
    {
        "name": "文本水平对齐方式",
        "identify": "text-align",
        "parser": (value, changeToDo = () => { }) => {
            var element = document.createElement("select");

            var options = [
                {
                    "name": "居左",
                    "identify": "left"
                },
                {
                    "name": "居中",
                    "identify": "center"
                },
                {
                    "name": "居右",
                    "identify": "right"
                },
                {
                    "name": "两端对齐",
                    "identify": "justify"
                }
            ];

            options.forEach(option => {
                var opt = document.createElement("option");
                opt.innerText = option['name'];
                opt.value = option['identify'];

                if (option['identify'] == value) {
                    opt.selected = 'true'
                }

                element.appendChild(opt);
            })

            element.onchange = () => {
                changeToDo(element.value)
            };

            return element;
        },
        "defVal": "left"
    },
    {
        "name": "文本效果（英文）",
        "identify": "text-transform",
        "parser": (value, changeToDo = () => { }) => {
            var select = document.createElement("select");

            var options = [
                {
                    "name": "全部大写",
                    "identify": "uppercase"
                },
                {
                    "name": "全部小写",
                    "identify": "lowercase"
                },
                {
                    "name": "每个单词首字母大写",
                    "identify": "capitalize"
                }
            ];

            options.forEach(option => {
                var opt = document.createElement("option");
                opt.innerText = option['name'];
                opt.value = option['identify'];

                if (option['identify'] == value) {
                    opt.selected = 'true'
                }

                select.appendChild(opt);
            })

            select.onchange = () => {
                changeToDo(select.value)
            };

            return select;
        },
        "defVal": "lowercase"
    },
    {
        "name": "宽度",
        "identify": "width",
        "parser": (value = "", changeToDo = () => { }) => {
            var area = document.createElement("div")
            area.classList.add("attrValGroup");

            var input = document.createElement("input");
            input.setAttribute("type", "number")
            input.style.width = "50%"

            input.addEventListener("input", event => {
                area.setAttribute("value", input.value + units.value);
                changeToDo(area.getAttribute("value"))
                Draggable.onChange();
            })
            area.appendChild(input);

            var units = document.createElement("select");
            units.style.width = "50%"
            supportedUnits.forEach(unit => {
                var unitName = unit['name'];
                var identify = unit['identify'];

                var opt = document.createElement("option");
                opt.innerText = unitName;
                opt.value = identify;

                if (value.indexOf(identify) != -1) {
                    input.setAttribute("value", Number(value.replace(identify, "")))
                    opt.selected = 'true';
                }

                units.appendChild(opt);
            })

            units.addEventListener("change", event => {
                area.setAttribute("value", input.value + units.value);
                changeToDo(area.getAttribute("value"))
                Draggable.onChange();
            })
            area.appendChild(units);

            return area;
        },
        "defVal": "10px"
    },
    {
        "name": "高度",
        "identify": "height",
        "parser": (value = "", changeToDo = () => { }) => {
            var area = document.createElement("div")
            area.classList.add("attrValGroup");

            var input = document.createElement("input");
            input.setAttribute("type", "number")
            input.style.width = "50%"

            input.addEventListener("input", event => {
                area.setAttribute("value", input.value + units.value);
                changeToDo(area.getAttribute("value"))
                Draggable.onChange();
            })
            area.appendChild(input);

            var units = document.createElement("select");
            units.style.width = "50%"
            supportedUnits.forEach(unit => {
                var unitName = unit['name'];
                var identify = unit['identify'];

                var opt = document.createElement("option");
                opt.innerText = unitName;
                opt.value = identify;

                if (value.indexOf(identify) != -1) {
                    input.setAttribute("value", Number(value.replace(identify, "")))
                    opt.selected = 'true';
                }

                units.appendChild(opt);
            })

            units.addEventListener("change", event => {
                area.setAttribute("value", input.value + units.value);
                changeToDo(area.getAttribute("value"))
                Draggable.onChange();
            })
            area.appendChild(units);

            return area;
        },
        "defVal": "10px"
    },
    {
        "name": "边框",
        "identify": "border",
        "defVal": "1px solid black",
        "parser": (value = "", changeToDo =() => {}) => {
            var area = document.createElement("div")
            var valueList = value.split(" ");
            area.classList.add("attrValGroup");
            var color_input = document.createElement("input");
            color_input.type = 'color';
            color_input.setAttribute("value", value)
            color_input.classList.add("valueElement")

            var select = document.createElement("select");

            var options = [
                {
                    "inner": "单实线",
                    "identify": "solid"
                },
                {
                    "inner": "点虚线",
                    "identify": "dotted"
                },
                {
                    "inner": "虚线",
                    "identify": "dashed"
                },
                {
                    "inner": "双实线",
                    "identify": "double"
                },
                {
                    "inner": "三维脊状",
                    "identify": "ridge"
                },
                {
                    "inner": "三维嵌入",
                    "identify": "inset"
                },
                {
                    "inner": "三维突出",
                    "identify": "outset"
                },
                {
                    "inner": "无边框",
                    "identify": "none"
                },
                {
                    "inner": "隐藏边框",
                    "identify": "hidden"
                }
            ];

            options.forEach(option => {
                var opt = document.createElement("option");
                opt.innerHTML = option['inner'];
                opt.value = option['identify'];

                if (option['identify'] == valueList[1]) {
                    opt.selected = 'true'
                }

                select.appendChild(opt);
            })

            select.onchange = () => {
                var current_value = area.getAttribute("value");
                let final_value = `${current_value} ${select.value} ${color_input.value}`;
                changeToDo(final_value)
            };

            appendValue(area, () => {
                var current_value = area.getAttribute("value");
                let final_value = `${current_value} ${select.value} ${color_input.value}`;
                changeToDo(final_value)
            }, valueList[0]);
            color_input.addEventListener("input", () => {
                var current_value = area.getAttribute("value");
                let final_value = `${current_value} ${select.value} ${color_input.value}`;
                changeToDo(final_value)
            })
            area.appendChild(select)
            area.appendChild(color_input)
            return area;
        }
    }
]
Draggable.registerAttributeType("stylesheet", (attr) => {
    var area = Draggable.appendArea();
    var label = Draggable.appendLabel(attr['label']);

    var title = document.createElement("div");
    title.classList.add("title_area")

    label.style.float = "left"
    title.appendChild(label);

    var add_btn = document.createElement("button");
    add_btn.innerText = "+"
    add_btn.classList.add("add_btn")

    var parse = (targetArea) => {
        targetArea.innerHTML = ""
        attr['value'].forEach(element => {
            var style_area = document.createElement("div");
            style_area.classList.add("sheetArea")
            var value_area = document.createElement("div");
            value_area.classList.add("valueArea")
            var del_btn = document.createElement("button");
            del_btn.innerText = "-"
            del_btn.classList.add("add_btn")
            del_btn.addEventListener("click", (event) => {
                var i = attr['value'].indexOf(element)
                attr['value'].splice(i, 1)

                parse(targetArea);
                Draggable.onChange()
            })

            var identifySelection = document.createElement("select");
            identifySelection.classList.add("identifySelection")
            identifySelection.onchange = (event) => {
                element['identify'] = identifySelection.value;
                supportedStyle.forEach(style => {
                    if (style['identify'] == element['identify']) {
                        element['value'] = style['defVal']
                    }
                })
                parse(targetArea);
                Draggable.onChange();
            }
            style_area.appendChild(identifySelection);
            style_area.appendChild(value_area);
            style_area.appendChild(del_btn)
            supportedStyle.forEach(elem_ => {
                var opt = document.createElement("option");
                opt.innerText = elem_['name']
                opt.value = elem_['identify']
                if (elem_['identify'] == element['identify']) {
                    opt.selected = true;
                    value_area.innerHTML = "";
                    var valueElement = elem_['parser'](element['value'], (value) => {
                        element['value'] = value;
                        Draggable.onChange();
                    });
                    valueElement.style.width = '100%';
                    valueElement.style.height = "100%"
                    value_area.appendChild(
                        valueElement
                    )
                }

                identifySelection.appendChild(opt);
            });
            targetArea.appendChild(style_area)
        });
    }

    area.appendChild(title);

    var sheetsArea = document.createElement("div");
    sheetsArea.classList.add("sheetsArea")

    area.appendChild(sheetsArea)
    add_btn.addEventListener("click", event => {
        if (attr['value'] == null) {
            attr['value'] = []
        }
        attr['value'].push(
            {
                "identify": "background-color",
                "value": "#ffffff"
            }
        )
        parse(sheetsArea);
    })
    title.appendChild(add_btn);
    parse(sheetsArea);

    return area;
})