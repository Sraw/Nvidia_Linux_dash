import psutil
import subprocess
import pprint

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

print(cpu_percentage)
print(mem_total)
print(mem_available)
print(mem_used_percentage)
pprint.pprint(temperatures)



sp = subprocess.Popen(['nvidia-smi', '-q'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

out_str = sp.communicate()[0].decode()
out_list = out_str.split('\n')

pprint.pprint(out_list)