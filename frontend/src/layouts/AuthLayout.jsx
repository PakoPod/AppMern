import { Outlet } from "react-router-dom"
// nombre del componente
// <div>AuthLayout</div>
const AuthLayout = () => {
    return (
        <>
            <main className='container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center bg-black'>
                <div className="md:w-2/3 lg:w-2/5">
                    <Outlet />
                </div>
            </main>
        </>
    )
}
export default AuthLayout;