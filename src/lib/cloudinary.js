export const cld = (url, width) =>
  url?.includes("res.cloudinary.com") && url.includes("/upload/")
    ? url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`)
    : url;