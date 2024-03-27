


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
        };
    }
}
