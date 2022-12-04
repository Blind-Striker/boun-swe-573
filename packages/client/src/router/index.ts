import TokenService from "@/services/token.service";
import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import VaultRoutes from "./routes";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: "home",
    path: VaultRoutes.HOME.path,
    component: HomeView,
    meta: VaultRoutes.HOME.meta,
  },
  {
    name: "signin",
    path: VaultRoutes.SIGNIN.path,
    component: VaultRoutes.loadView("SignInView"),
    meta: VaultRoutes.SIGNIN.meta,
  },
  {
    name: "signup",
    path: VaultRoutes.SIGNUP.path,
    component: VaultRoutes.loadView("SignUpView"),
    meta: VaultRoutes.SIGNUP.meta,
  },
  {
    name: "about",
    path: VaultRoutes.ABOUT.path,
    component: VaultRoutes.loadView("AboutView"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to: Route, from: Route, next) => {
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some(
    (record) => record.meta.onlyWhenLoggedOut
  );

  const loggedIn = !!TokenService.getToken();

  if (!isPublic && !loggedIn) {
    return next({
      path: VaultRoutes.SIGNIN.path,
      query: { redirect: to.fullPath },
    });
  }

  if (loggedIn && onlyWhenLoggedOut) {
    return next(VaultRoutes.HOME.path);
  }

  next();
});

export default router;
