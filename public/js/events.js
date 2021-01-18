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
        events_DataTable.row.add([
          key,
          event.nomEvent,
          event.type_event_id,
          event.description,
          event.dateDebut,
          event.dateFin,
          '<a class="btn btn-sm btn-danger" onclick="delete_event(\''+event._id.toString()+'\')"><i class="fas fa-trash"></i></a>\n'+
          '<a class="btn btn-sm btn-link" href="/event/'+event._id+'/edit" target="_blank"><i class="fas fa-edit"></i></a>'
        ]).draw(false);
      }
    }
  })
}

function delete_event(event_id){
  Swal.fire({
    icon: "warning",
    title: "Suppression d'événement",
    html: "La suppression d'un événement entraîne la suppression de ses créneaux et des groupes qui les ont réservés. <b>Cette action est irréversible.</b>",
    showCancelButton: true,
    confirmButtonText: `Confirmer`,
    cancelButtonText: `Annuler`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.showLoading()
      api_req("DELETE", "/api/v1/event/" + event_id, {}, function(err, xhr){
        if(err){
          toastr.error((xhr.responseText ? xhr.responseText : "Une erreur inconnue s'est produite"))
        } else {
          toastr.success("Evénement supprimé !")
          events_DataTable.clear()
          populate_event_list()
        }
      })
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
              icon: 'toastr.success',
              title: 'Evènement créé',
              showConfirmButton: false,
            })
            //console.log($('#events-start-date').val())
            //console.log($('#events-start-time').val())
            //console.log(weekdays($('#events-start-date').val()))
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
