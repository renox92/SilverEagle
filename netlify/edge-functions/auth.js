export default async (request, context) => {
  const url = new URL(request.url);
  
  // Look for a session token or cookie
  const hasAuth = context.cookies.get("guild_authenticated");
  if (hasAuth === "true") {
    return; // Pass through to your index.html page
  }

  // If a password was submitted via the box
  if (request.method === "POST") {
    const body = await request.formData();
    const passwordInput = body.get("password");
    
    // FETCH THE PASSWORD VALUE SAFELY FROM NETLIFY ENV SETTINGS
    const actualPassword = Netlify.env.get("GUILD_PASSWORD");

    if (passwordInput === actualPassword) {
      const response = new Response(null, { status: 302 });
      response.headers.set("Location", url.pathname);
      context.cookies.set({ name: "guild_authenticated", value: "true", path: "/" });
      return response;
    }
  }

  // Render a simple, un-styled fallback login screen if not authenticated
  return new Response(
    `<!DOCTYPE html>
     <html>
     <head><title>Dawnforge Restricted Access</title></head>
     <body style="background:#1a1a1a; color:#fff; font-family:sans-serif; text-align:center; padding-top:100px;">
       <h2>Dawnforge Muster Roll Locked</h2>
       <form method="POST">
         <input type="password" name="password" placeholder="Enter Guild Password" style="padding:10px; border-radius:4px; border:none; margin-right:5px;">
         <button type="submit" style="padding:10px 20px; background:#e63946; color:#fff; border:none; border-radius:4px; cursor:pointer;">Enter</button>
       </form>
     </body>
     </html>`,
    { headers: { "content-type": "text/html" } }
  );
};

export const config = { path: "/*" };
