var getDoushiSelect = function(ans) {
	return '<div class="col-md-3 col-xs-6"><select class="form-control" data-answer="' + ans + '"><option> </option><option>简体</option><option>简体の</option><option>字典形</option><option>ます形</option><option>て形</option><option>た形</option><option>ない形</option><option>ている形</option><option>意志形</option><option>使役形</option></select></div>';
}
var getKeiyoushiSelect = function(ans) {
	return '<div class="col-md-3 col-xs-6"><select class="form-control" data-answer="' + ans + '"><option> </option><option>原形</option><option>词干</option><option>く形</option><option>くて形</option></select></div>';
}
var getKeiyoudoushiSelect = function(ans) {
	return '<div class="col-md-3 col-xs-6"><select class="form-control" data-answer="' + ans + '"><option> </option><option>词干</option><option>だ形</option><option>で形</option><option>な形</option><option>である形</option></select></div>';
}
var getMeishiSelect = function(ans) {
	return '<div class="col-md-3 col-xs-6"><select class="form-control" data-answer="' + ans + '"><option> </option><option>原形</option><option>の形</option><option>だ形</option><option>で形</option><option>な形</option><option>である形</option></select></div>';
}
var getZenjoshiSelect = function(ans) {
	return '<div class="col-md-3 col-xs-6"><select class="form-control" data-answer="' + ans + '"><option> </option><option>无</option><option>に</option><option>を</option><option>と</option><option>のに</option></select></div>';
}
var getKoujoshiSelect = function(ans) {
	return '<div class="col-md-3 col-xs-6"><select class="form-control" data-answer="' + ans + '"><option> </option><option>无</option><option>は</option><option>に</option><option>も</option><option>で</option></select></div>';
}
var getShortInputText = function(ans) {
	return '<div class="col-md-3 col-xs-6"><input type="text" class="form-control" data-answer="' + ans + '" /></div>';
}
var getLongInputText = function(ans) {
	return '<div class="col-md-12 col-xs-12"><input type="text" class="form-control" data-answer="' + ans + '" /></div>';
}
var bunpouObj = [];
var crtIdx = 0;
var mode = 0;
(function (){
	for (var i=0;i<2;i++)
		bunpouObj[i] = new BunpouObj();
	bunpouObj[0].url = 'json/xbryjc3.js';
})();

var updateHtml = function(arr, dom, fun){
	var cnt = arr.length;
	dom.html("");
	for (var i=0;i<cnt;i++)
		dom.append(fun(arr[i]));
}

var updateSingleHtml = function(arr, dom, fun){
	dom.html("");
	dom.append(fun(arr));
}

var funNext = function(){
	var idx = crtIdx;
	bunpouObj[idx].current = bunpouObj[idx].current+1;
	if (bunpouObj[idx].current>bunpouObj[idx].total) {
		bunpouObj[idx].current = bunpouObj[idx].current-1;
		alert("おめでとう！クイズを終った！");
	}
	$("#process").text(bunpouObj[idx].current+'/'+bunpouObj[idx].total);
	bunpouObj[idx].bunpouModel = bunpouObj[idx].bunpouArray[bunpouObj[idx].sequence[bunpouObj[idx].current-1]];
	$("#junban").text(bunpouObj[idx].bunpouModel.Junban);
	updateHtml(bunpouObj[idx].bunpouModel.Doushi, $("#doushi"), getDoushiSelect);
	updateHtml(bunpouObj[idx].bunpouModel.Keiyoushi, $("#keiyoushi"), getKeiyoushiSelect);
	updateHtml(bunpouObj[idx].bunpouModel.Keiyoudoushi, $("#keiyoudoushi"), getKeiyoudoushiSelect);
	updateHtml(bunpouObj[idx].bunpouModel.Meishi, $("#meishi"), getMeishiSelect);
	updateSingleHtml(bunpouObj[idx].bunpouModel.Zenjoshi, $("#zenjoshi"), getZenjoshiSelect);
	updateSingleHtml(bunpouObj[idx].bunpouModel.Koujoshi, $("#koujoshi"), getKoujoshiSelect);
	$("#shutai").html("").append(getLongInputText(bunpouObj[idx].bunpouModel.Shutai));
	$("#imi").html("").append(getLongInputText(bunpouObj[idx].bunpouModel.Imi));
	$("#reibun").html("").append(getLongInputText(bunpouObj[idx].bunpouModel.Reibun));
	funShowKnown();
}

var showSingleHighLight = function(arr, dom) {
	var answer = dom.find("[data-answer]").val();
	var right = true;
	if (answer !== arr) 
		right = false;
	if (right) {
		dom.children().removeClass("has-error");
		dom.children().addClass("has-success");
	}
	else {
		dom.children().removeClass("has-success");
		dom.children().addClass("has-error");
	}
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
	showHighLight(bunpouObj[crtIdx].bunpouModel.Doushi, $("#doushi"));
	showHighLight(bunpouObj[crtIdx].bunpouModel.Keiyoushi, $("#keiyoushi"));
	showHighLight(bunpouObj[crtIdx].bunpouModel.Keiyoudoushi, $("#keiyoudoushi"));
	showHighLight(bunpouObj[crtIdx].bunpouModel.Meishi, $("#meishi"));
	showSingleHighLight(bunpouObj[crtIdx].bunpouModel.Zenjoshi, $("#zenjoshi"));
	showSingleHighLight(bunpouObj[crtIdx].bunpouModel.Shutai, $("#shutai"));
	showSingleHighLight(bunpouObj[crtIdx].bunpouModel.Koujoshi, $("#koujoshi"));
}

var funSeeAnswer = function(){
	$("[data-answer]").each(function(){
		$(this).val($(this).attr('data-answer'));
	});
}

var funGetData = function(idx){
	$.getJSON(bunpouObj[idx].url,{},function(json){
		bunpouObj[idx].bunpouArray = json.BunpouModel;
		bunpouObj[idx].sequence = new Array();
		bunpouObj[idx].total = bunpouObj[idx].bunpouArray.length;
		for (var i=0;i<bunpouObj[idx].total;i++)
			bunpouObj[idx].sequence[i] = i;
		bunpouObj[idx].sequence.sort(function(){return Math.random()-0.5;});
		if (idx == 0)
			funNext();
	});
}

var funChange = function(){
	$("[role=presentation]").removeClass("active");
	$(this).parent().addClass("active");
	crtIdx = $(this).attr("data-index");
	if (bunpouObj[crtIdx].current > 0)
		bunpouObj[crtIdx].current = bunpouObj[crtIdx].current-1;
	funNext();
}

var funRedo = function(){
	$("input[type='text']").each(function(){
		$(this).parent().removeClass("has-success");
		$(this).parent().removeClass("has-error");
		$(this).val("");
	});
	$("select").each(function(){
		$(this).parent().removeClass("has-success");
		$(this).parent().removeClass("has-error");
		$(this).val("");
	});
	funShowKnown();
}

var funShowKnown = function() {
	if (mode == 0) {
		$("#shutai input").val($("#shutai input").attr("data-answer"));
		$("#imi input").val("");
	} else {
		$("#shutai input").val("");
		$("#imi input").val($("#imi input").attr("data-answer"));
	}
}

var funChangeMode = function() {
	mode = $(this).attr("data-mode");
	$("[data-mode]").removeClass("btn-primary");
	$(this).addClass("btn-primary");
	funShowKnown();
}

var funShowReibun = function() {
	$("#reibun input").val($("#reibun input").attr("data-answer"));
}

$(function(){
	funGetData(0);
	$("#doAgain").click(funRedo);
	$("#next").click(funNext);
	$("#check").click(funCheck);
	$("#seeAnswer").click(funSeeAnswer);
	$("[data-index]").click(funChange);
	$("[data-mode]").click(funChangeMode);
	$("#btnReibun").click(funShowReibun);
});