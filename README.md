README.md

### Four Freedoms

- This project is running in .devcontainer Node.js & Typescript:
  - Docker container: FourFreedoms friendly-leakey 
  - .devcontainer: Linux (WSL2), Next.js 13.5.1, Node.js 22.12 & Typescript, Python 3.11.2, Linux: Debian GNU 12 (bookworm)
  - Firebase: fourfreedoms-db1

- To build: 
  > npm run dev:all    # for development   
  > npm run build      # for production

- Open browser: http://localhost:3000  - (it may take 30 sec. to load)

- To debug: select "Run & Debug" and script:
  - make sure there are no processes running on 3000 and 3001
  - npm run dev
  - Launch Chrome localhost

  - Run Script dev:all  # runs both npm run:server and npm run:dev

- To kill running processes:
  > lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

- Github repo: https://github.com/captainshin90/Four-Freedoms
  > git init
  > git remote add origin https://github.com/captainshin90/Four-Freedoms.git
  > git config --global --add safe.directory /workspaces/FourFreedoms

- To commit changes:
  > git add .
  > git commit -m "Describe code change"
  > git push origin master

- Deployed to Netlify: fourfreedoms.netlify.app
   
