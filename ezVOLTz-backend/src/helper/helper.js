import { errorMessage } from "../config/config.js";

export default async function handleErrorException(res, controllerFunction) {
  try {
    return await controllerFunction();
  } catch (error) {
    errorMessage(res, error);
  }
}
