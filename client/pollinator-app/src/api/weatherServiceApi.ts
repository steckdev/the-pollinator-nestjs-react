import axios from "axios";

const BASE_URL = "/api/v1/";

export const weatherServiceApi = {
  async createUser(user: { email?: string; name: string; zip: string }) {
    const response = await axios.post(BASE_URL + "users", user);
    return response.data;
  },
  async getUserById(id: string) {
    const response = await axios.get(BASE_URL + `users/${id}`);
    return response.data;
  },
  async getWeatherByZipCode(zipCode: string) {
    const response = await axios.get(BASE_URL + `weather/${zipCode}`);
    return response.data;
  },
};
