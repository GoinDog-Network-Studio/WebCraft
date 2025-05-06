
function defineJSBlocks(workspace) {
    var elements = [
        ['空', 'empty']
    ]

    if (workspace.structure.length != 0) {
        elements = []
        for (let i = 0; i < workspace.structure.length; i++) {
            var element_ = workspace.structure[i];
            if (element_ != null) {
                var label = element_.label;
                var id = `WebCraft_i-${i}`
                elements.push([label, id]);
            }
        }
        if (elements.length == 0) {
            elements = [
                ['空', 'empty']
            ]
        }
    }

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

    const element = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField("元素")
                .appendField(new Blockly.FieldDropdown(elements), 'elements');
            this.setOutput(true, 'dom_element');
            this.setTooltip('获取页面上的一个元素');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementById');
            this.setColour(90);
        }
    };
    const create_element = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField('创建元素')
                .appendField(new Blockly.FieldDropdown(tag_elements), 'tag');
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
                    ['鼠标双击', 'dblclick']
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
            this.appendDummyInput()
                .appendField(new Blockly.FieldImage("../src/images/filetype-html.svg", 20, 20, { alt: 'HTML API', flipRtl: 'FALSE' }))
                .appendField('事件目标元素');
            this.setInputsInline(true)
            this.setOutput(true, 'dom_element');
            this.setTooltip('事件处理器在事件的冒泡或捕获阶段被调用时，对事件被分派到的对象的引用');
            this.setHelpUrl('https://developer.mozilla.org/zh-CN/docs/Web/API/Event/target');
            this.setColour(90);
        }
    }
    const event_preventDefault = {
        init: function () {
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
    javascript.javascriptGenerator.forBlock['create_element'] = function (block, generator) {
        const tag = block.getFieldValue("tag");
        return [`document.createElement("${tag}")`, javascript.Order.ATOMIC];
    }

    javascript.javascriptGenerator.forBlock['element'] = function (block, generator) {
        const id = block.getFieldValue("elements");
        return [`document.getElementById("${id}")`, javascript.Order.ATOMIC];
    }

    javascript.javascriptGenerator.forBlock['add_to_'] = function (block, generator) {
        var value_source = "";
        var split
        for (let i = 0; i < this.elementCount_; i++) {
            i === 0 ? split = "" : split = ", ";
            value_source += split + generator.valueToCode(block, `source_${i}`, javascript.Order.ATOMIC)
        }

        const value_target = generator.valueToCode(block, 'target', javascript.Order.ATOMIC);

        const code = `${value_target}.append(${value_source});\n`;
        return code;
    }

    javascript.javascriptGenerator.forBlock['attribute'] = function (block, generator) {
        return [`${generator.valueToCode(block, 'target', javascript.Order.NONE)}.getAttribute("data-${block.getFieldValue("name")}");\n`, javascript.Order.ATOMIC]
    }
    javascript.javascriptGenerator.forBlock['style'] = function (block, generator) {
        var code = `${generator.valueToCode(block, 'target', javascript.Order.ATOMIC)}.style`;
        block.getFieldValue("name") === 'all' ? code += '' : code += `.${block.getFieldValue("name")}`
        return [code, javascript.Order.ATOMIC]
    }
    javascript.javascriptGenerator.forBlock['inner'] = function (block, generator) {
        return [`${generator.valueToCode(block, 'target', javascript.Order.ATOMIC)}.inner${block.getFieldValue("type")}`, javascript.Order.ATOMIC]
    }
    javascript.javascriptGenerator.forBlock['assignment'] = function (block, generator) {
        var code;
        if (this.getInputTargetBlock("source").type == 'attribute') {
            code = `${generator.valueToCode(this.getInputTargetBlock("source"), 'target', javascript.Order.NONE)}.setAttribute("data-${block.getFieldValue("name")}", ${generator.valueToCode(block, 'target', javascript.Order.NONE)});\n`
            block.setHelpUrl("https://developer.mozilla.org/zh-CN/docs/Web/API/Element/setAttribute");
        } else {
            code = `${generator.valueToCode(block, 'source', javascript.Order.NONE)} = ${generator.valueToCode(block, 'target', javascript.Order.NONE)};\n`;
            block.setHelpUrl("");
        }
        return code;
    }
    javascript.javascriptGenerator.forBlock['addEventListener'] = function (block, generator) {
        return `${generator.valueToCode(block, 'target', javascript.Order.NONE)}.on${block.getFieldValue("event_name")} = function(event) {${generator.statementToCode(block, 'event_content', javascript.Order.NONE)}};`;
    }
    javascript.javascriptGenerator.forBlock['event_cancelable'] = function (block, generator) {
        return ['event.cancelable', javascript.Order.ATOMIC]
    }
    javascript.javascriptGenerator.forBlock['event_isTrusted'] = function (block, generator) {
        return ['event.isTrusted', javascript.Order.ATOMIC]
    }
    javascript.javascriptGenerator.forBlock['event_defaultPrevented'] = function (block, generator) {
        return ['event.defaultPrevented', javascript.Order.ATOMIC]
    }
    javascript.javascriptGenerator.forBlock['event_type'] = function (block, generator) {
        return ['event.type', javascript.Order.ATOMIC]
    }
    javascript.javascriptGenerator.forBlock['event_target'] = function (block, generator) {
        return ['event.target', javascript.Order.ATOMIC]
    }
    javascript.javascriptGenerator.forBlock['event_preventDefault'] = function (block, generator) {
        return ['event.preventDefault()', javascript.Order.ATOMIC]
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
            this.appendDummyInput('NAME')
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


    javascript.javascriptGenerator.forBlock['alert'] = function (block, generator) {
        const value_message = generator.valueToCode(block, 'message', javascript.Order.NONE);

        const code = `alert(${value_message});\n`;
        return code;
    }

    javascript.javascriptGenerator.forBlock['confirm'] = function (block, generator) {
        const value_message = generator.valueToCode(block, 'message', javascript.Order.NONE);

        const code = `confirm(${value_message});\n`;
        return code;
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
            confirm: confirm
        }
    )
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
