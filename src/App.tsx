import {BrowserRouter} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
            <Toaster
                toastOptions={{
                    position: "bottom-right",
                    style: {
                        padding: "20px",
                        fontSize: "1.2rem"
                    },
                    success: {
                        style: {
                            backgroundColor: "#aaf8b0"
                        }
                    },
                    error: {
                        style: {
                            backgroundColor: "#f8a0a0"
                        }
                    }
                }}
            />
        </BrowserRouter>
    );
}

export default App
