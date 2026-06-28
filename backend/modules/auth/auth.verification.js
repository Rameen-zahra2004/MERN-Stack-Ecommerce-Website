export const verificationEmailTemplate = (link) => {
  return `
    <div style="font-family:Arial;padding:20px">
      <h2>Verify Your Email</h2>
      <p>Click below to verify your account:</p>
      <a href="${link}" style="padding:10px 20px;background:#ec4899;color:white;text-decoration:none;border-radius:5px;">
        Verify Email
      </a>
    </div>
  `;
};
