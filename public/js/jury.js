/*var events_DataTable

$(document).ready(function(){
    events_DataTable = $('#events-list').DataTable({
      "language": dataTableLanguageOptions
    });

    if($('#events-list').length > 0){
      populate_event_list()
    }
});

function populate_event_list(){
  api_req("GET", "/api/v1/event", {}, function(err, xhr){
    if(!err){
      for(const [key, event] of Object.entries(xhr.responseJSON)){
        data = [
          key,
          event.nomEvent,
          event.type_event_id,
          event.description,
          event.dateDebut,
          event.dateFin,
                '<a class="btn btn-sm btn-danger" onclick=""><i class="fas fa-trash"></i></a>\n'+
                '<a class="btn btn-sm btn-link" href="/event/'+event._id+'/edit"><i class="fas fa-edit"></i></a>'
        ]
        var newRow = events_DataTable.row.add(data).draw(false);
      }
    }
  })
}*/

var creneaux_DataTable

$(document).ready(function(){
    creneaux_DataTable = $('#creneaux-list').DataTable({
      "language": dataTableLanguageOptions,
      dom: 'Bfrtip',
      buttons: [
          'copy', 'csv', 'excel', 'pdf'
      ]
    });

    if($('#creneaux-list').length > 0){
      populate_creneaux_list()
    }
});

function populate_creneaux_list(){
  api_req("GET", "/api/v1/event", {}, function(err, xhr){
    if(!err){
      for(const [key, event] of Object.entries(xhr.responseJSON)){
        api_req("GET", '/api/v1/event/'+event._id.toString()+'/creneaux', {}, function(err, xhr){
          if(!err){
            for(const [key, creneau] of Object.entries(xhr.responseJSON)){
              date = new Date(Date.parse(creneau.start))
              data = [
                event.nomEvent,
                date.getDate() + "/" + (date.getMonth().toString().length < 2 ? "0" : "") + (date.getMonth()+1) + "/" + date.getFullYear(),
                creneau.group ? creneau.group.groupname : "Aucun",
                date.getHours() + "h" + (date.getMinutes().toString().length < 2 ? "0" : "") + date.getMinutes(),
                creneau.jury.length > 0 ? creneau.jury.map((examinateur) => {
                  console.log(examinateur)
                  return examinateur.nomExaminateur + " " + examinateur.prenomExaminateur
                }).join('<br>') : "Aucun"
              ]
              var newRow = creneaux_DataTable.row.add(data).draw(false);
            }
          }
        })
      }
    }
  })
}