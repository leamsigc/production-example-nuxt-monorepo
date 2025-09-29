import type { User } from 'better-auth'
import mjml2html from 'mjml'

const options = {
  minify: true

}

export const userVerificationTemplate = async (url: string, user: User) => {
  const htmlOutput = await mjml2html(`
      <mjml>
  <mj-head>
    <mj-attributes>
      <mj-all padding="0px"></mj-all>
      <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0 25px" font-size="13px"></mj-text>
      <mj-section background-color="#ffffff"></mj-section>
      <mj-class name="preheader" color="#000000" font-size="11px"></mj-class>
    </mj-attributes>
    <mj-style inline="inline">a { text-decoration: none!important; color: inherit!important; }</mj-style>
  </mj-head>
  <mj-body background-color="#f8f8f8">
    <mj-section>
      <mj-column width="100%">
        <mj-image src="https://my-bussines-manager.vercel.app/img/hero-image-light.jpg" alt="SmallBusinessSocialMediaTools Header" padding="0px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section padding-bottom="20px" padding-top="10px">
      <mj-column>
        <mj-text align="center" padding="10px 25px" font-size="24px" color="#262626"><strong>Welcome to SmallBusinessSocialMediaTools, ${user.name}!</strong></mj-text>
        <mj-text align="center" font-size="16px" font-family="Arial" color="#4a4a4a">
          Thank you for joining SmallBusinessSocialMediaTools, your all-in-one platform for managing social media, Google My Business, and content creation.
          <br />
          To complete your registration and get started, please verify your email address.
        </mj-text>
        <mj-button background-color="#f97316" color="#FFFFFF" href="${url}" align="center" font-family="Arial, sans-serif" padding="20px 0 0 0" font-weight="bold" font-size="16px" border-radius="5px">
          Verify Your Email
        </mj-button>
        <mj-text align="center" color="#4a4a4a" font-size="14px" font-family="Arial, sans-serif" padding-top="40px">
          Best regards, <br /> The SmallBusinessSocialMediaTools Team
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
    `, options)

  return htmlOutput
}

export const userPasswordResetTemplate = async (url: string, user: User) => {
  const htmlOutput = await mjml2html(`
      <mjml>
  <mj-head>
    <mj-attributes>
      <mj-all padding="0px"></mj-all>
      <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0 25px" font-size="13px"></mj-text>
      <mj-section background-color="#ffffff"></mj-section>
      <mj-class name="preheader" color="#000000" font-size="11px"></mj-class>
    </mj-attributes>
    <mj-style inline="inline">a { text-decoration: none!important; color: inherit!important; }</mj-style>
  </mj-head>
  <mj-body background-color="#f8f8f8">
    <mj-section>
      <mj-column width="100%">
        <mj-image src="https://my-bussines-manager.vercel.app/img/hero-image-light.jpg" alt="SmallBusinessSocialMediaTools Header" padding="0px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section padding-bottom="20px" padding-top="10px">
      <mj-column>
        <mj-text align="center" padding="10px 25px" font-size="24px" color="#262626"><strong>Password Reset Request for ${user.name}</strong></mj-text>
        <mj-text align="center" font-size="16px" font-family="Arial" color="#4a4a4a">
          We received a request to reset your password for your SmallBusinessSocialMediaTools account.
          <br />
          If you did not request a password reset, please ignore this email.
        </mj-text>
        <mj-button background-color="#f97316" color="#FFFFFF" href="${url}" align="center" font-family="Arial, sans-serif" padding="20px 0 0 0" font-weight="bold" font-size="16px" border-radius="5px">
          Reset Your Password
        </mj-button>
        <mj-text align="center" color="#4a4a4a" font-size="14px" font-family="Arial, sans-serif" padding-top="40px">
          This link will expire in a few hours.
          <br />
          Best regards, <br /> The SmallBusinessSocialMediaTools Team
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
    `, options)

  return htmlOutput
}

export const newGoogleReviewAlertTemplate = async (businessName: string, reviewContent: string, reviewerName: string, reviewUrl: string) => {
  const htmlOutput = await mjml2html(`
      <mjml>
  <mj-head>
    <mj-attributes>
      <mj-all padding="0px"></mj-all>
      <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0 25px" font-size="13px"></mj-text>
      <mj-section background-color="#ffffff"></mj-section>
      <mj-class name="preheader" color="#000000" font-size="11px"></mj-class>
    </mj-attributes>
    <mj-style inline="inline">a { text-decoration: none!important; color: inherit!important; }</mj-style>
  </mj-head>
  <mj-body background-color="#f8f8f8">
    <mj-section>
      <mj-column width="100%">
        <mj-image src="https://my-bussines-manager.vercel.app/img/hero-image-light.jpg" alt="SmallBusinessSocialMediaTools Header" padding="0px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section padding-bottom="20px" padding-top="10px">
      <mj-column>
        <mj-text align="center" padding="10px 25px" font-size="24px" color="#262626"><strong>New Google Review for ${businessName}!</strong></mj-text>
        <mj-text align="left" font-size="16px" font-family="Arial" color="#4a4a4a">
          You have received a new review on Google My Business for <strong>${businessName}</strong>.
          <br /><br />
          <strong>Reviewer:</strong> ${reviewerName}
          <br />
          <strong>Review:</strong> "${reviewContent}"
          <br /><br />
          You can view and respond to the review by clicking the button below:
        </mj-text>
        <mj-button background-color="#f97316" color="#FFFFFF" href="${reviewUrl}" align="center" font-family="Arial, sans-serif" padding="20px 0 0 0" font-weight="bold" font-size="16px" border-radius="5px">
          View and Respond to Review
        </mj-button>
        <mj-text align="center" color="#4a4a4a" font-size="14px" font-family="Arial, sans-serif" padding-top="40px">
          Best regards, <br /> The SmallBusinessSocialMediaTools Team
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
    `, options)

  return htmlOutput.html
}
