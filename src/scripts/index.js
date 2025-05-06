const scenes = ['draggable_div', "blockly_css", "blockly_js"]
function changeScene(event) {
    const target_scene = event.target.value;
    scenes.forEach(scene => {
        const target = document.getElementById(scene)
        target.style.display = 'none';
        if (scene == target_scene) {
            target.style.display = 'block'
        }
    })
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

var html_workspace = Draggable.Inject("draggable_div", {
    toolbox: document.querySelector("#toolbox"),
    rootPath: "./src/Draggable",
    width: "100vw",
    height: "90vh",
});
var js_workspace = Blockly.inject("blockly_js", {
    toolbox: document.getElementById("js_toolbox"),
    renderer: 'zelos',
    media: './src/blockly/media/'
})
var state = Blockly.serialization.workspaces.save(js_workspace);
Draggable.setOnChange(() => {
    var code = Draggable.generate(html_workspace);
    Draggable.changePreviewCode(code)
    defineJSBlocks(Draggable.getWorkspace(html_workspace))
    Blockly.serialization.workspaces.load(state, js_workspace)

    var info = {
        'htmlDom': Draggable.JSON.workspaceToJson(html_workspace),
        'jsDom': Blockly.Xml.workspaceToDom(js_workspace)
    }
    window.localStorage.setItem("project_information", JSON.stringify(info))
})
js_workspace.addChangeListener(() => {
    state = Blockly.serialization.workspaces.save(js_workspace);
    var cache = new Number(html_workspace);
    var info = {
        'html': {
            'code': Draggable.JSON.workspaceToJson(cache),
            'workspaceId': html_workspace
        },
        'js': {
            'code': state
        }
    }
    window.localStorage.setItem("project_information", JSON.stringify(info))
})
window.onload = (event) => {
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