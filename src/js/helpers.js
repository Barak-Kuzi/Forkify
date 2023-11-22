import 'regenerator-runtime';
import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAXrequest = async function (url, uploadData = undefined){
    try{
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
    }
    const fetchPro = uploadData ? fetch(url, options) : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const resData = await res.json();

    if (!res.ok) throw new Error(`${resData.message} (${res.status})`);
    return resData;

    }catch (error){
        throw error;
    }
}
