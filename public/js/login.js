if($('#login-form').length > 0){
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        send_api_req('GET', '/api/v1/login', {
          email: document.getElementById('login-email').value,
          password: document.getElementById('login-password').value
        }, function(err, xhr){
          if(err){
            console.log(err)
          } else {
            console.log(xhr.status, xhr.responseText)
          }
        }
        , document.getElementById('login-submit'))
    });
}