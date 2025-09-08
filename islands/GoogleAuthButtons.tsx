export function GoogleSignInButton() {
    return (
        <div>
            <div id="g_id_onload"
                data-client_id={Deno.env.get("GOOGLE_CLIENT_ID")}
                data-context="signin"
                data-ux_mode="popup"
                data-login_uri="/api/auth/google"
                data-auto_prompt="false">
            </div>

            <div class="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
            </div>
        </div>
    );
}
// not sure if these need to be distinct or if just the sign in button works for both the login and registration page
export function GoogleSignUpButton() {
    return (
        <div>
            <div id="g_id_onload"
                data-client_id={Deno.env.get("GOOGLE_CLIENT_ID")}
                data-context="signup"
                data-ux_mode="popup"
                data-login_uri="/api/auth/google"
                data-auto_prompt="false">
            </div>

            <div class="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
            </div>
        </div>
    );
}