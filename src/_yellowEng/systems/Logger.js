import Input from "./Input";

export function myLog(data, text = "log") {
  if (Input.GetKeyDown("Tab")) {
    console.log(text, data);
  }
}
