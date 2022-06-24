import { AuthContext } from "../../context/context/AuthContext"
import { useContext } from "react"

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if(!context) {
    throw Error('useAuthContext phải được sử dụng bên trong AuthContextProvider')
  }

  return context
}