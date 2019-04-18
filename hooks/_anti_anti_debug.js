// - sysctl
// - task_get_exception_ports
// - isatty
// - ioctl


var ACDAccountStoreFilter = ObjC.classes.ACDAccountStoreFilter;
var isClientPermitted = ACDAccountStoreFilter['- _isClientPermittedToAccessAccountTypeWithIdentifier:'];
var oldImpl = isClientPermitted.implementation;
isClientPermitted.implementation = ObjC.implement(isClientPermitted, function (handle, selector) {
    console.log("[ACDAccountStoreFilter _isClientPermittedToAccessAccountTypeWithIdentifier:] replaced")
    console.log( '\tBacktrace:\n\t' + Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n\t'));
    return int64(1);
});