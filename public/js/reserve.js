var calendar_user, calendarEl

document.addEventListener('DOMContentLoaded', function() {
  calendarEl = document.getElementById('calendar_user');
  calendar_user = buildCalendarUser(calendarEl);

  calendar_user.on('eventClick', function(info){
  Swal.fire({
    title: 'Que voulez-vous faire?',
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: 'Réserver',
    cancelButtonText:'Annuler',
    confirmButtonColor: '#34c924',
    }).then((result) => {
  
      if (result.isConfirmed) {
        Swal.fire('Créneau réservé: ' + info.event.title,'','success')
        info.el.style.backgroundColor = 'red';
        //il faut récupérer le groupe de l'utilisateur
        calendar_user.getEventById(info.event.id).setExtendedProp('group', user.group_id);
      }
  })
  });
  calendar_user.render();//affiche le calendrier
});




function buildCalendarUser(calendarEl){
  return new FullCalendar.Calendar(calendarEl, {   
    themeSystem: 'bootstrap',
    handleWindowResize: true,
    windowResize: function(arg) {
      calendarEl.innerHTML = ""
      calendar_user = buildCalendarUser(calendarEl)
      calendar_user.render()
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

    //events:'/api/v1/event/'+event_id+'/creneaux',
    events: [
      {
        title: 'Salle 201',
        start: '2021-01-15T13:30:00',
      }
      ]

   });
}


function changeEventColor(calendarEl){
  var events = calendarEl.getEvents();
  for (ev in events){
    if (ev.extendedProps.groups == null){
      ev.el.style.backgroundColor = '#cecece';
    }
  }
}

changeEventColor(calendar_user);


function zoomOutMobile() {
  var viewport = document.querySelector('meta[name="viewport"]');

  if ( viewport ) {
    viewport.content = "initial-scale=0.5";
    viewport.content = "width=600";
  }
}

zoomOutMobile();


/* Join a group 
if($('#choose-group-form').length > 0){
    $('#choose-group-form').on('submit', function(e) {
        e.preventDefault();
        api_req('POST', '/api/v1/user/group/'+$('#group-name-chosen').val()+'/join', {
          user_id: user.user_id
        }, function(err, xhr){
          if(!err){
            Swal.fire({
              icon: 'success',
              title: 'Affectation au groupe en cours...',
              text: "Vous serez redirigé dans quelques instants",
              showConfirmButton: false,
            })
            Swal.showLoading()

            setTimeout(() => {
              window.location.href = '/profile'
            }, 2000)
          }else{
            toastr.error('<b>Echec lors de l\'affectation du groupe</b><br>' + xhr.responseText)
          }
        }, document.getElementById('choose-group-submit'))
    });
}*/

var pdf = new jsPDF("portrait", "in", "letter");
pdf.setFontSize(20);
pdf.text(0.5, 1, "Calendar");
var blob = pdf.output("blob");