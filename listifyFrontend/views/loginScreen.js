import { addLoginListeners } from "../controller/loginController";
export {initLoginScreen};

function initLoginScreen(){
    document.querySelector('body').innerHTML = '';
    let loginBox = document.createElement('div');
    loginBox.classList.add('loginWrapper');
    document.querySelector('body').append(loginBox);

    loginBox.innerHTML = `
    <div class="loginBox">
        <div id="g_id_onload"
            data-client_id="334783994184-v63tsepd3hfgg4534l9v74r3nqtv1t6l.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-callback="handleAuth"
            data-auto_select="true"
            data-itp_support="true">
        </div>

        <div class="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left">
        </div>
        <div class="guestLogin">Guest mode</div>
        </div>
        `;

        addLoginListeners();
}