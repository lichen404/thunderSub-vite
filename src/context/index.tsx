import React, {createContext, FC, PropsWithChildren, useState} from "react";


export const Context = createContext<any>({})


const ContextProvider: FC<PropsWithChildren> = ({children}) => {
    const [fileList, setFileList] = useState([])
    const [isSidebarVisible, setIsSidebarVisible] = useState(false)

    return (
        <Context.Provider value={{fileList, setFileList,isSidebarVisible, setIsSidebarVisible}}>
            {children}
        </Context.Provider>
    )
}


export default ContextProvider;
