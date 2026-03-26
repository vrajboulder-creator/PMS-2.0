import { C, F } from "../shared/theme";
import { supabase } from "../supabaseClient";
import BoulderLogo from "../shared/BoulderLogo";

export default function Login() {
  const handleMicrosoftLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "email profile openid",
      },
    });
    if (error) console.error("Login error:", error.message);
  };

  return (
    <div style={{ fontFamily: F, background: C.page, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: "40px 48px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", textAlign: "center", maxWidth: 420, width: "100%" }}>
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
          <BoulderLogo height={38} showSub />
        </div>

        <button
          onClick={handleMicrosoftLogin}
          style={{
            width: "100%", padding: "12px 20px", borderRadius: 8,
            border: `1px solid ${C.b}`, background: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontSize: 14, fontWeight: 600, fontFamily: F, color: C.t,
            transition: "all .15s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = C.s2; e.currentTarget.style.borderColor = C.t3 }}
          onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = C.b }}
        >
          <svg width="20" height="20" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          Sign in with Microsoft
        </button>

        <div style={{ fontSize: 11, color: C.t3, marginTop: 24 }}>
          Secure authentication via Microsoft Azure AD
        </div>
      </div>
    </div>
  );
}
