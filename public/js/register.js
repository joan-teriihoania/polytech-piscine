if($('#register-form').length > 0){
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        api_req('POST', '/api/v1/register', {
          firstName: $('#register-name').val(),
          lastName: $('#register-firstname').val(),
          email: $('#register-email').val(),
          password: $('#register-password').val(),
          password_confirm: $('#register-password-confirm').val(),
          promo_id: $('#register-promo_id').val(),
          group_id: "Aucun"
        }, function(err, xhr){
          if(!err){
            Swal.fire({
              icon: 'success',
              title: 'Compte créé!',
              text: "Vous serez redirigé dans quelques instants",
              showConfirmButton: false,
            })
            Swal.showLoading()
            setTimeout(() => {
              window.location.href = '/'
            }, 2000)
          }else{
            toastr.error('<b>Echec de la création du compte</b><br>' + xhr.responseText)
          }
        }, document.getElementById('register-form-submit'))
    });
}