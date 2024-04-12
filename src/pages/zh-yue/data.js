// import { PronunciationData } from "../types/pronunciation";

const fetchData = async (path) => {
    const response = await fetch(path);
    const data = await response.text();
    return data
      .trimEnd()
      .split("\n")
      .map((line) => line.split("\t"));
  };
  
// export const promiseDataSmall = fetchData(process.env.PUBLIC_URL + "/data/data_small.tsv");
export const promiseDataLarge = fetchData("https://raw.githubusercontent.com/pustot/pustot.github.io/master/public/studling/zh-yue/data_large.tsv");