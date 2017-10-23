<h1>React App Skeleton</h1>
<h4>Purpose:</h4>
<span>To enable easy start-up for projects</span>
<br/>
<h4>Features:</h4>
<ul>
    <li>React (create-react-app)</li>
    <li>Express</li>
    <li>Redux</li>
    <li>Redux-Thunk</li>
    <li>Bulma.io</li>
    <li>Passport login authentication (email, facebook)</li>
    <li>MLab Connection</li>
    <li>React-Router-Dom (v4.x)</li>
</ul>
<br/>
<h4>To Start:</h4>
<p>Update config/index.json file with dbUri, jwtSecret, and FB Ids (optional)</p>
<p>Create a .env file at the project root, and use this file to store any API keys and secrets (IMPORTANT: Ensure you have a .gitignore file set up so that it doesn't sync to Github)</p>
<p>For development:</p>
<ul>
    <li>npm start // begins the Express server</li>
    <li>npm run client // starts the create-react-app development server with hot reload</li>
</ul>