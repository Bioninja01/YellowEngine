import selfsigned from "selfsigned";
import fs from "fs";
// Setting up api endpoints
var attrs = [
  { name: "commonName", value: "foo" },
  { name: "countryName", value: "bar" },
  { name: "localityName", value: "foo" },
  { name: "stateOrProvinceName", value: "bar" },
  { name: "organizationName", value: "foo" },
  { name: "organizationalUnitName", value: "bar" },
  { name: "emailAddress", value: "foo.bar.com" },
];
const pems = selfsigned.generate(attrs, {
  days: 365,
  keySize: 2048,
  algorithm: "sha256",
  clientCertificate: true,
  // pkcs7: true
});

let keys = Object.keys(pems);
for (let key of keys) {
  fs.writeFileSync(`_${key}.pem`, pems[key]);
}
