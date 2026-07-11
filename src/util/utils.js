export function isEmpty(val) {
    return val === undefined || val === null || String(val).trim() === '';
}

export function isEmptyArray(arr) {
    return !arr || !Array.isArray(arr) || arr.length === 0;
}

export const arrayUtils = {
    findIndexByKey: (array, keyName, value) => {
        if (!array) return -1;
        return array.findIndex(item => item && item[keyName] == value);
    }
};

export function getViewPortHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
}

export function getPageQuery() {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const query = {};
    for (const [key, value] of params.entries()) {
        query[key] = value;
    }
    return query;
}