const useUserIP = () => {
  const getUserIP = async (): Promise<string | null> => {
    try {
      const response = await fetch(`https://api4.ipify.org/?format=json`);

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
