var calendar_admin, calendarEl
event_id = window.location.pathname.split('/')[2]

//creer tous les creneaux a la créatin de l'event 
/*function create_all_creneaux(datedebut,datefin,heuredebutjour,heurefinjour,heuredebutdej,heurefindej,duree){
  let jourdate=new Date(datedebut+'T01:00:00')
  let joursemaine=jourdate.getday()
  let jour=datedebut
  let heure=heuredebutjour
  let salle='aucune'
  //si le jour de debut est un dimanche 
  if (joursemaine==0){
    //il faut ajouter 1 jour mais je ne sais pas comment faire
    jour = "SELECT jour + INTERVAL 1 DAY";
  } 
  //si le jour de debut est un samedi 
  else if (joursemaine==6){
    //il faut ajouter 2 jour mais je ne sais pas comment 
    jour = "SELECT jour + INTERVAL 2 DAY";
  }
  while jour <= datefin {
    while (heure<heurefinjour-duree){
      if (((heure<=heuredebutdej-duree) || (heure>=heurefindej)){
        calendar_admin.addEvent({
                      title: ('Salle ' + salle),
                      start: (new Date(jour + 'T' + heure + ':00'),
                      id: (salle + new Date(jour + 'T' + heure + ':00')),

                      extendedProps: {
                      salle: salle,
                      jury:[],
                      group:"aucun",
                      },
                    });
        api_req("PUT","/api/v1/event/"+event_id+"/créneaux/")
      }
      heure=heure+duree
    }
    jourdate=new Date(jour+'T01:00:00')
    joursemaine=jourdate.getday()
    //si le jour est un vendredi 
    if (joursemaine==5){
      jour = "SELECT jour + INTERVAL 3 DAY";
    } 
    else {
      jour = "SELECT jour + INTERVAL 1 DAY";
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
  
  calendar_admin.on('eventChange', function(info){
    api_req("POST", '/api/v1/creneau/'+info.event.id, {
        start: info.event.startStr,
        end: info.event.endStr
      }, function(err, xhr){
      if(err){toastr.error(xhr.responseText)}
      populate_events(calendar_admin)
    })
  })
  
  api_req("GET", "/api/v1/group", {}, function(err, xhr){
    groups = xhr.responseJSON
    if(!err){
      api_req("GET", "/api/v1/examinateur", {}, function(err, xhr){
        if(!err){
          jurys = xhr.responseJSON
          calendar_admin.on('eventClick', function(info){
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
                          return '<option value="'+jury._id+'" '+
                            info.event.extendedProps.jury.map((event_jury) => {
                              return (event_jury._id == jury._id) ? 'selected="selected"' : ""
                            }).join('') +
                          '">'+jury.nomExaminateur + " " + jury.prenomExaminateur+'</option>'
                        }).join('\n') +

                      '</select>'+
                      '<small><i>Rester appuyer sur CTRL permet de selectionner plusieurs jurys</i></small>'+
                      '</div>'+
                      //modifier le groupe qui a reserver le créneau 
                      '<label>Le groupe sur ce créneau :</label><br>'+
                      '<select class="form-control" list="groupListOptions" id="select-groups" required/>'+
                        "<option value=''>Aucun</option>" +
                        groups.map((group) => {return '<option value="'+group._id+'" '+
                            (info.event.extendedProps.group ? (info.event.extendedProps.group._id == group._id ? 'selected="selected"' : "") : "") +
                          '">'+group.groupname+'</option>'
                        }).join('\n') +
                      '</select>'+
                      '</div>',
            focusConfirm: false,
            preConfirm: () => {
              var jury = []
              for(const [i, member] of Object.entries($('#select-jurys').val())){
                jury.push({examinateur_id: member})
              }

              return {
                salle: document.getElementById('newsallet').value,
                group_id: document.getElementById('select-groups').value,
                jury: jury
              }
            },                                              
            showDenyButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Modifier',
            denyButtonText: 'Supprimer',
            cancelButtonText:'Annuler',
            confirmButtonColor: '#34c924',
            cancelButtonColor: '#3085d6',
            }).then((result) => {
          changecreneau = result
          if (result.isConfirmed){
            api_req("POST", '/api/v1/creneau/'+info.event.id, {
              salle: result.value.salle,
              group_id: result.value.group_id
            }, function(err, xhr){
              api_req("POST", '/api/v1/creneau/'+info.event.id + "/jury", {
                jury: JSON.stringify(result.value.jury)
              }, function(jerr, jxhr){
                if(!jerr){
                  toastr.success("Créneau modifié !")
                  setTimeout(function(){
                    populate_events(calendar_admin)
                  }, 1000)
                } else {
                  toastr.error(jxhr.responseText)
                }
              })
            })
          } else if (result.isDenied) {
            Swal.fire({
              title: 'Êtes-vous sûr de vouloir supprimer le créneau ?',
              text: "Cette action est irréversible",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Supprimer',
              cancelButtonText: 'Annuler',
            }).then((result) => {
                if (result.isConfirmed) {
                  api_req("DELETE", '/api/v1/creneau/'+info.event.id, {}, function(err, xhr){
                    if(!err){
                      toastr.success("Créneau supprimé !")
                      populate_events(calendar_admin)
                    } else {
                      toastr.error(xhr.responseText)
                    }
                  })
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
  populate_events(calendar_admin)
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
    eventDurationEditable: false,
    windowResize: function(arg) {
      calendarEl.innerHTML = ""
      calendar_admin = buildCalendarAdmin(calendarEl)
      calendar_admin.render()
      populate_events(calendar_admin)
    },

    initialView: 'timeGridWeek', /*affichage par défaut*/
    initialDate: '2021-01-13', /*date initiale*/
    locale: 'fr',/* choix langue */
    editable: true, /* Créneaux modifiables */

    headerToolbar: {
      left: 'prev,next today addEventButton generateEventsButton',
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
      generateEventsButton: {
        text: "Générer",
        click: function generate_creneau(){
          Swal.fire({
            title: 'Générer les créneaux',
            html: "Tous les créneaux durant les plages disponibles de l'événement seront générés. Cette action peut générer un très grand nombre de créneaux.<br><br><b>Cette action réinitialisera tous les créneaux de l'événement.</b>",
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: `Générer`,
            cancelButtonText: `Annuler`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.showLoading()
              api_req("GET", '/api/v1/event/'+window.location.pathname.split('/')[2], {},(err, xhr) => {
                event = xhr.responseJSON
                dureeCreneau = event.dureeCreneau.split(':')
                api_req("DELETE", '/api/v1/event/'+window.location.pathname.split('/')[2] + "/clear", {},(err, xhr) => {
                  if(!err){

                    Swal.fire({
                      title: "Génération...",
                      html: "Nous générons les créneaux de l'événement <i>"+event.nomEvent+"</i><br>Veuillez patienter...",
                      footer: "<i id='generate-creneau-date'></i>"
                    })
                    Swal.showLoading()

                    currentDate = new Date(Date.parse(event.dateDebut))
                    endDate = new Date(Date.parse(event.dateFin))
                    created = 0
                    
                    currentTime = new Date(currentDate.getTime())
                    currentTime.setHours(event.heureDebut.split(':')[0], event.heureDebut.split(':')[1], 0, 0)

                    endTime = new Date(currentDate.getTime())
                    endTime.setHours(event.heureFin.split(':')[0], event.heureFin.split(':')[1])
                    var loop

                    loop = setInterval(function(){
                      if(currentDate.getTime() <= endDate.getTime()){
                        temp = new Date(currentTime.getTime())
                        temp.addHours(parseInt(dureeCreneau[0])).addMinutes(parseInt(dureeCreneau[1]))
                        if(currentTime.getTime() < endTime.getTime() && temp.getTime() < endTime.getTime() && currentTime.getDay() != 6 && currentTime.getDay() != 0){
                          startPause = new Date(currentDate.getTime())
                          startPause.setHours(event.heurePause.split(':')[0], event.heurePause.split(':')[1])

                          endPause = new Date(currentDate.getTime())
                          endPause.setHours(event.heureReprise.split(':')[0], event.heureReprise.split(':')[1])

                          if(!((temp.getTime() > startPause.getTime() && temp.getTime() < endPause.getTime()) || (currentTime.getTime() > startPause.getTime() && currentTime.getTime() < endPause.getTime()))){
                            // si pas dans la pause
                            api_req("PUT", '/api/v1/event/'+window.location.pathname.split('/')[2]+'/creneau', {
                              salle: "",
                              start: currentTime.toISOString(),
                              end: temp.toISOString(),
                              group_id: ""
                            }, function(err, xhr){
                              created += 1
                              $('#generate-creneau-date').html(currentTime.toISOString())
                            })
                            currentTime.addHours(parseInt(dureeCreneau[0])).addMinutes(parseInt(dureeCreneau[1]))
                          } else {
                            currentTime.setHours(endPause.getHours())
                            currentTime.setMinutes(endPause.getMinutes())
                          }
                        } else {
                          currentDate.addDays(1)
                          currentTime = new Date(currentDate.getTime())
                          currentTime.setHours(event.heureDebut.split(':')[0], event.heureDebut.split(':')[1], 0, 0)
                          endTime = new Date(currentDate.getTime())
                          endTime.setHours(event.heureFin.split(':')[0], event.heureFin.split(':')[1])
                        }
                      } else {
                        clearInterval(loop)
                        populate_events(calendar_admin)
                        Swal.fire(
                          'Génération terminée',
                          'Les créneaux ont été générés avec succès!',
                          'success'
                        )
                      }
                    }, 250);
                  } else {
                    toastr.error("Nous ne pouvons pas lancer de génération de créneau pour le moment.")
                  }
                }) 
              })
            }
          })
        }
      },
      addEventButton: {
        text: 'Nouveau créneau',
        click: function create_creneau(){
          api_req("GET", '/api/v1/event/'+window.location.pathname.split('/')[2], {},async function(err, xhr) {
            if(err) return toastr.error("Nous ne pouvons pas créer de créneaux pour le moment.")
            event = xhr.responseJSON
            dureeCreneau = event.dureeCreneau.split(':')

            const {value: newcreneau} = await Swal.fire({
              title: "Créer un créneau",
              html:
                '<label>Saisir le jour du créneau que vous voulez ajouter</label><input id="newdate" placeholder="MM-JJ" class="mt-0 form-control"><br>' +
                '<label>Saisir l\'heure de début du créneau </label><input id="hour" placeholder="00:00" class="mt-0 form-control" type="time"><br>' +
                '<label>Saisir la salle </label><input placeholder="ex:b31s201" id="salle" class="mt-0 form-control"><br>',
              focusConfirm: false,
              preConfirm: () => {
                var newcreneau = [
                  document.getElementById('newdate').value,
                  document.getElementById('hour').value,
                  document.getElementById('salle').value
                ]
                
                if(newcreneau){
                  var date = new Date('2021-' + newcreneau[0] + 'T' + newcreneau[1] + ':00')
                  if (!isNaN(date.valueOf())) { // valid?
                    api_req("PUT", '/api/v1/event/'+window.location.pathname.split('/')[2]+'/creneau', {
                      salle: newcreneau[2],
                      start: date.toISOString(),
                      end: date.addHours(parseInt(dureeCreneau[0])).addMinutes(parseInt(dureeCreneau[1])).toISOString(),
                      group_id: ""
                    }, function(err, xhr){
                      if(err){toastr.error(xhr.responseText)} else {
                        toastr.success("Créneau ajouté à l'événement !")
                        populate_events(calendar_admin)
                      }
                    })
                  } else {
                    Swal.showValidationMessage("La date fournie est invalide.")
                  }
                }
              }
            })
          })
        }
        }},
   });
}


function populate_events(calendar){
  api_req("GET", '/api/v1/event/'+window.location.pathname.split('/')[2]+'/creneaux', {}, function(err, xhr){
    if(!err){
      calendar.removeAllEvents()
      for(const [index, creneau] of Object.entries(xhr.responseJSON)){
        calendar.addEvent({
          id: creneau._id,
          title: creneau.group ? "Groupe: " + creneau.group.groupname : "Libre",
          salle: creneau.salle ? creneau.salle : "",
          jury: creneau.jury,
          group: creneau.group,
          start: creneau.start,
          end: creneau.end,
          backgroundColor: creneau.group ? (creneau.group._id == user.group_id ? "green" : "red") : undefined
        })
      }
    } else {
      Swal.fire("Nous n'avons pas pu charger le planning", '', 'error')
    }
  })
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

