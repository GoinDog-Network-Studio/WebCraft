var url_configuration = {};
window.location.search.replace("?", "").split("&").forEach(exp => {
    var kv = exp.split("=");
    url_configuration[kv[0]] = kv[1];
})
const scenes = ['draggable_div', "blockly_css", "blockly_js"];
const graphical_map = {
    'html': "draggable_div",
    'css': "blockly_css",
    'js': "blockly_js"
}
const nonNextConnectionBlocks = [
    'FUNCTION_DEFINITION', 'FUNCTION_RETURN', "FUNCTION_PARAM_INPUT", "element", "create_element", 'attribute', 'style', 'inner', 'event_cancelable', 'event_isTrusted', 'event_type', 'event_defaultPrevented', 'event_target', 'location_info', 'localStorage_getItem'
]
if (!!url_configuration['devMode'] && url_configuration['devMode'] == 'true') {

} else {
    var elements = document.getElementsByClassName("tab");
    for (const element of elements) {
        element.style.display = 'none';
    }
}
function changeScene(event) {
    const fileName = window.localStorage.getItem("selectedFile");
    const target_scene = event.target.value;
    switch (target_scene) {
        case 'graphical':
            var file_conf = JSON.parse(
                window.localStorage.getItem("file_conf")
            );
            var selectedFileName = window.localStorage.getItem("selectedFile")
            var file_name_analyze = fileName.split(".");
            var file_type = file_name_analyze[file_name_analyze.length - 1]
            scenes.forEach(scene => {
                const target = document.getElementById(scene)
                target.style.display = 'none';
                if (scene == graphical_map[file_type]) {
                    target.style.display = 'block'
                    file_conf.forEach(file => {
                        if (file['name'] == selectedFileName) {
                            var json = analyzeJavascript(file['content']);
                            Blockly.serialization.workspaces.load(json, js_workspace)
                        }
                    })
                }
            })
            document.getElementById('vscode_editor').style.display = 'none';
            break;

        case 'vscode_editor':
            var file_name_analyze = fileName.split(".");
            var file_type = file_name_analyze[file_name_analyze.length - 1]
            scenes.forEach(scene => {
                const target = document.getElementById(scene)
                target.style.display = 'none';
            });
            var file_conf = JSON.parse(
                window.localStorage.getItem("file_conf")
            );
            var selectedFileName = window.localStorage.getItem("selectedFile")
            var file_type_with_mime = {
                "html": 'html',
                'js': 'javascript',
                'css': 'css'
            }
            window.vscode_editor.changeLang(file_type_with_mime[file_type])
            file_conf.forEach(file => {
                if (file['name'] == selectedFileName) {
                    window.vscode_editor.changeValue(file['content'])
                }
            })
            document.getElementById('vscode_editor').style.display = 'block';
            break;
        default:
            break;
    }
}

class CustomCategory extends Blockly.ToolboxCategory {
    /**
     * Constructor for a custom category.
     * @override
     */
    constructor(categoryDef, toolbox, opt_parent) {
        super(categoryDef, toolbox, opt_parent);
    }
    /** @override */
    addColourBorder_(colour) {
        this.rowDiv_.style.backgroundColor = colour;
    }
    /** @override */
    setSelected(isSelected) {
        // We do not store the label span on the category, so use getElementsByClassName.
        var labelDom = this.rowDiv_.getElementsByClassName('blocklyTreeLabel')[0];
        if (isSelected) {
            // Change the background color of the div to white.
            this.rowDiv_.style.backgroundColor = 'white';
            // Set the colour of the text to the colour of the category.
            labelDom.style.color = this.colour_;
            this.iconDom_.style.color = this.colour_;
        } else {
            // Set the background back to the original colour.
            this.rowDiv_.style.backgroundColor = this.colour_;
            // Set the text back to white.
            labelDom.style.color = 'white';
            this.iconDom_.style.color = 'white';
        }
        // This is used for accessibility purposes.
        Blockly.utils.aria.setState(/** @type {!Element} */(this.htmlDiv_),
            Blockly.utils.aria.State.SELECTED, isSelected);
    }
}
class ToolboxLabel extends Blockly.ToolboxItem {
    constructor(toolboxItemDef, parentToolbox) {
        super(toolboxItemDef, parentToolbox);
    }
    init() {
        // Create the label.
        this.label = document.createElement('label');
        // Set the name.
        this.label.textContent = this.toolboxItemDef_['text'];
        // Set the color.
        this.label.style.color = this.toolboxItemDef_['colour'];
        const cssConfig = this.toolboxItemDef_['cssconfig'];

        // Add the class.
        if (cssConfig) {
            cssConfig['class'].split(" ").forEach(css_class => {
                this.label.classList.add(css_class);
            })
        }
    }
    /**@override */
    getDiv() {
        return this.label;
    }
}
Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    'toolbox_label',
    ToolboxLabel);
Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    CustomCategory, true);

document.getElementById("welcome").style.display = 'none'
document.getElementById("blockly_css").style.display = 'none'
document.getElementById("draggable_div").style.display = 'none'
document.getElementById('vscode_editor').style.display = 'none';
var html_workspace = Draggable.Inject("draggable_div", {
    toolbox: document.querySelector("#toolbox"),
    rootPath: "./src/Draggable",
    width: "85vw",
    height: "90vh",
});
/**
 * @implements {Blockly.IConnectionChecker}
 */
class FunctionParamStrictChecker extends Blockly.ConnectionChecker {
    constructor() {
        super()
    }
    /**
     * 
     * @override
     */
    doTypeChecks(a, b) {
        if (a.sourceBlock_.type == "FUNCTION_PARAM_INPUT" && b.sourceBlock_.type == "FUNCTION_DEFINITION") {
            return false
        } else return super.doTypeChecks(a, b);
    }
}
Blockly.registry.register(
    Blockly.registry.Type.CONNECTION_CHECKER,
    "FunctionParamStrictChecker",
    FunctionParamStrictChecker
)
var js_workspace = Blockly.inject("blockly_js", {
    toolbox: document.getElementById("js_toolbox"),
    renderer: 'zelos',
    media: './src/blockly/media/',
    plugins: {
        "connectionChecker": FunctionParamStrictChecker
    }
})
const block_shot = {
    preconditionFn: function (scope) {
        return 'enabled';
    },
    callback: async function (scope) {
        const block = scope['block'].getSvgRoot();
        const blockly_style = document.getElementById("blockly-renderer-style-zelos-classic").innerHTML + '\n' + document.getElementById("blockly-common-style").innerHTML
        svgAsPngUri(block, {
            cssStyles: blockly_style
        }, function (dataURL) {
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'block.png';
            link.click();
        })
    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    id: 'hello_world',
    weight: 5,
    displayText: "生成积木图片"
}

Blockly.ContextMenuRegistry.registry.register(block_shot);
const FUNCTION_BLOCKS_TYPE = ["FUNCTION_DEFINITION"];
const FUNCTION_PARAM_INPUT_IN_CORRECT_FUNCTIO_BODY_CHECK_MIXIN = {
    onchange: function (e) {
        if (!this.workspace.isDragging || this.workspace.isDragging()) return;
        const enabled = !!this.getSurroundFunction();

        var functionName = js_workspace['functions'][this.data['key']]['field_name'];
        this.setWarningText(
            enabled ? null : `警告：本块只能在函数 "${functionName}" 里使用！`
        )
        if (!this.isInFlyout) {
            try {
                Blockly.Events.setRecordUndo(false);
                this.setDisabledReason(
                    !enabled,
                    `警告：本块只能在函数 "${functionName}" 里使用！`
                )
            } finally {
                Blockly.Events.setRecordUndo(true);
            }
        }
    },
    getSurroundFunction: function () {
        let block = this;
        do {
            if (FUNCTION_BLOCKS_TYPE.indexOf(block.type) != -1) {
                if (block.id == js_workspace['functions'][this.data['key']]['name']) return block;
            }
            block = block.getSurroundParent();
        } while (block);
        return null;
    }
}
Blockly.Extensions.registerMixin(
    "FUNCTION_PARAM_INPUT_IN_CORRECT_FUNCTION_BODY_CHECK_MIXIN",
    FUNCTION_PARAM_INPUT_IN_CORRECT_FUNCTIO_BODY_CHECK_MIXIN
)
const FUNCTION_RETURN_IN_CORRECT_FUNCTION_BODY_CHECK_MIXIN = {
    source_: null,
    destroy: function () {
        const enabled = !!this.getSurroundFunction();
        if (this.source_ != null) {
            if (!enabled) {
                this.source_.data = false;
            }
        }
    },
    onchange: function (e) {
        if (!this.workspace.isDragging || this.workspace.isDragging()) return;
        if (this.source_ == null || this.getSurroundFunction() != null) this.source_ = this.getSurroundFunction();
        const enabled = !!this.getSurroundFunction();
        if (this.source_ != null) {
            if (!enabled) {
                this.source_.data = false;
            }
        }

        this.setWarningText(
            enabled ? null : `警告：本块只能在函数体里使用！`
        )
        if (!this.isInFlyout) {
            try {
                Blockly.Events.setRecordUndo(false);
                this.setDisabledReason(
                    !enabled,
                    `警告：本块只能在函数体里使用！`
                )
            } finally {
                Blockly.Events.setRecordUndo(true);
            }
        }
    },
    getSurroundFunction: function () {
        let block = this;
        do {
            if (FUNCTION_BLOCKS_TYPE.indexOf(block.type) != -1) {
                if (block.type == "FUNCTION_DEFINITION" && this.getInputTargetBlock("value") != null) {
                    block.data = {
                        hasReturn: true,
                        type: this.getInputTargetBlock("value").outputConnection.check
                    }
                } else if (block.type == "FUNCTION_DEFINITION" && this.getInputTargetBlock("value") == null) {
                    block.data = {
                        hasReturn: false
                    }
                }
                return block;
            }
            block = block.getSurroundParent();
        } while (block);
        return null;
    }
}
Blockly.Extensions.registerMixin(
    "FUNCTION_RETURN_IN_CORRECT_FUNCTION_BODY_CHECK_MIXIN",
    FUNCTION_RETURN_IN_CORRECT_FUNCTION_BODY_CHECK_MIXIN
)
const EVENT_BLOCKS_TYPE = ['addEventListener'];
const EVENT_BLOCK_IN_EVENT_DEFINITION_CHECK = {
    onchange: function (e) {
        if (!this.workspace.isDragging || this.workspace.isDragging()) return;
        const enabled = !!this.getSurroundEvent();

        this.setWarningText(
            enabled ? null : `警告：本块只能在事件定义里使用！`
        )
        if (!this.isInFlyout) {
            try {
                Blockly.Events.setRecordUndo(false);
                this.setDisabledReason(
                    !enabled,
                    `警告：本块只能在事件定义里使用！`
                )
            } finally {
                Blockly.Events.setRecordUndo(true);
            }
        }
    },
    getSurroundEvent: function () {
        let block = this;
        do {
            if (EVENT_BLOCKS_TYPE.indexOf(block.type) != -1) {
                return block;
            }
            block = block.getSurroundParent();
        } while (block);
        return null;
    }
}
Blockly.Extensions.registerMixin(
    "EVENT_BLOCK_IN_EVENT_DEFINITION_CHECK",
    EVENT_BLOCK_IN_EVENT_DEFINITION_CHECK
)
class CopyDraggable {
    constructor(source) {
        this.source = source
    }
    getSvgRoot() {
        return this.rootSvg;
    }
    isMovable() {
        return true;
    }
    startDrag(e) {
        this.workspace = js_workspace;

        var param = this.workspace.newBlock("FUNCTION_PARAM_INPUT");
        this.targetBlock = param;
        param.data = this.source.data;
        param.initSvg();
        param.setFieldValue(this.source.getFieldValue("NAME"), "NAME")
    }
    drag(newLoc, e) {
        this.targetBlock.moveTo(newLoc);
    }
    revertDrag() {
        this.targetBlock.moveTo(this.startLoc)
    }
    endDrag() {
        this.workspace.setResizesEnabled(true);
    }
}
js_workspace['functions'] = {};
js_workspace.addChangeListener(() => {
    var func_defs = js_workspace.getBlocksByType("FUNCTION_DEFINITION");
    var func_param_inputs = js_workspace.getBlocksByType("FUNCTION_PARAM_INPUT").concat(
        js_workspace.getBlocksByType("FUNCTION_PARAM_INPUT_IN_DEF")
    );
    var func_calls = js_workspace.getBlocksByType("FUNCTION_CALL");

    for (const func_def of func_defs) {
        var name = func_def.id;
        var func_name = func_def.getFieldValue("NAME");
        var parameters = [];
        if (func_def.params != undefined) {
            for (const param of func_def.params) {
                parameters.push(
                    param['name']
                )
            }
        }
        js_workspace['functions'][name] = {
            name: name,
            params: parameters,
            field_name: func_name,
            initialize: () => {
                return {
                    kind: "block",
                    type: "FUNCTION_CALL",
                    extraState: {
                        inputCount_: parameters.length,
                        func_id: name
                    },
                    fields: {
                        NAME: func_name
                    }
                }
            },
            hasReturn: !!func_def.data ? func_def.data['hasReturn'] : false,
            returnType: !!func_def.data ? func_def.data['type'] : null
        }
        func_def.updateShape_(func_def);
        func_def.destroy = function () {
            for (const func_param_input of func_param_inputs) {
                var key = func_param_input.data['key'];
                if (key == name) {
                    func_param_input.dispose();
                }
            }
            for (const func_call of func_calls) {
                var key = func_call.func_id;
                if (key == name) {
                    func_call.dispose();
                }
            }
            delete js_workspace['functions'][name];
        }
    };
    for (const func_param_input of func_param_inputs) {
        var key = func_param_input.data['key'];
        var index = func_param_input.data['index'];
        if (func_param_input.getSurroundParent() != null) {
            if (js_workspace['functions'][key]['params'].length <= index && func_param_input.getSurroundParent().type != "FUNCTION_DEFINITION") {
                func_param_input.dispose();
                continue;
            }
        }
        func_param_input.setFieldValue(js_workspace['functions'][key]['params'][index], "NAME")
    }
    for (const func_call of func_calls) {
        var key = func_call.func_id;
        func_call.inputCount_ = js_workspace['functions'][key]['params'].length;
        func_call.updateShape_(func_call, key);
    }
});
var WebCraftFunctionCallback = function (workspace) {
    var functions_ = workspace['functions'];
    var blockList = [
        {
            "kind": "block",
            "type": "FUNCTION_DEFINITION"
        },
        {
            kind: 'block',
            type: "FUNCTION_RETURN"
        },
        {
            kind: 'sep'
        }
    ];
    for (const func in functions_) {
        if (Object.prototype.hasOwnProperty.call(functions_, func)) {
            const initialize = functions_[func]['initialize'];
            blockList.push(initialize());
        }
    }
    return blockList;
}
async function SHA256Encode(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join("");
    return hashHex;
}
js_workspace.registerToolboxCategoryCallback("WC_FUNCTION", WebCraftFunctionCallback);
function analyzeJavascript(code, isInFunction = false, function_ = {}) {
    var code_with_block_analyzer = {
        'window.localStorage.setItem': function (args) {
            return {
                'type': 'localStorage_setItem',
                'inputs': {
                    'keyName': {
                        block: args[0]
                    },
                    'keyValue': {
                        block: args[1]
                    }
                }
            }
        },
        'window.localStorage.getItem': function (args) {
            return {
                'type': 'localStorage_getItem',
                'inputs': {
                    'keyName': {
                        block: args[0]
                    }
                }
            }
        },
        'window.localStorage.removeItem': function (args) {
            return {
                'type': 'localStorage_removeItem',
                'inputs': {
                    'keyName': {
                        block: args[0]
                    }
                }
            }
        }
    }
    var utils = {
        ExpressionAnalyze: function (json) {
            var json_;
            switch (json['type']) {
                case 'ArrayExpression':
                    json_ = {
                        type: "lists_create_with",
                        extraState: {
                            itemCount: 0
                        },
                        inputs: {}
                    }
                    json_['extraState']['itemCount'] = json['elements'].length;
                    for (let i = 0; i < json['elements'].length; i++) {
                        const element = json['elements'][i];
                        json_['inputs'][`ADD${i}`] = {
                            block: this.ExpressionAnalyze(element)
                        }
                    }
                    break;
                case 'Literal':
                    if (typeof json['value'] == 'boolean') {
                        json_ = {
                            'type': "logic_boolean",
                            'fields': {
                                'BOOL': json['raw'].toUpperCase()
                            }
                        };
                    } else if (typeof json['value'] == 'number') {
                        json_ = {
                            'type': "math_number",
                            'fields': {
                                'NUM': json['raw']
                            }
                        };
                    } else if (typeof json['value'] == 'string') {
                        json_ = {
                            'type': "text",
                            'fields': {
                                'TEXT': json['value']
                            }
                        };
                    }
                    break;
                case 'CallExpression':
                    function CalleeAnalyze(callee) {
                        var type = callee['type'];
                        switch (type) {
                            case "MemberExpression":
                                return `${CalleeAnalyze(callee['object'])}.${callee['property']['name']}`

                            case 'Identifier':
                                return callee['name']

                            default:
                                break;
                        }
                    }
                    var callee = json['callee'];
                    var expression = CalleeAnalyze(callee);
                    var arguments = []
                    json['arguments'].forEach(arg => {
                        var block = utils.ExpressionAnalyze(arg);
                        arguments.push(block);
                    })
                    var isFunction = false;
                    for (const func_key in js_workspace['functions']) {
                        if (js_workspace['functions'][func_key]['field_name'] == expression) {
                            isFunction = true;
                            break;
                        }
                    }
                    if (!!code_with_block_analyzer[expression]) json_ = code_with_block_analyzer[expression](arguments);
                    else if (isFunction) {
                        var func_name = expression.replace("_", "");
                        var func_def = js_workspace['functions'][func_name];
                        json_ = {
                            type: 'FUNCTION_CALL',
                            fields: {
                                "NAME": func_name
                            },
                            extraState: {
                                func_id: func_name,
                                hasReturn: func_def['hasReturn'],
                                inputCount_: func_def['params'].length,
                            }
                        }
                        const arguments = json['arguments'];
                        var inputs = {};
                        for (let i = 0; i < arguments.length; i++) {
                            inputs['input_' + i] = {
                                block: this.ExpressionAnalyze(arguments[i])
                            }
                        }
                        json_['inputs'] = inputs;
                    } else if (isInFunction) {
                        const func_key = function_['key'];
                        const func_def = js_workspace['functions'][func_key];
                        for (const param of func_def['params']) {
                            if (!!func_def['params'][expression] && param['name'] == expression) {
                                json_ = {
                                    type: 'FUNCTION_PARAM_INPUT',
                                    data: {
                                        key: func_key,
                                        index: func_def['params'].indexOf(param)
                                    },
                                    fields: {
                                        NAME: expression
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            return json_;
        },
        IfStatementAlternateAnalyze: function (alternate) {
            var finalObj = {
                elseIf: [],
                else: {}
            };
            switch (alternate['type']) {
                case 'IfStatement':
                    finalObj['elseIf'].push({
                        if_block: utils.ExpressionAnalyze(alternate['test']),
                        do_block: analyzeJavascript(alternate['consequent']['body'])
                    })
                    if (alternate['alternate'] != null) {
                        var obj = utils.IfStatementAlternateAnalyze(alternate['alternate']);
                        if (Object.keys(obj['else']) != 0) {
                            finalObj['else'] = obj['else']
                        }
                        if (obj['elseIf'].length != 0) {
                            obj['elseIf'].forEach(elseIf => {
                                finalObj.elseIf.push(elseIf);
                            })
                        }
                    }
                    break;
                case 'BlockStatement':
                    finalObj['else'] = {
                        do_block: analyzeJavascript({
                            body: alternate['body']
                        })
                    }
                default:
                    break;
            }
            return finalObj;
        }
    }
    var ast;
    if (typeof code == 'string') {
        ast = esprima.parseScript(code);
    } else {
        ast = code;
    }

    var allBlock = [];
    var variablesList = []
    if (ast['body'].length != 0) {
        ast['body'].forEach(codeBlock => {
            switch (codeBlock.type) {
                case "IfStatement":
                    var DO_ = {
                        block: {}
                    };
                    var blocks = analyzeJavascript(codeBlock['consequent']);
                    for (let i = 0; i < blocks.length; i++) {
                        const element = blocks[blocks.length - 1 - i];
                        if (i != blocks.length - 1) {
                            blocks[blocks.length - 1 - i - 1]['next'] = {
                                block: element
                            };
                        }
                    }
                    DO_['block'] = blocks[0];
                    var ifBlock = {
                        'type': "controls_if",
                        'inputs': {
                            'IF0': {
                                block: utils.ExpressionAnalyze(codeBlock['test'])
                            },
                            'DO0': DO_
                        }
                    }
                    if (codeBlock['alternate'] != null) {
                        var obj = utils.IfStatementAlternateAnalyze(codeBlock['alternate']);
                        if (ifBlock['extraState'] == null) {
                            ifBlock['extraState'] = {}
                        }
                        if (Object.keys(obj['else']) != 0) {
                            ifBlock['extraState']['hasElse'] = true;
                            if (Object.keys(obj['else']['do_block']).length != 0) {
                                ifBlock['inputs']['ELSE'] = {
                                    block: obj['else']['do_block']
                                }
                            }
                        }
                        if (obj['elseIf'].length != 0) {
                            ifBlock['extraState']['elseIfCount'] = obj['elseIf'].length;
                            for (let i = 0; i < obj['elseIf'].length; i++) {
                                const element = obj['elseIf'][i];
                                if (Object.keys(element['if_block']).length != 0) {
                                    ifBlock['inputs'][`IF${i + 1}`] = {
                                        block: element['if_block']
                                    }
                                }
                                if (element['do_block'].length != 0) {
                                    ifBlock['inputs'][`DO${i + 1}`] = {
                                        block: element['do_block']
                                    }
                                }
                            }
                        }
                    }
                    allBlock.push(ifBlock)
                    break;

                case 'ExpressionStatement':
                    var exp_block = utils.ExpressionAnalyze(codeBlock['expression'])
                    allBlock.push(exp_block)
                    break;

                case "VariableDeclaration":
                    var declarations = codeBlock['declarations'];
                    declarations.forEach(declaration => {
                        var variable = {
                            type: "variables_set"
                        };
                        var name = declaration['id']['name'];

                        var variable_ = js_workspace.createVariable(name);
                        variablesList.push(
                            variable_
                        )

                        if (declaration['init'] != null) {
                            var value = utils.ExpressionAnalyze(declaration['init']);
                            variable['fields'] = {
                                VAR: {
                                    id: variable_['id']
                                }
                            }
                            variable['inputs'] = {
                                VALUE: {
                                    block: value
                                }
                            }
                        }
                        allBlock.push(variable)
                    })
                    break;

                case 'FunctionDeclaration':
                    var func_def = {
                        type: 'FUNCTION_DEFINITION',
                        inputs: {}
                    }
                    var params = []
                    var body = {};
                    if (analyzeJavascript(codeBlock['body'], true, {
                        key: codeBlock['id']['name']
                    })['blocks']['blocks'].length != 0) {
                        body = analyzeJavascript(codeBlock['body'], true, {
                            key: codeBlock['id']['name']
                        })['blocks']['blocks'][0]
                    }
                    codeBlock['params'].forEach(param => {
                        params.push({
                            name: param['name']
                        })
                    })
                    func_def['extraState'] = {
                        params: params
                    };
                    if (Object.keys(body).length != 0) {
                        func_def['inputs']['blocks'] = {
                            block: body
                        }
                    }
                    func_def['fields'] = {
                        NAME: codeBlock['id']['name']
                    }
                    allBlock.push(func_def)
                    break;

                case 'ReturnStatement':
                    var returnBlock = {
                        type: 'FUNCTION_RETURN'
                    }
                    allBlock.push(returnBlock);
                    break;

                default:
                    break;
            }
        })
    }
    var block = [];
    var allPreNextBlock = [];
    allBlock.forEach(block_ => {
        if (nonNextConnectionBlocks.indexOf(block_.type) == -1) {
            allPreNextBlock.push(block_)
        } else {
            block.push(block_);
        }
    })
    for (let i = allPreNextBlock.length; i > 0; i--) {
        const block_ = allPreNextBlock[i - 1];
        if (i - 1 != 0) {
            allPreNextBlock[i - 2]['next'] = {
                block: block_
            };
        }
    }
    if (allPreNextBlock.length != 0) block.push(allPreNextBlock[0]);
    var obj = {
        blocks: {
            blocks: block
        },
        variables: variablesList
    }
    console.log(obj);

    return obj;
}

var state = Blockly.serialization.workspaces.save(js_workspace);
Draggable.setOnChange(() => {
    var code = Draggable.generate(html_workspace);
    Draggable.changePreviewCode(code)
    var file_conf = JSON.parse(
        window.localStorage.getItem("file_conf")
    );
    var selectedFileName = window.localStorage.getItem("selectedFile")
    file_conf.forEach(file => {
        if (file['name'] == selectedFileName) {
            file['content'] = Draggable.generate(html_workspace);
        }
    })
    window.localStorage.setItem("file_conf", JSON.stringify(file_conf))
})
js_workspace.addChangeListener(() => {
    state = Blockly.serialization.workspaces.save(js_workspace);
    var file_conf = JSON.parse(
        window.localStorage.getItem("file_conf")
    );
    var selectedFileName = window.localStorage.getItem("selectedFile")
    file_conf.forEach(file => {
        if (file['name'] == selectedFileName) {
            file['content'] = javascript.javascriptGenerator.workspaceToCode(js_workspace);
        }
    })
    window.localStorage.setItem("file_conf", JSON.stringify(file_conf))
})
window.onload = (event) => {
    document.getElementById("blockly_js").style.display = 'none'
    document.getElementById("welcome").style.display = 'flex'
    if (window.localStorage.getItem("project_information") != null) {
        var info = JSON.parse(
            window.localStorage.getItem("project_information")
        );
        var html = info['html'];
        var js = info['js'];
        Draggable.JSON.jsonToWorkspace(html['workspaceId'], html['code']);
        Blockly.serialization.workspaces.load(js['code'], js_workspace)
    }
}
defineJSBlocks(Draggable.getWorkspace(html_workspace))

const summonBlob = function (data, type) {
    return new Blob([data], { type: type });
}
document.getElementById("preview_nav_btn").addEventListener("click", event => {
    const data = `${Draggable.generate(html_workspace)}<script>${javascript.javascriptGenerator.workspaceToCode(js_workspace)}</script>`;
    var blob = summonBlob(data, 'text/html');
    var url = URL.createObjectURL(blob);
    window.open(url);
});
function generateHtml() {
    return `<head><title>${window.localStorage.getItem("project_name")}</title></head>${Draggable.generate(html_workspace)}`;
}
function download() {
    const zip = new JSZip();
    const src = zip.folder("src");
    src.folder("js").file("index.js", javascript.javascriptGenerator.workspaceToCode(js_workspace))
    zip.file("index.html", `<link rel="stylesheet" href="./src/css/index.css">` + generateHtml() + `<script src="./src/js/index.js"></script>`);

    zip.generateAsync({ type: 'blob' }).then(function (content) {
        console.log(content)
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.type = 'download';
        a.download = `${window.localStorage.getItem("project_name")}.zip`
        document.body.appendChild(a)
        a.click();
        document.body.removeChild(a);
    });

}
const default_file_conf = [
    {
        'name': 'index.html',
        'content': "<h1>Welcome to WebCraft!</h1>",
        "mime": 'text/html'
    },
    {
        'name': 'index.js',
        'content': "console.log('Hello, WebCraft!')",
        "mime": 'text/javascript'
    }
]
function loadFilePreview() {
    document.getElementById("file_content").innerHTML = '';
    var files = window.localStorage.getItem("file_conf");
    if (files == null || files == "") {
        window.localStorage.setItem("file_conf", JSON.stringify(default_file_conf))
        loadFilePreview()
    } else {
        JSON.parse(files).forEach(file => {
            var icon;
            switch (file['mime']) {
                case 'text/html':
                    icon = 'bi bi-filetype-html';
                    break;
                case 'text/javascript':
                    icon = 'bi bi-filetype-js';
                    break;
                case 'text/css':
                    icon = 'bi bi-filetype-css';
                    break;
            }
            var dom = `
            <li class="file_item ${icon}" onclick="chooseFile(event)" data-file-name="${file['name']}" data-file-mime="${file['mime']}">${file['name']}</li>
            `;
            document.getElementById("file_content").innerHTML += dom;
        })
    }
}
loadFilePreview();
function chooseFile(event) {
    window.localStorage.setItem("selectedFile", event.target.getAttribute('data-file-name'))
    var children = event.target.parentNode.children;
    for (let i = 0; i < children.length; i++) {
        const element = children[i];
        if (element.classList.contains("selected")) {
            element.classList.remove("selected")
            element.onclick = function (event) {
                chooseFile(event)
            };
        }
    }
    event.target.classList.add("selected")
    event.target.onclick = function () { };
    switch (event.target.getAttribute('data-file-mime')) {
        case 'text/html':
            document.getElementById("blockly_css").style.display = 'none'
            document.getElementById("blockly_js").style.display = 'none'
            document.getElementById("draggable_div").style.display = 'block'
            document.getElementById("welcome").style.display = 'none'
            document.getElementById("vscode_editor").style.display = 'none'
            document.getElementById("graphical").checked = "true";
            break;
        case 'text/javascript':
            document.getElementById("blockly_css").style.display = 'none'
            document.getElementById("blockly_js").style.display = 'block'
            document.getElementById("draggable_div").style.display = 'none'
            document.getElementById("welcome").style.display = 'none'
            document.getElementById("graphical").checked = "true";
            document.getElementById("vscode_editor").style.display = 'none'
            break;
    }
}