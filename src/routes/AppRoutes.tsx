import { Route, Routes } from 'react-router-dom';
import {
    PageNotFound,
    Results,
    Participants,
    Home
} from "../containers";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/participants' element={<Participants />} />
            <Route path='/results' element={<Results />} />
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    );
}

export default AppRoutes;
