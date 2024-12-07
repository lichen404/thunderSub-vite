import React, {FC, useState} from "react";
import DownloadIcon from "../assets/icons/download.svg";
import LoadingIcon from "../assets/icons/loading.svg";
import ViewIcon from "../assets/icons/view.svg";
import {addData, handleOpenDB, updateData} from "../store";

interface ButtonProps {
    url: string,
    file: any;
    icon?: 'download' | 'loading' | 'view'
}

const ViewButton: FC<ButtonProps> = ({url, file, icon = 'download'}) => {
    const [iconName, setIconName] = useState(icon)
    const [viewPath, setViewPath] = useState(file.path || '')
    const map = {
        download: <DownloadIcon/>,
        loading: <LoadingIcon/>,
        view: <ViewIcon/>
    }
    
    return <button onClick={async () => {

        if (iconName === 'download') {
            setIconName('loading')
            const path = await window.electron.invokeDownloadSub({
                url,
                name: `${file.name}.${file.ext}`
            })
            const db = await handleOpenDB('history', 'movieStore')

            await addData(db, 'movieStore', {
                name: `${file.name}.${file.ext}`,
                path,
                ...file
            }).catch(() => {
                updateData(db, 'movieStore', {
                    name: `${file.name}.${file.ext}`,
                    path,
                    ...file
                })
            })

            setViewPath(path)
            setIconName('view')

        }
        if (iconName === 'view') {
            const result = await window.electron.invokeOpenExplore(viewPath)
            result || setIconName('download')
        }


    }
    }>{map[iconName]}</button>
}

export default ViewButton;