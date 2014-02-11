/**
 * Created by Nil on 2/9/14.
 */
$(function() {
	moment.lang("zh-cn");
    var time_view = moment().format('LL');
	$('#content-time-heading').text(time_view);
});