import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {LoadingScreen} from "../components/LoadingScreen";

const LoadingContext = createContext();

export const LoadingProvider = ({children}) => {
    const [loadingCount, setLoadingCount] = useState(false);

    const showLoader = useCallback(() => {
        setLoadingCount(prevCount => prevCount + 1);
    }, []);

    const hideLoader = useCallback(() => {
        setLoadingCount(prevCount => Math.max(0, prevCount - 1)); // Prevent going below 0
    }, []);
    

    const value = useMemo(() => ({
        // The loader is active if the count is greater than 0
        isLoading: loadingCount > 0,
        showLoader,
        hideLoader,
    }), [loadingCount, showLoader, hideLoader]);

    return (
        <LoadingContext.Provider value={value}>
            {children}
            <LoadingScreen/>
        </LoadingContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => useContext(LoadingContext);