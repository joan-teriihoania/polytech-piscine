async function change_title_event(){
  const {value: newTitle} = await Swal.fire({
    title: "Changer le titre de l'évènement",
    html:
      '<label>Saisir le nouveau titre </label><input id="titre" class="mt-0 form-control">',

    focusConfirm: false,
    preConfirm: () => {
      return document.getElementById('titre').value
    }
  })

  if(newTitle){
    $('#title-event-edit').html(newTitle)
  }
}

async function change_type_event(){
  const {value: newType} = await Swal.fire({
    title: "Changer le type de l'évènement",
    html:
      '<select id="eventTypeOptions" class="form-control">'+
      '   <option value="Projet">Projet</option>'+
      '   <option value="Stage">Stage</option>'+
      '</select>',

    focusConfirm: false,
    preConfirm: () => {
      return document.getElementById('eventTypeOptions').value
    }
  })

  if(newType){
    $('#type-event-edit').html(newType)
  }
}

async function change_description_event(){
  const {value: newDescription} = await Swal.fire({
    title: "Changer la description de l'évènement",
    html:
      '<label>Saisir la nouvelle description </label><input id="description" class="mt-0 form-control">',

    focusConfirm: false,
    preConfirm: () => {
      return document.getElementById('description').value
    }
  })

  if(newDescription){
    $('#description-event-edit').html(newDescription)
  }
}

var events_DataTable

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
}


/* Create an event */
if($('#events-form').length > 0){
    $('#events-form').on('submit', function(e) {
        e.preventDefault();
        api_req('PUT', '/api/v1/event', {
          nomEvent : $('#events-name').val(),
          type_event_id : $('#events-type').val(),
          description : $('#events-description').val(),
          promo_id : $('#events-promo').val(),
          dateDebut : $('#events-start-date').val(),
          dateFin : $('#events-end-date').val(),
          heureDebut : $('#events-start-time').val(),
          dureeCreneau : $('#events-duration').val(),
          heurePause : $('#events-break-time').val(),
          heureReprise : $('#events-resume-time').val(),
          heureFin : $('#events-end-time').val()
        }, function(err, xhr){
          if(!err){
            Swal.fire({
              icon: 'success',
              title: 'Création de l\'évènement en cours...',
              text: "Vous serez redirigé dans quelques instants",
              showConfirmButton: false,
            })
            Swal.showLoading()

            setTimeout(() => {
              window.location.href = '/admin/events'
            }, 2000)
          }else{
            toastr.error('<b>Echec lors de la création de l\'évènement</b><br>' + xhr.responseText)
          }
        }, document.getElementById('events-submit'))
    });
}
