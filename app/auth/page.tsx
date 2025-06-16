import { isFirebaseEnabled } from "@/lib/firebase/config"
import LoginPage from "./login-page"

export default function AuthPage() {
  // Always show the login page, even if Firebase is not fully configured
  // This allows for anonymous/guest usage
  return <LoginPage />
}
