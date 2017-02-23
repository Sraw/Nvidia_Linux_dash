import psutil
import subprocess
import pprint
import tornado.ioloop
import tornado.web
import os
import json
import re



def fixed_float(value, decimal):
    _str = "{0:.%sf}" % (decimal)
    result = float(_str.format(value))
    return result

def convert2g(value, mode):
    args = {
        "M" : 1,
        "K" : 2,
        "B" : 3
    }
    result = value / (1024 ** args[mode])
    result = fixed_float(result, 2)
    return result

def get_cpu_info():
    temperatures = psutil.sensors_temperatures()
    cpu_percent = psutil.cpu_percent(None, True)
    cpu_temperature = temperatures['coretemp'][1:]
    result = {
        "cpu_percent" : cpu_percent,
        "cpu_temperature" : list()
    }
    for i in cpu_temperature:
        result["cpu_temperature"].append([i.label, i.current])
    return result
    
def get_mem_info():
    mem = psutil.virtual_memory()
    mem_total = mem.total
    mem_available = mem.available
    mem_used_percentage = fixed_float(((mem_total - mem_available) / mem_total) * 100, 2)
    mem_total = convert2g(mem_total, 'B')
    mem_available = convert2g(mem_available, 'B')
    return {
        "mem_used_percent" : mem_used_percentage,
        "mem_total" : mem_total,
        "mem_available" : mem_available
    }
    
def get_gpu_info():
    sp = subprocess.Popen(['nvidia-smi', '--query-gpu=name,driver_version,temperature.gpu,utilization.gpu,memory.total,memory.free,memory.used','--format=csv'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out_str = sp.communicate()[0].decode()
    out_list = out_str.split('\n')
    values = out_list[1].split(',')
    
    mem_total = float(re.sub(r'[^\d.]','',values[4]))
    mem_used = float(re.sub(r'[^\d.]','',values[6]))
    mem_used_percent = convert2g(mem_used / mem_total, 'M')
    gpu_dict = {
         "name" : values[0],
         "driver_version" : re.sub(r'[^\d.]','',values[1]),
         "temperature" : re.sub(r'[^\d.]','',values[2]),
         "utilization" : re.sub(r'[^\d.]','',values[3]),
         "mem_total"  : mem_total,
         "mem_used_percent" : mem_used_percent
    }
    return gpu_dict
    
def exists_in_path(cmd):
  # can't search the path if a directory is specified
    assert not os.path.dirname(cmd)

    extensions = os.environ.get("PATHEXT", "").split(os.pathsep)
    for directory in os.environ.get("PATH", "").split(os.pathsep):
        base = os.path.join(directory, cmd)
        options = [base] + [(base + ext) for ext in extensions]
        for filename in options:
            if os.path.exists(filename):
                return True
    return False

class MainHandler(tornado.web.RequestHandler):
    def initialize(self):
        pass
    
    def get(self):
        self.render('index.html', title = "Nvidia-Linux-dash")
        
    def post(self):
        cpu_info = get_cpu_info()
        mem_info = get_mem_info()
        if exists_in_path("nvidia-smi"):
            gpu_info = get_gpu_info()
        
        self.set_header("content-type","application/json")
        jsobj = {
            "cpu_info" : cpu_info,
            "mem_info" : mem_info
        }
        if gpu_info:
            jsobj["gpu_info"] = gpu_info
        self.write(json.dumps(jsobj))
        self.finish()

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static")
}
app = tornado.web.Application([
    (r"/", MainHandler),
    (r"/sys_info", MainHandler)
], **settings)

app.listen(7777)

tornado.ioloop.IOLoop.current().start()