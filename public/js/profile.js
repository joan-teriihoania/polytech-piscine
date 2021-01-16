
/* Create a group */
if($('#create-group-form').length > 0){
    $('#create-group-form').on('submit', function(e) {
        e.preventDefault();
        api_req('PUT', '/api/v1/group', {
          groupname : $('#group-name').val(),
          event_id : user_event_id
        }, function(err, xhr){
          if(!err){
            Swal.fire({
              icon: 'success',
              title: 'Création du groupe en cours...',
              text: "Vous serez redirigé dans quelques instants",
              showConfirmButton: false,
            })
            Swal.showLoading()

            setTimeout(() => {
              window.location.href = '/profile'
            }, 2000)
          }else{
            toastr.error('<b>Echec lors de la création du groupe</b><br>' + xhr.responseText)
          }
        }, document.getElementById('create-group-submit'))
    });
}

async function change_user_promo(){
  const {value: newPromo} = await Swal.fire({
    title: "Changer votre promotion",
    html:
      '<select id="promoListOptions" class="form-control">'+
      '   <option value="IG3">IG3</option>'+
      '   <option value="IG4">IG4</option>'+
      '   <option value="IG5">IG5</option>'+
      '</select>',
    focusConfirm: false,
    preConfirm: () => {
      return document.getElementById('promoListOptions').value
    }
  })

  if(newPromo){
    $('#account-user-promotion').html(newPromo)
  }
}

/* Join a group */
if($('#choose-group-form').length > 0){
    $('#choose-group-form').on('submit', function(e) {
        e.preventDefault();
        api_req('POST', '/api/v1/user/group/'+$('#group-name-chosen').val()+'/join', {
          user_id: user._id
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
}

/* Edit password */
if($('#change-password-form').length > 0){
    $('#change-password-form').on('submit', function(e) {
        e.preventDefault();
        api_req('POST', '/api/v1/profile', {
          oldpassword: $('#oldpassword').val()
          newpassword1: $('#newpassword1').val()
          newpassword2: $('#newpassword2').val()
          email: user.email
        }, function(err, xhr){
          if(!err){
            toastr.success('<b>Le mot de passe a bien été modifié</b><br>' + xhr.responseText)
          }else{
            toastr.error('<b>Echec lors de la modification du mot de passe</b><br>' + xhr.responseText)
          }
        }, document.getElementById('change-password-submit'))
    });
}

/*async function create_creneau(){
  const {value: newcreneau} = await Swal.fire({
    title: "Créer votre créneau",
    html:
      '<label>Saisir le jour du créneau que vous voulez ajouter</label><input id="newdate" class="mt-0 form-control"><small><i>format MM-JJ</i></small>' +
      '<label>Saisir l\'heure de début du créneau </label><input id="hour" class="mt-0 form-control"><small><i>format 00:00</i></small>' +
      '<label>Saisir la salle </label><input id="salle" class="mt-0 form-control">',
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
            calendar.addEvent({
              title: ('Salle ' + newcreneau[2]),
              start: date,
              id: (salle + date),
            });
            alert('Great. Now, update your database...');
          } else {
            alert('Invalid date.');
          }
}*/