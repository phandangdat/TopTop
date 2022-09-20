const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

// send mail
const sendMail = {
  sendEmailActive: (to, url, txt) => {
    oauth2Client.setCredentials({
      refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
    });

    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: SENDER_EMAIL_ADDRESS,
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: SENDER_EMAIL_ADDRESS,
      to: to,
      subject: 'Toptop verify',
      html: `
          <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: #fe2c55;">Welcome to Toptop.</h2>
          <img
            src="https://res.cloudinary.com/brhtheorist/image/upload/v1662473410/logo/logo_dtknjy.png"
            style="margin: 0 auto;display: block;"
          />
          <p style="font-weight: bold">Xin chào,
          </p>
          <p>
            Bạn nhận được email này vì địa chỉ email này đã được sử dụng trong quá trình đăng ký cho ứng dụng của chúng tôi.
            Chúng tôi yêu cầu bạn xác thực email để đảm bảo rằng địa chỉ email bạn đã nhập là chính xác.
          </p>
          <p>
            Bạn vui lòng click vào đường dẫn dưới đây để tiến hành kích hoạt tài khoản:
          </p>

          <a href=${url}
          style="
            background: #fe2c55;
            border-radius: 4px;
            text-decoration: none;
            color: white;
            padding: 10px 20px;
            margin: 10px auto;
            display: block;
            text-align: center;
            width: 170px;"
          >${txt}</a>

          <p>Nếu nút không hoạt động vì bất kỳ lý do gì, bạn cũng có thể nhấn vào liên kết bên dưới:</p>

          <div>${url}</div>
          </div>
      `,
    };

    smtpTransport.sendMail(mailOptions, (err, infor) => {
      if (err) return err;
      return infor;
    });
  },
  sendEmailForgot: (to, url, txt) => {
    oauth2Client.setCredentials({
      refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
    });

    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: SENDER_EMAIL_ADDRESS,
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: SENDER_EMAIL_ADDRESS,
      to: to,
      subject: 'Toptop verify',
      html: `
          <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: #fe2c55;">Welcome to Toptop.</h2>
          <img
            src="https://res.cloudinary.com/brhtheorist/image/upload/v1662473410/logo/logo_dtknjy.png"
            style="margin: 0 auto;display: block;"
          />
          <p style="font-weight: bold">Xin chào,</p>
          <p>Bạn nhận được email này vì địa chỉ email này đã được sử dụng để đặt lại mật khẩu cho tài khoản của bạn.</p>
          <p>Bạn vui lòng click vào đường dẫn dưới đây để tiến hành đặt lại mật khẩu:</p>

          <a href=${url}
          style="
            background: #fe2c55;
            border-radius: 4px;
            text-decoration: none;
            color: white;
            padding: 10px 20px;
            margin: 10px auto;
            display: block;
            text-align: center;
            width: 170px;"
          >${txt}</a>

          <p>Nếu nút không hoạt động vì bất kỳ lý do gì, bạn cũng có thể nhấn vào liên kết bên dưới:</p>

          <div>${url}</div>
          </div>
      `,
    };

    smtpTransport.sendMail(mailOptions, (err, infor) => {
      if (err) return err;
      return infor;
    });
  },
};

module.exports = sendMail;
