require.config({
    paths: {
        vs: 'src/monaco/min/vs'
    }
});
require(['vs/editor/editor.main'], function () {
    const vscode_editor = monaco.editor.create(document.getElementById("vscode_editor"), {
        language: "javascript",
        automaticLayout: true,
    });
    vscode_editor.getModel().onDidChangeContent((event) => {
        var file_conf = JSON.parse(
            window.localStorage.getItem("file_conf")
        );
        var selectedFileName = window.localStorage.getItem("selectedFile")
        file_conf.forEach(file => {
            if (file['name'] == selectedFileName) {
                file['content'] = vscode_editor.getValue();
            }
        })
        window.localStorage.setItem("file_conf", JSON.stringify(file_conf))
    })
    document.getElementById("vscode_editor").style.display = 'none';
    window.vscode_editor = {
        changeLang: function (targetLang) {
            var model = vscode_editor.getModel();
            monaco.editor.setModelLanguage(model, targetLang)
        },
        changeValue: function (newValue) {
            vscode_editor.setValue(newValue);
        }
    };
})