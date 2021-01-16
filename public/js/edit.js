var calendar_admin, calendarEl
event_id = window.location.pathname.split('/')[2]

function save_creneaux(){
  events = calendar_admin.getEvents()
  for(const [key, event_] of Object.entries(events)){
    event = event_._def.extendedProps
    console.log(event)   
    if(event._id){
      api_req("POST", "/api/v1/creneau/" + event._id, {
        date: event_.startStr,
      }, async function(err, xhr){
        if(!err){
          console.log(xhr)
        }
      })
    }
  }
}




/*function create_all_creneaux(datedebut,datefin,heuredebutjour,heurefinjour,heuredebutdej,heurefindej,durée){
  jour=datedebut
  heure=heuredebutjour
  while jour<=datefin{
    while heure<heurefinjour{
      if ((heure<=heuredebutdej-durée) || (heure>=heurefindej) && )
    }
  }
}*/

async function edit_group_creneau(){
  api_req("GET", "/api/v1/group", {}, async function(err, xhr){
    if(!err){
      groups = xhr.responseJSON
      const {value: newGroup} = await Swal.fire({
        title: "Changer le groupe",
        html:
          '<select class="form-control" list="GroupsListOptions" id="select-groups" required/>'+
                    groups.map((group) => {return '<option value="'+group._id.toString()+'">'+group.groupname+'</option>'}).join('\n') +
                  '</select>',
        focusConfirm: false,
        preConfirm: () => {
          console.log(document.getElementById('select-groups').value)
          return document.getElementById('select-groups').value
        }
      })

      if(newGroup){
        $('#edit-group-creneau').html(newGroup)
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', function() {
  calendarEl = document.getElementById('calendar_admin');
  calendar_admin = buildCalendarAdmin(calendarEl)
  
  api_req("GET", "/api/v1/group", {}, function(err, xhr){
    if(!err){
      groups = xhr.responseJSON.map((group) => {return group.groupname})
      groups.unshift('Aucun')
      api_req("GET", "/api/v1/examinateur", {}, function(err, xhr){
        if(!err){
          jurys = xhr.responseJSON.map((examinateur) => {return examinateur.nomExaminateur + " " + examinateur.prenomExaminateur})
          calendar_admin.on('eventClick', function(info){
            
            changecreneau=[null,null,null]
          Swal.fire({
            title: 'Que voulez-vous faire?',
            html:
                      //modifier la salle 
                      '<label>Modifier la salle </label><input id="newsallet" value="'+info.event.extendedProps.salle+'" class="mt-0 form-control" placeholder="example : b31s201"><br>' +
                      //ajouter un jury (à choisir parmis la liste complete des jurys) 
                      '<div class="form-group">'+
                      '<label for="juryList" class="form-label">Modifier le(s) jury(s) présents sur ce créneau</label>'+
                      '<select class="form-control" list="juryListOptions" id="select-jurys" placeholder="Sélectionnez le(s) jury(s)" required multiple="multiple"/>'+
                      
                        jurys.map((jury) => {
                          return '<option value="'+jury+'" '+
                            (info.event.extendedProps.jury.includes(jury) ? 'selected="selected"' : "") +
                          '">'+jury+'</option>'
                        }).join('\n') +

                      '</select>'+
                      '<small><i>Rester appuyer sur CTRL permet de selectionner plusieurs jurys</i></small>'+
                      '</div>'+
                      //modifier le groupe qui a reserver le créneau 
                      '<label>Le groupe sur ce créneau :</label><br>'+
                      '<select class="form-control" list="groupListOptions" id="select-groups" required/>'+
                        groups.map((group) => {return '<option value="'+group+'" '+
                            (info.event.extendedProps.group.includes(group) ? 'selected="selected"' : "") +
                          '">'+group+'</option>'
                        }).join('\n') +
                      '</select>'+
                      '</div>',
            focusConfirm: false,
            preConfirm: () => {
              console.log(info.event.extendedProps.group)
              changecreneau = [
                document.getElementById('newsallet').value,
                $('#select-jurys').val(), // renvoi une liste
                document.getElementById('select-groups').value
              ]
            },                                              
            showDenyButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Modifier',
            denyButtonText: 'Supprimer',
            cancelButtonText:'Annuler',
            confirmButtonColor: '#34c924',
            cancelButtonColor: '#3085d6',
            }).then((result) => {
          
          if (result.isConfirmed){
              Swal.fire('Saved!', '', 'success');
              //console.log(document.getElementById('newsallet').value)
            
              calendar_admin.getEventById(info.event.id).setExtendedProp('salle',changecreneau[0]);
              calendar_admin.getEventById(info.event.id).setExtendedProp('jury',changecreneau[1]);
              calendar_admin.getEventById(info.event.id).setExtendedProp('group',changecreneau[2]);
              //calendar_admin.getEventById(info.event.id).setProp('title',('salle '+ changecreneau[0]+' jurys '+changecreneau[1]+'   group '+changecreneau[3]));
              changeEventColor(calendar_admin);
              
              //ici on doit renvoyer les infos qu'on a eu 
              
              
            //info.el.style.backgroundColor = 'red';
          } 

          else if (result.isDenied) {
            Swal.fire({
              title: 'Êtes-vous sûr de vouloir supprimer le créneau?',
              text: "Cette action est irréversible",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Supprimer',
              cancelButtonText: 'Annuler',
            }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire('Créneau supprimé', '', 'success')
                  calendar_admin.getEventById(info.event.id).remove();
                }
              })
          }
          
          })
          });
        }
      })
    }
  })


  calendar_admin.render();//affiche le calendrier
});

$('#select-students').keypress(function(event){
  if(event.which == 13 && $('#select-students').val() != ""){
    event.preventDefault()
    $('#selected-students').append(template.replace(/{{ content }}/gi, $('#select-students').val()))
    $('#select-students').val('')
  }
})



function buildCalendarAdmin(calendarEl){
  return new FullCalendar.Calendar(calendarEl, {   
    themeSystem: 'bootstrap',
    handleWindowResize: true,
    windowResize: function(arg) {
      calendarEl.innerHTML = ""
      calendar_admin = buildCalendarAdmin(calendarEl)
      calendar_admin.render()
    },

    initialView: 'timeGridWeek', /*affichage par défaut*/
    initialDate: '2021-01-13', /*date initiale*/
    locale: 'fr',/* choix langue */
    editable: true, /* Créneaux modifiables */

    headerToolbar: {
      left: 'prev,next today addEventButton',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },/*affichage de l'en-tête du calendrier */

    aspectRatio: 1.78,/* format calendrier */
    hiddenDays: [0], /* permet de cacher le dimanche */

    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    /* heures de début et de fin de la journée */

    allDaySlot: false,/* enlève l'affichage des évènements journaliers */
    expandRows: true,/* ajuste la taille des lignes */

    /*eventClick: function(info) {
      jurys = ["Connard", "connasse", "oui", "non", "peut être"]
      Swal.fire({
            title: "Modifier un créneau",
            showButton: false,
            html:
              '<label>Modifier la salle info.el.title </label><input id="newsalle" value=info.el.salle class="mt-0 form-control" placeholder="example : b31s201"><br>' +
              //modifier le jury = liste des jury sur le creneau avec bouton supprimer a cote
              /*'<label>Modifier le jury</label>'+
              '<table name="jury" id="jury" class="table table-striped">'+
                '<thead><tr><th>Nom et prénom</th><th>Actions</th><tr></thead>'+
                '<tbody>'+
                '<tr><td>TERIIHOANIA Joan</td><td>'+
                  '<a class="btn btn-sm btn-danger"><i class="fas fa-trash"></i></a>'+
                '</td><tr>'+
                '</tbody>'+
              '</table><br>'+*/
              //ajouter un jury (à choisir parmis la liste complete des jurys) 
              /*'<div class="form-group">'+
              '<label for="juryList" class="form-label">Modifier le(s) jury(s) présents sur ce créneau</label>'+
              '<select class="form-control" list="juryListOptions" id="select-jurys" placeholder="Sélectionnez le(s) jury(s)" required multiple/>'+
                jurys.map((jury) => {return '<option value="'+jury+'">'+jury+'</option>'}).join('\n') +
              '</select>'+
              '<small><i>Rester appuyer sur CTRL permet de selectionner plusieurs jurys</i></small>'+
              '</div>'+
              //modifier le groupe qui a reserver le créneau 
              '<label>Le groupe sur ce créneau :</label><br>'+
              '<a class="btn btn-link" id="edit-group-creneau">{Groupe} <i class="fas fa-edit"></i></a><br><br>'+
              //bouton pour modifier 
              '<button onclick="" class="btn btn-primary mt-3" id="edit-change-creneau-submit" type="button">Modifier</button><br>'+
              '<button onclick="" class="btn btn-primary mt-3" id="edit-del-creneau-submit" type="button">Supprimer</button>',
              /*'<label>Saisir l\'heure de début du créneau </label><input type="time" id="hour" class="mt-0 form-control"><br>'+
              '<label>Saisir la salle </label><input id="salle" class="mt-0 form-control">',*/
            /*focusConfirm: false,
            preConfirm: () => {
              return changecreneau=[
                document.getElementById('newsalle').value,
                document.getElementById('select-jurys').value,
                document.getElementById('edit-group-creneau').value
                ]
            }
          })
          
          
            calendar_admin.addEvent({
              title: ('Salle ' + changecreneau[0] +'Jurys' + changecreneau[1]),
              start: date,
              id: (salle + date),
            });
        },
    */
    /* Bouton ajouter un créneau: */
     customButtons: {
      addEventButton: {
        text: 'Nouveau créneau',
        click:async function create_creneau(){
          const {value: newcreneau} = await Swal.fire({
            title: "Créer un créneau",
            html:
              '<label>Saisir le jour du créneau que vous voulez ajouter</label><input id="newdate" placeholder="MM-JJ" class="mt-0 form-control"><br>' +
              '<label>Saisir l\'heure de début du créneau </label><input id="hour" placeholder="00:00" class="mt-0 form-control"><br>' +
              '<label>Saisir la salle </label><input placeholder="ex:b31s201" id="salle" class="mt-0 form-control">',
            focusConfirm: false,
            preConfirm: () => {
              return [
                document.getElementById('newdate').value,
                document.getElementById('hour').value,
                document.getElementById('salle').value
              ]
            }
          })
          if(newcreneau){
            var date= new Date('2021-' + newcreneau[0] + 'T' + newcreneau[1] + ':00')
          }
          if (!isNaN(date.valueOf())) { // valid?
                    calendar_admin.addEvent({
                      title: ('Salle ' + newcreneau[2]),
                      start: date,
                      id: (salle + date),

                      extendedProps: {
                      salle: newcreneau[2],
                      jury:[],
                      group:"aucun",
                      },
                    });
                  } else {
                    alert('Date non valide.');
                  }
        } 
        }},
    events:'/api/v1/event/'+event_id+'/creneaux',
   });
}

/*function changeEventColor(calendarEl){
  var events = calendarEl.getEvents();
  for (ev in events){
    if (ev.extendedProps.groups != "Aucun"){
      ev.el.style.backgroundColor = '#cecece';
    }
  }
};*/



function zoomOutMobile() {
  var viewport = document.querySelector('meta[name="viewport"]');

  if ( viewport ) {
    viewport.content = "initial-scale=0.5";
    viewport.content = "width=600";
  }
}

zoomOutMobile();

