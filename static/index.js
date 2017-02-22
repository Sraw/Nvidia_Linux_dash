/*global $, CanvasJS*/

$(function(){
	var chart_cpu = new CanvasJS.Chart("cpu_percent",{
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
	})
	
	var chart_mem = new CanvasJS.Chart("mem_usage",{
		title : {
			text: "Mem Usage"
		},
		data: [{
			type: "bar"
		}],
		axisY:{
			maximum: 110,
			minimum: 0,
			interval: 10
		}
	})

	var updateInterval = 1000;
	
	access_cpu_percent()
	
	setInterval(access_cpu_percent, updateInterval)
    
    function access_cpu_percent(){
        $.post('/sys_info', function(data) {
        	//cpu
        	var dps_cpu = new Array(data["cpu_percent"].length)
            for(var i = 0; i < data["cpu_percent"].length; i++)
            {
            	dps_cpu[data["cpu_percent"].length - i - 1] = {
            		y : data["cpu_percent"][i],
            		label : "CPU Core" + i.toString(),
            		indexLabel : "{y}%"
            	}
            }
            chart_cpu.options.data[0].dataPoints = dps_cpu
            
            //mem
            var dps_mem = [{
            	y : data["mem_used_percent"],
            	label : "Used Mem",
            	indexLabel : "{y}%"
            }]
            chart_mem.options.data[0].dataPoints = dps_mem
            
            console.log(data["mem_total"])
            console.log(data["mem_available"])
            
    		chart_cpu.render()
    		chart_mem.render()
        })
    }
})