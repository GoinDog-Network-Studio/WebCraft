class Draggable {
    static Items = {};
    static Generator = {};
    static #attribute_type = {};
    static #workspaces = [];
    static onChange = () => { };
    static #currentPopMsgValue;

    static {
        this.registerAttributeType("choice", (attr) => {

            var div = this.appendArea();

            var label = this.appendLabel(attr['label']);
            var select = document.createElement("select");
            select.setAttribute("class", "Draggable_attr_select")

            select.addEventListener("change", event => {
                attr['value'] = select.value;
                this.onChange();
            })

            attr['choices'].forEach(element => {
                var option = document.createElement("option");
                option.innerText = element['label']
                option.value = element['value']
                if (attr['value'] == element['value']) option.selected = "true";
                select.appendChild(option);
            });

            div.appendChild(label);
            div.appendChild(select)

            return div;
        })
        this.registerAttributeType("text", (attr) => {
            var div = this.appendArea();

            var label = this.appendLabel(attr['label']);
            var input = document.createElement("input");
            input.setAttribute("type", "text")
            input.setAttribute("class", "Draggable_attr_input")
            input.setAttribute("value", attr['value'])
            input.addEventListener("input", event => {
                attr['value'] = input.value;
                this.onChange();
            })

            div.appendChild(label);
            div.appendChild(input)

            return div;
        })
    };

    static appendArea = () => {
        var div = document.createElement("div");
        div.setAttribute("class", "draggable_attr_div")
        return div
    }
    static appendLabel = (label = '') => {
        var label_ = document.createElement("h3");
        label_.setAttribute("class", "draggable_label");
        label_.innerText = label;
        return label_;
    };

    static generate = (workspaceId) => {
        var target = '';
        let structure = this.#workspaces[workspaceId]['structure'];
        structure.forEach(element => {
            var attributes = element['attribute'];
            var initial = {
                "getAttribute": (attributeName) => {
                    var value = "";
                    attributes.forEach(element_ => {
                        if (element_['id'] == attributeName) value = element_['value'];
                    })
                    return value;
                },
                "id": element['id']
            };
            var targetCode = this.Generator[element['type']](initial);
            target += targetCode;
        })
        return target;
    };
    static registerAttributeType(identify = "", parser = (attr) => { }) {
        var configuration = {};
        configuration['parser'] = parser;
        this.#attribute_type[identify] = configuration;
    }
    static showDropLayer(workspaceId) {
        var dropLayer = document.getElementById(
            this.#workspaces[workspaceId]['target']
        ).querySelector("#draggable_workspace").querySelector("#preview").querySelector("#drop_layer");
        dropLayer.style.display = "block";
    }
    static Inject = (targetId, options = {
        toolbox,
        rootPath,
        width,
        height
    }) => {
        var target = document.querySelector(`#${targetId}`)
        var workspace = {};
        workspace['id'] = this.#workspaces.length;
        workspace['target'] = targetId;
        workspace['structure'] = [];
        workspace['property_status'] = "overview";
        this.#workspaces.push(workspace);
        this.#loadStyle(`${options.rootPath}/style/draggable.css`);
        var item_lab = "";
        for (let i = 0; i < toolbox.children.length; i++) {
            var child = toolbox.children[i];
            if (child.children.length != 0) {
                console.log(child.children)
            }
            let type = child.getAttribute("type");
            item_lab += `
            <div id="item_unit" draggable="true" ondragstart="event.dataTransfer.setData('type', '${type}');event.dataTransfer.setData('workspaceId', '${workspace['id']}');Draggable.showDropLayer(${workspace['id']})">
            ${this.Items[type]['label']}
            </div>
            `
        }
        target.innerHTML = `
        <div id="draggable_workspace" style="width: ${options.width}; height: ${options.height}">
            <div id="item_lab">
                ${item_lab}
            </div>
            <div id="preview" >
                <div id="drop_layer" ondrop="if(event.dataTransfer.getData('workspaceId') == ${workspace['id']})Draggable.drop(event, ${workspace['id']})" ondragover="if(event.dataTransfer.getData('workspaceId') == ${workspace['id']})Draggable.allowDrop(event)"></div>
                <iframe id="preview_frame"></iframe>
            </div>
            <div id="properties"></div>
            <div class="draggable_context_menu"></div>
            <div class="draggable_pop_msg_area">
                <div class="draggable_pop_msg_window">
                    <h1 class="draggable_pop_msg_title"></h1>
                    <p class="draggable_pop_msg_content"></p>
                    <div class="draggable_pop_msg_data_area"></div>
                </div>
            </div>
        </div>
        `;
        var toolbar = target.children[0].querySelector("#properties");
        var nav = this.#appendNavBar("概览", "", workspace['id'])
        toolbar.appendChild(nav);
        target.querySelector("#draggable_workspace").addEventListener("click", event => {
            target.querySelector("#draggable_workspace").querySelector(".draggable_context_menu").style.display = 'none'
        })
        return workspace['id'];
    };
    static getWorkspace(id) {
        return this.#workspaces[id];
    }
    static #loadOverview(workspaceId) {
        var structure = this.#workspaces[workspaceId]['structure'];
        let id = this.#workspaces[workspaceId]['target'];
        var target = document.getElementById(id);
        var toolbar = target.children[0].querySelector("#properties");
        toolbar.innerHTML = '';
        var nav = this.#appendNavBar("概览", "", workspaceId);
        toolbar.appendChild(nav);
        var content = document.createElement("div");
        content.classList.add("content")
        toolbar.appendChild(content);
        structure.forEach(element => {
            var label = element['label'];
            var dom = `
            <div class="draggable_overview_item" data-structure-id="${element['id']}" oncontextmenu="Draggable.contextMenu(event, ${workspaceId}, ${element['id']})">
                <h3>${label}</h3>
            </div>
            `;
            content.innerHTML += dom;
        })
    }
    static #loadStyle = (src = '') => {
        var link = document.createElement("link");
        link.href = src;
        link.rel = 'stylesheet';
        document.body.appendChild(link);
    };
    static drop = (event, workspaceId) => {
        event.preventDefault();
        var type = event.dataTransfer.getData("type");
        var configuration = JSON.parse(
            JSON.stringify(this.Items[type])
        );
        configuration['type'] = type;
        var workspace = this.#workspaces[workspaceId]
        configuration['id'] = workspace['structure'].length;
        configuration['label'] += ` #${configuration['id']}`;
        workspace['structure'].push(configuration);
        if (this.#workspaces[workspaceId]['property_status'] == 'overview') {
            this.#loadOverview(workspaceId);
        }
        this.onChange();
        var dropLayer = document.getElementById(
            this.#workspaces[workspaceId]['target']
        ).querySelector("#draggable_workspace").querySelector("#preview").querySelector("#drop_layer");
        dropLayer.style.display = "none";
    };
    static allowDrop = function (event) {
        event.preventDefault();
    };
    static loadProperty = (workspaceId, itemId) => {
        this.#workspaces[workspaceId]['property_status'] = "property";

        var elements = [];

        var itemProperty = this.#workspaces[workspaceId]['structure'][itemId];

        var nav = this.#appendNavBar(itemProperty['label'] + " - 属性", "概览", workspaceId)

        var content = document.createElement("div");
        content.classList.add("content")
        elements.push(nav)
        elements.push(content)

        var attributes = itemProperty['attribute']
        attributes.forEach(elem => {
            var identify = elem['type'];
            var dom_elem = this.#attribute_type[identify]['parser'](elem);
            content.appendChild(dom_elem);
        })

        var target = document.getElementById(
            this.#workspaces[workspaceId]['target']
        );

        var properties = target.children[0].querySelector("#properties");
        properties.innerHTML = '';
        elements.forEach(elem => {
            properties.appendChild(elem)
        })
    }

    static setOnChange = (listener = () => { }) => {
        this.onChange = listener;
    }
    static changePreviewCode = (code = '') => {
        document.querySelector("#preview_frame").setAttribute("srcdoc", code)
    };

    static #appendNavBar = (currentPageTitle, previousPageTitle, workspaceId) => {
        var area = document.createElement("div")
        var div = document.createElement("div");
        div.setAttribute("class", "Draggable_nav")


        var previous = document.createElement("p");
        previous.setAttribute("class", "Draggable_nav_previous");
        previous.innerText = previousPageTitle;

        previous.addEventListener("click", event => {
            this.#workspaces[workspaceId]['property_status'] = "overview";
            this.#loadOverview(workspaceId)
        })
        div.appendChild(previous);
        if (previousPageTitle == "") {
            previous.style.visibility = "hidden";
        }

        var current = document.createElement("p");
        current.setAttribute("class", "Draggable_nav_current");
        current.innerText = currentPageTitle;

        div.appendChild(current)

        area.append(div);
        area.style.width = "90%";
        area.style.margin = "1%";
        return area;
    }
    static contextMenu(event, workspaceId, itemId) {
        event.preventDefault();
        if (itemId == -1) { }
        else {
            var injection = `
            <li onclick="Draggable.loadProperty(${workspaceId}, ${itemId})">属性</li>
            <li onclick="Draggable.delete(${workspaceId}, ${itemId})" style="color: red;">删除</li>
            `;
            var target = document.getElementById(this.#workspaces[workspaceId]['target'])
            var contextMenu_ = target.children[0].querySelector(".draggable_context_menu");
            contextMenu_.innerHTML = injection;
            contextMenu_.setAttribute("style", "display: block;")
            var targetLeft = event.pageX + 'px';
            var targetTop = event.pageY + 'px';
            var contextMenuWidth = contextMenu_.clientWidth;
            var contextMenuHeight = contextMenu_.clientHeight;
            if (event.pageX + contextMenuWidth > document.body.clientWidth) {
                targetLeft = document.body.clientWidth - contextMenuWidth + "px";
            }
            if (event.pageY + contextMenuHeight > document.body.clientHeight) {
                targetTop = document.body.clientHeight - contextMenuHeight + "px";
            }
            contextMenu_.style.left = targetLeft;
            contextMenu_.style.top = targetTop;
        }
    }
    static popMsgResponsed() {

    }
    static #showPopMsg(title, content, dataType, dataOpt = {}, workspaceId) {
        var workspace = document.getElementById(this.#workspaces[workspaceId]['target']).querySelector("#draggable_workspace");
        var msgArea = workspace.querySelector(".draggable_pop_msg_area");
        var msgWindow = msgArea.querySelector(".draggable_pop_msg_window");

        msgWindow.querySelector(".draggable_pop_msg_title").innerText = title;
        msgWindow.querySelector(".draggable_pop_msg_content").innerText = content

        var dataArea = msgWindow.querySelector(".draggable_pop_msg_data_area");

        msgArea.style.display = 'flex';
        switch (dataType) {
            case "boolean":
                var trueBtn = document.createElement("button");
                trueBtn.innerText = '确定'
                trueBtn.setAttribute("class", "draggable_pop_data_true  draggable_pop_data_btn")

                var style = '';
                if (dataOpt['trueBtnStyle'] != null) {
                    for (let element in dataOpt['trueBtnStyle']) {
                        style += `${element}: ${dataOpt['trueBtnStyle'][element]};`;
                    }
                }
                trueBtn.setAttribute("style", style)
                trueBtn.onclick = () => {
                    this.#currentPopMsgValue = true;
                    this.popMsgResponsed();
                }

                var falseBtn = document.createElement("button");
                falseBtn.innerText = '取消'
                falseBtn.setAttribute("class", "draggable_pop_data_false  draggable_pop_data_btn")
                falseBtn.onclick = () => {
                    this.#currentPopMsgValue = false;
                    this.popMsgResponsed();
                }

                dataArea.appendChild(falseBtn)
                dataArea.appendChild(trueBtn)
                break;

            default:
                break;
        }
    }
    static #hidePopMsg(workspaceId) {
        var workspace = document.getElementById(this.#workspaces[workspaceId]['target']).querySelector("#draggable_workspace");
        var msgArea = workspace.querySelector(".draggable_pop_msg_area");
        msgArea.style.display = 'none';

        var msgWindow = msgArea.querySelector(".draggable_pop_msg_window");

        msgWindow.querySelector(".draggable_pop_msg_title").innerText = "";
        msgWindow.querySelector(".draggable_pop_msg_content").innerText = ""
        var dataArea = msgWindow.querySelector(".draggable_pop_msg_data_area");
        dataArea.innerHTML = "";
    }
    static delete(workspaceId, itemId) {
        this.#showPopMsg(`删除  元素"${this.#workspaces[workspaceId]['structure'][itemId]['label']}"`, `确定删除  元素"${this.#workspaces[workspaceId]['structure'][itemId]['label']}"  吗？`, "boolean", {
            trueBtnStyle: {
                "background-color": "red",
                "color": "white"
            }
        }, workspaceId);
        this.popMsgResponsed = () => {
            if (this.#currentPopMsgValue) {
                delete this.#workspaces[workspaceId]['structure'][itemId];

                this.#hidePopMsg(workspaceId)
            } else {
                this.#hidePopMsg(workspaceId)
            }
            this.#loadOverview(workspaceId);
            this.onChange();
        }
    }
    static JSON = {
        workspaceToJson(workspaceId) {
            var cache = [];
            for (let i = 0; i < Draggable.#workspaces[workspaceId]["structure"].length; i++) {
                var element = Draggable.#workspaces[workspaceId]["structure"][i];
                if (element != null) {
                    element["id"] = i;
                    cache.push(element)
                }
            }
            return cache;
        },
        jsonToWorkspace(workspaceId, json) {
            Draggable.#workspaces[workspaceId]["structure"] = [];
            Draggable.#workspaces[workspaceId]["structure"] = json;
            Draggable.onChange()
            Draggable.#loadOverview(workspaceId)
        }
    }
}
