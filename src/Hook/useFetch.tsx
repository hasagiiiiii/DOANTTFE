import { clearAllCookies } from '../Common/Function/Cookie';
import { Result } from '../Model/root.model';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchOptions {
  method: HttpMethod;
  headers: HeadersInit;
  body?: string;
  credentials?: RequestCredentials;
}

export const fetchData = async (
  url: string,
  method: HttpMethod = 'GET',
  data: any = null,
  headers: HeadersInit = {}
): Promise<any> => {
  try {
    const options: FetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include',
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let a = await response.json();
    console.log('response', await a);
    if (a.result === Result.RESULT_AUTH) {
      window.location.href = '/';
      clearAllCookies();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    return await a;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

fetchData.get = (url: string, headers: HeadersInit = {}): Promise<any> =>
  fetchData(url, 'GET', null, headers);
fetchData.post = (
  url: string,
  data: any,
  headers: HeadersInit = {}
): Promise<any> => fetchData(url, 'POST', data, headers);

// Cách sử dụng
// GET request
// fetchData.get<any>('https://api.example.com/data').then(console.log).catch(console.error);

// POST request
// fetchData.post<any>('https://api.example.com/data', { key: 'value' }).then(console.log).catch(console.error);
export const fetchFormData = async (
  url: string,
  method: HttpMethod = 'GET',
  data: any = null,
  headers: HeadersInit = {}
): Promise<any> => {
  try {
    const options: FetchOptions = {
      method,
      headers: {
        ...headers,
      },
      credentials: 'include',
    };

    if (data && method !== 'GET') {
      options.body = data;
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let a = await response.json();
    console.log('response', await a);
    if (a.result === Result.RESULT_AUTH) {
      window.location.href = '/';
      clearAllCookies();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    return await a;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
