README.md

## Four Freedoms

#### Quick Start

```bash
  > npm run dev:all    # for development runs server and client  
  > npm run build      # for production

# Debug client: 
  > npm run dev + Launch Chrome localhost
# Debug server: 
  > Launch from UI: Script dev:all 

Open browser: http://localhost:3000  # (it may take 30 sec. to load)

# To kill running processes: 
  > lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

  > git add .
  > git commit -m "fix file upload"
  > git tag -a v0.1.xx-alpha -m "test version v0.1.xx-alpha"   # also update package.json
  > git push -u origin master --tags

  > fly auth login     # once per session
  > fly deploy         # to push new code to fly site
  > fly logs           # view console logs    


```

### Development Setup

This project is running in .devcontainer Node.js & Typescript:
  - Docker container: FourFreedoms friendly-leakey 
  - .devcontainer: Linux (WSL2), Next.js 15.2.3, Node.js 22.12 & Typescript, Python 3.11.2, Linux: Debian GNU 12 (bookworm)
  - Firebase: fourfreedoms-db1

- Client is Next.js on port 3000: out/index.html
- Server is Node.js on port 3001: server/index.js

Repo: https://github.com/captainshin90/Four-Freedoms

### Production:

  https://fourfreedoms-polished-butterfly-4117.fly.dev/
  https://fourfreedoms-polished-butterfly-4117.fly.dev:3001/api/health

xxx Deploy: https://fourfreedoms.netlify.app/ - server doesn't run
xxx Deploy: https://fourfreedoms.fly.dev/ 

Admin URL: https://fly.io/apps/

### Development

- To build: 
```bash
# wait to connect to .devcontainer
node ➜ /workspaces/FourFreedoms (master) $ 

  > npm run dev:all    # for development   
  > npm run build      # for production

Open browser: http://localhost:3000  - (it may take 30 sec. to load)

# To debug: select "Run & Debug" and script:
# make sure there are no processes running on 3000 and 3001
  > npm run dev
# Launch Chrome localhost
# Launch Script dev:all  # runs both npm run:server and npm run:dev

# To kill running processes: 
  > lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Github repo: https://github.com/captainshin90/Four-Freedoms
  > git init
  > git remote add origin https://github.com/captainshin90/Four-Freedoms.git
  > git config --global --add safe.directory /workspaces/FourFreedoms

# To commit changes:
  > git add .
  > git commit -m "Describe code change"
  > git push origin master

# To set new code version, example:
  > git tag -a "v.1.0-alpha" -m "version v0.1.0-beta"

```
### Deployment to Fly.io

https://fly.io/docs/getting-started/launch-demo

https://fly.io/docs/flyctl/install/

Windows: 
```bash
# 1. Install the Fly CLI:
(done) curl -L https://fly.io/install.sh | sh

# Manually add the directory to your $HOME/.bash_profile (or similar)
#  export FLYCTL_INSTALL="/home/node/.fly"
#  export PATH="$FLYCTL_INSTALL/bin:$PATH"
# Run '/home/node/.fly/bin/flyctl --help' to get started

# 2. Login to Fly:
(done) fly auth login

# 3. Create a new app:
(done) fly launch

# Fly will generate a fly.toml
# see https://fly.io/docs/reference/configuration/

# 4. Set up environment variables:
# Generate a secure API token (from .devcontainer Linux)
(done) openssl rand -hex 32

# Set it in Fly.io
(done) fly secrets set API_TOKEN=019b93b18f8bd685cd86748c7df009997e112c459c417320ab8e4ffb386e228e 

# (done) run: fly secrets set for all sensitive KEYS in .env or from Fly console (easier)
# non-sensitive keys (e.g. PORT, API_PORT) defined in fly.toml
(done) fly secrets set <API_KEY>=

# 5. Create a volume for genereal files:
(done) fly volumes create general_data --size 1

# 6. Deploy the application:
# Deploy to Fly.io (this will automatically build both frontend and backend)
(done) fly deploy

# 7. View console logs:
fly logs

```


### Deployment to Netlify (only static site)
- Automatically deployed to Netlify: fourfreedoms.netlify.app
- Check Netlify for build and deploy status: 
- 3/24/25: currently site is disabled

### Installs and Audits
- 3/19/25: npm install @google/generative-ai
- 3/19/25: npm install firebase-admin
- 3/22/25: npm install react-markdown
- 3/23/25: npm install -D tailwindcss postcss autoprefixer
- 3/23/25: npm install -D @tailwindcss/postcss
- 3/23/25: npm uninstall @tailwindcss/postcss
- 3/23/25: npm audit fix --force
- 3/23/25: npm install --save-dev ts-node tsconfig-paths

### Repo Versions 
- 3/23/25: git tag -a "v0.1.0-alpha" -m "version v0.1.0-beta"
- 3/23/25: git tag -a "v0.1.1-alpha" -m "version v0.1.1-alpha" - Next.js upgrade
- 3/24/25: git tag -a "v0.1.3-alpha" -m "version v0.1.3-alpha" - updated fly.toml, dockerfile 
- 3/25/25: git tag -a "v0.1.4-alpha" -m "version v0.1.4-alpha" - sort of works 
- 3/26/25: git tag -a "v0.1.5-alpha" -m "version v0.1.5-alpha" - sort of works 
- 3/26/25: git tag -a "v0.2.0-alpha" -m "version v0.2.0-alpha" - works on fly.dev 


### Deploys
- 3/18/25: Netlify
- 3/23/25: Netlify
- 3/23/25: Fly.io
- 3/24/25: Fly.io - success https://fourfreedoms-polished-butterfly-4117.fly.dev/
- 3/25/25: Fly deploy 
- 3/26/25: Fly deploy
- 3/26/25: fly ips allocate-v4 --shared 
 
```bash
Created app 'fourfreedoms-polished-butterfly-4117' in organization 'personal'
Admin URL: https://fly.io/apps/fourfreedoms-polished-butterfly-4117
Hostname: fourfreedoms-polished-butterfly-4117.fly.dev
Run `fly tokens create deploy -x 999999h` to create a token and set it as the FLY_API_TOKEN secret in your GitHub repository settings
See https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions
installing: npm install @flydotio/dockerfile@latest --save-dev
added 37 packages, and audited 974 packages in 11s
243 packages are looking for funding
  run `npm fund` for details
15 vulnerabilities (13 moderate, 2 high)
To address issues that do not require attention, run:
  npm audit fix
To address all issues (including breaking changes), run:
  npm audit fix --force
Run `npm audit` for details.
     create  Dockerfile
(node:1960) ExperimentalWarning: globSync is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

WARNING The app is not listening on the expected address and will not be reachable by fly-proxy.
You can fix this by configuring your app to listen on the following addresses:
  - 0.0.0.0:3000
```
