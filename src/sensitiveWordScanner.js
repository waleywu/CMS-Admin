import fastScanner from "fastscan-plus";
import axios from "axios";
import _ from "lodash";

class sensitiveWordScanner {
  constructor({ sensitiveWords = [] } = []) {
    if (_.isArray(sensitiveWords)) this.sensitiveWords = sensitiveWords;

    axios.get("/api/configuration/sensitiveWord").then((res) => {
      this.sensitiveWordObject = res.result;
      let sensitiveWords = this.sensitiveWordObject.sensitiveWords.split(",");
      this.scanner = new fastScanner(sensitiveWords, {
        caseSensitivity: false,
        longest: false,
      });
    });
  }

  get info() {
    return this.sensitiveWordObject;
  }

  /**
   * @description 筛查文字
   * @param {string} 需要筛查的文字
   * @returns {function}
   */
  scan = (content) => {
    return this.scanner.search(content);
  };

  addWords = ({ words }) => {
    if (_.isArray(words)) {
      words.map((word) => {
        this.scanner.add(word);
      });
      return;
    }
    if (_.isString(words)) {
      words.split(",").map((word) => {
        this.scanner.add(word);
      });

      return;
    }
  };
}
export default sensitiveWordScanner;
