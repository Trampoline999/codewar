import axios from "axios";

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
};

export const getLanguageName = (language_id) => {
  const language_id_Map = {
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
  };
  return language_id_Map[language_id] || null;
};

export const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": "13b836dfb2msh71587fcecdcaba7p1354e3jsn40687671d238",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },

    data: { submissions },
  };

  try {
    const response = await axios.request(options);
    // console.log("response : ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResult = async (tokens) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: tokens.join(","),
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": "13b836dfb2msh71587fcecdcaba7p1354e3jsn40687671d238",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  try {
    while (true) {
      const response = await axios.request(options);
      // console.log("response result :", response.data.submissions);
      const result = response.data.submissions;
      const isAllDone = result.every(
        (r) => r.status_id !== 1 && r.status_id !== 2
      );

      if (isAllDone) return result;
      sleep(1500);
    }
  } catch (error) {
    console.error(error);
  }
};
