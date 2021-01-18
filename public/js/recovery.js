/* mot de passe oublié */
if($('#recovery-form').length > 0){
    $('#recovery-form').on('submit', function(e) {
        e.preventDefault();
        if($('#newpassword1')){
          api_req('POST', '/api/v1/recovery', {
            email: $('#recovery-email').val(),
          }, function(err, xhr){
            if(!err){
              toastr.success('Un email contenant un mot de passe temporaire vous a été envoyé.')
            }else{
              toastr.error("<b>Echec lors de l'envoi du mail, veuillez réessayer.</b><br>" + xhr.responseText)
            }
          }, document.getElementById('recovery-form-submit'))
        }
    });
}