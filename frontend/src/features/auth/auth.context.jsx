import { createContext, useState, useEffect } from "react"
import { getMe } from "./services/auth.api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [registrationData, setRegistrationData] = useState(null)

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, registrationData, setRegistrationData }}>
            {children}
        </AuthContext.Provider>
    )
}