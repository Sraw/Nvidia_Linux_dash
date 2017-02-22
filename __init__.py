import psutil
import subprocess
import pprint
import tornado.ioloop
import tornado.web
import os
import json

def fixed_float(value, decimal):
    _str = "{0:.%sf}" % (decimal)
    result = float(_str.format(value))
    return result

def convert2g(value):
    result = value / 1024 / 1024 / 1024
    result = fixed_float(result, 2)
    return result
    
cpu_percentage = psutil.cpu_percent(0.01, True)

mem = psutil.virtual_memory()

mem_total = mem.total

mem_available = mem.available

mem_used_percentage = float("{0:.2f}".format((mem_total - mem_available) / mem_total))

mem_total = convert2g(mem_total)

mem_available = convert2g(mem_available)

temperatures = psutil.sensors_temperatures()

class MainHandler(tornado.web.RequestHandler):
    def initialize(self):
        pass
    
    def get(self):
        cpu_percentage = psutil.cpu_percent(None, True)
        self.render('index.html', title = "Nvidia-Linux-dash", cpu_percentage = cpu_percentage)
        
    def post(self):
        cpu_percentage = psutil.cpu_percent(None, True)
        self.set_header("content-type","application/json")
        jsobj = {"result" : cpu_percentage}
        self.write(json.dumps(jsobj))
        self.finish()

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static")
}
app = tornado.web.Application([
    (r"/", MainHandler),
    (r"/cpu_percent", MainHandler)
], **settings)

app.listen(8080)

tornado.ioloop.IOLoop.current().start()