/*global $*/

$(function(){
    var dps = []; // dataPoints

	var chart = new CanvasJS.Chart("chartContainer",{
		title :{
			text: "Live Random Data"
		},			
		data: [{
			type: "line",
			dataPoints: dps 
		}]
	});

	var updateInterval = 10;
	var dataLength = 100; // number of dataPoints visible at any point
	
	setTimeout(access_cpu_percent, updateInterval);
    
    function access_cpu_percent(){
        $.post('/cpu_percent', function(data) {
            $(".cpu_percent").each(function(index, element){
                $(element).html(data["result"][index])
            })
            dps.push({y :data["result"][0]})
            if (dps.length > dataLength)
    		{
    			dps.shift();
    		}
    		chart.render()
            setTimeout(access_cpu_percent, updateInterval);
        })
    }

	// generates first set of dataPoints
	//updateChart(dataLength); 

	// update chart after specified time. 
	//setInterval(function(){updateChart()}, updateInterval); 
	
})