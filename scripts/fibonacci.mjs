const AUTH_API_URL = 'http://localhost:3069/graphql';

const LOGIN_MUTATION = `
    mutation Login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
            id
        }
    }
`

const JOBS_API_URL = 'http://localhost:3042/graphql';
const JOBS_MUTATION = `
    mutation ExecuteJob($executeJobInput: ExecuteJobInput!) {
        executeJob(executeJobInput: $executeJobInput) {
            name
        }
    }
`

async function login(email,password){
    const response = await fetch(AUTH_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: LOGIN_MUTATION,
            variables: {
                loginInput: {
                    email,
                    password
                }
            }
        }),
    });
    const data = await response.json();
    const cookies = response.headers.get('set-cookie');
    return {data,cookies}
}

async function executeJob(executeJobInput,cookies){
    const response = await fetch(JOBS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies
        },
        body: JSON.stringify({
            query: JOBS_MUTATION,
            variables: {
                executeJobInput
            }
        }),
    });
    const data = await response.json();
    return data;
}

(async ()=>{
    const {data,cookies} = await login('adytestare@gmail.com','T3st12345!');
    if(data.data.login.id){
        const n = 15;
        console.log(`Calculating fibonacci(${n})`);	
        const executeJobInput ={
            name: 'Fibonacci',
            data: Array.from({length: n}, () => ({
                iterations: Math.floor(Math.random() * 5000) +1,
            }))
        }
       const data =  await executeJob(executeJobInput,cookies);
       console.log(data);
    }else {
        console.error('Login failed');	
    }
})();