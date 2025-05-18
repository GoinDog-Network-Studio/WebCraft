Draggable.Generator['title'] = (item) => {
    console.log(item);
    var stylesheet = '';
    item.getAttribute("css").forEach(element => {
        var identify = element['identify'];
        var value = element['value'];
        stylesheet += `${identify}: ${value};`
    })
    return `<${item.getAttribute("tag")} id="${item.getAttribute("id")}" style="${stylesheet}">${item.getAttribute("innerText")}</${item.getAttribute("tag")}>`
}
Draggable.Generator['p'] = (item) => {
    var stylesheet = '';
    item.getAttribute("css").forEach(element => {
        var identify = element['identify'];
        var value = element['value'];
        stylesheet += `${identify}: ${value};`
    })
    return `<p id="${item.getAttribute("id")}" style="${stylesheet}">${item.getAttribute("innerText")}</p>`
}
Draggable.Generator['button'] = (item) => {
    var stylesheet = '';
    item.getAttribute("css").forEach(element => {
        var identify = element['identify'];
        var value = element['value'];
        stylesheet += `${identify}: ${value};`
    })
    return `<button id="${item.getAttribute("id")}" style="${stylesheet}">${item.getAttribute("innerText")}</button>`
}
Draggable.Generator['input'] = (item) => {
    var stylesheet = '';
    item.getAttribute("css").forEach(element => {
        var identify = element['identify'];
        var value = element['value'];
        stylesheet += `${identify}: ${value};`
    })
    return `<input id="${item.getAttribute("id")}" type="${item.getAttribute("category")}" style="${stylesheet}" placeholder="${item.getAttribute("placeholder")}" value="${item.getAttribute("value")}"/>`
}