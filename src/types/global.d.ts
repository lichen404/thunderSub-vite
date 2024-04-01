


export {};

declare global {
    interface Window {
        electron: {
            minimizeWindow:()=>void;
            maximizeWindow:()=>void;
            resizeWindow:()=>void;
            closeWindow:()=>void;
            fixedWindow:(isFixed:boolean)=>void;
            onResponse:(channel:any, listener:any)=>void;
            invokeUploadFile:(payload:any)=>Promise<any>;
            invokeDownloadSub:(payload:any)=>Promise<any>;
            invokeOpenExplore:(payload:any)=>Promise<any>;
        };
    }
}
