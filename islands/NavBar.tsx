import NavAuth from "./NavAuth.tsx";
import { NavAuthLoggedIn } from "./NavAuth.tsx";

export default function NavBar({loggedIn}: {loggedIn: boolean}) {
  return (
    <div class="flex flex-row">
      <a href="/">
        <div class="inline-flex">
          <div class="text-black bg-white px-0.5 py-0 text-lg">Art</div>
          <div class="text-white bg-rainred px-0.5 py-0 text-lg">Rain</div>
          <div class="text-white bg-black px-0.5 py-0 text-lg">Tea</div>
        </div>
      </a>
      <div class="flex-auto"/>
      { loggedIn ? <NavAuthLoggedIn/> : <NavAuth/> }
    </div>
  );
}
