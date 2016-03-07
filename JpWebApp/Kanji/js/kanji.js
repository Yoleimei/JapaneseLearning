var kanjiObj = [];
var crtIdx = 0;
(function (){
	for (var i=0;i<9;i++)
		kanjiObj[i] = new KanjiObj();
	kanjiObj[0].url = 'json/kanji1.js?1=1';
	kanjiObj[1].url = 'json/kanji2.js?2=2';
	kanjiObj[2].url = 'json/kanji3.js?3=3';
	kanjiObj[3].url = 'json/kanji4.js?4=4';
	kanjiObj[4].url = 'json/kanji5.js?5=5';
	kanjiObj[5].url = 'json/kanji6.js?6=6';
	kanjiObj[6].url = 'json/kanji7.js?7=7';
	kanjiObj[7].url = 'json/kanji8.js?8=8';
	kanjiObj[8].url = 'json/kanji9.js?9=9';
})();

var updateHtml = function(arr, dom){
	var cnt = arr.length;
	dom.html("");
	for (var i=0;i<cnt;i++)
		dom.append('<div class="col-md-3 col-xs-6"><input type="text" class="form-control" data-answer="'+arr[i]+'" /></div>');
}

var funNext = function(){
	var idx = crtIdx;
	kanjiObj[idx].current = kanjiObj[idx].current+1;
	if (kanjiObj[idx].current>kanjiObj[idx].total) {
		kanjiObj[idx].current = kanjiObj[idx].current-1;
		alert("おめでとう！クイズを終った！");
	}
	$("#process").text(kanjiObj[idx].current+'/'+kanjiObj[idx].total);
	kanjiObj[idx].kanjiModel = kanjiObj[idx].kanjiArray[kanjiObj[idx].sequence[kanjiObj[idx].current-1]];
	$("#kanji").text(kanjiObj[idx].kanjiModel.Kanji);
	updateHtml(kanjiObj[idx].kanjiModel.Ondoku, $("#ondoku"));
	updateHtml(kanjiObj[idx].kanjiModel.Kundoku, $("#kundoku"));
	updateHtml(kanjiObj[idx].kanjiModel.Doushi, $("#doushi"));
	updateHtml(kanjiObj[idx].kanjiModel.Keiyoushi, $("#keiyoushi"));
	updateHtml(kanjiObj[idx].kanjiModel.Keiyoudoushi, $("#keiyoudoushi"));
	updateHtml(kanjiObj[idx].kanjiModel.Meishi, $("#meishi"));
	updateHtml(kanjiObj[idx].kanjiModel.Rentaikei, $("#rentaikei"));
	updateHtml(kanjiObj[idx].kanjiModel.Fukushi, $("#fukushi"));
	updateHtml(kanjiObj[idx].kanjiModel.Setuzokushi, $("#setuzokushi"));
}

var showHighLight = function(arr,dom) {
	var answer = [];
	var cnt = dom.children().length;
	for(var i=0;i<cnt;i++)
		answer[i] = dom.children().eq(i).find("[data-answer]").val();
	answer.sort();
	arr.sort();
	var right = true;
	for(var i=0;i<cnt;i++) {
		if (answer[i] !== arr[i]) {
			right = false;
			break;
		}
	}
	if (right) {
		dom.children().removeClass("has-error");
		dom.children().addClass("has-success");
	}
	else {
		dom.children().removeClass("has-success");
		dom.children().addClass("has-error");
	}
}

var funCheck = function(){
	showHighLight(kanjiObj[crtIdx].kanjiModel.Ondoku, $("#ondoku"));
	showHighLight(kanjiObj[crtIdx].kanjiModel.Kundoku, $("#kundoku"));
	showHighLight(kanjiObj[crtIdx].kanjiModel.Doushi, $("#doushi"));
	showHighLight(kanjiObj[crtIdx].kanjiModel.Keiyoushi, $("#keiyoushi"));
	showHighLight(kanjiObj[crtIdx].kanjiModel.Keiyoudoushi, $("#keiyoudoushi"));
	showHighLight(kanjiObj[crtIdx].kanjiModel.Meishi, $("#meishi"));
	showHighLight(kanjiObj[crtIdx].kanjiModel.Rentaikei, $("#rentaikei"));
	showHighLight(kanjiObj[crtIdx].kanjiModel.Fukushi, $("#fukushi"));
	showHighLight(kanjiObj[crtIdx].kanjiModel.Setuzokushi, $("#setuzokushi"));
}

var funSeeAnswer = function(){
	$("[data-answer]").each(function(){
		$(this).val($(this).attr('data-answer'));
	});
}

var funGetData = function(idx){
	$.getJSON(kanjiObj[idx].url,{},function(json){
		kanjiObj[idx].kanjiArray = json.KanjiModel;
		kanjiObj[idx].sequence = new Array();
		kanjiObj[idx].total = kanjiObj[idx].kanjiArray.length;
		for (var i=0;i<kanjiObj[idx].total;i++)
			kanjiObj[idx].sequence[i] = i;
		kanjiObj[idx].sequence.sort(function(){return Math.random()-0.5;});
		if (idx == 0)
			funNext();
	});
}

var funChange = function(){
	$("[role=presentation]").removeClass("active");
	$(this).parent().addClass("active");
	crtIdx = $(this).attr("data-index");
	if (kanjiObj[crtIdx].current > 0)
		kanjiObj[crtIdx].current = kanjiObj[crtIdx].current-1;
	funNext();
}

var funRedo = function(){
	$("input[type='text']").each(function(){
		$(this).parent().removeClass("has-success");
		$(this).parent().removeClass("has-error");
		$(this).val("");
	});
}

$(function(){
	funGetData(0);
	funGetData(1);
	funGetData(2);
	funGetData(3);
	funGetData(4);
	funGetData(5);
	funGetData(6);
	funGetData(7);
	funGetData(8);
	$("#doAgain").click(funRedo);
	$("#next").click(funNext);
	$("#check").click(funCheck);
	$("#seeAnswer").click(funSeeAnswer);
	$("[data-index]").click(funChange);
	// $("#keiyoudoushi").append('<div class="col-md-3 col-xs-6 has-success"><input type="text" class="form-control" /></div>');
	// $("#keiyoudoushi").append('<div class="col-md-3 col-xs-6 has-warning"><input type="text" class="form-control" /></div>');
	// $("#keiyoudoushi").append('<div class="col-md-3 col-xs-6 has-error"><input type="text" class="form-control" /></div>');
});