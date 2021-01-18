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

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

Date.prototype.addMinutes = function(m) {
  this.setTime(this.getTime() + (m*60*1000));
  return this;
}

Date.prototype.removeHours = function(h) {
  this.setTime(this.getTime() - (h*60*60*1000));
  return this;
}

Date.prototype.removeMinutes = function(m) {
  this.setTime(this.getTime() - (m*60*1000));
  return this;
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
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
        dataform += field + "=" + encodeURIComponent(value) + "&"
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
          if(xhr.status == 429){
            api_req(method, url, fields, function(err, xhr){
              callback(err, xhr)
            }, btn)
            return
          }

          callback(true, xhr)
        },
        success: function(data, status, xhr){
          callback(false, xhr)
        }
    });
}