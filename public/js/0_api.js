function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function send_api_req(method, url, fields, callback, btn = undefined){
    url += "?"
    dataform = new FormData()
    for(const [field, value] of Object.entries(fields)){
        if(method == "POST"){
            dataform.append(field, value)
        } else {
            url += field + "=" + encodeURI(value) + "&"
        }
    }

    var btnVal = ""
    if(btn != undefined){
        btn.disabled = true
        btnVal = btn.innerHTML
        btn.innerHTML = "<i class='fas fa-circle-notch fa-spin'></i>"
    }
    

    $.ajax({
        url: url,
        type: method,
        data: dataform,
        contentType: false,
        processData: false,
        complete: function(xhr, status){
            if(btn != undefined){
                btn.innerHTML = btnVal
                btn.disabled = false
            }
        },
        error: function(xhr, status, err){
          callback(err, xhr)
        },
        success: function(data, status, xhr){
          callback(undefined, xhr)
        }
    });
}