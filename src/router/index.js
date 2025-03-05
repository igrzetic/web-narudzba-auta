import { createApp } from "vue";
import { Quasar } from "quasar";
import App from "../App.vue";
import router from "./routes";

const app = createApp(App);
app.use(Quasar);
app.use(router);

export default router;
