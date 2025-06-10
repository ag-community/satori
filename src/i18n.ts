import "moment/locale/es"

import * as i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import moment from "moment"
import { initReactI18next } from "react-i18next"
const instance = i18n.createInstance()

instance.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: "en",
})

instance.on("languageChanged", (lng) => {
  if (lng) lng === "us" ? moment.locale("en") : moment.locale("es")
})

export const _i18n = instance
