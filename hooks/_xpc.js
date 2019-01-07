const xpc_connection_get_name = new NativeFunction(
    Module.findExportByName(null, 'xpc_connection_get_name'), 'pointer', ['pointer'])

function logger(tag) {
    return {
        onEnter: function (args) {
            const xpc_connection_get_name = new NativeFunction(Module.findExportByName(null, 'xpc_connection_get_name'), 'pointer', ['pointer'])
            const conn = ptr(args[0]);
            const name = Memory.readUtf8String(xpc_connection_get_name(conn));
            console.log("xpc_connection_send_message_with_reply " + tag);
            console.log("connection: " + name);
            console.log(new ObjC.Object(args[1]) + '');
        },
        onLeave: function () { }
    }
}

Interceptor.attach(Module.findExportByName(null, 'xpc_connection_send_message_with_reply'), logger('async'))
Interceptor.attach(Module.findExportByName(null, 'xpc_connection_send_message_with_reply_sync'), logger('sync'))