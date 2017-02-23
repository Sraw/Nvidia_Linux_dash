/*global $, CanvasJS*/

$(function(){
	var chart_cpu_percent = new CanvasJS.Chart("cpu_percent",{
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
	
	var chart_cpu_temperature = new CanvasJS.Chart("cpu_temperature",{
		title :{
			text: "CPU Temperature"
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
	
	var chart_gpu = new CanvasJS.Chart("gpu_usage",{
		title : {
			text: "Gpu Usage"
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
        	console.log(data)
        	//cpu_percent
        	var cpu_percent = data["cpu_info"]["cpu_percent"]
        	var dps_cpu_percent = new Array(cpu_percent.length)
            for(var i = 0; i < cpu_percent.length; i++)
            {
            	dps_cpu_percent[cpu_percent.length - i - 1] = {
            		y : cpu_percent[i],
            		label : "CPU Core" + i.toString(),
            		indexLabel : "{y}%"
            	}
            }
            chart_cpu_percent.options.data[0].dataPoints = dps_cpu_percent
            
            //cpu_temperature
            var cpu_temperature = data["cpu_info"]["cpu_temperature"]
            var dps_cpu_temperature = new Array(cpu_temperature.length)
            for(var i = 0; i < cpu_temperature.length; i++)
            {
            	dps_cpu_temperature[cpu_temperature.length - i - 1] = {
            		y : cpu_temperature[i],
            		label : "Physical CPU Core" + i.toString(),
            		indexLabel : "{y}%"
            	}
            }
            chart_cpu_temperature.options.data[0].dataPoints = dps_cpu_temperature
            
            //mem
            var mem_used_percent = data["mem_info"]["mem_used_percent"]
            var mem_total  = data["mem_info"]["mem_total"]
            var mem_available  = data["mem_info"]["mem_available"]
            var dps_mem = [{
            	y : mem_used_percent,
            	label : "Used Mem",
            	indexLabel : "{y}%"
            }]
            chart_mem.options.data[0].dataPoints = dps_mem
    		
    		//gpu
    		var name = data["gpu_info"]["name"]
    		var driver_version = data["gpu_info"]["driver_version"]
    		var temperature = data["gpu_info"]["temperature"]
    		var usage = data["gpu_info"]["utilization"]
    		var mem_total = data["gpu_info"]["mem_total"]
    		var mem_used_percent = data["gpu_info"]["mem_used_percent"]
    		var dps_gpu = [{
            	y : usage,
            	label : "GPU Used",
            	indexLabel : "{y}%"
            }]
            chart_gpu.options.data[0].dataPoints = dps_gpu
            
            
            chart_cpu_percent.render()
    		chart_cpu_temperature.render()
    		chart_mem.render()
    		chart_gpu.render()
        })
    }
})