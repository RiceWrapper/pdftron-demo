function bindDataToForm(formId, data, optMapping = {}) {
    let inputs = $(formId).find("input[name], select[name], a[name], img[name], textarea[name]");
    inputs.each(i => {
        let key = optMapping[inputs[i].name] ? optMapping[inputs[i].name] : inputs[i].name;
        let value = data[key];
        if (value != null) {
            if (inputs[i].tagName === "INPUT") {
                switch (inputs[i].type) {
                    case "checkbox":
                        if (Array.isArray(value)) {
                            if (value.indexOf(inputs[i].value) > -1)
                                $(inputs[i]).prop("checked", true);
                        } else {
                            $(inputs[i]).prop("checked", (inputs[i].value == value));
                        }
                        break;
                    default:
                        $(inputs[i]).val(value);
                        break;
                }
            }
            else if (inputs[i].tagName === "SELECT")
                $(inputs[i]).val(value);
            else if (inputs[i].tagName === "TEXTAREA")
                $(inputs[i]).val(value);
            else if (inputs[i].tagName === "A")
                $(inputs[i]).text(value);
            else if (inputs[i].tagName === "IMG")
                $(inputs[i]).attr("src", value);
        }
    });
}

function disableForm(id) {
    $(id).find("input[name], select[name], textarea[name]").prop("readonly", true).prop("disabled", true);
}

function enableForm(id) {
    $(id).find("input[name], select[name], textarea[name]").prop("readonly", false).prop("disabled", false);
}

function validateForm(formId) {
    let inputs = $(formId).find("input[name], select[name], textarea[name]");
    inputs.removeClass("invalid");
    let isOK = true;
    inputs.each(i => {
        if (["INPUT", "TEXTAREA"].indexOf(inputs[i].tagName) > -1) {
            if (inputs[i].required && !inputs[i].value) {
                $(inputs[i]).addClass("invalid");
                isOK = false;
            }
            if (inputs[i].pattern) {
                var regex = new RegExp(inputs[i].pattern, 'g');
                if (!regex.test(inputs[i].value)) {
                    $(inputs[i]).addClass("invalid");
                    isOK = false;
                }
            }
            if (inputs[i].number && inputs[i].value) {
                if (isNaN(inputs[i].value)) {
                    $(inputs[i]).addClass("invalid");
                    isOK = false;
                }
            }
            if (inputs[i].min && inputs[i].value) {
                if (parseInt(inputs[i].value) < parseInt(inputs[i].min)) {
                    $(inputs[i]).addClass("invalid");
                    isOK = false;
                }
            }
            if (inputs[i].max && inputs[i].value) {
                if (parseInt(inputs[i].value) > parseInt(inputs[i].max)) {
                    $(inputs[i]).addClass("invalid");
                    isOK = false;
                }
            }
            // switch (inputs[i].type) {
            //     case "checkbox":
            //         $(inputs[i]).prop("checked", false);
            //         break;
            //     default:
            //         $(inputs[i]).val('');
            //         break;
            // }
        } else if (inputs[i].tagName === "SELECT") {
            if (inputs[i].required && !inputs[i].value) {
                $(inputs[i]).addClass("invalid");
                isOK = false;
            }
        }
    });
    return isOK;
}

function clearForm(formId) {
    let inputs = $(formId).find("input[name], select[name], a[name], textarea[name]");
    inputs.removeClass("invalid");
    inputs.each(i => {
        if (inputs[i].tagName === "INPUT") {
            switch (inputs[i].type) {
                case "checkbox":
                    $(inputs[i]).prop("checked", false);
                    break;
                default:
                    $(inputs[i]).val('');
                    break;
            }
        }
        else if (inputs[i].tagName === "SELECT")
            $(inputs[i]).val('');
        else if (inputs[i].tagName === "TEXTAREA")
            $(inputs[i]).val('');
        else if (inputs[i].tagName === "A")
            $(inputs[i]).text('');
    });
}

function getInputValues(id) {
    // console.log("getInputValues");
    let data = {};
    let inputs = $(id).find('input[name], select[name], textarea[name]');
    inputs.each(i => {
        if (inputs[i].tagName == 'SELECT') {
            data[inputs[i].name] = htmlencode(inputs[i].value);
        } else if (inputs[i].tagName == 'TEXTAREA') {
            data[inputs[i].name] = htmlencode(inputs[i].value);
        } else if (inputs[i].tagName == 'INPUT') {
            switch (inputs[i].type) {
                case "checkbox":
                    if (!data[inputs[i].name]) {
                        data[inputs[i].name] = [];
                    }
                    if (inputs[i].checked) {
                        data[inputs[i].name].push(htmlencode(inputs[i].value));
                    }
                    break;
                case "hidden":
                case "text":
                case "search":
                case "number":
                case "password":
                default:
                    data[inputs[i].name] = htmlencode(inputs[i].value || "").trim();
                    break;
            }
        }
    });
    return data;
}

function getInput(id, name) {
    return $(id).find(`input[name="${name}"], select[name="${name}"], textarea[name="${name}"], a[name="${name}"]`);
}

function htmlencode(str) {
    // return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

String.format = (str, ...params) => {
    if (!str) return "";
    for (var i = 0; i < params.length; i++) {
        str = str.replace(RegExp("\\{" + i + "\\}", "gm"), params[i]);
    }
    return str;
};