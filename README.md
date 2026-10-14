# Parth Bargale - Portfolio

Express 5 on Node.js 24 (LTS). One dependency.

    nvm use          # picks Node 24 from .nvmrc
    npm install
    npm run dev      # http://localhost:3000

Production: `npm start`, or `docker build -t portfolio . && docker run -p 3000:3000 portfolio`.

Edit before publishing: links/email in `public/index.html` (search for `your-`), project text, and
the contact handler in `server.js` (currently logs to stdout - connect SES/SNS).
Images are hand-built SVGs in `public/images/`.
