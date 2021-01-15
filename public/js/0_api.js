dataTableLanguageOptions = {
    "lengthMenu": "Afficher _MENU_ par page",
    "zeroRecords": "Aucun résultat",
    "info": "Page _PAGE_ sur _PAGES_",
    "infoEmpty": "Aucun résultat",
    "infoFiltered": "(Filtré sur _MAX_ au total)",
    "loadingRecords": "Chargement...",
    "processing":     "Chargement...",
    "search":         "Recherche:",
    "zeroRecords":    "Aucun résultat trouvé",
    "paginate": {
        "first":      "Premier",
        "last":       "Dernier",
        "next":       "Suivant",
        "previous":   "Précédent"
    },
}


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

function api_req(method, url, fields, callback, btn = undefined){
    dataform = ""
    fields['_csrf'] = req_csrfToken
    for(const [field, value] of Object.entries(fields)){
        dataform += field + "=" + encodeURI(value) + "&"
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
        xhrFields: { withCredentials: true },
        data: dataform,
        complete: function(xhr, status){
            if(btn != undefined){
                btn.innerHTML = btnVal
                btn.disabled = false
            }
        },
        error: function(xhr, status, err){
          callback(true, xhr)
        },
        success: function(data, status, xhr){
          callback(false, xhr)
        }
    });
}