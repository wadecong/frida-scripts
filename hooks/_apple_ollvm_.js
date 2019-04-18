Interceptor.detachAll();

var resolver = new ApiResolver("objc");
var queries = [
    "+[* *]"
];

var f = Module.findExportByName("AuthKit.framework",
    "_KxmB0CKvgWt");
Interceptor.attach(f, {
    onEnter: function (args) {
        console.log("_KxmB0CKvgWt called from:\n" +
            Thread.backtrace(this.context, Backtracer.ACCURATE)
            .map(DebugSymbol.fromAddress).join("\n") + "\n");
    }
});

// for (var i in queries) {
//     resolver.enumerateMatches(queries[i], {
//         onMatch: function (match) {
//             Interceptor.attach(match.address, {
//                 onEnter: function (args) {
//                     console.log(match.name + ": ");
//                 },
//                 onLeave: function (retval) { }
//             });
//         },
//         onComplete: function () {
//         }
//     });
// }