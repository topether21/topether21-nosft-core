import { AxiosInstance } from 'axios';
/**
 * @description service to call HTTP request via Axios
 */
declare class ApiService {
    /**
     * @description property to share axios _instance
     */
    _instance: AxiosInstance;
    /**
     * @description initialize vue axios
     */
    constructor(baseURL: string);
    /**
     * @description set the default HTTP request headers
     */
    setHeader(key: string, value: string): void;
    /**
     * @description send the GET HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    query<T>(resource: string, params: any): Promise<T>;
    /**
     * @description send the GET HTTP request
     * @param resource: string
     * @param slug: string
     * @returns Promise<AxiosResponse>
     */
    get<T>(resource: string, slug?: string): Promise<T>;
    /**
     * @description set the POST HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    post<T>(resource: string, params: any): Promise<T>;
    /**
     * @description send the UPDATE HTTP request
     * @param resource: string
     * @param slug: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    update<T>(resource: string, slug: string, params: any): Promise<T>;
    /**
     * @description Send the PUT HTTP request
     * @param resource: string
     * @param params: AxiosRequestConfig
     * @returns Promise<AxiosResponse>
     */
    put<T>(resource: string, params: any): Promise<T>;
    /**
     * @description Send the DELETE HTTP request
     * @param resource: string
     * @returns Promise<AxiosResponse>
     */
    delete(resource: string): Promise<void>;
}
export default ApiService;
