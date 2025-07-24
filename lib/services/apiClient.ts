
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';


class APIClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            timeout: 5000, // 5 secondes timeout
        });

        // Intercepteur pour ajouter automatiquement des headers
        this.client.interceptors.request.use((request) => {
            // Par exemple, ajouter un token si besoin :
            const token = ''; // récupère ici ton token depuis un service ou storage
            if (token) {
                request.headers.Authorization = `Bearer ${token}`;
            }
            return request;
        });

        // Intercepteur de réponse pour logging
        this.client.interceptors.response.use(
            (response) => {
                console.log(`[APIClient] Success [${response.config.method?.toUpperCase()}] ${response.config.url}`);
                return response;
            },
            (error) => {
                console.error(`[APIClient] Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}`, error.message);
                return Promise.reject(error);
            }
        );
    }

    // Méthode GET typée
    async get<T>(url: string, options?: AxiosRequestConfig):Promise<AxiosResponse<T>> {
        const response: AxiosResponse<T> = await this.client.get(url, options);
        return response;
    }

    // Méthode POST typée
    async post<T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        const response: AxiosResponse<T> = await this.client.post(url, data, options);
        return response;
    }

    // Méthode PUT typée
    async put<T>(url: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        const response: AxiosResponse<T> = await this.client.put(url, data, options);
        return response;
    }

    // Méthode DELETE typée
    async delete<T>(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        const response: AxiosResponse<T> = await this.client.delete(url, options);
        return response;
    }
}

export const apiClient = new APIClient();