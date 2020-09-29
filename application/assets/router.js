window.onpopstate = function(){
	window.location.href = window.location.href;
};

function redirectPage(url){
	url = "/{{ BASE_URL }}/" + url;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			ajaxProcess(this, url)
		}
	};

	xhttp.open("GET", url + "/ajax_request", true);
	xhttp.send();
}


function ajaxProcess(response, url){
	var regex = (/<title>(.*?)<\/title>/m).exec(response.responseText);
	var title = document.title;
	if (regex != undefined && regex != null && regex.length > 1) {
		title = regex[1];
	}

	document.title = title;
	document.getElementById("main_content").innerHTML = response.responseText;
	window.history.pushState({"html":response.responseText,"pageTitle":title},"", url);

	jQuery(function($) {
		$("#main_content").find("script").each(function(){
			eval($(this).text());
		});
	});
	
}