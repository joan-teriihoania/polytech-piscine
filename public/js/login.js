if($('#login-form').length > 0){
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        api_req('POST', '/api/v1/login', {
          email: $('#login-email').val(),
          password: $('#login-password').val()
        }, function(err, xhr){
          if(!err){
            Swal.fire({
              icon: 'success',
              title: 'Vous êtes connecté!',
              text: "Vous serez redirigé dans quelques instants",
              showConfirmButton: false,
            })
            Swal.showLoading()

            setTimeout(() => {
              window.location.href = '/profile'
            }, 2000)
          }else{
            toastr.error('<b>Echec de l\'authentification</b><br>' + xhr.responseText)
          }
        }, document.getElementById('login-form-submit'))
    });
}