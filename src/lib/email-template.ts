import { EMAIL, PHONE, PHONE_HREF, SITE_NAME, SITE_URL, WHATSAPP_URL } from "@/constants";

/**
 * Single source of truth for outbound transactional email branding.
 * Every Resend email (admin lead notice, customer confirmations,
 * newsletter welcome, etc.) should be built with `renderEmailLayout`
 * so the logo, brand color and social links stay consistent everywhere.
 */

// Verified Resend sending domain — must match a domain verified in the
// Resend dashboard, otherwise delivery to real customer inboxes fails.
export const EMAIL_FROM = `${SITE_NAME} <info@apvmechanics.com.au>`;

export const BRAND_RED = "#ed1c24";

const LOGO_URL = `${SITE_URL}/assets/images/resources/apv-bear-logo-black.png`;
const FACEBOOK_URL = "https://www.facebook.com/Apvmobilemechanics";
const INSTAGRAM_URL = "https://www.instagram.com/apvmechanics/";

/**
 * Wraps a section of email body HTML in the shared branded shell:
 * dark header with logo + tagline, and a footer with social links,
 * phone/email, website, copyright, and (optionally) an unsubscribe link.
 *
 * Pass `unsubscribeEmail` only on marketing/newsletter sends — never on
 * transactional emails (lead notice, order/thank-you confirmations).
 */
export function renderEmailLayout({
  bodyHtml,
  unsubscribeEmail,
}: {
  bodyHtml: string;
  unsubscribeEmail?: string;
}): string {
  const unsubscribeUrl = unsubscribeEmail
    ? `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(unsubscribeEmail)}`
    : null;

  return `
  <div style="background-color:#f4f5f7;padding:32px 12px;font-family:Arial, Helvetica, sans-serif;">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e9ecef;">
      <!-- Header -->
      <div style="background-color:#111111;padding:26px 24px;text-align:center;">
        <img src="${LOGO_URL}" alt="${SITE_NAME}" width="72" height="72" style="display:block;margin:0 auto 10px auto;border-radius:8px;" />
        <div style="color:#ffffff;font-size:19px;font-weight:800;letter-spacing:0.3px;">${SITE_NAME}</div>
        <div style="color:#c9c9c9;font-size:12px;margin-top:2px;">Hobart Mobile Mechanic Services</div>
      </div>

      <!-- Body -->
      <div style="padding:28px 26px;">
        ${bodyHtml}
      </div>

      <!-- Footer -->
      <div style="background-color:#f8f9fa;padding:22px 26px;border-top:1px solid #eeeeee;text-align:center;">
        <div style="margin-bottom:16px;">
          <a href="${FACEBOOK_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 6px;padding:8px 14px;background-color:#ffffff;border:1px solid #e0e0e0;border-radius:20px;color:#333333;font-size:12px;font-weight:700;text-decoration:none;">📘 Facebook</a>
          <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 6px;padding:8px 14px;background-color:#ffffff;border:1px solid #e0e0e0;border-radius:20px;color:#333333;font-size:12px;font-weight:700;text-decoration:none;">📷 Instagram</a>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 6px;padding:8px 14px;background-color:#ffffff;border:1px solid #e0e0e0;border-radius:20px;color:#333333;font-size:12px;font-weight:700;text-decoration:none;">💬 WhatsApp</a>
        </div>
        <p style="margin:0 0 4px 0;font-size:13px;color:#444444;">
          📞 <a href="${PHONE_HREF}" style="color:${BRAND_RED};text-decoration:none;font-weight:700;">${PHONE}</a>
          &nbsp;|&nbsp;
          ✉️ <a href="mailto:${EMAIL}" style="color:${BRAND_RED};text-decoration:none;font-weight:700;">${EMAIL}</a>
        </p>
        <p style="margin:0 0 12px 0;font-size:12px;color:#888888;">
          <a href="${SITE_URL}" style="color:#888888;text-decoration:underline;">${SITE_URL.replace("https://", "")}</a>
          — Coming to your home, office or roadside in Hobart.
        </p>
        <p style="margin:0;font-size:11px;color:#aaaaaa;">
          © ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.${unsubscribeUrl ? ` &nbsp;·&nbsp; <a href="${unsubscribeUrl}" style="color:#aaaaaa;text-decoration:underline;">Unsubscribe</a>` : ""}
        </p>
      </div>
    </div>
  </div>
  `;
}
