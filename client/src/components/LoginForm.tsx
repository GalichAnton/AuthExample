import React, { FC, useContext, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { StoreContext } from '../index';

const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { store } = useContext(StoreContext);

  return (
    <div>
      <input placeholder={'email'} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder={'password'} type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => store.login(email, password)}>Login</button>
      <button onClick={() => store.registration(email, password)}>Register</button>
    </div>
  );
};

export default observer(LoginForm);
