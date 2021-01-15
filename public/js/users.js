template = '<div class="alert alert-info alert-dismissible fade show" role="alert">'+
'  {{ content }}'+
'  <button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
'    <span aria-hidden="true">&times;</span>'+
'  </button>'+
'</div>'

$('#select-students').keypress(function(event){
  if(event.which == 13 && $('#select-students').val() != ""){
    event.preventDefault()
    $('#selected-students').append(template.replace(/{{ content }}/gi, $('#select-students').val()))
    $('#select-students').val('')
  }
})

var groups_DataTable
var users_DataTable

$(document).ready(function() {
    groups_DataTable = $('#groups-list').DataTable({
        "language": dataTableLanguageOptions
    });

    users_DataTable = $('#users-list').DataTable({
        "language": dataTableLanguageOptions
    });
    
    if($('#groups-list').length > 0){
      populate_group_list()
    }
    
    if($('#users-list').length > 0){
      populate_user_list()
    }
});

function admin_delete_group(groupid, btn = undefined){
  delete_group(groupid, function(succ){
    if(succ){
      groups_DataTable.clear()
      populate_group_list()
      toastr.success("Groupe supprimé !")
    } else {
      toastr.error("Une erreur s'est produite durant la suppression.")
    }
  }, btn)
}

function populate_group_list(){
  api_req("GET", "/api/v1/event", {}, function(err, xhr){
    if(!err){
      for(const [key, event] of Object.entries(xhr.responseJSON)){
        api_req("GET", "/api/v1/event/" + event._id + "/groups", {}, function(g_err, g_xhr){
          if(!g_err){
            for(const [g_key, group] of Object.entries(g_xhr.responseJSON)){
              data = [
                key,
                group.groupname,
                group.members.length + " membre(s)",
                "<a class='btn btn-sm btn-link' target='_blank' href='/event/"+event._id.toString()+"/edit'>"+event.nomEvent+"</a>",
                '<a class="btn btn-sm btn-danger" onclick="admin_delete_group(\''+group._id.toString()+'\', this)"><i class="fas fa-trash"></i></a>\n'+
                '<a class="btn btn-sm btn-link" onclick="change_group_info(\''+group._id.toString()+'\')"><i class="fas fa-edit"></i></a>'
              ]
              var newRow = groups_DataTable.row.add(data).draw(false);
            }
          }
        })
      }
    }
  })
}


function populate_user_list(){
  api_req("GET", "/api/v1/user", {}, function(err, xhr){
    if(!err){
      for(const [key, user] of Object.entries(xhr.responseJSON)){
        if(user.firstName == undefined) continue
        promo = (user.promo ? "IG" + user.promo.annePromo + " " + user.promo.anneScolaire : "Aucune")
        group = (user.group ? user.group.groupname : "Aucun")
        data = [
          key,
          "<span id='"+user._id.toString()+"-firstName'>"+user.firstName+"</span>",
          "<span id='"+user._id.toString()+"-lastName'>"+user.lastName+"</span>",
          "<span id='"+user._id.toString()+"-promo_id'>"+promo+"</span>",
          "<span id='"+user._id.toString()+"-group_id'>"+group+"</span>",
          "<a onclick='change_user_info(\""+user._id.toString()+"\")' class='btn btn-link'><i class='fas fa-edit'></i></a>"
        ]

        users_DataTable.row.add(data).draw( false );
      }
    }
  })
}


// https://sweetalert2.github.io/#examples

            // <tr>
            //   <th scope="row">key</th>
            //   <td>
            //     groupname
            //   </td>
            //   <td>
            //     members.length
            //   </td>
            //   <td>
            //     promo
            //   </td>
            //   <td>
            //   </td>
            // </tr>