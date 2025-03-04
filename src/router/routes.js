import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "layouts/MainLayout.vue";
import LoginPage from "pages/LoginPage.vue";
import NarudzbePage from "pages/NarudzbePage.vue";
import VozilaPage from "pages/VozilaPage.vue";
import KupciPage from "pages/KupciPage.vue";
import RacuniPage from "pages/RacuniPage.vue";
import DjelatniciPage from "pages/DjelatniciPage.vue";

const routes = [
  // {
  //   path: "/login",
  //   component: LoginPage,
  // },
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "narudzbe", component: NarudzbePage },
      { path: "vozila", component: VozilaPage },
      { path: "kupci", component: KupciPage },
      { path: "racuni", component: RacuniPage },
      { path: "djelatnici", component: DjelatniciPage },
      { path: "login", component: LoginPage },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
