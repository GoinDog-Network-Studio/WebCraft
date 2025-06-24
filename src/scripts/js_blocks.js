function defineJSBlocks(workspace) {
    const jsForBlock = Object.create(null);
    const Order = javascript.Order;

    var tag_elements = []
    Object.keys(Draggable.Items).forEach(item => {
        if (item == 'title') {
            tag_elements.push(['一级标题', 'h1'])
            tag_elements.push(['二级标题', 'h2'])
            tag_elements.push(['三级标题', 'h3'])
            tag_elements.push(['四级标题', 'h4'])
            tag_elements.push(['五级标题', 'h5'])
            tag_elements.push(['六级标题', 'h6'])
        } else {
            tag_elements.push([Draggable.Items[item].label, item])
        }
    })
    tag_elements.push(['其他', 'others'])
    const reservedWords = [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'let', 'yield', 'static', 'await', 'enum', 'implements', 'interface', 'package', 'private', 'protected', 'public', 'abstract', 'boolean', 'byte', 'char', 'final', 'float', 'goto', 'int', 'long', 'native', 'short', 'synchronized', 'throws', 'transient', 'volatile', 'arguments', 'as', 'async', 'eval', 'from', 'get', 'of', 'set'
    ]

    const element = {
        init: function () {
            var type = new Blockly.FieldDropdown([
                ["ID", 'ById'],
                ['CSS样式类', 'sByClassName'],
                ['标签名称', 'sByTagName']
            ]);

            type.setValidator(newValue => {
                if (newValue == "sByTagName") {
                    var tags = new Blockly.FieldDropdown(tag_elements);
                    tags.setValidator(newValue => {
                        if (newValue == 'others') {
                            if (!this.getField("TAG_NAME")) this.getInput("ROOT").appendField(new Blockly.FieldTextInput(), "TAG_NAME")
                        } else {
                            if (!!this.getField("TAG_NAME")) this.getInput("ROOT").removeField("TAG_NAME")
                        }
                    })
                    if (!!this.getField("elements")) this.getInput("ROOT").removeField("elements")
                    if (!this.getField("elements")) this.getInput("ROOT").appendField(tags, 'elements')
                    this.setOutput(true, 'Array');
                } else if (newValue == 'sByClassName') {
                    if (!!this.getField("TAG_NAME")) this.getInput("ROOT").removeField("TAG_NAME")
                    this.setOutput(true, 'Array');
                } else {
                    if (!!this.getField("TAG_NAME")) this.getInput("ROOT").removeField("TAG_NAME")
                    if (!!this.getField("elements")) this.getInput("ROOT").removeField("elements")
                    if (!this.getField("elements")) this.getInput("ROOT").appendField(new Blockly.FieldTextInput(), 'elements')
                    this.setOutput(true, 'dom_element');
                }
                this.setTooltip(`根据元素${this.getField("type").selectedOption[0]}获取页面上的一个元素`);
                this.setHelpUrl(`https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElement${newValue}`);
            })
            this.appendDummyInput('ROOT')
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField("根据元素")
                .appendField(type, "type")
                .appendField("获取元素")
                .appendField(new Blockly.FieldTextInput(), 'elements');
            this.setOutput(true, 'dom_element');
            this.setColour(90);
        }
    };
    const create_element = {
        init: function () {
            var tags = new Blockly.FieldDropdown(tag_elements);
            tags.setValidator(newValue => {
                if (newValue == 'others') {
                    if (!this.getField("TAG_NAME")) this.getInput("ROOT").appendField(new Blockly.FieldTextInput(), "TAG_NAME")
                } else {
                    if (!!this.getField("TAG_NAME")) this.getInput("ROOT").removeField("TAG_NAME")
                }
            })
            this.appendDummyInput("ROOT")
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField('创建元素')
                .appendField(tags, 'tag');
            this.setOutput(true, 'dom_element');
            this.setTooltip('用于创建一个由标签名称指定的 HTML 元素');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createElement');
            this.setColour(90);
        }
    };
    const add_to_ = {
        init: function () {
            this.jsonInit({
                'mutator': 'add_to_mutator_'
            })
            this.elementCount_ = 1;
            this.updateShape_()
            this.setInputsInline(true)
            this.setPreviousStatement(true, null)
            this.setNextStatement(true, null)
            this.setTooltip('在目标元素的最后一个子节点之后插入一组源元素');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Element/append');
            this.setColour(90);
        },

        updateShape_: function () {
            if (this.getInput("target")) {
                this.removeInput("target")
            }
            for (var i = 0; i < this.elementCount_; i++) {
                if (!this.getInput("source_" + i)) {
                    const source = this.appendValueInput('source_' + i).setCheck('dom_element')
                    if (i === 0) source.appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' })).appendField('将 源元素');
                }
            }
            this.appendValueInput('target')
                .setCheck('dom_element')
                .appendField('加入到 目标元素');

            for (let i = this.elementCount_; this.getInput('source_' + i); i++) {
                this.removeInput('source_' + i);
            }
        }
    };

    const element_create_with_container = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField("源元素");
            this.setNextStatement(true, null)
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(90);
        }
    }

    const element_create_with_item = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField("源元素");
            this.setPreviousStatement(true, null)
            this.setNextStatement(true, null)
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(90);
        }
    }

    const assignment = {
        init: function () {
            this.appendValueInput("source")
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .setCheck("String")
                .appendField("将");
            this.appendValueInput("target")
                .setCheck("String")
                .appendField("设置为");
            this.setColour(90);
            this.setTooltip("用于设置指定元素上的某个属性值");
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
        }
    }

    const attribute = {
        init: function () {
            this.setOutput(true, "String");
            this.appendValueInput('target')
                .setCheck("dom_element");
            this.appendDummyInput()
                .appendField("的数据")
                .appendField(new Blockly.FieldTextInput("data"), 'name');
            this.setInputsInline(true)
            this.setTooltip('返回元素上一个指定的属性值');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getAttribute');
            this.setColour(90);
        },
    };

    var styles = [];
    styles.push(['样式表(全部属性)', 'all'])
    supportedStyle.forEach(style => {
        const name = style['name'];
        let identify = style['identify'];
        if (identify.indexOf("-") != -1) {
            const target = identify.substring(
                identify.indexOf("-") + 1,
                identify.indexOf("-") + 2
            );
            identify = identify.replace("-" + target, target.toUpperCase())
        }
        styles.push([name, identify])
    })

    const style = {
        init: function () {
            var dropdown = new Blockly.FieldDropdown(styles);
            this.appendValueInput('target')
                .setCheck("dom_element");
            this.appendDummyInput()
                .appendField("的CSS样式")
                .appendField(dropdown, 'name');
            dropdown.setValidator((newValue) => {
                switch (newValue) {
                    case 'all':
                        this.setOutput(true, "Array");
                        break;
                    default:
                        this.setOutput(true, "String");
                        break;
                }
            })
            this.setOutput(true, "String");
            this.setInputsInline(true)
            this.setTooltip('以对象的形式返回元素的内联样式，该对象包含该元素的所有样式属性列表');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/style');
            this.setColour(90);
        },
    };
    const inner = {
        init: function () {
            var dropdown = new Blockly.FieldDropdown([
                ['HTML代码', 'HTML'],
                ['文本', 'Text']
            ]);
            dropdown.setValidator((newValue) => {
                switch (newValue) {
                    case "HTML":
                        this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML');
                        break;

                    case "Text":
                        this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/innerText');
                        break;

                    default:
                        break;
                }
            })
            this.setOutput(true, "String");
            this.appendValueInput('target')
                .setCheck("dom_element");
            this.appendDummyInput()
                .appendField("的内部")
                .appendField(dropdown, 'type');
            this.setInputsInline(true)
            this.setTooltip('获取 HTML 语法表示的元素的后代 或 一个节点及其后代所渲染文本的内容');
            this.setColour(90);
        }
    }
    const addEventListener = {
        init: function () {
            this.appendValueInput('target')
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .setCheck('dom_element')
                .appendField('当')
                .appendField('目标');
            this.appendDummyInput()
                .appendField('被')
                .appendField(new Blockly.FieldDropdown([
                    ['鼠标点击', 'click'],
                    ['鼠标右键点击', 'contextmenu'],
                    ['鼠标双击', 'dblclick'],
                    ['开始拖拽', 'dragstart'],
                    ['拖拽过程', 'drag'],
                    ['结束拖拽', 'dragend'],
                    ['拖拽元素进入', 'dragenter'],
                    ['拖拽元素悬在上方', 'dragover'],
                    ['拖拽元素离开', 'dragleave'],
                    ['拖拽元素放置', 'drop']
                ]), 'event_name')
                .appendField('时');
            this.appendStatementInput('event_content')
                .appendField("执行");
            this.setInputsInline(true)
            this.setTooltip('将指定的监听器注册到 目标元素 上，当 目标元素 触发指定的事件时，指定的回调函数就会被执行。');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener');
            this.setColour(90);
        }
    };
    const event_cancelable = {
        init: function () {
            this.jsonInit({
                'extensions': ["EVENT_BLOCK_IN_EVENT_DEFINITION_CHECK"]
            })
            this.appendDummyInput('')
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField('事件可被取消');
            this.setInputsInline(true)
            this.setOutput(true, 'Boolean');
            this.setTooltip('表明该事件是否可以被取消，即事件是否可以像从未发生一样被阻止');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Event/cancelable');
            this.setColour(90);
        }
    };
    const event_isTrusted = {
        init: function () {
            this.jsonInit({
                'extensions': ["EVENT_BLOCK_IN_EVENT_DEFINITION_CHECK"]
            })
            this.appendDummyInput('')
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField('事件由用户触发');
            this.setInputsInline(true)
            this.setOutput(true, 'Boolean');
            this.setTooltip('表示事件是否由用户行为生成');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Event/isTrusted');
            this.setColour(90);
        }
    };

    const event_defaultPrevented = {
        init: function () {
            this.jsonInit({
                'extensions': ["EVENT_BLOCK_IN_EVENT_DEFINITION_CHECK"]
            })
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField('事件已被取消');
            this.setInputsInline(true)
            this.setOutput(true, 'Boolean');
            this.setTooltip('表明当前事件是否调用了“取消事件默认处理方式”方法');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Event/defaultPrevented');
            this.setColour(90);
        }
    };
    const event_type = {
        init: function () {
            this.jsonInit({
                'extensions': ["EVENT_BLOCK_IN_EVENT_DEFINITION_CHECK"]
            })
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField('事件类型');
            this.setInputsInline(true)
            this.setOutput(true, 'String');
            this.setTooltip('表示该事件对象的事件类型。该名称在构造事件时设置，通常用于指代特定事件');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Event/type');
            this.setColour(90);
        }
    };
    const event_target = {
        init: function () {
            this.jsonInit({
                'extensions': ["EVENT_BLOCK_IN_EVENT_DEFINITION_CHECK"]
            })
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField('触发事件的元素');
            this.setInputsInline(true)
            this.setOutput(true, 'dom_element');
            this.setTooltip('事件处理器在事件的冒泡或捕获阶段被调用时，对事件被分派到的对象的引用');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target');
            this.setColour(90);
        }
    }
    const event_preventDefault = {
        init: function () {
            this.jsonInit({
                'extensions': ["EVENT_BLOCK_IN_EVENT_DEFINITION_CHECK"]
            })
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField('取消事件默认处理方式');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('阻止浏览器默认的事件处理器执行');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault');
            this.setColour(90);
        }
    };
    jsForBlock['create_element'] = function (block, generator) {
        var tag = block.getFieldValue("tag");
        if (tag == 'others') {
            tag = block.getFieldValue("TAG_NAME");
        }
        return [`document.createElement("${tag}")`, Order.ATOMIC];
    }

    jsForBlock['element'] = function (block, generator) {
        const id = block.getFieldValue("elements");
        var attribute;
        if (id == 'others') {
            attribute = block.getFieldValue("TAG_NAME")
        } else {
            attribute = id
        }
        return [`document.getElement${block.getFieldValue("type")}("${attribute}")`, Order.ATOMIC];
    }

    jsForBlock['add_to_'] = function (block, generator) {
        var value_source = "";
        var split
        for (let i = 0; i < this.elementCount_; i++) {
            i === 0 ? split = "" : split = ", ";
            value_source += split + generator.valueToCode(block, `source_${i}`, Order.ATOMIC)
        }

        const value_target = generator.valueToCode(block, 'target', Order.ATOMIC);

        const code = `${value_target}.append(${value_source});\n`;
        return code;
    }

    jsForBlock['attribute'] = function (block, generator) {
        return [`${generator.valueToCode(block, 'target', Order.NONE)}.getAttribute("data-${block.getFieldValue("name")}");\n`, Order.ATOMIC]
    }
    jsForBlock['style'] = function (block, generator) {
        var code = `${generator.valueToCode(block, 'target', Order.ATOMIC)}.style`;
        block.getFieldValue("name") === 'all' ? code += '' : code += `.${block.getFieldValue("name")}`
        return [code, Order.ATOMIC]
    }
    jsForBlock['inner'] = function (block, generator) {
        return [`${generator.valueToCode(block, 'target', Order.ATOMIC)}.inner${block.getFieldValue("type")}`, Order.ATOMIC]
    }
    jsForBlock['assignment'] = function (block, generator) {
        var code;
        if (this.getInputTargetBlock("source").type == 'attribute') {
            code = `${generator.valueToCode(this.getInputTargetBlock("source"), 'target', Order.NONE)}.setAttribute("data-${block.getFieldValue("name")}", ${generator.valueToCode(block, 'target', Order.NONE)});\n`
            block.setHelpUrl("https://developer.mozilla.org/zh-CN/docs/Web/API/Element/setAttribute");
        } else {
            code = `${generator.valueToCode(block, 'source', Order.NONE)} = ${generator.valueToCode(block, 'target', Order.NONE)};\n`;
            block.setHelpUrl("");
        }
        return code;
    }
    jsForBlock['addEventListener'] = function (block, generator) {
        return `${generator.valueToCode(block, 'target', Order.NONE)}.on${block.getFieldValue("event_name")} = function(event) {${generator.statementToCode(block, 'event_content', Order.NONE)}};\n`;
    }
    jsForBlock['event_cancelable'] = function (block, generator) {
        return ['event.cancelable', Order.ATOMIC]
    }
    jsForBlock['event_isTrusted'] = function (block, generator) {
        return ['event.isTrusted', Order.ATOMIC]
    }
    jsForBlock['event_defaultPrevented'] = function (block, generator) {
        return ['event.defaultPrevented', Order.ATOMIC]
    }
    jsForBlock['event_type'] = function (block, generator) {
        return ['event.type', Order.ATOMIC]
    }
    jsForBlock['event_target'] = function (block, generator) {
        return ['event.target', Order.ATOMIC]
    }
    jsForBlock['event_preventDefault'] = function (block, generator) {
        return 'event.preventDefault();\n'
    }



    const alert = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage('../src/images/window.svg', 20, 20, { alt: 'Browser API', flipRtl: 'FALSE' }))
                .appendField('浏览器弹出对话窗口');
            this.appendValueInput('message')
                .appendField('内容');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('令浏览器显示一个带有可选的信息的对话框，并等待用户离开该对话框');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Window/alert');
            this.setColour(120);
        }
    };

    const confirm = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage('../src/images/window.svg', 20, 20, { alt: '*', flipRtl: 'FALSE' }))
                .appendField('浏览器弹出确认窗口');
            this.appendValueInput('message')
                .appendField('内容');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('令浏览器显示一个带有可选的信息的对话框，并等待用户离开该对话框');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Window/alert');
            this.setColour(120);
        }
    };


    jsForBlock['alert'] = function (block, generator) {
        const value_message = generator.valueToCode(block, 'message', Order.NONE);

        const code = `alert(${value_message});\n`;
        return code;
    }

    jsForBlock['confirm'] = function (block, generator) {
        const value_message = generator.valueToCode(block, 'message', Order.NONE);

        const code = `confirm(${value_message});\n`;
        return code;
    }

    const location_info = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage('../src/images/window.svg', 20, 20, { alt: '*', flipRtl: 'FALSE' }))
                .appendField('获取当前页面的')
                .appendField(new Blockly.FieldDropdown([
                    ['网址', 'href'],
                    ['传输协议', 'protocol'],
                    ['URL参数', 'search'],
                    ['URL标识符', 'hash']
                ]), 'info');
            this.setOutput(true, 'String');
            this.setTooltip('返回有关文档当前位置的信息');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Window/location');
            this.setColour(120);
        }
    };

    const location_assign = {
        init: function () {
            this.appendValueInput('url')
                .appendField(new Blockly.FieldImage('../src/images/window.svg', 20, 20, { alt: '*', flipRtl: 'FALSE' }))
                .setCheck('String')
                .appendField('使当前网页跳转到');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('触发窗口加载并显示指定的 URL 的内容');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Location/assign');
            this.setColour(120);
        }
    };

    const location_reload = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage('../src/images/window.svg', 20, 20, { alt: '*', flipRtl: 'FALSE' }))
                .appendField('重新加载页面');
            this.appendDummyInput()
                .appendField(new Blockly.FieldCheckbox('TRUE'), 'forceGet')
                .appendField('同时清除缓存');
            this.setInputsInline(false)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('重载当前 URL，就像刷新按钮一样');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Location/reload');
            this.setColour(120);
        }
    };

    const localStorage_getItem = {
        init: function () {
            this.appendValueInput('keyName')
                .appendField(new Blockly.FieldImage('../src/images/window.svg', 20, 20, { alt: '*', flipRtl: 'FALSE' }))
                .setCheck('String')
                .appendField('页面数据');
            this.setInputsInline(true)
            this.setOutput(true, 'String');
            this.setTooltip('当传递一个键名时，将返回该键的值');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Storage/getItem');
            this.setColour(120);
        }
    };
    const localStorage_setItem = {
        init: function () {
            this.appendValueInput('keyName')
                .appendField(new Blockly.FieldImage('../src/images/window.svg', 20, 20, { alt: '*', flipRtl: 'FALSE' }))
                .setCheck('String')
                .appendField('设置');
            this.appendValueInput('keyValue')
                .appendField('为');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null)
            this.setTooltip('当传递一个键名时，将返回该键的值');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Storage/setItem');
            this.setColour(120);
        }
    };

    const localStorage_removeItem = {
        init: function () {
            this.appendValueInput('keyName')
                .appendField(new Blockly.FieldImage('../src/images/window.svg', 20, 20, { alt: '*', flipRtl: 'FALSE' }))
                .setCheck('String')
                .appendField('删除');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('当传递一个数据名名时，将从页面数据库中删除此数据');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Storage/removeItem');
            this.setColour(120);
        }
    };

    const FUNCTION_DEFINITION = {
        destroy: function () {
            for (const key in this.workspace['functions']) {
                if (Object.prototype.hasOwnProperty.call(this.workspace['functions'], key)) {
                    const function_ = this.workspace['functions'][key];
                    if (function_['name'] == this.id) {
                        delete this.workspace['functions'][key]
                        break;
                    }
                }
            }
        },
        init: function () {
            this.jsonInit({
                mutator: "function_param_mutator_"
            })
            var textInput = new Blockly.FieldTextInput('做点什么');
            textInput.setValidator((newVal) => {
                if (reservedWords.indexOf(newVal) != -1) {
                    return null;
                }
            })
            this.appendDummyInput()
                .appendField('定义函数')
                .appendField(textInput, 'NAME');
            this.appendStatementInput('blocks');
            this.setInputsInline(true)
            this.setTooltip('它允许你在一个代码块中存储一段用于处理单任务的代码，然后在任何你需要的时候用一个简短的命令来调用，而不是把相同的代码写很多次');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Scripting/Build_your_own_function');
            this.setColour(290);
            this.updateShape_();
            this.onchange = function (event) {
                this.updateShape_();
            }
        },
        updateShape_: function (block) {
            if (!!block && !!block.params) {
                for (var i = 0; i < block.params.length; i++) {
                    if (!block.getInput("param_" + i)) {
                        var source = block.appendValueInput('param_' + i);
                        source.setCheck("FUNCTION_PARAM_SOURCE")
                        if (i === 0) source.appendField("参数：");
                        var paramBlock = block.workspace.newBlock("FUNCTION_PARAM_INPUT_IN_DEF");
                        paramBlock.setFieldValue(block.params[i]['name'], "NAME");
                        paramBlock.setDragStrategy(new CopyDraggable(paramBlock))
                        paramBlock.initSvg();
                        paramBlock.setOutput(true, "FUNCTION_PARAM_SOURCE")
                        paramBlock.setMovable(false);
                        var function_id = "";
                        for (const key in block.workspace['functions']) {
                            if (Object.prototype.hasOwnProperty.call(block.workspace['functions'], key)) {
                                const function_ = block.workspace['functions'][key];
                                if (function_['name'] == block.id) {
                                    function_id = key;
                                    break;
                                }
                            }
                        }
                        paramBlock.data = {
                            key: function_id,
                            index: i
                        };
                        block.getInput("param_" + i).connection.connect(paramBlock.outputConnection);
                    }
                }
                for (let i = block.params.length; block.getInput('param_' + i); i++) {
                    if (block.getInputTargetBlock("param_" + i) != null) block.getInputTargetBlock("param_" + i).dispose();
                    block.removeInput('param_' + i);
                }
            }
        }
    };

    const FUNCTION_PARAM_CONTAINER = {
        init: function () {
            this.appendDummyInput()
                .appendField('参数');
            this.appendStatementInput("params");
            this.setInputsInline(true)
            this.setColour(290);
        }
    };
    const FUNCTION_PARAM = {
        init: function () {
            var paramName = new Blockly.FieldTextInput('x');
            paramName.setValidator((newValue) => {
                if (this.getSurroundParent() != null) {
                    var func_key = this.getSurroundParent().data;
                    var func = js_workspace['functions'][func_key];
                    if (func['params'].indexOf(newValue) != -1) {
                        return null;
                    }
                }
            })
            if (this.data == null) {
                this.data = false
            }
            this.appendDummyInput('')
                .appendField('参数')
                .appendField(paramName, 'NAME');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(290);
        }
    };
    const FUNCTION_RETURN = {
        init: function () {
            this.appendValueInput('value')
                .appendField('返回')
            this.jsonInit({
                'extensions': ["FUNCTION_RETURN_IN_CORRECT_FUNCTION_BODY_CHECK_MIXIN"]
            })
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setColour(290);
        }
    };
    const FUNCTION_PARAM_INPUT_IN_DEF = {
        init: function () {
            this.appendDummyInput('')
                .appendField("a", 'NAME');
            this.setInputsInline(true)
            this.setOutput(true);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(290);
        },
    };
    const FUNCTION_PARAM_INPUT = {
        init: function () {
            this.appendDummyInput('')
                .appendField("a", 'NAME');
            this.setInputsInline(true)
            this.setOutput(true);
            this.jsonInit({
                'extensions': ["FUNCTION_PARAM_INPUT_IN_CORRECT_FUNCTION_BODY_CHECK_MIXIN"]
            })
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(290);
        },
    };

    const FUNCTION_CALL = {
        init: function () {
            this.jsonInit({
                "mutator": "FUNCTION_CALL_EXTRASTATE"
            })
            this.appendDummyInput("NAME")
                .appendField("function", "func_name");;
            this.setInputsInline(true)
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(290);
        },
        updateShape_: (block, func_id) => {
            block.setFieldValue(js_workspace['functions'][func_id]['field_name'], "func_name")
            var hasReturn = !!js_workspace['functions'][func_id]['hasReturn'];
            var returnType = js_workspace['functions'][func_id]['returnType'];
            if (hasReturn) {
                block.setOutput(true, returnType)
                block.setPreviousStatement(false);
                block.setNextStatement(false);
            } else {
                block.setOutput(false)
                block.setPreviousStatement(true);
                block.setNextStatement(true);
            }

            for (let i = 0; i < block.inputCount_; i++) {
                if (!block.getInput("input_" + i)) {
                    block.appendValueInput("input_" + i);
                }
            }
            for (let i = block.inputCount_; block.getInput("input_" + i); i++) {
                block.removeInput("input_" + i);
            }
        }
    }

    jsForBlock['location_info'] = function (block, generator) {
        const dropdown_info = block.getFieldValue('info');
        const code = `window.location.${dropdown_info}`;
        return [code, Order.NONE];
    }

    jsForBlock['location_assign'] = function (block, generator) {
        const value_url = generator.valueToCode(block, 'url', Order.ATOMIC);
        const code = `window.location.assign(${value_url});\n`;
        return code;
    }
    jsForBlock['location_reload'] = function (block, generator) {
        const checkbox_forceget = block.getFieldValue('forceGet');

        const code = `window.location.reload(${checkbox_forceget});\n`;
        return code;
    }
    jsForBlock['localStorage_getItem'] = function (block, generator) {
        const value_keyname = generator.valueToCode(block, 'keyName', Order.NONE);

        const code = `window.localStorage.getItem("${value_keyname}")`;
        return [code, Order.NONE];
    }
    jsForBlock['localStorage_setItem'] = function (block, generator) {
        const value_keyname = generator.valueToCode(block, 'keyName', Order.NONE);

        const value_keyvalue = generator.valueToCode(block, 'keyValue', Order.NONE);

        var code = "";
        if (block.getInputTargetBlock("keyName").type == 'localStorage_getItem') {
            code = `window.localStorage.setItem(${generator.valueToCode(block.getInputTargetBlock("keyName"), 'keyName', Order.NONE)}, ${value_keyvalue});\n`;
        } else {
            code = `window.localStorage.setItem(${value_keyname}, ${value_keyvalue});\n`;
        }
        return code;
    }
    jsForBlock['localStorage_removeItem'] = function (block, generator) {
        const value_keyname = generator.valueToCode(block, 'keyName', Order.ATOMIC);
        var code;
        if (block.getInputTargetBlock("keyName").type == 'localStorage_getItem') {
            code = `window.localStorage.removeItem(${generator.valueToCode(block.getInputTargetBlock("keyName"), 'keyName', Order.NONE)});\n`;
        } else {
            code = `window.localStorage.removeItem(${value_keyname});\n`;
        }
        return code;
    }
    jsForBlock['FUNCTION_DEFINITION'] = function (block, generator) {
        var params = ``;
        if (this.params != null) {
            for (let i = 0; i < this.params.length; i++) {
                const param = generator.valueToCode(block, "param_" + i, Order.NONE);
                params += i == 0 ? param : "," + param;
            }
        }
        return `function ${block.getFieldValue("NAME")}(${params}) {\n${generator.statementToCode(block, "blocks", Order.NONE)}};\n`;
    }
    jsForBlock['FUNCTION_PARAM_INPUT'] = function (block, generator) {
        return [block.getFieldValue("NAME"), Order.NONE]
    }
    jsForBlock['FUNCTION_PARAM_INPUT_IN_DEF'] = function (block, generator) {
        return [block.getFieldValue("NAME"), Order.NONE]
    }
    jsForBlock['FUNCTION_CALL'] = function (block, generator) {
        var parameters = "";
        for (let i = 0; i < this.inputCount_.length; i++) {
            if (i != 0) parameters += ", ";
            parameters += !!block.getInputTargetBlock("input_" + i) ? generator.valueToCode(block, "input_" + i, Order.NONE) : "null"
        }
        var code = `${block.getFieldValue("func_name")}(${parameters})`;
        if (!!this.workspace['functions'][block.func_id]['hasReturn'] == false) return code + ";\n"
        else return [code, Order.NONE];
    }
    jsForBlock['FUNCTION_RETURN'] = function (block, generator) {
        var returnVal = !!block.getInputTargetBlock("value") ? generator.valueToCode(block, "value", Order.NONE) : "";
        return `return ${returnVal};;\n`
    }

    const CONSOLE_MSG = {
        init: function () {
            this.jsonInit({
                mutator: "CONSOLE_MSG_MUTATOR_"
            })
            this.appendDummyInput()
                .appendField('在控制台以')
                .appendField(new Blockly.FieldDropdown([
                    ['信息', 'info'],
                    ['日志', 'log'],
                    ['调试', 'debug'],
                    ['警告', 'warn'],
                    ['报错', 'error']
                ]), 'OPTIONS')
                .appendField("权重打印")
            this.appendValueInput("MSG0")
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(15);
        },
        updateShape_: function () {
            for (let i = 0; i < this.msgCount; i++) {
                if (!this.getInput("MSG" + i)) {
                    this.appendValueInput("MSG" + i)
                }
            }
            for (let i = this.msgCount; this.getInput('MSG' + i); i++) {
                this.removeInput('MSG' + i);
            }
        }
    };
    const CONSOLE_MSG_MUTATOR_TOP = {
        init: function () {
            this.appendDummyInput('')
                .appendField('信息');
            this.setInputsInline(true)
            this.setNextStatement(true)
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(15);
        }
    };
    const CONSOLE_MSG_MUTATOR_ITEM = {
        init: function () {
            this.appendDummyInput('')
                .appendField('信息');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(15);
        }
    };
    const CONSOLE_PRINT_OBJECT_ = {
        init: function () {
            this.appendValueInput('MSG')
                .appendField('在控制台打印')
                .appendField(new Blockly.FieldDropdown([
                    ['列表', 'table'],
                    ['JSON对象', 'dir'],
                    ['标签结构', 'dirxml']
                ]), 'TYPE');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(15);
        }
    };
    const OBJECT_CREATE = {
        init: function () {
            this.jsonInit({
                "mutator": "OBJECT_CREATE_MUTATOR_"
            })
            this.appendDummyInput('TEXT')
                .appendField('创建空对象');
            this.setOutput(true, 'JsonObject')
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(45);
            this.updateShape_()
        },
        updateShape_: function () {
            if (this.itemCount == 0 || this.itemCount == null) {
                if (!this.getInput("TEXT")) this.appendDummyInput('TEXT').appendField('创建空对象');
            } else {
                if (!!this.getInput("TEXT")) this.removeInput("TEXT")
                for (let i = 0; i < this.itemCount; i++) {
                    if (!this.getInput("OBJ" + i)) {
                        var input_ = this.appendValueInput("OBJ" + i)
                            .setCheck('JsonObject_KeyAndValue')
                            .setAlign(Blockly.inputs.Align.RIGHT);
                        if (i == 0) input_.appendField('创建对象，内容：');
                    }
                }
            }
            for (let i = this.itemCount; this.getInput('OBJ' + i); i++) {
                this.removeInput('OBJ' + i);
            }
        }
    };

    const OBJECT_CREATE_MUTATOR_CONTAINER = {
        init: function () {
            this.appendDummyInput()
                .appendField('对象');
            this.appendStatementInput('CONTAINER')
            this.setInputsInline(true)
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(45);
        }
    };
    const OBJECT_CREATE_MUTATOR_ITEM = {
        init: function () {
            this.appendDummyInput('')
                .appendField('项目');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(45);
        }
    };
    const OBJECT_KEY_AND_VALUE = {
        init: function () {
            this.appendDummyInput("K0")
                .appendField("属性名：")
                .appendField(new Blockly.FieldTextInput('key'), 'KEY0')
            this.appendValueInput('VALUE0')
                .appendField('值：');
            this.setOutput(true, 'JsonObject_KeyAndValue');
            this.setInputsInline(true)
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(45);
        }
    };

    const OBJECT_KEYS = {
        init: function () {
            this.appendValueInput('OBJ')
                .setCheck('JsonObject');
            this.appendDummyInput()
                .appendField('的属性列表');
            this.setInputsInline(true)
            this.setOutput(true, 'Array')
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(45);
        }
    };
    const OBJECT_GET = {
        init: function () {
            this.appendValueInput('OBJ')
                .setCheck('JsonObject')
                .appendField('对象');
            this.appendDummyInput('')
                .appendField('的')
                .appendField(new Blockly.FieldTextInput('key'), 'KEY')
                .appendField('属性');
            this.setInputsInline(true)
            this.setOutput(true)
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(45);
        }
    };
    const OBJECT_SET = {
        init: function () {
            this.appendValueInput('OBJ')
                .setCheck('JsonObject')
                .appendField('设置对象');
            this.appendValueInput('TARGET')
                .appendField('的')
                .appendField(new Blockly.FieldTextInput('key'), 'KEY')
                .appendField('属性为');
            this.setInputsInline(true)
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setTooltip('');
            this.setHelpUrl('');
            this.setColour(45);
        }
    };

    jsForBlock['CONSOLE_MSG'] = function (block, generator) {
        var msg = '';
        for (let i = 0; i < block.msgCount; i++) {
            msg += i == 0 ? generator.valueToCode(block, `MSG${i}`, Order.NONE) : ", " + generator.valueToCode(block, `MSG${i}`, Order.NONE)
        }
        return `console.${block.getFieldValue("OPTION")}(${msg});\n`;
    }
    jsForBlock['CONSOLE_PRINT_OBJECT_'] = function (block, generator) {
        var msg = generator.valueToCode(block, `MSG`, Order.NONE)
        return `console.${block.getFieldValue("TYPE")}(${msg});\n`;
    }
    jsForBlock['OBJECT_CREATE'] = function (block, generator) {
        var content = '';
        for (let i = 0; i < block.itemCount; i++) {
            i == 0 ? content += generator.valueToCode(block, `OBJ${i}`, Order.NONE) : content += ",\n" + generator.valueToCode(block, `OBJ${i}`, Order.NONE)
        }
        return [`{\n${content}}`, Order.NONE]
    }
    jsForBlock['OBJECT_KEY_AND_VALUE'] = function (block, generator) {
        const text_key = block.getFieldValue('KEY');
        const value_value = generator.valueToCode(block, 'VALUE', javascript.Order.ATOMIC);

        const code = `"${text_key}": ${value_value}`;
        return [code, Order.NONE];
    }
    jsForBlock['OBJECT_KEYS'] = function (block, generator) {
        return [`Object.keys(${generator.valueToCode(block, "OBJ", Order.NONE)})`, Order.NONE]
    }
    jsForBlock['OBJECT_GET'] = function (block, generator) {
        return [`${generator.valueToCode(block, "OBJ", Order.NONE)}.${block.getFieldValue("KEY")}`, Order.NONE]
    }
    jsForBlock['OBJECT_SET'] = function (block, generator) {
        return `${generator.valueToCode(block, "OBJ", Order.NONE)}.${block.getFieldValue("KEY")} = ${generator.valueToCode(block, "TARGET", Order.NONE)}`
    }

    Blockly.common.defineBlocks(
        {
            add_to_: add_to_,
            create_element: create_element,
            element: element,
            element_create_with_item: element_create_with_item,
            element_create_with_container: element_create_with_container,
            attribute: attribute,
            style: style,
            inner: inner,
            assignment: assignment,
            addEventListener: addEventListener,
            event_cancelable: event_cancelable,
            event_isTrusted: event_isTrusted,
            event_defaultPrevented: event_defaultPrevented,
            event_type: event_type,
            event_target: event_target,
            event_preventDefault: event_preventDefault,
            alert: alert,
            confirm: confirm,
            location_info: location_info,
            location_assign: location_assign,
            location_reload: location_reload,
            localStorage_getItem: localStorage_getItem,
            localStorage_setItem: localStorage_setItem,
            localStorage_removeItem: localStorage_removeItem,
            FUNCTION_DEFINITION: FUNCTION_DEFINITION,
            FUNCTION_PARAM: FUNCTION_PARAM,
            FUNCTION_PARAM_CONTAINER: FUNCTION_PARAM_CONTAINER,
            FUNCTION_PARAM_INPUT_IN_DEF: FUNCTION_PARAM_INPUT_IN_DEF,
            FUNCTION_PARAM_INPUT: FUNCTION_PARAM_INPUT,
            FUNCTION_CALL: FUNCTION_CALL,
            FUNCTION_RETURN: FUNCTION_RETURN,
            CONSOLE_MSG: CONSOLE_MSG,
            CONSOLE_MSG_MUTATOR_TOP: CONSOLE_MSG_MUTATOR_TOP,
            CONSOLE_MSG_MUTATOR_ITEM: CONSOLE_MSG_MUTATOR_ITEM,
            CONSOLE_PRINT_OBJECT_: CONSOLE_PRINT_OBJECT_,
            OBJECT_CREATE: OBJECT_CREATE,
            OBJECT_CREATE_MUTATOR_CONTAINER: OBJECT_CREATE_MUTATOR_CONTAINER,
            OBJECT_CREATE_MUTATOR_ITEM: OBJECT_CREATE_MUTATOR_ITEM,
            OBJECT_KEY_AND_VALUE: OBJECT_KEY_AND_VALUE,
            OBJECT_KEYS: OBJECT_KEYS,
            OBJECT_GET: OBJECT_GET,
            OBJECT_SET: OBJECT_SET,
        }
    )
    Object.assign(javascript.javascriptGenerator.forBlock, jsForBlock)
}

const add_to_mutator_ = {

    // These are the serialization hooks for the lists_create_with block.
    saveExtraState: function () {
        return {
            'elementCount': this.elementCount_,
        };
    },

    loadExtraState: function (state) {
        this.elementCount_ = state['elementCount'];
    },

    decompose: function (workspace) {
        var topBlock = workspace.newBlock("element_create_with_container");
        topBlock.initSvg();

        var connection = topBlock.nextConnection;
        for (let i = 0; i < this.elementCount_ - 1; i++) {
            var itemBlock = workspace.newBlock("element_create_with_item");
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }

        return topBlock;
    },

    compose: function (topBlock) {
        var itemBlock = topBlock.nextConnection.targetBlock();
        var connections = [];
        while (itemBlock) {
            if (itemBlock.isInsertionMarker()) {
                itemBlock = itemBlock.getNextBlock()
                continue;
            }
            connections.push(itemBlock.nextConnection);
            itemBlock = itemBlock.getNextBlock();
        }

        this.elementCount_ = connections.length + 1;
        if (this.elementCount_ === 0) {
            this.elementCount_ = 1;
        }
        this.updateShape_();
    }
}
Blockly.Extensions.registerMutator("add_to_mutator_", add_to_mutator_, null, ["element_create_with_item"]);

const function_param_mutator_ = {

    // These are the serialization hooks for the lists_create_with block.
    saveExtraState: function () {
        return {
            'params': this.params,
        };
    },

    loadExtraState: function (state) {
        this.params = state['params'];
        this.updateShape_(this);
    },

    decompose: function (workspace) {
        if (this.params == null) {
            this.params = []
        }
        var topBlock = workspace.newBlock("FUNCTION_PARAM_CONTAINER");
        for (const key in js_workspace['functions']) {
            var function_ = js_workspace['functions'][key];
            if (function_.name == this.id) topBlock.data = key;
        }
        topBlock.initSvg();

        var connection = topBlock.getInput("params").connection;

        for (let i = 0; i < this.params.length; i++) {
            var itemBlock = workspace.newBlock("FUNCTION_PARAM");
            var name = this.params[i]['name'];
            itemBlock.setFieldValue(name, "NAME")

            itemBlock.initSvg();
            itemBlock.onchange = () => {
                this.params[i]['name'] = itemBlock.getFieldValue("NAME")
            }
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }

        return topBlock;
    },

    compose: function (topBlock) {
        var itemBlock = topBlock.getInput("params").connection.targetBlock();

        var connections = [];

        while (itemBlock) {
            if (itemBlock.isInsertionMarker()) {
                itemBlock = itemBlock.getNextBlock()
                continue;
            }
            connections.push(itemBlock.nextConnection);
            itemBlock = itemBlock.getNextBlock();
        }
        this.params = [];
        connections.forEach(connection => {
            let param = {
                name: connection.sourceBlock_.getFieldValue("NAME")
            }
            this.params.push(param)
        })
        this.updateShape_(this);
        for (let i = 0; i < this.params.length; i++) {
            this.getInputTargetBlock("param_" + i).dispose();
            var paramBlock = this.workspace.newBlock("FUNCTION_PARAM_INPUT_IN_DEF");
            paramBlock.setFieldValue(this.params[i]['name'], "NAME");
            paramBlock.setDragStrategy(new CopyDraggable(paramBlock))
            paramBlock.initSvg();
            paramBlock.setOutput(true, "FUNCTION_PARAM_SOURCE")
            paramBlock.setMovable(false);
            var function_id = "";
            for (const key in this.workspace['functions']) {
                if (Object.prototype.hasOwnProperty.call(this.workspace['functions'], key)) {
                    const function_ = this.workspace['functions'][key];
                    if (function_['name'] == this.id) {
                        function_id = key;
                        break;
                    }
                }
            }
            paramBlock.data = {
                key: function_id,
                index: i
            };
            this.getInput("param_" + i).connection.connect(paramBlock.outputConnection);
        }
    }
}
Blockly.Extensions.registerMutator("function_param_mutator_", function_param_mutator_, null, ["FUNCTION_PARAM"]);
const FUNCTION_CALL_EXTRASTATE = {

    // These are the serialization hooks for the lists_create_with block.
    saveExtraState: function () {
        return {
            'func_id': this.func_id,
            'inputCount_': this.inputCount_,
            'hasReturn': this.hasReturn
        };
    },

    loadExtraState: function (state) {
        this.func_id = state['func_id']
        this.inputCount_ = state['inputCount_'];
        this.hasReturn = state['hasReturn']

        this.updateShape_(this, this.func_id)
    }
}
Blockly.Extensions.registerMutator(
    "FUNCTION_CALL_EXTRASTATE",
    FUNCTION_CALL_EXTRASTATE,
    null,
    null
)

const CONSOLE_MSG_MUTATOR_ = {

    // These are the serialization hooks for the lists_create_with block.
    saveExtraState: function () {
        return {
            'msgCount': this.msgCount,
        };
    },

    loadExtraState: function (state) {
        this.msgCount = state['msgCount'];
        this.updateShape_();
    },

    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('msgCount', this.msgCount);
        return container;
    },

    domToMutation: function (xmlElement) {
        this.msgCount = parseInt(xmlElement.getAttribute('msgCount'), 10);
        this.updateShape_();
    },

    decompose: function (workspace) {
        var topBlock = workspace.newBlock("CONSOLE_MSG_MUTATOR_TOP");
        topBlock.initSvg();

        var connection = topBlock.nextConnection;
        for (let i = 0; i < this.msgCount - 1; i++) {
            var itemBlock = workspace.newBlock("CONSOLE_MSG_MUTATOR_ITEM");
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }

        return topBlock;
    },

    compose: function (topBlock) {
        var itemBlock = topBlock.nextConnection.targetBlock();
        var connections = [];
        while (itemBlock) {
            if (itemBlock.isInsertionMarker()) {
                itemBlock = itemBlock.getNextBlock()
                continue;
            }
            connections.push(itemBlock.nextConnection);
            itemBlock = itemBlock.getNextBlock();
        }

        this.msgCount = connections.length + 1;
        if (this.msgCount === 0) {
            this.msgCount = 1;
        }
        this.updateShape_();
    }
}
Blockly.Extensions.registerMutator("CONSOLE_MSG_MUTATOR_", CONSOLE_MSG_MUTATOR_, null, ["CONSOLE_MSG_MUTATOR_ITEM"]);

const OBJECT_CREATE_MUTATOR_ = {

    // These are the serialization hooks for the lists_create_with block.
    saveExtraState: function () {
        return {
            'itemCount': this.itemCount,
        };
    },

    loadExtraState: function (state) {
        this.itemCount = state['itemCount'];
        this.updateShape_();
    },

    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('itemCount', this.itemCount);
        return container;
    },

    domToMutation: function (xmlElement) {
        this.itemCount = parseInt(xmlElement.getAttribute('itemCount'), 10);
        this.updateShape_();
    },

    decompose: function (workspace) {
        var topBlock = workspace.newBlock("OBJECT_CREATE_MUTATOR_CONTAINER");
        topBlock.initSvg();

        var connection = topBlock.getInput("CONTAINER").connection;
        for (let i = 0; i < this.itemCount; i++) {
            var itemBlock = workspace.newBlock("OBJECT_CREATE_MUTATOR_ITEM");
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }

        return topBlock;
    },

    compose: function (topBlock) {
        var itemBlock = topBlock.getInputTargetBlock("CONTAINER");
        var connections = [];
        while (itemBlock) {
            if (itemBlock.isInsertionMarker()) {
                itemBlock = itemBlock.getNextBlock()
                continue;
            }
            connections.push(itemBlock.nextConnection);
            itemBlock = itemBlock.getNextBlock();
        }

        this.itemCount = connections.length;
        this.updateShape_();
    }
}
Blockly.Extensions.registerMutator("OBJECT_CREATE_MUTATOR_", OBJECT_CREATE_MUTATOR_, null, ["OBJECT_CREATE_MUTATOR_ITEM"]);