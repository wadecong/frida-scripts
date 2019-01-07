import frida
import sys
import os 
import json
from optparse import OptionParser

def on_message(message, data):
    try:
        if message:
            print("[*] {0}".format(message["payload"]))
    except Exception as e:
        print(message)
        print(e)

def get_enabled_hooks():
    configs = ["enabled_hooks_local.json", "enabled_hooks.json"]
    for config_file_name in configs:
        if os.path.exists(config_file_name):
            with open(config_file_name, "r") as f:
                content = f.read()
            config = json.loads(content)
            return config["hooks"]
    return []

if __name__ == '__main__':
    try:
        path = "hooks"
        parser = OptionParser(usage="usage: %prog [options] <process_to_hook>",version="%prog 1.0")
        parser.add_option("-A", "--attach", action="store_true", default=False,help="Attach to a running process")
        parser.add_option("-S", "--spawn", action="store_true", default=False,help="Spawn a new process and attach")
        parser.add_option("-P", "--pid", action="store_true", default=False,help="Attach to a pid process")

        (options, args) = parser.parse_args()
        if (options.spawn):
            print ("[*] Spawning "+ str(args[0]))
            pid = frida.get_usb_device().spawn([args[0]])
            session = frida.get_usb_device().attach(pid) 
        elif (options.attach):
            print ("[*] Attaching to process "+str(args[0]))
            session = frida.get_usb_device().attach(str(args[0]))
        elif (options.pid):
            print ("[*] Attaching to PID "+str(args[0]))
            session = frida.get_usb_device().attach(str(args[0]))
        else:
            print ("Error")
            print ("[X] Option not selected. View --help option.")
            sys.exit(0)

        enabled_hooks = get_enabled_hooks()
        for filename in os.listdir(path):
            if filename in enabled_hooks:
                print("[*] Parsing hook: "+filename)
                hook = open(path+os.sep+filename, "r")
                script = session.create_script(hook.read())
                script.on('message', on_message)
                script.load()
        sys.stdin.read()
    except KeyboardInterrupt:
        sys.exit(0)
