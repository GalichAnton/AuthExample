import React, { useContext, useEffect, useState } from 'react';

import './App.css';
import { observer } from 'mobx-react-lite';

import LoginForm from './components/LoginForm';
import { StoreContext } from './index';
import { IUser } from './interfaces/IUser';
import { UserService } from './services/UserService';

function App() {
  const [users, setUsers] = useState<IUser[]>([]);
  const { store } = useContext(StoreContext);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);

  const getUsers = async () => {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return (
      <>
        {' '}
        <LoginForm /> <button onClick={getUsers}>get users</button>
      </>
    );
  }

  return (
    <div className="App">
      <h1>{store.isAuth ? `User auth ${store.user.email}` : 'User not auth'}</h1>
      <h2>{store.user.isActivated ? 'Account activated' : 'Account not activated'}</h2>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={getUsers}>get users</button>
        {users.map((user) => (
          <div key={user._id}>{user.email}</div>
        ))}
      </div>
    </div>
  );
}

export default observer(App);
