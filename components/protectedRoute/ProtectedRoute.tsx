import {useAuth} from "@/hooks/authContext";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function ProtectedRoute({ children, roles = [] }:{children:any, roles:string[]}) {
    const { user, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token || !user) {
            router.push('/');
        } else if (roles.length > 0 && !roles.includes(user.role.name)) {
            router.push('/unauthorized');
        }
    }, [user, token, roles]);

    if (!token || !user || (roles.length > 0 && !roles.includes(user.role.name))) {
        return <div>Loading...</div>;
    }

    return children;
}