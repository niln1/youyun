/**
 * Created by Nil on 2/9/14.
 */
$(function() {
	moment.lang("zh-cn");
    var time_view = moment().format('LL, dddd');
	$('#content-time-heading').text(time_view);
    $.get("http://api.openweathermap.org/data/2.5/find?q=shanghai,cn&mode=json&units=metric",function(data){
        console.log(data);
    })
});