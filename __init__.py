import psutil

cpu_percentage = psutil.cpu_percent(0.01, True)

mem = psutil.virtual_memory()

mem_total = mem.total

mem_available = mem.available

mem_used_percentage = float("{0:.2f}".format((mem_total - mem_available) / mem_total))

temperatures = psutil.sensors_temperatures()

print(cpu_percentage)
print(mem_total)
print(mem_available)
print(mem_used_percentage)
print(temperatures)



