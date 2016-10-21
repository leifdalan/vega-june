import google from 'googleapis';
import config from 'config';

const {
  googleAccessToken,
  googleRefreshToken,
  googleTokenType,
  googleExpiryDate,
  googleClientId,
  googleClientSecret,
  googleCallback,
} = config;

const OAuth2 = google.auth.OAuth2;

export const oauth2Client = new OAuth2(
  googleClientId,
  googleClientSecret,
  googleCallback,
);

oauth2Client.setCredentials({
  access_token: googleAccessToken,
  token_type: googleTokenType,
  expiry_date: googleExpiryDate,
  refresh_token: googleRefreshToken,
});

const youtube = google.youtube({
  auth: oauth2Client,
  version: 'v3',
});

console.error('youtube.auth', youtube._options.auth);

export default youtube;
