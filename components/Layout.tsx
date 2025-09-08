import NavBar from "../islands/NavBar.tsx";
import { HomePageMessage } from "../routes/index.tsx";
import { Data } from "utils";
import { ComponentChildren } from "preact/src/index.d.ts";
import Notification from "../islands/Notification.tsx";

type LayoutProps = {
    children: ComponentChildren;
    data: Data;
}

export default function Layout({ children, data }: LayoutProps) {
    const loggedIn = data.loggedIn;
    const name = data.name;
    return (
        <div>
            <div class="px-4 py-8 mx-auto bg-[#86efac]">
                <NavBar loggedIn={loggedIn} />
                <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center py-4">
                    <h1 class="text-4xl font-bold"> {!loggedIn ? "Welcome" : `Welcome back, ${name}`} </h1>
                    <HomePageMessage {...data}/>
                </div>
            </div>
            <main>{children}</main>
            <Notification {...data}/> 
        </div>
    );
}