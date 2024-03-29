import Axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import util from "util";
import Const from "../const";
let loadingCount = 0;

global.language = "ko";
global.lanList = ["ko", "en", "ja", "zh"];

const serverUrl =
  Const.serverProtocol + "://" + Const.serverIp + ":" + Const.serverPort;

const makeUrl = (url, params) => {
  var result = serverUrl + url;
  if (params === null) return result;
  params.forEach((param) => {
    result = util.format(result, param);
  });
  return result;
};

const httpExec = (method, url, data) => {
  loadingCount++;
  if (loadingCount === 1)
    global.document.getElementById("loadingSpinner").style.display = "block";

  return new Promise((resolve, reject) => {
    Axios({
      method: method,
      url: url,
      data: data,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // if (
        //   url === serverUrl + httpUrl.login ||
        //   url === serverUrl + httpUrl.logout
        // ) {
        // } else {
        //   if (
        //     (method === 'PUT' || method === 'POST' || method === 'DELETE') &&
        //     response.data.result === 'SUCCESS'
        //   ) {
        //     alert('완료');
        //   }
        // }
        resolve(response.data);
        loadingCount--;
        if (loadingCount === 0)
          global.document.getElementById("loadingSpinner").style.display =
            "none";
      })
      .catch((error) => {
        // console.log(JSON.stringify(error, null, 4));
        if (error.message.includes("401")) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요");
          reactLocalStorage.remove("adminUser");
          global.location.href = "/";
        }
        // if (error.response.data.message === 'E10003') {
        //   if (!isAlertOpened) {
        //     isAlertOpened = true;
        //     alert('장기간 미사용으로 자동 로그아웃 되었습니다.');
        //     global.location.href = '/';
        //   }
        // } else if (error.response.data.data === 'E10003') {
        //   if (!isAlertOpened) {
        //     isAlertOpened = true;
        //     alert('접근 권한이 없습니다. 로그인 해주세요.');
        //     global.location.href = '/';
        //   }
        // }
        // alert(JSON.stringify(error));
        reject(error);
        loadingCount--;
        if (loadingCount === 0)
          global.document.getElementById("loadingSpinner").style.display =
            "none";
      });
  });
};

const httpGet = (url, params, data) => {
  return httpExec("GET", makeUrl(url, params), data);
  // return new Promise((resolve, reject) => {
  //   Axios.get(makeUrl(url, params), data)
  //     .then(response => {
  //       resolve(response.data);
  //     })
  //     .catch(error => {
  //       reject(error);
  //     });
  // });
};

const httpPut = (url, params, data) => {
  return httpExec("PUT", makeUrl(url, params), data);
  // return new Promise((resolve, reject) => {
  //   Axios.put(makeUrl(url, params), data)
  //     .then(response => {
  //       resolve(response.data);
  //     })
  //     .catch(error => {
  //       reject(error);
  //     });
  // });
};

const httpPost = (url, params, data) => {
  return httpExec("POST", makeUrl(url, params), data);
  // return new Promise((resolve, reject) => {
  //   Axios.post(makeUrl(url, params), data)
  //     .then(response => {
  //       resolve(response.data);
  //     })
  //     .catch(error => {
  //       reject(error);
  //     });
  // });
};

const httpDownload = (url, params, data) => {
  // return httpExec('GET', makeUrl(url, params), data);
  return new Promise((resolve, reject) => {
    Axios({
      method: "GET",
      url: makeUrl(url, params),
      data: data,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    })
      .then((response) => {
        var blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        resolve(blob);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const httpUrl = {
  login: "/login",
  logout: "/logout",

  //게시판
  inquiryList: "/inquiry/list?pageSize=%s&pageNum=%s",
  inquiryUpdate: "/inquiry/modify",

  // 배달내역
  deliveryList:
    "/delivery/all/list?frName=%s&frPhone=%s&pageNum=%s&pageSize=%s&riderName=%s",
  deliverySearchList:
    "/delivery/all/list?endDate=%s&frName=%s&frPhone=%s&pageNum=%s&pageSize=%s&riderName=%s&startDate=%s",
  riderDeliveryList:
    "/delivery/rider/list?pageNum=%s&pageSize=%s&riderName=%s&riderPhone=%s&searchMonth=%s",
  staffDeliveryList:
    "/delivery/staff/list?categories=2&categories=3&categories=5&pageNum=%s&pageSize=%s&searchMonth=%s&staffName=%s&staffPhone=%s",

  // 가맹점
  franchiseList: "/fr/list?branchName=%s&frName=%s&pageNum=%s&pageSize=%s",
  updateFranchise: "/fr/update",
  registFranchisePG: "/fr/regist/pg/%s",
  franchiseFeeHistory: "/fr/cash/list?pageNum=%s&pageSize=%s",
  franchiseChargeHistory: "/fr/charge/list?pageNum=%s&pageSize=%s",

  // 라이더
  riderList: "/rider/list?riderName=%s&pageNum=%s&pageSize=%s",

  //바이크
  bikeFixHistoryList: "/bike/maintenance/list?pageNum=%s&pageSize=%s",
  deleteFixList: "/bike/maintenance/delete",
  registFixList: "/bike/maintenance/create",
  updateFixList: "/bike/maintenance/update",

  //공지사항
  noticeList:
    "/notice/list?endDate=%s&pageNum=%s&pageSize=%s&startDate=%s&title=%s&deleted=%s",
  updateNotice: "/notice/update",
  registNotice: "/notice/create",

  // 문의사항
  inquiryList: "/inquiry/list?pageNum=%s&pageSize=%s",
  updateInquiry: "/inquiry/update",

  // 예치금
  depositList:
    "/ncash/deposit/list?pageNum=%s&pageSize=%s&userId=%s&userType=%s",
  depositSend: "/ncash/create",
  depositWithdrawList:
    "/ncash/withdraw/list?pageNum=%s&pageSize=%s&userId=%s&userType=%s",
  depositAllList:
    "/ncash/all/list?category=%s&pageNum=%s&pageSize=%s&userId=%s",
  hoInfo: "/ncash/connect9",
  hoBalance: "/ncash/connect9/balance",

  // 일차감
  ncashDailyList: "/ncash/daily/list?kind=%s&pageNum=%s&pageSize=%s&userId=%s",

  // 정산관리
  NcashFee: "/settlement/ncash/fee/list?pageNum=%s&pageSize=%S",
};

const imageType = ["image/jpeg", "image/png", "image/bmp"];

export {
  serverUrl,
  httpExec,
  makeUrl,
  httpGet,
  httpUrl,
  httpPut,
  httpPost,
  httpDownload,
  imageType,
};
