(function(){$(function(){var e,t,n,r,i,s,o,u,a,f;r=$("#search form"),o=$("#search-bar"),t=getCookie("csrftoken")||window.csrf_token,e=new CanvasLoader("search-canvasloader-container"),e.setColor("#3ebac2"),e.setShape("rect"),e.setDiameter(22),e.setDensity(43),e.setRange(1.2),e.setFPS(22),f={community:gettext("Communities"),need:gettext("Needs"),organization:gettext("Organizations"),resource:gettext("Resources"),investiment:gettext("Investments"),user:gettext("User"),project:gettext("Project")},u=function(){return window.is_search_results_open=!0,$("#search-results-box").popover("show")},s=function(){return window.is_search_results_open=!1,$("#search-results-box").popover("hide")},window.seeOnMap=function(e){if(e==="#map-panel-add")return;return window.location.pathname===dutils.urls.resolve("map")?($.get("/map/get_geojson_from_hashlink/",{hashlink:e},function(e){var t,n;return t=JSON.parse(e.geojson),n=setInterval(function(){try{return editor.loadGeoJSON(t,!0),clearInterval(n)}catch(e){}},500)},"json"),s()):window.location=dutils.urls.resolve("map")+("#"+e)},a=function(t,n){var r,i,s,o,a;n==null&&(n=""),a="",o=0,r=!1;if(t!=null?t.length:void 0){a+="<li>\n<ul class='search-result-entries'>";for(i in t)s=t[i],a+='<li class="search-result">\n    <img class="model-icon" alt="icon '+s.model+'" title="icon '+s.model+'" src="/static/img/'+s.model+'.png">\n    <a class="search-result-title" href=\''+s.link+"'> "+s.name+' </a>\n    <div class="right">\n        <a href="/map/#'+s.hashlink+'" hashlink="'+s.hashlink+'" class="search-map-link '+s.disabled+'" title="ver no mapa"><i class="icon-see-on-map"></i></a>\n    </div>\n</li>',o++;a+="<li class='search-results-see-all'><a href='/search/all?term="+n+"'> ver todos &raquo;</a> </li></ul></li>",r|=!0}else r|=!1;return r||(a='<div class="search-no-results"> '+gettext("No results found!")+"</div>"),$("#search-results-box").data("popover").options.content=a,u(),e.hide()},n=function(){var n;window.komoo_search_timeout_fn=null,n=o.val();if(!n)return;return e.show(),$.ajax({type:"POST",url:dutils.urls.resolve("komoo_search"),data:{term:n,csrfmiddlewaretoken:t},dataType:"json",success:function(e){return a(e.result,n)}})},r.submit(function(e){return e.preventDefault(),window.komoo_search_timeout_fn&&clearTimeout(window.komoo_search_timeout_fn),n()}),window.komoo_search_timeout_fn=null,o.bind("keydown",function(){if(o.val().length>2)return window.komoo_search_timeout_fn&&clearTimeout(window.komoo_search_timeout_fn),window.komoo_search_timeout_fn=setTimeout(n,500)}),$("#search-results-box").popover({placement:"bottom",selector:o,trigger:"manual",animation:!0}),$("body").live("click",function(e){var t;t=$(".popover");if(window.is_search_results_open&&t.has(e.target).length===0)return s()}),$(".search-map-link").live("click",function(e){var t;return e.preventDefault(),t=$(this),t.is(".disabled")?!1:seeOnMap(t.attr("hashlink"))});if(window.location.pathname===dutils.urls.resolve("map")){i=window.location.hash;if(i)return seeOnMap(i.substring(1,i.length))}})}).call(this);