$(function(){

//播放控制
var myAudio = $("audio")[0];
var lrcObj = [];


$(".btn2").click(function(){
		
		if(myAudio.paused) {
			play();
		}

		else{
			pause();
		}
	});


getSong();

//获取本地歌曲
function getSong(){
	$.ajax({
		type: 'GET',
		url: 'music/lrc.json',
		dataType: 'json',
		success: function(song){
			var resorce = song,

			url = resorce.path;

			$("audio").attr('src',url);

			// play();

			getLrc();
		}
	})
};




//获取本地歌词
	function getLrc(){
        $.ajax({
		type: 'GET',
		url: 'music/lrc.json',
		// dataType: 'json',
		success:function(lyr){			

				console.log(lyr);

				var lyr = JSON.parse(lyr);
				console.log(lyr);

				//清空歌词信息
				$(".EP-wrapper #lrc .lyric").empty();

				var line = lyr.lrc.split("\n");	//歌词以排数为界的数组

				var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;	//时间正则

				var result = [];

				if(line != ""){
					for(var i in line){	//遍历歌词数组

						var time = line[i].match(timeReg);//每组匹配时间，得到时间数组
						
						if(!time)continue;

						var value = line[i].replace(timeReg,"");	//纯歌词

						for(var j in time){		//遍历时间数组

							var t = time[j].slice(1,-1).split(":");	//分析时间

							var timeArr = parseInt(t[0],10) * 60 + parseFloat(t[1]);

							result.push([timeArr, value]);
						}

					}
				}

				result.sort(function(a,b){
					return a[0] - b[0];
				});

				lrcObj = result;

				renderLyric();

		}
	})
}

		//添加歌词
        function renderLyric(){

        	var lyrP = "";

        	for(var i = 0;i < lrcObj.length; i++){
        		lyrP += "<p data-time = '"+lrcObj[i][0]+"'>"+lrcObj[i][1]+"</p>";
        	}

        	$(".EP-wrapper #lrc .lyric").append(lyrP);
        	setInterval(showLyric,100);
        }

        //显示歌词
        function showLyric(){
        	var PHeight = $(".lyric p").eq(5).outerHeight() - 3;

        	for(var i=0; i<lrcObj.length;i++){

        		var curT = $(".lyric p").eq(i).attr("data-time");

        		var nexT = $(".lyric p").eq(i+1).attr("data-time");

        		var curTime = myAudio.currentTime;

        		if((curTime > curT) && (curTime < nexT)){
        			$(".lyric p").removeClass("active");
        			$(".lyric p").eq(i).addClass("active");
        			$(".EP-wrapper #lrc .lyric").css("top", -PHeight * (i-2));
        		}
        	}
        }




	// 喜欢按钮	
	$(".favourite i").on('click',function(){
		$(this).toggleClass("red-heart");
	});

	// 播放暂停控制
	

	//滚动条
	$(".basebar").mousedown(function(ev){  //拖拽进度条控制进度
	var posX = ev.clientX;
	var targetLeft = $(this).offset().left;
	var percentage = (posX - targetLeft)/400*100;
	myAudio.currentTime = (myAudio.duration * percentage)/100;
});


	function present(){
		var length = myAudio.currentTime/myAudio.duration * 100;
		$(".progressbar").width(length+"%");		//当前播放时间转换成进度条的宽度
	}

	setInterval(present,500);		//每500ms刷新一次进度
	$(".basebar").mousedown(function(ev){
		var posX = ev.clientX;		//clientX指进度条末端对于页面的水平坐标
		var targetLeft = $(this).offset().left;		//目标的X坐标
		var percentage = (posX - targetLeft)/400*100;	//当前进度条所占百分比
		myAudio.currentTime = myAudio.duration * percentage/100;	//得到当前播放时间	
	})

	//播放函数
	function play(){
		myAudio.play();
		$(".btn2").removeClass("Audio_pause").addClass("Audio_play");
	}

	//暂停函数
	function pause(){
		myAudio.pause();
		$(".btn2").removeClass("Audio_play").addClass("Audio_pause");
	}



});


