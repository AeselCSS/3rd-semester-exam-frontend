import {ReactNode} from "react";
import  Footer from "./Footer"
import Header from "./Header.tsx";
import NavBar from "./NavBar.tsx";


const PageLayout = ({children}:{children: ReactNode}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <NavBar />
            <main className="flex-grow p-4 bg-slate-300">
                {children}
            </main>

            <Footer />

        </div>
    );
}

export default PageLayout;