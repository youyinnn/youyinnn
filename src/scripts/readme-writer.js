const fs = require("fs");
const path = require("path");
const ax = require("./axios-helper").ax;
const readmePath = path.join(__dirname, "..", "..", "README.md");

const content = [];
const htmlparser2 = require("htmlparser2");
const repoNameList = [];

function fetch(url) {
  ax.get(
    url,
    {},
    {
      isAuth: true,
      success: (response) => {
        getRepoNameList(response.data);
        const nextPageBtnDom = nextPageBtn(response.data);
        if (nextPageBtnDom !== undefined) {
          console.log(nextPageBtnDom.attribs.href);
          fetch(nextPageBtnDom.attribs.href);
        } else {
          afterFetch();
        }
      },
    }
  );
}

function getRepoNameList(data) {
  const root = htmlparser2.parseDocument(data);
  const repListDom = htmlparser2.DomUtils.find(
    (node) => {
      if (
        node !== undefined &&
        node.attribs !== undefined &&
        node.attribs.itemprop === "name codeRepository"
      )
        return true;
      return false;
    },
    [root],
    true
  );
  for (node of repListDom) {
    repoNameList.push(node.attribs.href.split("/youyinnn/")[1]);
  }
}

function nextPageBtn(data) {
  const root = htmlparser2.parseDocument(data);
  const nextPageBtn = htmlparser2.DomUtils.find(
    (node) => {
      if (
        node !== undefined &&
        node.type === "tag" &&
        node.name === "a" &&
        node.attribs !== undefined &&
        node.attribs.rel !== undefined &&
        node.attribs.href !== undefined &&
        node.attribs.href.endsWith("tab=repositories") &&
        node.children[0].data === "Next"
      )
        return true;
      return false;
    },
    [root],
    true
  );
  return nextPageBtn[0];
}

fetch("https://github.com/youyinnn?tab=repositories");

const languagesBytesMap = new Map();
var totalBytes = 0;
const axios = require("axios").default;

function afterFetch() {
  const allReq = [];
  for (repoName of repoNameList) {
    const languagesUrl = `https://api.github.com/repos/youyinnn/${repoName}/languages`;
    allReq.push(
      axios.get(languagesUrl, {
        headers: {
          Authorization: `bearer 123`,
        },
      })
    );
  }
  Promise.all(allReq)
    .then(function (results) {
      for (result of results) {
        for (let key in result.data) {
          let newCount = Number(result.data[key]);
          totalBytes += newCount;
          let count = languagesBytesMap.get(key);
          if (count === undefined) {
            languagesBytesMap.set(key, newCount);
          } else {
            languagesBytesMap.set(key, newCount + count);
          }
        }
      }
    })
    .then(() => {
      statistic();
    });
}

var languagesBytesPercentageMap = new Map();

function statistic() {
  for (item of languagesBytesMap) {
    languagesBytesPercentageMap.set(item[0], (item[1] / totalBytes) * 100);
  }
  languagesBytesPercentageMap = new Map(
    [...languagesBytesPercentageMap.entries()].sort((a, b) => b[1] - a[1])
  );
  console.log(languagesBytesPercentageMap);
  content.push("Total code volume: " + totalBytes / 1000 + " kb");
  content.push("Language: ");
  for (item of languagesBytesPercentageMap) {
    content.push(`- ${item[0]}: ${item[1].toFixed(4)} %`);
  }
  console.log(content);
  writeReadme();
}

function writeReadme() {
  fs.writeFile(readmePath, content.join("\r\n"), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}
