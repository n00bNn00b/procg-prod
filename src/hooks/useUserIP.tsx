const useUserIP = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const getUserIP = async (): Promise<string | null> => {
    try {
      const response = await fetch(`${VITE_API_URL}/login/get-user-ip-info`);

      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return null;
    }
  };
  return getUserIP;
};
export default useUserIP;
