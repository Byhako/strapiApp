import qs from "qs"

const BASE_URL = "http://localhost:1337/api"

export const STRAPI_BASE_URL = "http://localhost:1337"

const QUERY_HOME_PAGE = {
  populate: {
    sections: {
      on: {
        "layout.hero-section": {
        populate: {
          imagen: {
            fields: ["url", "alternativeText"]
          },
          link: {
            populate: true
          }
        }
        }
      }
    }
  }
}

export const getHomePageData = async () => {
  'use cache'
  const query = qs.stringify(QUERY_HOME_PAGE, {
    indices: false,
    strictNullHandling: true,
  })
  const response = await getStrapiData(`home-page?${query}`)

  return response?.data
}


export const getStrapiData = async (url: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const registerUser = async (user: object) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const loginUser = async (user: object) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
