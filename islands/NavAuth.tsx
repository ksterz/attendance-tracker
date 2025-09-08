export default function NavAuth() {
  return (
    <div>
      <a href="/login"><div class="flex-none">Login</div></a>
      <a href="/register"><div class="flex-none">Register</div></a>
    </div>
  );
}

export function NavAuthLoggedIn() {
  return (
    <div>
      <a href="/logout"><div class="flex-none">Logout</div></a>
      <a href="/settings"><div class="flex-none">Settings</div></a>
    </div>
  )
}
