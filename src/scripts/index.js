const scenes = ['draggable_div', "blockly_css", "blockly_js"];
const graphical_map = {
    'html': "draggable_div",
    'css': "blockly_css",
    'js': "blockly_js"
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
                            Blockly.serialization.workspaces.load({
                                blocks: {
                                    blocks: json
                                }
                            }, js_workspace)
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
var js_workspace = Blockly.inject("blockly_js", {
    toolbox: document.getElementById("js_toolbox"),
    renderer: 'zelos',
    media: './src/blockly/media/'
})

function analyzeJavascript(code) {
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
                    json_ = code_with_block_analyzer[expression](arguments);
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
                        do_block: analyzeJavascript(alternate['body'])
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
    console.log(ast);

    var block = [];
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
                block.push(ifBlock)
                break;

            case 'ExpressionStatement':
                var exp_block = utils.ExpressionAnalyze(codeBlock['expression'])
                block.push(exp_block)
                break;

            default:
                break;
        }
    })
    console.log(block);
    return block
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