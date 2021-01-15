function edit_user(userid, fields, callback, btn = undefined){
  api_req('POST', '/api/v1/user/' + userid, fields, function(err, xhr){
    if(err){
      callback(false)
    } else {
      callback(true)
    }
  }, btn)
}

function delete_group(groupid, callback, btn = undefined){
  api_req('DELETE', '/api/v1/group/' + groupid, {}, function(err, xhr){
    if(err){
      callback(false)
    } else {
      callback(true)
    }
  }, btn)
}

function edit_group(groupid, fields, callback, btn = undefined){
  api_req('POST', '/api/v1/group/' + groupid, fields, function(err, xhr){
    if(err){
      callback(false)
    } else {
      callback(true)
    }
  }, btn)
}

async function change_user_info(groupid){
  prompt_group_info(groupid, function(succ, data){
    if(succ){
      toastr.success('Informations du groupe mises à jour !')
      document.getElementById(groupid + "-firstName").innerHTML = data[0]
    } else {
      toastr.error("Une erreur s'est produite durant la mise à jour.")
    }
  })
}

function change_user_info(userid){
  prompt_user_info(userid, function(succ, data){
    if(succ){
      toastr.success('Profil mis à jour !')
      groups_DataTable.clear()
      populate_group_list()
      users_DataTable.clear()
      populate_user_list()
    } else {
      toastr.error("Une erreur s'est produite durant la mise à jour.")
    }
  })
}

function prompt_user_info(userid, callback){
  Swal.fire({
    title: 'Modifier un utilisateur',
    text: "Chargement..."
  })

  Swal.showLoading()

  api_req('GET', '/api/v1/group', {}, async function(gerr, gxhr){
    if(gerr){
      toastr.error("Une erreur technique s'est produite")
      Swal.close()
      return
    }

    groups = gxhr.responseJSON
    api_req('GET', '/api/v1/promotion', {}, async function(perr, pxhr){
      if(perr){
        toastr.error("Une erreur technique s'est produite")
        Swal.close()
        return
      }

      promos = pxhr.responseJSON
      api_req('GET', '/api/v1/user/' + userid, {}, async function(err, xhr){
        if(err){
          toastr.error("Une erreur technique s'est produite")
          Swal.close()
          return
        }
        var user = xhr.responseJSON
        Swal.fire({
          title: 'Modifier un utilisateur',
          html:
            '<input id="firstName" class="mt-0 form-control" value="'+user.firstName+'"></input><br>'+
            '<input id="lastName" class="mt-0 form-control" value="'+user.lastName+'"></input><br>'+
            '<select id="promo_id" class="mt-0 form-control"><br>'+
                promos.map((promo) => {
                  if(promo._id.toString() == user.promo_id){
                    return "<option value='"+promo._id.toString()+"' selected='selected'>IG"+promo.annePromo+" "+promo.anneScolaire+"</option>"
                  }
                  return "<option value='"+promo._id.toString()+"'>IG"+promo.annePromo+" "+promo.anneScolaire+"</option>"
                }).join('') +
            "</select><br>" +
            '<select id="group_id" class="mt-0 form-control"><br>'+
                "<option value='null'>Aucun</option>" +
                groups.map((group) => {
                  if(group._id.toString() == user.group_id){
                    return "<option value='"+group._id.toString()+"' selected='selected'>"+group.groupname+"</option>"
                  }
                    return "<option value='"+group._id.toString()+"'>"+group.groupname+"</option>"
                }).join('') +
            "</select><br>",
          focusConfirm: false,
          preConfirm: () => {
            var firstName = document.getElementById('firstName').value
            var lastName = document.getElementById('lastName').value
            var promo_id = document.getElementById('promo_id').value
            var group_id = document.getElementById('group_id').value
            var promo_name = $("#promo_id").find(":selected").text()
            var group_name = $("#group_id").find(":selected").text()

            edit_user(userid, {
              firstName: firstName,
              lastName: lastName,
              promo_id: promo_id,
              group_id: group_id
            }, function(succ){
              if(succ){
                callback(succ, [
                  firstName,
                  lastName,
                  promo_name,
                  group_name,
                ])
              } else {
                callback(succ, [])
              }
            })
          }
        })
      })
    })
  })
}












function change_group_info(groupid){
  prompt_group_info(groupid, function(succ, data){
    if(succ){
      toastr.success('Groupe mis à jour !')
      groups_DataTable.clear()
      populate_group_list()
      users_DataTable.clear()
      populate_user_list()
    } else {
      toastr.error("Une erreur s'est produite durant la mise à jour.")
    }
  })
}


function prompt_group_info(groupid, callback){
  Swal.fire({
    title: 'Modifier un groupe',
    text: "Chargement..."
  })

  Swal.showLoading()

  api_req('GET', '/api/v1/user', {}, async function(uerr, uxhr){
    if(uerr){
      toastr.error("Une erreur technique s'est produite")
      Swal.close()
      return
    }

    users = uxhr.responseJSON
    api_req('GET', '/api/v1/event', {}, async function(eerr, exhr){
      if(eerr){
        toastr.error("Une erreur technique s'est produite")
        Swal.close()
        return
      }

      events = exhr.responseJSON
      api_req('GET', '/api/v1/group/' + groupid, {}, async function(err, xhr){
        if(err){
          toastr.error("Une erreur technique s'est produite")
          Swal.close()
          return
        }
        
        var group = xhr.responseJSON[0]
        var members = group.members
        Swal.fire({
          title: 'Modifier un groupe',
          html:
            '<input id="groupname" class="mt-0 form-control" value="'+group.groupname+'"></input><br>'+
            '<select id="event_id" class="mt-0 form-control"><br>'+
                events.map((event) => {
                  if(event._id.toString() == group.event_id){
                    return "<option value='"+event._id.toString()+"' selected='selected'>"+event.nomEvent+"</option>"
                  }
                  return "<option value='"+event._id.toString()+"'>"+event.nomEvent+"</option>"
                }).join('') +
            "</select><br>" +
            '<input id="add-member" list="users-list-datalist" class="mt-0 form-control" placeholder="Ajouter des membres au groupe" /><datalist id="users-list-datalist">'+
                users.map((user) => {
                  if(members.map(a => a._id.toString()).includes(user._id.toString())) return ""
                  return '<option label="'+user._id.toString()+'" value="'+user.lastName+' '+user.firstName+'">'+
                  user.lastName+' '+user.firstName+'</option>'
                }).join('') +
            '</datalist>'+
            ' <select id="members" class="mt-1 form-control" multiple="multiple">'+
                members.map((member) => {
                  return '<option value="'+member._id.toString()+'" label="'+member.lastName+' '+member.firstName+'">'+
                  member.lastName+' '+member.firstName+'</option>'
                }).join('') +
            ' </select>',
          onOpen: function(ele){
            $("#members").keydown(function(event) {
                if(event.which != 46) // not delete key
                    return;
                var sel = $(this);
                $("#members option:selected").remove();
            });
            
            
            $(document).on('change', '#add-member', function () {
              value = $("#users-list-datalist option[value='" + $("#add-member").val() + "']").attr('label')
              display = $("#users-list-datalist option[value='" + $("#add-member").val() + "']").attr("value")
              
              $("#add-member").val('')
              if(value == undefined || display == undefined) return
              $("#members").append(new Option(display, value))
            });
          },
          focusConfirm: false,
          preConfirm: () => {
            var groupname = document.getElementById('groupname').value
            var event_id = document.getElementById('event_id').value
            group_members = []
            
            for(const [key, element] of Object.entries($("#members option"))){
              group_members.push(element.value)
              edit_user(element.value, {
                group_id: groupid
              }, function(succ){})
            }
            
            for(const [key, content] of Object.entries(members)){
              if(!group_members.includes(content._id)){
                edit_user(content._id, {
                  group_id: "Aucun"
                }, function(succ){})
              }
            }
            
            edit_group(groupid, {
              groupname: groupname,
              event_id: event_id
            }, function(succ){
              if(succ){
                callback(succ, [
                  groupname,
                  event_id
                ])
              } else {
                callback(succ, [])
              }
            })
          }
        })
      })
    })
  })
}