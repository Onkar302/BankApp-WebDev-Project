import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MasterPage from './MasterPage'
import Home from './Home'
import { NumberOfAccounts } from './NumberOfAccounts'
import { PageNotFound } from './PageNotFound'
import { DeleteUser } from './DeleteUser'
import GetRichUsers from './GetRichUsers'
import { LandingPage } from './LandingPage'
import Transaction from './DoTransaction'
import GetPassBook from './GetPassBook'
import Transfer from './transfer'
import Register from './register'
import FindUser from './FindUser'
import GetAllUsers from './getAllAccounts'
import AdminMasterPage from './AdminMasterPage'
//The route path '/' is parent route and other routes are its child
//The child route elements are rendered in parent's outlet tag

export default function BankApp(){


    return (<div>
            <BrowserRouter>
                <Routes>
                    <Route path='/Signup' element={<LandingPage/>}></Route>



                    <Route path='/' element={<MasterPage/>}>
                        <Route index element={<LandingPage/>}/>
                        <Route path='/home' exact={true} element={<Home/>}/>
                        <Route path='/dotransaction' exact={true} element={<Transaction/>}/>
                        <Route path='/passbook' element={<GetPassBook/>}/>
                        <Route path='/transfer' element={<Transfer/>}/>
                        <Route path='*' element={<PageNotFound/>}/>
                    </Route>



                    <Route path='/admin' element={<AdminMasterPage/>}>
                        <Route index element={<LandingPage/>}/>
                        <Route path='/admin/home' exact={true} element={<Home/>}/>
                        <Route path='/admin/dotransaction' exact={true} element={<Transaction/>}/>
                        <Route path='/admin/passbook' element={<GetPassBook/>}/>
                        <Route path='/admin/transfer' element={<Transfer/>}/>
                        <Route path='/admin/numberOfAccounts' element={<NumberOfAccounts/>}/> 
                        <Route path='/admin/findUser' element={<FindUser/>}/>
                        <Route path='/admin/deleteUser' element={<DeleteUser/>}/>
                        <Route path='/admin/getRichUsers' element={<GetRichUsers/>}/>
                        <Route path='/admin/getAllUsers' element={<GetAllUsers/>}/>
                        <Route path='/admin/createUser' element={<Register/>}/>
                        <Route path='*' element={<PageNotFound/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>)
}