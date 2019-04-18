var absd_task_port_ptr = null;
var absd_task_port = 0;

function ana_descriptor(base_address) {
    var p_msg = Memory.readPointer(base_address);
    var descriptor_type = Memory.readU8(base_address.add(8).add(3));
    console.log("descriptor_type: " + descriptor_type);
    if (descriptor_type != 1) {
        return;
    }
    var p_msg_size = Memory.readU32(base_address.add(8).add(4));
    var buf = Memory.readByteArray(p_msg, p_msg_size);
    console.log(hexdump(buf, {
        offset: 0,
        length: p_msg_size,
        header: true,
        ansi: true
    }));
}



Interceptor.attach(Module.findExportByName(null, 'mach_msg'), {
    onEnter: function (args) {
        var msg = args[0];
        this.msg_header = msg;

        var remote_port = "0x" + Memory.readU32(msg.add(8)).toString(radix=16);
        // if (absd_task_port == 0 || remote_port != absd_task_port) {
        //     return;
        // }
        this.log_receive = true;

        console.log("===============send===============");
        var size = "0x" + Memory.readU32(msg.add(4)).toString(radix=16);
        var is_complex = false;
        var msgh_bits = Memory.readU32(msg);
        if (msgh_bits > 2147483648) {
            console.log("msg type: complex");
            is_complex = true;
        } else {
            console.log("msg type: simple");
        }
        var local_port = "0x" + Memory.readU32(msg.add(12)).toString(radix=16);

        console.log("message size: " + size);
        console.log("local port: " + local_port);
        console.log("remote port: " + remote_port);
        
        // console.log("msg option: " + uint64(args[1]).toString(radix=2));
        var option = args[1];
        console.log("msg option: " + option.toInt32());

        if (is_complex) {
            var descriptor_cnt = "0x" + Memory.readU32(msg.add(24)).toString(radix=16);
            console.log("body descriptor count: : " + descriptor_cnt);
            // 解析 descriptor
            ana_descriptor(msg.add(28));
        }

        var buf = Memory.readByteArray(msg, 64);
        console.log(hexdump(buf, {
            offset: 0,
            length: 64,
            header: true,
            ansi: true
        }));
        console.log('\tBacktrace:\n\t' +
            Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n\t')
        );
    },
    onLeave: function () {
        if (!this.log_receive) {
            return;
        }
        var msg_header = this.msg_header;
        var msg = msg_header;

        var local_port = "0x" + Memory.readU32(msg.add(12)).toString(radix=16);
        var remote_port = "0x" + Memory.readU32(msg.add(8)).toString(radix=16);

        console.log("===============receive===============");
        var u32_size = Memory.readU32(msg.add(4));
        var size = "0x" + u32_size.toString(radix=16);
        var is_complex = false;
        var msgh_bits = Memory.readU32(msg);
        if (msgh_bits > 2147483648) {
            console.log("msg type: complex");
            is_complex = true;
        } else {
            console.log("msg type: simple");
        }
        var local_port = "0x" + Memory.readU32(msg.add(12)).toString(radix=16);
        var remote_port = "0x" + Memory.readU32(msg.add(8)).toString(radix=16);
        console.log("message size: " + size);
        console.log("local port: " + local_port);
        console.log("remote port: " + remote_port);
        if (is_complex) {
            var descriptor_cnt = "0x" + Memory.readU32(msg.add(24)).toString(radix=16);
            console.log("body descriptor count: : " + descriptor_cnt);
            // 解析 descriptor
            ana_descriptor(msg.add(28));
        } else {
            var msg_size = u32_size-24;
            var buf = Memory.readByteArray(msg.add(24), msg_size);
            console.log(hexdump(buf, {
                offset: 0,
                length: msg_size,
                header: true,
                ansi: true
            }));
        }
        console.log('\tBacktrace:\n\t' +Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n\t'));
    }
});

// Interceptor.attach(Module.findExportByName(null, 'bootstrap_look_up'), {
//     onEnter: function (args) {
//         var service_name = Memory.readCString(args[1]);
//         // if ("com.apple.absd" == service_name) {
//         if ("com.apple.fairplayd.versioned" == service_name) {
//             absd_task_port_ptr = new NativePointer(args[2]);
//         }
//         console.log('service_name: ', Memory.readCString(args[1]));
//     },
//     onLeave: function () {
//         if (absd_task_port_ptr) {
//             absd_task_port = Memory.readInt(absd_task_port_ptr);
//             console.log("task_port: ", absd_task_port.toString(radix=16));
//             absd_task_port_ptr = null;
//         }
//     }
// });