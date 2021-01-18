/* Create a group */
if($('#create-group-form').length > 0){
    $('#create-group-form').on('submit', function(e) {
        e.preventDefault();
        api_req('PUT', '/api/v1/group', {
          groupname : $('#group-name').val(),
          event_id : user_event_id,
          description : $('#group-description').val(),
          nomTuteurPolytech : $('#tpol-name').val(),
          prenomTuteurPolytech : $('#tpol-firstname').val(),
          nomTuteur : $('#t-name').val(),
          prenomTuteur : $('#t-firstname').val(),
          nomEntreprise : $('#company-name').val()
        }, function(err, xhr){
          if(!err){
            Swal.fire({
              icon: 'success',
              title: 'Création du groupe en cours...',
              text: "Vous serez redirigé dans quelques instants",
              showConfirmButton: false,
            })
            Swal.showLoading()
            
            api_req('POST', '/api/v1/user/group/'+xhr.responseJSON._id+'/join', {
              user_id: user._id
            }, function(err, xhr){
              window.location.href = '/profile'
            })
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
      '   <option value="IG3 2020">IG3</option>'+
      '   <option value="IG4 2020">IG4</option>'+
      '   <option value="IG5 2020">IG5</option>'+
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
              icon: 'toastr',
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

/* Select your promotion */
if($('#promotion-form').length > 0){
    $('#promotion-form').on('submit', function(e) {
        e.preventDefault();
        api_req('POST', '/api/v1/event', {
          promo_id : $('#profile-promotion').val(),
        }, function(err, xhr){
          if(!err){
            Swal.fire({
              icon: 'success',
              title: 'Profil mis à jour',
              showConfirmButton: false,
            })
            Swal.showLoading()
            setTimeout(() => {
              window.location.href = '/profile'
            }, 2000)
          }else{
            toastr.error('<b>Echec lors de la modification de la promotion</b><br>' + xhr.responseText)
          }
        }, document.getElementById('promotion-submit'))
    });
}


/* Edit password */
if($('#change-password-form').length > 0){
    $('#change-password-form').on('submit', function(e) {
        e.preventDefault();
        if($('#newpassword1')){
          api_req('POST', '/api/v1/profile', {
            oldpassword: $('#oldpassword').val(),
            newpassword1: $('#newpassword1').val(),
            newpassword2: $('#newpassword2').val(),
            email: user.email
          }, function(err, xhr){
            if(!err){
              toastr.success('Le mot de passe a bien été modifié')
            }else{
              toastr.error('<b>Echec lors de la modification du mot de passe</b><br>' + xhr.responseText)
            }
          }, document.getElementById('change-password-submit'))
        }
    });
}
