import { C, F, M } from "../shared/theme";
import { supabase } from "../supabaseClient";

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
      <div style={{ background: "#fff", borderRadius: 14, padding: "40px 48px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", textAlign: "center", maxWidth: 400, width: "100%" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${C.a}, ${C.p})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: C.t, marginBottom: 4 }}>AgencyOS</div>
        <div style={{ fontSize: 11, color: C.t3, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 32 }}>Command Center</div>

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
