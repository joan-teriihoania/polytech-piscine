var calendar_user, calendarEl


document.addEventListener('DOMContentLoaded', function() {
  calendarEl = document.getElementById('calendar_user');
  calendar_user = buildCalendarUser(calendarEl);
  
  calendar_user.on('eventClick', function(info){
    Swal.fire({
      title: 'Que voulez-vous faire ?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Réserver',
      cancelButtonText:'Annuler',
      confirmButtonColor: '#34c924',
      }).then((result) => {
        if (result.isConfirmed) {
          api_req("POST", '/api/v1/creneau/'+info.event.id+'/reserve', {}, function(err, xhr){
            if(!err){
              toastr.success("Créneau réservé !")
              populate_events(calendar_user)
            } else {
              toastr.error(xhr.responseText)
            }
          })
        }
    })
  });
  calendar_user.render();//affiche le calendrier
  populate_events(calendar_user)
});




function buildCalendarUser(calendarEl){
  return new FullCalendar.Calendar(calendarEl, {   
    themeSystem: 'bootstrap',
    handleWindowResize: true,
    windowResize: function(arg) {
      calendarEl.innerHTML = ""
      calendar_user = buildCalendarUser(calendarEl)
      calendar_user.render()
      populate_events(calendar_user)
    },

    initialView: 'timeGridWeek', //affichage par défaut
    initialDate: '2021-01-13', //date initiale
    locale: 'fr',// choix langue 

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },//affichage de l'en-tête du calendrier

    aspectRatio: 1.78,// format calendrier 
    hiddenDays: [0], // permet de cacher le dimanche 

    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    // heures de début et de fin de la journée 

    allDaySlot: false,// enlève l'affichage des évènements journaliers
    expandRows: true,// ajuste la taille des lignes 
  });
}

function populate_events(calendar){
  api_req("GET", '/api/v1/event/'+window.location.pathname.split('/')[2]+'/creneaux', {}, function(err, xhr){
    if(!err){
      calendar.removeAllEvents()
      for(const [index, creneau] of Object.entries(xhr.responseJSON)){
        calendar.addEvent({
          id: creneau._id,
          title: creneau.group ? creneau.group.groupname : "Libre",
          start: creneau.date,
          backgroundColor: creneau.group ? "red" : undefined
        })
      }
    } else {
      Swal.fire("Nous n'avons pas pu charger le planning", '', 'error')
    }
  })
}


function zoomOutMobile() {
  var viewport = document.querySelector('meta[name="viewport"]');

  if ( viewport ) {
    viewport.content = "initial-scale=0.5";
    viewport.content = "width=600";
  }
}

zoomOutMobile();


