import React, { FC } from 'react'
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import Upload from './views/Upload';
import List from "./views/List";
import NoMatch from "./views/NoMatch";
import ContextProvider from "./context";
import Nav from "./components/Nav";
import Index from "./views/Index";
import History from "./views/History";


export const App: FC = () => {

    return (
        <ContextProvider>
            <Nav/>

            <main>
                <Router>
                    <Routes>
                        <Route path="/" element={<Index/>}>
                            <Route path="/:file/list" element={<List/>}/>
                            <Route element={<Upload/>} index/>
                            <Route path="/upload" element={<Upload/>}/>
                            <Route path="/history" element={<History/>}/>
                            <Route path="*" element={<NoMatch/>}>
                        </Route>
                        </Route>
                    </Routes>
                </Router>
            </main>

        </ContextProvider>

    );
};