import axios from 'axios';
import { makeAutoObservable } from 'mobx';

import { API_URL } from '../http';
import { IUser } from '../interfaces/IUser';
import { IAuthResponse } from '../interfaces/response/AuthResponse';
import { AuthService } from '../services/AuthService';

export class Store {
  user = {} as IUser;

  isAuth: boolean = false;

  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(isAuth: boolean) {
    this.isAuth = isAuth;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password);
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setIsLoading(true);
    try {
      const response = await axios.get<IAuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
      console.log(response);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.response?.data?.message);
    } finally {
      this.setIsLoading(false);
    }
  }
}
