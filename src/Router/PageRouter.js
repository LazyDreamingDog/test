import {BrowserRouter, Routes, Route} from "react-router-dom";
import DefaultLayout from "../Layout/DefaultLayout";
import CreateDid from "../Components/CreateDID";
import CreateCredential from "../Components/CreateCredential";
import CreateSchema from "../Components/CreateSchema";
import GetDIDDoc from "../Components/GetDIDDoc";
import VerifyCredential from "../Components/verifyCredential";
import CreateVerifyRequest from "../Components/CreateVerifyRequest";
import CreateVerifyRules from "../Components/CreateVerifyRules";

function PageRouter() {

    return(
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<DefaultLayout />}>
                    <Route path={'/create_did'} element={<CreateDid />}/>
                    <Route path={'/create_credential'} element={<CreateCredential />}/>
                    <Route path={'/create_schema'} element={<CreateSchema />}/>
                    <Route path={'/get_did_doc'} element={<GetDIDDoc />}/>
                    <Route path={'/verify_credential'} element={<VerifyCredential/>}/>
                    <Route path={'/create_verify_request'} element={<CreateVerifyRequest/>}/>
                    <Route path={'/create_verify_rules'} element={<CreateVerifyRules/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}


export default PageRouter;

