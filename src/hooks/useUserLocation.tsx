const useUserLocation = () => {
  const getLocation = async (): Promise<string | null> => {
    try {
      if (!("geolocation" in navigator)) {
        console.error("Geolocation is not supported by this browser.");
        return null;
      }
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();
              const location = `${data.address.city}, ${
                data.address.county
              }, ${data.address.country_code.toUpperCase()}`;
              resolve(location);
            } catch (error) {
              console.error("Error fetching location details:", error);
              reject(null);
            }
          },
          (error) => {
            console.error("Error getting geolocation:", error.message);
            resolve("Unknown (Location off)");
          }
        );
      });
    } catch (error) {
      console.error("Unexpected error in getLocation:", error);
      return null;
    }
  };
  return getLocation;
};
export default useUserLocation;

//if location need
// const getLocation = async (): Promise<string | null> => {
//   try {
//     if (!("geolocation" in navigator)) {
//       console.error("Geolocation is not supported by this browser.");
//       return null;
//     }
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           try {
//             const response = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//             );
//             const data = await response.json();
//             const location = `${data.address.city}, ${
//               data.address.county
//             }, ${data.address.country_code.toUpperCase()}`;
//             resolve(location);
//           } catch (error) {
//             console.error("Error fetching location details:", error);
//             reject(null);
//           }
//         },
//         (error) => {
//           console.error("Error getting geolocation:", error.message);
//           resolve("Unknown (Location off)");
//         }
//       );
//     });
//   } catch (error) {
//     console.error("Unexpected error in getLocation:", error);
//     return null;
//   }
// };
