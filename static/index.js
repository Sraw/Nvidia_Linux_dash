/*global $, CanvasJS*/

$(function(){
	var chart = new CanvasJS.Chart("chartContainer",{
		title :{
			text: "CPU Usage"
		},			
		data: [{
			type: "bar"
		}],
		axisY:{
			maximum: 110,
			minimum: 0,
			interval: 10
		},
		axisX:{
			interval: 1,
		}
	});

	var updateInterval = 1000;
	
	access_cpu_percent()
	
	setInterval(access_cpu_percent, 1000)
    
    function access_cpu_percent(){
        $.post('/cpu_percent', function(data) {
        	var dps = new Array(data["result"].length)
            for(var i = 0; i < data["result"].length; i++)
            {
            	dps[data["result"].length - i - 1] = {
            		y : data["result"][i],
            		label : "CPU Core" + i.toString(),
            		indexLabel : data["result"][i].toString()
            	}
            }
            chart.options.data[0].dataPoints = dps
    		chart.render()
            //setTimeout(access_cpu_percent, updateInterval);
        })
    }
})