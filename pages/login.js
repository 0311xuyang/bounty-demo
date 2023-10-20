import { useEffect, useState } from 'react';
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_shO7CXIwP',
  ClientId: '4reeotafjtohq7ki5qolavnr6b'
};

const userPool = new CognitoUserPool(poolData);

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_code, setConfirmCode] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8083/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("OK");
          // 处理从后端API返回的数据
        } else {
          // 处理错误响应
          alert("Error");
        }
      } catch (error) {
        // 处理请求错误
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleRegister = (e) => {
    e.preventDefault();

    userPool.signUp(username, password, [], [], (err, result) => {
      if (err) {
        console.error('Registration failed:', err);
        // 处理注册失败的逻辑，例如显示错误消息
      } else {
        console.log('Registration successful:', result);
        // 处理注册成功后的逻辑，例如重定向到登录页面
      }
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(confirm_code, false, (err, result) => {
      if (err) {
        console.error('Confirm failed:', err);
      } else {
        console.log('Confirm success:', result);
      }
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const authenticationData = {
      Username: username,
      Password: password
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('Login successful:', result);
        // 处理登录成功后的逻辑，例如重定向到其他页面
        var accessToken = result.getAccessToken().getJwtToken();
        console.log(accessToken);
        setToken(accessToken);
      },
      onFailure: (error) => {
        console.error('Login failed:', error);
        // 处理登录失败的逻辑，例如显示错误消息
      }
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <h1>Signup</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Signup</button>
      </form>
      <h1>Confirm</h1>
      <form onSubmit={handleConfirm}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="code" value={confirm_code} onChange={(e) => setConfirmCode(e.target.value)}/>
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}