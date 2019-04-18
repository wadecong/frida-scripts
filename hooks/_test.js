// Process.enumerateModules({
//     onMatch: function(module) {
//         console.log(
//             "name: " + module.name + "\n" + 
//             "base: " + module.base + "\n" + 
//             "size: " + module.size + "\n" + 
//             "path: " + module.path + "\n"
//         );
//     }, 
//     onComplete: function(){}
// });

// Module.enumerateImports("AuthKit", {
//     onMatch: function(imp) {
//         console.log(
//             "type: " + imp.type + "\n" + 
//             "name: " + imp.name + "\n" + 
//             "module: " + imp.module + "\n" + 
//             "address: " + imp.address + "\n" + 
//             "slot: " + imp.slot + "\n"
//         );
//     },
//     onComplete: function() {}
// });
// Module.enumerateImports("", callbacks)

// for (var func in ObjC.api) {
//     console.log(func)
// }

// for (var cls in ObjC.classes) {
//     console.log(cls)
// }



var resolver = new ApiResolver("objc");
var queries = [
    // "*[AKAppleIDSession *]", 
    // "*[AKAnisetteProvisioningController *]", 
    // "*[AKAbsintheSigner *]",
    // "*[ACDTCCUtilities *]",
    // "*[ACDAccountStoreFilter *]",
    "-[NSDictionary objectForKeyedSubscript:]",
];

var queries_for_sleep = [
    // "-[NSMutableURLRequest* ak_addAbsintheHeader]",
];

for (var i in queries) {
    resolver.enumerateMatches(queries[i], {
        onMatch: function (match) {
            Interceptor.attach(match.address, {
                onEnter: function (args) {
                    console.log(match.name + ": " + ObjC.Object(args[2]));
                },
                onLeave: function (retval) { }
            });
        },
        onComplete: function () {
        }
    });
}

for (var i in queries_for_sleep) {
    resolver.enumerateMatches(queries_for_sleep[i], {
        onMatch: function (match) {
            console.log(match.name);
            Interceptor.attach(match.address, {
                onEnter: function (args) {
                    console.log(match.name + ": ");
                    ObjC.classes.NSThread.sleepForTimeInterval_(15);
                },
                onLeave: function (retval) { }
            });
        },
        onComplete: function () {
        }
    });
}