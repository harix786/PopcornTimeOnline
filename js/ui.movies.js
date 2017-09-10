ui.movies = {

	session:{},

	show:function(movie_id){

		var data = ui.home.catalog.items[movie_id];

		if(!data){
			logger.log('error_missing_movie_catalog_id_' + movie_id)
			return;
		}

		var
		slider 				= this.slider(data),
		handlers 			= this.handlers[app.config.fetcher.mode];

		ui.movies.session = {
			id:		data.id,
			imdb:	data.id,
			title:	data.title,
			info:	data.year,
			year:	data.year,
			image:	data.poster_big,
			section:'movies'
		};

		this.set_torrents(data);
		this.construct(data);


		for(var func in handlers) {
         handlers[func](data);
      }

		slider.show();
		setTimeout(function(){app.state = 'movie';},100);;

	},

	slider: function(data){

		if($('.slider_' + data.id).length)
			return;

		ui.sliders.close_all();

		var
		slider_html = utils.tokenizer(data, $('#movie_slider_html').html());
		slider		= new ui.slider('movie', 'fadein'); //-------------------------

		slider.destruct = function(){
			app.state = 'mainWindow';
		}
		slider.el.append(slider_html).addClass('movie_' + data.id);


		return slider;

	},

	watch:function(e){
		if(window.deviceNotSupport) {
			$('#deviceNotSupported').show();
			return;
		}
		Mousetrap.pause();
		torrentsTime.pt.setup.vpnShowed = false;
		app.torrent.get(this.session);

		var session = ui.movies.session;
		session.torrents = ui.home.catalog.items[ this.session.id ].torrents
		app.history.add([session]);

	},

	set_torrents:function(data, lang){
      var torrents_data = lang && data.dubbing[lang] && data.dubbing[lang] instanceof Array &&  data.dubbing[lang].length ? data.dubbing[lang] : data.torrents;

      var torrent_selector 	= $('#slider_movie.movie_' + data.imdb + ' .torrent_selector .selector_cont');

		torrent_selector.html('');


      console.log('DUBBING TEST',torrents_data);


		if(torrents_data instanceof Array && torrents_data.length){
			$('#slider_movie.movie_' + data.imdb + ' .watch-btn').show();
         torrents_data.forEach(function(torrent, i){

				if(i==0)
					ui.movies.session.torrent = {
						url: 	torrent.torrent_url,
                  magnet: torrent.torrent_magnet,
                  file:	torrent.file,
						quality: torrent.quality
					}


				$('<div class="item torrent ' + (i==0 ? 'activated':'') + ' ' + torrent.quality.toLowerCase() +'" data-idx="' + i + '" data-quality="' + torrent.quality.toLowerCase() + '"><div class="icon2 baterry ' + utils.calculateTorrentHealth(torrent.torrent_seeds, torrent.torrent_peers) + '"></div><div class="caption">' + torrent.torrent_seeds + '/' + torrent.torrent_peers + ' Peers</div></div>').appendTo(torrent_selector)
				.click(function(){
					$('.item.torrent.activated').removeClass('activated')
					$(this).addClass('activated');
                  var itemsStorage = ui.home.catalog.items[ui.movies.session.id].torrents;
                  if(ui.movies.session.dubbing_lang) {

                     itemsStorage = ui.home.catalog.items[ui.movies.session.id].dubbing[ui.movies.session.dubbing_lang];
                  }
					var torrent = itemsStorage[ parseInt($(this).data('idx')) ];

					ui.movies.session.torrent = {
						url: 	torrent.torrent_url,
                  magnet: torrent.torrent_magnet,
                  file:	torrent.file,
						quality: torrent.quality
					}

				});

			})

			$('#slider_movie .quality_selector').click(function(){
				if(!$(this).hasClass('enabled'))
					return

				$('#slider_movie .quality_selector.activated').removeClass('activated');
				$(this).addClass('activated');

				$('#slider_movie .torrent').removeClass('activated').hide();
				$('#slider_movie .torrent.' + $(this).data('quality')).show().first().click();

			})

         $('#slider_movie .quality_selector.enabled').removeClass('enabled');

			var
			firstTorrent = $('#slider_movie .torrent').first(),
			firstQuality = firstTorrent.data('quality');

			$('#slider_movie .quality_selector').each(function(){
				if($('#slider_movie .torrent.' + $(this).data('quality')).length)
					$(this).addClass('enabled');
			})

			$('#slider_movie .quality_selector.' + firstQuality).click();

		}
		else{
			torrent_selector.html('<div class="item"><div class="caption">No torrents</div></div>');
			$('#slider_movie.movie_' + data.imdb + ' .watch-btn').hide();
		}

	},

	construct:function(data){

		$('#slider_movie.movie_' + data.id + ' .fav-btn').click(function(){app.favs.toggle(data.id)})

		if(data.trailer)
			$('#slider_movie.movie_' + data.id + ' .trailer').show().click(function(){ui.trailer.show(data.trailer)});

      console.log(data.dubbing,data);
      var dubbed_selector 	= $('#slider_movie.movie_' + data.imdb + ' .dubbed_selector .selector_cont');
      dubbed_selector.html('<div class="item dubbing activated"><div class="caption"><img src="css/images/dubbed.svg" style="width:15px;height:15px;vertical-align:middle"> &nbsp;' + (data.dubbing ? '<span class="dtitle">Select Dubbing</span>' : ' No dubbing') + '</div></div>');
      if(data.dubbing){
         for(var lang in data.dubbing){
            $('<div data-lang="'+lang+'" class="item dubbing"><div class="caption"><img src="css/images/dubbed.svg" style="width:15px;height:15px;vertical-align:middle"> &nbsp; ' + (locale.iso2lang[lang] || lang) + '</div></div>').appendTo(dubbed_selector);

         }
      }

      $('.item.dubbing').click(function(){
         $('.item.dubbing.activated').removeClass('activated');
         $(this).addClass('activated');
         ui.movies.session.dubbing_lang = this.getAttribute('data-lang');
         console.info('dubbing lang',ui.movies.session.dubbing_lang);
         ui.movies.set_torrents(data, this.getAttribute('data-lang'));
      });
	},
   getTrailer: function(data) {
      ui.movies.infoXHR = $.get('//api.themoviedb.org/3/movie/' + data.tmdb_id + '/videos?api_key=' + app.config.api_keys.tmdb,function(json){

         if(json  && json.results.length) {
            var trailer = json.results[0].key ? '//www.youtube.com/embed/' + json.results[0].key + '?autoplay=1': false;
            if(trailer)
               $('#slider_movie.movie_' + data.id + ' .trailer').show().click(function(){ui.trailer.show(trailer)});
            data.trailer = trailer;
            //trailer:	movie.trailer ? 'http://www.youtube.com/embed/' + movie.trailer + '?autoplay=1': false,
         }


      }, 'json');
   },

	handlers:{

		imdb:{

			get_movie_info:function(data){
				if(ui.movies.infoXHR && typeof ui.movies.infoXHR.abort == 'function')
					ui.movies.infoXHR.abort();


				var displayInfo = function(){
					$('.slider.movie_' + data.imdb + ' .synopsis').html(data.synopsis).addClass('fadein');
					$('.slider.movie_' + data.imdb + ' .title_info .runtime').html(data.runtime);
					$('.slider.movie_' + data.imdb + ' .title_info.genre').html(data.genre);
					$('.slider.movie_' + data.imdb + ' .title_info.stars').attr('title', data.voteAverage + ' / 10').click(function(){
						hostApp.openBrowser('http://www.imdb.com/title/' + data.imdb)
					}).children('span').css({cursor:"pointer"})


               var title = data.title.toLowerCase().replace(/\s\(\d{4}\)$/,'');
               utils.setMetas({
                     title : utils.titles.itemTitle.replace('{{item_name}}', data.title),
                     url : '/' + slugify(title + ' '+ data.year) +'.html?imdb=' + (data.id.replace('tt',""))
               })
				}

				if(data.synopsis && data.runtime && data.genre)
					setTimeout(displayInfo,100);

				else{
					ui.movies.infoXHR = $.get('//api.themoviedb.org/3/movie/' + data.imdb + '?api_key=' + app.config.api_keys.tmdb,function(json){

						if(json){
                     data.tmdb_id = json.id;
							data.synopsis = json.overview;
							data.runtime =  json.runtime + ' ' + locale.translate('durationUnit');
							data.genre = json.genres instanceof Array ? (json.genres[0] && json.genres[0].name || '') : '';
                     if(!data.trailer) {
                        ui.movies.getTrailer(data);
                     }
						}

						displayInfo();

					}, 'json');
				}


			},

			load_images:function(data){

				if(ui.movies.imgsXHR && typeof ui.movies.imgsXHR.abort == 'function')
					ui.movies.imgsXHR.abort();
				ui.movies.imgsXHR = $.get(app.config.api_keys.tmdb_url + 'movie/' +data.imdb + '/images?api_key=' + app.config.api_keys.tmdb,function(json){

					var poster_img = data.poster_big;

					if(typeof json == 'object'){

						if(json.posters){

							var gotFirstEnPoster = false;

							for(var i=0;i<json.posters.length;i++){

								if(json.posters[i].height>1080)

									if(json.posters[i].iso_639_1==locale.language){
										poster_img = app.config.api_keys.tmdb_src + 'w780/' + json.posters[i].file_path;
										break;
									}
									else if(!gotFirstEnPoster && json.posters[i].iso_639_1=='en'){
										poster_img = app.config.api_keys.tmdb_src + 'w780/' + json.posters[i].file_path;
										gotFirstEnPoster=true;
									}

							}

						}
                  if(json.videos) {
                     console.log(json.videos);
                  }


						var img = new Image
						img.onload = function(){
							clearTimeout(posterNotLoaded);
							$('#slider_movie.movie_' + data.id + ' .poster_img').attr('src',poster_img).addClass('fadein')
							setTimeout(load_backdrops,2222)

						}
						img.src = poster_img;

						var posterNotLoaded = setTimeout(function(){
							load_backdrops();
						},5000)



						var load_backdrops = function(){
							var backdrops = [];
							if(json.backdrops instanceof Array){

								var bd_handler = function(i){

									if(!$('.movie_' + data.id).length)
										return;

									if(i>=json.backdrops.length){
										i=0;
										if(!$('#slider_movie.movie_' + data.id + ' .backdrop_img').length)
											return;
									}

									var bd = json.backdrops[i];
									if(bd.width==1920){
										var
										src = app.config.api_keys.tmdb_src + 'w' + bd.width + bd.file_path,
										img = new Image;
										img.onload = function(){

											ui.movies.session.image = src.replace('w'+bd.width, 'w185');

											$('<div class="backdrop_img"><div class="img" style="background-image:url(' + src + ')">').appendTo('#slider_movie .backdrop');
											$('#slider_movie .backdrop_img.fadein').fadeOut('slow',function(){$(this).remove()});
											setTimeout(function(){
												$('#slider_movie .backdrop_img').last().addClass('fadein');
												setTimeout(function(){bd_handler(++i)},6750);
											},10)

										}
										img.src=src


									}
									else
										setTimeout(function(){bd_handler(++i)},500);

								}

								bd_handler(0);
							}
						}
					}

				},'json')

			},

			load_actors:function(data){

				return;


				if(ui.movies.actorsXHR && typeof ui.movies.actorsXHR.abort == 'function')
					ui.movies.actorsXHR.abort();


				var displayInfo = function(){

					for(var i=0; i<(data.actors.length<5 ? data.actors.length : 5); i++){
						$('#slider_movie.movie_' + data.id + ' .actors').append('<div class="actor"><img src="' + data.actors[i].img + '" onload="$(this).parent().fadeIn()"></div>')
					}


				}

				if(data.actors)
					setTimeout(displayInfo,100);
				else{

					ui.movies.actorsXHR = $.get(app.config.api_keys.tmdb_url + 'movie/' + data.imdb + '/credits?api_key=' + app.config.api_keys.tmdb,function(json){

						if(json && json.cast instanceof Array){
							var actors = [];
							for(var i=0; i<json.cast.length; i++){
								actors.push({name: json.cast[i].name, img: app.config.api_keys.tmdb_src + 'w185' + json.cast[i].profile_path});
							}

							data.actors = actors;
							displayInfo();
						}



					})

				}




			}

		},

		anime:{
			get_movie_info:function(data){

					$('.slider.movie_' + data.imdb + ' .synopsis').html(data.synopsis).addClass('fadein');
					$('.slider.movie_' + data.imdb + ' .title_info .runtime').html(data.runtime);
					$('.slider.movie_' + data.imdb + ' .title_info.genre').html(data.genre);

						var img = new Image
						img.onload = function(){
							$('#slider_movie.movie_' + data.id + ' .poster_img').attr('src',data.poster_big).addClass('fadein')
						}
						img.src = data.poster_big;

			},

		},

		cartoons:{

		}

	}

}