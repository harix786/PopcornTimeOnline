var utils = {
      titles : {
         common : 'Popcorn Time Online',
         itemTitle : 'Popcorn Time - Watch {{item_name}} instantly for free!'

      },
   setMetas : function(data) {
      console.log('META\'s',data);
      if(data.title) {
         var title = data.title;
         $('title').html(title);
         $("meta[property='og:title']").attr("content", title);
         $("meta[name='twitter:title']").attr("content", title);
      }
      if(data.url) {
         $("meta[property='og:url']").attr("content", 'http://popcorntime-online.io' + data.url);
         $("meta[name='twitter:url']").attr("content",'http://popcorntime-online.io' + data.url);
      }
      window.history.pushState({"html":JSON.stringify(data),"pageTitle":data.url},"", data.url);
      if(data.image) {

      }
   },
	load_script:function(src, callback) {

		var script = document.createElement('script'), loaded;

		script.setAttribute('src', src);
		if (callback) {
		  script.onreadystatechange = script.onload = function() {
			if (!loaded) {
			  callback();
			}
			loaded = true;
		  };
		}
		document.getElementsByTagName('head')[0].appendChild(script);

	},

	tokenizer:function(tokens, str){
		return str.replace(/\[##([^#]+)##\]/g, function(){

			var global_tokens = {

				toolbox_html:$('#watch_toolbox').html()
			}

			return tokens[arguments[1]] || global_tokens[arguments[1]] || '';
		});
	},

	movie:{
		rateToStars:function(rate){
			if(!rate)
				return [
				'<span class="icon star_empty"></span>',
				'<span class="icon star_empty"></span>',
				'<span class="icon star_empty"></span>',
				'<span class="icon star_empty"></span>',
				'<span class="icon star_empty"></span>'
				].join("");


			var
			p_rating = Math.round(rate.toFixed(1)) / 2,
			stars = '';

			for (var i = 1; i <= Math.floor(p_rating); i++){
				stars += '<span class="icon star"></span>';
			}
			if(p_rating % 1 > 0){
				stars += '<span class="icon star_half"></span>';
			}

			for (var i = Math.ceil(p_rating); i < 5; i++) {
				stars += '<span class="icon star_empty"></span>';
			}

			return stars;

		}
	},

	msgbox:function(str){
		$('#msg div').html(str);
		$('#msg').show();
		setTimeout(function(){
			$('#msg').hide();
		},5500)
	},

	url_response:{},
	url_request:function(url, callback){

		 utils.url_response[url] = callback;
		 try{
          hostApp.url_request(url);
       }catch(e){
          utils.url_response[url](null);
       }
	},

	calculateTorrentHealth: function (seeders, peers) {
      // Calculates the "health" of the torrent (how easy it is to stream)
      var leechers = peers - seeders;
      var ratio = leechers > 0 ? (seeders / leechers) : seeders;

      if (seeders < 100) {
        return 'bad';
      }
      else if (seeders >= 100 && seeders < 200) {
        if( ratio > 5 ) {
         return 'good';
        } else if( ratio > 3 ) {
          return 'medium';
        } else {
          return 'bad';
        }
      }
      else if (seeders >= 200) {
        if( ratio > 5 ) {
          return  'excellent';
        } else if( ratio > 3 ) {
          return 'good';
        } else if( ratio > 2 ) {
          return 'medium';
        } else {
          return 'bad';
        }
      }
    },

    popupwindow: function(url, name, w, h){
	  var left = (screen.width/2)-(w/2);
	  var top = (screen.height/2)-(h/2);
	  return window.open(url, name, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
	},
      is_mobile: function () { return true;},
      is_mobile2: function () {
         var isMobile = false; //initiate as false
      // device detection
         if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

         return isMobile;
      },
      check_location: function (callback) {

         var requestUrl = "https://api.teletext.io/api/v1/geo-ip";

         $.ajax({
            url: requestUrl,
            type: 'GET',
            success: function (json) {
               if (json && json.alpha2) {
                  callback(json.alpha2);
               }
            },
            error: function (err) {
               console.log("Request failed, error= " + err);
            }
         });
      }

},
resource = {

	genres:[
		"all",
		"action",
		"adventure",
		"animation",
		"biography",
		"comedy",
		"crime",
		"documentary",
		"drama" ,
		"family",
		"fantasy",
		"film-noir",
		"history",
		"horror",
		"music",
		"musical",
		"mystery",
		"romance",
		"sci-fi",
		"short",
		"sport",
		"thriller",
		"war",
		"western"
	],

	lang2code:{
			"af":"za",
			"sq":"al",
			"ar":"sa",
			"hy":"am",
			"cy":"az",
			"lt":"az",
			"eu":"es",
			"be":"by",
			"bg":"bg",
			"bs":"bs",
			"ca":"es",
			"zh":"cn",
			"hr":"hr",
			"cs":"cz",
			"da":"dk",
			"nl":"nl",
			"en":"us",
			"et":"ee",
			"fo":"fo",
			"fa":"ir",
			"fi":"fi",
			"fr":"fr",
			"gl":"es",
			"de":"de",
			"el":"gr",
			"gu":"in",
			"he":"il",
			"hi":"in",
			"hu":"hu",
			"is":"is",
			"id":"id",
			"it":"it",
			"ja":"jp",
			"kn":"in",
			"kk":"kz",
			"kok":"in",
			"ko":"kr",
			"ky":"kz",
			"lv":"lv",
			"lt":"lt",
			"mk":"mk",
			"ms":"my",
			"mr":"in",
			"mn":"mn",
			"nb":"no",
			"nn":"no",
			"no":"no",
			"pl":"pl",
			"pt":"br",
			"pt":"pt",
			"pa":"in",
			"ro":"ro",
			"ru":"ru",
			"sa":"in",
			"cy":"sr",
			"lt":"sr",
			"sk":"sk",
			"sl":"si",
			"es":"es",
			"sw":"ke",
			"sv":"se",
			"sr":"sr",
			"syr":"sy",
			"ta":"in",
			"tt":"ru",
			"te":"in",
			"th":"th",
			"tr":"tr",
			"uk":"ua",
			"ur":"pk",
			"cy":"uz",
			"lt":"uz",
			"vi":"vn",
		}
}